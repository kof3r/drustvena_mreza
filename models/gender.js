/**
 * Created by Gordan on 10.12.2015..
 */

var db = require('../config/db');

require('./user');

var Gender = db.Model.extend({
    tableName : 'gender',
    contents : function() { return this.hasMany('User'); }
});

module.exports = db.model('Gender', Gender);
