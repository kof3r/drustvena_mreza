
var User = require('../../models/user');

exports.seed = function(knex, Promise) {
  return Promise.join(

      User.where({username: 'kolinda'}).fetch().then(function (kolinda) {
        return Promise.join(
            kolinda.forgeComment({content_id: 4, comment: 'Ajmo!'}).save(),
            kolinda.forgeComment({content_id: 4, comment: '-.-!'}).save()
        );
      }),
      User.where({username: 'user'}).fetch().then(function (user) {
            return user.forgeComment({content_id: 4, comment: '...rikverc!'}).save();
      })

  );
};