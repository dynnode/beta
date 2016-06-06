"use strict";

global.app_dirname;

var crypto = require('crypto');
var bcrypt = require('bcrypt');
var algorithm = 'aes-256-ctr';
module.exports = {
    encrypt: function (text) {
        var cipher = crypto.createCipher(algorithm, process.env.CRYPT_SALT);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (text) {
        var decipher = crypto.createDecipher(algorithm, process.env.CRYPT_SALT);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    },
    encrypt_perm: function (text, callback) {
        var salt = process.env.CRYPT_SALT;
        bcrypt.genSalt(10, function (err, salt) {
            if (salt) {
                bcrypt.hash(text, salt, function (err, hash) {
                    if (hash) {
                        callback(null, hash);
                    } else {
                        callback(err, null);
                    }
                });
            } else {
                callback(err, null);
            }
        });
    },
    compare: function (text, dbhash, callback) {
        bcrypt.compare(text, dbhash, function (err, res) {
            if (res) {
                callback(null, res);
            } else {
                callback(err, null);
            }
        });
    }
};