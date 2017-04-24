'use strict';

const UserUtils = require('./userUtils');
const userUtils = new UserUtils();

const UserQueryExecuter = require('./userQueryExecuter');
const RoleQueryExecuter = require('../roles/roleQueryExecuter');

const quark = require('quark')();
const _ = require('lodash');

module.exports.name = 'users';

function initialize(knex) {
    const queryExecuter = new UserQueryExecuter(knex);
    const roleQueryExecuter = new RoleQueryExecuter(knex);

    quark.define({
        entity: 'users',
        action: 'get_one'
    }, async (args, callback) => {
        if (!args.data) {
            return callback('no data');
        }
        try {
            // const userId = parseInt(args.id);
            const getResult = await queryExecuter.getOne(args.data);
            let users = userUtils.growTreeFromData(getResult)[0];

            callback(null, users);
        } catch (error) {
            callback(error);
        };
    });

    quark.define({
        entity: 'users',
        action: 'get_one_by_email_and_pass'
    }, async (args, callback) => {
        if (!args.email || !args.password) {
            return callback('no data');
        }
        try {
            const getResult = await queryExecuter.getOneByEmail(args.email, true);
            const user = userUtils.growTreeFromData(getResult)[0];

            const passwordsMatch = await userUtils.comparePasswords(args.password, user.password);
            if (!passwordsMatch) {
                let notFoundErr = new Error('Unauthorized');
                notFoundErr.status = 401;
                callback(notFoundErr);
            }
            callback(null, user);
        } catch (error) {
            callback(error);
        }
    });

    quark.define({
        entity: 'users',
        action: 'user_exists'
    }, async (args, callback) => {
        if (!args.email) {
            return callback('no data');
        }
        try {
            const userExists = await queryExecuter.userExists(args.email);
            callback(null, userExists);
        } catch (error) {
            callback(error);
        }
    });

    quark.define({
        entity: 'users',
        action: 'get_all'
    }, async (args, callback) => {
        try {
            const getAllResult = await queryExecuter.getAll();
            let users = userUtils.growTreeFromData(getAllResult);

            users = userUtils.mapUsersToDto(users);
            callback(null, users);
        } catch (error) {
            callback(error);
        };
    });

    quark.define({
        entity: 'users',
        action: 'insert'
    }, async (args, callback) => {
        const user = args.user;
        let userToInsert = userUtils.mapDtoToDatabaseModel(user);
        try {
            const userRole = await roleQueryExecuter.getDefaultRole();
            userToInsert.rank = await queryExecuter.computeRankForUser(userToInsert.points);
            if (user.password) {
                userToInsert.password = await userUtils.encryptPassword(user.password);
            }
            
            const insertedUserId = await queryExecuter.insert(userToInsert, userRole);
            userToInsert = _.assign(userToInsert,
                {
                    roles: [userRole.name],
                    id: insertedUserId
                });
            callback(null, userToInsert);
        } catch (error) {
            callback(error);
        };
    });

    quark.define({
        entity: 'users',
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