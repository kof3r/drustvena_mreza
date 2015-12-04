
var User = require('../../models/user');
var Bubble = require('../../models/bubble');
var Content = require('../../models/content');

var bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {
  return Promise.join(

      knex('country').insert({id : 'HR', name : 'Croatia'}),
      knex('country').insert({id : 'RS', name: 'Serbia'}),
      knex('country').insert({id : 'SI', name: 'Slovenia'}),


      knex('relationship_status').insert({description : 'Single'}),
      knex('relationship_status').insert({description : 'In a relationship'}),
      knex('relationship_status').insert({description : 'Complicated'}),
      knex('relationship_status').insert({description : 'Other'}),


      knex('bubble_type').insert({description : 'user'}),
      knex('bubble_type').insert({description: 'created'}),


      knex('content_type').insert({description : 'post'}),


      User.forge({
          username : 'user',
          password_hash : bcrypt.hashSync('useruser'),
          email : 'user@fer.hr',
          confirmed : true,
          first_name : 'Ivan',
          last_name : 'Horvat',
          city : 'Zagreb',
          country_id : 'HR'
      }).save(),
      
      User.forge({
          username : 'kolinda',
          password_hash : bcrypt.hashSync('hrvatska3'),
          email : 'kolinda@hdz.hr',
          confirmed : true,
          first_name : 'Kolinda',
          last_name : 'Grabar-Kitarovi�',
          city : 'Grad Zagreb',
          country_id : 'HR'
      }).save(),

      Bubble.forge({
          user_id : 1,
          bubble_type_id : 1
      }).save(),

      Content.forge({
          bubble_id : 1,
          content_type_id : 1,
          content : 'Moj prvi post!'
      }).save(),

      Content.forge({
          bubble_id : 1,
          content_type_id : 1,
          content : 'Moj drugi post!'
      }).save()

  );
};