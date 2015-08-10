var Deferred = require('promised-io/promise').Deferred;

function AuthService (app) {
  this.app = app;
  this.ERR_NOT_AUTHENTICATED = 'err_not_authenticated';
}

AuthService.prototype.initialize = function (session) {
  session.userDocument = session.userDocument || undefined;
  this.session = session;
};

AuthService.prototype.authenticate = function (userDocument){
  this.session.userDocument = userDocument;
};

AuthService.prototype.isAuthenticated = function () {
  return this.session.userDocument !== undefined;
};

AuthService.prototype.getCurrentUserDocument = function (cb) {
  var deferred = new Deferred();
  if (!this.isAuthenticated()) {
    deferred.reject(this.ERR_NOT_AUTHENTICATED);
    return deferred;
  }
  this.app.get('models').user.findOne({name:this.session.userDocument.name})
    .exec(function(err, userDocument) {
      if (userDocument) return deferred.resolve(userDocument);
      deferred.reject(err || false);
    });
  return deferred;
};

module.exports = function (app) {
  return new AuthService(app);
};