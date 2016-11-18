var mongoose = require('mongoose');

var Skill = require('../schema/skill');

exports.create = function(req, res, next, callback)
{
	var skill = new Skill(req.body);
	
	skill.save(function(err, skill)
	{
		if(err) return console.error(err);
		
		res.status(200).send(skill);
		
		if(callback)
			callback();
	});
};

exports.getSkills = function(req, res, next, callback)
{
	Skill.find({number : req.body.number}).exec(function(err, data)
	{
		res.status(200).send(data);
		if(callback)
			callback();
	});
};