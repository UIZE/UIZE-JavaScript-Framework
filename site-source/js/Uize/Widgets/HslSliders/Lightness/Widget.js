/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.HslSliders.Lightness.Widget Class
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
		The =Uize.Widgets.HslSliders.Lightness.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.HslSliders.Lightness.Widget= class...

			..................................................................
			<< widget >>

			widgetClass: Uize.Widgets.HslSliders.Lightness.VisualSampler
			..................................................................
*/

Uize.module ({
	name:'Uize.Widgets.HslSliders.Lightness.Widget',
	superclass:'Uize.Widgets.Slider.Gradient.Widget',
	required:'Uize.Color',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				hue:{value:0},
				saturation:{value:100},

				/*** derived properties ***/
					knobColor:{
						derived:'hue, saturation, value: Uize.Color.from ({hue:hue,saturation:saturation,lightness:value}).to ("#hex")'
					},
					gradient:{
						derived:'hue, saturation: "#000, " + Uize.Color.from ({hue:hue,saturation:saturation,lightness:50}).to ("#hex") + ", #fff"'
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

