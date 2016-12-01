var uuid = require('uuid');
var random = require("random-js")();
var world = require('./world');

var Object = require('../schema/objectSchema');
var Map = require('../schema/mapSchema');

module.exports = function(app, io)
{
	var timer = {};
	world.createMaps(function()
	{
		console.log("맵 생성 완료");
		
		//서버가 실행되면 메모리에 올리고나서.
		//새 유저가 접속하면 캐릭터를 만들어준다.
		app.get('/', function(req, res, next)
		{
			if(!req.session.characterId)
			{
				var character = world.createUserCharacter('test');
				//현재 접속한 사용자의 캐릭터 생성 후 저장.
				req.session.characterId = character._id;
			}
			
			res.render('index');
		});
		
		app.put('/screenSize', function(req, res, next)
		{
			if(req.session.characterId)
			{
				req.session.screenSize = req.body;
			}
			else
			{
				res.status(401).end();
			}
		});
		
		io.on('connection', function(client)
		{
			//캐릭터가 생성되어 있어야만 동작.
			if(!client.request.session.characterId)
				return;
			
			clearTimeout(timer[client.request.session.characterId]);
			delete timer[client.request.session.characterId];
			
			var character = world.getUserCharacter(client.request.session.characterId);
			if(!character)
			{
				//disconnect가 오래되서 끊긴것.
				return;
			}
			
			//접속한 사람은 맵을 한 번 그려야 하므로.
			//그런데 성능상 클라이언트 화면에 보여지는것만 줄거야.
			//그래서 여기에서는 일단 캐릭터만 주고.
			var map = world.getMap(character.location.mapName);
			client.emit('CONNECTED', {map : {name : map.name, size : map.size}, character : character});
			client.on('UPDATE_OBJECTS', function(data)
			{
				//화면의 스크린 좌표를 줌.
				//화면이 맵의 어느부분을 보여주고 있는가.
				//그래서 겹치는 존을 구해서 그 존을 준다.
				var screenPosition = data.screenPosition;
				
				var map = world.getMap(character.location.mapName);
				
				var zw = map.zoneSize.width;
				var zh = map.zoneSize.height;
				
				var sx = Math.floor(screenPosition.left / zw);
				var ex = Math.floor(screenPosition.right / zw);
				
				var sy = Math.floor(screenPosition.top / zh);
				var ey = Math.floor(screenPosition.bottom / zh);
				
				var list = [];
				for(var i=sx; i<=ex; i++)
				{
					for(var j=sy; j<=ey; j++)
					{
						list.push(map.zone[i + '-' + j]);
					}
				}
				
				io.emit('UPDATE_OBJECTS', list);
			});
			
			//캐릭터의 움직임.
			client.on('MOVE_CHARACTER', function(direction)
			{
				world.moveObject(character, direction);
//				client.emit('MOVE_CHARACTER', {character : character, direction : direction});
			});
			
			client.on('CHAT_MESSAGE', function(message)
			{
				io.emit('CHAT_MESSAGE', message);
			});
			
			client.on('disconnect', function()
			{
				timer[client.request.session.characterId] = setTimeout(function()
				{
					world.deleteObject(client.request.session.characterId);
				},10 * 1000);
			});
			
			client.on("error", function(error)
			{
			    console.log(error);
			});
		});
	});
};