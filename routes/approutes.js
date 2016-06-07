/**
 * Created by williamdiaz on 7/29/15.
 */
"use strict";

/**
 * Regular classes
 * @type {*}
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var cookies = require("cookies");
var session = require('cookie-session');
var timeout = require('connect-timeout');
var log = require('log');
var error_log = new log('warning');
var app_dirname = global.app_dirname;

/**
 * Helpers
 * @type {*}
 */

var routesHelper = require(app_dirname + '/helpers/routes_helper');

/**
 * Middlewares
 * @type {*}
 */
var authorizeMiddleware = require(app_dirname + '/middlewares/authenticator');


/**
 *
 * @type {exports}
 */
var customMiddlewares = require('./appmiddlewares');

module.exports = {

    initApp: function(app) {

        var routes = require(app_dirname + '/routes/appmethods');

        /**
         *  App handlers
         */
        var jsonParser = bodyParser.json({
            limit: "500mb"
        });


        /**
         *  General Get method
         */

        app.all('/', function(req, res) {
            res.status(200).json({
                success: true,
                result: 'Please provide a method name for the API.'
            });
        });


        /**
         *  Api Get method
         */

        app.all('/api', function(req, res) {
            res.status(200).json({
                success: true,
                result: 'Please provide the correct crud method names for the API.'
            });
        });


        /**
         * Get method with method name and action name as parameters via pluralizers
         */
        app.get('/api/:methodname?/:param_1?/:param_2?/:param_3?/:param_4?/:param_5?/:param_6?/:param_7?/:param_8?/:param_9?/:param_10?', jsonParser, authorizeMiddleware.authenticateUser, customMiddlewares.initMiddlewares, timeout('50000'), function(req, res) {
                try {
                    var callback = function(data) {
                        if (data.statuserror) {
                            res.status(data.statuserror).json({
                                success: false,
                                result: data
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                result: data
                            });
                        }
                    };
                    routes.initMethod(req.params.methodname, routesHelper.validateRequest(req, req.method), routesHelper.validateArguments(req.params), req.method, callback);
                } catch (e) {
                    error_log.error(e);
                }
            },
            function(error, req, res, next) {
                if (req.timedout) {
                    res.status(500).json({
                        success: false,
                        result: {
                            statuserror: 500,
                            message: 'Request timed out',
                            error: error
                        }
                    });
                } else {
                    next(error);
                }
            }
        )


        /**
         *  Post method with method name and action name as parameters via pluralizers
         */
        app.post('/api/:methodname?/:param_1?/:param_2?/:param_3?/:param_4?/:param_5?/:param_6?/:param_7?/:param_8?/:param_9?/:param_10?', jsonParser, authorizeMiddleware.authenticateUser, customMiddlewares.initMiddlewares, timeout('50000'), function(req, res) {
                try {
                    var callback = function(data) {
                        if (data.statuserror) {
                            res.status(data.statuserror).json({
                                success: false,
                                result: data
                            });
                        } else {
                            if (data.parsed) {
                                res.status(200).json(data);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    result: data
                                });
                            }
                        }
                    };
                    routes.initMethod(req.params.methodname, routesHelper.validateRequest(req, req.method), routesHelper.validateArguments(req.params), req.method, callback);
                } catch (e) {
                    error_log.error(e);
                }
            },
            function(error, req, res, next) {
                if (req.timedout) {
                    res.status(500).json({
                        success: false,
                        result: {
                            statuserror: 500,
                            message: 'Request timed out',
                            error: error
                        }
                    });
                } else {
                    next(error);
                }
            }
        )


        /**
         *  Delete method with method name and action name as parameters via pluralizers
         */
        app.delete('/api/:methodname?/:param_1?/:param_2?/:param_3?/:param_4?/:param_5?/:param_6?/:param_7?/:param_8?/:param_9?/:param_10?', jsonParser, authorizeMiddleware.authenticateUser, customMiddlewares.initMiddlewares, timeout('50000'), function(req, res) {
                try {
                    var callback = function(data) {
                        if (data.statuserror) {
                            res.status(data.statuserror).json({
                                success: false,
                                result: data
                            });
                        } else {
                            if (data.parsed) {
                                res.status(200).json(data);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    result: data
                                });
                            }
                        }

                    };
                    routes.initMethod(req.params.methodname, routesHelper.validateRequest(req, req.method), routesHelper.validateArguments(req.params), req.method, callback);
                } catch (e) {
                    error_log.error(e);
                }
            },
            function(error, req, res, next) {
                if (req.timedout) {
                    res.status(500).json({
                        success: false,
                        result: {
                            statuserror: 500,
                            message: 'Request timed out',
                            error: error
                        }
                    });
                } else {
                    next(error);
                }
            }
        )


        /**
         *  Put method with method name and action name as parameters via pluralizers
         */
        app.put('/api/:methodname?/:param_1?/:param_2?/:param_3?/:param_4?/:param_5?/:param_6?/:param_7?/:param_8?/:param_9?/:param_10?', timeout('50000'), authorizeMiddleware.authenticateUser, customMiddlewares.initMiddlewares, timeout('50000'), function(req, res) {
                try {
                    var callback = function(data) {
                        if (data.statuserror) {
                            res.status(data.statuserror).json({
                                success: false,
                                result: data
                            });
                        } else {
                            if (data.parsed) {
                                res.status(200).json(data);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    result: data
                                });
                            }
                        }

                    };
                    routes.initMethod(req.params.methodname, routesHelper.validateRequest(req, req.method), routesHelper.validateArguments(req.params), req.method, callback);
                } catch (e) {
                    error_log.error(e);
                }
            },
            function(error, req, res, next) {
                if (req.timedout) {
                    res.status(500).json({
                        success: false,
                        result: {
                            statuserror: 500,
                            message: 'Request timed out',
                            error: error
                        }
                    });
                } else {
                    next(error);
                }
            }
        )

    }

};