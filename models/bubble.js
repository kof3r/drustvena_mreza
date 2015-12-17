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
        return this.getCheckIt().run(this.attributes).catch(CheckIt.Error, Promise.method(function (checkItError) {
            throw new ValidationError(checkItError);
        }));
    },

    getCheckIt: function () {
        return new CheckIt({
            title: [
                {
                    rule: 'required',
                    message: 'A bubble must have a title.'
                },
                {
                    rule: 'maxLength:255',
                    message: 'A bubble title is limited to 255 characters.'
                }
            ]
        });
    },

    format: function(attributes) {
        attributes.description = attributes.description || null;

        return attributes;
    }
});

module.exports = db.model('Bubble', Bubble);
