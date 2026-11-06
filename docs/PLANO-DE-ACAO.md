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
