
function up(knex, Promise) {
    return Promise.all([
        knex.schema
            .createTable('domains', table => {
                table.increments('id').primary();
                table.string('name', 20).notNullable().unique('uq_domain_name');
                table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
                table.dateTime('created_at');
            }),

        knex.schema
            .createTable('questions', table => {
                table.increments('id').primary();
                table.string('question', 255).notNullable();
                table.string('answer', 255).notNullable();
                table.integer('domain_id').unsigned().notNullable().references('id').inTable('domains');
            })

    ])

};

function down(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIsExists('Domains'),
        knex.schema.dropTableIsExists('Questions')
    ])

};

module.exports.up = up;
module.exports.down = down;