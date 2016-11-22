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
		var param = {};
		param.url = 'http://localhost:' + config.server['battle-server'].port + '/joinBattleRoom';
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