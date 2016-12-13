var server_socket = io.connect();

var myun = {}; 

var mapId = '#map';
var screenId = '#screen';
var canvasMapId = '#canvas';

//3. 맵의 오브젝트(내 캐릭터 포함)를 그린다.

(function()
{
	var FPS = 30;
	
	var images = [];
	
	var myCharacter = null;
	var map = null;
	
	var mapScrollData = {left: 0, top: 0};
	var screenSize = {};
	var screenPosition = {left: 0, right: 0, top: 0, bottom: 0};
	
	var keyHolded = false;
	var keyHoldInterval = null;
	
	var chatting = false;
	
	//접속하면 소켓이 생성된다.
	server_socket.on('CONNECTED', function(data)
	{
		this.loadImages(function()
		{
			map = data.map;
			myCharacter = data.character;
			
			$(document).ready(function()
			{
				try
				{
					this.setScreenSize();
					this.moveScreenOnMyCharacter();
					
					setInterval(function()
					{
						var sp = {
							left : -mapScrollData.left,
							right : screenPosition.right - mapScrollData.left,
							top : -mapScrollData.top,
							bottom: screenPosition.bottom - mapScrollData.top
						};
						
						if(keyHolded)
							server_socket.emit('MOVE_CHARACTER', keyHolded);
						server_socket.emit('UPDATE_OBJECTS', {screenPosition : sp});
					}, 1000/FPS);
					
					$(mapId).css('width', map.size.width + 'px').css('height', map.size.height + 'px');
					$(canvasMapId).attr('width', screenSize.width).attr('height', screenSize.height);

//					this.bindKeyboardAction();
				}
				catch(err)
				{
					console.error(err.stack);
				}
			}.bind(this));
			
			$(window).resize(function()
			{
				this.setScreenSize();
				this.moveScreenOnMyCharacter();
			}.bind(this));
			
			
			//어쨋든 캐릭터의 이동에 따라서 보이지 않게 되는 element들도 있을것이다.
			//그런 애들은 어떻게 처리 할지...	
			server_socket.on('UPDATE_OBJECTS', function(objects)
			{
				try
				{
					var maxY = 0;
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
							
							if(maxY < y)
								maxY = y;
							
							var element = $('#' + object._id);
							//현재 시야에서 보이면
							if(x + props.size.width * 2 + mapScrollData.left >= 0 && y + props.size.height * 2 + mapScrollData.top >= 0 && x - props.size.width + mapScrollData.left <= screenSize.width && y - props.size.height + mapScrollData.top <= screenSize.height)
							{
								//만약 이미 그려진 오브젝트중에 없으면 element를 생성한다.
								if(element.length <= 0)
								{
									var template = '<div class="object"></span><div class="object-image"><span class="object-name"></div></div>';
									template = $(template);
									template.attr('id', object._id)
									.css('width', props.collisionSize.width + 'px')
									.css('height', props.collisionSize.height + 'px')
									.css('zIndex', y)
									.children('div')
									.css('background-image', 'url(/views/images/' + props.image + ')')
									.css('width', props.size.width + 'px')
									.css('height', props.size.height + 'px')
									.children('span').text(object.name);
									
									if(props.movable)
										template.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0px)').attr('data-movable', true);
									else
										template.css('left', x + 'px').css('top', y + 'px');
									
									$(mapId).append(template);

									var spanWidth = new Number(template.find('span').css('width').replace('px', ''));
									var spanHeight = new Number(template.find('span').css('height').replace('px', ''));
									template.find('span').css('left', props.size.width/2 - spanWidth/2);
									template.find('span').css('top', - spanHeight - 3 + 'px');
								}
								else
								{
									if(myCharacter._id == object._id)
									{
										element.css('cursor', 'default');
										this.scrollScreen(object);
									}
									
									//만약 이미 그려진 오브젝트중에 있으면 그냥 좌표만 바꿔준다.
									if(props.movable && (location.prevPosition.x != x || location.prevPosition.y != y))
									{
										element.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0px)').css('zIndex', y);
									}
								}
							}
							else if(element.length > 0)
							{
								//안보이면
								element.remove();
							}
						}
					}
					
					//시야에서 사라진 오브젝트를 전부 삭제하자.
					
					$(canvasMapId).css('zIndex', maxY);
				}
				catch(err)
				{
					console.error(err.stack);
				}
				
			}.bind(this));
			
			server_socket.on('CHAT_MESSAGE', function(message)
			{
				$('#chatList').append('<p>' + message + '</p>');
				$('#chatList').get(0).scrollTop = $('#chatList').get(0).scrollHeight;
			});
		});
	}.bind(this));
	
	this.loadImages = function(callback)
	{
		//캔버스에는 스킬 이펙트 같은걸 표현할거.
		//그 이미지들을 미리 로딩해두자.
		
		images[0] = new Image();;
		images[0].src = '/views/images/skill/skill1.png';
		images[0].onload = function()
		{
			callback();
		};
	};
	
	this.setScreenSize = function()
	{
		screenSize.width = new Number($(screenId).css('width').replace('px', ''));
		screenSize.height = new Number($(screenId).css('height').replace('px', ''));
		screenPosition.right = screenSize.width;
		screenPosition.bottom = screenSize.height;
	};
	
	this.moveScreenOnMyCharacter = function()
	{
		var halfX = screenSize.width / 2;
		var halfY = screenSize.height / 2;
		
		//최초에는 맵과 스크린 모두 0,0으로 시작하므로
		//캐릭터 좌표가 스크린 크기보다 작으면 보이는것.
		//최초하고 브라우저 사이즈 변경시에 초기화 할거라서 0으로 넣어줌.
		mapScrollData.left = 0;
		mapScrollData.top = 0;
		
		if(myCharacter.location.position.x + myCharacter.property.collisionSize.width <= screenSize.width && myCharacter.location.position.y + myCharacter.property.collisionSize.height <= screenSize.height)
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
		
		$(mapId).css('transform', 'translate3d(' + mapScrollData.left + 'px, ' + mapScrollData.top + 'px, 0px)');
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
		myCharacter.location = object.location;
		
		$(mapId).css('transform', 'translate3d(' + mapScrollData.left + 'px, ' + mapScrollData.top + 'px, 0px)');
		
		return true;
	};
	
