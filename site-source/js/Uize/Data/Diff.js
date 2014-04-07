/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Diff Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Data.Diff= module provides methods for comparing the contents of two data objects and reporting the differences.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Diff',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_isPlainObject = Uize.isPlainObject,
				_isEmpty = Uize.isEmpty,
				_undefined,

			/*** General Variables ***/
				_sacredEmpyObject = {}
		;

		/*** Utility Functions ***/
			function _diffDefaultPropertyComparer (_object1Property,_object2Property) {
				return {
					value:_object1Property && !_object2Property
						? 'removed'
						: !_object1Property && _object2Property
							? 'added'
							: _object1Property.value === _object2Property.value
								? 'unchanged'
								: 'modified'
				};
			}

		return Uize.package ({
			diff:function (_object1,_object2,_propertyComparer) {
				_propertyComparer || (_propertyComparer = _diffDefaultPropertyComparer);
				function _compareNode (_object1,_object2) {
					var _result = {};
					for (var _property in Uize.copy (_object1,_object2)) {
						var
							_propertyComparisonResult,
							_object1PropertyValue = _object1 [_property],
							_object2PropertyValue = _object2 [_property]
						;
						if (_isPlainObject (_object1PropertyValue) || _isPlainObject (_object2PropertyValue)) {
							var _subNodeComparison = _compareNode (
								_object1PropertyValue || _sacredEmpyObject,
								_object2PropertyValue || _sacredEmpyObject
							);
							_propertyComparisonResult = _isEmpty (_propertyComparisonResult)
								? _undefined
								: {value:_subNodeComparison}
							;
						} else {
							_propertyComparisonResult = _propertyComparer (
								_property in _object1 ? {value:_object1PropertyValue} : _undefined,
								_property in _object2 ? {value:_object2PropertyValue} : _undefined
							);
						}
						if (_propertyComparisonResult)
							_result [_property] = _propertyComparisonResult.value
						;
					}
					return _result;
				}
				return _compareNode (_object1,_object2);
				/*?
					### Static Methods
						Uize.Data.Diff.diff

							SYNTAX
							...
							...
				*/
			}
		});
	}
});

