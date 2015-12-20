
var config = require('../knexfile');
var knex = require('knex')(config['development']);

var orm = require('bookshelf')(knex);
orm.plugin('registry');

module.exports = orm;