/*
*Title: Project Initial file
*Description: Initial file to start the node server and workers
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies 
const server = require('./lib/server')
const workers = require('./lib/workers')

const { handleReqRes } = require('./helpers/handleReqRes')
// app object - mudule scaffolding 
const app = {};

app.init = () => {
    //start the server
    server.init();
    //start the workers
    workers.init();
}




// handle Request and Response 
app.handleReqRes = handleReqRes;

app.init();