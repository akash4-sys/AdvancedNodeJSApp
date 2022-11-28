// whenever jest starts up it going to load this file
// ! check out the package.json file

// @ one more way to set up timeout
// @ jest.setTimeout(50000);
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

// we are telling mongoose to make use of node js global promise
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });