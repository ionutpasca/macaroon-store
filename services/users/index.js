'use strict';

const UserUtils = require('./userUtils');
const UserQueryExecuter = require('./userQueryExecuter');
const quark = require('quark')();
const userUtils = new UserUtils();

exports.initialize = (knex) => {
    const queryExecuter = new UserQueryExecuter(knex);

    quark.define({
        entity: 'users',
        action: 'getAll'
    }, (args, callback) => {
        queryExecuter.getAll()
            .then(result => {
                const users = userUtils.mapUsersToDto(result);
                callback(null, users);
            })
            .catch(err => {
                callback(err);
            });
    });

    quark.define({
        entity: 'users',
        action: 'getOne',
    }, (args, callback) => {
        if (!args.id) {
            return callback('no id');
        }
        const userId = parseInt(args.id);
        queryExecuter.getOne(userId)
            .then(result => {
                const user = userUtils.mapUsersToDto(result);
                callback(null, user);
            })
            .callback(err => {
                callback(err);
            });
    });

    return quark;
};