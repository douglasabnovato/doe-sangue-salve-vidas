# MVP — doe-sangue-salve-vidas

> Criado em 02/11/2026. Meta: N1 (estudo). Testado no Windows, com Node 24, na cópia de `master`. Não houve teste com pessoas nem em aparelho real.

## 1. Critérios: 7 de 12 atendidos em 02/11/2026 (veja a revisão de 06/11/2026 no fim)

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

## 2. Hipótese (proposta)

Praticar Node com PostgreSQL: cadastrar-se com consentimento em menos de 1 minuto.

## 3. Fora do MVP

Agenda de doação e contas.

## 4. Neste ciclo

Atualiza dependências com alerta.

## Revisão de 06/11/2026 (ciclo de 03/11/2026)

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
