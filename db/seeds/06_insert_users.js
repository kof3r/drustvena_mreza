
var ValidationError = require('../../models/errors/validationError');

var User = require('../../models/user');
var Bubble = require('../../models/bubble');
var Content = require('../../models/content');
var Comment = require('../../models/comment');

exports.seed = function(knex, Promise) {
  var kolinda_id, user_id;
  var kolinda_post_naprijed_id;

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
      }).save().then(function(user) {
        user_id = user.id;
        return Bubble.where({user_id: user.id, bubble_type_id: 1}).fetch().then(function(bubble) {
          return Promise.all([
            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'Moj prvi post!'
            }).save(),

            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'Moj drugi post!'
            }).save(),

            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lobortis elit, pretium dapibus lacus. Donec venenatis rhoncus metus ac rutrum. Nulla quis sapien tristique, commodo quam sollicitudin, faucibus tortor. Nullam consectetur consectetur sapien quis dignissim. Curabitur accumsan rutrum vulputate. Proin scelerisque nisl nec sapien pharetra pretium. Aliquam erat volutpat. In feugiat laoreet odio eu porttitor. Proin laoreet diam ut sem convallis vehicula. Nunc dignissim vulputate eros, a ornare enim feugiat eget. Praesent hendrerit vulputate nunc a sodales. Aliquam ultrices leo ac blandit vehicula. Etiam iaculis luctus dui eu rhoncus. Cras facilisis convallis felis ut pulvinar. Proin at nulla ac ex ultricies pellentesque.'
            }).save(),

            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed fringilla magna. Curabitur sed nunc nulla. Aliquam metus metus, maximus eu felis non, rhoncus ornare ipsum. Nam egestas, libero non dapibus faucibus, ex dui scelerisque ipsum, vehicula luctus justo nibh vel mauris. Donec porttitor interdum urna vitae sodales. Sed vulputate, est in volutpat laoreet, sapien ligula viverra erat, pulvinar mollis ex turpis posuere nisl. Sed justo purus, placerat eget tristique non, dictum sit amet elit.'
            }).save()
          ]);
        })
      }),

      User.forge({
        username : 'kolinda',
        password_hash : 'hrvatska3',
        email : 'kolinda@hdz.hr',
        confirmed : true,
        first_name : 'Kolinda',
        last_name : 'Grabar-Kitarovi�',
        city : 'Grad Zagreb',
        country_name : 'Croatia'
      }).save().then(function(user) {
        kolinda_id = user.id;
        return Bubble.where({user_id: user.id, bubble_type_id: 1}).fetch().then(function(bubble) {
          return Promise.all([
            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'NAPRIJED RVACKA!!!!'
            }).save().then(function(content) {
              kolinda_post_naprijed_id = content.id;
            }),

            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'Upisala i ja faks!!! #studosh4life'
            }).save(),

            Content.forge({
              bubble_id : bubble.id,
              content_type_id : 1,
              content : 'Nosi mi se plava boja...'
            }).save()
          ]);
        })
      })

  ).then(function () {
        return Promise.join(
            Comment.forge({content_id: kolinda_post_naprijed_id, user_id: kolinda_id, comment: 'Ajmo, ajmo!'}).save(),
            Comment.forge({content_id: kolinda_post_naprijed_id, user_id: user_id, comment: '...rikverc!'}).save()
        );
      });
};