// dependencies
const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    routesBookshelf = require('./routes/registerBookshelfs'),
    routesAccounts = require('./routes/registerAccounts'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    adminApp = express(),
    Account = require('./models/account');

// view engine setup
adminApp.set('views', path.join(__dirname, 'views'));
adminApp.set('view engine', 'ejs');
adminApp.use(logger('dev'));
adminApp.use(express.static(path.join(__dirname, 'public')));
adminApp.use(bodyParser.json());
adminApp.use(bodyParser.urlencoded({extended: false}));
adminApp.use(cookieParser());
adminApp.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
adminApp.use(passport.initialize());
adminApp.use(passport.session());

adminApp.use('/', routesBookshelf);
adminApp.use('/', routesAccounts);

// passport config
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// catch 404 and forward to error handler
adminApp.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (adminApp.get('env') === 'development') {
    adminApp.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
adminApp.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = adminApp;