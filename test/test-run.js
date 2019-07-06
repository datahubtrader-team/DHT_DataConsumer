const axios = require('axios');

const jsonfile = require('jsonfile')

const file = './data.json'
const obj = { name: 'JP' }

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// jsonfile.writeFile(file, obj, function(err) {
//     if (err) console.error(err)
//         //var words = JSON.parse(file);
//         //console.log(obj);
//     conn(obj)
// })

function conn(xx) {
    console.log(xx)
}

//TODO: Add all secrets and keys to env variables
//configuring the AWS environment
AWS.config.update({
    accessKeyId: "AKIAIODY5PFEPQONBPOA",
    secretAccessKey: "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"
});

var s3 = new AWS.S3();

function writeFile(filetoupload, data) {

    jsonfile.writeFile(filetoupload, data, function(err) {
        if (err) console.error(err)
            //var words = JSON.parse(file);
            //console.log(obj);
        conn(data)

        uploadtoAWS(filetoupload);
    })




}




function uploadtoAWS(filePath) {

    //var filePath = "./jhamm.json";
    const FILE_PERMISSION = 'public-read';

    //configuring parameters
    var params = {
        Bucket: 'hamm1',
        Body: fs.createReadStream(filePath),
        Key: Date.now() + "_" + path.basename(filePath),
        ACL: FILE_PERMISSION
    };

    s3.upload(params, function(err, data) {
        //handle error
        if (err) {
            console.log("Error", err);
        }

        //success
        if (data) {
            console.log("Uploaded in:", data.Location);

            //TODO: Add this URL to a database and to a MQ
        }
    });
}


// const fs = require('fs');
// var dict = {
//     "one": [15, 4.5],
//     "two": [34, 3.3],
//     "three": [67, 5.0],
//     "four": [32, 4.1]
// };
// var dictstring = JSON.stringify(dict);
// fs.writeFile("thing.json", dictstring);

//TODO: Pass in username and password to this function
function updateUser() {
    return axios.get('https://jhamm.hubat.net/users/access_token', {
            headers: {
                username: 'jhamm',
                password: 'Dillonjerome28',
                Accept: 'application/json',
            }
        })
        .then(function(response) {
            console.log(response.data.accessToken);
            callEndpoint(response.data.accessToken);
            //response.data.accessToken
            //return response.data;

        })
        .catch(function(error) {
            console.log(error);
            updateUser();
        });
}

updateUser();

function callEndpoint(accessToken) {
    var USER_TOKEN = accessToken;

    //TODO: Concatenate this URL with the data plug that the Owners have in their HAT
    axios.get('https://jhamm.hubat.net/api/v2/data/calendar/google/events', { headers: { 'X-Auth-Token': USER_TOKEN, 'Content-Type': 'application/json' } })
        .then(response => {
            // If request is good...
            console.log(response.data);

            //TODO: Change the file to HAT URL - data plug
            writeFile('jhamm.json', response.data)

            //TODO: Call the function to delete the local file

        })
        .catch((error) => {
            console.log('error ' + error);
        });

    // const AuthStr = ''.concat(USER_TOKEN);

}

//TODO: Delete the generated file

// console.log(updateUser());

// var USER_TOKEN = response.data.accessToken;

// axios.get('https://jhamm.hubat.net/api/v2/data/calendar/google/events', { headers: { 'X-Auth-Token': USER_TOKEN, 'Content-Type': 'application/json' } })
//     .then(response => {
//         // If request is good...
//         console.log(response.data);
//     })
//     .catch((error) => {
//         console.log('error ' + error);
//     });

//const AuthStr = ''.concat(USER_TOKEN);