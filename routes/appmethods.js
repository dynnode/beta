/**
 * Created by williamdiaz on 7/29/15.
 */

"use strict";


/****
 *
 *
 *                  DO NOT CHANGE THIS FILE
 *
 *
 */



/**
 * Regular classes
 * @type {*}
 */
var app_dirname = global.app_dirname;

/**
 * Load classes
 * @type {exports}
 */
var map_loader = require('./appclasses');


/**
 * Load the class and fire them dynamically
 * @type {*}
 */
var modules = map_loader.initClasses();
var modules_count = Object.keys(modules).length;

/**
 * Auto load the class by request
 * @type {*}
 */
var module_loader = require(app_dirname + '/utilities/autoloadmodule');


/**
 *
 * @type {{initMethod: initMethod}}
 */

module.exports = {

    /**
     *
     * @param methodname
     * @param payload
     * @param args
     * @param request_type
     * @param callback
     * @returns {*}
     *
     * Ex.
     * http://localhost/api/{methodname}/{hash}/args...
     *
     */

    initMethod: function (methodname, payload, args, request_type, callback) {
        /**
         * Load the files from the class map and fire the modules dynamically
         * @type {*}
         */
        var i =0;
        for (var key in modules) {
            if (key == methodname) {
                if(key === "authentication"){
                    if (typeof modules[key][args[1]] === "function") {
                        modules[key][args[1]](payload, args, request_type, callback);
                    } else {
                        return callback({statuserror: 404, message: 'argument not found', response: 'argument ' + args[1] + ' doesn\'t exist, please contact support or check the api documentation.' });
                    }
                }else{
                    if (typeof modules[key][args[1]] === "function") {
                        modules[key][args[1]](payload, args, request_type, callback);
                    } else {
                        return callback({statuserror: 404, message: 'argument not found', response: 'argument ' + args[1] + ' doesn\'t exist, please contact support or check the api documentation.' });
                    }
                }
            } else {
                i++;
                if (i === modules_count) {
                    return callback({statuserror: 404, message: 'module name not found', response: 'module name specified doesn\'t exist, please contact support.' });
                }
            }
        }
    },
    initMethodByRequest: function (methodname, payload, args, request_type, callback) {
        /**
         * Load the class by request and fire the modules dynamically
         * @type {*}
         */
        var objectClass = module_loader.loadModule(methodname);
        if(typeof objectClass === 'object'){

            if (methodname) {
                if (typeof objectClass[args[1]] === "function") {
                    objectClass[args[1]](payload, args, request_type, callback);
                } else {
                    return callback({statuserror: 404, message: 'argument not found', response: 'argument ' + args[1] + ' doesn\'t exist, please contact support or check the api documentation.' });
                }
            } else {
                return callback({statuserror: 404, message: 'method name not found', response: 'method name specified doesn\'t exist, please contact support.' });
            }

        }else{
            return callback({statuserror: 404, message: 'module name not found', response: 'module name specified doesn\'t exist, please contact support.' });
        }
        return [];
    }

};