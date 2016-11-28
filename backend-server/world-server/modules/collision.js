module.exports = (function()
{
	var collision = {};
	
	(function()
	{
		this.valueInRange = function(value, min, max)
		{
			return (value >= min) && (value <= max);
		};
		
		//이동할때 충돌하는지 체크한다.
		//target의 포지션은 이미 이동된 포지션으로 나온것이다.
		//그러므로 충돌되는게 하나도 없어야 이동이 가능하다.
		this.moveCollisionCheck = function(src, dest)
		{
			try
			{
				var xOverlap = this.valueInRange(src.location.position.x, dest.location.position.x, dest.location.position.x + dest.property.collisionSize.width) || this.valueInRange(dest.location.position.x, src.location.position.x, src.location.position.x + src.property.collisionSize.width);
				var yOverlap = this.valueInRange(src.location.position.y, dest.location.position.y, dest.location.position.y + dest.property.collisionSize.height) || this.valueInRange(dest.location.position.y, src.location.position.y, src.location.position.y + src.property.collisionSize.height);
				
				return xOverlap && yOverlap;
			}
			catch(err)
			{
				console.log(err.stack);
				throw new Error(err);
			}
		};
		
		this.checkObjectMovable = function(map, target)
		{
			try
			{
				var props = target.property;
				var location = target.location;
				//가장먼저 맵 밖으로 벗어나는지를 체크 해야한다.
				if(location.position.x < 0 || location.position.x + props.collisionSize.width > map.size.width || location.position.y < 0 || location.position.y + props.collisionSize.height > map.size.height)
					return false;
				
				//이 아래 코드가 성능저하의 주범.
				//1000명의 유저가 동시에 이동하면 2중포문이다.
				//1명당 0.001 초가 걸리는데 1000명이면 1초. 따라서 1초씩 계속 렉이 걸린다.
				
				var objects = map.zone[target.location.zoneId];
				var count = 0;
				for(var key in objects)
				{
					var object = objects[key];
					if(target._id != key && object.property.collision && this.moveCollisionCheck(target, object))
					{
						return false;
					}
				}
				
//				for(var i=0; i<objects.length; i++)
//				{
//					//대상 오브젝트를 제외하고 나머지 오브젝트들과 충돌체크를 해서 이동이 가능한지. 알아본다.
//					if(target._id != objects[i]._id && objects[i].property.collision && this.moveCollisionCheck(target, objects[i]))
//					{
//						return false;
//					}
//				}
				
				return true;
			}
			catch(err)
			{
				console.log("타겟 : ", map, target);
				console.log(err.stack);
				throw new Error(err);
			}
		};
	}).call(collision);
	
	return collision;
})();