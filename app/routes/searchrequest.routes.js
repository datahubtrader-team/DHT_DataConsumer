var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/dataprovider';

module.exports = (app) => {
    const searchrequests = require('../controllers/searchrequest.controller.js');

    /** SEARCH DATA REQUESTS */
    // Create a new search request
    app.post('/search-requests', searchrequests.create);

    // Retrieve all search requests
    app.get('/allsearchrequests', searchrequests.findAll);

    // Add AcceptedOffers to Buyers record
    app.get('/countAcceptedTrades', searchrequests.addAcceptedOffersComparewithParticipantMin);


    //=============================================================================================

    /** TRADES */
    //Send trade to Owners
    //app.get('/sendTrade', searchrequests.sendtrade);

    // GET awsurls from Trades
    app.get('/getawsurls', searchrequests.getawsurls);
}