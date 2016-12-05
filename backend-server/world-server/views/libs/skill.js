var _Skill = {};

(function()
{
	this.attack = function(src, dest)
	{
		//공격 사거리 체크.
		//공격 쿨타임 체크.
		if(src.lastAttackTime)
		{
			var now = new Date().getTime();
			var diff = (now - src.lastAttackTime) / 1000 / 60 / 60;
			if(src.stat.attackSpeed > diff)
			{
				//마지막 공격 시간으로부터 1초가 지나야하므로. 그 전에는 공격 못함.
				//같은 로직이 서버에도 있음.
				return false;
			}
		}
		
		//공격
//		server_socket.emit('ATTACK', dest.id);
		src.lastAttackTime = new Date().getTime();
		
		//src의 공격 모션을 수행함.
		
		return true;
	};
	
}).call(_Skill);