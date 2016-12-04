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
		moveSpeed : Number,
		attackSpeed : Number, //기본 공격이 1초인데. 이게 %다. 50이면 %. 즉 0.5초가 된다. 최대 상한은 70%이다.
		
		maxAttackSpeed : {type: Number, default: 70}
	}
});
 
module.exports = mongoose.model('Object', Object);