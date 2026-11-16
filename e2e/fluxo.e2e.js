/* Fluxo principal no navegador: entrar na lista só com teclado, com axe em cada tela */
const { test, expect } = require("@playwright/test");
const { default: AxeBuilder } = require("@axe-core/playwright");

/* Dados fictícios e únicos por execução (o banco do CI guarda entre os testes) */
const id = Date.now().toString(36);
const primeiroNome = `Doadora${id}`;
const email = `doadora.${id}@empresa.test`;

/* axe sem violações nas regras WCAG A e AA */
async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
}

/* Contorno do elemento com foco, para conferir o foco visível */
async function contornoDoFoco(page) {
  return page.locator(":focus").evaluate((el) => {
    const c = getComputedStyle(el);
    return `${c.outlineWidth} ${c.outlineStyle}`;
  });
}

test("entra na lista só com teclado e aparece com o nome minimizado", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A sua doação importa" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quem pode doar" })).toBeVisible();
  await semViolacoes(page);

  /* O primeiro Tab chega ao botão, com foco visível; Enter abre o formulário e leva o foco ao nome */
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveAttribute("id", "toggle-form");
  expect(await contornoDoFoco(page)).toBe("3px solid");
  await page.keyboard.press("Enter");
  await expect(page.locator("#toggle-form")).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByLabel("Nome completo", { exact: true })).toBeFocused();
  await semViolacoes(page);

  /* Preenche com o teclado e envia sem o consentimento: o erro aparece e o foco vai para a caixa */
  await page.keyboard.type(`${primeiroNome} Exemplo Teste`);
  await page.keyboard.press("Tab");
  await page.keyboard.type(email);
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Tipo sanguíneo", { exact: true })).toBeFocused();
  await page.keyboard.type("O");
  await expect(page.getByLabel("Tipo sanguíneo", { exact: true })).toHaveValue("O+");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Quero ajudar" }).last()).toBeFocused();
  await page.keyboard.press("Enter");
  const consentimento = page.locator("#consent");
  await expect(consentimento).toBeFocused();
  await expect(consentimento).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#erro-consent")).toHaveText(/autorize o uso dos seus dados/);
  await semViolacoes(page);

  /* Espaço marca o consentimento; Enter no botão envia */
  await page.keyboard.press("Space");
  await expect(consentimento).toBeChecked();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\?status=ok#doadores$/);
  await expect(page.getByRole("status")).toContainText("Cadastro feito");
  const lista = page.locator("ul.donors");
  await expect(lista).toContainText(`${primeiroNome} T.`);
  await expect(page.locator("body")).not.toContainText("Exemplo Teste");
  await expect(page.locator("body")).not.toContainText(email);
  await expect(page.getByRole("table", { name: "Quantidade de doadores por tipo sanguíneo" })).toContainText("O+");
  await semViolacoes(page);
});

test("o mesmo e-mail não duplica o cadastro", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Quero ajudar" }).first().click();
  await page.getByLabel("Nome completo", { exact: true }).fill(`${primeiroNome} Repetida`);
  await page.getByLabel("E-mail", { exact: true }).fill(email.toUpperCase());
  await page.getByLabel("Tipo sanguíneo", { exact: true }).selectOption("A-");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Quero ajudar" }).last().click();
  await expect(page).toHaveURL(/\?status=(existente|ok)#doadores$/);
  /* Se este teste rodar sozinho, o primeiro envio cria; o segundo precisa dizer que já existe */
  if (page.url().includes("status=ok")) {
    await page.getByRole("button", { name: "Quero ajudar" }).first().click();
    await page.getByLabel("Nome completo", { exact: true }).fill(`${primeiroNome} Repetida`);
    await page.getByLabel("E-mail", { exact: true }).fill(email);
    await page.getByLabel("Tipo sanguíneo", { exact: true }).selectOption("A-");
    await page.locator("#consent").check();
    await page.getByRole("button", { name: "Quero ajudar" }).last().click();
  }
  await expect(page.getByRole("status")).toContainText("Este e-mail já está na lista");
  await semViolacoes(page);
});

test("endereço inexistente mostra a página 404 própria", async ({ page }) => {
  const resposta = await page.goto("/nao-existe");
  expect(resposta.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar ao início" })).toBeVisible();
  await semViolacoes(page);
});
/* Fim de fluxo.e2e.js */
