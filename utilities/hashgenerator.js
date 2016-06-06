"use strict";


var md5 = require('md5');

module.exports = {

    generateHash: function () {
        var salt = randomsalt.getSalt();
        var hash = md5(salt);
        return hash;
    }

}

//create custom json serialization format
var randomsalt = {
    getSalt: function () {
        var stringgenerated = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 25; i++)
            stringgenerated += possible.charAt(Math.floor(Math.random() * possible.length));
        return stringgenerated;
    }
};

