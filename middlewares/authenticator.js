/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";
global.app_dirname;


/**
 * Configs & helpers
 */

var webtoken = require(app_dirname + '/helpers/webtoken');

/**
 * Account Class
 * @type {*}
 */
var authentication = require(app_dirname + '/components/authentication/authentication');

module.exports = {

    /**
     * Authenticate the user using jtw
     * @param req
     * @param res
     * @param callback
     */
    authenticateUser: function (req, res, next) {
        if (req.headers && req.headers['x-access-token']) {
            webtoken.checkToken(req, function (sucess, response) {
                if (sucess) {
                    /**
                     * Validate user
                     */
                    authentication.validateUser(response.decoded.account_hash, function (validation_response) {
                        if (validation_response.status === 200) {
                            req.account_info_session = validation_response.response[0];
                            console.log('auth fired');
                            next();
                        } else {
                            res.status(403).json({
                                statuserror: 403,
                                success: false,
                                message: 'You are not authorized to make this call.'
                            });
                        }
                    });
                } else {
                    req.account_info_session = {};
                    res.status(403).json({
                        statuserror: 403,
                        success: false,
                        message: 'You are not authorized to make this call.'
                    });
                }
            });
        } else {
            if ((req.params.methodname === "accounts" && req.method === "POST" && (req.params.param_2) ? req.params.param_2 : req.params.param_1 === "add_account") || (req.params.methodname === "authentication" && req.method === "POST" && (req.params.param_2) ? req.params.param_2 : req.params.param_1 === "authorize_user")) {
                req.account_info_session = {};
                console.log('auth fired2');
                next();
            } else {
                req.account_info_session = {};
                res.status(401).json({
                    statuserror: 401,
                    success: false,
                    message: 'You are not authorized to make this call.'
                });
            }
        }
    }
}

