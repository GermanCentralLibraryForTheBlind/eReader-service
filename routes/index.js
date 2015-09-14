var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var request = require('request');
var eReaderURL = 'http://dzbvm-badi.dzbnet.local:8081';


/***************************************************************************
 *  eReader                                                                *
 ***************************************************************************/

router.get('/', ensureAuthenticated, eReaderRoute);
router.get('/css/*', ensureAuthenticated, eReaderRoute);
router.get('/scripts/*', ensureAuthenticated, eReaderRoute);
router.get('/images/*', ensureAuthenticated, eReaderRoute);
router.get('/fonts/*', ensureAuthenticated, eReaderRoute);
router.get('/epub_content/*', ensureAuthenticated, eReaderRoute);

// full text search 
router.get('/matcher', ensureAuthenticated, eReaderRoute);
router.get('/search', ensureAuthenticated, eReaderRoute);

function eReaderRoute(req, res) {

    var url = eReaderURL + req.url;
    //console.log(url);
    req.pipe(request(url)).pipe(res);
}

function ensureAuthenticated(req, res, next) {

    //console.log("isAuthenticated  " + req.isAuthenticated());
    if (req.isAuthenticated())
        return next();
    
    res.redirect('/login');
}

/***************************************************************************
 *  register                                                               *
 ***************************************************************************/
//router.get('/register', function (req, res) {
//    
//    if(!hostCanRegister(req))
//      return res.status(403).send('Register is Forbidden.');
//    
//    res.render('register', {});
//});
//
//router.post('/register', function (req, res, next) {
//    
//    if(!hostCanRegister(req))
//        return res.status(403).send('Register is Forbidden.');
//    
//    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
//        if (err) {
//            return res.render("register", {info: "Sorry. That username already exists. Try again."});
//        }
//
//        passport.authenticate('local')(req, res, function () {
//            req.session.save(function (err) {
//                if (err) {
//                    return next(err);
//                }
//                res.redirect('/');
//            });
//        });
//    });
//});

//function hostCanRegister(req) {
//
//var ip = req.headers['X-Real-IP'] || req.connection.remoteAddress;
//
//    console.log(ip);
//    if (ip === '::ffff:192.168.1.135')
//      return true;
// 
//    return false;  
//}
//    
 /***************************************************************************
 *  login                                                                  *
 ***************************************************************************/
router.get('/login', function (req, res) {
    res.render('login', {user: req.user, message: req.flash('error')});
});


router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

/***************************************************************************
 *  logout                                                                 *
 ***************************************************************************/
router.get('/logout', function (req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

/***************************************************************************
 *  test                                                                   *
 ***************************************************************************/
router.get('/test', function (req, res) {
    res.status(200).send("Indeed!");
});

module.exports = router;
