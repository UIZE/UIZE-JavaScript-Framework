/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tools.JsonSerializer.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Widgets.Tools.JsonSerializer.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Tools.JsonSerializer.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Tools.JsonSerializer.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Tools.JsonSerializer.Widget',
		'Uize.Widgets.Tools.JsonSerializer.TestData',
		'Uize.Json'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateTestCase ({
					source:Uize.Json.to (Uize.Widgets.Tools.JsonSerializer.TestData ())
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Tools.JsonSerializer.Widget
			}
		});
	}
});

