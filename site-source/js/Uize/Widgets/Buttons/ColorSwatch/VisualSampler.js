/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.ColorSwatch.VisualSampler Class
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
		The =Uize.Widgets.Buttons.ColorSwatch.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Buttons.ColorSwatch.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.ColorSwatch.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Buttons.ColorSwatch.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					flavor:['normal','subdued'],
					size:Uize.Widgets.StateValues.size,
					value:'fc0'
				});
				this.addStateCombinationSamples ({
					value:[
						'red','green','blue','#f0f','#5f9ea0','#556b2f','#ffdead','#90ee90','#e99975','#000','#fff','#888'
					]
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Buttons.ColorSwatch.Widget
			}
		});
	}
});

