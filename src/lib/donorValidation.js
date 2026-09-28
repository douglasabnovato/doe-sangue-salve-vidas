/* Validação do cadastro de doador (tipos sanguíneos ABO/Rh, e-mail e consentimento LGPD art. 11) */
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Normaliza e valida o formulário; devolve { value, errors } */
function validateDonor(input = {}) {
  const value = {
    name: String(input.name ?? "").trim().replace(/\s+/g, " "),
    email: String(input.email ?? "").trim().toLowerCase(),
    blood: String(input.blood ?? "").trim().toUpperCase(),
    consent: input.consent === "on" || input.consent === true,
  };
  const errors = {};
  if (value.name.length < 3 || value.name.length > 80) errors.name = "Informe seu nome (3 a 80 caracteres).";
  if (!EMAIL.test(value.email) || value.email.length > 120) errors.email = "Informe um e-mail válido.";
  if (!BLOOD_TYPES.includes(value.blood)) errors.blood = "Escolha um tipo sanguíneo da lista.";
  if (!value.consent) errors.consent = "Para entrar na lista, autorize o uso dos seus dados.";
  return { value, errors };
}

/* Exibe só o primeiro nome e a inicial do último (minimização de dados) */
function publicName(fullName) {
  const parts = String(fullName).trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

module.exports = { validateDonor, publicName, BLOOD_TYPES };
/* Fim de donorValidation.js */
