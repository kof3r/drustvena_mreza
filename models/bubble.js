/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');

require('./user');
require('./bubble_type');
require('./content');

var Bubble = db.Model.extend({
    tableName : 'bubble',
    hasTimestamps : true,
    user : function() { return this.belongsTo('User'); },
    bubble_type : function() { return this.belongsTo('BubbleType'); },
    contents : function() { return this.hasMany('Content'); }
});

module.exports = db.model('Bubble', Bubble);
