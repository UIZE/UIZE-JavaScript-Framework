/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.HslSliders.Widget Class
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
		The =Uize.Widgets.HslSliders.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.HslSliders.Widget= class...

			..................................................
			<< widget >>

			widgetClass: Uize.Widgets.HslSliders.VisualSampler
			..................................................
*/

Uize.module ({
	name:'Uize.Widgets.HslSliders.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.HslSliders.Html',
		'Uize.Widgets.HslSliders.Css',
		'Uize.Widgets.HslSliders.Hue.Widget',
		'Uize.Widgets.HslSliders.Saturation.Widget',
		'Uize.Widgets.HslSliders.Lightness.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				html:Uize.Widgets.HslSliders.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.HslSliders.Css
			},

			stateProperties:{
				hue:{value:0},
				saturation:{value:100},
				lightness:{value:50}
			},

			children:{
				hue:{
					widgetClass:Uize.Widgets.HslSliders.Hue.Widget
				},
				saturation:{
					widgetClass:Uize.Widgets.HslSliders.Saturation.Widget
				},
				lightness:{
					widgetClass:Uize.Widgets.HslSliders.Lightness.Widget
				}
			},

			childBindings:{
				hue:[
					'hue.value',
					'saturation.hue',
					'lightness.hue'
				],
				saturation:[
					'saturation.value',
					'lightness.saturation'
				],
				lightness:[
					'lightness.value'
				]
			},

			htmlBindings:{
				loc_hueLabel:'hueLabel',
				loc_saturationLabel:'saturationLabel',
				loc_lightnessLabel:'lightnessLabel'
			}
		});
	}
});

