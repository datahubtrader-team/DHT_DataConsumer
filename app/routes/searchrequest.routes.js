var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/dataprovider';

module.exports = (app) => {
    const searchrequests = require('../controllers/searchrequest.controller.js');

    // Create a new search request
    app.post('/search-requests', searchrequests.create);


    // Retrieve all search requests
    app.get('/searchrequests', searchrequests.findAll);

    /**
    // Retrieve a single user with userId
    app.get('/registerusers/:registeruserId', registerusers.findOne);

    // Update a user with userId
    app.put('/registerusers/:registeruserId', registerusers.update);

    // Delete a user with userId
    app.delete('/registerusers/:registeruserId', registerusers.delete);

    **/
}