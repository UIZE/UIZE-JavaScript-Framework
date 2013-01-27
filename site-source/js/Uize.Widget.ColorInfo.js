/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ColorInfo Class
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
		The =Uize.Widget.ColorInfo= class implements a basic widget for previewing a color value...

		*DEVELOPERS:* `Chris van Rensburg`

		### In a Nutshell
			- link to examples
				- Color Sort by RGB Proximity
				- Color Gradient Tool
*/

Uize.module ({
	name:'Uize.Widget.ColorInfo',
	required:[
		'Uize.Color',
		'Uize.Templates.ColorInfo'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiValue = function () {
				var _this = this;
				if (_this.isWired) {
					var _colorAsHexRgb = Uize.Color.to (_this._value,'#hex');
					_this.setNodeValue ('value',_colorAsHexRgb);
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
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateUiValue ();
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_value:{
					name:'value',
					onChange:_classPrototype._updateUiValue,
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
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				built:false,
				/*?
					State Properties
						built
							This state property is inherited from the =Uize.Widget= base class, but its initial value is overrided to =false= in this class.

				*/
				html:Uize.Templates.ColorInfo
				/*?
					State Properties
						built
							This state property is inherited from the =Uize.Widget= base class, but its initial value is overrided to =Uize.Templates.ColorInfo= in this class.

				*/
			});

		return _class;
	}
});

