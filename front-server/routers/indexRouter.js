var request = require('request');
var config = require('../../config');
var battleModule = require('../modules/battleModule');
var characterModule = require('../modules/characterModule');

module.exports = function(app)
{
	app.get('/select_character', function(req, res, next)
	{
		if(req.session.username)
			res.render('select_character');
		else
			res.end('<a href="/">로그인</a>이 필요합니다.');
	});
	
	app.get('/create_character', function(req, res, next)
	{
		if(req.session.username)
			res.render('create_character');
		else
			res.end('<a href="/">로그인</a>이 필요합니다.');
	});
	
	app.get('/battle/:dungeonId', function(req, res, next)
	{
		if(req.session.username)
		{
			res.render('battle');
		}
		else
		{
			res.end('<a href="/">로그인</a>이 필요합니다.');
		}
	});
	
	app.get('/battle/getMapData', function(req, res, next)
	{
		if(req.session.username)
		{
			res.status(200).send(req.session.character[req.params.characterId].initMapData);
		}
		else
		{
			res.status(401).end();
		}
	});
	
	app.get('/connect/:characterId', function(req, res, next)
	{
		if(req.session.username)
		{
			if(!req.session.character)
				req.session.character = {};
			
			var Connection = battleModule.connection;
			conn = new Connection();
			
			battleModule.connections[req.params.characterId] = conn;
			
			if(!req.session.character[req.params.characterId])
				req.session.character[req.params.characterId] = {};
			
			characterModule.getCharacter(req.session.username, req.params.characterId, function(code, data)
			{
				if(code == 200)
				{
					//던전 아이디는 일단 0으로 고정.
					var fixedDungeonId = 0;
//					conn.joinDungeonInstance(fixedDungeonId, data, function(response)
//					{
//						console.log('joinDungeon', response);
//						if(response.statusCode == 404 && response.message)
//						{
//							if(response.message == 'dungeon_not_found')
//							{
//								//맵 번호도 일단 0으로 고정.
//								conn.createDungeonInstance(0, function(response)
//								{
//									console.log('createDungeon', response);
//									req.session.character[req.params.characterId].dungeonId = response.data.dungeonId;
//									res.status(200).end('created_dungeon');
//								});
//							}
//							else
//							{
//								res.status(404).end(response.message);
//							}
//						}
//						else
//						{
//							req.session.character[req.params.characterId].dungeonId = fixedDungeonId;
//							req.session.character[req.params.characterId].controlId = response.data.controlId;
//							req.session.character[req.params.characterId].initMapData = response.data.mapData;
//							
//							req.session.useCharacterId = req.params.characterId;
//							
//							res.status(200).send(fixedDungeonId);
//						}
//					});
				}
				else
				{
					res.status(code).send(data);
				}
			});
		}
		else
		{
			res.status(401).end();
		}
	});
};

//module.exports.getRandomCharacter = function(req, res, next)
//{
//	var callback = arguments.length == 4 ? arguments[3] : null;
//	
//	var param = {};
//	param.url = 'http://localhost:' + config.server['data-server'].port + '/getRandomCharacter';
//	request(param, function(error, response, body)
//	{
//		if(error)
//		{
//			console.log(error);
//			res.status(500).end(error);
//		}
//		else
//		{
//			if(response.statusCode == 200)
//			{
//				var character = JSON.parse(body);
//				req.session.character = character;
//				res.status(200).send(character);
//			}
//			else
//			{
//				res.status(response.statusCode).end(body);
//			}
//		}
//
//		if(callback)
//			callback();
//	});
//};
//
//module.exports.joinBattleRoom = function(req, res, next)
//{
//	var callback = arguments.length == 4 ? arguments[3] : null;
//	if(!req.session.character)
//	{
//		res.status(500).end('Create your character.');
//		if(callback)
//			callback();
//	}
//	else
//	{
//		req.session.character.name = req.body.name;
//		var param = {};
//		param.url = 'http://localhost:' + config.server['battle-server'].port + '/joinBattleRoom';
//		param.method = 'POST';
//		param.form = {
//			character : req.session.character	
//		};
//		
//		request(param, function(error, response, body)
//		{
//			if(error)
//			{
//				console.log(error);
//				res.status(500).end(error);
//			}
//			else
//			{
//				if(response.statusCode == 200)
//				{
//					res.status(200).send(JSON.parse(body));
//				}
//				else
//				{
//					res.status(response.statusCode).end(body);
//				}
//			}
//
//			if(callback)
//				callback();
//		});
//	}
//};
//
//module.exports.clearBattleRoom = function(req, res, next)
//{
//	var callback = arguments.length == 4 ? arguments[3] : null;
//	
//	var param = {};
//	param.url = 'http://localhost:' + config.server['battle-server'].port + '/clearBattleRoom';
//	
//	request(param, function(error, response, body)
//	{
//		if(error)
//		{
//			console.log(error);
//			res.status(500).end(error);
//		}
//		else
//		{
//			if(response.statusCode == 200)
//			{
//				res.status(200).end();
//			}
//			else
//			{
//				res.status(response.statusCode).end(body);
//			}
//		}
//
//		if(callback)
//			callback();
//	});
//};
//
//module.exports.createCharacter = function(req, res, next)
//{
//	var callback = arguments.length == 4 ? arguments[3] : null;
//	
//	var character = {};
//	
//	for(var key in req.session.character)
//	{
//		character[key] = req.session.character[key];
//	}
//	
//	character.name = req.body.characterName;
//	
//	var param = {};
//	param.url = 'http://localhost:' + config.server['data-server'].port + '/createCharacter';
//	param.method = 'post';
//	param.form = {
//		character : character
//	};
//	
//	request(param, function(error, response, body)
//	{
//		if(error)
//		{
//			console.log(error);
//			res.status(500).end(error);
//		}
//		else
//		{
//			if(response.statusCode == 200)
//			{
//				res.status(200).end();
//			}
//			else
//			{
//				res.status(response.statusCode).end(body);
//			}
//		}
//
//		if(callback)
//			callback();
//	});
//};
//
//module.exports.checkUserInTheRoom = function(req, callback)
//{
//	if(!req.session.character)
//	{
//		callback(401);
//		return;
//	}
//	
//	var param = {};
//	param.url = 'http://localhost:' + config.server['battle-server'].port + '/checkUserInTheRoom';
//	param.method = 'get';
//	param.form = {
//		characterName : req.session.character.name,
//		roomId : req.params.roomId
//	};
//	
//	request(param, function(error, response, body)
//	{
//		if(error)
//		{
//			console.log(error);
//			if(callback)
//				callback(500, error);
//		}
//		else
//		{
//			if(response.statusCode == 200)
//			{
//				if(callback)
//					callback(200, body);
//			}
//			else
//			{
//				if(callback)
//					callback(response.statusCode, body);
//			}
//		}
//	});
//};
//
//module.exports.getControlId = function(req, callback)
//{
//	if(!req.session.character)
//	{
//		callback(401);
//		return;
//	}
//	
//	var param = {};
//	param.url = 'http://localhost:' + config.server['battle-server'].port + '/getControlId';
//	param.method = 'post';
//	param.form = {
//		characterName : req.session.character.name,
//		roomId : req.params.roomId
//	};
//	
//	request(param, function(error, response, body)
//	{
//		if(error)
//		{
//			console.log(error);
//			if(callback)
//				callback(500, error);
//		}
//		else
//		{
//			if(response.statusCode == 200)
//			{
//				if(callback)
//					callback(200, body);
//			}
//			else
//			{
//				if(callback)
//					callback(response.statusCode, body);
//			}
//		}
//	});
//};