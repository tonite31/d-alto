var request = require('request');
var config = require('../../config');

const DATA_SERVER_HOST = 'http://' + config.server['data-server'].host + ':' + config.server['data-server'].port;

module.exports.getMyCharacter = function(req, res, next)
{
	var callback = arguments[3];
	
	if(!req.session.username)
	{
		res.status(401).end();
		if(callback)
			callback();
		
		return;
	}
	
	var options = {};
	options.url = DATA_SERVER_HOST + '/characters/' + req.session.username;
	options.method = 'GET';
	
	request(options, function(err, response, data)
	{
		if(err)
		{
			console.log(err);
			throw new Error(err);
		}
		else
		{
			if(response.statusCode == 200)
			{
				res.status(200).send(data);
			}
			else
			{
				console.log(err);
				res.status(response.statusCode).send(data);
			}
		}
		
		if(callback)
			callback();
	});
};

module.exports.getRandomCharacterStat = function(req, res, next)
{
	var callback = arguments[3];
	
	if(!req.session.username)
	{
		res.status(401).end();
		if(callback)
			callback();
		
		return;
	}
	
	var options = {};
	options.url = DATA_SERVER_HOST + '/random/characterstat';
	options.method = 'GET';
	
	request(options, function(err, response, data)
	{
		if(err)
		{
			console.log(err);
			throw new Error(err);
		}
		else
		{
			if(response.statusCode == 200)
			{
				req.session.lastRandomCharacterData = JSON.parse(data);
				res.status(200).send(data);
			}
			else
			{
				console.log(err);
				res.status(response.statusCode).send(data);
			}
		}
		
		if(callback)
			callback();
	});
};

module.exports.createCharacter = function(req, res, next)
{
	var callback = arguments[3];
	
	if(!req.session.username)
	{
		res.status(401).end();
		if(callback)
			callback();
		
		return;
	}
	
	var options = {};
	options.url = DATA_SERVER_HOST + '/characters';
	options.method = 'POST';
	options.form = {};
	options.form.username = req.session.username;
	options.form.name = req.body.characterName;
	
	for(var key in req.session.lastRandomCharacterData)
	{
		options.form[key] = req.session.lastRandomCharacterData[key];
	}
	
	request(options, function(err, response, data)
	{
		if(err)
		{
			console.log(err);
			throw new Error(err);
		}
		else
		{
			if(response.statusCode == 201)
			{
				res.status(201).end();
			}
			else
			{
				console.log(err);
				res.status(response.statusCode).send(data);
			}
		}
		
		if(callback)
			callback();
	});
};
