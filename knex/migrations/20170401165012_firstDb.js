export function up(knex, Promise) {
    return Promise.all([
        knex.schema
        .createTable('roles', table => {
            table.increments('id').primary();
            table.string('name', 20).notNullable().unique('uq_role_name');
        }),

        knex.schema
        .createTable('users', table => {
            table.increments('id').primary();
            table.string('email', 40).notNullable().unique('uq_user_email');
            table.string('name', 50).notNullable();
            table.string('password', 255);
            table.integer('points').defaultTo(0);
            table.integer('rank');
            table.dateTime('created_at');
            table.dateTime('last_login');
            table.boolean('is_active').defaultTo(true);
        }),

        knex.schema
        .createTable('user_roles', table => {
            table.increments('id').primary();
            table.integer('role_id').unsigned().notNullable().references('id').inTable('roles');
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        })
    ]);
};

export function down(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIsExists('UserRoles'),
        knex.schema.dropTableIsExists('Roles'),
        knex.schema.dropTableIsExists('Users')
    ]);
};