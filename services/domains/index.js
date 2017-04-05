'use strict';

const DomainQueryExecuter = require('./domainQueryExecuter');
const quark = require('quark')();

module.exports.name = 'domains';

function initialize(knex) {
    const queryExecuter = new DomainQueryExecuter(knex);

    quark.define({
        entity: 'domains',
        action: 'get_all'
    }, (args, callback) => {

        queryExecuter.getAll()
            .then(result => {
                callback(null, result);
            })
            .catch(err => {
                callback(err);
            });
    });

    quark.define({
        entity: 'domains',
        action: 'insert_into_domains'
    }, (args, callback) => {
        var domain = args.domain;
        queryExecuter.insertIntoDomains(domain)
            .then(result => {
                callback(null, result);
            })
            .catch(err => {
                callback(err);
            });
    });

    return quark;
};


module.exports.initialize = initialize;