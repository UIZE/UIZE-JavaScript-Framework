/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorInfo.Widget Class
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
		The =Uize.Widgets.ColorInfo.Widget= class implements a basic widget for previewing a color value...

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorInfo.Widget= class...

			.................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorInfo.VisualSampler
			.................................................

		### In a Nutshell
			- link to examples
				- Color Sort by RGB Proximity
				- Color Gradient Tool
*/

Uize.module ({
	name:'Uize.Widgets.ColorInfo.Widget',
	superclass:'Uize.Widgets.BoxWithHeading.Widget',
	required:[
		'Uize.Color',
		'Uize.Widgets.ColorInfo.Html',
		'Uize.Widgets.ColorInfo.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_value:{
					name:'value',
					value:'#000000',
					onChange:function () {this.set ({_valueAsHexRgb:Uize.Color.to (this.get ('value'),'#hex')})}
					/*?
						State Properties
							value
								A value of any type and format supported by the =Uize.Color= module, specifying the current color for which the widget should display information.

								Basically, color values can be specified for this property in any way that a color can be specified when using the single parameter variations of the =Uize.Color= constructor.

								NOTES
								- the initial value is ='#000000'=
					*/
				},
				_valueAsHexRgb:{name:'valueAsHexRgb'}
			},

			set:{
				html:Uize.Widgets.ColorInfo.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorInfo.Css
			},

			htmlBindings:{
				valueAsHexRgb:[
					'heading:html',
					'swatch:style.backgroundColor',
					'asBackground:style.backgroundColor',
					'asForeground:style.color'
					/*?
						DOM Nodes
							heading DOM Node
								.

							swatch
								.

							asBackground
								.

							asForeground
								.
					*/
				]
			}
		});
	}
});

