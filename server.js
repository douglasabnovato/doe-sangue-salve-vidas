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
//configurar apresentação da página
server.get("/",function(req, res){
    return res.render("index.html");
}) 
//ligar o servidor a porta 3000
server.listen(3000, function(){
    console.log("Hello Douglas, estou no bash.")
});