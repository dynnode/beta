/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";

/**
 *
 *
 PLEASE DO NOT CHANGE THIS FILE, THIS FILE IS PART OF THE PACKAGE UPDATE, IF YOU MODIFY THIS FILE YOU WILL LOSS YOUR CHANGES AFTER THE UPDATE
 *
 *
 */


/**
 * Google Analytics
 * @type {exports}
 */
var ua = require('universal-analytics');
var visitor = ua(process.env.GOOGLE_ANALITYCS_UA);


module.exports = {

    /**
     * Custom middleware
     * @param req
     * @param res
     * @param next
     */
    init: function (req, res) {

        /**
         * Start calculate the time taken on the api calls
         * @type {number}
         */
        var start = new Date().getTime();
        var parsed_path = req.path.split('/');

        req.on("end", function () {
            if (process.env.GOOGLE_ANALITYCS_ENABLED === "true") {
                if (res.statusCode === 200 || res.statusCode === 201 || parsed_path === "uploadapi") {
                    /**
                     * Track request on Google Analytics
                     */
                    var payload = (req.method === 'GET' || req.method === 'PUT') ? req.query : req.body;
                    visitor.screenview(req.path, 'DynNodeJs', 'com.dynnodejs.app', '1.0.0').send();
                    visitor.pageview(req.path).send();
                    if (process.env.GOOGLE_HIDE_HASHES === "true") {
                        var analitycs_payload = [];
                        for (var key in payload) {
                            var modified_payload = {};
                            if (payload.hasOwnProperty(key)) {
                                if (key.indexOf('hash') > 0) {
                                    modified_payload[key] = '****';
                                } else {
                                    modified_payload[key] = payload[key];
                                }
                            }
                            analitycs_payload.push(modified_payload)
                            payload = analitycs_payload[0]
                        }
                    }
                    visitor.event(parsed_path[2], req.path, JSON.stringify(payload), {p: req.path}).send();

                    /**
                     * Calculate the time taken on the api calls
                     * @type {number}
                     */
                    var end = new Date().getTime();
                    var time = end - start;
                    visitor.timing(parsed_path[2], req.path, time).send();

                } else {
                    /**
                     * Track any request exceptions on Google Analytics
                     */
                    var exceptionMessage = {
                        originalUrl: req.url,
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        userName: req.account_info_session.account_username
                    };
                    visitor.exception(JSON.stringify(exceptionMessage)).send();

                    /**
                     * Calculate the time taken on the api calls
                     * @type {number}
                     */
                    var end = new Date().getTime();
                    var time = end - start;
                    parsed_path = req.path.split('/');
                    visitor.timing(parsed_path[2], req.path, time).send();
                }

            }

        });


    }
}

