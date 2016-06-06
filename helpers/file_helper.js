/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";

module.exports = {
    /**
     *
     * @param path
     * @returns {*}
     */
    getFilename: function (path) {
        try {
            var filename = path.replace(/^.*[\\\/]/, '');
            return filename;
        } catch (err) {
            return err;
        }
    }

}

