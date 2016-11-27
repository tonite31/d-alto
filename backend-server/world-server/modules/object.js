var uuid = require('uuid');
var random = require("random-js")();

module.exports = (function()
{
	var object = {};
	
	(function()
	{
		this.createObject = function(maxPosition)
		{
			var self = {};
			self.id = 'object-' + uuid.v4();
			self.position = {x : random.integer(0, maxPosition.x), y : random.integer(0, maxPosition.y)};
			self.type = 'object/object1.png';
			self.collision = true;
			self.collisionSize = {width: 100, height: 60};
			self.size = {width: 114, height: 104};
			self.interactive = false;
			self.movable = false;
			
			return self;
		};
		
	}).call(object);
	
	return object;
})();
