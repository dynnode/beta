"use strict";

/**
 *
 */
global.app_dirname;
var app_dirname = global.app_dirname;
var mongoDb = require(app_dirname + '/databases/mongoose/' + process.env.DB_ENGINE);
var document_validator = require(app_dirname + '/helpers/document_validator');

var crypt = require(app_dirname + '/helpers/crypt');
var webtoken = require(app_dirname + '/helpers/webtoken');

/**
 *
 * @type {exports}
 */
var accountsParser = require(app_dirname + '/components/accounts/accounts_parser');
var accountsModel = require(app_dirname + '/components/accounts/accounts_model');

module.exports = {

    /**
     *
     * @param payload
     * @param args
     * @param request_type
     * @param callback
     * method POST
     */
    authorize_user: function (payload, args, request_type, callback) {

        if (request_type === "POST") {

            var responsePayload = {
                username: (payload.request) ? payload.request.username : '',
                password: 'REDACTED'
            };

            /**
             * Validation fields
             * @type {string[]}
             */
            var validationFields = ['username', 'password'];
            if (!document_validator.validatedocument(validationFields, payload.request)) {
                return callback({
                    statuserror: 400,
                    module: 'authentication',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: responsePayload
                });
            }

            var auth_payload = {
                account_username: payload.request.username
            }

            mongoDb.authenticateData(auth_payload, accountsModel, function (data) {


                if (data.statuserror) {

                    return callback({
                        statuserror: data.statuserror,
                        message: 'Incorrect username/password combination.',
                        response: responsePayload
                    });


                } else {

                    crypt.compare(payload.request.password, data.response[0].account_password, function (err, response) {

                        if (response) {

                            var jwtData = {
                                account_hash: data.response[0].hash,
                                account_role_hash: data.response[0].account_role_hash,
                                account_activation_confirmed: data.response[0].account_activation_confirmed
                            };

                            var token = webtoken.setToken(jwtData, {
                                expiresIn: 86400 // expires in 24 hours
                            })

                            /**
                             *
                             */
                            if (token) {

                                if (!data.response[0].account_activation_confirmed) {
                                    return callback({
                                        statuserror: 401,
                                        message: 'Your account has not been activated. Please check the email you provided when signed up and click on the link we sent you to continue.',
                                        response: 'Account not activated'
                                    });
                                } else {
                                    var userInformation = {
                                        hash: data.response[0].hash,
                                        account_email: data.response[0].account_email,
                                        account_username: data.response[0].account_username,
                                        account_firstname: data.response[0].account_firstname,
                                        account_lastname: data.response[0].account_lastname,
                                        account_activation_confirmed: data.response[0].account_activation_confirmed,
                                        account_role: data.response[0].account_role,
                                        account_type: data.response[0].account_type,
                                        parent_hash: data.response[0].parent_hash,
                                        customer_hash: data.response[0].parent_hash,
                                        customer: data.response[0].customer,
                                        created_at: data.response[0].created_at,
                                        updated_at: data.response[0].updated_at
                                    }


                                    return callback({
                                        status: 200,
                                        message: 'Authentication successful',
                                        response: {
                                            "token": token,
                                            "userInfo": userInformation
                                        }
                                    })


                                }
                            }

                        } else {
                            return callback({
                                statuserror: 401,
                                message: 'Incorrect username/password combination.',
                                response: err || 'Bad password format.'
                            })
                        }
                    });
                }
            });

        } else {
            return callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }


    },
    validateUser: function (account_hash, callback) {
        var auth_payload = {
            hash: account_hash
        }
        mongoDb.authenticateData(auth_payload, accountsModel, function (data) {
            if (data.statuserror) {
                return callback({
                    statuserror: 401,
                    message: 'Incorrect username/password combination.',
                    response: data
                });
            } else {
                return callback(data);
            }
        });
    }
};