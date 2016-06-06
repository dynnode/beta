"use strict";
/**
 *  Node modules
 * @type {exports}
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookies = require("cookies");
var session = require('cookie-session');

require('dotenv-safe').load();
/**
 * Global variables
 * @type {*}
 */
global.app_dirname = __dirname;

/**
 *  Custom modules
 * @type {exports}
 */

var approutes = require('./routes/approutes');
app.use(cookieParser());
app.use(session({
    name: process.env.APP_SAFE_NAME,
    secret: process.env.CRYPT_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    signed: true,
    httpOnly: false,
    cookie: {
        secure: true,
        maxAge: 3600000
    }
}));
/**
 *  Seesion headers
 */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, X-Access-Token, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});
/**
 *  Do routes method
 */
approutes.initApp(app);
/**
 *  Init the server
 */

var server = app.listen(process.env.APP_PORT, function () {
    var appname = process.env.APP_NAME;
    var host = server.address().address;
    var port = server.address().port;
    console.log('Enviroment: %s', process.env.ENVIRONMENT_NAME);
    console.log("%s app listening at http://%s:%s", appname, host, port);
});