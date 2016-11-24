var io = require('socket.io');

var battleManager = require('./battleManager');

var _connectionManager = {};
(function()
{
	var modules = {};
	modules.CREATE_DUNGEON_INSTANCE = function(response, data)
	{
		if(data.mapNumber == null)
		{
			response({statusCode : 404, message : 'mapNumber_not_found'});
			return;
		}
		
		var dungeonId = battleManager.createDungeonInstance(data.mapNumber);
		this.client.join(dungeonId);
		this.currentDungeonId = dungeonId;
		
		response({statusCode : 201, data : {dungeonId : dungeonId}});
	};
	
	modules.JOIN_DUNGEON_INSTANCE = function(response, data)
	{
		//아무나 접속할 수 없게 처리해야한다.
		//나중에는 파티단위로 들어갈거기 때문에. 일단은 아무나로.
		
		if(data.dungeonId == null)
		{
			response({statusCode : 404, message : 'dungeon_id_not_found'});
			return;
		}
		else if(data.character == null)
		{
			response({statusCode : 404, message : 'character_not_found'});
			return;
		}
		
		var dungeonId = data.dungeonId;
		var controlId = battleManager.joinDungeonInstance(dungeonId, data.character);
		if(controlId)
		{
			response({statusCode : 200, data : {controlId : controlId, mapData : battleManager.getMapData(dungeonId)}});
		}
		else
		{
			response({statusCode : 404});
		}
	};
	
	modules.MOVE_CHARACTER = function(response, data)
	{
		for(var key in data)
		{
			if(data[key] == null)
			{
				response({statusCode : 404, message : key + '_not_found'});
				return;
			}
		}
		
		var dungeonId = data.dungeonId;
		var controlId = data.controlId;
		var direction = data.direction;
		
		if(dungeonId == null)
		{
			response({statusCode : 404, message : 'dungeonId_not_found'});
			return;
		}
		else if(controlId == null)
		{
			response({statusCode : 404, message : 'controlId_not_found'});
			return;
		}
		else if(direction == null)
		{
			response({statusCode : 404, message : 'direction_not_found'});
			return;
		}
		
		var result = battleManager.moveCharacter(dungeonId, controlId, direction);
		response({statusCode : 200, data : result});
	};
	
	function Client(connection, client)
	{
		this.connection = connection;
		this.client = client;
		
		this.init();
	};
	
	Client.prototype.init = function()
	{
		var that = this;
		this.client.emit('CONNECTION', {statusCode : 200});
		this.client.on('disconnect', function()
		{
			if(that.currentDungeonId != null)
			{
				battleManager.disconnectClient(that.currentDungeonId);
			}
			
			console.log('disconnect');
		});
		
		for(var key in modules)
		{
			(function(key)
			{
				that.client.on(key, function(data)
				{
					modules[key].call(that, function(data)
					{
						that.client.emit(key, data);
					}, data);
				});
			})(key);
		}
	};
	
	this.connection = null;
	this.initialize = function(server)
	{
		var that = this;
		this.connection = io.listen(server);
		this.connection.on('connection', function(client)
		{
			new Client(that.connection, client, that.modules);
		});
	};
	
}).call(_connectionManager);

module.exports = _connectionManager;