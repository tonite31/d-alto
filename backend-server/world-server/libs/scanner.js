var fs = require('fs');

module.exports = (function()
{
	var loader = function(dir, app)
	{
		var files = fs.readdirSync(dir);
		
		for(var i=0; i<files.length; i++)
		{
			if(fs.lstatSync(dir + '/' + files[i]).isDirectory())
			{
				loader.load(dir + '/' + files[i]);
			}
			else
			{
				if(files[i].lastIndexOf(".js") == -1)
					continue;
				
				console.log('-- scan : ', dir + '/' + files[i]);
				var module = require(dir + '/' + files[i]);
				module(app);
			}
		}
	};
	
	return loader;
})();