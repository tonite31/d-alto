var users = require('../modules/userModule');

module.exports = function(app)
{
	app.get('/', function(req, res, next)
	{
		res.render('index');
	});
	
	app.post('/users', users.createUser);
	app.post('/login', users.login);
};