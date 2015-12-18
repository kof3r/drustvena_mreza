
var db = require('../config/db');
var CheckIt = require('checkit');
var Promise = require('bluebird');
var Mail = require('../config/mail');
var bCrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var fs = Promise.promisifyAll(require('fs'));

var ValidationError = require('./errors/validationError');

var Country = require('./country');
require('./relationship_status');
var Bubble = require('./bubble');
var Comment = require('./comment');
require('./gender');

var User = db.Model.extend({
    tableName: 'user',
    hasTimestamps : true,

    country : function () { return this.belongsTo('Country'); },
    relationshipStatus : function() { return this.belongsTo('RelationshipStatus'); },
    bubbles : function() { return this.hasMany('Bubble'); },
    comments: function() { return this.hasMany('Comment'); },
    gender: function() { return this.belongsTo('Gender'); },
    privilege: function() { return this.belongsToMany('User', 'privilege', 'permitter_id', 'permittee_id') },
    likes: function() { return this.belongsToMany('Like', 'like', 'user_id', 'content_id') },

    initialize : function() {
        this.on('created', this.onCreated, this);
        this.on('saving', this.onSaving, this)
    },

    onSaving: function () {
        return this.getUserCheckIt().run(this.attributes)
            .then(this.resolveCountry.bind(this))
            .then(this.hash.bind(this))
            .catch(CheckIt.Error, Promise.method(function(checkItError) {
                console.log(checkItError);
                throw new ValidationError(checkItError);
            }));
    },

    onCreated: function() {
        var user = this;
        return Promise.all([
            Bubble.forge({user_id: user.get('id'), bubble_type_id: 1, title: 'Timeline'}).save(),
            Bubble.forge({user_id: user.get('id'), bubble_type_id: 2, title: 'Gallery'}).save(),
            this.sendConfirmationMail(),
            this.createUserDirectories()
        ]).catch(function(error) {
            console.log(error.stack);
        });
    },

    resolveCountry :  function() {
        var user = this;
        return Country.where({name: this.get('country_name')}).fetch().then(function (country) {
            user.set('country_id', (country ? country.id : null));
        })
    },

    hash : Promise.method(function() {
        var user = this;
        if(user.hasChanged('password_hash')) {
            return bCrypt.genSaltAsync(10).then(function (salt) {
                return bCrypt.hashAsync(user.get('password_hash'), salt, null);
            }).then(function (hash) {
                user.set('password_hash', hash);
            });
        }
    }),

    sendConfirmationMail: Promise.method(function() {
        Mail.sendVerificationEmail(this.get('email'), "localhost:8080/emailverification?id=" + this.get('id') + "&hash=" + this.get('password_hash'));
    }),

    createUserDirectories: function() {
        var userDir = './user/' + this.get('username');
        return fs.mkdirAsync(userDir)
            .then(function () {
                return Promise.join(
                    fs.mkdirAsync(userDir + '/images')
                );
            });
    },

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

    getUserCheckIt : function () {
        var user = this;

        var checkIt = new CheckIt({
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
            first_name: [
                {
                    rule: 'maxLength:35',
                    message: 'First name must be at most 35 characters in length.'
                }
            ],
            last_name: [
                {
                    rule: 'maxLength:35',
                    message: 'Last name must be at most 35 characters in length.'
                }
            ],
            middle_name: [
                {
                    rule: 'maxLength:35',
                    message: 'Middle name must be at most 35 characters in length.'
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

        var passwordCheck = {
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
            ]
        }

        return checkIt.maybe(passwordCheck, function(password_hash) {
            return user.hasChanged('password_hash');
        });
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