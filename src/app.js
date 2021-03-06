var createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
var logger = require('morgan');
swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
const opn = require('opn');

// create express app
const app = express();
const expressSwagger = require('express-swagger-generator')(app);

// parse application/x-www-form-urlencoded && parse application/json
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuring the database
const dbConfig = require('../config/database.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to the Data provider service. Creating a new dataprovider msg. Organise and and store cusotmer dataprovider details." });
});

//require('./app/routes/dataprovider.routes.js')(app);
require('./routes/searchrequest.routes.js')(app);

app.all('', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Vary', "Origin");
});

const port = 4025;
let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:' + port,
        basePath: '',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/searchrequest.routes.js'] //Path to the API handle folder
};

expressSwagger(options)
opn('http://localhost:' + port + '/api-docs')

// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});

module.exports = app;