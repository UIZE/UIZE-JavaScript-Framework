/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.WidgetTestCase.Widget Class
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
		The =UizeSite.Widgets.WidgetTestCase.Widget= class implements a widget for a widget test case, to be used when building visual tests for widgets.
		
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Widgets.WidgetTestCase.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'UizeSite.Widgets.WidgetTestCase.Html',
		'UizeSite.Widgets.WidgetTestCase.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var _class = _superclass.subclass ({
			set:{
				html:UizeSite.Widgets.WidgetTestCase.Html
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.WidgetTestCase.Css
			}
		});

		return _class;
	}
});

