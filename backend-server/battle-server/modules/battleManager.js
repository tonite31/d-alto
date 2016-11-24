var battleManager = {};

(function()
{
	var dungeonIndex = -1;
	var dungeonList = {};
	
	this.createDungeonInstance = function()
	{
		dungeonIndex++;
		
		var dungeon = {users : {}};
		dungeonList[dungeonIndex] = dungeon;
		
		console.log('createDungeonInstance : ', dungeonIndex);
		
		return dungeonIndex++;
	};
	
	this.joinDungeonInstance = function(dungeonId, character)
	{
		if(!dungeonList.hasOwnProperty(dungeonId))
			return null;
		
		var controlId = new Date().getTime();
		dungeonList[dungeonId].users = {controlId : character};
		dungeonList[dungeonId].usersCount++;
		
		return controlId;
	};
	
	this.disconnectClient = function(dungeonId)
	{
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
	
}).call(battleManager);

module.exports = battleManager;