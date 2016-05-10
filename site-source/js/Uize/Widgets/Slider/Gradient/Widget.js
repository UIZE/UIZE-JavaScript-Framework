/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Gradient.Widget Class
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
		The =Uize.Widgets.Slider.Gradient.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Slider.Gradient.Widget= class...

			.......................................................
			<< widget >>

			widgetClass: Uize.Widgets.Slider.Gradient.VisualSampler
			.......................................................
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Gradient.Widget',
	superclass:'Uize.Widgets.Slider.Base.Widget',
	required:[
		'Uize.Widgets.Slider.Gradient.Html',
		'Uize.Widgets.Slider.Gradient.Css',
		'Uize.Color'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Slider.Gradient.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Slider.Gradient.Css
			},

			stateProperties:{
				knobColor:{value:'000'},
				gradient:{value:'black, white'},

				/*** derived properties ***/
					knobColorAsRgbHex:{
						derived:'knobColor: Uize.Color.from (knobColor).to ("#hex")'
					},
					gradientAsBackGroundImage:{
						derived:'gradient, orientation: "linear-gradient(" + (orientation == "horizontal" ? "to right" : "to top") + ", " + gradient + ")"'
					}
			},

			htmlBindings:{
				knobColorAsRgbHex:'knobColor:style.backgroundColor',
				gradientAsBackGroundImage:'gradient:style.backgroundImage'
			}
		});
	}
});

