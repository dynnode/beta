"use strict";

var path = require('path');
var app_dirname = global.app_dirname;

module.exports = {
    loadModule: function (module) {
        try{
            return require(path.join(app_dirname + '/components/' + module, module));
        }catch(e){
            return 'MODULE_NOT_FOUND';
        }
    }
};