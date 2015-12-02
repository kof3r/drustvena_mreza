var con = {
   host: 'localhost',  
   user: 'root', 
   password: 'root',
   database: 'drustvena_mreza',
   charset: 'utf8',
   port: '3306'
};

var knex=require('knex')({
   client: 'mysql',
   debug:false,
   connection: con
});
var DB = require('bookshelf')(knex);

module.exports.DB = DB;
