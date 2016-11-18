var mongoose = require('mongoose');
var characterSchema = require('../schema/character');

exports.create = function(req, res, next, callback)
{
	var character = new characterSchema(req.body);
	character.save(function(err, data)
	{
		if(err)
		{
			console.error(err);
		}
		else
		{
			res.status(201).send(data);
			if(callback)
				callback();
		}
	});
};

exports.getCharacters = function(req, res, next, callback)
{
	characterSchema.find({userId : req.body.userId}).exec(function(err, data)
	{
		if(err)
		{
			console.error(err);
		}
		else
		{
			res.status(200).send(data);
			if(callback)
				callback();
		}
	});
}

exports.bindSkills = function(req, res, next, callback)
{
	characterSchema.update({_id : req.body._id, skills : req.body.skills}).exec(function(err, data)
	{
		if(err)
		{
			console.error(err);
		}
		else
		{
			res.status(200).send(data);
			if(callback)
				callback();
		}
	});
};