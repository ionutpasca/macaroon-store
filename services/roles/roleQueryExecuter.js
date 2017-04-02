'use strict';

class RoleQueryExecuter {
    constructor(knex) {
        this.knex = knex;
    };

    getAll() {
        return this.knex.select().table('roles');
    }
};

module.exports = RoleQueryExecuter;