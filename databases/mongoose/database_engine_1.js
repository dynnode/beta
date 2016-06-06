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
            var query = {};
            if (datamodeling.hash) {
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
            model.find(Object(query), function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    return datareturn({
                        status: 200,
                        message: 'data found',
                        response: doc
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
    getDataWithSelect: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.hash) {
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
            model.find(Object(query),function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    return datareturn({
                        status: 200,
                        message: 'data found',
                        response: doc
                    });
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            }).select(datamodeling.select);
        } catch (error) {
        }
    },
    getDataByHash: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            var query = {};
            if (datamodeling.usequery && datamodeling.usequery != 'false') {
                query = datamodeling.queryoptions;
                if (datamodeling.hash) {
                    query.hash = datamodeling.hash;
                } else {
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
            model.find(query, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    if (datamodeling.showcount) {
                        model.count(query, function (error, countotals) {
                            if (error) {
                                return datareturn({
                                    statuserror: 500,
                                    message: error
                                });
                            } else if (countotals) {
                                return datareturn({
                                    status: 200,
                                    message: 'data found',
                                    response: doc,
                                    totalresults: doc.length,
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby,
                                    count: countotals
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
                            pagenumber: datamodeling.pagenumber,
                            sorted: datamodeling.sorttype,
                            sortedby: datamodeling.sortdocby
                        });
                    }
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getAllData: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            model.find({}, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    if (datamodeling.showcount) {
                        model.count({}, function (error, countotals) {
                            if (error) {
                                return datareturn({
                                    statuserror: 500,
                                    message: error
                                });
                            } else if (countotals) {
                                return datareturn({
                                    status: 200,
                                    message: 'data found',
                                    response: doc,
                                    totalresults: doc.length,
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby,
                                    count: countotals
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
                            pagenumber: datamodeling.pagenumber,
                            sorted: datamodeling.sorttype,
                            sortedby: datamodeling.sortdocby
                        });
                    }
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getDataRefByFieldname: function (datamodeling, referencemodels, model, datareturn) {
        try {
            var query = {};
            model.find(datamodeling, function (err, data) {
                var opts = [];
                for (var i in referencemodels) {
                    opts.push({
                        path: referencemodels[i]
                    });
                }
                model.populate(data, opts, function (err, doc) {
                    if (err) {
                        return datareturn({
                            statuserror: 500,
                            message: err
                        });
                    } else if (doc) {
                        return datareturn({
                            status: 200,
                            message: 'data found',
                            response: doc
                        });
                    } else {
                        return datareturn({
                            statuserror: 404,
                            message: 'data not found'
                        });
                    }
                });
            });
        } catch (error) {
        }
    },
    getDataRefByFieldnameSortOptions: function (datamodeling, referencemodels, model, datareturn) {
        try {
            var query = {};
            var query = {};
            if (datamodeling.hash) {
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
            model.find(query, function (err, data) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (data.length) {
                    if (datamodeling.showcount) {
                        model.count(query, function (error, countotals) {
                            if (error) {
                                return datareturn({
                                    statuserror: 500,
                                    message: error
                                });
                            } else if (countotals) {
                                var opts = [];
                                for (var i in referencemodels) {
                                    opts.push({
                                        path: referencemodels[i]
                                    });
                                }
                                model.populate(data, opts, function (err, doc) {
                                    if (err) {
                                        return datareturn({
                                            statuserror: 500,
                                            message: err
                                        });
                                    } else if (doc) {
                                        return datareturn({
                                            status: 200,
                                            message: 'data found',
                                            response: doc,
                                            totalresults: doc.length,
                                            pagenumber: datamodeling.pagenumber,
                                            sorted: datamodeling.sorttype,
                                            sortedby: datamodeling.sortdocby,
                                            count: countotals
                                        });
                                    } else {
                                        return datareturn({
                                            statuserror: 404,
                                            message: 'data not found'
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
                    } else {
                        var opts = [];
                        for (var i in referencemodels) {
                            opts.push({
                                path: referencemodels[i]
                            });
                        }
                        model.populate(data, opts, function (err, doc) {
                            if (err) {
                                return datareturn({
                                    statuserror: 500,
                                    message: err
                                });
                            } else if (doc) {
                                return datareturn({
                                    status: 200,
                                    message: 'data found',
                                    response: doc,
                                    totalresults: doc.length,
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby
                                });
                            } else {
                                return datareturn({
                                    statuserror: 404,
                                    message: 'data not found'
                                });
                            }
                        });
                    }
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getAllDataWhereNonExist: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            /**
             * Build the query to check existing data
             * @type {{}}
             */
            query[datamodeling.fieldname] = {
                $exists: true,
                $nin: datamodeling.dataexist
            };
            model.find(query, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    if (datamodeling.showcount) {
                        model.count({}, function (error, countotals) {
                            if (error) {
                                return datareturn({
                                    statuserror: 500,
                                    message: error
                                });
                            } else if (countotals) {
                                return datareturn({
                                    status: 200,
                                    message: 'data found',
                                    response: doc,
                                    totalresults: doc.length,
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby,
                                    count: countotals
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
                            pagenumber: datamodeling.pagenumber,
                            sorted: datamodeling.sorttype,
                            sortedby: datamodeling.sortdocby
                        });
                    }
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getDataByPagination: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.hash) {
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
            model.find(query, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    if (datamodeling.showcount) {
                        model.count({}, function (error, countotals) {
                            if (error) {
                                return datareturn({
                                    statuserror: 500,
                                    message: error
                                });
                            } else if (countotals) {
                                return datareturn({
                                    status: 200,
                                    message: 'data found',
                                    response: doc,
                                    totalresults: doc.length,
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby,
                                    count: countotals
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
                            pagenumber: datamodeling.pagenumber,
                            sorted: datamodeling.sorttype,
                            sortedby: datamodeling.sortdocby
                        });
                    }
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getDataRef: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.hash) {
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
            model.find(query, function (err, data) {
                var opts = [];
                var referencemodels = datamodeling.references;
                for (var i in referencemodels) {
                    opts.push({
                        path: referencemodels[i]
                    });
                }
                model.populate(data, opts, function (err, doc) {
                    if (err) {
                        return datareturn({
                            statuserror: 500,
                            message: err
                        });
                    } else if (doc) {
                        return datareturn({
                            status: 200,
                            message: 'data found',
                            response: doc
                        });
                    } else {
                        return datareturn({
                            status: 404,
                            message: 'data not found'
                        });
                    }
                });
            });
        } catch (error) {
        }
    },
    getMultiHashRef: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.hash || datamodeling.parent_hash) {
                query = [
                    {
                        hash: datamodeling.hash
                    },
                    {
                        parent_hash: datamodeling.parent_hash
                    }
                ];
            }
            model.find({
                $or: query
            }, function (err, data) {
                var opts = [];
                var referencemodels = datamodeling.references;
                for (var i in referencemodels) {
                    opts.push({
                        path: referencemodels[i]
                    });
                }
                model.populate(data, opts, function (err, doc) {
                    if (err) {
                        return datareturn({
                            statuserror: 500,
                            message: err
                        });
                    } else if (doc) {
                        return datareturn({
                            status: 200,
                            message: 'data found',
                            response: doc
                        });
                    } else {
                        return datareturn({
                            status: 404,
                            message: 'data not found'
                        });
                    }
                });
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getAllDataRef: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.usequery) {
                query = datamodeling.queryoptions;
            }
            model.find(query, function (err, data) {
                var opts = [];
                var referencemodels = datamodeling.references;
                for (var i in referencemodels) {
                    opts.push({
                        path: referencemodels[i]
                    });
                }
                model.populate(data, opts, function (err, doc) {
                    if (err) {
                        return datareturn({
                            statuserror: 500,
                            message: err
                        });
                    } else if (doc) {
                        if (datamodeling.showcount) {
                            model.count(query, function (error, countotals) {
                                if (error) {
                                    return datareturn({
                                        statuserror: 500,
                                        message: error
                                    });
                                } else if (countotals) {
                                    return datareturn({
                                        status: 200,
                                        message: 'data found',
                                        response: doc,
                                        totalresults: doc.length,
                                        pagenumber: datamodeling.pagenumber,
                                        sorted: datamodeling.sorttype,
                                        sortedby: datamodeling.sortdocby,
                                        count: countotals
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
                                pagenumber: datamodeling.pagenumber,
                                sorted: datamodeling.sorttype,
                                sortedby: datamodeling.sortdocby
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
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    getAllDataByHashRef: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (datamodeling.hash) {
                query = {
                    hash: datamodeling.hash
                };
            } else {
                query = {
                    hash: datamodeling.parent_hash
                };
            }
            model.find(query, function (err, data) {
                var opts = [];
                var referencemodels = datamodeling.references;
                for (var i in referencemodels) {
                    opts.push({
                        path: referencemodels[i]
                    });
                }
                model.populate(data, opts, function (err, doc) {
                    if (err) {
                        return datareturn({
                            statuserror: 500,
                            message: err
                        });
                    } else if (doc) {
                        return datareturn({
                            status: 200,
                            message: 'data found',
                            response: doc,
                            totalresults: doc.length,
                            pagenumber: datamodeling.pagenumber,
                            sorted: datamodeling.sorttype,
                            sortedby: datamodeling.sortdocby,
                            count: 100
                        });
                    } else {
                        return datareturn({
                            status: 404,
                            message: 'data not found'
                        });
                    }
                });
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    saveData: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            if (!datamodeling.hash) {
                datamodeling.hash = hashcode.generateHash();
            }
            model = new model(datamodeling);
            model.save(function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc) {
                    return datareturn({
                        status: 200,
                        message: 'data saved',
                        response: doc
                    });
                }
            });
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
    saveByReferenceData: function (datamodeling, model, referencemodels, datareturn) {
        try {
            var query = {};
            if (!datamodeling.hash) {
                datamodeling.hash = hashcode.generateHash();
            }
            model = new model(datamodeling);
            model.save(function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc) {
                    for (var i in referencemodels) {
                        (function () {
                            /**
                             * Instantiate the model
                             */
                            var referencemodel = referencemodels[i];
                            /**
                             * Create the update set dynamically
                             */
                            var modelname = referencemodel.modelName;
                            referencemodel.find(Object({
                                hash: datamodeling.parent_hash
                            }), function (err, doc) {
                                if (err) {
                                    return datareturn({
                                        statuserror: 500,
                                        message: err
                                    });
                                } else if (doc.length) {
                                    /**
                                     * Set the reference object id before update
                                     * @type {{}}
                                     */
                                    var referencemodelpath = {};
                                    referencemodelpath[modelname] = doc[0]._id;
                                    model.update({
                                        $set: referencemodelpath
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
                        })();
                    }
                    return datareturn({
                        status: 200,
                        message: 'data saved',
                        response: doc
                    });
                }
            });
        } catch (error) {
            //console.log(error);
        }
    },
    saveByMultiReferenceData: function (datamodeling, model, referencemodels, datareturn) {
        try {
            var query = {};
            if (!datamodeling.hash) {
                datamodeling.hash = hashcode.generateHash();
            }
            model = new model(datamodeling);
            model.save(function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc) {
                    for (var i in referencemodels) {
                        (function () {
                            /**
                             * Instantiate the model
                             */
                            var referencemodel = referencemodels[i].name;
                            /**
                             * Create the update set dynamically
                             */
                            var modelname = referencemodel.modelName;
                            referencemodel.find(Object({
                                hash: referencemodels[i].parent_hash
                            }), function (err, doc) {
                                if (err) {
                                    return datareturn({
                                        statuserror: 500,
                                        message: err
                                    });
                                } else if (doc.length) {
                                    /**
                                     * Set the reference object id before update
                                     * @type {{}}
                                     */
                                    var referencemodelpath = {};
                                    referencemodelpath[modelname] = doc[0]._id;
                                    model.update({
                                        $set: referencemodelpath
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
                        })();
                    }
                    return datareturn({
                        status: 200,
                        message: 'data saved',
                        response: doc
                    });
                }
            });
        } catch (error) {
            //console.log(error);
        }
    },
    saveByMultiRefData: function (datamodeling, model, referencemodels, datareturn) {
        try {
            var query = {};
            if (!datamodeling.hash) {
                datamodeling.hash = hashcode.generateHash();
            }
            model = new model(datamodeling);
            model.save(function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc) {
                    for (var i in referencemodels) {
                        (function () {
                            /**
                             * Instantiate the model
                             */
                            var referencemodel = referencemodels[i].reference_model;
                            /**
                             * Create the update set dynamically
                             */
                            var modelname = referencemodels[i].reference_name;
                            referencemodel.find(Object({
                                hash: referencemodels[i].reference_hash
                            }), function (err, doc) {
                                if (err) {
                                    return datareturn({
                                        statuserror: 500,
                                        message: err
                                    });
                                } else if (doc.length) {
                                    /**
                                     * Set the reference object id before update
                                     * @type {{}}
                                     */
                                    var referencemodelpath = {};
                                    referencemodelpath[modelname] = doc[0]._id;
                                    model.update({
                                        $set: referencemodelpath
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
                        })();
                    }
                    return datareturn({
                        status: 200,
                        message: 'data saved',
                        response: doc
                    });
                }
            });
        } catch (error) {
            //console.log(error);
        }
    },
    saveUniqueByMultiRefData: function (datamodeling, model, uniquefield, referencemodels, datareturn) {
        try {
            var query = {};
            /**
             *  Search if unique fields exists
             */
            model.find(uniquefield, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    return datareturn({
                        status: 202,
                        message: 'The data entered already exits',
                        response: {
                            hash: doc[0].hash
                        },
                        currentdata: Object(uniquefield),
                        dataexists: true
                    });
                } else {
                    if (!datamodeling.hash) {
                        datamodeling.hash = hashcode.generateHash();
                    }
                    var savemodel = new model(datamodeling);
                    savemodel.save(function (err, doc) {
                        if (err) {
                            return datareturn({
                                statuserror: 500,
                                message: err
                            });
                        } else if (doc) {
                            for (var i in referencemodels) {
                                (function () {
                                    /**
                                     * Instantiate the model
                                     */
                                    var referencemodel = referencemodels[i].model;
                                    /**
                                     * Create the update set dynamically
                                     */
                                    var modelname = referencemodels[i].name;
                                    referencemodel.find(Object({
                                        hash: referencemodels[i].hashref
                                    }), function (err, doc) {
                                        if (err) {
                                            return datareturn({
                                                statuserror: 500,
                                                message: err
                                            });
                                        } else if (doc.length) {
                                            /**
                                             * Set the reference object id before update
                                             * @type {{}}
                                             */
                                            var referencemodelpath = {};
                                            referencemodelpath[modelname] = doc[0]._id;
                                            savemodel.update({
                                                $set: referencemodelpath
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
                                })();
                            }
                            return datareturn({
                                status: 200,
                                message: 'data saved',
                                response: doc
                            });
                        }
                    });
                }
            });
        } catch (error) {
            //console.log(error);
        }
    },
    saveUniqueData: function (datamodeling, uniquefield, model, datareturn) {
        try {
            var query = {};
            /**
             *  Search if unique fields exists
             */
            model.find(uniquefield, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    return datareturn({
                        status: 202,
                        message: 'The data entered already exits',
                        response: [],
                        currentdata: Object(doc),
                        dataexists: true
                    });
                } else {
                    if (!datamodeling.hash) {
                        datamodeling.hash = hashcode.generateHash();
                    }
                    var modeladd = new model(datamodeling);
                    modeladd.save(function (err, docsaved) {
                        console.log(err);
                        if (err) {
                            //console.log(err);
                            return datareturn({
                                statuserror: 500,
                                message: err
                            });
                        } else if (docsaved) {
                            return datareturn({
                                status: 200,
                                message: 'data saved',
                                response: docsaved,
                                datasaved: true
                            });
                        }
                    });
                }
            });
        } catch (error) {
            //console.log(error);
        }
    },
    updateData: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            query = {
                hash: datamodeling.hash
            };
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
    searchData: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            var recordslimit = parseInt((datamodeling.recordlimit === undefined || datamodeling.recordlimit === null) ? 25 : datamodeling.recordlimit);
            var limitoptions = {};
            limitoptions.limit = recordslimit;
            model.find(datamodeling, null, {
                limit: 100
            }, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    return datareturn({
                        status: 200,
                        message: 'data found',
                        response: doc
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
    searchDataRange: function (datamodeling, model, datareturn) {
        try {
            var query = {};
            model.find(datamodeling.customquery, function (err, doc) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (doc.length) {
                    if (datamodeling.showcount) {
                        model.count(datamodeling.customquery, function (error, countotals) {
                            if (error) {
                                return datareturn({
                                    statuserror: 500,
                                    message: error
                                });
                            } else if (countotals) {
                                return datareturn({
                                    status: 200,
                                    message: 'data found',
                                    response: doc,
                                    totalresults: doc.length,
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby,
                                    count: countotals
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
                            pagenumber: datamodeling.pagenumber,
                            sorted: datamodeling.sorttype,
                            sortedby: datamodeling.sortdocby
                        });
                    }
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
            return datareturn({
                status: 404,
                message: error
            });
        }
    },
    searchByKewords: function (datamodeling, model, datareturn) {
        try {
            var query = {};

            if (!datamodeling.keywords) {
                return datareturn({
                    status: 400,
                    message: 'Keywords field cannot be blank'
                });
            }
            var keywords = [];
            for (var i = 0; i < datamodeling.fields_names.length; i++) {
                var regex = new RegExp(datamodeling.keywords + '+', "i");
                var queryregex = {};
                queryregex[datamodeling.fields_names[i]] = regex;
                keywords.push(queryregex);
            }

            if (datamodeling.usequery) {
                query = datamodeling.queryoptions;
                query.$and = [
                    {
                        $or: keywords
                    }
                ];
            } else {
                query = {
                    $or: keywords
                };
            }
            model.find(query, function (err, data) {
                if (err) {
                    return datareturn({
                        statuserror: 500,
                        message: err
                    });
                } else if (data.length) {
                    var opts = [];
                    var referencemodels = datamodeling.references;
                    for (var i in referencemodels) {
                        opts.push({
                            path: referencemodels[i]
                        });
                    }
                    model.populate(data, opts, function (err, doc) {
                        if (err) {
                            return datareturn({
                                statuserror: 500,
                                message: err
                            });
                        } else if (doc) {
                            if (datamodeling.showcount) {
                                model.count(query, function (error, countotals) {
                                    if (error) {
                                        return datareturn({
                                            statuserror: 500,
                                            message: error
                                        });
                                    } else if (countotals) {
                                        return datareturn({
                                            status: 200,
                                            message: 'data found',
                                            response: doc,
                                            totalresults: doc.length,
                                            pagenumber: datamodeling.pagenumber,
                                            sorted: datamodeling.sorttype,
                                            sortedby: datamodeling.sortdocby,
                                            count: countotals
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
                                    pagenumber: datamodeling.pagenumber,
                                    sorted: datamodeling.sorttype,
                                    sortedby: datamodeling.sortdocby
                                });
                            }
                        } else {
                            return datareturn({
                                status: 404,
                                message: 'data not found'
                            });
                        }
                    });
                } else {
                    return datareturn({
                        status: 404,
                        message: 'data not found'
                    });
                }
            })
                .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
                .limit(+datamodeling.pagelimit)
                .sort([
                    [datamodeling.sortby, datamodeling.sorttype]
                ]);
        } catch (error) {
        }
    },
    searchMultiple: function (datamodeling, model, datareturn) {
        if (!datamodeling.keywords) {
            return datareturn({
                status: 400,
                message: 'Keywords field cannot be blank'
            });
        }
        var keywords = [];
        for (var i = 0; i < datamodeling.fieldname.length; i++) {
            var regex = new RegExp(datamodeling.keywords + '+', "i");
            var queryregex = {};
            queryregex[datamodeling.fieldname[i]] = regex;
            keywords.push(queryregex);
        }
        model.find({
            $or: keywords
        }, function (err, doc) {
            if (err) {
                return datareturn({
                    statuserror: 500,
                    message: err
                });
            } else if (doc.length) {
                return datareturn({
                    status: 200,
                    message: 'data found',
                    response: doc,
                    totalresults: doc.length,
                    pagenumber: datamodeling.pagenumber,
                    sorted: datamodeling.sorttype,
                    sortedby: datamodeling.sortdocby
                });
            } else {
                return datareturn({
                    status: 404,
                    message: 'data not found'
                });
            }
        })
            .skip(+datamodeling.pagenumber * +datamodeling.pagelimit)
            .limit(+datamodeling.pagelimit)
            .sort([
                [datamodeling.sortby, datamodeling.sorttype]
            ]);
    },
    authenticateData: function (datamodeling, model, datareturn) {
        try {
            var query = {};
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