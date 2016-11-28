var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Object = new Schema({
	name : String,
	property : {
		collision : Boolean,
		interactive : Boolean,
		movable : Boolean,
		size : {
			width : Number,
			height : Number
		},
		collisionSize : {
			width: Number,
			height: Number
		},
		image : String
	},
	location: {
		mapId : String,
		position : {
			x : Number,
			y : Number
		}
	},
	stat: {
		moveSpeed : Number
	}
});
 
module.exports = mongoose.model('Object', Object);