/* Testes de integração com PostgreSQL real (TEST_DATABASE_URL); pulados quando a variável não existe */
const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { Pool } = require("pg");
const { migrate } = require("../src/db/migrate");
const { createDonorRepository } = require("../src/donorRepository");
const { createApp } = require("../src/app");
const { validateDonor, publicName } = require("../src/lib/donorValidation");

const url = process.env.TEST_DATABASE_URL;
let pool;
let app;

test("validação exige tipo ABO/Rh, e-mail e consentimento", () => {
  const { errors } = validateDonor({ name: "Ana Souza", email: "ana@", blood: "Z+", consent: undefined });
  assert.deepEqual(Object.keys(errors).sort(), ["blood", "consent", "email"]);
  assert.deepEqual(validateDonor({ name: "Ana Souza", email: "ana@x.com", blood: "o-", consent: "on" }).errors, {});
});

test("nome público mostra só primeiro nome e inicial", () => {
  assert.equal(publicName("Maria da Silva Santos"), "Maria S.");
  assert.equal(publicName("Pedro"), "Pedro");
});

describeDb();

/* Registra os testes que dependem do banco */
function describeDb() {
  const opts = { skip: url ? false : "defina TEST_DATABASE_URL para rodar" };
  before(async () => {
    if (!url) return;
    pool = new Pool({ connectionString: url });
    await pool.query("DROP TABLE IF EXISTS donors");
    await pool.query("CREATE TABLE donors (id SERIAL PRIMARY KEY, name TEXT, email TEXT, blood TEXT)");
    await pool.query("INSERT INTO donors (name, email, blood) VALUES ('Legado Sem Consentimento', 'legado@x.com', 'A+')");
    await migrate(pool);
    await migrate(pool);
    app = createApp({ donors: createDonorRepository(pool) });
  });
  after(async () => pool && pool.end());
  beforeEach(async () => pool && pool.query("DELETE FROM donors WHERE consent_at IS NOT NULL"));

  test("migration é idempotente e esconde registros legados sem consentimento", opts, async () => {
    const res = await request(app).get("/").expect(200);
    assert.doesNotMatch(res.text, /Legado/);
    assert.match(res.text, /Ainda não há doadores/);
  });

  test("cadastro válido redireciona (303) e mostra nome minimizado", opts, async () => {
    const res = await request(app).post("/").type("form")
      .send({ name: "Joana Pereira Lima", email: "Joana@Ex.com", blood: "O-", consent: "on" }).expect(303);
    assert.equal(res.headers.location, "/?status=ok#doadores");
    const page = await request(app).get("/?status=ok").expect(200);
    assert.match(page.text, /Joana L\./);
    assert.doesNotMatch(page.text, /Pereira/);
    assert.doesNotMatch(page.text, /joana@ex\.com/);
  });

  test("e-mail repetido (maiúsculas diferentes) não duplica", opts, async () => {
    const body = { name: "Rui Alves", email: "rui@ex.com", blood: "B+", consent: "on" };
    await request(app).post("/").type("form").send(body).expect(303);
    const res = await request(app).post("/").type("form").send({ ...body, email: "RUI@EX.COM" }).expect(303);
    assert.equal(res.headers.location, "/?status=existente#doadores");
    const { rows } = await pool.query("SELECT count(*)::int AS n FROM donors WHERE consent_at IS NOT NULL");
    assert.equal(rows[0].n, 1);
  });

  test("sem consentimento responde 422 e não grava", opts, async () => {
    const res = await request(app).post("/").type("form").send({ name: "Sem Aceite", email: "s@ex.com", blood: "A+" }).expect(422);
    assert.match(res.text, /autorize o uso/);
    const health = await request(app).get("/health").expect(200);
    assert.equal(health.body.donors, 0);
  });

  test("banco indisponível responde 503 com página amigável", opts, async () => {
    const broken = createApp({ donors: { latest: async () => { throw new Error("down"); }, countByBlood: async () => [] } });
    const res = await request(broken).get("/").expect(503);
    assert.match(res.text, /indisponível/);
  });
}
/* Fim de app.test.js */
