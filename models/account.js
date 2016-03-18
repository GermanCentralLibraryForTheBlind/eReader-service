const mongoose = require('mongoose'),
     passportLocalMongoose = require('passport-local-mongoose');


var account = new mongoose.Schema({
    username: String,
    password: String,
    bookshelf: { type: mongoose.Schema.Types.ObjectId, ref: 'bookshelfs' }
});

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', account);