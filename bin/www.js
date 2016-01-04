#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('drustvena_mreza:server');
var http = require('http');


migrate();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io').listen(server);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function migrate() {
  var config = require('../knexfile');
  var knex = require('knex')(config['development']);



  knex.migrate.currentVersion([config]).then(function (currentVersion) {

    knex.migrate.latest([config]).then( function() {

      knex.migrate.currentVersion([config]).then(function (newVersion) {
        if(currentVersion !== newVersion) {
          knex.seed.run();
        }
        console.log(currentVersion + '---' + newVersion);
      })

    });

  });
}

// socket.io
var connectedUsers = {};
var User = require('../models/user');
var Message = require('../models/message');

// chat auth stuff
//var cookieParser = require('cookie-parser');
//var passportSocketIo = require("passport.socketio");

//io.use(passportSocketIo.authorize({
//  cookieParser: cookieParser,       // the same middleware you registrer in express
//  key: 'connect.sid',       // the name of the cookie where express/connect stores its session_id
//  secret: 'secret',    // the session_secret to parse the cookie
//  store:
//  success: onAuthorizeSuccess,  // *optional* callback on success - read more below
//  fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below
//}));

//function onAuthorizeSuccess(data, accept){
//  console.log('successful connection to socket.io');
//
//  accept();
//}

//function onAuthorizeFail(data, message, error, accept){
//  if(error)
//    accept(new Error(message));
//}

io.on('connection', function(socket){
  console.log('a user connected');
  //console.log(socket.handshake.headers)

  var username;
  socket.on('join', function(user){
    console.log('user ' + user + 'joined chat on socket ' + socket)
    connectedUsers[user.data.username] = socket;
    username = user.data.username;
  })

  socket.on('send', function(msg){

    if (!connectedUsers[msg.data.sender]){
      return socket.emit('errNotJoined', err(403))
    }

    Message.forge({
      sender: msg.data.sender,
      recipient: msg.data.recipient,
      message: msg.data.message
    }).save().then(function(saved, err){
      if (err){
        return socket.emit('errInternal', err(500))
      }

      var response = buildResponse(saved);

      socket.emit('success', response)

      if (connectedUsers[msg.data.recipient]){
        connectedUsers[msg.data.recipient].emit('newMsg', response);
      }
    });

  });

  socket.on('disconnect', function() {
    console.log('user on socket ' + socket + ' disconnected');
    connectedUsers[username] = undefined;
  });
});

function buildResponse(msg){
  return {
    status: 200,
    data: msg
  }
}

function err(code){
  return {
    status: code,
    data: null
  }
}

module.exports = server;