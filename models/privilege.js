/**
 * Created by Gordan on 15.12.2015..
 */

var db = require('../config/db');

require('./user');

var Privilege = db.Model.extend({

    tableName : 'privilege',

    permitter: function() { return this.belongsTo('User', 'permitter_id') },
    permitee: function() { return this.belongsTo('User', 'permitee_id') }
});

module.exports = db.model('Privilege', Privilege);