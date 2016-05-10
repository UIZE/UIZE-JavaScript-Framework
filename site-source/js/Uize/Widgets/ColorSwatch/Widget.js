/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSwatch.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		The =Uize.Widgets.ColorSwatch.Widget= class implements a basic widget for previewing a color value...

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorSwatch.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorSwatch.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.ColorSwatch.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Color',
		'Uize.Widgets.ColorSwatch.Html',
		'Uize.Widgets.ColorSwatch.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_value:{
					name:'value',
					value:'#000000'
					/*?
						State Properties
							value
								A value of any type and format supported by the =Uize.Color= module, specifying the current color for which the widget should display information.

								Basically, color values can be specified for this property in any way that a color can be specified when using the single parameter variations of the =Uize.Color= constructor.

								NOTES
								- the initial value is ='#000000'=
					*/
				},
				_valueAsHexRgb:{
					name:'valueAsHexRgb',
					derived:'value: Uize.Color.to (value,"#hex")'
				}
			},

			set:{
				html:Uize.Widgets.ColorSwatch.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorSwatch.Css
			},

			htmlBindings:{
				valueAsHexRgb:':style.backgroundColor'
			}
		});
	}
});

