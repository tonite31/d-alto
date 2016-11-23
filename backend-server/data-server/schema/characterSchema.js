var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Character = new Schema({
	username : String,
	name : String,
	hp : Number,
	mp : Number,
	attackPoint : Number,
	attackRange : Number,
	moveSpeed : Number
});
 
module.exports = mongoose.model('character', Character);