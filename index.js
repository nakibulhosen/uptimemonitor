/*
*Title: Uptime Monitoring Application
*Description: A RESTFUL API to monitor up or down time user defined links
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies 
const http = require('http');
const environment = require('./helpers/environments');
const data = require('./lib/data');

const { handleReqRes } = require('./helpers/handleReqRes')
// app object - mudule scaffolding 
const app = {};

// testing file system 
// TODO: erase later
data.delete('test', 'newFile',(err) => {
    console.log('Error', err);
})

// create server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`)
    })
}

// handle Request and Response 
app.handleReqRes = handleReqRes;

app.createServer();