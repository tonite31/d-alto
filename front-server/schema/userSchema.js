var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var User = new Schema({
	username : String,
	password : String,
	loginState : Boolean
});
 
module.exports = mongoose.model('user', User);