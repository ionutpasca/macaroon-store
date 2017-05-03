'use strict';

const DomainQueryExecuter = require('./domainQueryExecuter');
const logger = require('../../config/winston');

const quark = require('quark')();
const _ = require('lodash');

module.exports.name = 'domains';

function initialize(knex) {
    const queryExecuter = new DomainQueryExecuter(knex);

    quark.define({
        entity: 'domains',
        action: 'get_all'
    }, async (args, callback) => {
        try {
            logger.info("INTRU AICI");
            const domains = await queryExecuter.getAll();
            callback(null, domains);
        } catch (err) {
            logger.error('Error while getting all domains', err);
            callback(err);
        }
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

    quark.define({
        entity: 'domains',
        action: 'delete'
    }, async (args, callback) => {
        if (!args.id) {
            return callback('no id');
        }
        try {
            let response = await queryExecuter.remove(args.id);
            callback(null, response);
        } catch (error) {
            callback(error);
        }
    });

    return quark;
};



module.exports.initialize = initialize;