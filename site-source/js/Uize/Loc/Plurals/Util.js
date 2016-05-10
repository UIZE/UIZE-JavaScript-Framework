/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Plurals.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.Util= module provides some utility methods that are used by the various language specific plural modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		var
			_isList = Uize.isList,

			/*** references to static methods used internally ***/
				_resolveValue,
				_getNumberInfo,
				_within
		;

		return Uize.package ({
			resolveValue:_resolveValue = function (_value) {
				/*** when the value is a params object, find the first number param ***/
					if (Uize.isPlainObject (_value)) {
						for (var _key in _value) {
							if (typeof _value [_key] == 'number') {
								_value = _value [_key];
								break;
							}
						}
					}

				return _value;
			},

			getNumberInfo:_getNumberInfo = function (_value) {
				var
					_valueStr = (_value = _resolveValue (_value)) + '',
					_integerAndFractional = _valueStr.split ('.'),
					_fractional = _integerAndFractional [1] || '',
					_fractionalWithoutTrailing = _fractional.replace (/0+$/,''),
					n = Math.abs (+_value)
				;
				return {
					n:n, // absolute value of the source number (integer and decimals)
					i:Math.floor (n), // integer digits of n
					v:_fractional.length, // number of visible fraction digits in n, with trailing zeros
					w:_fractionalWithoutTrailing.length, // number of visible fraction digits in n, without trailing zeros
					f:+_fractional, // visible fractional digits in n, with trailing zeros
					t:+_fractionalWithoutTrailing // visible fractional digits in n, without trailing zeros
				};
			},

			getPluralCategory:function (_value,_pluralRulesFunction) {
				var _numberInfo = _getNumberInfo (_value);
				return _pluralRulesFunction (
					_numberInfo.n,
					_numberInfo.i,
					_numberInfo.v,
					_numberInfo.w,
					_numberInfo.f,
					_numberInfo.t,
					_within
				);
			},

			within:_within = function (_value,_rangeItems) {
				var _result = false;
				for (
					var _rangeItemNo = -1, _rangeItemsLength = _rangeItems.length, _rangeItem;
					++_rangeItemNo < _rangeItemsLength &&
						!(
							_result = _isList (_rangeItem = _rangeItems [_rangeItemNo])
								? _value >= _rangeItem [0] && _value <= _rangeItem [1]
								: _value == _rangeItem
						)
					;
				);
				return _result;
			}
		});
	}
});

