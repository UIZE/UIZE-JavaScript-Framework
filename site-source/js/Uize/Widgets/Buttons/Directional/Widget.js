/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Directional.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 8
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widgets.Buttons.Directional.Widget= class implements a directional arrow button that supports three different directions for each of the X and Y axes.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.Directional.Widget= class...

			...........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.Directional.VisualSampler
			...........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Directional.Widget',
	superclass:'Uize.Widgets.Button.Square.Widget',
	required:[
		'Uize.Widgets.Buttons.Directional.Html',
		'Uize.Widgets.Buttons.Directional.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var _directionNames = [
			['upLeft','up','upRight'],
			['left','center','right'],
			['downLeft','down','downRight']
		];

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Buttons.Directional.Html
			},

			stateProperties:{
				_directionX:{
					name:'directionX',
					value:0
				},
				_directionY:{
					name:'directionY',
					value:0
				},
				_directionName:{
					name:'directionName',
					derived:{
						properties:'directionX,directionY',
						derivation:function (_directionX,_directionY) {
							return _directionNames [_directionY + 1] [_directionX + 1];
						}
					}
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.Buttons.Directional.Css,
				directionNames:_directionNames
			},

			cssBindings:{
				directionName:'value'
			}
		});
	}
});

