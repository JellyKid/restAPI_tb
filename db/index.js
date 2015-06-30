var mongoose = require('mongoose'),
    config = require('../config'),
    tweetschema = require('./schemas/tweet'),
    userschema = require('./schemas/user');

var connection = mongoose.createConnection(
    config.get('database:host'), 
    config.get('database:name'), 
    config.get('database:port')
);

connection.model('User', userschema);
connection.model('Tweet', tweetschema);

module.exports = connection;