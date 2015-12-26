/**
 * Created by Gordan on 26.12.2015..
 */

var config = require('../knexfile');
module.exports = require('knex')(config['development']);