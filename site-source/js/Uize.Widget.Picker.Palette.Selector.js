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
					function() {
						var _this = this;

						function _syncValueDetails() {
							var _valueObject = _this.getValueObject();

							_this.set({
								valueDetails:_valueObject
									? _valueObject.valueDetails
									: null
							});
						}
						_this.wire('Changed.value', _syncValueDetails);

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

			_classPrototype.handleDialogSubmit = function(_valueInfo) {
				var
					_this = this,
					_undefined
				;

				function _createSetObject(_propertyName) {
					var _propertyValue = _valueInfo[_propertyName];
					return _propertyValue !== _undefined ? Uize.pairUp(_propertyName, _propertyValue) : _undefined
				}

				_this.set(
					Uize.copyInto(
						{},
						_createSetObject('valueNo'),
						_createSetObject('tentativeValueNo')
					)
				);

				_superclass.prototype.handleDialogSubmit.call(_this, _valueInfo);
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

