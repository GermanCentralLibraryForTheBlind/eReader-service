const express = require('express'),
    passport = require('passport'),
    Account = require('../models/account'),
    Bookshelfs = require('../models/bookshelf'),
    router = express.Router();

/***************************************************************************
 *  register                                                               *
 ***************************************************************************/
router.get('/register', function (req, res) {

    //if(!hostCanRegister(req))
    //  return res.status(403).send('Register is Forbidden.');

    res.render('register', {});
});

router.post('/register', function (req, res, next) {

    //if(!hostCanRegister(req))
    //    return res.status(403).send('Register is Forbidden.');

    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


