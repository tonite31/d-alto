var mongoose = require('mongoose');
var characterSchema = require('../schema/characterSchema');

module.exports.getCharactersByUsername = function(req, res, next)
{
	var callback = arguments[3];
	
	var username = req.params.username;
	
	characterSchema.find({username : username}).exec(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(200).send(data);
		}
		
		if(callback)
			callback();
	});
};

var hpRange = [100, 1000]; 
var mpRange = [100, 1000];
var apRange = [10, 20];
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports.getRandomCharacterStat = function(req, res, next)
{
	var callback = arguments[3];
	
	var hp = randomInt(hpRange[0], hpRange[1]);
	var mp = randomInt(mpRange[0], mpRange[1]);
	var ap = randomInt(apRange[0], apRange[1]);
	var ar = 1;
	var ms = 1;
	
	res.status(200).send({hp : hp, mp : mp, attackPoint : ap, attackRange : ar, moveSpeed : ms});
	
	if(callback)
		callback();
};

module.exports.getCharactersByUsernameAndId = function(req, res, next)
{
	var callback = arguments[3];
	
	var username = req.params.username;
	
	characterSchema.find({_id : req.params.id}).exec(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(200).send(data);
		}
		
		if(callback)
			callback();
	});
};

module.exports.createCharacter = function(req, res, next)
{
	var callback = arguments[3];
	
	var character = new characterSchema(req.body);
	character.save(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(201).send(data);
			
			if(callback)
				callback();
		}
	});
};

module.exports.deleteCharacter = function(req, res, next)
{
	var callback = arguments[3];
	
	characterSchema.remove({_id : req.body._id}).exec(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(200).send(data);
			
			if(callback)
				callback();
		}
	});
};