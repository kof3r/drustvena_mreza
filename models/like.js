/**
 * Created by Gordan on 17.12.2015..
 */

var db = require('../config/db');

require('./user');
require('./content');

var Like = db.Model.extend({

    tableName : 'like',
    hasTimestamps: true,

    user : function() { return this.belongsTo('User'); },
    content: function() { return this.belongsTo('Content') }

});

module.exports = db.model('Like', Like);
