
var knex = require('./knex');

var orm = require('bookshelf')(knex);
orm.plugin('registry');
orm.plugin('visibility');

module.exports = orm;