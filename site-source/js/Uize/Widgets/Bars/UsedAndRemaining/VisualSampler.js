/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bars.UsedAndRemaining.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Widgets.Bars.UsedAndRemaining.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Bars.UsedAndRemaining.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Bars.UsedAndRemaining.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'Uize.Widgets.Bars.UsedAndRemaining.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					usedText:'<%. used %> chars used',
					remainingText:'<%. remaining %> chars remaining',
					used:[0,50,100,150,200,250],
					size:'small',
					maxValue:200
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Bars.UsedAndRemaining.Widget
			}
		});
	}
});

