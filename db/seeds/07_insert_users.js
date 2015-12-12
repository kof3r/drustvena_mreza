
var ValidationError = require('../../models/errors/validationError');

var User = require('../../models/user');
var Bubble = require('../../models/bubble');
var Content = require('../../models/content');
var Comment = require('../../models/comment');

exports.seed = function(knex, Promise) {

  return Promise.join(

      User.forge({
        username : 'user',
        password_hash : 'useruser',
        email : 'user@fer.hr',
        confirmed : true,
        first_name : 'Ivan',
        last_name : 'Horvat',
        city : 'Zagreb',
        country_id : 'HR'
      }).save(),

      User.forge({
        username : 'kolinda',
        password_hash : 'hrvatska3',
        email : 'kolinda@hdz.hr',
        confirmed : true,
        first_name : 'Kolinda',
        last_name : 'Grabar-Kitarovi�',
        city : 'Grad Zagreb',
        country_name : 'Croatia'
      }).save()

  );
};
