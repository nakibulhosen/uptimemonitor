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

// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        console.log(environments, process.env.NODE_ENV);
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// Token generation 
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        let possibleCharacters = 'abcdefghjklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
    } else {
        return false;
    }
}
// export module 
module.exports = utilities;