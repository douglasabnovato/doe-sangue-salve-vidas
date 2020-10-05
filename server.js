//configurar servidor
const express = require("express");
const server = express(); 
//configurar servidor para apresentar arquivos estáticos
server.use(express.static("public"));
//configurar template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server
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
//ligar o servidor a porta 3000
server.listen(3000, function(){
    console.log("Hello Douglas, estou no bash.")
});