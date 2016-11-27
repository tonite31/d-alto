module.exports = (function()
{
	(function()
	{
		this.createMap = function(id)
		{
			var self = {};
			self.id = id;
			self.name = 'test';
			self.collisionSize = {x : 1000, y : 1000};
			self.nonMovableObjects = {};
			self.movableObjects = {};
			
			return self;
		};
		
	}).call(map);
	
	return map;
})();