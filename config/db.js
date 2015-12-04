
var config = require('../knexfile');
var knex = require('knex')(config['development']);

var DB = require('bookshelf')(knex);
DB.plugin('registry');

module.exports = DB;