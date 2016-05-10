/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SimpleStatsTable.Sortable.VisualSampler Class
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
		The =Uize.Widgets.SimpleStatsTable.Sortable.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.SimpleStatsTable.Sortable.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SimpleStatsTable.Sortable.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.SimpleStatsTable.Sortable.Widget',
		'Uize.Widgets.SimpleStatsTable.TestsData'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addSample (Uize.Widgets.SimpleStatsTable.TestsData);
			},

			set:{
				samplerWidgetClass:Uize.Widgets.SimpleStatsTable.Sortable.Widget
			}
		});
	}
});

