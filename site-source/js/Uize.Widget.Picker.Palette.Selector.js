/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.Palette.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Picker.Palette.Selector',
	required:'Uize.Widget.Button.ValueDisplay.Selector',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var m = this;

						function _syncValueDetails() {
							var _valueObject = m.getValueObject();

							m.set({
								valueDetails:_valueObject
									? _valueObject.valueDetails
									: null
							});
						}
						m.wire({
							'Changed.value': _syncValueDetails,
							'Changed.values': _syncValueDetails
						});

						_syncValueDetails();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.getValueObject = function (_name) {
				var _undefined;
				return Uize.findRecord (
					this._values,
					{
						name:_name == _undefined
							? this + ''
							: _name
					}
				);
			};

			_classPrototype.getMoreDialogEventHandlers = function () {
				var
					m = this,
					_undefined
				;

				function _addHandler(_propertyName) {
					return Uize.pairUp(
						'Changed.' + _propertyName,
						function (_event) {
							var _dialogPropertyValue = _event.source.get(_propertyName);

							_dialogPropertyValue !== _undefined
								&& m.set(_propertyName, _dialogPropertyValue)
							;
				}
					);
				}

				return Uize.copyInto(
					_superclass.prototype.getMoreDialogEventHandlers.call(m) || {},
					_addHandler('valueNo'),
					_addHandler('tentativeValueNo')
				);
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				pipedProperties:['values', 'valueNo', 'tentativeValueNo'],
				selectorButtonWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,
				dialogWidgetClass:'Uize.Widget.Dialog.Picker.Palette.Selector'
			});

		return _class;
	}
});

