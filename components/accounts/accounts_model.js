"use strict";
var db = global.db;
var accountSchema = require('./accounts_schema');
module.exports = db.model('accounts', accountSchema.getSchema());