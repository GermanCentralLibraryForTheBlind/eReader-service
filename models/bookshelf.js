const mongoose = require('mongoose');

var bookshelf = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('bookshelfs', bookshelf);