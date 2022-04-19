/*
*Title: Environments
*Description: handle all environment related things
*Author: Md Nakibul Hosen Nahid (Origin: learn with Sumit)
*Date: 19/04/22
*
*/

// dependencies

// module scaffolding

const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging'
}

environments.production = {
    port: 5000,
    envName: 'production'
}

// determine which environment was passed 

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging' ;

console.log(currentEnvironment)
//Export corresponding environment object

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;