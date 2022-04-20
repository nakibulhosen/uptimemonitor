/*
*Title:Routes
*Description: Application Routes
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies 
const { sampleHandler } = require('./handlers/routeHandlers/smapleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
    'check': checkHandler,
}

module.exports = routes;