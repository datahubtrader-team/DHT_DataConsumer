var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const ObjectID = require('mongodb').ObjectID;

//Update Buyer's record with AcceptedOffer
function SendOfferAcceptedtoBuyer() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        //var generateOfferId = cryptoRandomString({ length: 6 });
        var dbo = db.db("BuyerDB");
        var myquery = { _id: new ObjectID("5d2a290219ce5656e13e57dd") };

        //var query = { test: [{ $elemMatch: "8dfef2" }] };

        var offersAccepted = {
            offerId: "5d3e14a9648da9c6a7d2b563",
            buy_data: "spotify",
            value: "0.00",
            offerAccepted: true,
            trade: null,
            OwnerId: "123"
        };


        //dbo.collection("users").findOne(myquery,
        dbo.collection("users").updateMany(myquery, { $push: { offersAccepted } },
            function(err, res) {
                if (err) throw err;
                //console.log(res);


                //CountrecordsinDB(offersAccepted.offerId);
                db.close();
            });


    });
}

//SendOfferAcceptedtoBuyer();
var buyerId = "5d2a290219ce5656e13e57dd";
CountrecordsinDB(buyerId, "5d3e14a9648da9c6a7d2b563");

//Count offersAccepted by OfferId and then compare with participant min
function CountrecordsinDB(buyerId, offersID) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BuyerDB");
        var query = {
            _id: new ObjectID(buyerId)
        };
        dbo.collection("users").find(query).toArray(function(err, result) {
            if (err) throw err;

            let count = 0;
            let offers = "";
            let OwnersID = "";
            result[0].offersAccepted.forEach(function(element) {
                //console.log(element);
                if (element.offerId == offersID) {
                    console.log(element);
                    count++;
                    offers = element.offerId;
                    OwnersID = element.OwnerId;
                }

            });
            //uu(count);
            console.log(count);
            //console.log(offers);

            //TODO: Do a search for search data req using searchrequests Id

            var queryoffers = {
                _id: new ObjectID(offers)
            };
            dbo.collection("searchrequests").find(queryoffers).toArray(function(err, result) {

                console.log(result);

                //TODO: If count == participant_min using the searchrequests Id
                var participantMin = parseInt(result[0].participant_min);
                console.log(participantMin);
                if (count == participantMin) {
                    console.log("send trades");

                    //TODO: Send trades to Owners by Owner's Id

                    console.log(OwnersID);
                } else {
                    console.log("No equal");
                }
            });

            db.close();
        });
    });
}


//cc("5d3e14a9648da9c6a7d2b563");

function cc(offersID) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BuyerDB");
        var query = {
            _id: new ObjectID("5d2a290219ce5656e13e57dd"),
            offersAccepted: { $elemMatch: { offerId: offersID } }
        };
        dbo.collection("users").aggregate([{
            '$count': offersID
        }]).toArray(function(err, res) {
            if (err) throw err;
            //console.log(JSON.stringify(res));
            console.log(res[0]);
            db.close();
        });
    });
}