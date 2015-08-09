var assert = require("assert"),
  sinon = require("sinon");

describe('db', function() {

  describe('Users', function() {

    var Users = require("users.js");
    var users = new Users;

    describe('#fetchUserByName', function () {

      it('should yield what the database yields', function () {
        var mockDoc = {a:1};
        var stub = sinon.stub(users.userCollection, "findOne", function (query, callback) {
          callback(undefined, mockDoc);
        });
        users.fetchUserByName('username')
          .then(function(user) {
            assert.equals(user, mockDoc);
          });
        stub.restore();
      });

    });

  });

  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });

});