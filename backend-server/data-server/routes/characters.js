var characters = [];

exports.create = function(req, res, next, callback)
{
	characters.push({name : req.body.name, skills : req.body.skills});
	res.send(characters[characters.length-1]);
	if(callback)
		callback();
};