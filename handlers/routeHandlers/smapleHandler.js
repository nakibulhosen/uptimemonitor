/*
*Title:sample route handler
*Description: Handle sample Route
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*/
// module scaffolding 

const handler = {}

handler.sampleHandler = (requestProperties, callback) => {
    callback(200,{
        message: 'This is a sample api url'
    });
};

module.exports = handler;