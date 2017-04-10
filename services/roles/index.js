'use strict';

const RoleQueryExecuter = require('./roleQueryExecuter');
const quark = require('quark')();

module.exports.name = 'roles';

function initialize(knex) {
    const queryExecuter = new RoleQueryExecuter(knex);

    quark.define({
        entity: 'roles',
        action: 'get_all'
    }, async (args, callback) => {
        try {
            const roles = await queryExecuter.getAll();
            callback(null, roles);
        } catch (error) {
            callback(error);
        };
    });

    return quark;
};

module.exports.initialize = initialize;