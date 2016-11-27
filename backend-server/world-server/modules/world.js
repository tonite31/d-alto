var object = require('./object');
//var character = require('./character');
var random = require("random-js")();

module.exports = (function()
{
	var world = {};
	
	var testMapId = 'test';
	var testObjectCount = 10;
	var testNpcCount = 10;
	var testDirections = ['left', 'right', 'up', 'down'];
	var testNpcImages = ['character/cha_pri_f.gif', 'character/cha_wiz_m.gif', 'character/face00.gif', 'character/face05.gif'];
	var npcSpeed = {min : 10, max : 50};
	
	var maps = {}; // 영구적으로 살아있는 맵.
	var instantMaps = {}; //인스턴트 맵.
	var users = {}; // 이 서버에 접속중인 전체 유저.
	
	(function()
	{
		//테스트용 함수?
		this.createCharacter = function()
		{
			try
			{
				var c = object.create();
				users[c.id] = c;
				
				var props = c.property;
				
				do
				{
					//최초 캐릭터의 위치를 임의로 설정한다.
					props.position.x = random.integer(0, 100);
					props.position.y = random.integer(0, 100);
					props.prevPosition.x = props.position.x;
					props.prevPosition.y = props.position.y;
					
					props.image = '/character/cha_ass_m.gif';
					
					props.movable = true;
					props.interactive = true;
					props.collision = true;
					
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
				var props = target.property;
				//가장먼저 맵 밖으로 벗어나는지를 체크 해야한다.
				if(props.position.x < 0 || props.position.x + props.collisionSize.width > map.size.width || props.position.y < 0 || props.position.y + props.collisionSize.height > map.size.height)
					return false;
				
				var objects = map.objects;
				for(var i=0; i<objects.length; i++)
				{
					//대상 오브젝트를 제외하고 나머지 오브젝트들과 충돌체크를 해서 이동이 가능한지. 알아본다.
					if(target.id != objects[i].id && this.moveCollisionCheck(props, objects[i].property))
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
		
		for(var i=0; i<testObjectCount + testNpcCount; i++)
		{
			var o = object.create();
			var props = o.property;
			props.prevPosition = props.position = {x : random.integer(0, maps[id].size.width), y : random.integer(0, maps[id].size.height)};
			
			if(i < testNpcCount)
			{
				props.image = '/object/object1.png';
				props.movable = false;
				props.interactive = false;
				props.collision = true;
				
				o.id = 'object-' + o.id;
			}
			else
			{
				props.image = testNpcImages[random.integer(0, 3)];
				props.movable = true;
				props.interactive = true;
				props.collision = true;
				props.moveSpeed = random.integer(npcSpeed.min, npcSpeed.max);
				
				o.id = 'npc-' + o.id;
			}

			//새로 만들지 말고 포지션만 랜덤으로 다시 찍어서 가자.
			if(!world.checkObjectMovableInMap(maps[id], o))
			{
				i--;
				continue;
			}

			maps[id].objects.push(o);
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