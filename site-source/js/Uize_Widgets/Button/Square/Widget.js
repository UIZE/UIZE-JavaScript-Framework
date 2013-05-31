/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Square.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widgets.Button.Square.Widget= class implements a simple on/off toggler button widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Button.Square.Widget',
	superclass:'Uize.Widgets.Button.Widget',
	required:[
		'Uize.Widgets.Button.Square.Html',
		'Uize.Widgets.Button.Square.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var _directionNames = [
			['upLeft','up','upRight'],
			['left','','right'],
			['downLeft','down','downRight']
		];

		function _deriveDirectionName () {
			var _this = this;
			_this.set ({_directionName:_directionNames [_this._directionY + 1] [_this._directionX + 1]});
		}

		var _class = _superclass.subclass ({
			set:{
				html:Uize.Widgets.Button.Square.Html
			},

			stateProperties:{
				_directionX:{
					name:'directionX',
					value:0,
					onChange:_deriveDirectionName
				},
				_directionY:{
					name:'directionY',
					value:0,
					onChange:_deriveDirectionName
				},
				_directionName:'directionName'
			},

			staticProperties:{
				cssModule:Uize.Widgets.Button.Square.Css,
				directionNames:_directionNames
			},

			stateToCssBindings:{
				directionName:'value'
			}
		});

		return _class;
	}
});

