var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/dataprovider';

module.exports = (app) => {
    const searchrequests = require('../controllers/searchrequest.controller.js');

    /** SEARCH DATA REQUESTS */
    // Create a new search request
    /**
     * This endpoint creates data search requests
     * @route POST /search-requests
     * @group Create data search requests
     * @param {string} email.body.required - username or email - eg: user@domain
     * @returns {object} 200 - User: {}
     * @returns {Error}  default - Unexpected error
     */
    app.post('/search-requests', searchrequests.create);

    // Retrieve all search requests
    /**
     * This endpoint retrieves all search requests
     * @route GET /allsearchrequests
     * @group GET all data search requests
     * @param {string} buyerId.query.required - buyerId
     * @returns {object} 200 - AcceptedOffers: []
     * @returns {Error}  default - Unexpected error
     */
    app.get('/allsearchrequests', searchrequests.findAll);

    // Add AcceptedOffers to Buyers record
    /**
     * This endpoint adds AcceptedOffers object to Buyer's record if offers have been accepted
     * @route GET /countAcceptedTrades
     * @group GET count accepted trades
     * @param {string} buyerId.query.required - buyerId
     * @returns {object} 200 - AcceptedOffers: []
     * @returns {Error}  default - Unexpected error
     */
    app.get('/countAcceptedTrades', searchrequests.addAcceptedOffersComparewithParticipantMin);


    //=============================================================================================

    /** TRADES */
    //Send trade to Owners
    //app.get('/sendTrade', searchrequests.sendtrade);

    // GET awsurls from Trades
    /**
     * This endpoint retrieves all AWS URLs
     * @route GET /getawsurls
     * @group GET AWS URLs
     * @param {string} email.query.required - email - eg: user@domain
     * @returns {object} 200 - AWSURLs: [{url:""}]
     * @returns {Error}  default - Unexpected error
     */
    app.get('/getawsurls', searchrequests.getawsurls);
}