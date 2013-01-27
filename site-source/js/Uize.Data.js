/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
		The =Uize.Data= module provides methods for working with data, including comparing complex data structures, finding records, getting keys and values, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_string = 'string',
				_true = true,
				_false = false,
				_null = null,
				_undefined,
				_Infinity = Infinity,
				_Uize_totalKeys = Uize.totalKeys
			;

		/*** General Variables ***/
			var _sacredEmptyObject = {};

		/*** Public Static Methods ***/
			_package.getColumn = function (_rows,_columnName,_onlyUniques) {
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
							Returns an array of the values for the specified column of the specified record set.

							SYNTAX
							..................................................................
							columnValuesARRAY = Uize.Data.getColumn (rowsARRAY,columnNameSTR);
							..................................................................

							EXAMPLE
							.........................................................
							var
								peopleNames = [
									{first:'John',last:'Wilkey'},
									{first:'Marie',last:'Stevenson'},
									{first:'Craig',last:'Pollack'}
								],
								firstNames = Uize.Data.getColumn (peopleNames,'first'),
								lastNames = Uize.Data.getColumn (peopleNames,'last')
							;
							.........................................................

							In the above example, the variable =firstNames= would be an array with the value =['John','Marie','Craig']= and the variable =lastNames= would be an array with the value =['Wilkey','Stevenson','Pollack']=.

							The records / rows in the record set do not need to be objects - they can also be arrays.

							EXAMPLE
							....................................................
							var
								peopleNames = [
									['John','Wilkey'],
									['Marie','Stevenson'],
									['Craig','Pollack']
								],
								firstNames = Uize.Data.getColumn (peopleNames,0),
								lastNames = Uize.Data.getColumn (peopleNames,1)
							;
							....................................................

							In the above example, the =firstNames= and =lastNames= variables would have the same values as in the previous example.

							VARIATION
							..................................................................................
							columnValuesARRAY = Uize.Data.getColumn (rowsARRAY,columnNameSTR,onlyUniquesBOOL);
							..................................................................................

							When the value =true= is specified for the optional =onlyUniquesBOOL= parameter, then this method will only return the unique values for the specified column.

							EXAMPLE
							......................................................................
							var
								employees = [
									{firstName:'John',lastName:'Wilkey',department:'engineering'},
									{firstName:'Marie',lastName:'Stevenson',department:'finance'},
									{firstName:'Craig',lastName:'Pollack',department:'finance'},
									{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
									{firstName:'Mark',lastName:'Strathley',department:'engineering'}
								],
								departments = Uize.Data.getColumn (employees,'department',true)
							;
							......................................................................

							In the above example, the variable =departments= would be an array with the value =['engineering','finance']=.
				*/
			};

			_package.findRecords = function (_records,_match) {
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
							Returns an array of records from the specified record set that match the specified criteria.

							SYNTAX
							.....................................................................
							matchingRecordsARRAY = Uize.Data.findRecords (recordsARRAY,matchOBJ);
							.....................................................................

							EXAMPLE
							..............................................................................
							var
								employees = [
									{firstName:'John',lastName:'Wilkey',department:'engineering'},
									{firstName:'Marie',lastName:'Stevenson',department:'finance'},
									{firstName:'Craig',lastName:'Pollack',department:'finance'},
									{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
									{firstName:'Mark',lastName:'Strathley',department:'engineering'}
								],
								financeEmployees = Uize.Data.findRecords (employees,{department:'finance'})
							;
							..............................................................................

							In the above example, the variable =financeEmployees= would be an array with the value...

							.................................................................
							[
								{firstName:'Marie',lastName:'Stevenson',department:'finance'},
								{firstName:'Craig',lastName:'Pollack',department:'finance'}
							]
							.................................................................

							If the records in your record set are arrays, rather than objects, then you can specify a match object where the keys are numerical indexes representing the array element index / column index, as in...

							EXAMPLE
							.....................................................................
							var
								employees = [
									['John','Wilkey','engineering'],
									['Marie','Stevenson','finance'],
									['Craig','Pollack','finance'],
									['Nick','Arendsen','engineering'],
									['Mark','Strathley','engineering']
								],
								financeEmployees = Uize.Data.findRecords (employees,{2:'finance'})
							;
							.....................................................................

							In the above example, the =financeEmployees= variable would have the same value as in the previous example.

							NOTES
							- see also the =Uize.findRecord=, =Uize.findRecordNo=, and =Uize.recordMatches= static methods of the =Uize.Class= base class
				*/
			};

			_package.filter = function (_object,_propertyNames) {
				var
					_this = this,
					_result = {}
				;
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
							Returns an object with only the properties of the source object that are specified by an array of property names.

							SYNTAX
							....................................................................
							filteredOBJ = Uize.Data.filter (sourceObjectOBJ,propertyNamesARRAY);
							....................................................................

							This method can be useful when receiving an info package of which only a subset needs to be stored or passed on to a subsequent process.

							EXAMPLE
							...................................................................................
							var someNodeStyle = {
								color:'#fff',
								left:'10px',
								top:'-50px',
								position:'absolute',
								display:'none',
								width:'200px',
								height:'300px',
								overflow:'hidden'
							};
							Uize.Node.setStyle (
								'someOtherNode',Uize.Data.filter (someNodeStyle,['left','top','width','height'])
							);
							...................................................................................

							In this example, a node style object that is being used for some node is being filtered for just its dimensions and positioning properties, to then be applied to some other node.

							Without this method, the =setStyle= method call would look like...
							.................................
							Uize.Node.setStyle (
								'someOtherNode',
								{
									left:someNodeStyle.left,
									top:someNodeStyle.top,
									width:someNodeStyle.width,
									height:someNodeStyle.height
								}
							);
							.................................
				*/
			};

			_package.identical = function (_object1,_object2,_options) {
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

										In several versions of Microsoft's JScript interpreter, if an array is initialized using the literal syntax (ie. ['value 1','value 2','value 3']), then any element whose value is initialized to undefined will not be encountered in a for...in loop.

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
												_object1.push.apply (_object1,_object1Elements);
												_object2.push.apply (_object2,_object2Elements);
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
							Returns a boolean, indicating whether or not the two specified objects are identical in their contents.

							SYNTAX
							...............................................................
							areIdenticalBOOL = Uize.Data.identical (object1OBJ,object2OBJ);
							...............................................................

							This method recurses through the two objects specified by the =object1OBJ= and =object2OBJ= parameters, testing that they have the same structure and property values. The two parameters can be arbitrarily complex data trees, or simple type values (ie. string, number, boolean). In order to be considered identical, the two objects must have the same structure and the same values at all levels of their structure.

							VARIATION
							..........................................................................
							areIdenticalBOOL = Uize.Data.identical (object1OBJ,object2OBJ,optionsOBJ);
							..........................................................................

							When the optional =optionsOBJ= parameter is specified, comparison options can be specified to determine the criteria this method uses when comparing the two objects.

							optionsOBJ
								An object, with multiple optional properties, specifying the criteria this method should use when comparing the two objects.

								The value of the =optionsOBJ= parameter should be an object of the form...

								...............................................................................
								{
									equality : equalitySTR,             // 'type' | 'loose' | 'strict' (default)
									allowConjoined : allowConjoinedBOOL // false | true (default)
								}
								...............................................................................

								equality
									A string, specifying how the values of properties at any level of the objects' structure should be tested for equality.

									The optional =equality= property of the =optionsOBJ= parameter can have the following values...

									- ='type'= - When the value ='type'= is specified, the values of properties do not need to be equal - only be of the same type. This setting is useful when merely trying to determine if two objects have the same structure, but not that their values match. This could be used to determine if an object being interrogated conforms to some reference structure that might indicate the type of data it contains, but where the specific values are not important.

									- ='loose'= - When the value ='loose'= is specified, then the values of all properties must be equal only according to a loose equality comparison, where strict type matching is not performed. According to this setting, the number value =1= would equal the string value ='1'=, or the number value =0= would equal the string value =''= (empty string) and the boolean value =false=.

									- ='strict'= - When the value ='strict'= is specified (or when no value is specified for the =equality= property, or when no =optionsOBJ= parameter is specified), then the values of all properties must be equal according to a strict equality comparison, where strict type matching is performed. According to this setting, the number value =1= would *NOT* equal the string value ='1'=, the number value =0= would *NOT* equal the string value =''= (empty string), and so on.

								allowConjoined
									A boolean, specifying whether or not the two objects being compared may reference the same shared sub-object at any level of their structure.

									By default (when no value is specified for the =allowConjoined= property, or when no =optionsOBJ= parameter is specified), two objects being compared will be considered identical even if they are conjoined and reference the same shared sub-object at some level of their structure. Therefore, the statement =Uize.Data.identical (myObjectOBJ,myObjectOBJ)= will return the value =true=.

									Specifying the value =false= for this property will require that object references at any level of the structure of the two objects being compared are unique to each object. So, the statement =Uize.Data.identical (myObjectOBJ,myObjectOBJ,{allowConjoined:false})= would produce the result =false=.

									IMPORTANT
									It should be noted that the two objects being compared could still have references to shared objects at different levels in their structure. To reliably test that two objects are identical and yet completely discrete, one can use the =Uize.Data.clones= static method.

							NOTES
							- see also the =Uize.Data.clones= and =Uize.Data.conjoined= static methods
				*/
			};

			_package.conjoined = function (_object1,_object2) {
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
							Returns a boolean, indicating whether or not the two specified objects share any object references.

							SYNTAX
							...............................................................
							areConjoinedBOOL = Uize.Data.conjoined (object1OBJ,object2OBJ);
							...............................................................

							NOTES
							- =Uize.Data.conjoined (myObjectOBJ,myObjectOBJ)= will return =true=, since they are one and the same (ie. conjoined at the root).
				*/
			};

			_package.clones = function (_object1,_object2) {
				return (
					_package.identical (_object1,_object2,{allowConjoined:_false}) &&
					!_package.conjoined (_object1,_object2)
				);
				/*?
					Static Methods
						Uize.Data.clones
							Returns a boolean, indicating whether or not the two specified objects are identical clones of one another.

							SYNTAX
							.........................................................
							areClonesBOOL = Uize.Data.clones (object1OBJ,object2OBJ);
							.........................................................

							Identical clones have identical structure, possess all the same values for corresponding simple valued properties, but may not share objects (so, object type properties' values may not be shared, either at a corresponding place in their structure, or at different places in their structure).

							NOTES
							- =Uize.Data.clones (myObjectOBJ,myObjectOBJ)= will return =false=, since they are one and the same and not clones.
				*/
			};

			_package.intersection = function (_object1,_object2) {
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
							Returns an object that represents the key-value intersection / commonality between the two specified objects.

							SYNTAX
							.................................................................
							intersectionOBJ = Uize.Data.intersection (object1OBJ,object2OBJ);
							.................................................................

							EXAMPLE
							..................................................................
							var
								employee1 = {
									firstName:'John',
									lastName:'Wilkey',
									startYear:'2008',
									department:'engineering'
								},
								employee2 = {
									firstName:'John',
									lastName:'Henderson',
									startYear:'2008',
									department:'finance'
								},
								employeeInCommon = Uize.Data.intersection (employee1,employee2)
							;
							..................................................................

							In the above example, the variable =employeeInCommon= would have the value ={firstName:'John',startYear:'2008'}=.
				*/
			};

		return _package;
	}
});

