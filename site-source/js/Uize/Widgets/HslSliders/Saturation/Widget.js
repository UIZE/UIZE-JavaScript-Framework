/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.HslSliders.Saturation.Widget Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.HslSliders.Saturation.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.HslSliders.Saturation.Widget= class...

			...................................................................
			<< widget >>

			widgetClass: Uize.Widgets.HslSliders.Saturation.VisualSampler
			...................................................................
*/

Uize.module ({
	name:'Uize.Widgets.HslSliders.Saturation.Widget',
	superclass:'Uize.Widgets.Slider.Gradient.Widget',
	required:'Uize.Color',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				hue:{value:0},

				/*** derived properties ***/
					knobColor:{
						derived:'hue, value: Uize.Color.from ({hue:hue,saturation:value,lightness:50}).to ("#hex")'
					},
					gradient:{
						derived:'hue: "#808080, " + Uize.Color.from ({hue:hue,saturation:100,lightness:50}).to ("#hex")'
					}
			},

			set:{
				increments:1,
				minValue:0,
				maxValue:100
			}
		});
	}
});

