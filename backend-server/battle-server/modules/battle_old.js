var map = require('./map');
var skill = require('./skill');

var battleData = {};
(function()
{
	var prototypeRoomId = "room";
	var rooms = {};
	
	this.createControlId = function()
	{
		return new Date().getTime();
	};
	
	this.joinRoom = function(character)
	{
		character.type = 'user';
		
		if(rooms[prototypeRoomId])
		{
			var controlId = this.createControlId();
			rooms[prototypeRoomId].users[controlId] = character;
			rooms[prototypeRoomId].users[character.name] = controlId;
			return prototypeRoomId;
		}
		else
		{
			var controlId = this.createControlId();
			var data = {};
			data[controlId] = character;
			data[character.name] = controlId;
			rooms[prototypeRoomId] = {users : data, map : map.createMap()};
			
			
			return prototypeRoomId;
		}
	};
	
	this.clearRoom = function()
	{
		rooms = {};
	};
	
	this.checkUserInTheRoom = function(roomId, characterName)
	{
		return rooms[roomId] != null && rooms[roomId].users[characterName] != null;
	};
	
	this.getMapData = function(roomId)
	{
		if(rooms[roomId])
			return rooms[roomId].map;
		else
			return null;
	};
	
	this.getControlId = function(roomId, characterName)
	{
		if(rooms[roomId])
			return rooms[roomId].users[characterName];
		else
			return null;
	};
	
	this.setInitPositionOfCharacter = function(roomId, controlId)
	{
		if(!rooms[roomId])
			return null;
		
		var character = rooms[roomId].users[controlId];
		if(!character)
			return null;
		
		if(character.position)
			return false;
		
		var map = rooms[roomId].map;
		for(var i=0; i<map.length; i++)
		{
			for(var j=0; j<map[i].length; j++)
			{
				if(!map[i][j])
				{
					map[i][j] = character;
					return character.position = {y : j, x : i};
				}
			}
		}
		
		return null;
	};
	
	this.getCharacterPosition = function(roomId, controlId)
	{
		if(!rooms[roomId])
			return null;
		
		var character = rooms[roomId].users[controlId];
		if(!character)
			return null;
		
		return character.position;
	};
	
	this.createCharacter = function(roomId, character)
	{
		if(!rooms[roomId])
			return null;
		
		if(rooms[roomId].map)
		{
			rooms[roomId].map[character.position.y][character.position.x] = character;
			return true;
		}
		else
		{
			return false;
		}
	};
	
	this.moveCharacter = function(roomId, controlId, direction)
	{
		if(!rooms[roomId])
			return null;
		
		var character = rooms[roomId].users[controlId];
		if(!character)
			return null;
		
		var originPosition = JSON.parse(JSON.stringify(character.position));
		
		switch(direction)
		{
			case 'n' :
				character.position.y -= new Number(character.moveSpeed);
				break;
			case 'e' :
				character.position.x += new Number(character.moveSpeed);
				break;
			case 's' :
				character.position.y += new Number(character.moveSpeed);
				break;
			case 'w' :
				character.position.x -= new Number(character.moveSpeed);
				break;
		};
		
		//이동가능한지 체크
		if(character.position.y >= 0 && character.position.x >= 0 && character.position.y < rooms[roomId].map.length && character.position.x < rooms[roomId].map[0].length)
		{
			var target = rooms[roomId].map[character.position.y][character.position.x];
			if(!target || target.type == 'user')
			{
				rooms[roomId].map[character.position.y][character.position.x] = character;
				rooms[roomId].map[originPosition.y][originPosition.x] = 0;
				return character.position;
			}
			else
			{
				character.position = originPosition;
				return false;
			}
		}
		else
		{
			character.position = originPosition;
			return false;
		}
	};
	
	this.moveCharacterForce = function(roomId, targetPosition, position)
	{
		if(!rooms[roomId])
			return null;
		
		var character = rooms[roomId].map[targetPosition.y][targetPosition.x];
		if(!character)
			return null;

		var dest = rooms[roomId].map[position.y][position.x];
		if(dest)
		{
			return false;
		}
		else
		{
			rooms[roomId].map[position.y][position.x] = character;
			character.position = position;
			
			rooms[roomId].map[targetPosition.y][targetPosition.x] = 0;
			
			return true;
		}
	};
	
	this.castSkill = function(roomId, controlId, target, skillId, callback)
	{
		if(!rooms[roomId])
			callback(null);
		
		var caster = rooms[roomId].users[controlId];
		if(!caster)
			callback(null);

		var s = skill[skillId];
		setTimeout(function()
		{
			var result = s.callback(caster, rooms[roomId].map[target.position.y][target.position.x]);
			callback(result);
		}, s.castTime);
	};
}).call(battleData);

module.exports = battleData;