var EventEmitter = require('events').EventEmitter
  , db = require('./db')
  , config = require('../config');

function Users() {
  this.userCollection = db.collection('users');
};

Users.prototype.addUser = function(username, callback) {
  var userDocument = {
    name: username,
    created: new Date,
    modified: new Date,
    words: []
  };
  this.userCollection.insert(userDocument, function(err, inserted) {
    if(err) throw err;
    callback(userDocument);
  });
};

Users.prototype.fetchUserByName = function(username, callback) {
  this.userCollection.findOne({name: username}, function(err, userDocument) {
      if(err || !userDocument) {
        console.log('No user document found for: ' + username);
        callback(undefined);
      } else {
        console.log('User document found for: ' + username);
        callback(userDocument);
      }
  });
};

Users.prototype.__proto__ = EventEmitter.prototype;

module.exports = Users;