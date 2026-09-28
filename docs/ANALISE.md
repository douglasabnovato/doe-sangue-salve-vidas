# Análise — Doe Sangue! Salve Vidas!

## 1. Especificação

Página que incentiva a doação de sangue e forma uma lista de pessoas dispostas a doar, com nome, e-mail e tipo sanguíneo.

| Ator | Objetivo |
|---|---|
| Pessoa doadora | Entrar na lista e ser lembrada/contatada para doar |
| Organizador (hemocentro/campanha) | Saber quantos doadores existem por tipo |

### Requisitos funcionais

| ID | Requisito | Critério de aceite | Antes |
|---|---|---|---|
| RF01 | Cadastrar doador | Dado nome, e-mail, tipo válido e consentimento, quando envio, vejo a confirmação | ⚠️ sem consentimento |
| RF02 | Recusar dados inválidos | Dado tipo "Z+", vejo erro no campo | ❌ texto livre |
| RF03 | Não duplicar | Dado e-mail já cadastrado, sou informado sem duplicar | ❌ |
| RF04 | Listar últimos doadores | Vejo até 8, do mais recente, só primeiro nome + inicial | ⚠️ lista todos, nome completo |
| RF05 | Ver doadores por tipo | Vejo contagem agregada por tipo | ❌ |

### Requisitos não funcionais

| ID | Requisito | Referência |
|---|---|---|
| RNF01 | Tipo sanguíneo é **dado pessoal sensível** (saúde): exige consentimento específico e minimização | LGPD art. 5º II, art. 11 e art. 6º III |
| RNF02 | Nenhum segredo no código | OWASP A02/A07:2025; 12-Factor III |
| RNF03 | Afirmações com fonte | CDC art. 37 (publicidade enganosa) |
| RNF04 | WCAG 2.2 AA | — |

## 2. Defeitos encontrados

| # | Severidade | Defeito |
|---|---|---|
| D1 | Crítica (LGPD) | Nome completo + tipo sanguíneo publicados sem consentimento |
| D2 | Alta | Senha do PostgreSQL (`1234560`) no código |
| D3 | Alta | Tabela nunca é criada pela aplicação (sem schema/migration) |
| D4 | Média | Tipo sanguíneo em texto livre, e-mail sem validação nem unicidade |
| D5 | Média | Erros de banco retornam texto puro; sem 404/500 |
| D6 | Média | Inputs sem `label`, sem `lang="pt-br"`, contraste 3,0:1 |
| D7 | Média | "38.000 doações por dia" e "1,9% da população" sem fonte |
| D8 | Baixa | `start` com nodemon; "Últimos doadores" carrega todos |

## Rubrica v2 (grupo fullstack)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 16% | 5 | 8 | Testes de cadastro/lista + navegação Playwright | Sem tabela criada pela aplicação; "Últimos doadores" lista todos |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 8% | 2 | 8 | Teste 503 com banco fora; 422 com erros por campo | Erros viram texto puro ("erro no banco de dados.") |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 7% | 3 | 8 | axe-core: 0 violações com formulário aberto e erros | Inputs só com placeholder, sem `lang`, contraste 3,0:1 |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 14% | 2 | 8 | Testes: nome minimizado, e-mail não exibido, consentimento obrigatório | Senha do banco no código; nome completo + tipo sanguíneo (dado de saúde, LGPD art. 11) públicos sem consentimento |
| C5 | Dados | 3FN / ACID / fonte única | 10% | 3 | 8 | Migration idempotente testada 2x; índice único em lower(email) | Tipo sanguíneo texto livre; e-mail sem unicidade |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 0 | 7 | 7 testes (5 com PostgreSQL 16 real) | Nenhum teste. Auditoria: reexecutado com PostgreSQL 16 (TEST_DATABASE_URL): 7/7 passaram |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 7% | 3 | 8 | Revisão: config/db/repo/app separados | Tudo em `server.js` |
| C8 | Desempenho | Complexidade; Core Web Vitals | 5% | 5 | 7 | Lista limitada a 8 com índice parcial | Carrega todos os doadores |
| C9 | Operação | 12-Factor; DORA | 7% | 2 | 7 | `/health`; blueprint Render; CI com serviço Postgres (não executado) | Credenciais fixas; `start` usa nodemon |
| C10 | Documentação | README como contrato | 5% | 4 | 8 | README + docs/ | README de aula |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 7% | 4 | 7 | Números com fonte (MS 2022); `/health` e contagem por tipo | Causa relevante, mas "38.000 doações/dia" e "1,9%" sem fonte |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 5% | 4 | 8 | `npm audit`: 0 vulnerabilidades | nodemon em produção; dependências desatualizadas |

**Média ponderada:** antes **3,03** (REPROVADO) → depois **7,72** (APROVADO).

