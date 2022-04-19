/*
*Title: not found route handler
*Description: Handle 404 Route
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*/
// module scaffolding 

const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found'
    })
};

module.exports = handler;