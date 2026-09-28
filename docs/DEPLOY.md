# Deploy · Doe Sangue! Salve Vidas!

Plano de ação para publicar a lista de doadores em hospedagem gratuita.

## 1. Desafio

Colocar no ar, sem custo, uma aplicação Express com páginas renderizadas no servidor (Nunjucks) que grava **nome, e-mail e tipo sanguíneo** num PostgreSQL, com consentimento LGPD, sem expor credenciais e sem depender de um banco que expira.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **Render Web Service gratuito + PostgreSQL no Neon gratuito (escolhida)** | O Express renderiza as páginas e grava no banco; o Neon não expira e aceita TLS |
| GitHub Pages | Não serve: só publica arquivos estáticos, e aqui o HTML é montado no servidor a cada acesso |
| PostgreSQL gratuito do próprio Render | Expira 30 dias após a criação; o Neon continua de graça |
| VPS | Fora da regra do portfólio (só hospedagem gratuita) |

### Banco no Neon: um projeto, um banco por aplicação

Crie **um único projeto no Neon** (por exemplo `portfolio-ser-mvp`) e, dentro dele, **um banco para cada aplicação** (`doe_sangue`, `feedback_widget`, `be_the_hero`...). Assim você não esbarra no limite de projetos do plano gratuito, administra tudo num só painel e cada aplicação continua isolada no seu próprio banco. Os bancos do mesmo projeto dividem a cota de armazenamento e de horas de computação, o que sobra para aplicações de demonstração.

### O que foi ajustado para produção

| Mudança | Arquivo | Por quê |
|---|---|---|
| `NODE_VERSION` `"22"` | `render.yaml` | O Node 20 saiu de suporte em abr/2026 |
| `autoDeployTrigger: commit` | `render.yaml` | Cada push na `master` publica sozinho |
| `buildCommand: npm ci --omit=dev` | `render.yaml` | Em produção não precisa do `supertest` |
| Node 22 no CI | `ci/github-actions-ci.yml` | Testar na mesma versão da produção |
| Seção "Em produção" | `Readme.md` | URL, hospedagem e link para este guia |

Já estava pronto do ciclo anterior: `DATABASE_URL` lida do ambiente, migrações idempotentes rodando na subida (`src/db/migrate.js`), `trust proxy` por `TRUST_PROXY=1`, TLS por `DATABASE_SSL=1` e a rota `/health` usada pelo Render.

### Limitações do plano gratuito

- O serviço do Render dorme após 15 min sem acesso e leva cerca de 1 min para acordar.
- As 750 horas mensais do Render são da conta inteira, somando todos os serviços.
- O Neon suspende o banco após 5 min parado e acorda em cerca de 1 s na primeira consulta. O armazenamento gratuito é de 0,5 GB por projeto (limites atualizados em neon.com/pricing).

### Segurança e LGPD

- A senha antiga do PostgreSQL local (`1234560`) continua no histórico do Git. Se ela foi usada em algum servidor, troque-a.
- Tipo sanguíneo é dado de saúde (dado sensível na LGPD). O cadastro só é aceito com consentimento explícito, e a lista pública mostra apenas primeiro nome, inicial e tipo.
- Registros antigos sem consentimento ficam ocultos. O banco do Neon nasce vazio, então isso só importa no seu banco local: se ele tiver dados reais, apague-os.
- Ainda não há remoção pelo próprio usuário (próximo ciclo). Pedido de exclusão é atendido no **SQL Editor** do Neon com `DELETE FROM donors WHERE lower(email) = lower('email@da.pessoa');`.
- A `DATABASE_URL` contém a senha do banco: fica só no painel do Render e no seu `.env`, nunca no Git.

## 3. Solução (passo a passo)

### Etapa 0 · Segredos e LGPD

1. Se a senha `1234560` foi usada em algum PostgreSQL fora da sua máquina, troque-a nesse servidor.
2. Se o seu banco local tiver dados reais sem consentimento, apague-os: `DELETE FROM donors WHERE consent_at IS NULL;`.

### Etapa 1 · Criar o banco no Neon

