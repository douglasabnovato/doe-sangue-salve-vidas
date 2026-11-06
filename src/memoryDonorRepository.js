/* Repositório em memória para rodar a demonstração sem PostgreSQL (npm run demo); some ao parar o servidor */
const { publicName } = require("./lib/donorValidation");

/* Cria o repositório com a mesma interface do PostgreSQL */
function createMemoryDonorRepository() {
  const donors = [];
  return {
    /* Últimos doadores, do mais novo para o mais antigo, com nome minimizado */
    async latest(limit = 8) {
      return donors.slice(-limit).reverse().map((d) => ({ name: publicName(d.name), blood: d.blood }));
    },
    /* Contagem por tipo sanguíneo, em ordem alfabética do tipo */
    async countByBlood() {
      const totals = new Map();
      for (const d of donors) totals.set(d.blood, (totals.get(d.blood) || 0) + 1);
      return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([blood, total]) => ({ blood, total }));
    },
    /* Insere; devolve false se o e-mail (sem diferença de maiúsculas) já existir */
    async create({ name, email, blood }) {
      const key = String(email).toLowerCase();
      if (donors.some((d) => d.email === key)) return false;
      donors.push({ name, email: key, blood });
      return true;
    },
    /* Total de doadores */
    async count() {
      return donors.length;
    },
  };
}

module.exports = { createMemoryDonorRepository };
/* Fim de memoryDonorRepository.js */
