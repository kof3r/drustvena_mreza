
var config = require('../knexfile');
var knex = require('knex')(config['development']);

var DB = require('bookshelf')(knex);

module.exports = DB;