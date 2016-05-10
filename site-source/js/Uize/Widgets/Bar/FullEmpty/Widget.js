/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bar.FullEmpty.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 25
*/

/*?
	Introduction
		The =Uize.Widgets.Bar.FullEmpty.Widget= class implements a widget for displaying numerical values using a bar, with full and empty indicators and an optional value knob.

		*DEVELOPERS:* `Chris van Rensburg`

		This module supports both horizontally and vertically oriented bars.

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Bar.FullEmpty.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Bar.FullEmpty.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Bar.FullEmpty.Widget',
	superclass:'Uize.Widgets.Bar.Widget',
	required:[
		'Uize.Widgets.Bar.FullEmpty.mFullEmpty',
		'Uize.Widgets.Bar.FullEmpty.Html',
		'Uize.Widgets.Bar.FullEmpty.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widgets.Bar.FullEmpty.mFullEmpty,

			set:{
				html:Uize.Widgets.Bar.FullEmpty.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Bar.FullEmpty.Css
			}
		});
	}
});

