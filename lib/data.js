//dependencies

const fs = require('fs');
const path = require('path');

//module scaffolding

const lib = {};

// base directory of the data folder 
lib.basedir = path.join(__dirname, '/../.data/');;

// write data to file 
lib.create = function (dir, file, data, callback) {
    // open file for writting 
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            //convert to string data
            const stringData = JSON.stringify(data);

            // write data 
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing the new file')
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback(`Could not create new file, it may already exists${err}`)
        }
    })
}

// read file 
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data);
    })
}

//update existing file
lib.update = (dir, file, data, callback) => {
    //open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //convert data to string
            const stringData = JSON.stringify(data);
            //truncate file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    // write to the file and close it 
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            // close the file 
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing file')
                                }
                            })
                        } else {
                            callback('Error writing to the file')
                        }
                    })
                } else {
                    console.log(`Error truncating file`)
                }
            })
        } else {
            callback('Error opening file')
        }
    })
}

// Delete file 
lib.delete = (dir, file, callback) => {
    //unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback(`Error deleting file`)
        }
    })
}
module.exports = lib;