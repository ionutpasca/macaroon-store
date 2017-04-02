'use strict';

const UserUtils = require('./userUtils');
const userUtils = new UserUtils();
const UserQueryExecuter = require('./userQueryExecuter');
const quark = require('quark')();

module.exports.name = 'users';

function initialize(knex) {
    const queryExecuter = new UserQueryExecuter(knex);

    quark.define({
        entity: 'users',
        action: 'get_one'
    }, (args, callback) => {
        if (!args.id) {
            return callback('no id');
        }
        const userId = parseInt(args.id);
        queryExecuter.getOneUser(userId)
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
        action: 'get_all'
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


    return quark;
};

module.exports.initialize = initialize;