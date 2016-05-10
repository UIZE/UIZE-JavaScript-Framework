/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tooltip.Widget Class
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
		The =Uize.Widgets.Tooltip.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tooltip.Widget= class...

			...............................................
			<< widget >>

			widgetClass: Uize.Widgets.Tooltip.VisualSampler
			...............................................
*/

Uize.module ({
	name:'Uize.Widgets.Tooltip.Widget',
	superclass:'Uize.Widgets.BoxWithHeading.Widget',
	required:[
		'Uize.Widgets.Tooltip.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				cssModule:Uize.Widgets.Tooltip.Css
			},

			htmlBindings:{
				heading:['heading:html','heading:show'],
				body:['body:html','body:show']
			}
		});
	}
});

