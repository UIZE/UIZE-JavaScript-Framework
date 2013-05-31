/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Square.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Widgets.Button.Square.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Button.Square.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Button.Square.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Button.Square.Widget',
		'Uize.Widgets.CssUtil'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					flavor:['normal','positive','negative','primary'],
					size:Uize.keys (Uize.Widgets.CssUtil.sizes)
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Button.Square.Widget
			}
		});
	}
});

