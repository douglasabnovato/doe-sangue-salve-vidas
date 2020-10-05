//configurar servidor
const express = require("express");
const server = express(); 
//configurar servidor para apresentar arquivos estáticos
server.use(express.static("public"));
//habilitar body do formulário
server.use(express.urlencoded({extended: true}))
//configurar template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true, 
});
//agrupamento de dados - lista de doadores
const donors = [
    {
        name: "Douglas",
        blood: "AB+"
    },
    {
        name: "Ellon Musk",
        blood: "B+"
    },
    {
        name: "Steve Jobs",
        blood: "O+"
    },
    {
        name: "Bill Gates",
        blood: "A-"
    }
];
//configurar apresentação da página
server.get("/",function(req, res){
    return res.render("index.html", { donors });
}) 
//pegar os dados do formulário
server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    //colocar valores dentro do array
    donors.push({ 
        name: name,
        blood: blood,
    });
    return res.redirect("/");
})
//ligar o servidor a porta 3000
server.listen(3000, function(){
    console.log("Hello Douglas, estou no bash.")
});