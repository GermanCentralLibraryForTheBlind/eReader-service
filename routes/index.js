const express = require('express'),
    passport = require('passport'),
    request = require('request'),
    Account = require('../models/account'),
    Bookshelfs = require('../models/bookshelf'),
    router = express.Router(),
    eReaderURL = 'http://dzbvm-badi.dzbnet.local:8081';


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

    const url = eReaderURL + req.url;

    Bookshelfs.findById(req.user.bookshelf, function (err, bookshelf) {

        if (bookshelf != null && bookshelf.name !== '' && req.url === '/') {
            injectEpubContentPath(url, res, bookshelf.name);
            return;
        }
        // readable.pipe(destination)
        request(url).pipe(res);

        //console.log(bookshelf);

    });
}


// inject the user specific path for his own 
// bookshelf configuration
function injectEpubContentPath(url, res, epubs) {

    var req = request(url);
    var data = '';
    const searchFor = "urlParams['epubs'] ? urlParams['epubs'] : undefined,";
    const replaceWith = "'http://dzbvm-badi.dzbnet.local:8083/" + epubs + ".json',";

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {

        data = data.replace(searchFor, replaceWith);
        res.write(data);
        res.end();
        //console.log(data);
    });

}

function ensureAuthenticated(req, res, next) {

    //console.log("isAuthenticated  " + req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}


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
