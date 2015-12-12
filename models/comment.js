/**
 * Created by Gordan on 9.12.2015..
 */

var db = require('../config/db');

require('./user');
require('./content');

var Comment = db.Model.extend({
    tableName : 'comment',
    hasTimestamps : true,
    user : function() { return this.belongsTo('User'); },
    contents : function() { return this.belongsTo('Content'); }
});

module.exports = db.model('Comment', Comment);
