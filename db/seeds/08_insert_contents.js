
var Content = require('../../models/content');

exports.seed = function(knex, Promise) {
  return Promise.join(

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
