var UserSchema = require('../schema/user');


exports.login = function(req, res, next, callback)
{
	UserSchema.findOne({username : req.body.username, password : req.body.password}).exec(function(err, data)
	{
		if(err)
		{
			console.error(err);
		}
		else
		{
			res.status(200).end(data.username);
			if(callback)
				callback();
		}
	});
};

exports.create = function(req, res, next, callback)
{
	var user = new UserSchema(req.body);
	user.save(function(err, data)
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