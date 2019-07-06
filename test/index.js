const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

//configuring the AWS environment
AWS.config.update({
    accessKeyId: "AKIAIODY5PFEPQONBPOA",
    secretAccessKey: "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"
});

var s3 = new AWS.S3();
var filePath = "./jhamm.json";

//configuring parameters
var params = {
    Bucket: 'hamm1',
    Body: fs.createReadStream(filePath),
    Key: Date.now() + "_" + path.basename(filePath)
};

s3.upload(params, function(err, data) {
    //handle error
    if (err) {
        console.log("Error", err);
    }

    //success
    if (data) {
        console.log("Uploaded in:", data.Location);
    }
});