/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSliders.Vert.Hsl.Widget Class
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
		The =Uize.Widgets.ColorSliders.Vert.Hsl.Widget= class implements an HSL color picker interface, with sliders for adjusting levels for the hue, saturation, and lightness channels.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorSliders.Vert.Hsl.Widget= class...

			.............................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorSliders.Vert.Hsl.VisualSampler
			.............................................................
*/

Uize.module ({
	name:'Uize.Widgets.ColorSliders.Vert.Hsl.Widget',
	superclass:'Uize.Widgets.ColorSliders.Vert.Widget',
	required:[
		'Uize.Widgets.HslSliders.Hue.Widget',
		'Uize.Widgets.HslSliders.Saturation.Widget',
		'Uize.Widgets.HslSliders.Lightness.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			children:{
				channel0:{
					widgetClass:Uize.Widgets.HslSliders.Hue.Widget,
					minValue:0,
					maxValue:360
				},
				channel1:{
					widgetClass:Uize.Widgets.HslSliders.Saturation.Widget,
					minValue:0,
					maxValue:100
				},
				channel2:{
					widgetClass:Uize.Widgets.HslSliders.Lightness.Widget,
					minValue:0,
					maxValue:100
				}
			},

			staticProperties:{
				colorEncoding:'HSL string'
			},

			stateProperties:{
				/*** derived state properties ***/
					hue:{
						derived:'value: Uize.Color.from (value).tuple [0]'
					},
					saturation:{
						derived:'value: Uize.Color.from (value).tuple [1]'
					}
			},

			childBindings:{
				hue:[
					'channel1.hue',
					'channel2.hue'
				],
				saturation:'channel2.saturation'
			}
		});
	}
});

