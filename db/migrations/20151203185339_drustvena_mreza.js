
exports.up = function(knex, Promise) {

    var createCountry =  knex.schema.createTable('country', function(t){
        t.string('id', 2).primary();
        t.string('name').notNullable().unique();
    });

    var createRelationshipStatus = knex.schema.createTable('relationship_status', function(t) {
        t.increments().primary();
        t.string('description').notNullable().unique();
    });

    var createUser = knex.schema.createTable('user', function(t) {
        t.increments().primary();
        t.string('username').notNullable().unique();
        t.string('password_hash', 60).notNullable();
        t.string('email', 254).notNullable().unique();
        t.boolean('confirmed').notNullable().defaultsTo(false);
        t.timestamps();
        t.string('first_name').defaultsTo(null);
        t.string('last_name').defaultsTo(null);
        t.string('middle_name').defaultsTo(null);;
        t.string('country_id', 2).references('id').inTable('country').defaultsTo(null);;
        t.string('city').defaultsTo(null);;
        t.string('address').defaultsTo(null);;
        t.integer('relationship_status_id').unsigned().references('id').inTable('relationship_status').defaultsTo(null);;
        t.integer('gender_id').unsigned().references('id').inTable('gender').defaultsTo(null);;
    });

    var createBubbleType = knex.schema.createTable('bubble_type', function(t){
        t.increments().primary();
        t.string('description').notNullable().unique();
    });

    var createBubble = knex.schema.createTable('bubble', function(t) {
        t.integer('user_id').unsigned().references('id').inTable('user').notNullable();
        t.increments().primary();
        t.integer('bubble_type_id').unsigned().references('id').inTable('bubble_type').notNullable();
        t.timestamps();
        t.string('title');
        t.string('description');
    });

    var createContentType = knex.schema.createTable('content_type', function(t) {
        t.increments().primary();
        t.string('description').notNullable().unique();
    });

    var createContent = knex.schema.createTable('content', function(t) {
        t.integer('bubble_id').unsigned().references('id').inTable('bubble').notNullable();
        t.increments().primary();
        t.integer('content_type_id').unsigned().references('id').inTable('content_type').notNullable();
        t.timestamps();
        t.string('title');
        t.text('content').notNullable();
        t.string('description');
    });

    var createComment = knex.schema.createTable('comment', function (t) {
        t.increments().primary();
        t.integer('content_id').unsigned().notNullable().references('id').inTable('content');
        t.integer('user_id').unsigned().notNullable().references('id').inTable('user');
        t.timestamps();
        t.text('comment');
    });

    var createGender = knex.schema.createTable('gender', function (t) {
        t.increments().primary();
        t.string('type', 6).notNullable().unique();
    });

    var createPrivilege = knex.schema.createTable('privilege', function(t) {
        t.integer('permitter_id').unsigned().references('id').inTable('user').notNullable();
        t.integer('permitee_id').unsigned().references('id').inTable('user').notNullable();
    });

    return Promise.all([
        createCountry,
        createRelationshipStatus,
        createBubbleType,
        createContentType,
        createGender
    ]).then(function () {
        return Promise.all([
            createUser,
            createBubble,
            createContent
        ]);
    }).then( function () {
        return Promise.all([
            createComment,
            createPrivilege
        ]);
    });

};

exports.down = function(knex, Promise) {

    return Promise.all([

        knex.schema.dropTable('comment'),
        knex.schema.dropTable('privilege')

    ]).then(function () {

        Promise.all([

            knex.schema.dropTable('content'),
            knex.schema.dropTable('bubble'),
            knex.schema.dropTable('user')

        ])

    }).then (function () {

        return Promise.all([

            knex.schema.dropTable('content_type'),
            knex.schema.dropTable('bubble_type'),
            knex.schema.dropTable('relationship_status'),
            knex.schema.dropTable('country'),
            knex.schema.dropTable('gender')

        ]);
    });

};