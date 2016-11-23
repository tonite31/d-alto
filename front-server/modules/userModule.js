var mongoose = require('mongoose');
var UserSchema = require('../schema/userSchema');

module.exports.createUser = function(req, res, next)
{
	var callback = arguments[3];
	
	var user = new UserSchema(req.body);
	UserSchema.findOne({username : req.body.username}).exec(function(error, data)
	{
		if(error)
		{
			throw new Error(error);
		}
		else if(data)
		{
			res.status(200).end('duplicated');
		}
		else
		{
			user.save(function(error, data)
			{
				if(error)
				{
					throw new Error(error);
				}
				else
				{
					res.status(201).end();
					if(callback)
						callback();
				}
			});
		}
	});
};

module.exports.login = function(req, res, next)
{
	var callback = arguments[3];
	
	UserSchema.findOne({username : req.body.username}).exec(function(error, data)
	{
		if(error)
		{
			res.status(500).end(error);
			throw new Error(error);
		}
		else
		{
			if(data)
			{
				if(data.password === req.body.password)
				{
					req.session.username = data.username;
					res.status(200).end('login_success');
				}
				else
				{
					res.status(200).end('password_disaccord');
				}
			}
			else
			{
				res.status(404).end();
			}
				
			if(callback)
				callback();
		}
	});
};