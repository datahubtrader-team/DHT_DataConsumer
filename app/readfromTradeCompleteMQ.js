#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectID = require("bson-objectid");

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'tradeAccepted';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            saveCompletedTradetoDB(msg.content.toString());

            //TODO: Get the Buyer Id or email to do a DB lookup before storing the AWS URL

        }, {
            noAck: true
        });
    });
});

// Store completedTrade AWS URL to DataProvider
function saveCompletedTradetoDB(awsurl) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BuyerDB");

        var BuyerId = { _id: ObjectID("5d39a818372688f09a911c1a") };
        var newvalues = { $push: { AWSURL: { url: awsurl } } };
        //TODO: Need to query with the id of the offersandtrade object
        dbo.collection("users").findOneAndUpdate(BuyerId, newvalues, function(err, doc) {
            if (err) throw err;
            console.log("Save AWS URL");

            //TODO: Add AWS URL to completed queue after storing it to BuyerDB

            db.close();
        });

    });
}