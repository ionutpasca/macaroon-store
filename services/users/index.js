'use strict';

const UserUtils = require('./userUtils');
const userUtils = new UserUtils();

const UserQueryExecuter = require('./userQueryExecuter');
const RoleQueryExecuter = require('../roles/roleQueryExecuter');

const quark = require('quark')();
const Treeize = require('treeize');

const _ = require('lodash');

module.exports.name = 'users';

function initialize(knex) {
    const queryExecuter = new UserQueryExecuter(knex);
    const roleQueryExecuter = new RoleQueryExecuter(knex);

    quark.define({
        entity: 'users',
        action: 'get_one'
    }, async (args, callback) => {
        if (!args.id) {
            return callback('no id');
        }
        try {
            const userId = parseInt(args.id);
            const getResult = await queryExecuter.getOne(userId);

            const tree = new Treeize();
            tree.grow(getResult);
            let users = tree.getData();
            callback(null, users);
        } catch (error) {
            callback(error);
        };
    });

    quark.define({
        entity: 'users',
        action: 'get_all'
    }, async (args, callback) => {
        try {
            const getAllResult = await queryExecuter.getAll();
            const tree = new Treeize();
            tree.grow(getAllResult);
            let users = tree.getData();

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
        let userToInsert = userUtils.mapDtoToDatabaseModel(args.user);
        try {
            const userRole = args.user.roleId ? 
                args.user.roleId : 
                await roleQueryExecuter.getDefaultRole();

            let usersPoints = await queryExecuter.getAllUsersPoints();
            usersPoints = _.map(usersPoints, 'points');
            userToInsert.rank = userUtils.findUserRank(usersPoints, userToInsert.points);

            const insertResult = await queryExecuter.insert(userToInsert, userRole);
            callback(null, insertResult);
        } catch (error) {
            callback(error);
        };
    });

    return quark;
};

module.exports.initialize = initialize;