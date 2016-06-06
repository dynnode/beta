"use strict";
module.exports = {

    validateArguments: function(args_list) {
        var args = [];
        if (args_list.param_1) {
            args.push(args_list.param_1)
        }
        if (!args_list.param_2) {
            args.push(args_list.param_1)
        } else {
            args.push(args_list.param_2)
        }
        if (args_list.param_3) {
            args.push(args_list.param_3)
        }
        if (args_list.param_4) {
            args.push(args_list.param_4)
        }
        if (args_list.param_5) {
            args.push(args_list.param_5)
        }
        if (args_list.param_6) {
            args.push(args_list.param_6)
        }
        if (args_list.param_7) {
            args.push(args_list.param_7)
        }
        if (args_list.param_8) {
            args.push(args_list.param_8)
        }
        if (args_list.param_9) {
            args.push(args_list.param_9)
        }
        if (args_list.param_10) {
            args.push(args_list.param_10)
        }
        return args;
    },
    validateRequest: function(req, method) {
        var payload = {};
        switch (method) {
            case "GET":
                payload = {
                    request: req.query,
                    session: (req.account_info_session) ? req.account_info_session : {}
                }
                break;
            case "POST":
                payload = {
                    request: req.body,
                    session: (req.account_info_session) ? req.account_info_session : {}
                }
                break;
            case "DELETE":
                payload = {
                    request: req.body,
                    session: (req.account_info_session) ? req.account_info_session : {}
                }
                break;
            case "PUT":
                payload = {
                    request: req.query,
                    session: (req.account_info_session) ? req.account_info_session : {}
                }
                break;
            default:
                payload = {
                    request: req.body,
                    session: (req.account_info_session) ? req.account_info_session : {}
                }
                break;
        }
        return payload;
    }

}