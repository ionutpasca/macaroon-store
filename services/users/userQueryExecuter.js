'use strict';

class UserQueryExecuter {
    constructor(knex) {
        this.knex = knex;
        this.fieldsAllowedToSelect = ['users.id', 'users.email', 'users.name', 'users.points',
            'users.rank', 'users.created_at', 'users.last_login'
        ];
    };

    getOne(userId) {
        const selectFields = this.fieldsAllowedToSelect.concat('roles.name as roles:role');
        return this.knex('users')
            .where({ 'users.id': userId })
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

    insert(user, roleId) {
        return this.knex('users').insert(user)
            .then(insertedUserId => {
                const userRole = {
                    role_id: roleId,
                    user_id: insertedUserId
                };
                return this.knex('user_roles').insert(userRole);
            });
    };

};

module.exports = UserQueryExecuter;