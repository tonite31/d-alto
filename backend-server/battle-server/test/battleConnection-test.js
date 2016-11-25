var assert = require('assert');
var httpMocks = require('node-mocks-http');
var request = require('request');
var io = require('socket.io-client');

var battleManager = require('../modules/battleManager');

var config = require('../../../config');

describe('Battle connection test', function()
{
	var conn = null;
	var dungeonId = null;
	var controlId = null;
	
	before(function(done)
	{
		conn = io('http://localhost:' + config.server['battle-server'].port);
		if(conn != null)
		{
			conn.on('CONNECTION', function(code)
			{
				done();
			});
		}
		else
		{
			done();
		}
	});
	
	after(function()
	{
		if(conn)
		{
			conn.disconnect();
		}
	});
	
	it('createDungeonInstance', function(done)
	{
		request({url : 'http://localhost:9004/dungeons/instance', method : 'post', form : {mapNumber : 0}}, function(error, response, data)
		{
			if(error)
			{
				console.log(error);
			}
			else
			{
				assert(data);
				dungeonId = data;
				done();
			}
		});
	});
	
	it('joinDungeonInstance', function(done)
	{
		if(conn)
		{
			conn.on('JOIN_DUNGEON_INSTANCE', function(res)
			{
				assert(!res.message);
				assert.equal(res.statusCode, 200);
				assert(res.data.controlId);
				assert(res.data.mapData.map instanceof Array);
				
				controlId = res.data.controlId;
				
				done();
			});
			
			conn.emit('JOIN_DUNGEON_INSTANCE', {dungeonId : dungeonId, character : {_id : 'tester', moveSpeed : 1}});
		}
		else
		{
			done();
		}
	});
	
	it('moveCharacter', function(done)
	{
		if(conn)
		{
			conn.on('MOVE_CHARACTER', function(res)
			{
				assert.equal(res.statusCode, 200);
				assert.equal(res.data.characterId, 'tester');
				assert(typeof res.data.position == 'object');
				assert(typeof res.data.position.x == 'number');
				assert(typeof res.data.position.y == 'number');
				
				done();
			});
			
			conn.emit('MOVE_CHARACTER', {dungeonId : dungeonId, controlId : controlId, direction : 'e'});
		}
		else
		{
			done();
		}
	});
});