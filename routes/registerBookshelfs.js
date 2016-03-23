const express = require('express'),
    Bookshelf = require('../models/bookshelf'),
    router = express.Router();


router.get('/bookshelf', function (req, res) {

    res.render('bookshelf', {});
});

router.post('/bookshelf', function (req, res, next) {

    var bookshelf = new Bookshelf({name: req.body.name});

    bookshelf.save(function (err) {
        if (err) 
            return next(err);
        
        res.redirect('/bookshelf');
    });
});

module.exports = router;
