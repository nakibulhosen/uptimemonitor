/*
*Title: Server library
*Description: Server related files
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 21/04/22
*
*/

// dependencies 
const http = require('http');
const environment = require('../helpers/environments');
const { handleReqRes } = require('../helpers/handleReqRes');

// app object - mudule scaffolding 
const server = {};

server.config = {
    port: 3000
}

// create server 
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`)
    })
}

// handle Request and Response 
server.handleReqRes = handleReqRes;

server.init = () => {
    server.createServer();
}

// export 
module.exports = server;
