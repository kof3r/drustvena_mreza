
var db = require('../config/db');
var Checkit = require('checkit');
var Promise = require('bluebird');

var Country = require('./country');
require('./relationship_status');
require('./bubble');

var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

var User = db.Model.extend({
    tableName: 'user',
    hasTimestamps : true,
    country : function () { return this.belongsTo('Country'); },
    relationshipStatus : function() { return this.belongsTo('RelationshipStatus'); },
    bubbles : function() { return this.hasMany('Bubble');},

    initialize : function() {
        this.on('saving', this.onSaving, this);
    },

    onSaving : function() {
        var user = this;
        var passwordChanged = user.hasChanged('password_hash');
        var checkIt = Checkit(getRules(this)).maybe(passwordRules, function () {
            return passwordChanged;
        });
        return checkIt.run(this.attributes).then(Promise.method(function () {
            if(passwordChanged) {
                return user.hash();
            }
        }));
    },

    hash: function() {
        var model = this;
        return bcrypt.genSaltAsync(10).then(function (salt) {
            return bcrypt.hashAsync(model.attributes.password_hash, salt, null);
        }).then(Promise.method(function (hash) {
            model.attributes.password_hash = hash;
        }));
    }
});

User.validPassword = function(pass1,pass2) {
    return bcrypt.compareSync(pass1,pass2);
};

User.generateHash = function(password) {
    return bcrypt.hashSync(password);
};

module.exports=db.model('User', User);

var passwordRules = {
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
            {
                rule: function (username) {
                    return User.where({username: username}).fetch().then(function (fetchedUser) {
                        if (fetchedUser && fetchedUser.id !== user.id && fetchedUser.username === user.username){
                            throw new Error('Username already exists.');
                        }
                    })
                }
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
            {
                rule: function (email) {
                    return User.where({email: email}).fetch().then(function (fetchedUser) {
                        if (fetchedUser && fetchedUser.id !== user.id && fetchedUser.email === user.email) {
                            throw new Error('Email already exists.');
                        }
                    })
                }
            }

        ],
        country_id: [
            {
                rule: Promise.method(function (country_id) {
                    if (country_id) {
                        Country.where({id: country_id}).fetch().then(function (country) {
                            if (!country) {
                                throw new Error('Country does not exist.');
                            }
                        });
                    }
                })
            }
        ]
    };

    return rules;
}