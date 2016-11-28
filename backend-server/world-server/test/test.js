var assert = require('assert');
var io = require('socket.io-client');
var config = require('../../../config');

var random = require("random-js")();

//월드를 구성하는 일반적인 역할을 맡는다.
var world = require('../modules/world');

//어떤 데이터를, 어디서 불러오고 그런거..를 메인 모듈이 결정하는데
var main = require('../modules/main');

describe('Scenario test', function()
{
	var mapMetadataList = [];
	
	describe('Load maps', function()
	{
		it('Load map data', function(done)
		{
			//미리 정의된 영구적인 맵 메타 데이터 목록 불러오기.
			world.loadMaps(['test'], function(list)
			{
				mapMetadataList = list;
				assert(typeof list == 'Array');
				done();
			});
		});
		
		it('Create permanent map', function()
		{
			//미리 정의된 영구적인 맵 목록을 얻어와서 맵 인스턴스 생성.
			//맵 인스턴스에는 모든 오브젝트의 목록이 들어있고
			//충돌체크를 위한 존이 나뉘어져 있으며.
			//그 안에 해당 존에 위치하는 오브젝트가 들어있다.
			
			for(var i=0; i<mapMetadataList.length; i++)
			{
				//메타데이터를 이용해서 맵 객체를 생성.
				var map = world.createMap(mapMetadataList[i]);
				assert.equal(map.id, 'test');
				assert.equal(map.name, 'test');
				assert.equal(typeof map.size == 'object');
				assert(map.size.hasOwnProperty('width'));
				assert(map.size.hasOwnProperty('height'));
				
				//메타데이터이고 객체화 시켜서 아래 메모리공간에 저장한 후 삭제함.
				assert(typeof map.metaObjectList == 'Array');
				
				//이건 추후 저장용 메모리공간
				assert(typeof map.objects == 'Array');
				assert(typeof map.zone == 'Array');
			}
		});
		
		it('Create objects of each maps.', function()
		{
			//각 맵에 필요한 오브젝트를 생성 후 배치.
			
			for(var key in mapInstance)
			{
				var map = mapInstance[key];
				
				var metaObjectList = map.metaObjectList;
				for(var i=0; i<metaObjectList.length; i++)
				{
					//메타 오브젝트 정보에 오브젝트의 대부분의 정보가 담겨있다. 디폴트 값도 있겠지.
					//여기에서 존도 설정이 된다.
					var object = world.createObject(metaObjectList[i]);
					assert(object.id);
					assert(object.property);
					assert(object.location);
					assert(object.stat);
				}
			}
		});
		
		it('Check object zone', function()
		{
			//존을 나누는 사이즈
			var zw = world.property.zoneWidth;
			var zh = world.property.zoneHeight;
			
			for(var key in mapInstance)
			{
				var map = mapInstance[key];
				
				var objectList = map.objectList;
				for(var i=0; i<objectList.length; i++)
				{
					var object = objectList[i];
					
					var x = Math.floor(object.location.position.x / zw);
					var y = Math.floor(object.location.position.y / zh);
					
					var zone = world.maps[object.location.mapId].zone[x + '-' + y];
					
					assert(typeof zone == 'Array');
					
					var check = false;
					for(var j=0; j<zone.length; j++)
					{
						if(zone[j].id == object.id)
						{
							check = true;
						}
					}
					
					assert(check);
				}
			}
		});
	});
	
	it('Move objects', function()
	{
	});
	
	it('User, create character.', function()
	{
	});
	
	it('User, connect to server by selected character', function()
	{
	});
	
	it('Set initial position of user character', function()
	{
	});
	
	it('Move user character', function()
	{
	});
});