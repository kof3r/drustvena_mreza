/**
 * Created by Gordan on 4.12.2015..
 */

var orm = require('../config/orm');

require('./bubble');
require('./content_type');

var CheckIt = require('checkit');
var Promise = require('bluebird');
var ValidationError = require('./errors/validationError');

var Content = orm.Model.extend({

    tableName : 'content',
    hasTimestamps : true,

    bubble : function() { return this.belongsTo('Bubble'); },
    contentType : function() { return this.belongsTo('ContentType'); },
    comments : function() { return this.hasMany('Comment'); },
    likes: function() { return this.belongsToMany('Like', 'like', 'content_id', 'user_id') },
    dislikes: function() { return this.belongsToMany('Dislike', 'dislike', 'content_id', 'user_id') },

    initialize: function() {
        this.on('saving', this.onSaving, this);
    },

    onSaving: function() {
        return this.getCheckit().run(this.attributes).catch(CheckIt.Error, Promise.method(function (error) {
            throw new ValidationError(error);
        }))
    },

    getCheckit: function() {
        return new CheckIt(require('./validation/content'));
    }

});

module.exports = orm.model('Content', Content);