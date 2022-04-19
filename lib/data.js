//dependencies

const fs = require('fs');
const path = require('path');

//module scaffolding

const lib = {};

// base directory of the data folder 
lib.basdir = path.join(__dirname, '/../.data/');;

// write data to file 
lib.create = function (dir, file, data, callback) {
    // open file for writting 
    fs.open(lib.basdir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            //convert to string data
            const stringData = JSON.stringify(data);

            // write data 
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing the new file')
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('Could not create new file, it may already exists')
        }
    })
}
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basdir + dir + '/' + file + '.json', 'utf-8', (err,data)=>{
        callback(err, data);
    })
}
module.exports = lib;