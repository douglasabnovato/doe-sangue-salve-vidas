/* Ponto de entrada: conecta ao PostgreSQL (ou usa memória com --memoria), aplica migrations e sobe o servidor */
const { Pool } = require("pg");
const config = require("./config");
const { migrate } = require("./db/migrate");
const { createDonorRepository } = require("./donorRepository");
const { createMemoryDonorRepository } = require("./memoryDonorRepository");
const { createApp } = require("./app");

/* Inicializa as dependências na ordem correta */
async function main() {
  if (config.memory) {
    console.warn("Modo demonstração: doadores só em memória, apagados ao parar o servidor.");
    const app = createApp({ donors: createMemoryDonorRepository(), trustProxy: config.trustProxy });
    app.listen(config.port, () => console.log(`Doe Sangue (memória) em http://localhost:${config.port}`));
    return;
  }
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
