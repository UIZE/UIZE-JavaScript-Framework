/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Options.Selector',
	required:'Uize.Widget.Button.ValueDisplay.Selector',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,
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
						_propertyValue = m.get(_propertyName),
						_valueDetails = _valueDetailsCache[_propertyValue]
					;

					if (_valueDetails === _undefined) {
						var _valueObject = Uize.findRecord (m.get('values'), {name:_propertyValue});

						_addToValueDetailsCache(
							_propertyName,
							_valueDetails = (_valueObject ? _valueObject.valueDetails : null)
						);
					}

					m.set(_propertyName + 'Details', _valueDetails);
				}

				m.wire({
					'Changed.tentativeValue':function () { _syncValueDetails(_tentativeValueString) },
					'Changed.value':function () { _syncValueDetails(_valueString) },
					'Changed.tentativeValueDetails':function () {
						_addToValueDetailsCache(m.get(_tentativeValueString), m._tentativeValueDetails);
					},
					'Changed.valueDetails':function () {
						_addToValueDetailsCache(m.get(_valueString), m._valueDetails);
					},
					'Changed.values':function () {
						_valueDetailsCache = {};
						_addToValueDetailsCache(m.valueOf(), m._valueDetails);
						_syncValueDetails(_valueString);
					}
				});

				_syncValueDetails(_valueString);
				_syncValueDetails(_tentativeValueString);
			},

			instanceMethods:{
				getOptionProperties:function (_valueNo, _valueObject) {
					return Uize.copyInto(
						_superclass.doMy (this,'getOptionProperties',[_valueNo, _valueObject]) || {},
						{
							value:_valueObject.name,
							valueDetails:_valueObject.valueDetails
						}
					);
				},

				wireUi:function () {
					var m = this;

					if (!m.isWired) {
						// set the container for the options that get created
						m.set({container:m.getNode('options')});

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_tentativeValueDetails:'tentativeValueDetails',
				_valueDetails:'valueDetails'
			},

			set:{
				optionWidgetClass:Uize.Widget.Button.ValueDisplay.Selector
			}
		});
	}
});
