/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Data= module provides some convenience methods for working with data objects, in addition to providing a namespace for various other data utility modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_string = 'string',
				_true = true,
				_false = false,
				_null = null,
				_undefined,
				_Infinity = Infinity,
				_Uize_totalKeys = Uize.totalKeys
		;

		/*** General Variables ***/
			var
				_package,
				_sacredEmptyObject = {}
			;

		return _package = Uize.package ({
			getColumn:function (_rows,_columnName,_onlyUniques) {
				var _result = [];
				if (_rows) {
					var _uniqueValuesMap = _onlyUniques ? {} : _null;
					for (var _rowNo = -1, _rowsLength = _rows.length; ++_rowNo < _rowsLength;) {
						var _columnValueForRow = _rows [_rowNo] [_columnName];
						if (
							!_onlyUniques ||
							(!_uniqueValuesMap [_columnValueForRow] && (_uniqueValuesMap [_columnValueForRow] = 1))
						)
							_result.push (_columnValueForRow)
						;
					}
				}
				return _result;
				/*?
					Static Methods
						Uize.Data.getColumn
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Util.getColumn= method of the =Uize.Data.Util= module.
				*/
			},

			findRecords:function (_records,_match) {
				var _matchingRecords = [];
				if (_records) {
					for (var _recordNo = -1, _recordsLength = _records.length, _record; ++_recordNo < _recordsLength;)
						Uize.recordMatches (_record = _records [_recordNo],_match) && _matchingRecords.push (_record)
					;
				}
				return _matchingRecords;
				/*?
					Static Methods
						Uize.Data.findRecords
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Util.findRecords= method of the =Uize.Data.Util= module.
				*/
			},

			filter:function (_object,_propertyNames) {
				var _result = {};
				if (_object && _propertyNames) {
					for (
						var _propertyNameNo = -1, _propertyNamesLength = _propertyNames.length;
						++_propertyNameNo < _propertyNamesLength;
					) {
						var _propertyName = _propertyNames [_propertyNameNo];
						if (_propertyName in _object)
							_result [_propertyName] = _object [_propertyName]
						;
					}
				}
				return _result;
				/*?
					Static Methods
						Uize.Data.filter
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Util.filter= method of the =Uize.Data.Util= module.
				*/
			},

			identical:function (_object1,_object2,_options) {
				if (!_options) _options = _sacredEmptyObject;
				var
					_equality = _options.equality,
					_looseEquality = _equality == 'loose',
					_typeEquality = !_looseEquality && _equality == 'type',
					_treeEquality = !_looseEquality && !_typeEquality && _equality == 'tree',
					_strictEquality = !_looseEquality && !_typeEquality && !_treeEquality,
					_allowConjoined = _options.allowConjoined !== _false
				;
				function _areIdentical (_object1,_object2) {
					var
						_identical,
						_typeofObject1 = typeof _object1,
						_typeofObject1IsObject = _typeofObject1 == 'object',
						_object1IsObject = _typeofObject1IsObject && _object1,
						_typesMatch = _typeofObject1 == typeof _object2
					;
					function _compareObjectsForIdentical () {
						if (_identical = _Uize_totalKeys (_object1) == _Uize_totalKeys (_object2)) {
							for (var _propertyName in _object1) {
								if (
									!(_propertyName in _object2) ||
									!_areIdentical (_object1 [_propertyName],_object2 [_propertyName])
								) {
									_identical = _false;
									break;
								}
							}
						}
					}
					if (_typesMatch && _object1IsObject && _object2) {
						var _object1Constructor = _object1.constructor;
						if (_object1 == _object2) {
							_identical = _allowConjoined;
						} else if (_identical = _object1Constructor == _object2.constructor) {
							if (
								_object1Constructor == Date ||
								_object1Constructor == String ||
								_object1Constructor == Number ||
								_object1Constructor == Boolean ||
								_object1Constructor == RegExp
							) {
								_identical = _object1 + '' == _object2 + '';
								/* NOTE:
									Coercion to string invokes valueOf or toString, depending on the object type (toString for RegExp), which covers Date, String, Number, Boolean, and RegExp. Calling valueOf, while more performant for some object types, doesn't cover the case for RegExp (since valueOf returns a reference to the object), and it doesn't cover the case of two Number instances with the value NaN, since valueOf would return NaN and NaN is not equal to NaN (whereas, 'NaN' is equal to 'NaN')
								*/
							} else {
								if (typeof _object1.splice == 'function' && typeof _object2.splice == 'function') {
									/* NOTES:
										To compare arrays for their contents being identical, we first test that their lengths are the same. If this test passes, we use a standard iterator to iterate through the arrays to compare their elements.

										If the values of elements are identical between the arrays, then we go on to test the custom properties (if any exist). Most importantly, we don't use a for...in loop to iterate through both elements and custom properties, partly for performance reasons, but mostly because of an unfortunate behavior in Microsoft's JScript interpreter.

										In several versions of Microsoft's JScript interpreter, if an array is initialized using the literal syntax (i.e. ['value 1','value 2','value 3']), then any element whose value is initialized to undefined will not be encountered in a for...in loop.

										EXAMPLE
										.....................................
										var
											keysHash = {},
											myArray = ['foo',undefined,'bar']
										;
										for (key in myArray) {
											keysHash [key] = true;
										}
										alert (keysHash [1]);
										.....................................

										In the above example, the alert statement would alert the value undefined in interpreters that exhibit the problematic behavior.

										This behavior would cause a problem if we were using a for...in loop to compare arrays for identical elements and custom properties. So, instead, we compare elements and custom properties separately. In order to compare only custom properties, we splice out the elements of the arrays so we can do a for...in loop to compare the custom properties without encountering the array elements in the loop. After we've compared custom properties, we then restore the spliced elements.
									*/
									if (_identical = _object1.length == _object2.length) {
										for (var _elementNo = _object1.length; --_elementNo >= 0;) {
											if (!_areIdentical (_object1 [_elementNo],_object2 [_elementNo])) {
												_identical = _false;
												break;
											}
										}
										if (_identical) {
											/*** remove array elements and store ***/
												var
													_object1Elements = _object1.splice (0,_Infinity),
													_object2Elements = _object2.splice (0,_Infinity)
												;

											_compareObjectsForIdentical ();

											/*** restore removed elements to arrays ***/
												Uize.push (_object1,_object1Elements);
												Uize.push (_object2,_object2Elements);
										}
									}
								} else {
									_compareObjectsForIdentical ();
								}
							}
						}
					} else {
						_identical = _treeEquality
							? !_object1IsObject && !(typeof _object2 == 'object' && _object2)
							: (
								(
									_looseEquality
										? _object1 == _object2
										: (
											_typesMatch &&
											(
												_strictEquality
													? _object1 === _object2
													: (!_typeofObject1IsObject || !_object1 == !_object2)
											)
										)
								) ||
								(_typesMatch && _typeofObject1 == 'number' && _object1 != _object1 && _object2 != _object2)
							)
						;
					}
					return _identical;
				}
				return _areIdentical (_object1,_object2);
				/*?
					Static Methods
						Uize.Data.identical
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Compare.identical= method of the =Uize.Data.Compare= module.
				*/
			},

			conjoined:function (_object1,_object2) {
				function _getObjectReferences (_object) {
					var _objRefs = [];
					function _accumulateObjRefs (_object) {
						if (typeof _object == 'object') {
							if (!Uize.isIn (_objRefs,_object)) {
								_objRefs.push (_object);
								for (var _propertyName in _object)
									_accumulateObjRefs (_object [_propertyName])
								;
							}
						}
					}
					_accumulateObjRefs (_object);
					return _objRefs;
				}
				var
					_conjoined = _false,
					_object1ObjRefs = _getObjectReferences (_object1),
					_object1ObjRefsLength = _object1ObjRefs.length,
					_object2ObjRefs = _getObjectReferences (_object2)
				;
				for (var _object1ObjRefNo = -1; ++_object1ObjRefNo < _object1ObjRefsLength && !_conjoined;)
					_conjoined = Uize.isIn (_object2ObjRefs,_object1ObjRefs [_object1ObjRefNo])
				;
				return _conjoined;
				/*?
					Static Methods
						Uize.Data.conjoined
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Compare.conjoined= method of the =Uize.Data.Compare= module.
				*/
			},

			clones:function (_object1,_object2) {
				return (
					_package.identical (_object1,_object2,{allowConjoined:_false}) &&
					!_package.conjoined (_object1,_object2)
				);
				/*?
					Static Methods
						Uize.Data.clones
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Compare.clones= method of the =Uize.Data.Compare= module.
				*/
			},

			intersection:function (_object1,_object2) {
				var _result = {};
				if (_object1 && _object2) {
					for (var _propertyName in _object1) {
						var _propertyValue = _object1 [_propertyName];
						if (_object2 [_propertyName] === _propertyValue)
							_result [_propertyName] = _propertyValue
						;
					}
				}
				return _result;
				/*?
					Static Methods
						Uize.Data.intersection
							This method has been deprecated *(DEPRECATED 2014-04-02)* in favor of the newer =Uize.Data.Compare.intersection= method of the =Uize.Data.Compare= module.
				*/
			}
		});
	}
});

