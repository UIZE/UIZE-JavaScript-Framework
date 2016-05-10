/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Calculator.Entry.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Calculator.Entry.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Calculator.Entry.Widget= class...

			........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Calculator.Entry.VisualSampler
			........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Calculator.Entry.Widget',
	superclass:'Uize.Widget.TextInputBasic',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.Calculator.Entry.Html',
		'Uize.Widgets.Calculator.Entry.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			set:{
				html:Uize.Widgets.Calculator.Entry.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Calculator.Entry.Css
			}
		});
	}
});

