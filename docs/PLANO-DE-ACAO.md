# Plano de ação — Doe Sangue! Salve Vidas!

Timebox: 45 min (ciclo completo).

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Consentimento + minimização (D1) | Alto | Baixo | ✅ |
| Must | Credenciais por `DATABASE_URL` (D2) | Alto | Baixo | ✅ |
| Must | Migrations (D3) | Alto | Baixo | ✅ |
| Must | Validação ABO/Rh, e-mail, unicidade (D4) | Médio | Baixo | ✅ |
| Should | Estados de erro/sucesso, 404/503 (D5) | Médio | Baixo | ✅ |
| Should | Acessibilidade (D6) | Médio | Baixo | ✅ axe 0 |
| Should | Números com fonte (D7) | Médio | Baixo | ✅ |
| Could | Remoção self-service dos dados | Médio | Médio | Próximo ciclo |
| Could | Lembrete de próxima doação | Alto | Médio | Próximo ciclo |

## Ciclo de 03/11/2026

> Executado em 06/11/2026. Branch `feature/2026-11-06` → `developer/sprint-2026-11-12` → `master`. Nível: Estudo (N1); critérios 5 e 7 não se aplicam.

### Produto

**Problema e público.** Pessoas dispostas a doar sangue se cadastram, com consentimento, numa lista de voluntários que mostra só o primeiro nome, a inicial e o tipo sanguíneo. É um estudo de Node com PostgreSQL.

