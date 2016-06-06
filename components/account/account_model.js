"use strict";
var db = global.db;
var accountSchema = require('./account_schema');
module.exports = db.model('accounts', accountSchema.getSchema());