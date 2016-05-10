/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.ColorSwatch.Widget Class
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
		The =Uize.Widgets.Buttons.ColorSwatch.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.ColorSwatch.Widget= class...

			...........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.ColorSwatch.VisualSampler
			...........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.ColorSwatch.Widget',
	superclass:'Uize.Widgets.Button.Square.Widget',
	required:[
		'Uize.Widgets.Buttons.ColorSwatch.Html',
		'Uize.Widgets.Buttons.ColorSwatch.Css',
		'Uize.Color'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Buttons.ColorSwatch.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Buttons.ColorSwatch.Css
			},

			stateProperties:{
				value:{value:'000'},

				/*** derived properties ***/
					valueAsRgbHex:{
						derived:'value: Uize.Color.from (value).to ("#hex")'
					}
			},

			htmlBindings:{
				valueAsRgbHex:'swatch:style.backgroundColor'
			}
		});
	}
});

