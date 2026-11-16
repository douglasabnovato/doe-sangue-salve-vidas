# MVP — doe-sangue-salve-vidas

> Criado em 02/11/2026. Revisado em 16/11/2026 (e às 15h27, critério 9 com os alertas do Dependabot ligados) contra a régua de `engenharia/arquitetura/padroes.md`. Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 são "Não se aplica (N1)" e saem da conta.

**Resumo:** 9 de 10 aplicáveis atendidos

**Finalizado:** sim — pela decisão 4 do processo: o único critério fora de "Atende" (9) depende do responsável pela decisão sobre os dados no histórico e tem issue com `depende-do-responsavel` (#22).

## 1. Critérios em 16/11/2026

CI de referência: run [43800634377](https://github.com/douglasabnovato/doe-sangue-salve-vidas/actions/runs/43800634377) do PR #21, no commit `d6353b0` (o último com código; depois dele só entram docs), jobs `raiz` e `e2e` verdes.

| # | Critério | Situação | Evidência (comando, data, resultado) | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | README, seção "Problema e proposta" (16/11/2026): pessoas dispostas a doar entram, com consentimento, numa lista que mostra só o primeiro nome, a inicial e o tipo | — |
| 2 | Hipótese a validar | Atende | Seção 2, com meta e "saberemos quando" (16/11/2026) | — |
| 3 | Fluxo principal completo | Atende | `npm run test:e2e` no job `e2e` do run 43800634377, 16/11/2026: 3 passed. O Playwright sobe `src/server.js` com PostgreSQL 16, conclui o cadastro só com teclado e vê o nome minimizado na lista (`e2e/fluxo.e2e.js`) | #10 (ver no computador local) |
| 4 | Escopo enxuto | Atende | Seção 3 (16/11/2026) | — |
| 5 | Medição de uso | Não se aplica (N1) | Projeto de estudo | — |
| 6 | Falhas tratadas | Atende | `npm test` no job `raiz` do run 43800634377, 16/11/2026: 11 pass, 0 skipped. Cobre banco fora (503), consentimento ausente (422), lista vazia, excesso de envios (429 em português) e e-mail repetido; o `e2e` cobre a página 404 | — |
| 7 | Desempenho aceitável | Não se aplica (N1) | Sem publicação: `curl -s -o /dev/null -w "%{http_code}" https://doe-sangue-salve-vidas.onrender.com`, 16/11/2026: 404 | #16 |
| 8 | Acessibilidade básica | Atende | Job `e2e` do run 43800634377, 16/11/2026: axe (WCAG 2.1 A e AA) sem violações em 6 estados, na largura de desktop: página inicial, formulário aberto, formulário com erro, depois do cadastro (com lista e tabela), e-mail repetido e 404. Teclado: o 1º Tab chega ao botão com contorno de 3 px, Enter abre o formulário e foca o nome, o erro leva o foco ao campo, Espaço marca o consentimento. Não há diálogo, então não há Esc a testar. Axe só no claro: o CSS não tem `prefers-color-scheme`, e o app não tem tema escuro próprio (#26) | — |
| 9 | Segurança e conformidade | Parcial | `npm ci` e `npm audit --omit=dev`, 16/11/2026 15h28: found 0 vulnerabilities (também no job `raiz` do run 43800634377). Alertas do Dependabot ligados: `gh api "repos/douglasabnovato/doe-sangue-salve-vidas/dependabot/alerts?state=open&per_page=100"`, 16/11/2026 15h27: 0 abertos. Sem segredo na árvore: o `server.js` antigo, com a senha local, saiu no PR #21. A captura com nomes e tipo sanguíneo foi trocada por dados fictícios, mas segue no histórico com outros dados: falta a decisão do responsável, que é o que ainda segura o "Parcial" | #22 |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/doe-sangue-salve-vidas/rules/branches/master`, 16/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (job `raiz`). O CI roda em PR para `master` e `developer/**`. Exigir também o `e2e` é do responsável | #23 |
| 11 | Testes dos fluxos críticos | Atende | Run 43800634377, 16/11/2026: `raiz` com `# tests 11`, `# pass 11`, `# skipped 0`; `e2e` com 3 passed | — |
| 12 | Documentação honesta | Atende | Comandos do README conferidos contra o `package.json` em 16/11/2026 (`start`, `dev`, `demo`, `test`, `test:e2e`); sem link publicado, porque responde 404 | — |

## 2. Hipótese

Acreditamos que uma página única, com consentimento claro e só quatro campos, faz a pessoa entrar na lista em menos de 1 minuto. **Meta:** cadastro concluído só com teclado, sem ajuda e sem erro de acessibilidade. **Saberemos quando** o teste `e2e/fluxo.e2e.js` concluir o cadastro no CI, com PostgreSQL real, e o nome minimizado aparecer na lista. Validar com pessoas fica fora do N1.

## 3. Fora do MVP

Agenda de doação, contas, lembrete de próxima doação, integração com hemocentros, saída da lista sem ajuda (#12) e tema escuro (#26).

## 4. Neste ciclo (16/11/2026)

Teste no navegador com axe no CI, página 429 em português, "Quem pode doar" com fonte oficial (#13), arquivos antigos removidos (#15), captura com dados fictícios, `npm audit` no CI e patch do `pg`.

## Histórico

- 16/11/2026, 15h27: o responsável ligou os alertas do Dependabot; o critério 9 trocou "desligados (API 403; #24)" por 0 alertas abertos e 0 no audit de produção, e segue Parcial pelos dados no histórico (#22). Resumo igual: 9 de 10.

### Resumo declarado em 10/11/2026

10 de 10 aplicáveis atendidos, Finalizado: sim. A revisão de 16/11/2026 achou os critérios 3 e 8 sem o teste no navegador que a régua pede e o critério 9 com evidência de 02/11/2026: pela régua, eram 7 de 10.

### Critérios de 10/11/2026: 10 de 10 declarados

| # | Critério | Situação | Evidência (comando, data, resultado) | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Doadores se cadastram para aparecer em uma lista de voluntários (README, 02/11/2026) | — |
| 2 | Hipótese a validar | Atende | Proposta na seção 2; ainda sem validação com pessoas (02/11/2026) | — |
| 3 | Fluxo principal completo | Atende | Cadastro feito no navegador com `npm run demo` (memória), 06/11/2026: a pessoa aparece como "Teclado T." na lista. A gravação no PostgreSQL é testada no CI com PostgreSQL 16 | #10 (ver com o banco real) |
| 4 | Escopo enxuto | Atende | Seção 3 (02/11/2026) | — |
| 5 | Medição de uso | Não se aplica (N1) | Projeto de estudo | — |
| 6 | Falhas tratadas | Atende | Página de erro 503 testada sempre (sem banco); 422 com mensagem quando falta consentimento; lista vazia com texto próprio (06/11/2026) | — |
| 7 | Desempenho aceitável | Não se aplica (N1) | Sem publicação (Render 404, 06/11/2026) | #16 |
| 8 | Acessibilidade básica | Atende | Lighthouse 12.8.2, acessibilidade 100 em `localhost`, 06/11/2026; Tab passa por 7 elementos, todos com nome e foco visível; cadastro concluído só com Tab, Enter e Espaço; 375 px sem rolagem horizontal | — |
| 9 | Segurança e conformidade | Atende | `npm audit fix` zerou os alertas de produção (02/11/2026) | — |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/doe-sangue-salve-vidas/rulesets`, 10/11/2026: ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão); o workflow `CI` (job `raiz`) roda em PR para `master` e `developer/**` | #14 |
| 11 | Testes dos fluxos críticos | Atende | Testes de integração rodam no CI com o serviço PostgreSQL do workflow (06/11/2026) | — |
| 12 | Documentação honesta | Atende | Comandos conferidos com o `package.json`; aviso de estudo no README (02/11/2026) | — |

### Critérios de 02/11/2026: 7 de 12 atendidos

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: Doadores se cadastram para aparecer em uma lista de voluntários. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: Proposta na seção 2; ainda sem validação com pessoas. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Não atende: Não foi percorrido: exige PostgreSQL, indisponível nesta máquina. A validação tem teste; os testes de integração rodam no CI com `TEST_DATABASE_URL`, se definido. |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: Seção 3. |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: Projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial: `views/error.html` existe; não exercitada. |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido: Sem publicação verificada neste ciclo. |
| 8 | Acessibilidade básica | axe e teclado | Não medido: As telas não foram abertas, pois o servidor depende do banco. |
| 9 | Segurança e conformidade | Riscos decididos | Atende: `npm audit fix` zerou os alertas de produção. |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: CI verde no PR deste ciclo; a principal segue sem proteção. |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: Testes automatizados rodam no CI. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: Comandos conferidos com o `package.json`; aviso de estudo no README. |

### Revisão de 06/11/2026 (ciclo de 03/11/2026)

**Nível:** Estudo (N1). Os critérios 5 e 7 passam a "Não se aplica (N1)" e saem da conta. **Resumo:** 9 de 10 aplicáveis atendidos (1, 2, 3, 4, 6, 8, 9, 11 e 12) e 1 parcial (10, que depende do responsável). **Finalizado:** sim, pela decisão 4 do processo: o único critério que falta depende do responsável e tem issue aberta com `depende-do-responsavel` (#14).

| # | Situação em 06/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|
| 3 | Atende | Cadastro feito no navegador com `npm run demo` (memória): a pessoa aparece como "Teclado T." na lista. A gravação no PostgreSQL é testada no CI com PostgreSQL 16 | #10 (ver com o banco real) |
| 5 | Não se aplica (N1) | Projeto de estudo | — |
| 6 | Atende | Página de erro 503 testada sempre (sem banco); 422 com mensagem quando falta consentimento; lista vazia com texto próprio | — |
| 7 | Não se aplica (N1) | Sem publicação (Render 404) | #16 |
| 8 | Atende | Lighthouse 12.8.2, acessibilidade 100 em `localhost`; Tab passa por 7 elementos, todos com nome e foco visível; cadastro concluído só com Tab, Enter e Espaço; 375 px sem rolagem horizontal | — |
| 10 | Parcial | CI verde nos PRs, mas a `master` não é protegida (decisão 3). Antes estava "Atende" | #14 |
| 11 | Atende | Os 4 testes de integração eram pulados no CI (sem `TEST_DATABASE_URL`); agora rodam com o serviço PostgreSQL do workflow | — |
