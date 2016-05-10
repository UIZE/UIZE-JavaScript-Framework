/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Calendar.Widget Class
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
		The =Uize.Widgets.Calendar.Widget= class implements a very basic widget for a box layout with a heading.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Calendar.Widget= class...

			................................................
			<< widget >>

			widgetClass: Uize.Widgets.Calendar.VisualSampler
			................................................
*/

Uize.module ({
	name:'Uize.Widgets.Calendar.Widget',
	superclass:'Uize.Widget.Calendar',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.Calendar.Html',
		'Uize.Widgets.Calendar.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			set:{
				dayNameLength:2,
				html:Uize.Widgets.Calendar.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Calendar.Css,
				buttonWidgetClass:Uize.Widgets.Button.Widget,
				useV2CssClasses:true
			}
		});
	}
});

