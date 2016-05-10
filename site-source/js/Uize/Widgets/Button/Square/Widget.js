/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Square.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
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

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Button.Square.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Button.Square.VisualSampler
			.....................................................
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

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Button.Square.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Button.Square.Css
			}
		});
	}
});

