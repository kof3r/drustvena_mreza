
var db = require('../config/db');
var Checkit = require('checkit');
var Promise = require('bluebird');

var ValidationError = require('./errors/validationError');

var Country = require('./country');
require('./relationship_status');
var Bubble = require('./bubble');
var Comment = require('./comment');

var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

var User = db.Model.extend({
    tableName: 'user',
    hasTimestamps : true,
    country : function () { return this.belongsTo('Country'); },
    relationshipStatus : function() { return this.belongsTo('RelationshipStatus'); },
    bubbles : function() { return this.hasMany('Bubble');},
    comments: function () { return this.hasMany('Comment'); },

    constructor: function() {
        db.Model.apply(this, arguments);
        this.checkIt = getCheckIt.call(this);
    },

    initialize : function() {
        this.on('created', this.onCreated, this);
        this.on('saving', this.onSaving, this);
    },

    onSaving : function() {
        var user = this;
        return this.validateUser()
            .then(function () {

                return Promise.all([
                    user.hashIfNeeded(),
                    user.resolveCountry()
                ]).then(function () {
                    return Promise.resolve();
                });

            }).catch(Checkit.Error, function(checkError) {
                var error = [];
                checkError.forEach(function (val, key) {
                    val.forEach(function(message) {
                        error.push(message);
                    })
                });
                throw new ValidationError(error);
            });
    },

    onCreated: function() {
        var user = this;
        return Promise.all([
            Bubble.forge({user_id: user.get('id'), bubble_type_id: 1}).save(),
            Bubble.forge({user_id: user.get('id'), bubble_type_id: 2}).save()
        ]);
    },

    format: function(attributes) {
        delete attributes.password;
        delete attributes.country;
        return attributes;
    },

    validateUser : function() {
        return this.checkIt.run(this.attributes);
    },

    hashIfNeeded : function() {
        var user = this;
        if(this.hasChanged('password')) {
            return bcrypt.genSaltAsync(10).then(function (salt) {
                return bcrypt.hashAsync(user.attributes.password, salt, null);
            }).then(Promise.method(function (hash) {
                user.attributes.password_hash = hash;
            }));
        }

        return Promise.resolve();
    },

    resolveCountry : function() {
        var user = this;
        if(this.hasChanged('country')) {
            return Country.where({name: this.get('country')}).fetch().then(function (country) {
                user.set('country_id', country.id);
                return Promise.resolve();
            })
        }
        return Promise.resolve();
    }
});

function getCheckIt() {
    var user = this;
    return Checkit(getRules(this)).maybe(passwordRules, function () {
        return user.hasChanged('password');
    });
}

User.prototype.getCreatedBubbles = function() {
    var user_id = this.get('id');
    return Bubble.query({where: {user_id: user_id}, andWhere: {bubble_type_id: 3}}).fetchAll({columns: ['id', 'title']});
};

User.prototype.createBubble = function(attributes) {
    attributes['bubble_type_id'] = 3;
    attributes['user_id'] = this.get('id');
    return Bubble.forge(attributes).save();
};

User.prototype.forgeComment = function(attributes) {
    attributes['user_id'] = this.get('id');
    return Comment.forge(attributes);
};

User.prototype.editComment = function(comment_id, content) {
    var user = this;
    return Comment.where({id: comment_id}).fetch().then(function (comment) {
        comment.set('comment', content);
        return comment.save();
    })
}

User.prototype.deleteComment = function(comment_id) {
    return Comment.where({id: comment_id}).fetch().then(function (comment) {
        comment.set('comment', content);
        return comment.save();
    })
}

User.validPassword = function(pass1,pass2) {
    return bcrypt.compareSync(pass1,pass2);
};

User.generateHash = function(password) {
    return bcrypt.hashSync(password);
};

module.exports=db.model('User', User);

var passwordRules = {
    password: [
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
};

function getRules(user) {
    var rules = {
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
        country:[
            function(country) {
                    return Country.where({name: country}).fetch().then(function (fetchedCountry) {
                        if(!fetchedCountry) {
                            throw new Error('Country does not exist.');
                        }
                    })
                }
        ],
        country_id:[
            function(country_id) {
                    return Country.where({id: country_id}).fetch().then(function (country) {
                        if(!country) {
                            throw new Error('Country with provided iso code does not exist.');
                        }
                    })
                }
        ]
    };

    return rules;
}