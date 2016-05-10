/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bar.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 25
*/

/*?
	Introduction
		The =Uize.Widgets.Bar.Widget= class implements a widget for displaying numerical values using a bar, with full and empty indicators and an optional value knob.

		*DEVELOPERS:* `Chris van Rensburg`, `Bryan Hsueh`

		This module supports both horizontally and vertically oriented bars.

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Bar.Widget= class...

			...........................................
			<< widget >>

			widgetClass: Uize.Widgets.Bar.VisualSampler
			...........................................
*/

Uize.module ({
	name:'Uize.Widgets.Bar.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Bar.Html',
		'Uize.Widgets.Bar.Css'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Utility Functions ***/
			function _displayedStyleDimPropertyProfile (_name,_isWidth) {
				return {
					name:_name,
					derived:'orientation,trackLength: (orientation != "horizontal") == ' + _isWidth + ' ? "" : typeof trackLength == "number" ? trackLength + "px" : trackLength'
				};
			}

		/*** Private Instance Methods ***/
			function _conformValue (_value) {
				var
					m = this,
					_minValue = m._minValidValue == null ? m._minValue : m._minValidValue,
					_increments = m._increments
				;
				return (
					Uize.constrain (
						_increments ? (_minValue + Math.round ((_value - _minValue) / _increments) * _increments) : _value,
						_minValue,
						m._maxValidValue == null ? m._maxValue : m._maxValidValue
					)
				);
			}

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Bar.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Bar.Css
			},

			stateProperties:{
				_increments:{
					name:'increments',
					onChange:_conformValue,
					value:1
					/*?
						State Properties
							increments
								[DOCUMENT]
					*/
				},
				// if set, this is the min valid value, otherwise, use minValue
				_minValidValue:{
					name:'minValidValue',
					onChange:_conformValue
					/*?
						State Properties
							minValidValue
								[DOCUMENT]
					*/
				},
				_minValue:{
					name:'minValue',
					onChange:_conformValue,
					value:0
					/*?
						State Properties
							minValue
								[DOCUMENT]
					*/
				},
				// if set, this is the max valid value, otherwise, use maxValue
				_maxValidValue:{
					name:'maxValidValue',
					onChange:_conformValue
					/*?
						State Properties
							maxValidValue
								[DOCUMENT]
					*/
				},
				_maxValue:{
					name:'maxValue',
					onChange:_conformValue,
					value:100
					/*?
						State Properties
							maxValue
								[DOCUMENT]
					*/
				},
				_orientation:{
					name:'orientation',
					value:'vertical'
					/*?
						State Properties
							orientation
								[DOCUMENT]
					*/
				},
				// this function can show the value in differe scale: eg, log(x+1), 1-1/x, x^2, etc.
				_scaleFunc:{
					name:'scaleFunc',
					value:Uize.returnX
					/*?
						State Properties
							scaleFunc
								[DOCUMENT]
					*/
				},
				_trackLength:{
					name:'trackLength',
					value:''
				},
				_value:{
					name:'value',
					conformer:_conformValue,
					value:0
					/*?
						State Properties
							value
								[DOCUMENT]
					*/
				},

				/*** derived properties ***/
					_displayedStyleWidth:_displayedStyleDimPropertyProfile ('displayedStyleWidth',true),
					_displayedStyleHeight:_displayedStyleDimPropertyProfile ('displayedStyleHeight',false),

					valuePosPercent:{
						derived:{
							properties:['value','minValue','maxValue','scaleFunc'],
							derivation:function (_value,_minValue,_maxValue,_scaleFunc) {
								var _minValueScaled = _scaleFunc (_minValue);
								return (
									100 * (_scaleFunc (_value) - _minValueScaled) / (_scaleFunc (_maxValue) - _minValueScaled)
								);
							}
						}
					}
			},

			cssBindings:{
				orientation:'value'
			},

			htmlBindings:{
				displayedStyleWidth:':style.width',
				displayedStyleHeight:':style.height',
				value:'knob:title'
			}
		});
	}
});

