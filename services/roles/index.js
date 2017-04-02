'use strict';

const RoleQueryExecuter = require('./roleQueryExecuter');
const quark = require('quark')();

module.exports.name = 'roles';

function initialize(knex) {
    const queryExecuter = new RoleQueryExecuter(knex);

    quark.define({
        entity: 'roles',
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

    return quark;
};

module.exports.initialize = initialize;