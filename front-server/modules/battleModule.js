var request = require('request');
var config = require('../../config');
var ioClient = require('socket.io-client');

const BATTLE_SERVER_HOST = 'http://' + config.server['battle-server'].host + ':' + config.server['battle-server'].port;

module.exports.getMapData = function(req, res, next)
{
	var callback = arguments[3];
	
	var options = {};
	options.url = BATTLE_SERVER_HOST + '/dungeons/' + req.body.dungeonId + '/map';
	options.method = 'GET';
	
	request(options, function(error, response, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(response.statusCode).send(data ? data : null);
			
			if(callback)
				callback();
		}
	});
};

module.exports.connection = (function()
{
	var callbacksForTest = {};
	var modules = {};
	modules.CONNECTION = function()
	{
	};
	
	modules.RECEIVE_NEW_CONNECTION = function(res)
	{
		
	};
	
	modules.CREATE_DUNGEON_INSTANCE = function(client, battleServer, res)
	{
		if(callbacksForTest.CREATE_DUNGEON_INSTANCE)
			callbacksForTest.CREATE_DUNGEON_INSTANCE(res);
		
		if(res.data.dungeonId)
		{
			//여기서 client는 front와 연결된 client인가? 그런듯
		}
		else
		{
			if(client)
			{
				//에러를 사용자에게 알려줘야 함.
			}
		}
	};
	
	modules.JOIN_DUNGEON_INSTANCE = function(client, battleServer, res)
	{
		if(callbacksForTest.JOIN_DUNGEON_INSTANCE)
			callbacksForTest.JOIN_DUNGEON_INSTANCE(res);
		
		if(res.data.controlId && res.data.mapData)
		{
			
		}
		else
		{
			if(client)
			{
				//에러를 사용자에게 알려줘야 함.
			}
		}
	};
	
	modules.MOVE_CHARACTER = function(client, battleServer, res)
	{
		if(callbacksForTest.MOVE_CHARACTER)
			callbacksForTest.MOVE_CHARACTER(res);
		
		if(res.data.characterId && res.data.position)
		{
			
		}
		else
		{
			if(client)
			{
				
			}
		}
	};
	
	function BattleConnection(client)
	{
		this.client = client;
		this.battleServer = null;
		this.initialize();
	};

	BattleConnection.prototype.initialize = function()
	{
		var that = this;
		this.battleServer = ioClient(BATTLE_SERVER_HOST);
		for(var key in modules)
		{
			(function(key)
			{
				that.battleServer.on(key, function(res)
				{
					modules[key](that.client, that.battleServer, res);
				});
			})(key);
		}
	};
	
	BattleConnection.prototype.disconnect = function()
	{
		this.battleServer.disconnect();
	};
	
	BattleConnection.prototype.createDungeonInstance = function(mapNumber, callback)
	{
		if(callback)
			callbacksForTest.CREATE_DUNGEON_INSTANCE = callback;
		
		this.battleServer.emit('CREATE_DUNGEON_INSTANCE', {mapNumber : mapNumber});
	};
	
	BattleConnection.prototype.joinDungeonInstance = function(dungeonId, character, callback)
	{
		if(callback)
			callbacksForTest.JOIN_DUNGEON_INSTANCE = callback;
		
		this.battleServer.emit('JOIN_DUNGEON_INSTANCE', {dungeonId : dungeonId, character : character});
	};
	
	BattleConnection.prototype.moveCharacter = function(dungeonId, controlId, direction, callback)
	{
		if(callback)
			callbacksForTest.MOVE_CHARACTER = callback;
		
		this.battleServer.emit('MOVE_CHARACTER', {dungeonId : dungeonId, controlId : controlId, direction : direction});
	};
	
	return BattleConnection;
})();