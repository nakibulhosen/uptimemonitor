/*
*Title:user handler
*Description: Handle route related user
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*/

// dependencies 
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')


// module scaffolding 

const handler = {}

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Invalid Request Type'
        });
    }

};

handler._user = {}
handler._user.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement != false ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that user is not already exist 
        data.read('user', phone, (err, user) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }
                //store the user object
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User created successfully'
                        })
                    } else {
                        callback(500, {
                            'message': 'There was an error in server side',
                            'error': err
                        })
                    }
                })
            } else {
                callback(500, {
                    'message': 'User already exist'
                })
            }
        })
    } else {
        callback(400, {
            message: 'You have a problem in your request'
        })
    }

}
handler._user.get = (requestProperties, callback) => {
    // check the phone number is valid or not 
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;


    if (phone) {
        // verify token 
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup for user 
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) }
                    if (!err && user) {
                        delete user.password;
                        callback(200, user)
                    } else {
                        callback(404, {
                            'message': 'Requested user does not exist'
                        })
                    }
                })
            } else {
                callback(403, {
                    'message': 'Unauthenticated request. Please login'
                })
            }
        })

    } else {
        callback(400, {
            'message': 'Enter valid phone number',

        })
    }
}
handler._user.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone) {
        if (firstName || lastName || password) {

            // verify token 
            let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    // lookup for user 
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJSON(uData) };
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName
                            } if (password) {
                                userData.password = hash(password)
                            }

                            // Store to database 

                            data.update('users', phone, userData, (err) => {
                                if (!err) {
                                    callback(200, {
                                        'message': 'User updated successfully'
                                    })
                                } else {
                                    callback(500, {
                                        message: 'There was a problem in server side'
                                    })
                                }
                            })
                        } else {
                            callback(404, {
                                'message': 'User does not exist'
                            })
                        }
                    })
                } else {
                    callback(403, {
                        'message': 'Unauthenticated request. Please login'
                    })
                }
            })

        } else {
            callback(400, {
                'message': 'Nothing to change'
            })
        }
    } else {
        callback(400, {
            'message': 'Error Invalid phone number'
        })
    }
}
// TODO: delete token after deleting user
handler._user.delete = (requestProperties, callback) => {
    // check the phone number is valid or not 
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {

        // verify token 
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup for user 
                data.read('users', phone, (err, userData) => {
                    if (!err) {
                        data.delete('users', phone, (err) => {
                            if (!err) {
                                callback(200, {
                                    'message': 'User deleted successfully'
                                })
                            } else {
                                callback(500, {
                                    'message': 'There was a server side error'
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
                    'message': 'Unauthenticated request. Please login'
                })
            }
        })

        // lookup for user 

    } else {
        callback(400, {
            'message': 'Invalid phone number'
        })
    }
}

module.exports = handler;