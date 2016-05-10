/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SimpleStatsTable.Widget Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.SimpleStatsTable.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.SimpleStatsTable.Widget= class...

			........................................................
			<< widget >>

			widgetClass: Uize.Widgets.SimpleStatsTable.VisualSampler
			........................................................
*/

Uize.module ({
	name:'Uize.Widgets.SimpleStatsTable.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.SimpleStatsTable.Html',
		'Uize.Widgets.SimpleStatsTable.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.SimpleStatsTable.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.SimpleStatsTable.Css
			}
		});
	}
});

