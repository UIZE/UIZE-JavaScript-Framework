/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Gradient.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Widgets.Slider.Gradient.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Slider.Gradient.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Gradient.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Slider.Gradient.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					orientation:'horizontal',
					size:_allSizes
				});
				this.addStateCombinationSamples ({
					orientation:'vertical',
					size:_allSizes
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Slider.Gradient.Widget
			}
		});
	}
});

