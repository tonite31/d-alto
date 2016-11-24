var assert = require('assert');

var io = require('socket.io-client');

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
		if(conn)
		{
			conn.on('CREATE_DUNGEON_INSTANCE', function(res)
			{
				assert.equal(res.statusCode, 201);
				assert(typeof res.data.dungeonId == 'number');
				
				dungeonId = res.data.dungeonId;
				
				done();
			});
			
			conn.emit('CREATE_DUNGEON_INSTANCE', {mapNumber : 0});
		}
		else
		{
			done();
		}
	});
	
	it('joinDungeonInstance', function(done)
	{
		if(conn)
		{
			conn.on('JOIN_DUNGEON_INSTANCE', function(res)
			{
				assert.equal(res.statusCode, 200);
				assert(res.data.controlId);
				assert(res.data.mapData.map instanceof Array);
				
				controlId = res.data.controlId;
				
				done();
			});
			
			conn.emit('JOIN_DUNGEON_INSTANCE', {dungeonId : dungeonId, character : {moveSpeed : 1}});
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
	
//	it('move character', function(done)
//	{
//		if(conn)
//		{
//			conn.on('MOVE_CHARACTER', function(res)
//			{
//				assert.equal(res.statusCode, 200);
//				assert.equal(res.characterId, 'test');
//				assert.equal(res.x, 0);
//				
//				done();
//			});
//			conn.emit('MOVE_CHARACTER', {characterId : 'test', controlId : 'test', direction : 'e'});
//		}
//		else
//		{
//			done();
//		}
//	});
});