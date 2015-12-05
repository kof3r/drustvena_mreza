
exports.seed = function(knex, Promise) {
  return Promise.join(

      knex('content_type').insert({description : 'post'})

  );
};
