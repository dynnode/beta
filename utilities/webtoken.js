"use strict";
global.app_dirname;
var jwt = require('jsonwebtoken');
var authentication_secret = process.env.CRYPT_AUTHENTICATION_SECRET;

module.exports = {
    checkToken: function (payload, callback) {
        var token = payload.headers['x-access-token'];
        /**
         *  var token = payload.body.token || payload.query.token || payload.headers['x-access-token'];
         *  decode token
         */
        if (token) {
            /**
             * verifies secret and checks exp
             */
            jwt.verify(token, authentication_secret, function (err, decoded) {
                if (err) {
                    return callback(false, {
                        statuserror: 401,
                        message: 'Failed to authenticate token.',
                        response: err.name + ' - ' + err.message
                    });
                } else {
                    /**
                     * if everything is good, save to request for use in other routes
                     * @type {*}
                     */

                    payload.decoded = decoded;
                    return callback(true, payload);
                }
            });
        } else {
            return callback(false, {
                statuserror: 401,
                message: 'No token provided.',
                response: 'Failed to authenticate token.'
            });
        }
    },
    setToken: function (payload, options) {
        return jwt.sign(payload, authentication_secret, options);
    }
};