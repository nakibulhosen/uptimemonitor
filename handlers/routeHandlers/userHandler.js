/*
*Title:user handler
*Description: Handle route related user
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*/

// dependencies 
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities')


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
    callback(200)
}
handler._user.put = (requestProperties, callback) => {

}

handler._user.delete = (requestProperties, callback) => {

}

module.exports = handler;