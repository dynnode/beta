"use strict";

/**
 * Custom modules
 * @type {*}
 */

global.app_dirname;

var hashcode = require(app_dirname + '/helpers/hash_generator');
var database_uri = process.env.DB_URL;
var database_username = process.env.DB_USER;
var database_password = process.env.DB_PASS;
/**
 * Node modules
 * @type {*}
 */
var async = require('async');
var mongoose = require('mongoose/lib');
var uri = ''
if (process.env.DB_ENGINE_PASSWORD_ENABLED === 'true') {
    uri = 'mongodb://' + database_username + ':' + database_password + '@' + database_uri;
} else {
    uri = 'mongodb://' + database_uri;
}
global.db = mongoose.createConnection(uri);

/**
 * Display the path of the database in use
 */
console.log('Mongo DB Uri: %s', database_uri);

module.exports = {


    getData: function (datamodeling, model, datareturn) {
        try {
            /**
             *
             * @type {{}}
             */
            var query = {};
            if (datamodeling.custom_query) {
                if (datamodeling.custom_query.query_options.show_all) {
                    query = {};
                } else if (datamodeling.custom_query.query_options.non_exists) {
                    query[datamodeling.custom_query.query.field_name] = {
                        $exists: true,
                        $nin: datamodeling.custom_query.query.non_exist_value
                    }
                } else if (datamodeling.custom_query.query_options.by_range) {
                    query[datamodeling.custom_query.query.field_name] = {
                        '$gte': datamodeling.custom_query.query.min_value,
                        '$lte': datamodeling.custom_query.query.max_value
                    }
                } else if (datamodeling.custom_query.query_options.by_less_than) {
                    query[datamodeling.custom_query.query.field_name] = {
                        $lte: datamodeling.custom_query.query.by_less_than_value
                    }
                }
                else if (datamodeling.custom_query.query_options.by_greater_than) {
                    query[datamodeling.custom_query.query.field_name] = {
                        $gte: datamodeling.custom_query.query.by_greater_than_value
                    }
                }
                else if (datamodeling.custom_query.query_options.by_in) {
                    query[datamodeling.custom_query.query.field_name] = {
                        $in: datamodeling.custom_query.query.by_in_value
                    }
                }
                else if (datamodeling.custom_query.query_options.by_no_in) {
                    query[datamodeling.custom_query.query.field_name] = {
                        $nin: datamodeling.custom_query.query.by_no_in_value
                    }
                }
                else if (datamodeling.custom_query.query_options.by_any_hash) {
                    if (datamodeling.custom_query.query.hash || datamodeling.custom_query.query.parent_hash) {
                        var hashes = [
                            {hash: datamodeling.custom_query.query.hash},
                            {parent_hash: datamodeling.custom_query.query.parent_hash}
                        ];
                        query = {
                            $or: hashes
                        }
                    }
                }
                else if (datamodeling.custom_query.query_options.by_keywords) {
                    if (datamodeling.custom_query.query.keywords) {
                        var keywords = [];
                        for (var i = 0; i < datamodeling.custom_query.query.fields_names.length; i++) {
                            var regex = new RegExp(datamodeling.custom_query.query.keywords + '+', "i");
                            var query_regex = {};
                            query_regex[datamodeling.custom_query.query.fields_names[i]] = regex;
                            keywords.push(query_regex);
                        }
                        query = {
                            $or: keywords
                        };
                    } else {
                        if (datamodeling.custom_query.query_options.use_multiple_expressions) {
                            query.$and = [
                                {
                                    $or: datamodeling.custom_query.query.multiple_keywords
                                }
                            ];
                        } else {
                            return datareturn({
                                status: 400,
                                message: 'Keywords field cannot be blank'
                            });
                        }
                    }

                }
                else {
                    query = {};
                }
            } else {
                return datareturn({
                    status: 400,
                    message: 'No query has been generated.'
                })
            }

            model.find(Object(query), { _id: 0 }, function (err, data) {

                var opts = [];
                var reference_models = datamodeling.custom_query.query.references;
                for (var i in reference_models) {
                    if (reference_models.hasOwnProperty(i)) {
                        opts.push({
                            path: reference_models[i]
                        });
                    }
                }
                model.populate(data, opts, function (err, doc) {
                    if (err) {
                        return datareturn({
                            statuserror: 500,
                            message: err
                        });
                    } else if (doc) {
                        if (datamodeling.custom_query.query_options.show_count) {
                            model.count(query, function (error, count_totals) {
                                if (error) {
                                    return datareturn({
                                        statuserror: 500,
                                        message: error
                                    });
                                } else if (count_totals) {
                                    return datareturn({
                                        status: 200,
                                        message: 'data found',
                                        response: doc,
                                        totalresults: doc.length,
                                        page_number: datamodeling.page_number,
                                        sorted: datamodeling.sort_type,
                                        sortedby: datamodeling.sort_by,
                                        count: count_totals
                                    });
                                } else {
                                    return datareturn({
                                        status: 404,
                                        message: 'data not found'
                                    });
                                }
                            });
                        } else {
                            return datareturn({
                                status: 200,
                                message: 'data found',
                                response: doc,
                                totalresults: doc.length,
                                page_number: datamodeling.page_number,
                                sorted: datamodeling.sort_type,
                                sortedby: datamodeling.sort_by
                            });
                        }
                    } else {
                        return datareturn({
                            status: 404,
                            message: 'data not found'
                        });
                    }
                });
            })
                .skip(parseInt(datamodeling.custom_query.query.page_number, 10) * parseInt(datamodeling.custom_query.query.page_limit, 10))
                .limit(parseInt(datamodeling.custom_query.query.page_limit, 10))
                .sort([
                    [datamodeling.custom_query.query.sort_by, datamodeling.custom_query.query.sort_type]
                ])
        } catch (error) {
        }
    },
    saveData: function (datamodeling, model, datareturn) {
        try {

            var query = {};
            if (datamodeling.custom_query) {
                if (!datamodeling.hash) {
                    datamodeling.hash = hashcode.generateHash();
                }
                if (datamodeling.custom_query.query_options.save) {
                    if (datamodeling.custom_query.query.data) {
                        query = datamodeling.custom_query.query.data;
                        model = new model(query);
                        model.save(function (err, doc) {
                            if (err) {
                                return datareturn({
                                    statuserror: 500,
                                    message: err
                                });
                            } else if (doc) {
                                var reference_models = datamodeling.custom_query.query.references;
                                for (var i in reference_models) {
                                    (function () {
                                        if (reference_models.hasOwnProperty(i)) {
                                            var reference_name = reference_models[i].reference_name;
                                            var reference_model = reference_models[i].reference_model;
                                            reference_model.find(Object({
                                                hash: reference_models[i].reference_hash
                                            }), function (err, doc) {
                                                if (err) {
                                                    return datareturn({
                                                        statuserror: 500,
                                                        message: err
                                                    });
                                                } else if (doc.length) {
                                                    var reference_model_path = {};
                                                    reference_model_path[reference_name] = doc[0]._id;
                                                    model.update({
                                                        $set: reference_model_path
                                                    }, function (err, doc) {
                                                        if (err) {
                                                            return datareturn({
                                                                statuserror: 500,
                                                                message: err
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    })();
                                }
                                return datareturn({
                                    status: 200,
                                    message: 'data saved',
                                    response: doc
                                });
                            }
                        });

                    } else {
                        return datareturn({
                            status: 400,
                            message: 'Data parameter is empty, please refer to our documentation of how to save a document'
                        })
                    }
                } else if (datamodeling.custom_query.query_options.save_unique) {
                    var unique_fields = datamodeling.custom_query.query.unique_fields;
                    model.find(Object(unique_fields), function (err, doc) {
                        if (err) {
                            return datareturn({
                                statuserror: 500,
                                message: err,
                                datasaved: false
                            });
                        } else if (doc.length) {
                            return datareturn({
                                status: 202,
                                message: 'The data entered already exits',
                                response: [],
                                currentdata: Object(unique_fields),
                                dataexists: true
                            });
                        } else {
                            if (datamodeling.custom_query.query.data) {
                                query = datamodeling.custom_query.query.data;
                                model = new model(query);
                                model.save(function (err, doc) {
                                    if (err) {
                                        return datareturn({
                                            statuserror: 500,
                                            message: err
                                        });
                                    } else if (doc) {
                                        var reference_models = datamodeling.custom_query.query.references;
                                        for (var i in reference_models) {
                                            (function () {
                                                if (reference_models.hasOwnProperty(i)) {
                                                    var reference_name = reference_models[i].reference_name;
                                                    var reference_model = reference_models[i].reference_model;
                                                    reference_model.find(Object({
                                                        hash: reference_models[i].reference_hash
                                                    }), function (err, doc) {
                                                        if (err) {
                                                            return datareturn({
                                                                statuserror: 500,
                                                                message: err
                                                            });
                                                        } else if (doc.length) {
                                                            var reference_model_path = {};
                                                            reference_model_path[reference_name] = doc[0]._id;
                                                            model.update({
                                                                $set: reference_model_path
                                                            }, function (err, doc) {
                                                                if (err) {
                                                                    return datareturn({
                                                                        statuserror: 500,
                                                                        message: err
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            })();
                                        }
                                        return datareturn({
                                            status: 200,
                                            message: 'data saved',
                                            response: doc
                                        });
                                    }
                                });

                            } else {
                                return datareturn({
                                    status: 400,
                                    message: 'Data parameter is empty, please refer to our documentation of how to save a document'
                                })
                            }
                        }
                    });

                }
                else {
                    return datareturn({
                        status: 400,
                        message: 'No hash or parent hash sent'
                    })
                }
            } else {
                return datareturn({
                    status: 400,
                    message: 'Query is empty, please refer to our documentation of how to save a document',
                })
            }


        } catch (error) {
            //console.log(error);
        }
    },


    saveReferenceData: function (datamodeling, model, referencemodels, datareturn) {
        try {
            var query = {};
            if (!datamodeling.hash) {
                datamodeling.hash = hashcode.generateHash();
            }
            var modelname = model.modelName;
            model = new model(datamodeling);
            model.save(function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc) {
                    /**
                     *  Update the main parent model
                     */
                    for (var i in referencemodels) {
                        (function () {
                            /**
                             * Instantiate the model
                             */
                            var referencemodel = referencemodels[i];
                            /**
                             * Create the update set dynamically
                             */
                            var referencemodelpath = {};
                            referencemodelpath[modelname] = doc._id;
                            referencemodelpath.hash = hashcode.generateHash();
                            referencemodelpath.parent_hash = doc.hash;
                            /**
                             * Update the parent model
                             */
                            referencemodel.find({
                                parent_hash: doc.hash
                            })
                                .update({
                                    $set: referencemodelpath
                                }, function (err, updatedoc) {
                                    if (err) {
                                        return datareturn({
                                            statuserror: 500,
                                            message: err
                                        });
                                    } else if (updatedoc.nModified > 0) {
                                        return datareturn({
                                            status: 200,
                                            message: 'data modified',
                                            response: doc
                                        });
                                    } else if (updatedoc.n > 0) {
                                        return datareturn({
                                            status: 200,
                                            message: 'data saved',
                                            response: doc
                                        });
                                    } else {
                                        var modelsave = new referencemodel(referencemodelpath);
                                        modelsave.save(function (err, refdoc) {
                                            if (err) {
                                                return datareturn({
                                                    statuserror: 500,
                                                    message: err
                                                });
                                            } else if (refdoc) {
                                                return datareturn({
                                                    status: 200,
                                                    message: 'data saved',
                                                    response: doc
                                                });
                                            }
                                        });
                                    }
                                });
                            model.update({
                                $set: datamodeling
                            }, function (err, doc) {
                                if (err) {
                                    return datareturn({
                                        statuserror: 500,
                                        message: err
                                    });
                                }
                            });
                        })();
                    }
                }
            });
        } catch (error) {
            //console.log(error);
        }
    },

    updateData: function (datamodeling, model, datareturn) {
        try {

            /**
             *
             * @type {{}}
             */
            var query = {};
            if (datamodeling.custom_query) {
                if (datamodeling.custom_query.query_options.update) {
                    query = datamodeling.custom_query.query;
                }else if (datamodeling.custom_query.query_options.update_with_increase) {

                    if(!datamodeling.custom_query.query){
                        return datareturn({
                            status: 400,
                            message: 'No query has been specified'
                        })
                    }else{
                        query = {
                            hash:datamodeling.custom_query.query.hash,
                            $inc: datamodeling.custom_query.query
                        }
                    }


                }
            }
            if (!datamodeling.hash) {
                return datareturn({
                    status: 400,
                    message: 'No hash or parent hash sent'
                })
            }

            model.find(Object(query), function (err, finddoc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (finddoc.length) {
                    /**
                     * Safe way to avoid someone to overwrite hashes
                     */
                    delete datamodeling._id;
                    delete datamodeling.created_at;
                    delete datamodeling.hash;
                    model.update(query, {
                        $set: datamodeling
                    }, function (err, doc) {
                        if (err) {
                            return datareturn({
                                statuserror: 500,
                                message: err
                            });
                        } else if (doc.nModified > 0) {
                            return datareturn({
                                status: 200,
                                message: 'data modified',
                                response: finddoc
                            });
                        } else if (doc.n > 0) {
                            return datareturn({
                                status: 200,
                                message: 'data modified',
                                response: finddoc
                            });
                        } else {
                            return datareturn({
                                status: 404,
                                message: 'data not found',
                                response: finddoc
                            });
                        }
                    });
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            });
        } catch (error) {
        }
    },
    deleteData: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.usequery && datamodeling.usequery != 'false') {
                query = datamodeling.queryoptions;
                if (datamodeling.hash) {
                    query.hash = datamodeling.hash;
                } else if (datamodeling.parent_hash) {
                    query.parent_hash = datamodeling.parent_hash;
                }
            } else if (datamodeling.hash) {
                query = {
                    hash: datamodeling.hash
                };
            } else if (datamodeling.parent_hash) {
                query = {
                    parent_hash: datamodeling.parent_hash
                };
            } else {
                return datareturn({
                    status: 400,
                    message: 'No hash or parent_hash sent'
                })
            }
            model.find(Object(query), function (err, finddoc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (finddoc.length) {

                    /**
                     * Safe way to avoid someone to overwrite hashes
                     */
                    model.remove(query, function (err, doc) {
                        if (err) {
                            return datareturn({
                                statuserror: 500,
                                message: err
                            });
                        } else if (doc.result.nModified > 0) {
                            return datareturn({
                                status: 200,
                                message: 'data modified',
                                response: finddoc
                            });
                        } else if (doc.result.n > 0) {
                            return datareturn({
                                status: 200,
                                message: 'data modified',
                                response: finddoc
                            });
                        } else {
                            return datareturn({
                                status: 404,
                                message: 'data not found',
                                response: finddoc
                            });
                        }
                    });
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            });
        } catch (error) {
        }
    },
    authenticateData: function (datamodeling, model, datareturn) {
        try {

            model.find(datamodeling, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    //console.log(doc);
                    return datareturn({
                        status: 200,
                        message: 'logged succesfully',
                        response: doc
                    });
                } else {
                    return datareturn({
                        statuserror: 401,
                        message: 'invalid credentials'
                    });
                }
            })
                .select('+account_password')
                .exclude();
        } catch (error) {
        }
    }
};
