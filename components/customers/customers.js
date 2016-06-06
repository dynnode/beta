"use strict";

/**
 *
 */
global.app_dirname;
var mongoDb = require(app_dirname + '/databases/mongoose/' + process.env.DB_ENGINE);
var documentValidator = require(app_dirname + '/utilities/documentvalidator');


/**
 * Modules
 * @type {exports}
 */
var customersParser = require('./customers_parser');
var customersModel = require('./customers_model');


/**
 *  References Modules
 * @type {Array}
 */
var accountModel = require(app_dirname + '/components/account/account_model');

module.exports = {

    add_customer: function (payload, args, request_type, callback) {

        /**
         * Here you define the request type allowed for this function GET, UPDATE, DELETE, ETC
         */
        if (request_type === "POST") {

            /**
             * Validation fields
             * @type {string[]}
             */
            var validationFields = ['account_hash', 'customer_company_name', 'customer_email', 'customer_firstname', 'customer_lastname'];
            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }

            /**
             * This is the mongo db relationship reference model ex. Accounts object will automatically added to the customer object.
             * @type {*[]}
             */
            var references = [
                {
                    name: 'account',
                    model: accountModel,
                    hashref: payload.request.account_hash
                }
            ];

            /**
             * Save the request in the db
             */
            mongoDb.saveByMultiRefData(payload.request, customersModel, references, function (data) {
                if (data.statuserror) {
                    customersParser.parseErrorResponse(data, callback);
                } else {
                    customersParser.parseResponse(data, callback);
                }
            });

        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }


    },
    get_customer: function (payload, args, request_type, callback) {

        if (request_type === "GET") {

            var validationFields = ['customer_hash'];

            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }


            /**
             * Refereneces
             * @type {string[]}
             */
            payload.request.references = ['account'];

            /**
             * Check against the DB
             */
            mongoDb.getAllDataRef(payload.request, customersModel, function (data) {
                if (data.statuserror) {
                    customersParser.parseErrorResponse(data, callback);
                } else {
                    customersParser.parseResponse(data, callback);
                }
            });

        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }

    },
    update_customer: function (payload, args, request_type, callback) {

        if (request_type === "UPDATE") {

            var validationFields = ['customer_hash'];

            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }

            /**
             * Check against the DB
             */
            mongoDb.updateData(payload.request, customersModel, function (data) {
                if (data.statuserror) {
                    customersParser.parseErrorResponse(data, callback);
                } else {
                    customersParser.parseResponse(data, callback);
                }
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }

    },
    delete_customer: function (payload, args, request_type, callback) {

        if (request_type === "DELETE") {

            var validationFields = ['customer_hash'];

            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }

            /**
             * Check against the DB
             */
            mongoDb.deleteData(payload.request, customersModel, function (data) {
                if (data.statuserror) {
                    customersParser.parseErrorResponse(data, callback);
                } else {
                    customersParser.parseResponse(data, callback);
                }
            });

        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }
    },

    get_customers: function (payload, args, request_type, callback) {


        if (request_type === "GET") {

            var validationFields = ['account_hash'];

            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }

            mongoDb.getAllDataRef(payload.request, customersModel, function (data) {
                customersParser.parseResponse(data, callback);
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }


    },
    search_customers: function (payload, args, request_type, callback) {

        if (request_type === "GET") {
            var validationFields = ['keywords'];
            if (!documentValidator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }
            /**
             * Set the fields that you want to look up on the database
             * @type {string[]}
             */
            payload.request.fields_names = ['customer_company_name', 'customer_email', 'customer_lastname', 'customer_firstname'];

            /**
             * search keywords
             */
            mongoDb.searchByKewords(payload.request, customersModel, function (data) {
                customersParser.parseResponse(data, callback);
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request is not allowed, please use the correct CRUD method request.' });
        }

    }
};