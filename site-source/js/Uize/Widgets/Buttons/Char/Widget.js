/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Char.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Buttons.Char.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.Char.Widget= class...

			....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.Char.VisualSampler
			....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Char.Widget',
	superclass:'Uize.Widgets.Button.Square.Widget',
	required:[
		'Uize.Widgets.Buttons.Char.Html',
		'Uize.Widgets.Buttons.Char.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Buttons.Char.Html
			},

			stateProperties:{
				_doubleChar:{
					name:'doubleChar',
					value:false
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.Buttons.Char.Css
			},

			cssBindings:{
				doubleChar:'value ? "doubleChar" : ""'
			}
		});
	}
});

