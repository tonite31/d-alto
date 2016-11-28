var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Map = new Schema({
	name : String,
	size : {
		width : Number,
		height : Number
	},
	metaObjectList : [{data : String}]
});
 
module.exports = mongoose.model('Map', Map);