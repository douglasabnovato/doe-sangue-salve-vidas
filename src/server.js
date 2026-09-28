/* Ponto de entrada: conecta ao PostgreSQL, aplica migrations e sobe o servidor */
const { Pool } = require("pg");
const config = require("./config");
const { migrate } = require("./db/migrate");
const { createDonorRepository } = require("./donorRepository");
const { createApp } = require("./app");

/* Inicializa as dependências na ordem correta */
async function main() {
  const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: true } : undefined,
    max: 5,
  });
  await migrate(pool);
  const app = createApp({ donors: createDonorRepository(pool), trustProxy: config.trustProxy });
  app.listen(config.port, () => console.log(`Doe Sangue em http://localhost:${config.port}`));
}

main().catch((err) => {
  console.error("Falha ao iniciar:", err.message);
  process.exit(1);
});
/* Fim de server.js */
