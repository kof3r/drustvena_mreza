/**
 * Created by Gordan on 12.12.2015..
 */

var db = require('../config/db');

require('./user');

var Gender = db.Model.extend({
    tableName : 'gender',
    users : function() { return this.hasMany('User'); }
});

module.exports = db.model('Gender', Gender);
