/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Foo.Widget Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Foo.Widget= module implements a widget class.

		*DEVELOPERS:* 

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Foo.Widget= class...

			....................................
			<< widget >>

			widgetClass: Uize.Widgets.Foo.Widget
			....................................
*/

Uize.module ({
	name:'Uize.Widgets.Foo.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Foo.Html',
		'Uize.Widgets.Foo.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Foo.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Foo.Css
			}
		});
	}
});

