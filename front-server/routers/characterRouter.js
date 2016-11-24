var characterModule = require('../modules/characterModule');

module.exports = function(app)
{
	app.get('/api/getMyCharacter', characterModule.getMyCharacters);
	app.get('/api/getRandomCharacterStat', characterModule.getRandomCharacterStat);
	app.post('/api/createCharacter', characterModule.createCharacter);
};