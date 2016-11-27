var myun = {}; 

var mapId = '#map';
var screenId = '#screen';
var canvasMapId = '#canvasMap';

//3. 맵의 오브젝트(내 캐릭터 포함)를 그린다.

(function()
{
	var canvasImages = {};
	
	//접속하면 소켓이 생성된다.
	var socket = io.connect();
	socket.on('CONNECTED', function(data)
	{
		var map = data.map;
		var myCharacter = data.character;
		
		$(document).ready(function()
		{
			$(mapId).css('width', map.size.width + 'px').css('height', map.size.height + 'px');
			$(canvasMapId).attr('width', map.size.width).attr('height', map.size.height);
			this.createMap(map);
			this.bindKeyboardAction();
		}.bind(this));
//		
//		myun.setCharacter(data.character);
//		myun.setMapSize(map);
//		//접속하면 그 당시 맵의 정보를 받아온다.
//		myun.drawMap(map);
//		myun.setInitialScroll();
//		
//		$(mapId).css('width', map.size.width).css('height', map.size.height);
//		
//		//이 다음캐릭터를 스크린 가운데로 오게 만든다.
//		//새로고침 하면 일단 0, 0 인 상태로 보일테니까.
	}.bind(this));
	
	socket.on('UPDATE_MAP', function(map)
	{
		this.updateMap(map);
	}.bind(this));
	
	this.createMap = function(map)
	{
		for(var i=0; i<map.objects.length; i++)
		{
			var object = map.objects[i];
			
			//움직이는 오브젝트는 element로 아닌 애들은 canvas로
		}
//		for(var i=0; i<map.movableObjects.length; i++)
//		{
//			var object = map.movableObjects[i];
//			
//			var x = object.position.x;
//			var y = object.position.y;
//			
//			var template = '<div class="object"><div class="object-image"></div></div>';
//			template = $(template);
//			template.attr('id', object.id)
//			.css('transform', 'translate(' + x + 'px, ' + y + 'px)')
//			.css('width', object.collisionSize.width + 'px')
//			.css('height', object.collisionSize.height + 'px')
//			.children('div')
//			.css('background-image', 'url(/views/images/' + object.type + ')')
//			.css('width', object.size.width + 'px')
//			.css('height', object.size.height + 'px');
//			
//			if(object.id.indexOf('npc-') != -1)
//				template.addClass('npc');
//			
//			$(mapId).append(template);
//		}
//		
//		
//		var canvas = $(canvasMapId).get(0);
//		var context = canvas.getContext('2d');
//		context.clearRect(0, 0, canvas.width, canvas.height);
//		
//		for(var i=0; i<map.nonMovableObjects.length; i++)
//		{
//			var object = map.nonMovableObjects[i];
//			(function(object)
//			{
//				var image = new Image();
//				image.src = '/views/images/' + object.type;
//				
//				image.onload = function()
//				{
//					var cx = object.position.x;
//					var cy = object.position.y - (object.size.height - object.collisionSize.height);
//					context.drawImage(image, cx, cy);
//					
//					canvasImages[object.id] = image;
//				};
//			})(object);
//		}
	};
	
	this.updateMap = function(map)
	{
		//맵을 그린다.
		var canvas = $(canvasMapId).get(0);
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		
//		for(var i=0; i<map.movableObjects.length; i++)
//		{
//			var object = map.movableObjects[i];
//			
//			var x = object.position.x;
//			var y = object.position.y;
//			
//			$('#' + object.id).css('transform', 'translate(' + x + 'px, ' + y + 'px)');
//		}
//		
//		for(var i=0; i<map.nonMovableObjects.length; i++)
//		{
//			var object = map.nonMovableObjects[i];
//			var cx = object.position.x;
//			var cy = object.position.y - (object.size.height - object.collisionSize.height);
//			
//			if(canvasImages[object.id])
//				context.drawImage(canvasImages[object.id], cx, cy);
//		}
	};
	
	this.bindKeyboardAction = function()
	{
		$(window).on('keydown', function(e)
		{
			var direction = null;
			var keyCode = e.keyCode;
			if(keyCode == 68)
				direction = 'right';
			else if(keyCode == 83)
				direction = 'down';
			else if(keyCode == 65)
				direction = 'left';
			else if(keyCode == 87)
				direction = 'up';
			
			socket.emit('MOVE_CHARACTER', direction);
		});
	};
})();

