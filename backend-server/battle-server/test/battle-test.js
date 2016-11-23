var assert = require('assert');
var httpMocks = require('node-mocks-http');

var battle = require('../module/battle');
var battleRoute = require('../routes/battleRoute');

var config = require('../../../config');

describe('Battle test', function()
{
	describe('Ready for battle', function()
	{
		beforeEach(function()
		{
			battle.clearRoom();
		});
		
		it('joinBattleRoom', function(done)
		{
			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse();
			
			req.body.character = {hp : 100, mp : 100, name : 'tester'};
			battleRoute.joinBattleRoom(req, res, null, function()
			{
				var data = res._getData();
				assert.equal(res.statusCode, 200);
				assert.equal(data.roomId, "room");
				done();
			});
		});
		
		it('checkUserInTheRoom', function(done)
		{
			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse();
			
			req.body.roomId = "room";
			req.body.character = {hp : 100, mp : 100, name : 'tester'};
			battleRoute.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.body.roomId = "room";
				req.body.characterName = 'tester';
				
				battleRoute.checkUserInTheRoom(req, res, null, function()
				{
					var data = res._getData();
					assert.equal(res.statusCode, 200);
					assert(data.match(/[0-9]*/gi) != null);
					done();
				});
			});
		});
		
		it('getControlId', function(done)
		{
			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse();
			
			req.body.roomId = "room";
			req.body.character = {hp : 100, mp : 100, name : 'tester'};
			battleRoute.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.body.roomId = "room";
				req.body.characterName = 'tester';
				
				battleRoute.getControlId(req, res, null, function()
				{
					var data = res._getData();
					assert.equal(res.statusCode, 200);
					assert(data);
					done();
				});
			});
		});
		
		it('setInitPositionOfCharacter', function(done)
		{
			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse();
			
			req.body.roomId = "room";
			req.body.character = {hp : 100, mp : 100, name : 'tester'};
			battleRoute.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.body.roomId = "room";
				req.body.characterName = 'tester';
				
				battleRoute.getControlId(req, res, null, function()
				{
					var data = res._getData();
					var result = battle.setInitPositionOfCharacter("room", data);

					assert.equal(result.x, 0);
					assert.equal(result.x, 0);
					
					done();
				});
			});
		});
		
		it('getCharacterPosition', function(done)
		{
			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse();
			
			req.body.roomId = "room";
			req.body.character = {hp : 100, mp : 100, name : 'tester'};
			battleRoute.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.body.roomId = "room";
				req.body.characterName = 'tester';
				
				battleRoute.getControlId(req, res, null, function()
				{
					var data = res._getData();
					battle.setInitPositionOfCharacter("room", data);
					
					req = httpMocks.createRequest();
					res = httpMocks.createResponse();
					
					req.body.roomId = "room";
					req.body.controlId = data;
					battleRoute.getCharacterPosition(req, res, null, function()
					{
						var result = res._getData();
						assert.equal(result.x, 0);
						assert.equal(result.x, 0);
						
						done();
					});
					
				});
			});
		});
	});
	
	describe('Battle logic', function()
	{
		var roomId = 'room';
		var characterName = 'tester';
		var controlId = null;
		beforeEach(function(done)
		{
			battle.clearRoom();
			
			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse();
			
			req.body.roomId = roomId;
			req.body.character = {hp : 100, mp : 100, attackRange : 1, attackPoint : 10, moveSpeed : 1, name : 'tester', skills : [1]};
			battleRoute.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.body.roomId = roomId;
				req.body.characterName = characterName;
				
				battleRoute.getControlId(req, res, null, function()
				{
					controlId = res._getData();
					battle.setInitPositionOfCharacter("room", controlId);
					done();
				});
			});
		});
		
		it('Move character', function()
		{
			battle.moveCharacter(roomId, controlId, 'e');
			var result = battle.getCharacterPosition(roomId, controlId);
			
			assert.equal(result.x, 1);
			assert.equal(result.y, 0);
		});
		
		it('Cast skill 1', function(done)
		{
			var target = {hp : 100, mp : 100, name : 'monster'};
			target.position = {x : 1, y : 1};
			battle.createCharacter(roomId, target);
			
			var skillId = 1;
			battle.moveCharacter(roomId, controlId, 'e');
			battle.moveCharacter(roomId, controlId, 'e');
			battle.moveCharacter(roomId, controlId, 's');
			battle.castSkill(roomId, controlId, target, skillId, function(result)
			{
				assert(result, true);
				
				battle.moveCharacter(roomId, controlId, 's');
				battle.moveCharacter(roomId, controlId, 'w');
				battle.castSkill(roomId, controlId, target, skillId, function(result)
				{
					assert(result, false);
					
					done();
				});
				
				assert(battle.moveCharacterForce(roomId, target.position, {x : 2, y : 1}), true);
			});
		});
	});
});