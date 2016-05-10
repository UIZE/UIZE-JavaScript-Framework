/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SimpleStatsTable.Sortable.Widget Class
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
		The =Uize.Widgets.SimpleStatsTable.Sortable.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.SimpleStatsTable.Sortable.Widget= class...

			.................................................................
			<< widget >>

			widgetClass: Uize.Widgets.SimpleStatsTable.Sortable.VisualSampler
			.................................................................
*/

Uize.module ({
	name:'Uize.Widgets.SimpleStatsTable.Sortable.Widget',
	superclass:'Uize.Widgets.SimpleStatsTable.Widget',
	required:[
		'Uize.Widget.TableSort',
		'Uize.Widgets.SimpleStatsTable.Sortable.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				m.addChild (
					'tableSorter',
					Uize.Widget.TableSort,
					{
						idPrefixConstruction:'same as parent',
						headingOverClass:m.cssClass ('headingOver'),
						headingLitClass:m.cssClass ('headingSelected'),
						rowOverClass:m.cssClass ('rowOver')
					}
				);
			},

			staticProperties:{
				cssModule:Uize.Widgets.SimpleStatsTable.Sortable.Css
			}
		});
	}
});

