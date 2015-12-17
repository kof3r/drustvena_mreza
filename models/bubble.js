/**
 * Created by Gordan on 4.12.2015..
 */

var db = require('../config/db');
var Promise = require('bluebird');
var CheckIt = require('checkit');

var ValidationError = require('./errors/validationError');

require('./user');
require('./bubble_type');
require('./content');

var Bubble = db.Model.extend({

    tableName : 'bubble',
    hasTimestamps : true,

    user : function() { return this.belongsTo('User'); },
    bubble_type : function() { return this.belongsTo('BubbleType'); },
    contents : function() { return this.hasMany('Content'); },

    initialize: function() {
        this.on('saving', this.onSaving, this)
    },

    onSaving: function() {
        return this.validateBubble();
    },

    validateBubble: function () {
        return this.getCheckit().run(this.attributes).catch(CheckIt.Error, Promise.method(function (checkItError) {
            throw new ValidationError(checkItError);
        }));
    },

    getCheckit: function () {
        return new CheckIt({
            title: [
                {
                    rule: 'required',
                    message: 'A bubble must have a title is required.'
                }
            ]
        });
    },

    format: function(attributes) {

        attributes.title = attributes.title || null;
        attributes.description = attributes.description || null;

        return attributes;
    }
});

module.exports = db.model('Bubble', Bubble);
