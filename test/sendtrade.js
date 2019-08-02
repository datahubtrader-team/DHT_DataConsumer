var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const ObjectID = require('mongodb').ObjectID;

//const OwnersId = "5d3e124cd9f78b6e4414beb6";

var v = "spotify";

sendtrades(v)

function sendtrades(vv) {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");

        var myquery = {
            "offer.buy_data": vv
                //"email": req.query.email
        };

        console.log(myquery);
        // logger.info("Send trade to Owners - POST /sendTrade endpoint");
        // logger.info("Request payload: " + req.body);

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
                    // logger.info("Response body : " + result);

                    db.close();
                });
            } else {
                console.log("Incorrect trade status: " + result);
                // logger.error("Inccorect trade request : " + result);
                //res.send({ error: "Incorrect trade status" });
            }
            db.close();
        });

    });

}