/*
*Title: Uptime Monitoring Application
*Description: A RESTFUL API to monitor up or down time user defined links
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies 
const http = require('http');


const {handleReqRes} = require('./helpers/handleReqRes')
// app object - mudule scaffolding 
const app = {};

// configuration object 
app.config = {
    port: 3000
};

// create server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`)
    })
}

// handle Request and Response 
app.handleReqRes = handleReqRes;

app.createServer();