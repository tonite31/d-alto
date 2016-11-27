var uuid = require('uuid');
var random = require("random-js")();

module.exports = (function()
{
	/**
	 * test
	 */
	var types = ['character/cha_pri_f.gif', 'character/cha_wiz_m.gif', 'character/face00.gif', 'character/face05.gif'];
	var npcSpeed = {min : 10, max : 50};
	
	/**
	 * real
	 */
	var character = {};
	
	(function()
	{
		this.create = function(maxPosition, type)
		{
			var self = {};
			self.id = 'user-' + uuid.v4();
			if(maxPosition)
				self.position = {x : random.integer(0, maxPosition.x), y : random.integer(0, maxPosition.y)};
			else
				self.position = {x : 0, y : 0};
			self.prevPosition = self.position;
			self.moveSpeed = 5;
			self.type = (!type ? 'character/cha_ass_m.gif' : type);
			self.collision = true;
			self.collisionSize = {width: 35, height: 25};
			self.size = {width: 50, height: 95};
			self.interactive = true;
			self.movable = false;
			
			return self;
		};
		
		this.createNpc = function(maxPosition)
		{
			var index = random.integer(0, 3);
			var character = this.create(maxPosition, types[index]);
			character.id = character.id.replace('user-', 'npc-');
			character.moveSpeed = random.integer(npcSpeed.min, npcSpeed.max);
			
			return character;
		};
		
		this.move = function(world, character, direction)
		{
			var tc = JSON.parse(JSON.stringify(character));
			
			if(direction == 'right')
				tc.position.x += character.moveSpeed;
			else if(direction == 'left')
				tc.position.x -= character.moveSpeed;
			else if(direction == 'down')
				tc.position.y += character.moveSpeed;
			else if(direction == 'up')
				tc.position.y -= character.moveSpeed;
			
			if(world.checkObjectMovableInMap(world.getMap(), tc))
			{
				character.prevPosition = character.position;
				character.position = tc.position;
				
				return true;
			}
			
			return false;
		}
		
	}).call(character);
	
	return character;
})();