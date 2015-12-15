
var db = require('../config/db');
var CheckIt = require('checkit');
var Promise = require('bluebird');
var Mail = require('../config/mail');

var ValidationError = require('./errors/validationError');

var Country = require('./country');
require('./relationship_status');
var Bubble = require('./bubble');
var Comment = require('./comment');
require('./gender');

var bCrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

var User = db.Model.extend({
    tableName: 'user',
    hasTimestamps : true,

    country : function () { return this.belongsTo('Country'); },
    relationshipStatus : function() { return this.belongsTo('RelationshipStatus'); },
    bubbles : function() { return this.hasMany('Bubble'); },
    comments: function() { return this.hasMany('Comment'); },
    gender: function() { return this.belongsTo('Gender'); },
    privilege: function() { return this.belongsToMany('User', 'privilege', 'permitter_id', 'permittee_id') },

    initialize : function() {
        this.on('creating', this.onCreating, this);
        this.on('created', this.onCreated, this);
        this.on('updating', this.onUpdating, this);
    },

    onCreating : function() {
        var user = this;
        return this.validateNewUser()
            .then(this.resolveCountry.bind(this))
            .then(this.hash.bind(this))
            .catch(CheckIt.Error, function(checkError) {
                return user.throwValidationError(checkError);
            });
    },

    onCreated: function() {
        var user = this;
        return Promise.all([
            Bubble.forge({user_id: user.get('id'), bubble_type_id: 1}).save(),
            Bubble.forge({user_id: user.get('id'), bubble_type_id: 2}).save(),
            this.sendConfirmationMail()
        ]);
    },

    onUpdating: function () {
        var user = this;
        return this.getExistingUserCheckIt().run(this.attributes)
            .then(this.resolveCountry.bind(this))
            .catch(CheckIt.Error, function (checkError) {
                return user.throwValidationError(checkError);
            })
    },

    validateNewUser : function() {
        return this.getNewUserCheckIt().run(this.attributes);
    },

    resolveCountry :  function() {
        var user = this;
        return Country.where({name: this.get('country_name')}).fetch().then(function (country) {
            user.set('country_id', (country ? country.id : null));
        })
    },

    hash : function() {
        var user = this;
        return bCrypt.genSaltAsync(10).then(function (salt) {
            return bCrypt.hashAsync(user.get('password_hash'), salt, null);
        }).then(function (hash) {
            user.set('password_hash', hash);
        });
    },

    throwValidationError : Promise.method(function (checkError) {
        var user = this;
        var error = [];
        checkError.forEach(function (val, key) {
            val.forEach(function(message) {
                error.push(message);
            })
        });
        throw new ValidationError(user, error);
    }),

    sendConfirmationMail: Promise.method(function() {
        Mail.sendVerificationEmail(this.get('email'), "localhost:8080/emailverification?id=" + this.get('id') + "&hash=" + this.get('password_hash'));
    }),

    format: function(attributes) {
        attributes.first_name = attributes.first_name || null;
        attributes.last_name = attributes.last_name || null;
        attributes.middle_name = attributes.middle_name || null;
        attributes.city = attributes.city || null;
        attributes.address = attributes.address || null;
        attributes.gender_id = attributes.gender_id || null;
        attributes.relationship_status_id = attributes.relationship_status_id || null;

        delete attributes.country_name;
        return attributes;
    },

    getNewUserCheckIt : function () {
        var user = this;

        return new CheckIt({
            username: [
                {
                    rule: 'required',
                    message: 'Username is required.'
                },
                {
                    rule: 'minLength:3',
                    message: 'Username must be at least 3 characters in length.'
                },
                {
                    rule: 'maxLength:30',
                    message: 'Username must be at most 30 characters in length'
                },
                {
                    rule: 'alphaDash',
                    message: 'Username must consist of alphanumerics, dashes and underscores.'
                },
                function (username) {
                    return User.where({username: username}).fetch().then(function (fetchedUser) {
                        if (fetchedUser && fetchedUser.id !== user.id && fetchedUser.username === user.username){
                            throw new Error('Username already exists.');
                        }
                    })
                }
            ],
            password_hash: [
                {
                    rule: 'required',
                    message: 'Password is required'
                },
                {
                    rule: 'minLength:8',
                    message: 'Password must be at least 8 characters in length.'
                },
                {
                    rule: 'maxLength:30',
                    message: 'Password must be at most 30 characters in length.'
                },
                {
                    rule: 'alphaDash',
                    message: 'Password must consist of alphanumerics, dashes and underscores.'
                }
            ],
            email: [
                {
                    rule: 'required',
                    message: 'Email is required.'
                },
                {
                    rule: 'email',
                    message: 'Invalid email format.'
                },
                function (email) {
                    return User.where({email: email}).fetch().then(function (fetchedUser) {
                        if (fetchedUser && fetchedUser.id !== user.id && fetchedUser.email === user.email) {
                            throw new Error('Email already exists.');
                        }
                    })
                }
            ],
            country_name: [
                function(country) {
                    return Country.where({name: country}).fetch().then(function (fetchedCountry) {
                        if(!fetchedCountry) {
                            throw new Error('Country does not exist.');
                        }
                    })
                }
            ]
        });
    },

    getExistingUserCheckIt: function () {
        var user = this;

        return new CheckIt({
            country_name: [
                function(country) {
                    return Country.where({name: country}).fetch().then(function (fetchedCountry) {
                        if(!fetchedCountry) {
                            throw new Error('Country does not exist.');
                        }
                    })
                }
            ]
        });
    },

    getCreatedBubbles : function() {
        var user_id = this.get('id');
        return Bubble.query({where: {user_id: user_id}, andWhere: {bubble_type_id: 3}}).fetchAll({columns: ['id', 'title']});
    },

    createBubble : function(attributes) {
        attributes['bubble_type_id'] = 3;
        attributes['user_id'] = this.get('id');
        return Bubble.forge(attributes).save();
    },

    validPassword: function(password) {
        return bCrypt.compareSync(password, this.get('password_hash'));
    }
});

module.exports=db.model('User', User);