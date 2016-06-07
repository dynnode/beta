/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";
global.app_dirname;



module.exports = {

    /**
     * Custom middleware
     * @param req
     * @param res
     * @param handler
     */
    processMiddleware: function (req, res, handler) {

        handler();

    }
}

