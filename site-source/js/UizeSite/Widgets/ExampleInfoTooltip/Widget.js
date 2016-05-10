/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.ExampleInfoTooltip.Widget Class
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
		The =UizeSite.Widgets.ExampleInfoTooltip.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.ExampleInfoTooltip.Widget= class...

			..............................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.ExampleInfoTooltip.VisualSampler
			..............................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.ExampleInfoTooltip.Widget',
	superclass:'Uize.Widgets.Tooltip.Widget',
	required:'UizeSite.Widgets.ExampleInfoTooltip.Css',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				cssModule:UizeSite.Widgets.ExampleInfoTooltip.Css
			}
		});
	}
});

