function up(knex, Promise) {
    return Promise.all([
        knex.schema
            .createTable('possible_answers', table => {
                table.increments('id').primary();
                table.integer('question_id').unsigned().notNullable().references('id').inTable('questions');
                table.string('answers', 255);
            }),
        knex.schema
            .createTable('friends', table => {
                table.increments('id').primary();
                table.integer('first_user').unsigned().notNullable().references('id').inTable('users');
                table.integer('second_user').unsigned().notNullable().references('id').inTable('users');
                table.dateTime('created_at');
            }),
        knex.schema
            .createTable('matches', table => {
                table.increments('id').primary();
                table.dateTime('start_date');
                table.dateTime('end_date');
                table.integer('winner_id').unsigned().notNullable().references('id').inTable('users');
            }),
        knex.schema
            .createTable('matches_history', table => {
                table.increments('id').primary();
                table.integer('match_id').unsigned().notNullable().references('id').inTable('matches');
                table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
            }),
        knex.schema
            .createTable('match_history_questions', table => {
                table.increments('id').primary();
                table.integer('match_history_id').unsigned().notNullable().references('id').inTable('matches_history');
                table.integer('question_id').unsigned().notNullable().references('id').inTable('questions');
                table.string('user_answer', 255);
                table.boolean('is_correct_answer').defaultTo(true);
            })
    ])

};

function down(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIsExists('possible_answers'),
        knex.schema.dropTableIsExists('friends'),
        knex.schema.dropTableIsExists('matches'),
        knex.schema.dropTableIsExists('matches_history'),
        knex.schema.dropTableIsExists('match_history_questions')

    ]);

};
module.exports.up = up;
module.exports.down = down;