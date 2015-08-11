var Promise = require('bluebird');

function AuthService (app) {
  this.app = app;
  //this.session = app.request.session;
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
  var that = this;
  return new Promise(function (resolve, reject) {
    if (!that.isAuthenticated()) {
      return reject(this.ERR_NOT_AUTHENTICATED);
    }
    that.app.get('models').user.findOne({name:that.session.userDocument.name})
      .exec(function(err, userDocument) {
        if (userDocument) return resolve(userDocument);
        reject(err || false);
      });
  });
};

module.exports = function (app) {
  return new AuthService(app);
};