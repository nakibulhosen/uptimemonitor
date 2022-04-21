/*
*Title: Worker library
*Description: Worker related functionalities
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 21/04/22
*
*/

// dependencies 
const { parseJSON } = require('../helpers/utilities');
const data = require('../lib/data');
const url = require('url')
const http = require('http')
const https = require('https')
const { sendTwilioSms } = require('../helpers/notifications')

// app object - mudule scaffolding 
const worker = {};

// perfoorm check
worker.performCheck = (originalCheckData) => {
    //prepare the initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': false
    }
    // mark the outcome has not been sent yet 
    let outcomeSent = false;
    // parse the hostname and full url from originalData
    let parsedURL = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true)
    const hostname = parsedURL.hostname;
    const path = parsedURL.path;

    // construct the request 
    const requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'hostname': hostname,
        'method': originalCheckData.method.toUpperCase(),
        'timeout': originalCheckData.timeoutSeconds * 1000,
    }

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;
    let req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status = res.statusCode;
        console.log(status)
        // update the check result and pass to the next process
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }

    })

    // Handle error
    req.on('error', (e) => {
        checkOutcome = {
            error: true,
            value: e,
        };
        // update the check result and pass to the next process
        if (!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
        console.log(e)
    })

    // Handle timeout 
    req.on('timeout', (e) => {
        checkOutcome = {
            error: true,
            value: 'timeout'
        }
        // update the check result and pass to the next process
        if (!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.end()

}

// save check outcome to database and send to next process
worker.processCheckOutcome = (originalCheckData, checkOutcome) => {
    // check if check outcome is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //decide whether we should alert the user or not
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    // update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disc
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                //send the checkddata to next process
                worker.alertUserToStatusChange(newCheckData)
            } else {
                console.log('We dont need to send alert as the status has not been changed');
            }

        } else {
            console.log('Error: trying to save checks data of one of the checks')
        }
    })
}

//send sms notification if the status has changed
worker.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`
    sendTwilioSms(newCheckData.userPhone, msg, (error) => {
        if (!error) {
            console.log(`User was alerted to a state change via SMS: ${msg}`)
        } else {
            console.log('Error: There was an error while sending alert sms to one of the sms')
        }
    })

}

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    if (originalCheckData && originalCheckData.id) {
        originalCheckData.state = typeof (originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';

        originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

        // pass to the next process 
        worker.performCheck(originalCheckData)
    } else {
        console.log('Error was invalid or not properly formated')
    }
}

// Loop up all the check from database
worker.gatherAllChecks = () => {
    //get all checks
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                //read the check data
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        // pass data for next process
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: error reading one of the check data')
                    }
                })
            });
        } else {
            console.log('Error: could not find any checks to process')
        }
    })
}
//timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60);
}

worker.init = () => {
    // execute all  checks
    worker.gatherAllChecks();

    //call the loop so that checks continues
    worker.loop()
}



// export 
module.exports = worker;
