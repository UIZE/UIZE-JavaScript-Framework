/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.Palette.mSelector Mix-in
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mix-in
	importance: 4
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Picker.Palette.mSelector= class mix-in provides functionality for palette picker widgets that require selection from a set of values (like a drop list)

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Picker.Palette.mSelector',
	required:'Uize.Widget.Button.ValueDisplay.Selector',
	builder:function (_superclass) {
		'use strict';

		return function (_class) {
			_class.declare ({
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
						return Uize.findRecord (this.values,{name:_name == undefined ? this + '' : _name});
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
					tentativeValueNo:{ // read-only
						name:'tentativeValueNo',
						value:-1
					},
					valueNo:{ // read-only
						value:-1
					},
					values:{
						value:[]
					}
				},

				set:{
					pipedProperties:['values', 'valueNo', 'tentativeValueNo'],
					selectorButtonWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,
					dialogWidgetClass:'Uize.Widget.Dialog.Picker.Palette.Selector'
				}
			});
		};
	}
});
