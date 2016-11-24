var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Dungeon = new Schema({
	number : Number,
	name : String,
	mapNumber : Number
});
 
module.exports = mongoose.model('dungeon', Dungeon);