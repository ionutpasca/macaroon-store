'use strict';

const logger = require('../../config/winston');

class DomainQueryExecuter {
    constructor(knex) {
        this.knex = knex;
        this.fieldsAllowedToSelect = ['domains.id', 'domains.name', 'domains.user_id', 'domains.created_id'];
    };

    getAll() {
        return this.knex.select().table('domains');
    };
    getAllDomainsPoints() {
        return this.knex('domains').select('points');
    };
    // async domainExists(name) {
    //     const domainsCount = await this.knex('domains')
    //         .select(this.knex.raw('count(1) as RowsCount'))
    //         .where({ 'name': name });
    //     return domainsCount[0].RowsCount > 0 ? true : false;
    // };

    // async computeRankForDomain(domainPoints) {
    //     const domainWithLessPoints = await this.knex('domains')
    //         .select(this.knex.raw('count(1) as RowsCount'))
    //         .where('points', '>=', domainPoints);
    //     return domainWithLessPoints[0].RowsCount + 1;
    // };

    insertIntoDomains(domain) {
        this.knex.insert(domain).into('domains');
    };

    remove(domainId) {
        return this.knex().where('id', domainId).del().into('domains');
        // this.knex.transaction(async trx => {
        //     try {
        //         let domain = await trx.select().from('domains')
        //             .where('id', domainId);
        //         domain = domain[0];
                
        //         await trx.where('id', domainId).del().into('domains');

        //         trx.commit;
        //         return domainId;
        //     } catch (error) {
        //         trx.rollback;
        //         throw new Error();
        //     }
        // });
    };

};
module.exports = DomainQueryExecuter;