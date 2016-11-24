var battle = require('../module/battle');

module.exports.joinBattleRoom = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var character = req.body.character;
	
	var roomId = battle.joinRoom(character);
	
	res.status(200).send({roomId : roomId});
	
	if(callback)
		callback();
};

module.exports.clearBattleRoom = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	battle.clearRoom();
	
	res.status(200).end();
	
	if(callback)
		callback();
};

module.exports.checkUserInTheRoom = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var roomId = req.body.roomId;
	var characterName = req.body.characterName;
	
	var result = battle.checkUserInTheRoom(roomId, characterName);
	res.status(200).end(result + "");
	
	if(callback)
		callback();
};

module.exports.getControlId = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var roomId = req.body.roomId;
	var characterName = req.body.characterName;
	
	var result = battle.getControlId(roomId, characterName);
	res.status(200).end(result + "");
	
	if(callback)
		callback();
};

module.exports.getCharacterPosition = function(req, res, next)
{
	var callback = arguments.length == 4 ? arguments[3] : null;
	
	var roomId = req.body.roomId;
	var controlId = req.body.controlId;
	
	var result = battle.getCharacterPosition(roomId, controlId);
	res.status(200).send(result);
	
	if(callback)
		callback();
}