<h3 align="center">
  Doe Sangue! Salve vidas! 🚀
</h3>

---
<br>

![Resultado da Aplicação](/public/tela-da-aplicacao.jpg)

### O que é a aplicação

- Cadastrar pessoas para doação de sangue
- Inserir no cadastro os doares com informações úteis
- Visualizar a lista de doadores

#### Tecnologias/ Ferramentas/ Bibliotecas

- HTML/Javascript: estrutura e efeitos
- CSS: posicionamento, dimensionamento e muito mais.
- NodeJS para o backend, com Express

#### Código + Dependências

- git clone "endereço do projeto"
- npm install express
- npm install nodemon
- npm install nunjucks
- npm install pg
- Rodar a aplicação: `npm start`

#### Frontend 

- [x] 1. Aplicação Doe Sangue! Salve vidas!
- [x] 2. Estrutura HTML 
- [x] 3. Estilização CSS
- [x] 3.1. css donors
- [x] 3.2. css donors alinhamentos
- [x] 3.3. css donors espaçamentos
- [x] 3.4. css global
- [x] 3.5. css donors largura e altura
- [x] 3.6. css form
- [x] 3.7. css header button
- [x] 3.8. css fonts: google fonts, tamanho
- [x] 3.9. css cores 
- [x] 3.10. css cores do form e títulos
- [x] 3.11. css img - logo 
- [x] 3.12. css gota nos tipos de sangue 
- [x] 4. Lógica da Aplicação - Javascript
- [x] 4.1. js form
- [x] 4.2. js button

#### Backend

- [x] 5. Servidor da aplicação
- [x] 5.1. Regras de dados
- [x] 5.2. Banco de Dados para armazenar dados
- [x] 6. Tecnologias 
- [x] 6.1. NodeJS - LTS v12.18.3
- [x] 6.1.1. npm init -y
- [x] 6.1.2. `npm install express`: criar servidor
- [x] 6.1.3. pasta node_modules
- [x] 6.1.4. server.sj: configurar o servidor
- [x] 6.1.5. node server.js: executar o servidor
- [x] 6.1.6. nodemon: `npm install nodemon`: automatiza o restart do servidor
- [x] 6.1.6.1. warning: nodemon funcionou apenas com o yarn
- [x] 6.1.7. nunjucks: `npm install nunjucks`: template engine
- [x] 6.2. Dados
- [x] 6.2.1. Estrutura de repetição com nunjucks
- [x] 6.2.3. Pegar os dados do formulário
- [x] 6.3. Banco de Dados
- [x] 6.3.1. Postgres 
- [x] 6.3.1.1. Linguagem SQL
- [x] 6.3.1.2. SGBDR
- [x] 6.3.1.3. Open Source
- [x] 6.3.2. Instalar Postgres - 1234560 
- [x] 6.3.3. Postbird
````
    user: 'postgres',
    password: '1234560',
    host: 'localhost',
    port: 5432,
    database: 'doe'
````
- [x] 6.3.3.1. Connections
- [x] 6.3.3.2. criar db - doe
- [x] 6.3.3.3. criar tabela - donors
- [x] 6.3.3.4. criar colunas - name, email, blood com seus respectivos tipos
- [x] 6.3.3.5. inserir registros
- [x] 6.3.3.5.1. content/new row
- [x] 6.3.3.5.2. new query
````sql
insert into "donors" ("name", "email", "blood")
values ('Augusto Cury', 'augusto@cury.com.br', 'AB+');
````
- [x] 6.3.3.6. buscar dados
````sql
select *
from "donors";
````
- [x] 6.4. conectar a aplicação ao bd: `npm install pg`
- [x] 6.5. revisado estilização e db  

#### Próximo passo na aplicação

- Um artigo da aplicação
- Desenvolver um módulo mobile

#### Anotações   

- Fonte do projeto: [Mayk Brito - Maratona Dev 3.0](https://github.com/maykbrito)

---
<br>

.: Por [Douglas A B Novato](https://linktr.ee/douglasabnovato)