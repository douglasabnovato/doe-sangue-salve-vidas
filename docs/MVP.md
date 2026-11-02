# MVP — doe-sangue-salve-vidas

> Criado em 02/11/2026. Meta: N1 (estudo). Testado no Windows, com Node 24, na cópia de `master`. Não houve teste com pessoas nem em aparelho real.

## 1. Critérios: 7 de 12 atendidos

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
