var DungeonSchema = require('../schema/dungeonSchema');

module.exports.createDungeonMeta = function(req, res, next)
{
	var callback = arguments[3];
	
	var dungeon = new DungeonSchema({number : req.body.number, name : req.body.name});
	dungeon.save(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(201).send(data);
			if(callback)
				callback();
		}
	});
};

module.exports.getDungeon = function(req, res, next)
{
	var callback = arguments[3];
	
	DungeonSchema.findOne({number : req.params.number}).exec(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			if(data)
				res.status(200).send(data);
			else
				res.status(404).send();
			
			if(callback)
				callback();
		}
	});
};

module.exports.updateDungeon = function(req, res, next)
{
	var callback = arguments[3];
	
	DungeonSchema.findOne({number : req.params.number}).exec(function(error, dungeon)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			if(dungeon)
			{
				for(var key in req.body)
				{
					dungeon[key] = req.body[key];
				}
				
				dungeon.save(function(error, data)
				{
					if(error)
					{
						console.log(error);
						throw new Error(error);
					}
					else
					{
						res.status(200).send(data);
						if(callback)
							callback();
					}
				});
				
				return;
			}
			else
			{
				res.status(404).send();
			}
			
			if(callback)
				callback();
		}
	});
};

module.exports.deleteDungeon = function(req, res, next)
{
	var callback = arguments[3];
	
	DungeonSchema.remove({number : req.params.number}).exec(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			res.status(200).send();
			if(callback)
				callback();
		}
	});
};

module.exports.getMapData = function(req, res, next)
{
	var callback = arguments[3];
	DungeonSchema.findOne({number : req.params.number}).exec(function(error, data)
	{
		if(error)
		{
			console.log(error);
			throw new Error(error);
		}
		else
		{
			if(data)
				res.status(200).send(data);
			else
				res.status(404).send();
			
			if(callback)
				callback();
		}
	});
};