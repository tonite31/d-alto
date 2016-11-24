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
	//join dungeon -- battle-server쪽에는 구현 완료.
	//get map data //이건 join 후에 controlId랑 같이 받자.
	//move character //join 한 후에는 controlId를 이용해서 캐릭터를 움직일 수 있음.
	describe('Battle logic', function()
	{
		var dungeonId = null;
		var controlId = null;
		var conn = null;
		
		var character = {_id :'tester', name : 'tester', hp: 10, mp: 10, moveSpeed : 1, attackRange : 1, attackPoint : 10};
		
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
				conn.createDungeonInstance(0, function(res)
				{
					assert.equal(res.statusCode, 201);
					assert(typeof res.data.dungeonId == 'number');
					
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
				conn.joinDungeonInstance(dungeonId, character, function(res)
				{
					assert(!res.message);
					assert.equal(res.statusCode, 200);
					assert(res.data.controlId);
					assert(res.data.mapData.map instanceof Array);
					
					controlId = res.data.controlId;
					
					done();
				});
			}
			else
			{
				done();
			}
		});
		
		it('move character', function(done)
		{
			if(conn)
			{
				conn.moveCharacter(dungeonId, controlId, 'e', function(res)
				{
					assert.equal(res.statusCode, 200);
					assert.equal(res.data.characterId, 'tester');
					assert(typeof res.data.position.x == 'number');
					assert(typeof res.data.position.y == 'number');
					
					done();
				});
			}
			else
			{
				done();
			}
		});
	});
});