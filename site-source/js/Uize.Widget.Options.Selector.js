/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Options.Selector= widget provides the functionality for specific type of input UI widget that allows for single selection of an option among a discrete set of options, with additional optional sort and search capabilities.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Options.Selector',
	required:'Uize.Widget.Button.ValueDisplay.Selector',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var
							_this = this,
							_valueString = 'value',
							_tentativeValueString = 'tentativeValue',
							_valueDetailsCache = {},
							_undefined
						;

						// So there can be a case where the value & valueDetails are set for the options, but that
						// info isn't in the values set.  In order to support tentativeValue & tentativeValueDetails
						// changing but still getting back that value & valueDetails that were set (and not in the list)
						// we need to cache the valueDetails
						function _addToValueDetailsCache(_value, _valueDetails) {
							if (_valueDetails != null)
								_valueDetailsCache[_value] = _valueDetails;
						}

						function _syncValueDetails(_propertyName) {
							var
								_propertyValue = _this.get(_propertyName),
								_valueDetails = _valueDetailsCache[_propertyValue]
							;

							if (_valueDetails === _undefined) {
								var _valueObject = Uize.findRecord (_this.get('values'), {name:_propertyValue});

								_addToValueDetailsCache(
									_propertyValue,
									_valueDetails = (_valueObject ? _valueObject.valueDetails : null)
								);
							}

							_this.set(_propertyName + 'Details', _valueDetails);
						}

						_this.wire({
							'Changed.tentativeValue':function() { _syncValueDetails(_tentativeValueString) },
							'Changed.value':function() { _syncValueDetails(_valueString) },
							'Changed.tentativeValueDetails':function() {
								_addToValueDetailsCache(_this.get(_tentativeValueString), _this._tentativeValueDetails)
							},
							'Changed.valueDetails':function() {
								_addToValueDetailsCache(_this.get(_valueString), _this._valueDetails)
							},
							'Changed.values':function() {
								_valueDetailsCache = {};
								_addToValueDetailsCache(_this.valueOf(), _this._valueDetails);
							}
						});

						_syncValueDetails(_valueString);
						_syncValueDetails(_tentativeValueString);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Methods ***/
			_classPrototype.getOptionProperties = function(_valueNo, _valueObject) {
				return Uize.copyInto(
					_superclass.prototype.getOptionProperties.call (this, _valueNo, _valueObject) || {},
					{
						value:_valueObject.name,
						valueDetails:_valueObject.valueDetails
					}
				)
			};

			_classPrototype.wireUi = function() {
				var _this = this;

				if (!_this.isWired) {
					// set the container for the options that get created
					_this.set({container:_this.getNode('options')});

					_superclass.prototype.wireUi.call(_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_tentativeValueDetails:'tentativeValueDetails',
				_valueDetails:'valueDetails'
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				optionWidgetClass:Uize.Widget.Button.ValueDisplay.Selector
			});

		return _class;
	}
});
