var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//Example of how to read from a MongoDB
function ReadfromDB() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");
        var query = { email: "4" };
        dbo.collection("users").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result[0].email);
            db.close();
        });
    });
}
//ReadfromDB();

//Count records in a collection
function CountrecordsinDB() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("OwnerDB");
        var query = { email: "4" };
        dbo.collection("users").countDocuments(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
}

CountrecordsinDB();

//Add to document to a collection


//Update an existing collection with data
/** 
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("OwnerDB");
    var myquery = { email: "4" };
    var newvalues = { $set: { xx: "Mickey", yy: "Canyon 123" } };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
    });
}); 
**/

//Update an existing collection with json array data
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("OwnerDB");
    var myquery = { email: "3" };
    var object6 = [
        { "subject": "maths" },
        { "subject": "chem" },
        { "subject": "english" }
    ];
    dbo.collection("users").update(myquery, { $push: { object6 } }, function(err, res) {
        if (err) throw err;
        console.log(res);
        db.close();
    });
});

//Read data from array in DB
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("OwnerDB");
//     //var query = { "name": "3" };
//     var query = {
//         "object1": { $elemMatch: "maths" }
//     };
//     dbo.collection("users").find(query).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });

//Read from the HAT /applications endpoint to see which plugs that the Owners has
/*
var jsonData = JSON.parse(responseBody);
console.log(jsonData[19].application.id);

var plugs = jsonData;

plugs.forEach(function(element) {
  //console.log(element);
    if (element.active === true){
        //console.log("Got this plug");
        console.log(element.application.id);
        console.log("URL: ", element.application.status.recentDataCheckEndpoint);
    }
});

//if (jsonData[19].application.id == "spotify" && jsonData[19].active === true){
    console.log("Got this plug");
//}
*/

//