"use strict";
var schema = require('../../node_modules/mongoose/lib').Schema;
exports.getSchema = function () {
    var accountSchema = new schema({
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
        customer: {
            type: schema.Types.ObjectId,
            required: false,
            ref: 'customers'
        },
        account_username: {
            type: String,
            required: true,
            trim: false,
            index: {
                unique: true
            }
        },
        account_password: {
            type: String,
            required: true,
            trim: false,
            index: {
                unique: false
            },
            select: false
        },
        account_email: {
            type: String,
            required: true,
            trim: false,
            index: {
                unique: false
            }
        },
        account_firstname: {
            type: String,
            required: true,
            trim: false,
            index: {
                unique: false
            }
        },
        account_lastname: {
            type: String,
            required: true,
            trim: false,
            index: {
                unique: false
            }
        },
        account_type: {
            type: String,
            required: true,
            trim: false,
            default: "admin"
        },
        account_role: {
            type: String,
            required: true,
            trim: false,
            default: "user"
        },
        account_role_hash: {
            type: String,
            required: false,
            trim: false
        },
        account_role_permissions: {
            type: Object,
            required: true,
            default: {}
        },
        account_activation_hash: {
            type: String,
            trim: false,
            select: false
        },
        account_activation_confirmed: {
            type: Boolean,
            default: false
        },
        updated_at: {
            type: Date,
            default: Date.now
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
            select: true,
            default: true
        }
    });
    accountSchema.set({});
    accountSchema.pre('save', function (next) {
        var now = Date.now;
        this.updated_at = now;
        if (!this.created_at) {
            this.created_at = now;
        }
        next();
    });
    return accountSchema;
};