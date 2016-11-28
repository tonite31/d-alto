var uuid = require('uuid');
var random = require("random-js")();

module.exports = (function()
{
	function Object()
	{
		this.id = uuid.v4();
		
		//시스템 로직을 위해 필요한 값들.
		this.property = {
			collision : true, //충돌 체크 할것인지.
			interactive : false, //사용자와 상호작용 할것인지.
			movable : false, //이동 가능한 녀석인지.
			size : {width: 0, height: 0}, //오브젝트의 실제 크기
			collisionSize : {width: 0, height: 0}, //충돌체크할때 쓸 사이즈
			image : '' //이미지 주소
		};
		
		this.location = {
			position : {x : 0, y : 0}, //오브젝트의 위치
			prevPosition : {x : 0, y : 0}, //오브젝트의 이전 위치
			mapId //현재 이 오브젝트가 어떤 맵에 있는지.
		};
		
		this.stat = {
			moveSpeed : 1
		};
	};
	
	return Object;
})();
