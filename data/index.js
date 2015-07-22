var mongoose = require('../libs/mongoose'),
    async = require('async'),
    User = require('./models/user').User,
    funcList = {
        connectOpen: function(callback) { mongoose.connection.on('open', callback); },
        createUser: function(callback) { User({ username: 'test1', password: 'qwerty' }).save(callback); }
    };

async.series(funcList, function() {
    mongoose.disconnect();
});