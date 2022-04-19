/*
*Title:utilities
*Description: Utilities function
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*/

// dependencies 

const crypto = require('crypto');
const environments = require('./environments')

// module scaffolding 
const utilities = {};

// Parse JSON string object 

utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString)
    } catch {
        output = {}
    }
    return output
}

// Hashing 
utilities.hash = (string) => {
    if (typeof (string) === 'string' && string.length > 0) {
        let hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update("If you love node so much why don't you marry it?")
            .digest('hex');
        return hash;
    }
    return false;
}
// export module 
module.exports = utilities;