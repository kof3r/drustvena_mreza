
var bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {
  return Promise.join(

      knex('country').insert({name : 'Croatia'}),
      knex('country').insert({name: 'Serbia'}),
      knex('country').insert({name: 'Slovenia'}),


      knex('relationship_status').insert({description : 'Single'}),
      knex('relationship_status').insert({description : 'In a relationship'}),
      knex('relationship_status').insert({description : 'Complicated'}),
      knex('relationship_status').insert({description : 'Other'}),


      knex('bubble_type').insert({description : 'user'}),
      knex('bubble_type').insert({description: 'created'}),


      knex('content_type').insert({description : 'post'}),


      knex('user').insert({
        username : 'user',
        password_hash : bcrypt.hashSync('useruser'),
        email : 'user@fer.hr',
        confirmed : true,
        first_name : 'Ivan',
        last_name : 'Horvat',
        city : 'Zagreb'
      })
      
      knex('user').insert({
        username : 'kolinda',
        password_hash : bcrypt.hashSync('hrvatska3'),
        email : 'kolinda@hdz.hr',
        confirmed : true,
        first_name : 'Kolinda',
        last_name : 'Grabar-Kitaroviæ',
        city : 'Grad Zagreb',
        country : 1
      })

  );
};
