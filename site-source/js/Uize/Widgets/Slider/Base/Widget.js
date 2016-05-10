/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Base.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Slider.Base.Widget= class implements an abstract base class for slider widget classes.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Slider.Base.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.Slider.Base.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Base.Widget',
	superclass:'Uize.Widgets.Bar.Widget',
	required:[
		'Uize.Widget.Bar.mSlider',
		'Uize.Widgets.Slider.Base.Html',
		'Uize.Widgets.Slider.Base.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.Bar.mSlider,

			set:{
				html:Uize.Widgets.Slider.Base.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Slider.Base.Css
			},

			stateProperties:{
				/*** derived properties ***/
					knobStyleLeft:{
						derived:'orientation,valuePosPercent: orientation == "horizontal" ? valuePosPercent + "%" : 0'
					},
					knobStyleBottom:{
						derived:'orientation,valuePosPercent: orientation == "vertical" ? valuePosPercent + "%" : 0'
					}
			},

			htmlBindings:{
				knobStyleLeft:'knob:style.left',
				knobStyleBottom:'knob:style.bottom'
			}
		});
	}
});

