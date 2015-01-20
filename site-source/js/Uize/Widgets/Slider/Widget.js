/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		The =Uize.Widgets.Slider.Widget= class implements a slider widget that supports several standard sizes and horizontal and vertical orientations.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Slider.Widget= class...

			..............................................
			<< widget >>

			widgetClass: Uize.Widgets.Slider.VisualSampler
			..............................................
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Widget',
	superclass:'Uize.Widgets.Slider.Base.Widget',
	required:[
		'Uize.Widgets.Slider.Html',
		'Uize.Widgets.Slider.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_emptyColor:{
					name:'emptyColor',
					value:'#fff'
				},
				_fullColor:{
					name:'fullColor',
					value:'#fff'
				}
			},

			set:{
				html:Uize.Widgets.Slider.Html
			},

			htmlBindings:{
				emptyColor:'empty:style.backgroundColor',
				fullColor:'full:style.backgroundColor'
			},

			staticProperties:{
				cssModule:Uize.Widgets.Slider.Css
			}
		});
	}
});

