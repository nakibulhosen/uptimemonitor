/*
*Title:Token Handler
*Description: Handle token realted functionalities
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies 
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities')
const { createRandomString } = require('../../helpers/utilities')


// module scaffolding 

const handler = {}
handler._token = {}

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Invalid Request Type'
        });
    }

};


handler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        data.read('users', phone, (err, uData) => {
            if (!err && uData) {
                const userData = parseJSON(uData);
                const hashPassword = hash(password);
                if (hashPassword === userData.password) {
                    let tokenId = createRandomString(20);
                    let expires = Date.now() + 60 * 60 * 1000;
                    let tokenObject = {
                        phone,
                        'id': tokenId,
                        expires
                    }

                    // store the token 

                    data.create('tokens', tokenId, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, {
                                'message': 'Token created successfully',
                                'token': tokenObject
                            })
                        } else {
                            callback(500, {
                                'message': 'There was a server side error',
                                'error': err2
                            })
                        }
                    })

                } else {
                    callback(403, {
                        'message': 'Invalid Password'
                    })
                }
            } else {
                callback(500, {
                    'message': 'There was a server side error while reading user data',
                    'error': err
                })
            }

        })
    } else {
        callback(400, {
            'message': 'Invalid data format, validation failed'
        })
    }
}
handler._token.get = (requestProperties, callback) => {

}
handler._token.put = (requestProperties, callback) => {

}
handler._token.delete = (requestProperties, callback) => {

}

module.exports = handler;