1. Entrar em **neon.com** com a conta do GitHub.
2. Se ainda não existir, **New Project**: nome `portfolio-ser-mvp`, região **AWS US West 2 (Oregon)** (a mesma região padrão do Render, para a consulta não atravessar o continente). Os outros projetos do portfólio usam este mesmo projeto.
3. No projeto, menu **Branches → main → aba Databases → New database**: nome `doe_sangue`, dono `neondb_owner`.
4. No **Project Dashboard**, botão **Connect**: escolher Branch `main`, Database `doe_sangue`, Role `neondb_owner`, desligar **Connection pooling** e copiar a string.
5. Conferir o formato: `postgresql://neondb_owner:SENHA@ep-xxxx.us-west-2.aws.neon.tech/doe_sangue?sslmode=require`. Se vier `&channel_binding=require` no final, pode remover; o `?sslmode=require` tem que ficar.
6. Guardar a string num lugar seguro (gerenciador de senhas). Ela vai no Render na Etapa 4.

### Etapa 2 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/doe-sangue-salve-vidas`
2. `npm ci`
3. `npm test` (sem `TEST_DATABASE_URL`: 2 testes passam e 5 de banco ficam pulados; o CI roda os 7 com PostgreSQL)
4. Opcional, para provar a conexão com o Neon: `cp .env.example .env`, colar a string na `DATABASE_URL`, pôr `DATABASE_SSL=1` e rodar `npm run dev`. Abrir `http://localhost:3000/health` e ver `{"status":"ok","donors":0}`. A tabela é criada nessa primeira subida.
5. Nunca aponte `TEST_DATABASE_URL` para o banco do Neon: os testes apagam a tabela `donors`.

### Etapa 3 · Subir para o GitHub (branch `master`)

1. Remover os arquivos antigos (movidos para `views/` e `src/`):
   `git rm index.html server.js`
2. Ativar o CI (a pasta `.github` é protegida para a ferramenta que preparou o projeto):
   `mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci`
3. `git status` (não podem aparecer `.env` nem `node_modules/`)
4. `git add -A`
5. `git commit -m "feat(deploy): Node 22, deploy automático no Render, guia de deploy com Neon"`
6. `git push origin master`
7. No GitHub, aba **Actions**: o CI precisa ficar verde (7 testes com PostgreSQL e auditoria).

### Etapa 4 · Criar o serviço no Render

1. Entrar em **render.com** com a conta do GitHub e autorizar o repositório `doe-sangue-salve-vidas`.
2. **New → Blueprint** e escolher `douglasabnovato/doe-sangue-salve-vidas`, branch `master`.
3. O Render pede **uma** variável: `DATABASE_URL` = a string do Neon da Etapa 1. As outras (`DATABASE_SSL`, `TRUST_PROXY`, `NODE_VERSION`) já vêm do `render.yaml`.
4. Conferir o serviço `doe-sangue-salve-vidas`, plano **Free**, e clicar em **Apply**.
5. Acompanhar **Logs** até aparecer `Doe Sangue em http://localhost:10000` (2 a 4 min).

### Etapa 5 · Conferir no ar

1. `https://doe-sangue-salve-vidas.onrender.com/health` responde `{"status":"ok","donors":0}`.
2. A página inicial abre com o logo, a fonte Roboto e a tabela por tipo sanguíneo.
3. **Quero ajudar** sem marcar o consentimento mostra o erro no campo.
4. Cadastro completo mostra "Cadastro feito. Obrigado!" e a lista mostra só "Nome I." e o tipo.
5. Repetir o mesmo e-mail mostra "Este e-mail já está na lista".
6. Um endereço inexistente (`/xyz`) mostra a página 404 própria.
7. No **SQL Editor** do Neon (banco `doe_sangue`): `SELECT name, blood, consent_at FROM donors;` mostra o registro com `consent_at` preenchido.
8. Apagar o cadastro de teste: `DELETE FROM donors;`.

### Etapa 6 · Fechar

1. Se a URL real for diferente de `https://doe-sangue-salve-vidas.onrender.com` (o Render acrescenta um sufixo quando o nome já existe), corrigir no `Readme.md`, commit e push.
2. No GitHub, **About → Website**: colar a URL.
