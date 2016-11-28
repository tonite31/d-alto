var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var Object = new Schema({
	name : String,
	property : {
		collision : Boolean, //충돌체크 하는지
		interactive : Boolean, //사용자 상호작용이 필요한지
		movable : Boolean, //움직일 수 있는지
		size : { //실제 이미지 사이즈
			width : Number,
			height : Number
		},
		collisionSize : { //충돌체크용 사이즈
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