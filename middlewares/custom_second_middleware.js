/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";
global.app_dirname;


/***
 *  NOTE:  This is another middleware example, you can create as many middleware you want using this example.
 *  Keep in mind that the function name need to start with init
 *
 *  You can cross reference middlewares when needed
 */


/**
 * Configs & helpers
 */


//Define you configs or helpers only if needed


/**
 * Components Classes
 * @type {*}
 */

//Define you components class only if needed



module.exports = {

    /**
     * Custom middleware
     * @param req
     * @param res
     * @param handler
     */
    init: function (req, res, handler) {
        /**
         * Use the next function carefully if you have multiple middlewares it should be used only on the last middleware that you want to execute the next route handler
         */

    }
}

