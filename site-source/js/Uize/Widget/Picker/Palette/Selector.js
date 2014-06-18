/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.Palette.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Picker.Palette.Selector= class provides functionality for palette picker widgets that require selection from a set of values (like a drop list)

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Picker.Palette.Selector',
	required:'Uize.Widget.Button.ValueDisplay.Selector',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				function _syncValueDetails() {
					var _valueObject = m.getValueObject();

					m.set({valueDetails:_valueObject ? _valueObject.valueDetails : null});
				}
				m.wire({
					'Changed.value': _syncValueDetails,
					'Changed.values': _syncValueDetails
				});

				_syncValueDetails();
			},

			instanceMethods:{
				getValueObject:function (_name) {
					return Uize.findRecord (this._values,{name:_name == undefined ? this + '' : _name});
				},

				getMoreDialogEventHandlers:function () {
					var m = this;

					function _addHandler(_propertyName) {
						return Uize.pairUp(
							'Changed.' + _propertyName,
							function (_event) {
								var _dialogPropertyValue = _event.source.get(_propertyName);

								_dialogPropertyValue !== undefined
									&& m.set(_propertyName, _dialogPropertyValue)
								;
							}
						);
					}

					return Uize.copyInto(
						_superclass.doMy(m,'getMoreDialogEventHandlers') || {},
						_addHandler('valueNo'),
						_addHandler('tentativeValueNo')
					);
				}
			},

			stateProperties:{
				_tentativeValueNo:{
					name:'tentativeValueNo',	// read-only
					value:-1
				},
				_valueNo:{
					name:'valueNo',	// read-only
					value:-1
				},
				_values:{
					name:'values',
					value:[]
				}
			},

			set:{
				pipedProperties:['values', 'valueNo', 'tentativeValueNo'],
				selectorButtonWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,
				dialogWidgetClass:'Uize.Widget.Dialog.Picker.Palette.Selector'
			}
		});
	}
});

