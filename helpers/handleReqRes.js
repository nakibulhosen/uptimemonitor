/*
*Title: Handle Request Response
*Description: Handle Request and response
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/
// Dependencies 

const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')

//module scafolding

const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it 
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedURL.query;
    const headersObject = req.headers;

    const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    const requestProperties = {
        parsedURL,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    }



    const decoder = new StringDecoder('utf-8')
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    })
    req.on('end', () => {
        realData += decoder.end();
        
        choosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {}

            const payloadString = JSON.stringify(payload);

            // return the final response 
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    })

}
module.exports = handler