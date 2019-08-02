var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const cryptoRandomString = require('crypto-random-string');

function createArray() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var generateOfferId = cryptoRandomString({ length: 6 });
        var dbo = db.db("BuyerDB");
        var myquery = { "email": "99" };
        var test = { OfferAccepted: generateOfferId };
        dbo.collection("users").updateMany(myquery, { $push: { test } }, function(err, res) {
            if (err) throw err;
            console.log(res);
            db.close();
        });


    });
}

//Add to OffersAccepted Object
function AddtoArray() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var generateOfferId = cryptoRandomString({ length: 6 });
        var dbo = db.db("BuyerDB");
        var myquery = { "email": "99" };
        //var test = { OfferAccepted: generateOfferId };
        var test = { OfferAccepted: generateOfferId };
        var testy = { "pp": "oo" };
        dbo.collection("users").updateMany(myquery, { $push: { offersAccepted: testy } }, function(err, res) {
            if (err) throw err;
            //console.log(res);
            db.close();
        });


    });
}

//AddtoArray();

//Search for OfferAcceptedId
function AddtoArrayTwo() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var generateOfferId = cryptoRandomString({ length: 6 });
        var dbo = db.db("BuyerDB");
        var myquery = { "email": "99" };

        //var query = { test: [{ $elemMatch: "8dfef2" }] };

        var newvalues = { offersAccepted: { $push: { trade: "tradeRequest" } } };

        //var test = { OfferAccepted: generateOfferId };
        dbo.collection("users").updateMany(myquery, newvalues,
            function(err, res) {
                if (err) throw err;
                console.log(res);
                db.close();
            });


    });
}

AddtoArrayTwo();

function ArrayinArray() {

}