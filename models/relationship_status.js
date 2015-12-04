/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');

require('./user');

var RelationshipStatus = db.Model.extended({
    tableName : 'relationship_status',
    users : function() { return this.hasMany('User'); }
});

module.exports = db.model('RelationshipStatus', RelationshipStatus);