
function up(knex, Promise) {
	return knex.schema.table('users', table => {
		table.string('facebook_id', 255);
		table.string('profile_image_path', 100);
		table.string('profile_image_url', 255);
	});
};

function down(knex, Promise) {
	return knex.schema.table('users', table => {
		table.dropColumn('facebook_id');
		table.dropColumn('profile_image_path');
		table.dropColumn('profile_image_url');
	});
};

module.exports.up = up;
module.exports.down = down;