'use strict';

class DomainQueryExecuter {
    constructor(knex) {
        this.knex = knex;
        //this.allowedFields = ['domains.id','domains.name','domains.user_id','domains.created_id'];
    };

    getAll() {
        return this.knex.select().table('domains');
    };

    insertIntoDomains(domain) {
        this.knex.insert(domain).into('domains');
    }

};
module.exports = DomainQueryExecuter;