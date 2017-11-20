var mongoose = require('mongoose');

// Select Promise third party
// Use bluebird
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/Todos', {
    useMongoClient: true
});

module.exports = {mongoose};