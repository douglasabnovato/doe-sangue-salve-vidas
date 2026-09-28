/* Configuração lida do ambiente (12-Factor III) */
module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || "postgres://postgres@localhost:5432/doe",
  databaseSsl: process.env.DATABASE_SSL === "1",
  trustProxy: process.env.TRUST_PROXY === "1",
};
/* Fim de config.js */
