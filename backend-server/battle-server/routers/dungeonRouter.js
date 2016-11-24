var dungeonModule = require('../modules/dungeonModule');

module.exports = function(app)
{
	app.get('/dungeons/:number', dungeonModule.getDungeon);
	app.post('/dungeons', dungeonModule.createDungeonMeta);
	app.put('/dungeons/:number', dungeonModule.updateDungeon);
	app.delete('/dungeons/:number', dungeonModule.deleteDungeon);
};