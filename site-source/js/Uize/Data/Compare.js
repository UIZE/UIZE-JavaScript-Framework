/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Compare Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Data.Compare= module provides various utility methods for comparing the contents of data objects.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Compare',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_package,
				_false = false,
				_Infinity = Infinity,
				_Uize_totalKeys = Uize.totalKeys,

			/*** General Variables ***/
				_sacredEmptyObject = {}
		;

		return _package = Uize.package ({
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
						Uize.Data.Compare.identical
							Returns a boolean, indicating whether or not the two specified objects are identical in their contents.

							SYNTAX
							.......................................................................
							areIdenticalBOOL = Uize.Data.Compare.identical (object1OBJ,object2OBJ);
							.......................................................................

							This method recurses through the two objects specified by the =object1OBJ= and =object2OBJ= parameters, testing that they have the same structure and property values. The two parameters can be arbitrarily complex data trees, or simple type values (i.e. string, number, boolean). In order to be considered identical, the two objects must have the same structure and the same values at all levels of their structure.

							VARIATION
							..................................................................................
							areIdenticalBOOL = Uize.Data.Compare.identical (object1OBJ,object2OBJ,optionsOBJ);
							..................................................................................

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

									By default (when no value is specified for the =allowConjoined= property, or when no =optionsOBJ= parameter is specified), two objects being compared will be considered identical even if they are conjoined and reference the same shared sub-object at some level of their structure. Therefore, the statement =Uize.Data.Compare.identical (myObjectOBJ,myObjectOBJ)= will return the value =true=.

									Specifying the value =false= for this property will require that object references at any level of the structure of the two objects being compared are unique to each object. So, the statement =Uize.Data.Compare.identical (myObjectOBJ,myObjectOBJ,{allowConjoined:false})= would produce the result =false=.

									IMPORTANT
									It should be noted that the two objects being compared could still have references to shared objects at different levels in their structure. To reliably test that two objects are identical and yet completely discrete, one can use the =Uize.Data.Compare.clones= static method.

							NOTES
							- see also the =Uize.Data.Compare.clones= and =Uize.Data.Compare.conjoined= static methods
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
						Uize.Data.Compare.conjoined
							Returns a boolean, indicating whether or not the two specified objects share any object references.

							SYNTAX
							.......................................................................
							areConjoinedBOOL = Uize.Data.Compare.conjoined (object1OBJ,object2OBJ);
							.......................................................................

							NOTES
							- =Uize.Data.Compare.conjoined (myObjectOBJ,myObjectOBJ)= will return =true=, since they are one and the same (i.e. conjoined at the root).
				*/
			},

			clones:function (_object1,_object2) {
				return (
					_package.identical (_object1,_object2,{allowConjoined:_false}) &&
					!_package.conjoined (_object1,_object2)
				);
				/*?
					Static Methods
						Uize.Data.Compare.clones
							Returns a boolean, indicating whether or not the two specified objects are identical clones of one another.

							SYNTAX
							.................................................................
							areClonesBOOL = Uize.Data.Compare.clones (object1OBJ,object2OBJ);
							.................................................................

							Identical clones have identical structure, possess all the same values for corresponding simple valued properties, but may not share objects (so, object type properties' values may not be shared, either at a corresponding place in their structure, or at different places in their structure).

							NOTES
							- =Uize.Data.Compare.clones (myObjectOBJ,myObjectOBJ)= will return =false=, since they are one and the same and not clones.
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
						Uize.Data.Compare.intersection
							Returns an object that represents the key-value intersection / commonality between the two specified objects.

							SYNTAX
							.........................................................................
							intersectionOBJ = Uize.Data.Compare.intersection (object1OBJ,object2OBJ);
							.........................................................................

							EXAMPLE
							..........................................................................
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
								employeeInCommon = Uize.Data.Compare.intersection (employee1,employee2)
							;
							..........................................................................

							In the above example, the variable =employeeInCommon= would have the value ={firstName:'John',startYear:'2008'}=.
				*/
			}
		});
	}
});

