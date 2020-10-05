//configurar servidor
const express = require('express');
const server = express();

//configurar template engine
const nunjucks = require('nunjucks');
nunjucks.configure()

//configurar apresentação da página
server.get('/', function(req, res){
    return res.send("Hello, Douglas !!!");
})

server.listen(3000, function(){
    console.log('Iniciei o servidor e exibi no console.')
});