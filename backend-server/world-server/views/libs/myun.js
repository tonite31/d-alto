var myun = {}; 

var mapId = '#map';
var screenId = '#screen';
var canvasMapId = '#canvas';

//3. 맵의 오브젝트(내 캐릭터 포함)를 그린다.

(function()
{
	var objectImage = null;
	var myCharacter = null;
	var map = null;
	
	var mapScrollData = {left: 0, top: 0};
	var screenSize = {};
	var screenPosition = {left: 0, right: 0, top: 0, bottom: 0};
	var drawedObjectList = {};
	
	//접속하면 소켓이 생성된다.
	var socket = io.connect();
	socket.on('CONNECTED', function(data)
	{
		this.loadImages(function()
		{
			map = data.map;
			myCharacter = data.character;
			
			$(document).ready(function()
			{
				try
				{
					screenSize.width = new Number($(screenId).css('width').replace('px', ''));
					screenSize.height = new Number($(screenId).css('height').replace('px', ''));
					
					screenPosition.right = screenSize.width;
					screenPosition.bottom = screenSize.height;
					
					this.moveScreenOnMyCharacter();
					
					setInterval(function()
					{
						var sp = {
							left : -mapScrollData.left,
							right : screenPosition.right - mapScrollData.left,
							top : -mapScrollData.top,
							bottom: screenPosition.bottom - mapScrollData.top
						};
						
						socket.emit('UPDATE_OBJECTS', {screenPosition : sp});
					}, 1000/30);
					
					$(mapId).css('width', map.size.width + 'px').css('height', map.size.height + 'px');
					$(canvasMapId).attr('width', map.size.width).attr('height', map.size.height);

					this.bindKeyboardAction();
				}
				catch(err)
				{
					console.error(err.stack);
				}
			}.bind(this));
			
			
			//어쨋든 캐릭터의 이동에 따라서 보이지 않게 되는 element들도 있을것이다.
			//그런 애들은 어떻게 처리 할지...	
			socket.on('UPDATE_OBJECTS', function(objects)
			{
				try
				{
					var list = {};
					for(var i=0; i<objects.length; i++)
					{
						var zone = objects[i];
						for(var key in zone)
						{
							var object = zone[key];
							var props = object.property;
							var location = object.location;
							
							var x = new Number(location.position.x);
							var y = new Number(location.position.y);
							
							//만약 이미 그려진 오브젝트중에 없으면 element를 생성한다.
//							if(myCharacter._id == object._id)
							{
								var element = $('#' + object._id);
								
								if(element.length <= 0)
								{
									var template = '<div class="object"><div class="object-image"></div></div>';
									template = $(template);
									template.attr('id', object._id)
									.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0px)')
									.css('width', props.collisionSize.width + 'px')
									.css('height', props.collisionSize.height + 'px')
									.css('zIndex', y)
									.children('div')
									.css('background-image', 'url(/views/images/' + props.image + ')')
									.css('width', props.size.width + 'px')
									.css('height', props.size.height + 'px');
									
									$(mapId).append(template);
								}
								else
								{
									//만약 이미 그려진 오브젝트중에 있으면 그냥 좌표만 바꿔준다.
//									if(myCharacter._id == object._id && this.scrollScreen(object))
//									{
//										if(element.parent().get(0) != $(screenId).get(0))
//											$(screenId).prepend($('#' + object._id));
//										element.css('position', 'fixed').css('transform', 'translate3d(' + (x + mapScrollData.left) + 'px, ' + (y + mapScrollData.top) + 'px, 0px)').css('zIndex', y);
//									}
//									else
//									{
//										if(myCharacter._id == object._id && element.parent().get(0) == $(screenId).get(0))
//											$(mapId).append(element);
											
										element.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0px)').css('zIndex', y).css('position', 'absolute');
//									}
								}
							}
							
							
							//그린건 지워버린다.
							list[object._id] = object;
							delete drawedObjectList[object._id];
						}
					}
					
					//그리지 못하고 남아있는건 element를 지운다. 그럼 시야에서 사라진(파괴된) 오브젝트들이 모두 없어진다. hide는 나중에 생각.
					for(var key in drawedObjectList)
					{
						$('#' + drawedObjectList[key]._id).remove();
					}
					
					//그리고 새로운 리스트로 대체한다.
					drawedObjectList = list;
				}
				catch(err)
				{
					console.error(err.stack);
				}
				
			}.bind(this));
		});
	}.bind(this));
	
	this.loadImages = function(callback)
	{
		//캔버스에는 스킬 이펙트 같은걸 표현할거.
		//그 이미지들을 미리 로딩해두자.
		callback();
	};
	
	this.moveScreenOnMyCharacter = function()
	{
		var halfX = screenSize.width / 2;
		var halfY = screenSize.height / 2;
		
		//최초에는 맵과 스크린 모두 0,0으로 시작하므로
		//캐릭터 좌표가 스크린 크기보다 작으면 보이는것.
		if(myCharacter.location.position.x <= screenSize.width && myCharacter.location.position.y <= screenSize.height)
			return;
		
		var x = Math.abs(halfX - (myCharacter.location.position.x + myCharacter.property.collisionSize.width/2));
		var y = Math.abs(halfY - (myCharacter.location.position.y + myCharacter.property.collisionSize.height/2));
		
		if(map.size.width - x - screenSize.width >= 0)
			mapScrollData.left -= x;
		else
			mapScrollData.left -= map.size.width - x + screenSize.width;
		
		if(map.size.height - y - screenSize.height >= 0)
			mapScrollData.top -= y;
		else
			mapScrollData.top -= map.size.height - x + screenSize.height;
		
		$(mapId).css('left', mapScrollData.left + 'px').css('top', mapScrollData.top + 'px');
	};
	
	this.scrollScreen = function(object)
	{
		var left = new Number($('#scrollBoundary').css('left').replace('px', ''));
		var top = new Number($('#scrollBoundary').css('top').replace('px', ''));
		var right = new Number($('#scrollBoundary').css('width').replace('px', '')) + left;
		var bottom = new Number($('#scrollBoundary').css('height').replace('px', '')) + top;
		
		var xDiff = myCharacter.location.position.x - object.location.position.x;
		var yDiff = myCharacter.location.position.y - object.location.position.y;
		
		if(xDiff == 0 && yDiff == 0)
		{
			//움직이지 않은거
			return false;
		}
		
		var x = myCharacter.location.position.x + myCharacter.property.collisionSize.width/2 + mapScrollData.left;
		var y = myCharacter.location.position.y + myCharacter.property.collisionSize.height/2 + mapScrollData.top;
		
		var check = false;
		if(check = (xDiff > 0 && x <= left && mapScrollData.left <= 0)) //좌
		{
			//좌로 이동하면서 좌측 바운더리고 맵이 스크롤이 가능하면.
			mapScrollData.left += myCharacter.stat.moveSpeed;
		}
		else if(check = (xDiff < 0 && x >= right && map.size.width + mapScrollData.left - screenSize.width >= 0)) //우
		{
			//우로 이동하면서 우측 바운더리라면
			mapScrollData.left -= myCharacter.stat.moveSpeed;
		}
		else if(check = (yDiff > 0 && y <= top && mapScrollData.top <= 0)) //위
		{
			//위로 이동하면서 위쪽 바운더리라면
			mapScrollData.top += myCharacter.stat.moveSpeed;
		}
		else if(check = (yDiff < 0 && y >= bottom && map.size.height + mapScrollData.top - screenSize.height >= 0)) //아래
		{
			//아래로 이동하면서 아래쪽 바운더리라면
			mapScrollData.top -= myCharacter.stat.moveSpeed;
		}

		//맵의 한계라서 스크롤을 할 수 없는 경우도 있으니 체크.
		myCharacter = object;
		
		if(check)
		{
			$(mapId).css('left', mapScrollData.left + 'px').css('top', mapScrollData.top + 'px');
			return true;
		}
		
		//이 경우는 위에서 다시 그려야함 absolute로 움직이기 때문에.
		return false;
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