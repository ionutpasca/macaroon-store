'use strict';

class RoleQueryExecuter {
    constructor(knex) {
        this.knex = knex;
    };

    getAll() {
        return this.knex('roles').select();
    };

    async getDefaultRole() {
        const role = await this.knex('roles')
            .where('name', 'default')
            .select('id')
            .limit(1);
        return role[0].id;
    };
};

module.exports = RoleQueryExecuter;