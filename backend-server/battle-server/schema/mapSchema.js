var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Map = new Schema({
	number : Number,
	name : String,
	data : String
});
 
module.exports = mongoose.model('map', Map);