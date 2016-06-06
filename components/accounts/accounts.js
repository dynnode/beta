"use strict";
/*global global: false, app_dirname: false */
/*jshint -W030 */
/**
 * Configs and helpers
 * @type {appconfig.app_dirname|*}
 */
global.app_dirname;
var app_dirname = global.app_dirname;
var mongoDb = require(app_dirname + '/databases/mongoose/' + process.env.DB_ENGINE);
var document_validator = require(app_dirname + '/helpers/document_validator');

/**
 * Modules
 * @type {exports}
 */
var accountsParser = require('./accounts_parser');
var accountsModel = require('./accounts_model');

/**
 * Crypt Library
 * @type {*}
 */
var crypt = require(app_dirname + '/helpers/crypt');

module.exports = {

    get_account: function (payload, args, request_type, callback) {
        if (request_type === "GET") {
            /**
             * Validation fields
             * @type {string[]}
             */
            var validationFields = ['account_hash'];
            if (!document_validator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'accounts',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }


            mongoDb.getAllDataRef(payload.request, accountsModel, function (data) {
                accountsParser.parseResponse(data, callback);
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
            var validationFields = ['account_username', 'account_email', 'account_password', 'account_firstname', 'account_lastname', 'account_type'];
            if (!document_validator.validatedocument(validationFields, payload.request)) {
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
            crypt.encrypt_perm(payload.request.accounts_password, function (err, hash) {
                if (hash.length > 0) {
                    payload.request.accounts_password = hash;
                    /**
                     *
                     * @type {{account_username: (*|accountsSchema.account_username|auth_payload.account_username|userInformation.account_username)}}
                     */
                    var uniquefield = {
                        account_username: payload.request.account_username
                    }
                    mongoDb.saveUniqueData(payload.request, uniquefield, accountsModel, function (data) {
                        accountsParser.parseResponse(data, callback);
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