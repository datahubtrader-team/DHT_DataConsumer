const SearchRequest = require('../models/searchRequest.model.js');
//const statusUpdate = require('../enums/enum.js');
var amqp = require('amqplib/callback_api');

var rest = require('rest-facade');
require('dotenv').config()

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// Post search request to data owners
exports.create = (req, res) => {
    // Validate request
    if (!req.body.message) {
        return res.status(400).send({
            message: "Search request can not be empty " + req.body
        });
    }
    res.status(201);

    // Create a search request
    // Add Id to each search
    var searchReq = new SearchRequest({
        search: req.body.search || "Unknown search",
        participant_min: req.body.participant_min,
        participant_max: req.body.participant_max,
        activity: req.body.activity,
        deadline: req.body.deadline
    });
    //TODO: Add Buyers name/email and Id to search request entry in the Buyers DB in searchrequests collection

    // Save search requests in the database
    searchReq.save()
        .then(data => {
            res.send(data);

            SendOffers(data.search);

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a user."
            });
        });
};

function SendOffers(requestedPlug) {
    //console.log(offers);
    //Read and then update

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");
        var myquery = { plug: requestedPlug }; //requestedPlug
        var offer = {
            "buy_data": requestedPlug,
            "value": "0.00"
        };
        dbo.collection("users").update(myquery, { $push: { offer } }, function(err, res) {
            if (err) throw err;
            //console.log(res);
            db.close();
        });
    });


}




// Retrieve and return all SearchRequests from the database.
exports.findAll = (req, res) => {
    SearchRequest.find()
        .then(SearchRequest => {
            res.send(SearchRequest);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving SearchRequests."
            });
        });
};

/**
// Find a single user with a userID
exports.findOne = (req, res) => {
    RegisterUser.findById(req.params.registeruserId)
        .then(registeruser => {
            if (!registeruser) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.registeruserId
                });
            }
            res.send(registeruser);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.registeruserId
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.registeruserId
            });
        });
};

// Update a registered user identified by the registeruserId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Registered user content can not be empty"
        });
    }

    // Find user and update it with the request body
    RegisterUser.findByIdAndUpdate(req.params.registeruserId, {
            firstName: req.body.firstName || "Unknown firstName",
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }, { new: true })
        .then(registeruser => {
            if (!registeruser) {
                return res.status(404).send({
                    message: "User not found with that id " + req.params.registeruserId
                });
            }
            res.send(registeruser);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User can not be found with that id " + req.params.registeruserId
                });
            }
            return res.status(500).send({
                message: "Error updating a user with id " + req.params.registeruserId
            });
        });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    RegisterUser.findByIdAndRemove(req.params.registeruserId)
        .then(registeruser => {
            if (!registeruser) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.registeruserId
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.registeruserId
                });
            }
            return res.status(500).send({
                message: "Could not delete a user with id " + req.params.registeruserId
            });
        });
};


**/