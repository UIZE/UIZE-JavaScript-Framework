/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.AnotherTestWidget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Widgets.AnotherTestWidget= class implements a test widget being used during development of the new =Uize.WidgetV2= widget base class to test this class' functionality.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.AnotherTestWidget',
	superclass:'Uize.WidgetV2',
	required:[
		'Uize.Widgets.AnotherTestWidgetHtml',
		'Uize.Widgets.AnotherTestWidgetCss'
	],
	builder:function (_superclass) {
		'use strict';

		var _class = _superclass.subclass ({
			set:{
				html:Uize.Widgets.AnotherTestWidgetHtml
			},

			staticProperties:{
				cssModule:Uize.Widgets.AnotherTestWidgetCss
			}
		});

		return _class;
	}
});

