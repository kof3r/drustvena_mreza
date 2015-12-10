
var User = require('../../models/user');

var bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {
  return Promise.join(

      User.forge({
        username : 'user',
        password : 'useruser',
        email : 'user@fer.hr',
        confirmed : true,
        first_name : 'Ivan',
        last_name : 'Horvat',
        city : 'Zagreb',
        country_id : 'HR'
      }).save(),

      User.forge({
        username : 'kolinda',
        password : 'hrvatska3',
        email : 'kolinda@hdz.hr',
        confirmed : true,
        first_name : 'Kolinda',
        last_name : 'Grabar-Kitarovi�',
        city : 'Grad Zagreb',
        country_id : 'HR'
      }).save()

  );
};
