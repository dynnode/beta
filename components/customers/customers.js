"use strict";

/**
 * Mongo Instantiation and Request Validator
 */

var mongoDb = require(app_dirname + '/databases/mongoose/' + process.env.DB_ENGINE);
var document_validator = require(app_dirname + '/helpers/document_validator');


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
var accountsModel = require(app_dirname + '/components/accounts/accounts_model');

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
            if (!document_validator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }


            var query_string = {
                custom_query: {
                    query_options: {
                        save_unique: true
                    },
                    query: {
                        data: payload.request,
                        unique_fields: { customer_email: payload.request.customer_email },
                        references: {
                            reference_name: 'account',
                            reference_model: accountsModel,
                            reference_hash: payload.request.account_hash
                        }
                    }
                }
            };


            /**
             * Save the request in the db
             */
            mongoDb.saveData(query_string, customersModel, function (data) {
                if (data.statuserror) {
                    customersParser.parseErrorResponse(data, callback);
                } else {
                    customersParser.parseResponse(data, callback);
                }
            });

        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }


    },
    get_customer: function (payload, args, request_type, callback) {

        if (request_type === "GET") {

            var validationFields = ['customer_hash'];
            if (!document_validator.validatedocument(validationFields, payload.request)) {
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
             *
             * @type {{custom_query: {query_options: {by_any_hash: boolean}, query: {hash: (userInformation.customer_hash|*), references: string[]}}}}
             */
            var query_string = {
                custom_query: {
                    query_options: {
                        by_any_hash: true
                    },
                    query: {
                        hash: payload.request.customer_hash,
                        references: ['account']
                    }
                }
            };

            /**
             * Check against the DB
             */
            mongoDb.getData(query_string, customersModel, function (data) {
                if (data.statuserror) {
                    customersParser.parseErrorResponse(data, callback);
                } else {
                    customersParser.parseResponse(data, callback);
                }
            });

        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }

    },
    update_customer: function (payload, args, request_type, callback) {

        if (request_type === "PUT") {

            var validationFields = ['customer_hash'];
            if (!document_validator.validatedocument(validationFields, payload.request)) {
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
             * Get the customer hash request and pass it as hash to MongoDb
             * Please see documentation about hash and parent hash MongoDb schema fields
             * @type {{hash: (payload.request.customer_hash|*)}}
             */
            payload.request.hash = payload.request.customer_hash;


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
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }

    },
    delete_customer: function (payload, args, request_type, callback) {

        if (request_type === "DELETE") {

            var validationFields = ['customer_hash'];

            if (!document_validator.validatedocument(validationFields, payload.request)) {
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
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }
    },

    get_customers: function (payload, args, request_type, callback) {


        if (request_type === "GET") {

            var validationFields = ['account_hash'];

            if (!document_validator.validatedocument(validationFields, payload.request)) {
                callback({
                    statuserror: 400,
                    module: 'customers',
                    message: 'validation failed, the following fields are required',
                    fields: validationFields,
                    payload: payload.request
                });
                return;
            }

            var query_string = {
                custom_query: {
                    query_options: {
                        show_all: true
                    },
                    query: {
                        references: ['account']
                    }
                }
            };


            mongoDb.getData(query_string, customersModel, function (data) {
                customersParser.parseResponse(data, callback);
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }


    },
    search_customers: function (payload, args, request_type, callback) {

        if (request_type === "GET") {
            var validationFields = ['keywords'];
            if (!document_validator.validatedocument(validationFields, payload.request)) {
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
             * Multiple Expression Search
             * @type {{custom_query: {query_options: {by_keywords: boolean, use_multiple_expressions: boolean}, query: {multiple_keywords: *, references: string[]}}}}
             */
            var query_string = {
                custom_query: {
                    query_options: {
                        by_keywords: true,
                        use_multiple_expressions: true
                    },
                    query: {
                        multiple_keywords: [
                            { customer_company_name: 'Dyn2'},
                            { customer_lastname: 'Diaz' }
                        ],
                        references: ['account']
                    }
                }
            }

            mongoDb.getData(query_string, customersModel, function (data) {
                customersParser.parseResponse(data, callback);
            });


        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }

    }
}
;