'use strict';

const logger = require('../../config/winston');

class UserQueryExecuter {
    constructor(knex) {
        this.knex = knex;
        this.fieldsAllowedToSelect = ['users.id', 'users.email', 'users.name', 'users.points',
            'users.rank', 'users.created_at', 'users.last_login', 'users.profile_image_path',
            'users.profile_image_url'
        ];
    };

    getOne(queryData) {
        let whereCondition = {};
        for (let key in queryData) {
            let conditionKey = 'users.' + key;
            whereCondition[conditionKey] = queryData[key];
        }

        const selectFields = this.fieldsAllowedToSelect.concat('roles.name as roles:role');
        return this.knex('users')
            .where(whereCondition)
            .innerJoin('user_roles', 'user_roles.user_id', '=', 'users.id')
            .innerJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            .select(selectFields);
    };

    getOneByEmail(userEmail, includePassword) {
        let selectFields = this.fieldsAllowedToSelect.concat('roles.name as roles:role');
        if (includePassword) {
            selectFields = selectFields.concat('users.password');
        }
        return this.knex('users')
            .where({ 'users.email': userEmail })
            .innerJoin('user_roles', 'user_roles.user_id', '=', 'users.id')
            .innerJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            .select(selectFields);
    };

    getAll() {
        const selectFields = this.fieldsAllowedToSelect.concat('roles.name as roles:role');
        return this.knex('users')
            .innerJoin('user_roles', 'user_roles.user_id', '=', 'users.id')
            .innerJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            .select(selectFields);
    };

    getAllUsersPoints() {
        return this.knex('users').select('points');
    };

    async userExists(email) {
        const usersCount = await this.knex('users')
            .select(this.knex.raw('count(1) as RowsCount'))
            .where({ 'email': email });
        return usersCount[0].RowsCount > 0 ? true : false;
    };

    async computeRankForUser(userPoints) {
        const usersWithLessPoints = await this.knex('users')
            .select(this.knex.raw('count(1) as RowsCount'))
            .where('points', '>=', userPoints);
        return usersWithLessPoints[0].RowsCount + 1;
    };

    async insert(user, role) {
        return new Promise((resolve, reject) => {
            this.knex.transaction(async trx => {
                try {
                    logger.info('INTUR IN TRY');
                    const insertedUserId = await trx.insert(user).into('users');
                    logger.info('INSERTED USER', insertedUserId)
                    const userRole = {
                        role_id: role.id,
                        user_id: insertedUserId[0]
                    };
                    logger.info('ROLE', userRole);
                    await trx.insert(userRole).into('user_roles')
                    await trx.increment('rank').where('points', '<', user.points).into('users');

                    trx.commit;
                    resolve(insertedUserId[0]);
                } catch (error) {
                    logger.error('ERROR', error);
                    trx.rollback();
                    reject(error);
                }
            });
        });
    };

    remove(userId) {
        this.knex.transaction(async trx => {
            try {
                let user = await trx.select().from('users')
                    .where('id', userId);
                user = user[0];

                await trx.where('rank', '>', user.rank)
                    .decrement('rank')
                    .into('users');

                await trx.where('user_id', userId).del().into('user_roles');
                await trx.where('id', userId).del().into('users');

                trx.commit;
                return userId;
            } catch (error) {
                trx.rollback;
                throw new Error();
            }
        });
    };

};

module.exports = UserQueryExecuter;