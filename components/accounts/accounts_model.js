"use strict";
var accounts_schema = require ('./accounts_schema');
var accounts;

try {
    if (db.model ('accounts')) {
        accounts = db.model ('accounts');
    } else {
        accounts = db.model ('accounts', accounts_schema.getSchema ());
    }
} catch (e) {
    if (e.name === 'MissingSchemaError') {
        accounts = db.model ('accounts', accounts_schema.getSchema ());
    }
}

module.exports = accounts;