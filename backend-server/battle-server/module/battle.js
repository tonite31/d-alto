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
	
	this.moveCharacter = function(roomId, controlId, position)
	{
		if(!rooms[roomId])
			return null;
		
		var character = rooms[roomId].users[controlId];
		if(!character)
			return null;
		
		character.position = position;
		rooms[roomId].map[position.y][position.x] = character;
		
		return true;
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