//(function()
//{
//	var character = null;
//	var screenSize = {};
//	var boundaryPosition = {};
//	var mapSize = {left : 0, top: 0, width: 0, height: 0};
//	var isScrolling = false;
//	
//	var containsers = {map : mapId};
//	
//
//	this.connected = function(map, myCharacter)
//	{
//		
//	};
//	
//	this.drawMap = function(map)
//	{
//		
//	};
//	
//	
//	
//	
//	
//	$(document).ready(function()
//	{
//		screenSize.width = new Number($(screenId).css('width').replace('px', ''));
//		screenSize.height = new Number($(screenId).css('height').replace('px', ''));
//		
//		screenSize.width = parseInt(screenSize.width / 10) * 10;
//		screenSize.height = parseInt(screenSize.height / 10) * 10;
//		
//		boundaryPosition.left = new Number($('#scrollBoundary').css('left').replace('px', ''));
//		boundaryPosition.right = boundaryPosition.left + new Number($('#scrollBoundary').css('width').replace('px', ''));
//		boundaryPosition.top = new Number($('#scrollBoundary').css('top').replace('px', ''));
//		boundaryPosition.bottom = boundaryPosition.top + new Number($('#scrollBoundary').css('height').replace('px', ''));
//		
//		myun.canvasTest(screenSize);
//	});
//	
//	this.setCharacter = function(c)
//	{
//		character = c;
//	};
//	
//	this.getCharacter = function()
//	{
//		return character;
//	};
//	
//	this.setMapSize = function(map)
//	{
//		mapSize.width = map.size.width;
//		mapSize.height = map.size.height;
//		$(document).ready(function()
//		{
//			$(canvasMapId).attr('width', mapSize.width).attr('height', mapSize.height);
//		});
//	};
//	
//	this.createObject = function(object)
//	{
//		var position = object.position;
//		
//		var x = position.x;
//		var y = position.y;
//		
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
//		$(containsers.map).append(template);
//	};
//	
//	this.drawMap = function(map)
//	{
//		var nmo = map.nonMovableObjects;
//		var mo = map.movableObjects;
//		
//		for(var i=0; i<nmo.length; i++)
//		{
//			myun.createObject(nmo[i]);
//		}
//		
//		for(var i=0; i<mo.length; i++)
//		{
//			myun.createObject(mo[i]);
//		}
//	};
//	
//	this.setInitialScroll = function()
//	{
//		if(character.position.x > boundaryPosition.right)
//		{
//			mapSize.left -= Math.abs((boundaryPosition.right - boundaryPosition.left) / 2 + boundaryPosition.left - character.position.x);
//			if(mapSize.left + mapSize.width < screenSize.width)
//			{
//				mapSize.left += Math.abs(screenSize.width - (mapSize.left + mapSize.width));
//			}
//		}
//		
//		if(character.position.y > boundaryPosition.bottom)
//		{
//			mapSize.top -= Math.abs((boundaryPosition.bottom - boundaryPosition.top) / 2 + boundaryPosition.top - character.position.y);
//			if(mapSize.top + mapSize.height < screenSize.height)
//			{
//				mapSize.top += Math.abs(screenSize.height - (mapSize.top + mapSize.height));
//			}
//		}
//		
//		$(mapId).css('transform', 'translate(' + mapSize.left + 'px, ' + mapSize.top + 'px)');
//	};
//	
//	this.scrollScreen = function(direction)
//	{
//		//맵을 더 이상 움직일 수 없는 경우는 움직이지 않는다.
//		//맵을 움직일 수 있으면 캐릭터를 스크린 가운데에 두게끔 움직인다.
//		
//		var oper = new Number(character.moveSpeed) * (direction == 'left' || direction == 'up' ? -1 : 1);
//		character.position.x = new Number(character.position.x);
//		character.position.y = new Number(character.position.y);
//		
//		var x = null;
//		var y = null;
//		if(direction == 'left' || direction == 'right')
//			character.position.x += oper;
//		else if(direction == 'up' || direction == 'down')
//			character.position.y += oper;
//		
//		x = character.position.x;
//		y = character.position.y;
//		
//		x += mapSize.left;
//		y += mapSize.top;
//
//		//캐릭터가 못움직이는 상황이면 움직이면 안된다. 결국 서버 타야한다.
//		//부르르 떨리는 문제 스크롤을 할때는 캐릭터를 움직이지 않고 띄운다. 즉 fixed로 만들고 그 자리에 고정시키는거지.
//		if((direction == 'left' && mapSize.left < oper && x + character.collisionSize.width <= boundaryPosition.left && mapSize.left <= 0) || (direction == 'right' && mapSize.width + oper >= mapSize.left + screenSize.width && x >= boundaryPosition.right && mapSize.left + mapSize.width > screenSize.width))
//		{
//			mapSize.left -= oper;
//			$('#' + character.id).css('position', 'fixed').css('transform', 'translate(' + x + 'px, ' + y + 'px)');
//			if(!isScrolling)
//			{
//				$('body').append($('#' + character.id));
//				isScrolling = true;
//			}
//		}
//		else if((direction == 'up' && mapSize.top < oper && y + character.collisionSize.height <= boundaryPosition.top && mapSize.top <= 0) || (direction == 'down' && mapSize.height + oper >= mapSize.top + screenSize.height && y >= boundaryPosition.bottom && mapSize.top + mapSize.height > screenSize.height))
//		{
//			mapSize.top -= oper;
//			$('#' + character.id).css('position', 'fixed').css('transform', 'translate(' + x + 'px, ' + y + 'px)');
//			if(!isScrolling)
//			{
//				$('body').append($('#' + character.id));
//				isScrolling = true;
//			}
//		}
//		else
//		{
//			//이걸로 계속 이동하는건데
//			$('#' + character.id).css('position', 'absolute').css('transform', 'translate(' + character.position.x + 'px, ' + character.position.y + 'px)');
//			if(isScrolling)
//			{
//				$(mapId).append($('#' + character.id));
//				isScrolling = false;
//			}
//		}
//		
//		$(mapId).css('transform', 'translate(' + mapSize.left + 'px, ' + mapSize.top + 'px)');
//	};
//	
//	this.updateMap = function(map)
//	{
//		//움직이지 않는건 업데이트 할 필요가 없다. 그런데 만약 파괴된게 있으면 그건 처리해야한다.
////		var nmo = map.nonMovableObjects;
////		for(var i=0; i<nmo.length; i++)
////		{
////			$('#' + nmo[i].id).css('left', nmo[i].position.x + 'px').css('top', nmo[i].position.y + 'px');
////		}
//		
//		var mo = map.movableObjects;
//		for(var i=0; i<mo.length; i++)
//		{
//			if(mo[i].id != character.id && (mo[i].prevPosition.x != mo[i].position.x || mo[i].prevPosition.y != mo[i].position.y))
//			{
//				$('#' + mo[i].id).css('transform', 'translate(' + mo[i].position.x + 'px, ' + mo[i].position.y + 'px)');
//			}
//		}
//	};
//	
//	this.canvasTest = function(screenSize)
//	{
//		$('#canvas').attr('width', screenSize.width).attr('height', screenSize.height);
//		var canvas = $('#canvas').get(0);
//		var context = canvas.getContext("2d");
//		
//		var img = new Image();
//		img.src = '/views/images/character/cha_pri_f.gif';
//		img.addEventListener('load', function(){
//			context.drawImage(img, 0, 0);
//		}, false);
//	};
//}).call(myun);
//
//socket.on('USER_CONNECTED', function(character)
//{
//	//다른 사람이 접속하면 그 사람 캐릭터를 그린다.
//	if($('#' + character.id).length <= 0) 
//		myun.createObject(character);
//});
//
//
//socket.on('MOVE_CHARACTER', function(data)
//{
//	var direction = data.direction;
//	myun.scrollScreen(direction);
//});
//