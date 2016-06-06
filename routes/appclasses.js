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
var classMaps= {
    authentication: require(app_dirname + '/components/authentication/authentication'),
    accounts: require(app_dirname + '/components/accounts/accounts'),
    customers: require(app_dirname + '/components/customers/customers')
};


/**
 *
 * @type {{initMethod: initMethod}}
 */

module.exports = {
    initClasses: function () {
        return classMaps;
    }
};