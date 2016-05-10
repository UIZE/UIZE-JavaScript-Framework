/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RgbSliders.Widget Class
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
		The =Uize.Widgets.RgbSliders.Widget= class implements an RGB color picker interface, with sliders for adjusting levels for the red, green, and blue channels.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.RgbSliders.Widget= class...

			..................................................
			<< widget >>

			widgetClass: Uize.Widgets.RgbSliders.VisualSampler
			..................................................
*/

Uize.module ({
	name:'Uize.Widgets.RgbSliders.Widget',
	superclass:'Uize.Widgets.ColorSliders.Vert.Rgb.Widget',
	required:[
		'Uize.Widgets.RgbSliders.Html',
		'Uize.Widgets.RgbSliders.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				/*** derived properties ***/
					_valueAsHexRgb:{
						name:'valueAsHexRgb',
						derived:'value: "#" + value'
					}
			},

			set:{
				html:Uize.Widgets.RgbSliders.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.RgbSliders.Css
			},

			htmlBindings:{
				valueAsHexRgb:['swatch:html','swatch:style.background']
			}
		});
	}
});

