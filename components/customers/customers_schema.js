"use strict";
var schema = require('../../node_modules/mongoose/lib').Schema;
exports.getSchema = function () {
    var customersSchema = new schema({
        hash: {
            type: String,
            required: true,
            trim: false,
            index: {
                unique: true
            }
        },
        parent_hash: {
            type: String,
            required: false,
            trim: false
        },
        account: {
            type: schema.Types.ObjectId,
            ref: 'accounts'
        },
        customer_company_name: {
            type: String,
            required: true,
            default: ''
        },
        customer_firstname: {
            type: String,
            required: false,
            default: ''
        },
        customer_lastname: {
            type: String,
            required: false,
            default: ''
        },
        customer_address_1: {
            type: String,
            required: false,
            default: ''
        },
        customer_address_2: {
            type: String,
            required: false,
            default: ''
        },
        customer_city: {
            type: String,
            required: false,
            default: ''
        },
        customer_state: {
            type: String,
            required: false,
            default: ''
        },
        customer_country: {
            type: String,
            required: false,
            default: ''
        },
        customer_zipcode: {
            type: String,
            required: false,
            default: ''
        },
        customer_email: {
            type: String,
            required: false,
            default: ''
        },
        customer_phone: {
            type: String,
            required: false,
            default: ''
        },
        customer_permissions: {
            type: Array,
            required: false,
            default: []
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        __v: {
            type: Number,
            select: false
        },
        _active: {
            type: Boolean,
            select: true
        }
    });
    customersSchema.set({});
    customersSchema.pre('save', function (next) {
        var now = Date.now;
        this.updated_at = now;
        if (!this.created_at) {
            this.created_at = now;
        }
        next();
    });
    return customersSchema;
};