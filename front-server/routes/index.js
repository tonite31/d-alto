var request = require('request');
var config = require('../../config');

module.exports.getRandomCharacter = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var param = {};
	param.url = 'http://localhost:' + config.server['data-server'].port + '/getRandomCharacter';
	request(param, function(error, response, body)
	{
		if(error)
		{
			console.log(error);
			res.status(500).end(error);
		}
		else
		{
			if(response.statusCode == 200)
			{
				var character = JSON.parse(body);
				req.session.character = character;
				res.status(200).send(character);
			}
			else
			{
				res.status(response.statusCode).end(body);
			}
		}

		if(callback)
			callback();
	});
};

module.exports.joinBattleRoom = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	if(!req.session.character)
	{
		res.status(500).end('Create your character.');
		if(callback)
			callback();
	}
	else
	{
		req.session.character.name = req.body.name;
		var param = {};
		param.url = 'http://localhost:' + config.server['battle-server'].port + '/joinBattleRoom';
		param.method = 'POST';
		param.form = {
			character : req.session.character	
		};
		
		request(param, function(error, response, body)
		{
			if(error)
			{
				console.log(error);
				res.status(500).end(error);
			}
			else
			{
				if(response.statusCode == 200)
				{
					res.status(200).send(JSON.parse(body));
				}
				else
				{
					res.status(response.statusCode).end(body);
				}
			}

			if(callback)
				callback();
		});
	}
};

module.exports.clearBattleRoom = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var param = {};
	param.url = 'http://localhost:' + config.server['battle-server'].port + '/clearBattleRoom';
	
	request(param, function(error, response, body)
	{
		if(error)
		{
			console.log(error);
			res.status(500).end(error);
		}
		else
		{
			if(response.statusCode == 200)
			{
				res.status(200).end();
			}
			else
			{
				res.status(response.statusCode).end(body);
			}
		}

		if(callback)
			callback();
	});
};

module.exports.createCharacter = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var character = {};
	
	for(var key in req.session.character)
	{
		character[key] = req.session.character[key];
	}
	
	character.name = req.body.characterName;
	
	var param = {};
	param.url = 'http://localhost:' + config.server['data-server'].port + '/createCharacter';
	param.method = 'post';
	param.form = {
		character : character
	};
	
	request(param, function(error, response, body)
	{
		if(error)
		{
			console.log(error);
			res.status(500).end(error);
		}
		else
		{
			if(response.statusCode == 200)
			{
				res.status(200).end();
			}
			else
			{
				res.status(response.statusCode).end(body);
			}
		}

		if(callback)
			callback();
	});
};

module.exports.checkUserInTheRoom = function(req, callback)
{
	if(!req.session.character)
	{
		callback(401);
		return;
	}
	
	var param = {};
	param.url = 'http://localhost:' + config.server['battle-server'].port + '/checkUserInTheRoom';
	param.method = 'get';
	param.form = {
		characterName : req.session.character.name,
		roomId : req.params.roomId
	};
	
	request(param, function(error, response, body)
	{
		if(error)
		{
			console.log(error);
			if(callback)
				callback(500, error);
		}
		else
		{
			if(response.statusCode == 200)
			{
				if(callback)
					callback(200, body);
			}
			else
			{
				if(callback)
					callback(response.statusCode, body);
			}
		}
	});
};

module.exports.getControlId = function(req, callback)
{
	if(!req.session.character)
	{
		callback(401);
		return;
	}
	
	var param = {};
	param.url = 'http://localhost:' + config.server['battle-server'].port + '/getControlId';
	param.method = 'post';
	param.form = {
		characterName : req.session.character.name,
		roomId : req.params.roomId
	};
	
	request(param, function(error, response, body)
	{
		if(error)
		{
			console.log(error);
			if(callback)
				callback(500, error);
		}
		else
		{
			if(response.statusCode == 200)
			{
				if(callback)
					callback(200, body);
			}
			else
			{
				if(callback)
					callback(response.statusCode, body);
			}
		}
	});
};