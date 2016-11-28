var world = require('./world');

var Map = require('./schema/mapSchema');

module.exports = function()
{
	//테스트용 함수를 만든다.
	
	var getObjectList = function()
	{
		for(var i=0; i<testObjectCount + testNpcCount; i++)
		{
			var o = Object.create();
			var props = o.property;
			props.prevPosition = props.position = {x : random.integer(0, maps[id].size.width), y : random.integer(0, maps[id].size.height)};
			
			if(i < testObjectCount)
			{
				props.image = '/object/object1.png';
				props.movable = false;
				props.interactive = false;
				props.collision = true;
				
				props.size = {width: 114, height: 104};
				props.collisionSize = {width: 114, height: 50};
				
				o.id = 'object-' + o.id;
			}
			else
			{
				props.image = testNpcImages[random.integer(0, 3)];
				props.movable = true;
				props.interactive = true;
				props.collision = true;
				
				props.size = {width: 50, height: 100};
				props.collisionSize = {width: 50, height: 30};
				
				o.stat.moveSpeed = random.integer(npcSpeed.min, npcSpeed.max);
				
				o.id = 'npc-' + o.id;
			}
			
			//새로 만들지 말고 포지션만 랜덤으로 다시 찍어서 가자.
			while(!world.checkObjectMovable(maps[id], o))
			{
				props.prevPosition = props.position = {x : random.integer(0, maps[id].size.width), y : random.integer(0, maps[id].size.height)};
			}
			
			maps[id].objects.push(o);
		}
	};
	
	world.loadPermanentMaps = function(callback)
	{
		var objectList = [];
		
		
		var list = [];
		
		var map = new Map({
			name : 'test',
			size : {
				width: 1000,
				height: 1000
			},
			mapObjectList : objectList
		});
		
		list.push(map);
		
		callback(list);
	};
};

//module.exports = function(app, io)
//{
//	var characters = {};
//
//	//새 유저가 접속하면 캐릭터를 만들어준다.
//	app.get('/', function(req, res, next)
//	{
//		//world.createObject();
//		if(!req.session.characterId)
//		{
//			var object = world.createObject('user');
//			var props = object.property;
//			
//			props.image = '/character/cha_ass_m.gif';
//			props.size = {width: 50, height: 100};
//			props.collisionSize = {width: 50, height: 30};
//			
//			props.movable = true;
//			props.interactive = true;
//			props.collision = true;
//			
//			object.stat.moveSpeed = 5;
//			
//			do
//			{
//				//최초 캐릭터의 위치를 임의로 설정한다.
//				props.position.x = random.integer(0, 100);
//				props.position.y = random.integer(0, 100);
//				props.prevPosition.x = props.position.x;
//				props.prevPosition.y = props.position.y;
//				
//			}while(!world.checkObjectMovable(maps[testMapId], c));
//			
//			//현재 접속한 사용자의 캐릭터 생성 후 저장.
//			req.session.characterId = object.id;
//		}
//		
//		res.render('index');
//	});
//	
//	io.on('connection', function(client)
//	{
//		//캐릭터가 생성되어 있어야만 동작.
//		if(!client.request.session.characterId)
//			return;
//		
//		var character = world.getCharacter(client.request.session.characterId);
//		
//		//접속한 사람은 맵을 한 번 그려야 하므로.
//		client.emit('CONNECTED', {map : world.getMap(), character : character});
//		
//		//나머지 유저들은 접속한 유저의 정보를 받아야 하므로.
//		//어차피 30프레임으로 맵을 그린다. 접속한 유저의 오브젝트도 그 안에 있을것.
////		client.broadcast.emit('USER_CONNECTED', character);
//		
//		//캐릭터의 움직임.
//		client.on('MOVE_CHARACTER', function(direction)
//		{
//			world.moveObject(character, direction);
////			client.emit('MOVE_CHARACTER', {character : character, direction : direction});
//		});
//		
//		setInterval(function()
//		{
//			//매번 다시 그려야 하는것은 일단은 움직이는 오브젝트들이다.
//			world.testRandomMove();
//			io.emit('UPDATE_MAP', world.getMap());
//		}, 1000 / 30); //30프레임
//	});
//};