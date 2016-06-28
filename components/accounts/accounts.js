"use strict";
/**
 * Configs and helpers
 * @type {appconfig.app_dirname|*}
 */

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

            /**
             * Query to show all the records
             * @type {{query_options: {show_all: boolean}, query: {}}}
             */
            payload.custom_query = {
                query_options: {
                    show_all: true
                },
                query: {}
            }

            mongoDb.getData(payload, accountsModel, function (data) {
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
            crypt.encrypt_perm(payload.request.account_password, function (err, hash) {

                if (hash.length > 0) {

                    //Set the encrypted password before saving to the DB
                    payload.request.account_password = hash;


                    var query_string = {
                        custom_query: {
                            query_options: {
                                save_unique: true
                            },
                            query: {
                                data: payload.request,
                                unique_fields: { account_username: payload.request.account_username, account_email: payload.request.account_email },

                            }
                        }
                    };


                    /**
                     * Save the request in the db
                     */
                    mongoDb.saveData(query_string, accountsModel, function (data) {
                        if (data.statuserror) {
                            accountsParser.parseErrorResponse(data, callback);
                        } else {
                            accountsParser.parseResponse(data, callback);
                        }
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
    },
    delete_account: function (payload, args, request_type, callback) {

        if (request_type === "PUT") {
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

            /**
             * Fire mongoDB update call
             */
            mongoDb.deleteData(payload.request, accountsModel, function (data) {
                accountsParser.parseResponse(data, callback);
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }
    },
    update_account: function (payload, args, request_type, callback) {

        if (request_type === "DELETE") {
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

            /**
             * Remove the password field
             */
            delete payload.request.password;

            /**
             * Fire mongoDB update call
             */
            mongoDb.updateData(payload.request, accountsModel, function (data) {
                accountsParser.parseResponse(data, callback);
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }
    }
};