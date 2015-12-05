
var Bubble = require('../../models/bubble');

exports.seed = function(knex, Promise) {
  return Promise.join(

      Bubble.forge({
        user_id : 1,
        bubble_type_id : 1
      }).save()

  );
};
