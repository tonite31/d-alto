var characterModule = require('../modules/characterModule');

module.exports = function(app)
{
	app.get('/characters/:username', characterModule.getCharactersByUsername);
	app.get('/characters/:username/:id', characterModule.getCharactersByUsernameAndId);
	app.post('/characters', characterModule.createCharacter);
	app.delete('/characters', characterModule.deleteCharacter);
	app.get('/random/characterstat', characterModule.getRandomCharacterStat);
};

//exports.create = function(req, res, next, callback)
//{
//	var character = new characterSchema(req.body);
//	character.save(function(err, data)
//	{
//		if(err)
//		{
//			console.error(err);
//		}
//		else
//		{
//			res.status(201).send(data);
//			if(callback)
//				callback();
//		}
//	});
//};
//
//exports.getCharacters = function(req, res, next, callback)
//{
//	characterSchema.find({userId : req.body.userId}).exec(function(err, data)
//	{
//		if(err)
//		{
//			console.error(err);
//		}
//		else
//		{
//			res.status(200).send(data);
//			if(callback)
//				callback();
//		}
//	});
//}
//
//exports.bindSkills = function(req, res, next, callback)
//{
//	characterSchema.update({_id : req.body._id, skills : req.body.skills}).exec(function(err, data)
//	{
//		if(err)
//		{
//			console.error(err);
//		}
//		else
//		{
//			res.status(200).send(data);
//			if(callback)
//				callback();
//		}
//	});
//};
//
////임시로 하드코딩
//var hpRange = [100, 1000]; 
//var mpRange = [100, 1000];
//var apRange = [10, 20];
//module.exports.getRandomCharacter = function(req, res, next)
//{
//	var hp = randomInt(hpRange[0], hpRange[1]);
//	var mp = randomInt(mpRange[0], mpRange[1]);
//	var ap = randomInt(apRange[0], apRange[1]);
//	var ar = 1;
//	var ms = 1;
//	
//	res.status(200).send({hp : hp, mp : mp, attackPoint : ap, attackRange : ar, moveSpeed : ms});
//	
//	if(arguments.length == 4)
//		arguments[3]();
//};
//
//function randomInt(min, max) {
//  return Math.floor(Math.random() * (max - min)) + min;
//}
//
//module.exports.createCharacter = function(req, res, next)
//{
//	
//};