//	this.bindKeyboardAction = function()
//	{
//		$(window).on('keydown', function(e)
//		{
//			if(!chatting)
//			{
//				var direction = _KeyCode.isMoving(e);
//				
//				if(direction)
//				{
//					keyHolded = direction;
//				}
//				else
//				{
//					switch(_KeyCode[e.keyCode])
//					{
//						case 'enter':
//							$('#chatInput').focus();
//							chatting = true;
//							break;
//						case '1':
//							var fireball = '<div class="fireball"><div></div></div>';
//							fireball = $(fireball);
//							
//							fireball.css('transform', 'translate3d(' + myCharacter.location.position.x + 'px, ' + myCharacter.location.position.y + 'px, 0)');
//							
//							fireball.on('transitionend', function(){
//								$(this).remove();
//							});
//							$(mapId).append(fireball);
//							setTimeout(function(){
//								$(fireball).css('transform', 'translate3d(600px, 100px, 0px)');
//							}, 100);
//							break;
//					}
//				}
//			}
//		});
//	};
	
	$(window).on('keyup', function(e)
	{
		if(_KeyCode.isMoving(e) == keyHolded)
		{
			keyHolded = null;
		}
	});
	
	$(window).on('blur', function(e)
	{
		keyHolded = null;
	});
	
	$(window).on('mousemove', function(e)
	{
		if(e.buttons == 1)
		{
			var x = null;
			var y = null;
			
			if(e.target.className.indexOf('object') != -1)
			{
				x = $(e.target.parentElement).css('left').replace('px', '');
				y = $(e.target.parentElement).css('top').replace('px', '');
				
				if(x != null && y != null)
				{
					
				}
//				x = e.target.parentElement.style.x;
//				y = e.target.parentElement.style.y;
			}
			else if(e.target.className.indexOf('map') != -1)
			{
				x = e.clientX + mapScrollData.left;
				y = e.clientY + mapScrollData.top;
			}
			
			
			console.log(x, y);
				
			//타겟이 오브젝트면 오브젝트의 x, y값을, 맵이면 clientX로 screen좌표로 바꾼다음.
			// 화면에 X를 기준으로 상하좌우 이동을 결정한다.
			// x값의 차이보다 y값의 차이가 더 크다면 상하, 반대면 좌우. -값이면 좌 뭐 이런식으로 판단하면 될듯.
			
			//무빙 이후 기본공격도 여기다 매핑하면 될듯.
		}
		else if(e.buttons == 0)
		{
			//무빙 멈춤.
		}
	});
	
//	$(window).on('mousedown', function(e)
//	{
//		console.log("타겟 : ", e.target);
//		if(_Skill.attack(myCharacter, e.target))
//		{
//			//공격이 성공해야 이후 공격이 자동으로 진행된다.
//			myCharacter.clickTimer = setInterval(function()
//			{
//				if(!_Skill.attack(myCharacter, e.target))
//				{
//					//공격이 실패하면 바로 종료.
//					clearInterval(myCharacter.clickTimer);
//					myCharacter.clickTimer = null;
//				}
//			}, 1000 * myCharacter.stat.attackSpeed);
//		}
//		else
//		{
//			//공격이 아니면 무조건 무빙이다.
//			//타겟이 오브젝트면 오브젝트의 x, y값을, 맵이면 clientX로 screen좌표로 바꾼다음.
//			// 화면에 X를 기준으로 상하좌우 이동을 결정한다.
//			// x값의 차이보다 y값의 차이가 더 크다면 상하, 반대면 좌우. -값이면 좌 뭐 이런식으로 판단하면 될듯.
//		}
//	});
//
//	$(window).on('mouseup', function(e)
//	{
//		//interval을 종료한다. 공격 or 무빙
//		if(myCharacter.clickTimer)
//		{
//			clearInterval(myCharacter.clickTimer);
//			myCharacter.clickTimer = null;
//		}
//	});
	
	$(mapId).on('dblclick', function(e)
	{
		e.preventDefault();
		e.stopPropagation();
	});
	
	$('#chatInput').on('keydown', function(e)
	{
		if(e.keyCode == 13)
		{
			//send
			server_socket.emit('CHAT_MESSAGE', $(this).val());
			
			$(this).val('').blur();
			
			chatting = false;
			
			e.preventDefault();
			e.stopPropagation();
		}
	});
	
	$('#chatInput').on('focus', function()
	{
		chatting = true;
	});
})();