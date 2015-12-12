/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');

require('./user');

var Country = db.Model.extend({
    tableName : 'country',
    users : function() {
        return this.hasMany('User');
    }
});

module.exports = db.model('Country', Country);