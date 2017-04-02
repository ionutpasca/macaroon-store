'use strict';

class UserQueryExecuter {
    constructor(knex) {
        this.knex = knex;
        this.allowedFields = ['users.id', 'users.email', 'users.name', 'users.points',
            'users.rank', 'users.created_at', 'users.last_login'
        ];
    };

    getOneUser(userId) {
        const allowedFields = this.allowedFields.concat('roles.name as user_role');
        return this.knex('users')
            .where({ 'users.id': userId })
            .innerJoin('user_roles', 'user_roles.user_id', '=', 'users.id')
            .innerJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            .select(allowedFields);
    };

    getAll() {
        return this.knex.select().table('roles');
        // const allowedFields = this.allowedFields.concat('roles.name as user_role');
        // return this.knex('users')
        //     .innerJoin('user_roles', 'user_roles.user_id', '=', 'users.id')
        //     .innerJoin('roles', 'user_roles.role_id', '=', 'roles.id')
        //     .select(allowedFields);
    };

};

module.exports = UserQueryExecuter;