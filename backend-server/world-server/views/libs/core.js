var _core = {};

(function()
{
	var mapId = '#map';
	var canvasMapId = '#canvasMap';
	
	this.createObject = function(object)
	{
		var position = object.position;
		
		var x = position.x;
		var y = position.y;
		
		//canvas로 할지 정해야되나?
		
		if(object.interactive)
		{
			//div로 만들건데.
		}
		else
		{
			//canvas에 그릴거고.
			var img = new Image();
			img.onload = function()
			{
			};
			
			img.src = '/views/images/' + object.type;
			
			object.image = img;
		}
		
//		var template = '<div class="object"><div class="object-image"></div></div>';
//		template = $(template);
//		template.attr('id', object.id)
//		.css('transform', 'translate(' + x + 'px, ' + y + 'px)')
//		.css('width', object.collisionSize.width + 'px')
//		.css('height', object.collisionSize.height + 'px')
//		.children('div')
//		.css('background-image', 'url(/views/images/' + object.type + ')')
//		.css('width', object.size.width + 'px')
//		.css('height', object.size.height + 'px');
//		
//		if(object.id.indexOf('npc-') != -1)
//			template.addClass('npc');
//		
//		return template;
//		
//		$(containsers.map).append(template);
	};
	
	this.createMap = function(map)
	{
		//맵을 만든다.
		//맵에는 움직이는 오브젝트와 움직이지 않는 오브젝트가 있다.
		
		var movables = map.movableObjects;
		var nonMovables = map.nonMovableObjects;
		
		for(var i=0; i<movables.length; i++)
			this.createObject(movables[i]);
		
		for(var i=0; i<nonMovables.length; i++)
			this.createObject(nonMovables[i]);
	};
	
	this.updateMap = function(map)
	{
		//맵을 그린다.
		var canvas = $(canvasMapId).get(0);
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		for(var i=0; i<map.nonMovableObjects.length; i++)
		{
			var object = map.nonMovableObjects[i];
			var img = object.image;
			context.drawImage(img, 0, 0, 100, 100);
		}
	};
	
}).call(_core);