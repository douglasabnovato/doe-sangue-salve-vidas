const express = require('express');
const server = express();

server.get('/', function(req, res){
    return res.send("Hello, Douglas !");
})

server.listen(3000);