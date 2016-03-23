const express = require('express'),
    passport = require('passport'),
    Account = require('../models/account'),
    mongoose = require('mongoose'),
    router = express.Router(),
    Bookshelfs = mongoose.model('bookshelfs');


router.get('/', function (req, res, next) {

    return res.redirect('/register');
});

/***************************************************************************
 *  register                                                               *
 ***************************************************************************/
router.get('/register', function (req, res) {

    getBookshelfs(function (bookshelfs) {
        return res.render('register', {bookshelfs: bookshelfs});
    });
});

router.post('/register', function (req, res, next) {

    Account.register(new Account({
        username: req.body.username,
        bookshelf: req.body.bookshelf
    }), req.body.password, function (err, account) {

        if (err) {
            return getBookshelfs(function (bookshelfs) {
                res.render('register', {info: err + " Try it again.", bookshelfs: bookshelfs});
            });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                //console.log("érror: " + err)
                return getBookshelfs(function (bookshelfs) {
                    res.render('register', {bookshelfs: bookshelfs, success: 'Registration successfull!'});
                });
            });
        });
    });
});


function getBookshelfs(callback) {

    Bookshelfs.find({}, function (err, bookshelfs) {
        if (err)
            console.log(err);

        return callback(bookshelfs);
    });
}

module.exports = router;