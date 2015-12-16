var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose setup for users

module.exports = mongoose.model('User', new Schema({
  name : String,
  password: String,
  admin: Boolean

}));