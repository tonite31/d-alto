
var users = [];

exports.login = function(req, res, next, callback)
{
	var client = req.redis;
	users.push({username : req.body.username});
	client.set('users', JSON.stringify(users), function(error, data)
	{
		if(error)
		{
			res.status(500).end(error);
		}
		else
		{
			res.status(200).end(data);
		}
		
		if(callback)
			callback();
	});
};