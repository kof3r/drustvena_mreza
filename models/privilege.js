/**
 * Created by Gordan on 15.12.2015..
 */

var db = require('../config/db');

require('./user');

var Privilege = db.Model.extend({

    tableName : 'privilege',

    permitter: function() { return this.belongsTo('User', 'permitter_id') },
    permittee: function() { return this.belongsTo('User', 'permittee_id') }
});

module.exports = db.model('Privilege', Privilege);