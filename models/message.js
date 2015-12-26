/**
 * Created by Domagoj on 27.12.2015..
 */
var orm = require('../config/orm');
require('./user');

var Message = orm.Model.extend({

    tableName : 'message',
    hasTimestamps : true,

    sender: function() { return this.belongsTo('User', 'sender') },
    recipient: function() { return this.belongsTo('User', 'recipient') }
});

module.exports = orm.model('Message', Message);