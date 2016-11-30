var uuid = require('uuid');

var random = require('random-js')();
var promise = require('bluebird');

var Object = require('../schema/objectSchema');
var Map = require('../schema/mapSchema');

var collision = require('./collision');

module.exports = (function()
{
	var world = {};
	
	var maps = {}; // 영구적으로 살아있는 맵.
	var instantMaps = {}; //인스턴트 맵.
	var users = {}; // 이 서버에 접속중인 전체 유저.
	
	(function()
	{
		this.createMaps = function(callback)
		{
			try
			{
				//뭔가로부터 불러온다. 디비나 파일로 할건데
				//일단 테스트 코드.
				var map = new Map({
					name : 'test',
					size : {
						width: 1000,
						height: 1000
					},
					zoneSize : {
						width: 500,
						height: 500
					},
					mapObjectList : [{data : ''}]
				});
				
				map = map.toJSON();
				
				//메모리로 가지고 있어야 하는 값들.
				map.objects = [];
				map.zone = {};
				
				var objects = this.createObjects(map);
				map.objects = objects;
				
				//필요 없으므로
				delete map.mapObjectList;
				
				maps[map.name] = map;
				
				callback();
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.createObjects = function(map)
		{
			try
			{
				var testObjectCount = 10;
				var testNpcCount = 10;
				var testNpcImages = ['character/cha_pri_f.gif', 'character/cha_wiz_m.gif', 'character/face00.gif', 'character/face05.gif'];
				var npcSpeed = {min : 10, max : 50};
				
				var result = [];
				for(var i=0; i<testObjectCount + testNpcCount; i++)
				{
					var object = new Object({
						name : 'stone'
					});
					
					object = object.toJSON();
					object.property = {};
					object.location = {};
					object.stat = {};
					
					var location = object.location;
					location.prevPosition = location.position = {x : random.integer(0, map.size.width), y : random.integer(0, map.size.height)};
					
					var props = object.property;
					
					if(i < testObjectCount)
					{
						props.image = '/object/object1.png';
						props.movable = false;
						props.interactive = false;
						props.collision = true;
						
						props.size = {width: 114, height: 104};
						props.collisionSize = {width: 114, height: 50};
					}
					else
					{
						props.image = testNpcImages[random.integer(0, 3)];
						props.movable = true;
						props.interactive = true;
						props.collision = true;
						
						props.size = {width: 50, height: 100};
						props.collisionSize = {width: 50, height: 30};
						
						object.stat.moveSpeed = random.integer(npcSpeed.min, npcSpeed.max);
					}
					
					this.setObjectZone(map, object);
					
					//새로 만들지 말고 포지션만 랜덤으로 다시 찍어서 가자.
					while(!collision.checkObjectMovable(map, object))
					{
						location.prevPosition = location.position = {x : random.integer(0, map.size.width), y : random.integer(0, map.size.height)};
						this.setObjectZone(map, object);
					}
					
					result.push(object);
				}
				
				return result;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.setObjectZone = function(map, object)
		{
			try
			{
				var zw = map.zoneSize.width;
				var zh = map.zoneSize.height;
				
				var x = Math.floor(object.location.position.x / zw);
				var y = Math.floor(object.location.position.y / zh);
				var right = Math.floor((object.location.position.x + object.property.collisionSize.width) / zw);
				var bottom = Math.floor((object.location.position.y + object.property.collisionSize.height) / zh);
				
				//만약 기존 zoneId가 있으면
				if(object.location.zoneId != null)
				{
					//해당 존에서 오브젝트를 삭제.
					for(var k=0; k<object.location.zoneId.length; k++)
					{
						delete map.zone[object.location.zoneId[k]][object._id];
					}
				}
				
				var zoneId = [];
				for(var i=x; i<=right; i++)
				{
					for(var j=y; j<=bottom; j++)
					{
						//새로운 오브젝트의 존을 구해서.
						var newZoneId = i + '-' + j;
						
						//등록된게 없으면 객체를 초기화 해주고
						if(!map.zone.hasOwnProperty(newZoneId))
							map.zone[newZoneId] = {};
						
						//해당 존에 object를 넣는다.
						map.zone[newZoneId][object._id] = object;
						
						//새로운 zoneId List를 만든다.
						zoneId.push(newZoneId);
					}
				}
				
				//새로운 존으로 변경.
				object.location.zoneId = zoneId;
				
				delete x;
				delete y;
				delete right;
				delete bottom;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.createUserCharacter = function(id)
		{
			try
			{
				//아이디를 주면 데이터 서버로부터 캐릭터 데이터를 가져와서 객체로 만든다.
				//그런데 일단 테스트 코드.
				var object = new Object({
					name : 'User_character'
				});
				
				object = object.toJSON();
				object.property = {};
				object.location = {mapName : 'test', position: {}, prevPosition: {}};
				object.stat = {};
				
				var props = object.property;

				props.image = '/character/cha_ass_m.gif';
				props.size = {width: 50, height: 100};
				props.collisionSize = {width: 50, height: 30};
				
				props.movable = true;
				props.interactive = true;
				props.collision = true;
				
				object.stat.moveSpeed = 5;
				
				var location = object.location;
				
				do
				{
					//최초 캐릭터의 위치를 임의로 설정한다.
					location.position.x = random.integer(0, 100);
					location.position.y = random.integer(0, 100);
					location.prevPosition.x = location.position.x;
					location.prevPosition.y = location.position.y;
					
					this.setObjectZone(maps[object.location.mapName], object);
					
				}while(!collision.checkObjectMovable(maps[object.location.mapName], object));
				
				maps[object.location.mapName].objects.push(object);
				
				users[object._id] = object;
				
				return object;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.getUserCharacter = function(id)
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
		
		this.getMap = function(mapName)
		{
			try
			{
				//일단 고정된 테스트용 맵.
				return maps[mapName];
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};

		this.moveObject = function(target, direction)
		{
			var tempObject = JSON.parse(JSON.stringify(target));
			if(direction == 'left')
				tempObject.location.position.x -= target.stat.moveSpeed;
			else if(direction == 'right')
				tempObject.location.position.x += target.stat.moveSpeed;
			else if(direction == 'up')
				tempObject.location.position.y -= target.stat.moveSpeed;
			else if(direction == 'down')
				tempObject.location.position.y += target.stat.moveSpeed;
			
			if(collision.checkObjectMovable(maps[target.location.mapName], tempObject))
			{
				//그리고 실제 포지션 값 업뎃
				target.location.prevPosition = target.location.position;
				target.location.position = tempObject.location.position;
			}
			
			delete tempObject;
			
			this.setObjectZone(maps[target.location.mapName], target);
		};
		
		this.deleteObject = function(id)
		{
			//메모리에서 오브젝트를 삭제.
			delete users[id];
			for(var key in maps)
			{
				var objects = maps[key].objects;
				for(var i=0; i<objects.length; i++)
				{
					if(objects[i]._id == id)
					{
						delete objects.splice(i, 1);
						break;
					}
				}
				
				for(var zoneId in maps[key].zone)
				{
					delete maps[key].zone[zoneId][id];
				}
			}
		};
		
	}).call(world);
	
	return world;
})();