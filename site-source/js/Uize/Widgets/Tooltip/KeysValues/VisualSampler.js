/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tooltip.KeysValues.VisualSampler Class
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Tooltip.KeysValues.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Tooltip.KeysValues.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Tooltip.KeysValues.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'Uize.Widgets.Tooltip.KeysValues.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addSample ({
					heading:'NUTRITIONAL INFO: Apple',
					data:{
						'calories':'160 kcal',
						'total fat':'14.66 g',
						'saturated fat':'2.126 g',
						'cholesterol':'0 mg',
						'sodium':'7 mg',
						'total carbs':'8.53 g',
						'dietary fiber':'6.7 g',
						'sugars':'.66 g',
						'protein':'2 g',
						'calcium':'12 mg',
						'potassium':'485 mg'
					}
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Tooltip.KeysValues.Widget
			}
		});
	}
});

