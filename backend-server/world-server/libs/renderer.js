var path = require('./path');
var fs = require('fs');

module.exports = function(req, res, next)
{
	var render = function(name, param)
	{
		if(name.indexOf('/') == 0)
			name = name.substring(1);
		
		fs.exists(path.get('views') + '/' + name + '.html', function(exists)
		{
			if(exists)
			{
				fs.readFile(path.get('views') + '/layout.html', function(err, layout)
				{
					if(err)
					{
						res.status(404).end();
					}
					else
					{
						fs.readFile(path.get('views') + '/' + name + '.html', function(err, data)
						{
							if(err)
							{
								res.status(404).end();
							}
							else
							{
								res.writeHead(200, {"Content-Type" : "text/html"});
								res.end(layout.toString().replace('{body}', data.toString()));
							}
						});
					}
				});
			}
			else
			{
				res.status(404).end();
			}
		});
	};
	
	res.render = render;
	next();
};