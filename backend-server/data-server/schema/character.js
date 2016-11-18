var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Character = new Schema({
	userId : String,
	name : String,
	skills : [Number]
});
 
module.exports = mongoose.model('character', Character);