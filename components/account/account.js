"use strict";
/*global global: false, app_dirname: false */
/*jshint -W030 */
/**
 * Configs and Utilities
 * @type {appconfig.app_dirname|*}
 */
global.app_dirname;
var app_dirname = global.app_dirname;
var mongoDb = require(app_dirname + '/databases/mongoose/' + process.env.DB_ENGINE);
var documentValidator = require(app_dirname + '/utilities/documentvalidator');

/**
 * Modules
 * @type {exports}
 */
var accountParser = require('./account_parser');
var accountModel = require('./account_model');

/**
 * Crypt Library
 * @type {*}
 */
var crypt = require(app_dirname + '/utilities/crypt');

module.exports = {

    get_account: function (payload, args, request_type, callback) {
        if (request_type === "GET") {
            /**
             * Validation fields
             * @type {string[]}
             */
            var validationFields = ['account_hash'];
            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'accounts',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }


            mongoDb.getAllDataRef(payload.request, accountModel, function (data) {
                accountParser.parseResponse(data, callback);
            });

        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }
    },
    add_account: function (payload, args, request_type, callback) {

        if (request_type === "POST") {
            /**
             * Validation fields
             * @type {string[]}
             */
            var validationFields =  ['account_username', 'account_email', 'account_password', 'account_firstname', 'account_lastname', 'account_type'];
            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'accounts',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }

            /**
             * Encrypt the password entered by the user
             */
            crypt.encrypt_perm(payload.request.account_password, function (err, hash) {
                if (hash.length > 0) {
                    payload.request.account_password = hash;
                    /**
                     *
                     * @type {{account_username: (*|accountSchema.account_username|auth_payload.account_username|userInformation.account_username)}}
                     */
                    var uniquefield = {
                        account_username: payload.request.account_username
                    }
                    mongoDb.saveUniqueData(payload.request, uniquefield, accountModel, function (data) {
                        accountParser.parseResponse(data, callback);
                    });
                } else {
                    callback({
                        statuserror: 400,
                        module: 'account',
                        message: 'There was a problem adding the account.'
                    });
                    return;
                }
            });



        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }
    }
};