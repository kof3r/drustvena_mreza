
var ValidationError = require('../../models/errors/validationError');

var User = require('../../models/user');
var Privilege = require('../../models/privilege');
var Bubble = require('../../models/bubble');
var Content = require('../../models/content');
var Comment = require('../../models/comment');

exports.seed = function(knex, Promise) {
    var kolinda_id, user_id, zeljko_id, katarina_id;

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
        }).save().then(function (user) {
            user_id = user.get('id');
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
        }).save().then(function (user) {
             kolinda_id = user.get('id');
         }),

        User.forge({
            username : 'zeljko',
            password_hash : 'zeljkozeljko',
            email : 'zeljko@test.hr',
            confirmed : true,
            first_name : 'Zeljko',
            last_name : 'Baranek',
            country_name : 'Croatia'
        }).save().then(function (user) {
            zeljko_id = user.get('id');
        }),

        User.forge({
            username : 'katarina',
            password_hash : 'katarina',
            email : 'katarina@test.hr',
            confirmed : true,
            first_name : 'Katarina',
            last_name : 'Veleglavac',
            country_name : 'Croatia'
        }).save().then(function (user) {
            katarina_id = user.get('id');
        }),

        User.forge({
            username : 'gordan',
            password_hash : 'gordangordan',
            email : 'gordan@test.hr',
            confirmed : true,
            first_name : 'Gordan',
            last_name : 'Graberec',
            country_name : 'Croatia'
        }).save(),

        User.forge({
            username : 'andrija',
            password_hash : 'andrijaandrija',
            email : 'andrija@test.hr',
            confirmed : true,
            first_name : 'Andrija',
            country_name : 'Croatia'
        }).save(),

        User.forge({
            username : 'domagoj',
            password_hash : 'domidomi',
            email : 'domagoj@test.hr',
            confirmed : true,
            first_name : 'Domagoj',
            last_name : 'Polančec',
            country_name : 'Croatia'
        }).save(),

        User.forge({
            username : 'mislav',
            password_hash : 'mislavmislav',
            email : 'mislav@test.hr',
            confirmed : true,
            first_name : 'Mislav',
            last_name : 'Lukač',
            country_name : 'Croatia'
        }).save(),

        User.forge({
            username : 'mate',
            password_hash : 'matemate',
            email : 'mate@test.hr',
            confirmed : true,
            first_name : 'Mate',
            last_name : 'Šimović',
            country_name : 'Croatia'
        }).save(),

        User.forge({
            username : 'matej',
            password_hash : 'matejmatej',
            email : 'matej@test.hr',
            confirmed : true,
            first_name : 'Matej',
            last_name : 'Vukosav',
            country_name : 'Croatia'
        }).save(),

        User.forge({
            username : 'igor',
            password_hash : 'igorigor',
            email : 'igor@test.hr',
            confirmed : true,
            first_name : 'Igor',
            last_name : 'Mekterović',
            country_name : 'Croatia'
        }).save()

  ).then(function () {

        return Promise.all([

            Privilege.forge({
                permitter_id: zeljko_id,
                permittee_id: kolinda_id
            }).save(),

            Privilege.forge({
                permitter_id: katarina_id,
                permittee_id: kolinda_id
            }).save()

        ]);

  });
};
