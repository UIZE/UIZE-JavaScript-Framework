/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Square.Icon.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Button.Square.Icon.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Button.Square.Icon.Widget= class...

			..........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Button.Square.Icon.VisualSampler
			..........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Button.Square.Icon.Widget',
	superclass:'Uize.Widgets.Button.Square.Widget',
	required:[
		'Uize.Widgets.Button.Square.Icon.Html',
		'Uize.Widgets.Button.Square.Icon.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Button.Square.Icon.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Button.Square.Icon.Css
			}
		});
	}
});

