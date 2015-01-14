/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Reset.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Widgets.Buttons.Reset.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Buttons.Reset.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Reset.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Buttons.Reset.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					locale:Uize.Widgets.StateValues.locale
				});
				this.addStateCombinationSamples ({
					flavor:['normal','negative','positive','primary']
				});
				this.addStateCombinationSamples ({
					size:Uize.Widgets.StateValues.size
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Buttons.Reset.Widget
			}
		});
	}
});

