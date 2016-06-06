"use strict";

/**
 * Custom modules
 * @type {*}
 */

global.app_dirname;

var hashcode = require(app_dirname + '/helpers/hashgenerator');
var client = [];
var elk_uri = process.env.ELK_URL;
var elk_port_number = process.env.ELK_PORT_NUMBER;
var elk_username = process.env.ELK_USER;
var elk_password = process.env.ELK_PASS;


/**
 * Elastic Search Instance (Global) connection
 * @type {es|exports}
 */
var elasticsearch = require('elasticsearch');

if (process.env.ELK_ENGINE_PASSWORD_ENABLED === 'true') {
    client = new elasticsearch.Client({
        host: 'http://' + elk_username + ':' + elk_password + '@' + elk_uri + ':' + elk_port_number,
        log: 'trace',
        requestTimeout: Infinity,
        keepAlive: true,
        levels: ['error']
    });
} else {
    client = new elasticsearch.Client({
        host: 'http://' + elk_uri + ':' + elk_port_number,
        log: 'trace',
        requestTimeout: Infinity,
        keepAlive: true,
        levels: ['error', 'warning']
    });
}


/**
 * Display the path of the database in use
 */
console.log('ELK engine Uri: %s', elk_uri);

module.exports = {
    createData: function (datamodeling, datareturn) {

        try {

            if (!datamodeling.hash)
                datamodeling.hash = hashcode.generateHash();

            client.create({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                id: datamodeling.hash,
                date: datamodeling.timestamp,
                requestTimeout: Infinity,
                body: {
                    doc: datamodeling.body,
                    date: datamodeling.timestamp,
                    published: true,
                    updated: false

                }
            }).then(function (resp) {
                return datareturn({status: 200, message: 'data saved', response: resp });
            }, function (err) {
                return datareturn({statuserror: err.status, message: err});
            });

        }
        catch (error) {
            console.log(error + 'entered');
        }


    },
    displayAllData: function (datamodeling, datareturn) {

        try {

            client.search({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: {
                    "query": {
                        "match_all": {}
                    }
                }

            }).then(function (resp) {
                return datareturn({status: 200, message: 'data found', response: resp });
            }, function (err) {
                return datareturn({statuserror: 404, message: err});
            });

        }
        catch (error) {


        }


    },
    getData: function (datamodeling, datareturn) {

        console.log(datamodeling);

        try {

            client.get({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                id: datamodeling.hash
            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'data found', response: response });
                }
            });

        }
        catch (error) {

        }


    },
    getListData: function (datamodeling, datareturn) {

        try {


            var doclist = []

            for (var i = 0; i < datamodeling.doclist.length; i++) {
                doclist.push({ _index: datamodeling[i].indexname, _type: datamodeling[i].indextype, _id: datamodeling[i].hash })
            }

            client.mget({
                body: {
                    docs: doclist
                }
            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'data deleted', response: response });
                }
            });

        }
        catch (error) {

        }


    },

    searchData: function (datamodeling, datareturn) {

        try {

            client.search({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: datamodeling.query
            }).then(function (resp) {
                return datareturn({status: 200, message: 'data found', response: resp });
            }, function (err) {
                return datareturn({statuserror: 500, message: err});
            });

        }
        catch (error) {

        }


    },
    queryData: function (datamodeling, datareturn) {

        try {

            client.search({
                index: datamodeling.indexname,
//                scroll: '30s',
//                search_type: 'scan',
//                fields: [datamodeling.fields],
                q: datamodeling.query
            }).then(function (resp) {
                return datareturn({status: 200, message: 'data found', response: resp });
            }, function (err) {
                return datareturn({statuserror: 500, message: err});
            });

        }
        catch (error) {

        }


    },
    searchDataWithAggregates: function (datamodeling, datareturn) {

        try {

            client.search({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: {
                    "query": {
                        "match": {
                            "doc.cs-version": datamodeling.version
                        }

                    },

                    "aggs": {
                        "total_bandwidth": { "sum": { "field": "doc.filesize" } }
                    }
                }
            }).then(function (resp) {
                return datareturn({status: 200, message: 'search found', response: resp });
            }, function (err) {
                return datareturn({statuserror: 500, message: err});
            });

        }
        catch (error) {

        }


    },


    searchDSLData: function (datamodeling, datareturn) {

        try {

            client.search({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: {
                    "query": {
                        "match": datamodeling.query
                    }
                }

            }).then(function (resp) {
                return datareturn({status: 200, message: 'data found', response: resp });
            }, function (err) {
                return datareturn({statuserror: 404, message: err});
            });

        }
        catch (error) {


        }


    },

    searchDateRange: function (datamodeling, datareturn) {

        try {

            /**
             * Query Example
             * {"indexname":"hw_api","indextype":"e2s6i6e5","fromDate":"1458583200000","toDate":"1458583200000","query":"CDI"}
             */
            client.search({

                    index: datamodeling.indexname,
                    type: datamodeling.indextype,
                    body: {
                        "from": 0, "size": datamodeling.size,
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                        "fields": datamodeling.fields,
                                        "query_string": {
                                            "query": datamodeling.query,
                                            "default_operator": "AND"
                                        }
                                    },
                                    {
                                        "range": {
                                            "doc.report_datetime": {
                                                "gte": datamodeling.fromdate,
                                                "lte": datamodeling.todate
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        "sort": [
                            {
                                "doc.report_datetime": {
                                    "order": (datamodeling.sorttype) ? datamodeling.sorttype : 'DESC'
                                }
                            }
                        ],
                        "aggs": {

                            "max_report_datetime": { "max": { "field": "doc.report_datetime" } },
                            "min_report_datetime": { "min": { "field": "doc.report_datetime" } },
                            "transfer_used_total_mb_stats": { "extended_stats": { "field": "doc.metrics.transfer_used_total_mb" } },
                            "request_count_total_stats": { "extended_stats": { "field": "doc.metrics.request_count_total" } }

                        }


                    }
                }


            ).
                then(function (resp) {
                    return datareturn({status: 200, message: 'data found', response: resp });
                }, function (err) {
                    return datareturn({statuserror: 404, message: err});
                });

        }
        catch (error) {


        }


    },
    searchPhraseData: function (datamodeling, datareturn) {


        try {


            client.search({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": datamodeling.query
                                }
                            ]
                        }
                    }
                }


            }).then(function (resp) {
                return datareturn({status: 200, message: 'data found', response: resp });
            }, function (err) {
                return datareturn({statuserror: 404, message: err});
            });

        }
        catch (error) {


        }


    },

    saveIndexData: function (datamodeling, datareturn) {

        try {

            if (!datamodeling.hash)
                datamodeling.hash = hashcode.generateHash();

            client.index({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                id: datamodeling.hash,
                requestTimeout: Infinity,
                body: {
                    doc: datamodeling.body,
                    published: true,
                    updated: false
                }
            }).then(function (resp) {
                return datareturn({status: 200, message: 'data saved', response: resp });
            }, function (err) {
                return datareturn({statuserror: err.status, message: err});
            });

        }
        catch (error) {
            console.log(error + 'entered');
        }


    },


    deleteData: function (datamodeling, datareturn) {

        try {

            client.indices.delete({

                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: {
                    "query": {
                        "match_all": {}
                    }
                }

            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'data deleted', response: response });
                }

            });

        }
        catch (error) {

        }


    },
    countData: function (datamodeling, datareturn) {

        try {

            client.count({

                index: datamodeling.indexname,
                type: datamodeling.indextype,
                body: {
                    "from": 0, "size": datamodeling.size,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "fields": datamodeling.fields,
                                    "query_string": {
                                        "query": datamodeling.query,
                                        "default_operator": "AND"
                                    }
                                },
                                {
                                    "range": {
                                        "doc.report_datetime": {
                                            "gte": datamodeling.fromDate,
                                            "lte": datamodeling.toDate
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }


            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'data count', response: response });
                }
            });

        }
        catch (error) {

        }


    },
    checkIfExist: function (datamodeling, datareturn) {

        try {


            client.exists({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                id: datamodeling.hash
            }, function (error, exists) {

                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {

                    var data = {ifexists: exists}
                    return datareturn({status: 200, message: 'data exists', response: data });

                }


            });

        }
        catch (error) {

        }


    },
    explainData: function (datamodeling, datareturn) {

        try {


            client.explain({
                // the document to test
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                id: datamodeling.hash,

                // the query to score it against
                q: datamodeling.query
            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'data deleted', response: response });
                }
            });

        }
        catch (error) {

        }


    },
    updateData: function (datamodeling, datareturn) {

        try {


            client.update({
                index: datamodeling.indexname,
                type: datamodeling.indextype,
                id: datamodeling.hash,
                body: {
                    doc: {doc: datamodeling.body },
                    updated: true
                }
            }, function (error, exists) {

                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    var data = {ifexists: exists}
                    return datareturn({status: 200, message: 'data updated', response: data });
                }


            });

        }
        catch (error) {

        }


    },
    pingServer: function (datamodeling, datareturn) {

        try {

            client.ping({
                // ping usually has a 3000ms timeout
                requestTimeout: Infinity,

                // undocumented params are appended to the query string
                hello: "elasticsearch!"
            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'Server pinged', response: response });
                }
            });

        }
        catch (error) {

        }


    },
    serverInfo: function (datamodeling, datareturn) {

        try {


            client.info({
                requestTimeout: Infinity
            }, function (error, response) {
                if (error) {
                    return datareturn({statuserror: error.status, message: error});
                } else {
                    return datareturn({status: 200, message: 'Server info', response: response });
                }
            });

        }
        catch (error) {

        }


    }
}
;

