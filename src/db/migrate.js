/* Migrations idempotentes do PostgreSQL (tabela donors com consentimento LGPD) */
const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS donors (
     id SERIAL PRIMARY KEY,
     name TEXT,
     email TEXT,
     blood TEXT
   )`,
  `ALTER TABLE donors ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ`,
  `ALTER TABLE donors ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now()`,
  `CREATE UNIQUE INDEX IF NOT EXISTS donors_email_unique ON donors (lower(email)) WHERE consent_at IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS donors_recent ON donors (created_at DESC) WHERE consent_at IS NOT NULL`,
];

/* Aplica todas as migrations em uma transação */
async function migrate(pool) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const sql of MIGRATIONS) await client.query(sql);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { migrate };
/* Fim de migrate.js */
