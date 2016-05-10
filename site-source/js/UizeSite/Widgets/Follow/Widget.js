/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.Follow.Widget Class
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
		The =UizeSite.Widgets.Follow.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.Follow.Widget= class...

			..................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.Follow.VisualSampler
			..................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.Follow.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'UizeSite.Widgets.Follow.Html',
		'UizeSite.Widgets.Follow.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:UizeSite.Widgets.Follow.Html
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.Follow.Css
			}
		});
	}
});

