var assert = require('assert');
var httpMocks = require('node-mocks-http');


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
		
	});
});