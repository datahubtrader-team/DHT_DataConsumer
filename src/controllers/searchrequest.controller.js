const SearchRequest = require('../models/searchRequest.model.js');
//const statusUpdate = require('../enums/enum.js');
var amqp = require('amqplib/callback_api');

var rest = require('rest-facade');
require('dotenv').config()

const ObjectID = require('mongodb').ObjectID;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//Generate random guid for each offer
const cryptoRandomString = require('crypto-random-string');

// Logger lib
var logger = require('../../node_modules/logger').createLogger(); // logs to STDOUT
var logger = require('../../node_modules/logger').createLogger('development.log'); // logs to a file

// Post search request to data owners
exports.create = (req, res) => {
    logger.info("Data search request - POST /search-requests endpoint");
    // Validate request
    if (!req.body.message) {
        logger.error("Search request can not be empty " + req.body);
        return res.status(400).send({
            message: "Search request can not be empty " + req.body
        });
    }
    res.status(201);
    logger.info("Request payload: ", req.body);

    // Create a search request
    var searchReq = new SearchRequest({
        search: req.body.search || "Unknown search",
        participant_min: req.body.participant_min,
        participant_max: req.body.participant_max,
        activity: req.body.activity,
        deadline: req.body.deadline,
        buyerId: req.body.buyerId
    });

    // Save search requests in the database
    searchReq.save()
        .then(data => {
            res.send(data);
            logger.info("Response body: " + data);
            SendOffers(data._id, data.search, data.buyerId);
            console.log(data._id);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a data search request."
            });
        });
};

//Send Offers to data owners
function SendOffers(OfferTradeId, requestedPlug, buyerId) {

    // Save offers to Owners records in the OwnerDB
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");

        //TODO: Need to do a search in the RPlug array for the different data plugs
        var myquery = {
            //email: "4",
            RPlug: { $elemMatch: { plug: requestedPlug } }
        };
        var offer = {
            "offerId": OfferTradeId,
            "buy_data": requestedPlug,
            "value": "0.00",
            "offerAccepted": null,
            "trade": null,
            "buyerId": buyerId
        };

        logger.info("Offer object appended to Owner's record: " + offer);

        dbo.collection("users").updateMany(myquery, { $push: { offer } }, function(err, res) {
            if (err) throw err;
            console.log(res);
            logger.info("Offer object response: " + res);
            db.close();
        });

    });
}


//GET endpoint to check if the elements in the OffersAccepted object matches 
// the participant_min. If it does, then send a trade request to all Owners
//Maybe do it as a separate service
exports.addAcceptedOffersComparewithParticipantMin = (req, res) => {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BuyerDB");
        var query = {
            _id: new ObjectID(req.query.buyerId)
        };
        dbo.collection("users").find(query).toArray(function(err, result) {
            if (err) throw err;

            let count = 0;
            let offers = "";
            let OwnersID = "";
            let buyData = "";
            let resultBody = result[0].offersAccepted;
            //var element = result[0];
            resultBody.forEach(function(element) {
                console.log(element);
                if (element.offerId == req.query.offersID) {
                    //console.log(element);
                    count++;
                    offers = element.offerId;
                    OwnersID = element.OwnerId;
                    buyData = element.buy_data;
                }

            });
            //uu(count);
            console.log(count);
            //console.log(offers);

            //TODO: Do a search for search data req using searchrequests Id

            var queryoffers = {
                _id: new ObjectID(offers)
            };
            console.log(queryoffers);

            dbo.collection("searchrequests").find(queryoffers).toArray(function(err, result) {

                console.log(result);

                //TODO: If count == participant_min using the searchrequests Id
                var participantMin = parseInt(result[0].participant_min);
                console.log(participantMin);
                if (count == participantMin) {
                    console.log("send trades");

                    //TODO: Send trades to Owners by Owner's Id
                    res.send({ message: "send trades" });

                    console.log(OwnersID);
                    console.log(buyData);
                    sendtrades(buyData);
                } else {
                    res.send({ error: "No equal" });
                    console.log("No equal");
                }
            });

            db.close();
        });
    });

};

function sendtrades(requestedTrade) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");

        var myquery = {
            "offer.buy_data": requestedTrade
                //"email": req.query.email
        };

        console.log(myquery);
        logger.info("Send trade to Owners - POST /sendTrade endpoint");
        logger.info("Request payload: " + myquery);

        dbo.collection("users").find(myquery).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            //
            if (result[0].offer[0].trade == null) {

                dbo.collection("users").findOneAndUpdate(myquery, { $set: { "offer.$.trade": "tradeRequested" } }, function(err, result) {
                    if (err) throw err;

                    console.log(err);
                    //res.send(result);
                    console.log(result);
                    logger.info("Response body : " + result);

                    db.close();
                });
            } else {
                console.log("Incorrect trade status: " + result);
                logger.error("Inccorect trade request : " + result);
                //res.send({ error: "Incorrect trade status" });
                console.log({ error: "Incorrect trade status" });
            }
            db.close();
        });

    });
}

/** 
//TODO: Add AcceptedOffers to Buyers record
//Send Trades to Owners - update trade status
//TODO: turn this into a function
exports.sendtrade = (req, res) => {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");

        var myquery = {
            "offer.buy_data": req.query.plug
                //"email": req.query.email
        };

        console.log(myquery);
        logger.info("Send trade to Owners - POST /sendTrade endpoint");
        logger.info("Request payload: " + req.body);

        dbo.collection("users").find(myquery).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            //
            if (result[0].offer[0].trade == null) {

                dbo.collection("users").findOneAndUpdate(myquery, { $set: { "offer.$.trade": "tradeRequested" } }, function(err, result) {
                    if (err) throw err;

                    console.log(err);
                    res.send(result);
                    logger.info("Response body : " + result);

                    db.close();
                });
            } else {
                console.log("Incorrect trade status: " + result);
                logger.error("Inccorect trade request : " + result);
                res.send({ error: "Incorrect trade status" });
            }
            db.close();
        });

    });

};
**/

// Retrieve and return all SearchRequests from the database.
// TODO: Return searches that match the Buyers Id and email
exports.findAll = (req, res) => {
    SearchRequest.find()
        .then(SearchRequest => {
            res.send(SearchRequest);
            logger.info("Request: " + SearchRequest);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving SearchRequests."
            });
        });
};

// GET AWS URLs from Trades
exports.getawsurls = (req, res) => {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BuyerDB");
        var query = { email: req.query.email };
        //TODO: Use Buyer's Id to query the DB

        logger.info("GET AWS URLs");
        logger.info("Request body : " + query);

        dbo.collection("users").findOne(query, function(err, result) {
            if (err) throw err;

            var awsurls = result.AWSURL;

            res.send(awsurls);
            logger.info("Response body: " + result);
            db.close();
        });
    });
};