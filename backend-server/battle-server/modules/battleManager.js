var mapManager = require('./mapManager');

var battleManager = {};

(function()
{
	var dungeonIndex = 0;
	var dungeonList = {};
	
	this.createDungeonInstance = function(mapNumber)
	{
		dungeonIndex++;
		
		mapManager.createMap(mapNumber, function(mapData)
		{
			var dungeon = {users : {}, usersCount : 0, mapData : mapData};
			dungeonList[dungeonIndex] = dungeon;
			
			console.log('createDungeonInstance : ', dungeonIndex);
		});
		
		return dungeonIndex;
	};
	
	this.joinDungeonInstance = function(dungeonId, character)
	{
		if(!dungeonList.hasOwnProperty(dungeonId))
			return 'dungeon_not_found';
		
		//맵에서 초기 위치를 받아와서 세팅, 초기위치는 랜덤으로 해줌.
		character.position = dungeonList[dungeonId].mapData.initialPosition[0];
		dungeonList[dungeonId].mapData.map[character.position.y][character.position.x] = character;
		character.type = 'user';
		
		var controlId = new Date().getTime();
		dungeonList[dungeonId].users = {};
		dungeonList[dungeonId].users[controlId] = character;
		dungeonList[dungeonId].usersCount++;
		
		return controlId;
	};
	
	this.disconnectClient = function(dungeonId)
	{
		if(!dungeonList.hasOwnProperty(dungeonId))
			return 'dungeon_not_found';
		
		dungeonList[dungeonId].usersCount--;
		if(dungeonList[dungeonId].usersCount <= 0)
		{
			this.destroyDungeonInstance(dungeonId);
		}
	}
	
	this.destroyDungeonInstance = function(dungeonId)
	{
		console.log('destroyDungeonInstance : ', dungeonId);
		delete dungeonList[dungeonId];
	};
	
	this.getMapData = function(dungeonId)
	{
		if(!dungeonList.hasOwnProperty(dungeonId))
			return 'dungeon_not_found';
		
		return dungeonList[dungeonId].mapData;
	};
	
	this.moveCharacter = function(dungeonId, controlId, direction)
	{
		if(!dungeonList.hasOwnProperty(dungeonId))
			return 'dungeon_not_found';
		
		var character = dungeonList[dungeonId].users[controlId];
		if(!character)
			return 'character_not_found';
		
		//이동불가상태
		if(character.state)
		{
			return 'not_movable_state';
		}
		
		var originPosition = JSON.parse(JSON.stringify(character.position));
		if(direction == 'e')
			character.position.x += character.moveSpeed;
		else if(direction == 'w')
			character.position.x -= character.moveSpeed;
		else if(direction == 's')
			character.position.y += character.moveSpeed;
		else if(direction == 'n')
			character.position.y -= character.moveSpeed;
		
		var map = dungeonList[dungeonId].mapData.map;
		
		if(character.position.y >= 0 && character.position.x >= 0 && character.position.y < map.length && character.position.x < map[0].length)
		{
			var target = map[character.position.y][character.position.x];
			if(!target)
			{
				map[character.position.y][character.position.x] = character;
				map[originPosition.y][originPosition.x] = 0;
				return {characterId : character._id, position : character.position};
			}
			else
			{
				character.position = originPosition;
				return 'blocked';
			}
		}
		else
		{
			return 'not_movable_position';
		}
	};
	
}).call(battleManager);

module.exports = battleManager;