var chai = require('chai'),
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('db', function() {

  require('./db/userSchemaTest');

});

describe('routes', function () {

  require('./routes/playRoutesTest');

});

describe('services', function () {

  require('./services/wordnikServiceTest');

});