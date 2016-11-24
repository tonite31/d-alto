var assert = require('assert');
var httpMocks = require('node-mocks-http');

var battleModule = require('../modules/battleModule');

var config = require('../../config');

describe('Battle test', function()
{
	//사용자가 접속버튼을 누른 순간부터.
	//접속버튼을 누르면 일단 던전을 생성한다. 이 던전은 메타정보 생성이 아니라 던전 인스턴스를 생성하는것.
	//socketio의 룸을 활용한다.
	//접속버튼을 누르면. create dungeon instance 실제로는 joinRoom?
	
	//생성했거나 생성이 되어있으면 던전 참가 요청.
	//던전화면으로 이동.
	//맵 정보를 가져와서 그린다.
	//캐릭터 이동.
	
	//create dungeon
	//join dungeon
	//get map data
	//move character
	describe('Battle logic', function()
	{
		var dungeonId = null;
		var conn = null;
		before(function()
		{
			var Connection = battleModule.connection;
			conn = new Connection();
		});
		
		after(function()
		{
			if(conn)
				conn.disconnect();
		});
		
		it('create dungeon instance', function(done)
		{
			if(conn)
			{
				conn.createDungeonInstance(function(res)
				{
					assert.equal(res.statusCode, 201);
					assert.equal(res.data.dungeonId, 0);
					
					dungeonId = res.data.dungeonId;
					
					done();
				});
			}
			else
			{
				done();
			}
		});
		
		it('join dungeon instance', function(done)
		{
			if(conn)
			{
				conn.joinDungeonInstance(dungeonId, function(res)
				{
					assert.equal(res.statusCode, 201);
					assert(res.data.congrolId);
					
					done();
				});
			}
			else
			{
				done();
			}
		});
//		it('Get map data', function(done)
//		{
//			var req = httpMocks.createRequest();
//			var res = httpMocks.createResponse();
//			
//			req.body.dungeonId = 'test';
//			battleModule.getMapData(req, res, null, function()
//			{
//				var data = res._getData();
//				assert.equal(res.statusCode, 200);
//				assert(data instanceof Array);
//				done();
//			});
//		});
	});
	
//	describe('Battle socket logic', function()
//	{
//		var conn = null;
//		before(function(done)
//		{
//			var Connection = battleModule.connection;
//			conn = new Connection();
//		});
//	});
	
//	it('Join Dungeon', function(done)
//	{
//		var req = httpMocks.createRequest();
//		var res = httpMocks.createResponse();
//		
//		req.session = {};
//		req.session.username = 'tester';
//		req.body.characterName = 'test_character';
//		
//		characterModule.getRandomCharacterStat(req, res, null, function()
//		{
//			var data = res._getData();
//			data = JSON.parse(data);
//			assert.equal(res.statusCode, 200);
//			assert(typeof data.hp == 'number');
//			assert(typeof data.mp == 'number');
//			
//			req = httpMocks.createRequest();
//			res = httpMocks.createResponse();
//			
//			req.session = {};
//			req.session.lastRandomCharacterData = data;
//			req.session.username = 'tester';
//			
//			req.body.username = 'tester';
//			req.body.characterName = 'test_character';
//			
//			characterModule.createCharacter(req, res, null, function(data)
//			{
//				var data = res._getData();
//				data = JSON.parse(data);
//				assert.equal(res.statusCode, 201);
//				assert(data._id);
//				
//				req = httpMocks.createRequest();
//				res = httpMocks.createResponse();
//				
//				req.session = {username : 'tester'};
//				req.body.characterId = data._id;
//				
//				characterModule.getCharacter(req, function(code, data)
//				{
//					assert.equal(code, 200);
//					assert(data);
//					
//					characterModule.deleteCharacter(req, res, null, function(data)
//					{
//						done();
//					});
//				});
//			});
//		});
//	});
});