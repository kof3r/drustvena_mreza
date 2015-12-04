
exports.up = function(knex, Promise) {

    return Promise.all([

        knex.schema.createTable('country', function(t){
            t.string('id', 2).primary();
            t.string('name').notNullable().unique();
        }),

        knex.schema.createTable('relationship_status', function(t) {
            t.increments().primary();
            t.string('description').notNullable().unique();
        }),

        knex.schema.createTable('user', function(t) {
            t.increments().primary();
            t.string('username').notNullable().unique();
            t.string('password_hash', 60).notNullable();
            t.string('email', 254).notNullable().unique();
            t.boolean('confirmed').notNullable().defaultsTo(false);
            t.timestamps();
            t.string('first_name');
            t.string('last_name');
            t.string('middle_name');
            t.string('country_id', 2).references('id').inTable('country');
            t.string('city');
            t.string('address');
            t.integer('relationship_status_id').unsigned().references('id').inTable('relationship_status');
        }),

        knex.schema.createTable('bubble_type', function(t){
            t.increments().primary();
            t.string('description').notNullable().unique();
        }),

        knex.schema.createTable('bubble', function(t) {
            t.integer('user_id').unsigned().references('id').inTable('user').notNullable();
            t.increments().primary();
            t.integer('bubble_type_id').unsigned().references('id').inTable('bubble_type').notNullable();
            t.timestamps();
            t.string('title');
            t.string('description');
        }),

        knex.schema.createTable('content_type', function(t) {
            t.increments().primary();
            t.string('description').notNullable().unique();
        }),

        knex.schema.createTable('content', function(t) {
            t.integer('bubble_id').unsigned().references('id').inTable('bubble').notNullable();
            t.increments().primary();
            t.integer('content_type_id').unsigned().references('id').inTable('content_type').notNullable();
            t.timestamps();
            t.string('title');
            t.text('content').notNullable();
        })

    ]);

};

exports.down = function(knex, Promise) {

    return Promise.all([

        knex.schema.dropTable('content'),

        knex.schema.dropTable('content_type'),

        knex.schema.dropTable('bubble'),

        knex.schema.dropTable('bubble_type'),

        knex.schema.dropTable('user'),

        knex.schema.dropTable('relationship_status'),

        knex.schema.dropTable('country')

    ]);

};
