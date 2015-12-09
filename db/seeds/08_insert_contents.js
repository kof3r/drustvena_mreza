
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
      }).save(),

      Content.forge({
          bubble_id : 1,
          content_type_id : 1,
          content : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lobortis elit, pretium dapibus lacus. Donec venenatis rhoncus metus ac rutrum. Nulla quis sapien tristique, commodo quam sollicitudin, faucibus tortor. Nullam consectetur consectetur sapien quis dignissim. Curabitur accumsan rutrum vulputate. Proin scelerisque nisl nec sapien pharetra pretium. Aliquam erat volutpat. In feugiat laoreet odio eu porttitor. Proin laoreet diam ut sem convallis vehicula. Nunc dignissim vulputate eros, a ornare enim feugiat eget. Praesent hendrerit vulputate nunc a sodales. Aliquam ultrices leo ac blandit vehicula. Etiam iaculis luctus dui eu rhoncus. Cras facilisis convallis felis ut pulvinar. Proin at nulla ac ex ultricies pellentesque.'
      }).save(),

      Content.forge({
          bubble_id : 1,
          content_type_id : 1,
          content : 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed fringilla magna. Curabitur sed nunc nulla. Aliquam metus metus, maximus eu felis non, rhoncus ornare ipsum. Nam egestas, libero non dapibus faucibus, ex dui scelerisque ipsum, vehicula luctus justo nibh vel mauris. Donec porttitor interdum urna vitae sodales. Sed vulputate, est in volutpat laoreet, sapien ligula viverra erat, pulvinar mollis ex turpis posuere nisl. Sed justo purus, placerat eget tristique non, dictum sit amet elit.'
      }).save(),

      Content.forge({
          bubble_id : 3,
          content_type_id : 1,
          content : 'NAPRIJED RVACKA!!!!'
      }).save(),

      Content.forge({
          bubble_id : 3,
          content_type_id : 1,
          content : 'Upisala i ja faks!!! #studosh4life'
      }).save(),

      Content.forge({
          bubble_id : 3,
          content_type_id : 1,
          content : 'Nosi mi se plava boja...'
      }).save()



  );
};
