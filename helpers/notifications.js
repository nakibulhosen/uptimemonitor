/*
*Title: Notification library
*Description: Important function to notify user
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies
const https = require('https');
const { twilio } = require('../helpers/environments')
const queryString = require('querystring')
// module scaffolding 
const notifications = {}

//send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
    console.log(twilio)
    const userPhone = typeof (phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof (msg) === 'string' && msg.trim().length <= 1600 ? msg.trim() : false;
    if (userPhone && userMsg) {
        // configure the request payload
        const requestPayload = {
            From: twilio.from,
            To: `+88${userPhone}`,
            Body: userMsg
        }

        //Stringify the payload
        const stringifyPayload = queryString.stringify(requestPayload);

        //configure request details
        const requestDetails = {
            hostname: 'https://api.twilio.com/',
            method: 'POST',
            path: `/2010-04-01/Acounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given phone and sms is invalid')
    }

}

// export the module 
module.exports = notifications;