/*
*Title:Routes
*Description: Application Routes
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies 
const { sampleHandler } = require('./handlers/routeHandlers/smapleHandler');
const { notFoundHandler } = require('./handlers/routeHandlers/notFoundHandler');
const routes = {
    'sample': sampleHandler,
    'notFoundHandler': notFoundHandler
}

module.exports = routes;