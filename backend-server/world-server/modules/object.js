var uuid = require('uuid');
var random = require("random-js")();

module.exports = (function()
{
	var object = {};
	
	(function()
	{
		this.create = function()
		{
			var self = {};
			self.id = uuid.v4();
			
			//시스템 로직을 위해 필요한 값들.
			self.property = {
				collision : true, //충돌 체크 할것인지.
				interactive : false, //사용자와 상호작용 할것인지.
				movable : false, //이동 가능한 녀석인지.
				size : {width: 0, height: 0}, //오브젝트의 실제 크기
				collisionSize : {width: 0, height: 0}, //충돌체크할때 쓸 사이즈
				position : {x : 0, y : 0}, //오브젝트의 위치
				prevPosition : {x : 0, y : 0}, //오브젝트의 이전 위치
				image : '' //이미지 주소
			};
			
			//캐릭터의 스탯.
			self.stat = {
				moveSpeed : 1
			};
			
			if(this.createCallback)
				this.createCallback(self);
			
			return self;
		};
		
		this.move = function(o, direction)
		{
			var tempObject = JSON.parse(JSON.stringify(o));
			if(direction == 'left')
				tempObject.property.position.x -= o.stat.moveSpeed;
			else if(direction == 'right')
				tempObject.property.position.x += o.stat.moveSpeed;
			else if(direction == 'up')
				tempObject.property.position.y -= o.stat.moveSpeed;
			else if(direction == 'down')
				tempObject.property.position.y += o.stat.moveSpeed;
			
			return tempObject;
		};
		
	}).call(object);
	
	return object;
})();
