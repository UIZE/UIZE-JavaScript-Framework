/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorInfo.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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

		function _updateUiValue () {
			var _this = this;
			if (_this.isWired) {
				var _colorAsHexRgb = Uize.Color.to (_this._value,'#hex');
				_this.setNodeValue ('heading',_colorAsHexRgb);
				_this.setNodeStyle (['swatch','asBackground'],{backgroundColor:_colorAsHexRgb});
				_this.setNodeStyle ('asForeground',{color:_colorAsHexRgb});
				/*?
					Implied Nodes
						value Implied Node
							.

						swatch
							.

						asBackground
							.

						asForeground
							.
				*/
			}
		}

		return _superclass.subclass ({
			instanceMethods:{
				updateUi:_updateUiValue
			},

			stateProperties:{
				_value:{
					name:'value',
					onChange:_updateUiValue,
					value:'#000000'
					/*?
						State Properties
							value
								A value of any type and format supported by the =Uize.Color= module, specifying the current color for which the widget should display information.

								Basically, color values can be specified for this property in any way that a color can be specified when using the single parameter variations of the =Uize.Color= constructor.

								NOTES
								- the initial value is ='#000000'=
					*/
				}
			},

			set:{
				html:Uize.Widgets.ColorInfo.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorInfo.Css
			}
		});
	}
});

