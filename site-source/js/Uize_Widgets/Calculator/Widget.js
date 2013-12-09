/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Calculator.Widget Class
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
		The =Uize.Widgets.Calculator.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Calculator.Widget= class...

			..................................................
			<< widget >>

			widgetClass: Uize.Widgets.Calculator.VisualSampler
			..................................................
*/

Uize.module ({
	name:'Uize.Widgets.Calculator.Widget',
	superclass:'Uize.Widget.CalculatorAbstract',
	required:[
		'Uize.Widget.V2Mixin',
		'Uize.Widgets.Buttons.Char.Widget',
		'Uize.Widgets.Calculator.Html',
		'Uize.Widgets.Calculator.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return Uize.Widget.V2Mixin (_superclass.subclass ()).declare ({
			set:{
				html:Uize.Widgets.Calculator.Html
			},

			stateProperties:{
				_size:{
					name:'size',
					value:'medium'
				}
			},

			staticProperties:{
				buttonWidgetClass:Uize.Widgets.Buttons.Char.Widget,
				cssModule:Uize.Widgets.Calculator.Css
			},

			cssBindings:{
				size:'value'
			}
		});
	}
});

