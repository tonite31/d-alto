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
				if(data.loginState)
				{
					//중복로그인 처리.
				}
				
				if(data.password === req.body.password)
				{
					req.session.username = data.username;
					
					var user = new UserSchema(data);
					user.loginState = true;
					user.save(function(err, data)
					{
						if(err)
						{
							console.log(err);
							res.status(500).end(err);
							throw new Error(err);
						}
						
						res.status(200).end('login_success');
						if(callback)
							callback();
					});
					
					return;
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

module.exports.checkLoginState = function(req, res, next)
{
	var callback = arguments[3];
	
	UserSchema.findOne({username : req.body.username}, function(error, data)
	{
		if(error)
	    {
	    	console.log(error);
	    	throw new Error(error);
	    }
		
		var user = new UserSchema(data);
		user.connectionInfo = {character : req.body.characterId};
		user.save(function(error, data)
		{
			if(error)
		    {
		    	console.log(error);
		    	throw new Error(error);
		    }
			
			res.status(200).send(data.loginState);
		    
			if(callback)
				callback();
		});
	});
};