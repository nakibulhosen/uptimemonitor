/*
*Title:Check handler
*Description: Handle the links uptime
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 20/04/22
*/

// dependencies 
const data = require('../../lib/data');
const { hash, createRandomString } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')
const { maxChecks } = require('../../helpers/environments')


// module scaffolding 

const handler = {}

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Invalid Request Type'
        });
    }
};

handler._check = {}
handler._check.post = (requestProperties, callback) => {
    // Input validation 
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method.toLowerCase()) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds > 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // validate token 
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        // lookup the user phone by reading the phone 
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;

                // lookup user data 
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        // verify token 
                        tokenHandler._token.verify(token, userPhone, (IsTokenValid) => {
                            if (IsTokenValid) {
                                let userObject = parseJSON(userData);
                                let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                                if (userChecks.length <= maxChecks) {
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        'id': checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds
                                    }

                                    // save to database 
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add check id to the user object 
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId)

                                            //save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObject)
                                                } else {
                                                    callback(500, {
                                                        'message': 'There is a server side error'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                'message': 'There was a problem in server side'
                                            })
                                        }
                                    })
                                } else {
                                    callback(401, {
                                        'messsage': 'User has  reach max check limit'
                                    })
                                }
                            } else {
                                callback(404, {
                                    'message': 'Authentication failed, login to continue'
                                })
                            }
                        })
                    } else {
                        callback(404, {
                            'message': 'User not found'
                        })
                    }
                })
            } else {
                callback(404, {
                    'message': 'Authentication failed. Please login'
                })
            }
        })
    } else {
        callback(400, {
            'message': 'Invalid input format'
        })
    }

}
handler._check.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        //lookup the check
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (IsTokenValid) => {
                    if (IsTokenValid) {
                        callback(200, parseJSON(checkData))
                    } else {
                        callback(403, {
                            'message': 'Invalid authentication token'
                        })
                    }
                })
            } else {
                callback(500, {
                    'message': 'There was a server side error, May be the checks are not exist'
                })
            }
        })
    } else {
        callback(400, {
            'message': 'Ivalid data format'
        })
    }
}
handler._check.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    // Input validation 
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method.toLowerCase()) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds > 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (id) {
        if (protocol || method || url || successCodes || timeoutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObject = parseJSON(checkData)
                    // validate token 
                    const token = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;
                    // verify token 
                    if (token) {
                        tokenHandler._token.verify(token, checkObject.userPhone, (IsTokenValid) => {
                            if (IsTokenValid) {
                                if (protocol) {
                                    checkObject.protocol = protocol;
                                }
                                if (method) {
                                    checkObject.method = method
                                }
                                if (url) {
                                    checkObject.url = url
                                }
                                if (successCodes) {
                                    checkObject.successCodes = successCodes
                                }
                                if (timeoutSeconds) {
                                    checkObject.timeoutSeconds = timeoutSeconds
                                }

                                // store the check object 
                                data.update('checks', id, checkObject, (err2) => {
                                    if (!err2) {
                                        callback(200, {
                                            checkObject
                                        })
                                    } else {
                                        callback(500, {
                                            'message': 'There was a server side error',
                                            err2
                                        })
                                    }
                                })
                            } else {
                                callback(403, {
                                    'message': 'Invalid authentication token. Please login again',
                                })
                            }
                        })
                    } else {
                        callback(400, {
                            'message': 'Invalid authentication token format. Please login again',
                        })
                    }
                } else {
                    callback(500, {
                        'message': 'There was a server side error',
                        err1
                    })
                }
            })
        } else {
            callback(400, {
                'message': 'You have to provide at least one field to update'
            })
        }
    } else {
        callback(400, {
            'message': 'Invalid check id'
        })
    }
}
handler._check.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        //lookup the check
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (IsTokenValid) => {
                    if (IsTokenValid) {
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read('users', parseJSON(checkData).userPhone, (err3, userData) => {
                                    if (!err3 && userData) {
                                        let userObject = parseJSON(userData)
                                        let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                        // remove the deleted check id from user's list of check 
                                        let checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);

                                            // resave the user data 
                                            userObject.checks = userChecks;

                                            data.update('users', userObject.phone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, {
                                                        'message': 'Check deleted successfully'
                                                    })
                                                } else {
                                                    callback(500, {
                                                        'message': 'There was a server side error while updating user checks'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                'message': 'The check that you are trying to remove is not found in the users test list'
                                            })
                                        }
                                    } else {
                                        callback(500, {
                                            'message': 'There was a server side error wile deleting check data from user'
                                        })
                                    }
                                })
                            } else {
                                callback(500, {
                                    'message': 'There was a server side error'
                                })
                            }
                        })
                    } else {
                        callback(403, {
                            'message': 'Invalid authentication token'
                        })
                    }
                })
            } else {
                callback(500, {
                    'message': 'There was a server side error, May be the checks are not exist'
                })
            }
        })
    } else {
        callback(400, {
            'message': 'Ivalid data format'
        })
    }
}

module.exports = handler;