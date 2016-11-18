var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Skill = new Schema({
	number : Number,
	name : String
});
 
module.exports = mongoose.model('skill', Skill);