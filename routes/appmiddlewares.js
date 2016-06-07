/**
 * Created by williamdiaz on 7/29/15.
 */

"use strict";


/****
 *
 *
 *     THIS IS THE FILE THAT YOU WILL ADD THE REFERENCES OF ALL YOUR CLASSES FROM YOUR COMPONENTS
 *
 */


/**
 * Regular classes
 * @type {*}
 */
var app_dirname = global.app_dirname;


/**
 * The key is the method name and the value is the class with all the functions
 * @type {{authentication: *, account: *, customers: *}}
 */
var middlewareMaps = {
    custom_middleware: require(app_dirname + '/middlewares/custom_middleware'),
    custom_second_middleware: require(app_dirname + '/middlewares/custom_second_middleware')
};


/**
 *
 * @type {{initMethod: initMethod}}
 */

module.exports = {


    initMiddlewares: function (req, resp, next) {

        for (var key in middlewareMaps) {
            if( middlewareMaps.hasOwnProperty(key)){
                middlewareMaps[key].init(req, resp, next);
            }
        }

        return middlewareMaps;
    }



};