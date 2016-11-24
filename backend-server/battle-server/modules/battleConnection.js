var io = require('socket.io');

var battleManager = require('./battleManager');

var _connectionManager = {};
(function()
{
	var modules = {};
	modules.CREATE_DUNGEON_INSTANCE = function(response, data)
	{
		var dungeonId = battleManager.createDungeonInstance();
		this.client.join(dungeonId);
		this.currentDungeonId = dungeonId;
		
		response({statusCode : 201, data : {dungeonId : dungeonId}});
	};
	
	modules.JOIN_DUNGEON_INSTANCE = function(response, data)
	{
		//아무나 접속할 수 없게 처리해야한다.
		//나중에는 파티단위로 들어갈거기 때문에. 일단은 아무나로.
		console.log("데이터 ; ", data);
		var dungeonId = data.dungeonId;
		var controlId = battleManager.joinDungeonInstance(dungeonId);
		if(controlId)
		{
			response({statusCode : 200, data : {controlId : controlId}});
		}
		else
		{
			response({statusCode : 404});
		}
	};
	
//	modules.MOVE_CHARACTER = function(res, data)
//	{
//		var controlId = data.controlId;
//		var characterId = data.characterId;
//		var direction = data.direction;
//		
//		res({statusCode : 200, characterId : characterId, x : 0, y : 0});
//	};
	
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