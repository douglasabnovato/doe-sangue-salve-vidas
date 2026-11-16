/* Teste de ponta a ponta no navegador: sobe o servidor real (PostgreSQL com E2E_DATABASE_URL, senão memória) */
const { defineConfig, devices } = require("@playwright/test");

const PORT = process.env.E2E_PORT || "3210";
const databaseUrl = process.env.E2E_DATABASE_URL;

module.exports = defineConfig({
  testDir: "e2e",
  testMatch: /.*\.e2e\.js$/,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: databaseUrl ? "node src/server.js" : "node src/server.js --memoria",
    env: { PORT, ...(databaseUrl ? { DATABASE_URL: databaseUrl } : {}) },
    url: `http://localhost:${PORT}/health`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
/* Fim de playwright.config.js */
