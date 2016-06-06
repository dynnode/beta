/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";
var request = require('request');


module.exports = {

    getRequest: function (url, callback) {


        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(error,response,body);
            }else{
                callback(error,response,body);
            }
        })


    },
    postRequest: function (data, url, callback) {

        request({
            headers: {
                'Content-Type': 'application/json'
            },
            uri: url,
            formData: data,
            method: 'POST'
        }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                callback(err,response,body);
            }else{
                callback(err,response,body);
            }

        });

    }

}

