//configurar servidor
const express = require("express");
const server = express(); 
//configurar servidor para apresentar arquivos estáticos
server.use(express.static("public"));
//habilitar body do formulário
server.use(express.urlencoded({extended: true}));
//conexão da aplicação com o db postgres
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: '1234560',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});
//configurar template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true, 
});
//configurar apresentação da página
server.get("/",function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de db.");
        const donors = result.rows;
        return res.render("index.html", { donors });
    })    
}) 
//pegar os dados do formulário
server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood 
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }
    //inserir registros no db
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ('$1, $2, $3')`
    const values = [name, email, blood];
    db.query(query, values, function(err){
        if(err)return res.send("erro no banco de dados.");
        return res.redirect("/");
    });    
})
//ligar o servidor a porta 3000
server.listen(3000, function(){
    console.log("Hello Douglas, estou no bash.")
});