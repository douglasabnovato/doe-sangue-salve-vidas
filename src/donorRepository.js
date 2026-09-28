/* Acesso a dados dos doadores no PostgreSQL (consultas parametrizadas) */
const { publicName } = require("./lib/donorValidation");

/* Cria o repositório sobre um pg.Pool */
function createDonorRepository(pool) {
  return {
    /* Últimos doadores com consentimento, já com nome minimizado */
    async latest(limit = 8) {
      const { rows } = await pool.query(
        "SELECT name, blood FROM donors WHERE consent_at IS NOT NULL ORDER BY created_at DESC, id DESC LIMIT $1",
        [limit]
      );
      return rows.map((r) => ({ name: publicName(r.name), blood: r.blood }));
    },
    /* Contagem por tipo sanguíneo (dado agregado, sem identificação) */
    async countByBlood() {
      const { rows } = await pool.query(
        "SELECT blood, count(*)::int AS total FROM donors WHERE consent_at IS NOT NULL GROUP BY blood ORDER BY blood"
      );
      return rows;
    },
    /* Insere; devolve false se o e-mail já estiver cadastrado */
    async create({ name, email, blood }) {
      const { rowCount } = await pool.query(
        "INSERT INTO donors (name, email, blood, consent_at) VALUES ($1, $2, $3, now()) ON CONFLICT DO NOTHING",
        [name, email, blood]
      );
      return rowCount === 1;
    },
    /* Total de doadores ativos (métrica do produto) */
    async count() {
      const { rows } = await pool.query("SELECT count(*)::int AS total FROM donors WHERE consent_at IS NOT NULL");
      return rows[0].total;
    },
  };
}

module.exports = { createDonorRepository };
/* Fim de donorRepository.js */
