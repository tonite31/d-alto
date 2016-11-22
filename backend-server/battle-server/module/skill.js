var logic = {};

(function()
{
	this["1"] = {
		castTime : 0,
		callback : function(caster, target, done)
		{
			//근거리 기본공격
			var cp = caster.position;
			var ar = caster.attackRange;
			var tp = target.position;
			
			if((cp.x + ar >= tp.x && cp.x <= tp.x && cp.y + ar >= tp.y && cp.y <= tp.y)
			   || (cp.x + ar >= tp.x && cp.x <= tp.x && cp.y - ar <= tp.y && cp.y >= tp.y)
			   || (cp.x - ar <= tp.x && cp.x >= tp.x && cp.y - ar <= tp.y && cp.y >= tp.y)
			   || (cp.x - ar <= tp.x && cp.x >= tp.x && cp.y + ar >= tp.y && cp.y <= tp.y))
			{
				caster.attackPoint
				target.hp -= caster.attackPoint;
				return true;
			}
			else
			{
				return false;
			}
		}
	};
	
}).call(logic);

module.exports = logic;