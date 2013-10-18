/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Math.Blend Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Math.Blend= package module supports blending two values values to produce a new, interpolated value, with support for blending arbitrarily complex data structures and interpolation curve functions (and structures).

		*DEVELOPERS:* `Chris van Rensburg`

		BACKGROUND READING

		For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the guide [[../guides/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Engine`.
*/

Uize.module ({
	name:'Uize.Math.Blend',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_typeObject = 'object',

			/*** References for Performance Optimization ***/
				_constrain = Uize.constrain,
				_isFunction = Uize.isFunction,

			/*** References to Statics Used Internally ***/
				_blendValues
		;

		return Uize.package ({
			blend:_blendValues = function (_value1,_value2,_blend,_quantization,_curve,_previousValue,_valueUnchanged) {
				if (_value1 === _value2) {
					return _previousValue !== _undefined && _value1 === _previousValue ? _valueUnchanged : _value1;
				} else {
					if (_isFunction (_curve)) {
						_blend = _curve (_blend);
						_curve = _undefined;
					}
					if (typeof _value1 == _typeObject && _value1 && !(_value1 instanceof RegExp)) {
						var
							_blendedEqualsPrevious = _previousValue && typeof _previousValue == _typeObject,
							_quantizationIsObject = _quantization && typeof _quantization == _typeObject,
							_curveIsObject = _curve && typeof _curve == _typeObject,
							_result = _blendedEqualsPrevious ? _previousValue : Uize.isArray (_value1) ? [] : {},
							_propertyPreviousValue
						;
						for (var _propertyName in _value1) {
							var _blendedValue = _blendValues (
								_value1 [_propertyName],
								_value2 [_propertyName],
								_blend,
								_quantizationIsObject ? _quantization [_propertyName] : _quantization,
								_curveIsObject ? _curve [_propertyName] : _curve,
								_propertyPreviousValue = _result [_propertyName],
								_valueUnchanged
							);
							if (_blendedEqualsPrevious)
								_blendedEqualsPrevious =
									_blendedValue == _valueUnchanged ||
									(typeof _blendedValue != _typeObject && _blendedValue == _propertyPreviousValue)
							;
							if (_blendedValue != _valueUnchanged)
								_result [_propertyName] = _blendedValue
							;
						}
						return _blendedEqualsPrevious ? _valueUnchanged : _result;
					} else {
						var _result = !_blend
							? _value1
							: _blend == 1
								? _value2
								: !_quantization
									? _value1 + (_value2 - _value1) * _blend
									: _blend > 0 && _blend < 1
										? _constrain (
											_value1 + Math.round ((_value2 - _value1) * _blend / _quantization) * _quantization,
											_value1,
											_value2
										)
										: _value1 + Math.round ((_value2 - _value1) * _blend / _quantization) * _quantization
						;
						return _previousValue !== _undefined && _result === _previousValue ? _valueUnchanged : _result;
					}
				}
				/*?
					Static Methods
						Uize.Math.Blend.blend
							Returns a value, that is the blend between the two specified values.

							SYNTAX
							.............................................................
							blendedINTorOBJorARRAY = Uize.Math.Blend.blend (
								value1INTorOBJorARRAY,value2INTorOBJorARRAY,blendFRACTION
							);
							.............................................................

							In its simplest use, this method can be used to blend between two simple number type values, where the =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in returning the value of the =value1INTorOBJorARRAY= parameter, the value of =1= will result in returning the value of the =value2INTorOBJorARRAY= parameter, and the value =.5= will result in returning the average of =value1INTorOBJorARRAY= and =value2INTorOBJorARRAY=.

							Beyond blending simple number values, this method can also be used to blend arbitrarily complex data structures, such as two arrays of numbers, or two RGB color objects whose properties are color channel values, or two arrays containing multiple objects whose properties are numbers, and even more complex structures.

							EXAMPLE
							...............................................................................
							Uize.Math.Blend.blend ({red:255,green:255,blue:255},{red:0,green:0,blue:0},.5);
							...............................................................................

							To illustrate the ability to blend complex values, the above statement of code would return the object ={red:127.5,green:127.5,blue:127.5}=, corresponding to mid gray.
				*/
			}
		});
	}
});