**Hipótese e meta.** Cadastrar-se com consentimento em menos de 1 minuto. Sem medição (N1).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Tipo sanguíneo, num contexto de saúde, cai no regime de dado sensível: consentimento específico e destacado | Confirma o consentimento separado que já existe. O caminho de saída hoje é "escreva para o responsável"; virou a #12, para a pessoa sair da lista sozinha | [Confidata: dados sensíveis na LGPD](https://confidata.com.br/blog/dados-sensiveis-lgpd-bases-legais-cuidados), [Migalhas: LGPD na saúde](https://www.migalhas.com.br/depeso/392150/lgpd-na-saude), [Unicamp: dados sensíveis de saúde](https://privacidade.unicamp.br/arquivo/uploads/apresentacao-20230809-o-tratamento-de-dados-pessoais-sensiveis-referentes-a-saude) |
| Requisitos básicos citados em 2026: 16 a 69 anos, pelo menos 50 kg, intervalo de 2 meses (homens) e 3 meses (mulheres) | Virou a #13: seção "Quem pode doar", com link para a fonte oficial conferida na data do PR, porque as regras mudam por portaria | [TJDFT: doação de sangue](https://www.tjdft.jus.br/informacoes/programas-projetos-e-acoes/pro-vida/dicas-de-saude/pilulas-de-saude/doacao-de-sangue), [Brasil 61: quantas vezes doar](https://brasil61.com/noticias/minuto-da-saude-qual-e-a-quantidade-de-vezes-que-se-pode-doar-sangue-especialista-explica-pdoa170064) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Testes de integração rodando de fato no CI (PostgreSQL 16) | Alto | Baixo | Este ciclo |
| 2 | Modo demonstração em memória (`npm run demo`) | Alto | Baixo | Este ciclo |
| 3 | Percorrer o fluxo no navegador, com teclado e Lighthouse | Alto | Baixo | Este ciclo |
| 4 | Régua N1 e critério 10 pela decisão 3 no `MVP.md` | Alto | Baixo | Este ciclo |
| 5 | Ver o cadastro com PostgreSQL real no navegador | Médio | Baixo | Responsável (#10) |
| 6 | `docker-compose.yml` | Médio | Baixo | Issue (#11) |
| 7 | Sair da lista sem ajuda | Médio | Médio | Issue (#12) |
| 8 | Quem pode doar, com fonte | Médio | Baixo | Issue (#13) |
| 9 | Proteger a `master` | Alto | Baixo | Responsável (#14) |
| 10 | Tirar os arquivos antigos da raiz | Baixo | Baixo | Issue (#15) |
| 11 | Publicar ou não no Render | Baixo | Médio | Responsável (#16) |

**Fora do escopo.** Agenda de doação, contas, lembrete de próxima doação.

### Engenharia

**Arquitetura.** Express com Nunjucks (`src/app.js`), repositório PostgreSQL com consultas parametrizadas (`src/donorRepository.js`) e migrations idempotentes (`src/db/migrate.js`). Novo: `src/memoryDonorRepository.js`, com a mesma interface, usado quando o servidor sobe com `--memoria`.

**Riscos.**
- Antes deste ciclo, o CI não definia `TEST_DATABASE_URL`, e os 4 testes de integração eram pulados sem aviso. Corrigido com um serviço PostgreSQL no workflow.
- O modo demonstração guarda dados só na memória; quem usar precisa saber que somem ao parar (o servidor avisa no console).
- Sem proteção na `master`, um push direto entra sem CI (#14).

**Qualidade.**
- Testes: 9 (2 de validação, 3 novos que rodam sempre: página de erro 503, fluxo em memória e repositório em memória; 4 de integração, agora no CI).
- Acessibilidade: Lighthouse 100 em `localhost` (modo demonstração); cadastro feito só com teclado; sem rolagem horizontal em 375 px.
- Segurança: nenhum dado pessoal novo; os nomes do teste são fictícios.

**Definição de pronto.** `npm ci` e `npm test` verdes no CI com PostgreSQL; `MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. CI com PostgreSQL e gatilhos em `developer/**`.
2. Modo demonstração em memória, com testes.
3. Fluxo percorrido no navegador (teclado, Lighthouse, 375 px).
4. `MVP.md` pela régua N1; README com estado e próximos passos.

**Vira issue.** #10, #14, #16 (responsável); #11, #12, #13, #15 (agente).

## Ciclo de 16/11/2026

> Branch `feature/2026-11-16` → `developer/sprint-2026-11-12` (o PR #20 para a `master` segue aberto) → `master`. Nível: Estudo (N1); critérios 5 e 7 não se aplicam.

### Produto

**Problema e público.** Pessoas dispostas a doar sangue entram, com consentimento, numa lista que mostra só o primeiro nome, a inicial e o tipo sanguíneo. É um estudo de Node com PostgreSQL.

**Hipótese e meta.** Acreditamos que uma página única com consentimento claro faz a pessoa entrar na lista em menos de 1 minuto. Saberemos quando o teste de ponta a ponta no navegador concluir o cadastro só com teclado e o nome minimizado aparecer na lista, no CI, com PostgreSQL real.

**O que a análise achou.**
- O `docs/MVP.md` marcava os critérios 3 e 8 como "Atende" com um teste manual de 06/11/2026. A régua pede Playwright no CI e axe dentro dele. Os dois passam a "Parcial" até o teste existir.
- O critério 9 citava um `npm audit` de 02/11/2026. Os alertas do Dependabot estão desligados (API 403), então o `npm audit --omit=dev` é a única fonte e precisa rodar no CI.
- A captura de tela do README (`assets/tela-da-aplicacao.jpg`) mostra nomes completos com tipo sanguíneo, que é dado de saúde. Ela sai da árvore neste ciclo; o histórico é decisão do responsável.
- O histórico também guarda um exemplo de `INSERT` com nome e e-mail de terceiro no README antigo (removido em 28/09/2026) e a senha local antiga do PostgreSQL no `server.js` da raiz.
- O limite de envios (5 por minuto) responde com texto em inglês, sem página própria. É uma falha sem tratamento.
- O `ci/github-actions-ci.yml` não é lido pelo GitHub, mas tem o passo de `npm audit` que o workflow ativo não tem.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Requisitos básicos do Ministério da Saúde: 16 a 69 anos (menores com autorização), pelo menos 50 kg, documento com foto, estar alimentado e descansado | Seção "Quem pode doar" na página, com link para a fonte e data da consulta (#13). Não citamos intervalo entre doações: a página oficial não traz e a portaria de 2026 mudou prazos | [Ministério da Saúde: doação de sangue](https://www.gov.br/saude/pt-br/composicao/saes/sangue), consultada em 16/11/2026 |
| O Playwright recomenda o `@axe-core/playwright` para achar problemas de acessibilidade dentro do teste de ponta a ponta | Teste `e2e` com axe na página inicial, no formulário aberto, com erros e depois do cadastro | [Playwright: accessibility testing](https://playwright.dev/docs/accessibility-testing) |
| O `express-rate-limit` aceita um `handler` próprio para a resposta 429 | Página de erro em português para o limite de envios, com teste | [express-rate-limit: handler](https://express-rate-limit.mintlify.app/reference/configuration#handler) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Tirar da árvore a captura com nomes e tipos sanguíneos | Alto | Baixo | Este ciclo |
| 2 | `npm audit --omit=dev` no CI e patch do `pg` | Alto | Baixo | Este ciclo |
| 3 | Teste Playwright do cadastro com axe, no CI, com PostgreSQL real | Alto | Médio | Este ciclo |
| 4 | Página própria para o limite de envios (429) | Médio | Baixo | Este ciclo |
| 5 | Remover o servidor, a página e o CI antigos da raiz (#15) | Médio | Baixo | Este ciclo |
| 6 | "Quem pode doar", com fonte oficial (#13) | Médio | Baixo | Este ciclo |
| 7 | Exigir o job `e2e` no ruleset da `master` | Alto | Baixo | Responsável (issue nova) |
| 8 | Decidir sobre o histórico com dados pessoais | Alto | Médio | Responsável (issue nova) |
| 9 | Ligar os alertas do Dependabot | Médio | Baixo | Responsável (issue nova) |
| 10 | Express 5 e `express-rate-limit` 8 | Médio | Médio | Issue nova |
| 11 | Sair da lista sem ajuda (#12), `docker-compose` (#11), publicação (#16) | Médio | Médio | Issues existentes |

**Fora do escopo.** Agenda de doação, contas, lembrete de próxima doação, troca de versão maior de dependências.

### Engenharia

**Arquitetura.** Express com Nunjucks (`src/app.js`), repositório injetado (PostgreSQL em `src/donorRepository.js`, memória em `src/memoryDonorRepository.js`) e migrations idempotentes. O teste novo sobe o servidor de verdade pelo `webServer` do Playwright: com `E2E_DATABASE_URL`, usa o PostgreSQL; sem ela, o modo demonstração.

**Riscos.**
- O limite de 5 envios por minuto vale também no teste de ponta a ponta: o teste faz no máximo 2 envios.
- Sem `required_status_checks` para o `e2e`, o ruleset deixa mesclar com esse job vermelho (issue nova).
- O app não tem tema escuro próprio (não há `prefers-color-scheme` no CSS): o axe roda só no claro.

**Qualidade.**
- Testes: os 9 de `node --test` seguem; entram o teste da página 429, o da seção "Quem pode doar" e o teste Playwright com axe e teclado.
- Segurança: `npm audit --omit=dev` como passo do CI; nenhum dado pessoal novo (nomes e e-mails fictícios em `@empresa.test`).

**Definição de pronto.** Jobs `raiz` e `e2e` verdes no PR; `MVP.md` com uma tabela só e evidência com comando, data e resultado; README com "Estado e próximos passos".

### Plano de ação

**Este ciclo executa.** Itens 1 a 6 do backlog, `MVP.md`, README e `DEPLOY.md`.

**Vira issue.** Itens 7 a 10 (novos); #10, #11, #12 e #16 seguem abertas.
