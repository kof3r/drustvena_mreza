
var db = require('../config/db');
db.plugin('registry');

var bcrypt = require('bcrypt-nodejs');

var User = db.Model.extend({
    tableName: 'user',
    hasTimestamps : true,
    country : function () { return this.belongsTo('Country'); },
    relationshipStatus : function() { return this.belongsTo('RelationshipStatus'); },
    bubbles : function() { return this.hasMany('Bubble'); }
});

User.validPassword = function(pass1,pass2) {
    return bcrypt.compareSync(pass1,pass2);
};

User.generateHash = function(password) {
    return bcrypt.hashSync(password);
};

module.exports=db.model('User', User);
