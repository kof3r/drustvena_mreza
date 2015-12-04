/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');
db.plugin('registry');

var ContentType = db.Model.extend({
    tableName : 'content_type',
    contents : function() { return this.hasMany('Content'); }
});

module.exports = db.model('ContentType', ContentType);
