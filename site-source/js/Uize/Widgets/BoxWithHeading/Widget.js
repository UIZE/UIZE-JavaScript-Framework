/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.BoxWithHeading.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.BoxWithHeading.Widget= class implements a very basic widget for a box layout with a heading.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.BoxWithHeading.Widget= class...

			......................................................
			<< widget >>

			widgetClass: Uize.Widgets.BoxWithHeading.VisualSampler
			......................................................
*/

Uize.module ({
	name:'Uize.Widgets.BoxWithHeading.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.BoxWithHeading.Html',
		'Uize.Widgets.BoxWithHeading.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.BoxWithHeading.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.BoxWithHeading.Css
			}
		});
	}
});

