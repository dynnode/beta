"use strict";


/**
 *
 *
 THIS IS JUST AN EXAMPLE FILE, YOU CAN CREATE AS MANY FILE YOU WANT FOR YOUR UPLOAD FILE PROCESS,
 KEEP IN MIND THAT YOUR FILES ARE ATTACHED TO YOUR REQUEST SO CAN BE USED EVERYWHERE
 *
 *
 */

/**
 * Upload Parser
 * @type {exports}
 */
var upload_files_parser = require('./upload_files_parser');


module.exports = {


    add_file: function (payload, args, request_type, callback) {
        /**
         * Here you define the request type allowed for this function GET, UPDATE, DELETE, ETC
         */
        if (request_type === "POST") {
            upload_files_parser.parseResponse(payload, function(){
                callback({
                    statuserror: 200,
                    module: 'upload_file',
                    message: 'file uploaded',
                    payload: payload.request
                });
            });
        } else {
            callback({statuserror: 405, message: 'method not allowed', response: 'Method request ' + request_type + ' is not allowed, please use the correct CRUD method request.' });
        }

    }

}