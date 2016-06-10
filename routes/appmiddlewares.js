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
    google_analytics_middleware: require(app_dirname + '/middlewares/google_analytics_middleware'),
    amazon_s3_middleware: require(app_dirname + '/middlewares/amazon_s3_middleware'),
    custom_middleware: require(app_dirname + '/middlewares/custom_middleware')
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