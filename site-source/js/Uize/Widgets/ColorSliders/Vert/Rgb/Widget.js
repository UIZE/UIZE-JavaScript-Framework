/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSliders.Vert.Rgb.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =Uize.Widgets.ColorSliders.Vert.Rgb.Widget= class implements an RGB color picker interface, with sliders for adjusting levels for the red, green, and blue channels.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorSliders.Vert.Rgb.Widget= class...

			.............................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorSliders.Vert.Rgb.VisualSampler
			.............................................................
*/

Uize.module ({
	name:'Uize.Widgets.ColorSliders.Vert.Rgb.Widget',
	superclass:'Uize.Widgets.ColorSliders.Vert.Widget',
	required:'Uize.Widgets.Slider.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			children:{
				channel0:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:0,
					maxValue:255,
					fullColor:'#f00'
				},
				channel1:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:0,
					maxValue:255,
					fullColor:'#0f0'
				},
				channel2:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:0,
					maxValue:255,
					fullColor:'#00f'
				}
			},

			staticProperties:{
				colorEncoding:'hex'
			}
		});
	}
});

