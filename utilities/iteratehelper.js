/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";

module.exports = {

    /**
     * Process all the item in the list provided
     * @param array
     * @param total_count
     * @param current_item
     * @returns {*}
     */
    processList: function (array, total_count, callback) {

        try {

            var itemList = (function () {

                var i = 0;
                return {
                    getItem: function (array_list, total_count) {
                        if (total_count === i) {
                            var data_processed = {
                                finished: true,
                                item: array_list[i]
                            }
                        }
                        else {
                            var data_processed = {
                                finished: false,
                                item: array_list[i]
                            }
                        }

                        /**
                         * Return a callback with the current item data and status
                         */
                        callback(data_processed);

                        /**
                         * Increment the total items processed
                         */

                        i++;

                        /**
                         * Next Item Process
                         */

                        itemList.getItem(array, total_count);

                    }

                }

            })();

            /**
             * Start Items Process
             */
            itemList.getItem(array, total_count);


        } catch (err) {

            return err;
        }


    }

}

