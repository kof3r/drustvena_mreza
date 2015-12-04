/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');
db.plugin('registry');

var BubbleType = db.Model.extend({
    tableName : 'bubble_type',
    bubbles : function() { return this.hasMany('Bubble'); }
});

module.exports = db.model('BubbleType', BubbleType);