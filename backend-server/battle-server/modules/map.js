//일단 이동불가하고 이동가능만 표시.
//20x20

const ROW = 20;
const COLUMN = 20;

var logic = {};
logic.row = ROW;
logic.column = COLUMN;
(function()
{
	//맵 번호를 받아와서 디비 조회를 통해 맵을 만들어주자.
	this.createMap = function()
	{
		var map = [];
		for(var i=0; i<ROW; i++)
		{
			map.push([]);
			for(var j=0; j<COLUMN; j++)
			{
				map[i].push(0);
			}
		}
		
		return map;
	};
	
}).call(logic);

module.exports = logic;