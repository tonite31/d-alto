var _KeyCode = {};

(function()
{
	this['65'] = 'left';
	this['68'] = 'right';
	this['87'] = 'up';
	this['83'] = 'down';
	this['49'] = '1';
	this['13'] = 'enter';
	
	this.isMoving = function(e)
	{
		if(e.keyCode == 65 || e.keyCode == 68 || e.keyCode == 83 || e.keyCode == 87)
			return this[e.keyCode + ''];
		else
			return false;
	};
	
}).call(_KeyCode);