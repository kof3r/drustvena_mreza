/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');

require('./bubble');
require('./content_type');

var Content = db.Model.extend({
    tableName : 'content',
    hasTimestamps : true,
    bubble : function() { return this.belongsTo('Bubble'); },
    contentType : function() { return this.belongsTo('ContentType'); },
    comments : function() { return this.hasMany('Comment'); }
});

module.exports = db.model('Content', Content);