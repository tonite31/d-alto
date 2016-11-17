var __options = null;

module.exports = function(_default)
{
	if(!__options)
	{
		__options = _default || {};
		
		process.argv.forEach(function (val, index, array)
		{
			val = val.substring(1); //parse character '-'
			var split = val.split('=');
			if(__options.hasOwnProperty(split[0]))
				__options[split[0]] = split[1];
		});
	}
	
	return __options;
};