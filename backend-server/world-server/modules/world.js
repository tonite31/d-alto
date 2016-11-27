var object = require('./object');
var character = require('./character');
var random = require("random-js")();

module.exports = (function()
{
	var world = {};
	
	var testMapId = 'test';
	var testObjectCount = 10;
	var testNpcCount = 10;
	var testDirections = ['left', 'right', 'up', 'down'];
	
	var maps = {}; // 영구적으로 살아있는 월드
	var instantMaps = {};
	var users = {}; // 전체 유저
	
	(function()
	{
		this.createCharacter = function()
		{
			try
			{
				var c = character.create();
				users[c.id] = c;
				
				do
				{
					//캐릭터의 위치를 임의로 설정한다.
					c.position.x = random.integer(0, 100);
					c.position.y = random.integer(0, 100);
					c.prevPosition.x = c.position.x;
					c.prevPosition.y = c.position.y;
				}while(!this.checkObjectMovableInMap(maps[testMapId], c));
				
				//캐릭터의 최초 위치를 맵에 등록.
				maps[testMapId].objects.push(c);
				
				return c;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.getCharacter = function(id)
		{
			try
			{
				return users[id];
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.getMap = function()
		{
			try
			{
			//일단 고정된 테스트용 맵.
				return maps[testMapId];
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.valueInRange = function(value, min, max)
		{
			return (value >= min) && (value <= max);
		};
		
		//이동할때 충돌하는지 체크한다.
		//target의 포지션은 이미 이동된 포지션으로 나온것이다.
		//그러므로 충돌되는게 하나도 없어야 이동이 가능하다.
		this.moveCollisionCheck = function(src, dest)
		{
			try
			{
				var xOverlap = this.valueInRange(src.position.x, dest.position.x, dest.position.x + dest.collisionSize.width) || this.valueInRange(dest.position.x, src.position.x, src.position.x + src.collisionSize.width);
				var yOverlap = this.valueInRange(src.position.y, dest.position.y, dest.position.y + dest.collisionSize.height) || this.valueInRange(dest.position.y, src.position.y, src.position.y + src.collisionSize.height);
				
				return xOverlap && yOverlap;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.checkObjectMovableInMap = function(map, target)
		{
			try
			{
				//가장먼저 맵 밖으로 벗어나는지를 체크 해야한다.
				if(target.position.x < 0 || target.position.x + target.collisionSize.width > map.size.width || target.position.y < 0 || target.position.y + target.collisionSize.height > map.size.height)
					return false;
				
				var mo = map.objects;
				for(var i=0; i<mo.length; i++)
				{
					if(target.id != mo[i].id && this.moveCollisionCheck(target, mo[i]))
					{
						return false;
					}
				}
				
				return true;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
	}).call(world);
	
	//테스트 모듈이다.
	//테스트용 맵을 만들고 테스트용 오브젝트 등을 만든다.
	(function()
	{
		//맵 데이터를 db or file에서 불러와서 생성한다.
		//뭔가 불러왔다고 치고.
		
		var id = testMapId;
		maps[id] = {
			id : id,
			name : 'test맵',
			size : {width : 2000, height : 1000},
			position: {x : 0, y : 0},
			objects : []
		};
		
		var checkCollision = function(target)
		{
			if(target.position.x < 0 || target.position.x + target.collisionSize.width > maps[id].size.width || target.position.y < 0 || target.position.y + target.collisionSize.height > maps[id].size.height)
				return true;
			
			for(var j=0; j<maps[id].objects.length; j++)
			{
				if(target.id != maps[id].objects[j].id && world.moveCollisionCheck(target, maps[id].objects[j]))
				{
					return true;
				}
			}
			
			return false;
		};
		
		for(var i=0; i<testObjectCount; i++)
		{
			var o = object.createObject({x : maps[id].size.width, y : maps[id].size.height});
			if(checkCollision(o))
			{
				i--;
				continue;
			}

			maps[id].objects.push(o);
		}
		
		for(var i=0; i<testNpcCount; i++)
		{
			var npc = character.createNpc({x : maps[id].size.width, y : maps[id].size.height});
			if(checkCollision(npc))
			{
				i--;
				continue;
			}
			
			maps[id].objects.push(npc);
		}
		
		setInterval(function()
		{
			//1초에 한 번씩 이동한다.
			var mo = maps[id].objects;
			for(var i=0; i<mo.length; i++)
			{
				if(mo[i].id.indexOf('npc-') != -1)
				{
					character.move(world, mo[i], testDirections[random.integer(0, 3)])
				}
			}
		}, 1000);
	})();
	
	return world;
})();