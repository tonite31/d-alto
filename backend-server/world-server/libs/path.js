(function(target)
{
	var path = {};
	target.add = function(key, value)
	{
		path[key] = value;
	};
	
	target.get = function(key)
	{
		return path[key];
	};
})(module.exports);