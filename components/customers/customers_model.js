"use strict";
var db = global.db;
var customersSchema = require('./customers_schema');
module.exports = db.model('customers', customersSchema.getSchema());