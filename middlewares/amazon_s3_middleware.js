/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";

/**
 *
 *
 PLEASE DO NOT CHANGE THIS FILE, THIS FILE IS PART OF THE PACKAGE UPDATE, IF YOU MODIFY THIS FILE YOU WILL LOSS YOUR CHANGES
 *
 *
 */

/**
 * Configs & helpers
 */

var fs = require('fs');
var AWS = require('aws-sdk');
var file_helper = require(app_dirname + '/helpers/file_helper');


module.exports = {

    /**
     * Custom middleware
     * @param req
     * @param res
     * @param next
     */
    init: function (req, res, next) {
        try {
            if (process.env.AMASON_S3_AWS_ENABLED === "true") {

                var file_path = req.files.fileUpload.path;
                var file_type =req.files.fileUpload.type;
                var parsed_path = req.path.split('/');

                /**
                 * AWS credentials, using this pattern you can upload to multiple buckets in the same function
                 */
                AWS.config.update({ accessKeyId: process.env.AMASON_S3_AWS_ACCESS_KEY, secretAccessKey: process.env.AMASON_S3_AWS_SECRET_ACCESS_KEY, "region": process.env.AMASON_S3_AWS_DEFAULT_REGION });
                /**
                 * File helper to get the file name from a path
                 * @type {*}
                 */
                var filename = file_helper.getFilename(file_path);
                /**
                 *  Read in the file, convert it to base64 and then store to S3
                 */
                fs.readFile(file_path, function (err, data) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err,
                            result: data
                        });
                    }
                    var base64data = new Buffer(data, 'binary');
                    var s3 = new AWS.S3({params: {Bucket: process.env.AMASON_S3_AWS_BUCKETNAME, ContentType: file_type}});
                    var params = {Key: parsed_path[2] + '/' + filename, Body: base64data};
                    /**
                     *  Upload the file to s3
                     */

                    s3.upload(params, function (err, data) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: err,
                                result: data
                            });
                        } else {
                            /**
                             * Save the S3 response on the request
                             * @type {*}
                             */
                            req.amazon_s3_session = data;
                            next();
                        }
                    });
                });
            }
        }
        catch (err) {

        }


    }
}

