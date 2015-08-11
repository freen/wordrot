var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var wordSchema = new Schema({
  word: { type: String, index: true },
  definitions: Array
});

module.exports = wordSchema;