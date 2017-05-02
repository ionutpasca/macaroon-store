
function up(knex, Promise) {
	return Promise.all([
		knex.schema
			.createTable('chat_rooms', table => {
				table.increments('id').primary();
				table.integer('first_user').unsigned().notNullable().references('id').inTable('users');
				table.integer('second_user').unsigned().notNullable().references('id').inTable('users');
				table.dateTime('created_at');
				table.integer('initializer_id').unsigned().notNullable().references('id').inTable('users');
			}),
		
		knex.schema
			.createTable('chat_messages', table => {
				table.increments('id').primary();
				table.integer('chat_room_id').unsigned().notNullable().references('id').inTable('chat_rooms');
				table.integer('sender').unsigned().notNullable().references('id').inTable('users');
				table.string('message', 255);
				table.dateTime('sending_date');
			})
	]);
};

function down(knex, Promise) {
	return Promise.all([
		knex.schema.dropTableIsExists('chat_rooms'),
		knex.schema.dropTableIsExists('chat_messages')
	]);
};

module.exports.up = up;
module.exports.down = down;