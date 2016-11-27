var assert = require('assert');
var io = require('socket.io-client');
var config = require('../../../config');

var random = require("random-js")();
var world = require('../modules/world');
var character = require('../modules/character');

describe('Test', function()
{
	it('create object test for test', function()
	{
//		var map = world.getMap();
//		
//		assert.equal(map.id, 'test');
//		assert(typeof map.nonMovableObjects[0].position.x == 'number');
	});
	
//	it('random moving', function()
//	{
//		var map = world.getMap();
//		
//		var npc = character.createNpc({x : map.size.width, y : map.size.height});
//		map.movableObjects.push(npc);
//		
//		assert(typeof npc.position.x == 'number');
//		
//		var originPosition = JSON.parse(JSON.stringify(npc.position));
//		
//		while(!character.move(world, npc, 'left'));
//		
//		assert.equal(npc.position.x, originPosition.x - npc.moveSpeed);
//		
//		random.integers({min : 0, max : 3});
//	});
});