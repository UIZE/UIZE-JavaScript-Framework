/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.AnotherTestWidget.Subclass.Widget Class
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
		The =Uize.Widgets.AnotherTestWidget.Subclass.Widget= class implements a test widget being used during development of the new =Uize.WidgetV2= widget base class to test this class' functionality.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.AnotherTestWidget.Subclass.Widget',
	superclass:'Uize.Widgets.AnotherTestWidget.Widget',
	required:[
		'Uize.Widgets.AnotherTestWidget.Subclass.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var _class = _superclass.subclass ({
			staticProperties:{
				cssModule:Uize.Widgets.AnotherTestWidget.Subclass.Css
			}
		});

		return _class;
	}
});

