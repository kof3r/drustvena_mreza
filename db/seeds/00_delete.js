
exports.seed = function(knex, Promise) {
  return Promise.join(

      knex('user').del(),
      knex('country').del(),
      knex('relationship_status').del(),
      knex('bubble_type').del(),
      knex('content_type').del()

  );
};