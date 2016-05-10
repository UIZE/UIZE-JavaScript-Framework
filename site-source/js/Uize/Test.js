/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 9
	codeCompleteness: 50
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Test= class provides the foundation for a JavaScript Testing Framework, supporting unit testing, functional testing, performance testing, etc.

		*DEVELOPERS:* `Chris van Rensburg`

	### In a Nutshell
		.

*/

Uize.module ({
	name:'Uize.Test',
	superclass:'Uize.Class.Test',
	required:[
		'Uize.Data.Compare',
		'Uize.Json',
		'Uize.Util.Oop'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Util_Oop = _Uize.Util.Oop,

			/*** General Variables ***/
				_isAsync = _superclass.isAsync,
				_splitHostAndProperty
		;

		/*** Utility Functions ***/
			function _valueToJsonSerializer (_value) {
				return function () {return _Uize.Json.to (_value)};
			}

			function _migratedStaticFeaturesTest (_migratedFeatures,_featureType) {
				var _featureTypeIsMethod = _featureType == 'method';
				return {
					title:'Deprecated static ' + (_featureTypeIsMethod ? 'methods' : 'properties') + ' that have been migrated are still supported and map correctly to their new locations',
					test:_Uize.map (
						_migratedFeatures,
						function (_migratedFeature) {
							var
								_oldName = _migratedFeature [0],
								_newName = _migratedFeature [1]
							;
							return {
								title:'The deprecated ' + _oldName + ' static ' + _featureType + ' still exists and is simply a reference to the new ' + _newName + ' static ' + _featureType,
								test:function () {
									function _getStatic (_staticName) {
										var _hostAndProperty = _splitHostAndProperty (_staticName);
										return _Uize.getModuleByName (_hostAndProperty.host) [_hostAndProperty.property];
									}
									var _newStatic = _getStatic (_newName);
									return (
										(!_featureTypeIsMethod || this.expectFunction (_newStatic)) &&
										this.expectSameAs (_getStatic (_oldName),_newStatic)
									);
								}
							};
						}
					)
				};
			}

		/*** Private Instance Methods ***/
			function _expectSuccess (m,_succeeded,_serializeExpected,_serializeActual) {
				_succeeded ||
					m.set ({
						reasonForFailure:
							'EXPECTED:\n\n' +
							(_Uize.isFunction (_serializeExpected) ? _serializeExpected () : _serializeExpected) + '\n\n' +
							'ACTUAL:\n\n' +
							_serializeActual ()
					})
				;
				return _succeeded;
			}

		return _superclass.subclass ({
			instanceMethods:{
				expect:function (_expectedValue,_value) {
					return _expectSuccess (
						this,
						_Uize.Data.Compare.identical (_expectedValue,_value),
						_valueToJsonSerializer (_expectedValue),
						_valueToJsonSerializer (_value)
					);
					/*?
						Instance Methods
							expect
								Returns a boolean value, indicating whether or not the specified actual value is identical to the specified expected value.

								SYNTAX
								...............................................................
								resultBOOL = myTest.expect (expectedValueANYTYPE,valueANYTYPE);
								...............................................................

								Identical, Not Same
									When comparing the values of the =expectedValueANYTYPE= and =valueANYTYPE= parameters, the values are compared for identical contents, but not sameness of object references.

									So, for example, the statement =myTest.expect ({foo:'bar'},{foo:'bar'})= would return the value =true=, even though the values of the =expectedValueANYTYPE= and =valueANYTYPE= parameters would be references to different anonymous objects. In cases where you wish to test for sameness, you can use the =expectSameAs= instance method.

								NOTES
								- compare to the =expectSameAs= instance method
								- this method is one of the many available `expectation methods`
					*/
				},


				expectNotIdentical:function (_expectedValue,_value) {
					return _expectSuccess (
						this,
						!_Uize.Data.Compare.identical (_expectedValue,_value),
						_valueToJsonSerializer (_expectedValue),
						_valueToJsonSerializer (_value)
					);
					/*?
						Instance Methods
							expectNotIdentical
								Returns a boolean value, indicating whether or not the specified actual value is not identical to the specified expected value.

								SYNTAX
								...........................................................................
								resultBOOL = myTest.expectNotIdentical (expectedValueANYTYPE,valueANYTYPE);
								...........................................................................

								NOTES
								- compare to the =expect= and =expectNotSameAs= instance methods
								- this method is one of the many available `expectation methods`
					*/
				},

				expectSameAs:function (_expectedValue,_value) {
					return _expectSuccess (
						this,
						_Uize.isSameAs (_value,_expectedValue),
						_valueToJsonSerializer (_expectedValue),
						_valueToJsonSerializer (_value)
					);
					/*?
						Instance Methods
							expectSameAs
								Returns a boolean value, indicating whether or not the specified actual value is exactly equal to the specified expected value.

								SYNTAX
								.....................................................................
								resultBOOL = myTest.expectSameAs (expectedValueANYTYPE,valueANYTYPE);
								.....................................................................

								Same, Not Identical
									When comparing the values of the =expectedValueANYTYPE= and =valueANYTYPE= parameters, the values are compared using a sameness (strict equality) test, so contents of arrays or objects are not compared.

									So, for example, the statement =myTest.expectSameAs ({foo:'bar'},{foo:'bar'})= would return the value =false=, even though the contents of the objects specified by the =expectedValueANYTYPE= and =valueANYTYPE= parameters are identical. Because the two values are compared using a strict equality, and because the two values would be references to different anonymous objects, they are not considered the same. In cases where you wish to test for identical contents of arrays or objects and not sameness of object references, you can use the =expect= instance method.

								NOTES
								- compare to the =expect= instance method
								- this method is one of the many available `expectation methods`
					*/
				},

				expectNotSameAs:function (_expectedNotSameAsValue,_value) {
					return _expectSuccess (
						this,
						!_Uize.isSameAs (_value,_expectedNotSameAsValue),
						function () {return 'not same as ' + _Uize.Json.to (_expectedNotSameAsValue)},
						_valueToJsonSerializer (_value)
					);
				},

				expectNonNull:function (_value) {
					return _expectSuccess (
						this,
						_value != null,
						'value that is not null or undefined',
						_valueToJsonSerializer (_value)
					);
					/*?
						Instance Methods
							expectNonNull
								Returns a boolean, indicating whether or not the specified value is non-null (i.e. not =null= or =undefined=).

								SYNTAX
								.................................................
								resultBOOL = myTest.expectNonNull (valueANYTYPE);
								.................................................

								This method tests whether or not a value is non-null. Any value other than =null= or =undefined= is considered non-null. So, the boolean value =false=, the number value =0=, the string value =''= (empty string), the object value ={}= (empty object), and the array value =[]= (empty array) are all considered non-null.

								EXAMPLES
								.......................................................
								// when called with non-null values...

								myTest.expectNonNull (1);              // returns true
								myTest.expectNonNull (0);              // returns true
								myTest.expectNonNull ('blah');         // returns true
								myTest.expectNonNull ('');             // returns true
								myTest.expectNonNull (true);           // returns true
								myTest.expectNonNull (false);          // returns true
								myTest.expectNonNull ({foo:'bar'});    // returns true
								myTest.expectNonNull ({});             // returns true
								myTest.expectNonNull (['foo','bar']);  // returns true
								myTest.expectNonNull ([]);             // returns true

								// when called with null values...

								myTest.expectNonNull (null);           // returns false
								myTest.expectNonNull (undefined);      // returns false
								.......................................................

								NOTES
								- this method is one of the many available `expectation methods`
					*/
				},

				expectNully:function (_value) {
					return _expectSuccess (
						this,
						_value == null,
						'value that is null or undefined',
						_valueToJsonSerializer (_value)
					);
					/*?
						Instance Methods
							expectNully
								Returns a boolean, indicating whether or not the specified value is null (i.e. =null= or =undefined=).

								SYNTAX
								...............................................
								resultBOOL = myTest.expectNully (valueANYTYPE);
								...............................................

								This method tests whether or not a value is null. Both =null= and =undefined= are considered null.

								EXAMPLES
								.......................................................
								// when called with null values...

								myTest.expectNully (null);           // returns true
								myTest.expectNully (undefined);      // returns true

								// when called with non-null values...

								myTest.expectNully (1);              // returns false
								myTest.expectNully (0);              // returns false
								myTest.expectNully ('blah');         // returns false
								myTest.expectNully ('');             // returns false
								myTest.expectNully (true);           // returns false
								myTest.expectNully (false);          // returns false
								myTest.expectNully ({foo:'bar'});    // returns false
								myTest.expectNully ({});             // returns false
								myTest.expectNully (['foo','bar']);  // returns false
								myTest.expectNully ([]);             // returns false
								.......................................................

								NOTES
								- this method is one of the many available `expectation methods`
					*/
				},

				/*** methods for instance type expectations ***/
					expectInstanceOf:function (_class,_value) {
						return _expectSuccess (
							this,
							_value != undefined &&
							_value.constructor == _Uize.getModuleByName (_class),
							function () {return 'instance of ' + _Uize_Util_Oop.getClassName (_class)},
							function () {return 'instance of ' + _Uize_Util_Oop.getClassName (_value.constructor)}
						);
						/*?
							Instance Methods
								expectInstanceOf
									Returns a boolean, indicating whether or not the specified value is an instance of the specified class.

									SYNTAX
									..................................................................
									resultBOOL = myTest.expectInstanceOf (classOBJorSTR,valueANYTYPE);
									..................................................................

									The value of the =classOBJorSTR= parameter can be an object, being a reference to the expected class, or a string representing the globally accessible name of the class' constructor (='Function'=, ='String'=, ='RegExp'=, ='Uize.Widget.Bar.Slider'=, etc.).

									What Qualifies as an Instance Of?
										A value specified for the =valueANYTYPE= parameter will be considered to be an instance of a specified class when the following conditions are met...

										- the value is non-null
										- the value of the value's =constructor= property is a reference to the class

									Built-in Objects Supported
										The "class" specified by the =classOBJorSTR= parameter can be a built-in JavaScript object (such as =Function=) or a =Uize.Class= subclass.

										So, for example, the statement =myTest.expectInstanceOf (RegExp,/^\s+$/)= would return the value =true=.

									Uize Subclasses Supported
										The class specified by the =classOBJorSTR= parameter can be a =Uize.Class= subclass.

										So, for example, the statement =myTest.expectInstanceOf (Uize.Widget.Bar,Uize.Widget.Bar ())= would return the value =true=.

									Instances of Subclasses Don't Qualify
										A value will *not* be considered to be an instance of a specified class if it is, in fact, an instance of a *subclass* of the specified class.

										So, for example, the statement =myTest.expectInstanceOf (Uize.Widget,Uize.Widget.Bar ())= would return the value =false=.

									Expecting Arrays or Regular Expressions
										While you can use the =expectInstanceOf= method to test for instances of arrays or regular expressions, there are dedicated `expectation methods` to test for instances of those built-in JavaScript objects.

										To test for instances of the =Array= object, you can use the =expectArray= instance method. So, the statement =myTest.expectInstanceOf (Array,['foo','bar'])= would be equivalent to the more concise statement =myTest.expectArray (['foo','bar'])=. Similarly, the statement =myTest.expectInstanceOf (RegExp,/^\s+$/)= would be equivalent to the more concise statement =myTest.expectRegExp (/^\s+$/)=.

									Null Is Not An Instance of Object
										While JavaScript's =typeof= operator will return the value ='object'= for the value =null=, the =expectInstanceOf= method does not consider =null= to be an instance of =Object= (mainly because it's not).

										So, the statement =myTest.expectType ('object',null)= will return the value =true=, while the statement =myTest.expectInstanceOf (Object,null)= will return the value =false=.

									Primitives Are Instances, Too
										While JavaScript's built-in =instanceof= operator fails to recognize primitive values as instances of the underlying built-in objects that implement their behavior, the =expectInstanceOf= method *does* recognize such primitives as instances.

										This is because the =expectInstanceOf= method tests to see if the =constructor= property of the value is a reference to the expected class. So, for example, while the statement ='foo' instanceof String= would produce the value =false=, the statement =myTest.expectInstanceOf (String,'foo')= would return the value =true=. This same rule applies also to number and boolean primitives. Also, both of the statements =myTest.expectInstanceOf (String,'foo')= and =myTest.expectInstanceOf (String,new String ('foo'))= would return the value =true=.

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

				/*** methods for type expectations ***/
					expectType:function (_expectedType,_value) {
						return _expectSuccess (
							this,
							typeof _value == _expectedType,
							function () {return 'type ' + _expectedType},
							function () {return 'type ' + typeof _value}
						);
						/*?
							Instance Methods
								expectType
									Returns a boolean, indicating whether or not the specified value is of the specified type.

									SYNTAX
									......................................................
									resultBOOL = myTest.expectType (typeSTR,valueANYTYPE);
									......................................................

									Primitives Versus Instances
										The =expectType= method uses JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of JavaScript's built-in =String=, =Number=, and =Boolean= objects are all considered of type ='object'=. So, the statement =myTest.expectType ('string',new String ('foo'))= will return the value =false=, while the statement =myTest.expectType ('object',new String ('foo'))= will return the value =true=. In contrast, the statement =myTest.expectInstanceOf (String,new String ('foo'))= would return the value =true=, while the statement =myTest.expectInstanceOf (String,'foo')= would also return the value =true=.

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

					expectArray:function (_value) {
						return this.expectInstanceOf (Array,_value);
						/*?
							Instance Methods
								expectArray
									Returns a boolean, indicating whether or not the specified value is an instance of JavaScript's built-in =Array= object.

									SYNTAX
									...............................................
									resultBOOL = myTest.expectArray (valueANYTYPE);
									...............................................

									Array, Not Array-like
										The =expectArray= method tests specifically whether or not the value is an instance of the =Array= object.

										So, in other words, the statement =myTest.expectArray ([])= is equivalent to the statement =myTest.expectInstanceOf (Array,[])=. This method will return the value =false= for values that are only array-like and that are not strictly =Array= instances. An example of an array-like value is a reference to a function's =arguments=. In order to test more broadly for array-like values, you can use the =expectArrayLike= instance method. The statement =myTest.expectArray (arguments)= would return the value =false=, while the statement =myTest.expectArrayLike (arguments)= would return the value =true=.

									NOTES
									- see the related =expectArrayLike= instance method
									- this method is one of the many available `expectation methods`
						*/
					},

					expectBoolean:function (_value) {
						return this.expectType ('boolean',_value);
						/*?
							Instance Methods
								expectBoolean
									Returns a boolean, indicating whether or not the specified value is a boolean primitive (i.e. of type ='boolean'=).

									SYNTAX
									.................................................
									resultBOOL = myTest.expectBoolean (valueANYTYPE);
									.................................................

									Boolean Type, Not Boolean Object Instance
										The =expectBoolean= method uses JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of JavaScript's built-in =Boolean= object are considered of type ='object'= - *not* type ='boolean'=. So, the statement =myTest.expectBoolean (new Boolean (false))= will return the value =false=, while the statement =myTest.expectBoolean (false)= will return the value =true=. In contrast, the statement =myTest.expectInstanceOf (Boolean,new Boolean (false))= would return the value =true=, while the statement =myTest.expectInstanceOf (Boolean,false)= would also return the value =true=.

									NOTES
									- see the related =expectType= and =expectInstanceOf= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectFunction:function (_value) {
						return this.expectType ('function',_value);
						/*?
							Instance Methods
								expectFunction
									Returns a boolean, indicating whether or not the specified value is a function (i.e. of type ='function'=).

									SYNTAX
									..................................................
									resultBOOL = myTest.expectFunction (valueANYTYPE);
									..................................................

									Examples of things that would test true as functions include...

									- static methods (because they are functions)
									- instance methods (because they are functions)
									- anonymous functions
									- functions created using the =Function= constructor
									- constructors for the built-in JavaScript objects, such as =String=, =Boolean=, =Number=, =RegExp=, =Function=, etc.
									- pure =Uize= namespace modules, such as =Uize.Dom=, =Uize.Util=, etc.
									- package modules, such as =Uize.Data.Diff=, =Uize.Dom.Basics=, etc.
									- class modules, such as =Uize.Class=, =Uize.Fade=, =Uize.Widget=, etc.

									EXAMPLE
									............................................................................
									myTest.expectFunction (Uize.copyInto);                       // returns true
									myTest.expectFunction (myTest.expectFunction);               // returns true
									myTest.expectFunction (function (value) {alert (value)});    // returns true
									myTest.expectFunction (Function ('value','alert (value')));  // returns true
									myTest.expectFunction (Date);                                // returns true
									myTest.expectFunction (Uize.Util);                           // returns true
									myTest.expectFunction (Uize.Dom.Basics);                     // returns true
									myTest.expectFunction (Uize.Widget);                         // returns true
									............................................................................

									NOTES
									- see the related =expectType= and =expectInstanceOf= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNumber:function (_value) {
						return this.expectType ('number',_value);
						/*?
							Instance Methods
								expectNumber
									Returns a boolean, indicating whether or not the specified value is a number primitive (i.e. of type ='number'=).

									SYNTAX
									................................................
									resultBOOL = myTest.expectNumber (valueANYTYPE);
									................................................

									Number Type, Not Number Object Instance
										The =expectNumber= method uses JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of JavaScript's built-in =Number= object are considered of type ='object'= - *not* type ='number'=. So, the statement =myTest.expectNumber (new Number (0))= will return the value =false=, while the statement =myTest.expectNumber (0)= will return the value =true=. In contrast, the statement =myTest.expectInstanceOf (Number,new Number (0))= would return the value =true=, while the statement =myTest.expectInstanceOf (Number,0)= would also return the value =true=.

									EXAMPLES
									.......................................................
									myTest.expectNumber (1);               // returns true
									myTest.expectNumber (0);               // returns true
									myTest.expectNumber (NaN);             // returns true
									myTest.expectNumber (Infinity);        // returns true
									myTest.expectNumber (new Number (5));  // returns false
									.......................................................

									NOTES
									- see the related =expectType= and =expectInstanceOf= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectObject:function (_value) {
						return this.expectType ('object',_value);
						/*?
							Instance Methods
								expectObject
									Returns a boolean, indicating whether or not the specified value is an object (i.e. of type ='object'=).

									SYNTAX
									................................................
									resultBOOL = myTest.expectObject (valueANYTYPE);
									................................................

									Not Only Object Instances Are Object Type
										The =expectObject= method uses JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of many of JavaScript's built-in objects (such as the =Date=, =RegExp=, =Number=, =Boolean=, and =String= objects) are considered of type ='object'= - not just instances of the built-in =Object= object. In addition, the value =null= is considered to be of type ='object'=. If you want to test specifically whether or not a value is an instance of the =Object= object, then you should use a statement like =myTest.expectInstanceOf (Object,value)=.

									EXAMPLES
									..........................................................................
									myTest.expectObject ({});                                 // returns true
									myTest.expectObject ({foo:'bar'});                        // returns true
									myTest.expectObject (new Object);                         // returns true
									myTest.expectObject ([]);                                 // returns true
									myTest.expectObject (['foo','bar']);                      // returns true
									myTest.expectObject (/^\s+$/);                            // returns true
									myTest.expectObject (new Boolean (false));                // returns true
									myTest.expectObject (Uize.Widget.Bar.Slider ());          // returns true
									myTest.expectObject (null);                               // returns true

									myTest.expectObject (undefined);                          // returns false
									myTest.expectObject (function (value) {alert (value)});   // returns false
									myTest.expectObject (Function ('value','alert (value)');  // returns false
									..........................................................................

									NOTES
									- see the related =expectType= and =expectInstanceOf= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectRegExp:function (_value) {
						return this.expectInstanceOf (RegExp,_value);
						/*?
							Instance Methods
								expectRegExp
									Returns a boolean, indicating whether or not the specified value is an instance of JavaScript's built-in =RegExp= object.

									SYNTAX
									................................................
									resultBOOL = myTest.expectRegExp (valueANYTYPE);
									................................................

									Because the =expectRegExp= method tests whether or not the value is an instance of the =RegExp= object, the statement =myTest.expectRegExp (/^\s+$/)= would be equivalent to the statement =myTest.expectInstanceOf (RegExp,/^\s+$/)=.

									EXAMPLES
									..............................................................
									myTest.expectObject (/^\s+$/);                // returns true
									myTest.expectObject (new RegExp);             // returns true
									myTest.expectObject (new RegExp ('^\\s+$'));  // returns true

									myTest.expectObject ('^\\s+$');               // returns false
									..............................................................

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

					expectString:function (_value) {
						return this.expectType ('string',_value);
						/*?
							Instance Methods
								expectString
									Returns a boolean, indicating whether or not the specified value is a string primitive (i.e. of type ='string'=).

									SYNTAX
									................................................
									resultBOOL = myTest.expectString (valueANYTYPE);
									................................................

									String Type, Not String Object Instance
										The =expectString= method uses JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of JavaScript's built-in =String= object are considered of type ='object'= - *not* type ='string'=. So, the statement =myTest.expectString (new String ('foo'))= will return the value =false=, while the statement =myTest.expectString ('foo')= will return the value =true=. In contrast, the statement =myTest.expectInstanceOf (String,new String ('foo'))= would return the value =true=, while the statement =myTest.expectInstanceOf (String,'foo')= would also return the value =true=.

									NOTES
									- see the related =expectType= and =expectInstanceOf= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

				/*** methods for type-like expectations ***/
					expectArrayLike:function (_value) {
						return (
							this.expectObject (_value) &&
							this.expectNonNull (_value) &&
							this.expectLengthInRange (0,Infinity,_value.length)
						);
						/*?
							Instance Methods
								expectArrayLike
									Returns a boolean, indicating whether or not the specified value is array-like.

									SYNTAX
									...................................................
									resultBOOL = myTest.expectArrayLike (valueANYTYPE);
									...................................................

									A value is regarded as array-like when the following conditions are met...

									- the value is of type ='object'=
									- the value is non-null
									- the value's =length= property is a positive number

									Array-like Includes Array
										Array-like values can be considered a superset that includes strict Array values.

										So, in other words, while the statement =myTest.expectArray ([])= would return the value =true= but the statement =myTest.expectArray (arguments)= would return the value =false=, *both* the statements =myTest.expectArrayLike ([])= and =myTest.expectArrayLike (arguments)= would return the value =true=. In order to test specifically for =Array= instance values, you should use the =expectArray= instance method.

									NOTES
									- see the related =expectArray= instance method
									- this method is one of the many available `expectation methods`
						*/
					},

				/*** methods for range expectations ***/
					expectInRange:function (_minValue,_maxValue,_value) {
						return _expectSuccess (
							this,
							_Uize.constrain (_value,_minValue,_maxValue) === _value,
							function () {return 'value within range ' + _minValue + ' to ' + _maxValue},
							_valueToJsonSerializer (_value)
						);
						/*?
							Instance Methods
								expectInRange
									Returns a boolean, indicating whether or not the specified value is in the specified range.

									SYNTAX
									.................................................................................
									resultBOOL = myTest.expectInRange (minValueANYTYPE,maxValueANYTYPE,valueANYTYPE);
									.................................................................................

									Multiple Types Supported
										The =expectInRange= method uses JavaScript's built-in less =<&#61;= (less than or equal to) and =>&#61;= (greater than or equal to) operators in comparing the specified value to the range boundary values.

										This means that the type of the =minValueANYTYPE=, =maxValueANYTYPE=, and =valueANYTYPE= parameters can be any type that can be compared using those operators. So, a number can be tested to see if it lies within a numerical range, a string can be tested to see if it lies in an ASCIIbetical range, a date can be tested to see if it lies within a date range, etc.

										EXAMPLES
										.........................................................................
										// range boundaries and value are strings

											myTest.expectInRange ('betty','samantha','annette');  // returns false
											myTest.expectInRange ('betty','samantha','kelly');    // returns true
											myTest.expectInRange ('betty','samantha','wynona');   // returns false


										// range boundaries are boolean, value is number

											myTest.expectInRange (false,true,-1);   // returns false
											myTest.expectInRange (false,true,0);    // returns true
											myTest.expectInRange (false,true,.5);   // returns true
											myTest.expectInRange (false,true,1);    // returns true
											myTest.expectInRange (false,true,1.5);  // returns false


										// range boundaries and value are date objects

											myTest.expectInRange (       // returns false
												new Date ('2010-01-31'),
												new Date ('2010-12-01'),
												new Date ('2010-01-15')
											);
											myTest.expectInRange (       // returns true
												new Date ('2010-01-31'),
												new Date ('2010-12-01'),
												new Date ('2010-05-13')
											);
											myTest.expectInRange (       // returns false
												new Date ('2010-01-31'),
												new Date ('2010-12-01'),
												new Date ('2010-12-22')
											);


										// range boundaries and value are class instances

											myTest.expectInRange (    // returns false
												Uize.Class ({value:0}),
												Uize.Class ({value:1}),
												Uize.Class ({value:-1})
											);
											myTest.expectInRange (    // returns true
												Uize.Class ({value:0}),
												Uize.Class ({value:1}),
												Uize.Class ({value:.5})
											);
											myTest.expectInRange (    // returns false
												Uize.Class ({value:0}),
												Uize.Class ({value:1}),
												Uize.Class ({value:1.5})
											);
										.........................................................................

									Range Boundary Order Unimportant
										When specifying a value range, the order of the boundaries is unimportant.

										So, while it is customary to specify minimum value first and maximum value second, the order can be reversed. For example, the statement =myTest.expectNumberInRange (0,100,value)= would be equivalent to the statement =myTest.expectNumberInRange (100,0,value)=. This is particularly useful when the range values are determined programmatically and the first value is not guaranteed to be lower than the second value.

										EXAMPLE
										.................................................
										myTest.expectInRange (100,0,50);  // returns true
										.................................................

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNumberInRange:function (_minValue,_maxValue,_value) {
						return this.expectNumber (_value) && this.expectInRange (_minValue,_maxValue,_value);
						/*?
							Instance Methods
								expectNumberInRange
									Returns a boolean, indicating whether or not the specified value is a number that falls within the specified range.

									SYNTAX
									...............................................................................
									resultBOOL = myTest.expectNumberInRange (minValueNUM,maxValueNUM,valueANYTYPE);
									...............................................................................

									The =expectNumberInRange= method uses the =expectNumber= and =expectInRange= methods in its implementation. The statement =myTest.expectNumberInRange (value,0,100)= would be equivalent to the statement =myTest.expectNumber (value) && myTest.expectInRange (0,100,value)=.

									Range Boundary Order Unimportant
										When specifying a value range, the order of the boundaries is unimportant.

										So, while it is customary to specify minimum value first and maximum value second, the order can be reversed. For example, the statement =myTest.expectNumberInRange (0,100,value)= would be equivalent to the statement =myTest.expectNumberInRange (100,0,value)=. This is particularly useful when the range values are determined programmatically and the first value is not guaranteed to be lower than the second value.

									EXAMPLES
									.....................................................................
									myTest.expectNumberInRange (0,100,0);                // returns true
									myTest.expectNumberInRange (0,100,100);              // returns true
									myTest.expectNumberInRange (0,100,50);               // returns true
									myTest.expectNumberInRange (100,0,50);               // returns true

									myTest.expectNumberInRange (0,100,-1);               // returns false
									myTest.expectNumberInRange (0,100,101);              // returns false
									myTest.expectNumberInRange (0,100,'50');             // returns false
									myTest.expectNumberInRange (0,100,true);             // returns false
									myTest.expectNumberInRange (0,100,new Number (50));  // returns false
									.....................................................................

									NOTES
									- see the related =expectNegativeNumber=, =expectPositiveNumber=, =expectNegativeInteger=, =expectPositiveInteger=, and =expectIntegerInRange= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					/*** convenience methods for negative and positive value ranges ***/
						expectNegativeNumber:function (_value) {
							return this.expectNumberInRange (-Infinity,0,_value);
							/*?
								Instance Methods
									expectNegativeNumber
										Returns a boolean, indicating whether or not the specified value is a negative number.

										SYNTAX
										........................................................
										resultBOOL = myTest.expectNegativeNumber (valueANYTYPE);
										........................................................

										A value will be considered to be a negative number when the following conditions are met...

										- the value is of type ='number'=
										- the value is in the range of =-Infinity= to =0= (=0= is considered both a negative *and* a positive number)

										The =expectNegativeNumber= method uses the =expectNumberInRange= method in its implementation. The statement =myTest.expectNegativeNumber (value)= would be equivalent to the statement =myTest.expectNumberInRange (-Infinity,0,value)=.

										EXAMPLE
										........................................................................
										myTest.expectNegativeNumber (0);                        // returns true
										myTest.expectNegativeNumber (-.5);                      // returns true
										myTest.expectNegativeNumber (-Infinity);                // returns true

										myTest.expectNegativeNumber (1.333);                    // returns false
										myTest.expectNegativeNumber ('-5');                     // returns false
										myTest.expectNegativeNumber (Uize.Class ({value:-5}));  // returns false
										........................................................................

										NOTES
										- see the companion =expectPositiveNumber= instance method
										- see the related =expectNegativeInteger=, =expectPositiveInteger=, =expectIntegerInRange=, and =expectNumberInRange= instance methods
										- this method is one of the many available `expectation methods`
							*/
						},

						expectPositiveNumber:function (_value) {
							return this.expectNumberInRange (0,Infinity,_value);
							/*?
								Instance Methods
									expectPositiveNumber
										Returns a boolean, indicating whether or not the specified value is a positive number.

										SYNTAX
										........................................................
										resultBOOL = myTest.expectPositiveNumber (valueANYTYPE);
										........................................................

										A value will be considered to be a positive number when the following conditions are met...

										- the value is of type ='number'=
										- the value is in the range of =0= to =Infinity= (=0= is considered both a positive *and* a positive number)

										The =expectPositiveNumber= method uses the =expectNumberInRange= method in its implementation. The statement =myTest.expectPositiveNumber (value)= would be equivalent to the statement =myTest.expectNumberInRange (0,Infinity,value)=.

										EXAMPLE
										.......................................................................
										myTest.expectPositiveNumber (0);                       // returns true
										myTest.expectPositiveNumber (5);                       // returns true
										myTest.expectPositiveNumber (Infinity);                // returns true

										myTest.expectPositiveNumber (-1.333);                  // returns false
										myTest.expectPositiveNumber ('5');                     // returns false
										myTest.expectPositiveNumber (Uize.Class ({value:5}));  // returns false
										.......................................................................

										NOTES
										- see the companion =expectNegativeNumber= instance method
										- see the related =expectNegativeInteger=, =expectPositiveInteger=, =expectIntegerInRange=, and =expectNumberInRange= instance methods
										- this method is one of the many available `expectation methods`
							*/
						},

					expectLengthInRange:function (_minLength,_maxLength,_value) {
						var _valueLength = _value.length;
						return _expectSuccess (
							this,
							_Uize.constrain (_valueLength,_minLength,_maxLength) === _valueLength,
							function () {return 'length within range ' + _minLength + ' to ' + _maxLength},
							function () {return _valueLength}
						);
						/*?
							Instance Methods
								expectLengthInRange
									Returns a boolean, indicating whether or not the length of the specified value falls into the specified length range.

									SYNTAX
									.................................................................................
									resultBOOL = myTest.expectLengthInRange (minLengthNUM,maxLengthNUM,valueANYTYPE);
									.................................................................................

									Multiple Types Supported
										The =expectLengthInRange= method supports any type of value for the =valueANYTYPE= parameter, provided that the value has a =length= property.

										So, the =expectLengthInRange= method can be used to test whether or not a string's length falls within a specific range, whether or not an array's length falls within a specific range, or whether or not the value of the =length= property for any value falls within a range.

										EXAMPLES
										.....................................................................
										// value with length property is string

											myTest.expectLengthInRange (1,10,'Cleopatra');    // returns true
											myTest.expectLengthInRange (1,10,'Amanda');       // returns true
											myTest.expectLengthInRange (1,10,'Margueritta');  // returns false
											myTest.expectLengthInRange (1,10,'');             // returns false


										// value with length property is array

											myTest.expectLengthInRange (1,5,[1,2,3,4,5]);     // returns true
											myTest.expectLengthInRange (1,5,[1,2,3]);         // returns true
											myTest.expectLengthInRange (1,5,[1]);             // returns true
											myTest.expectLengthInRange (1,5,[1,2,3,4,5,6]);   // returns false
											myTest.expectLengthInRange (1,5,[]);              // returns false


										// value with length property is object

											myTest.expectLengthInRange (5,10,{length:10});    // returns true
											myTest.expectLengthInRange (5,10,{length:5});     // returns true
											myTest.expectLengthInRange (5,10,{length:11});    // returns false
											myTest.expectLengthInRange (5,10,{length:4});     // returns false
										.....................................................................

									Range Boundary Order Unimportant
										When specifying a value range, the order of the boundaries is unimportant.

										So, while it is customary to specify minimum value first and maximum value second, the order can be reversed. For example, the statement =myTest.expectLengthInRange (1,10,'Amanda')= would be equivalent to the statement =myTest.expectLengthInRange (10,1,'Amanda')=. This is particularly useful when the range values are determined programmatically and the first value is not guaranteed to be lower than the second value.

										EXAMPLE
										............................................................
										myTest.expectLengthInRange (10,1,'Amanda');  // returns true
										............................................................

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

					expectEmpty:function (_value) {
						return _expectSuccess (this,_Uize.isEmpty (_value),'empty',_valueToJsonSerializer (_value));
						/*?
							Instance Methods
								expectEmpty
									Returns a boolean, indicating whether or not the specified value is regarded as being empty.

									SYNTAX
									...............................................
									resultBOOL = myTest.expectEmpty (valueANYTYPE);
									...............................................

									A value specified for the =valueANYTYPE= parameter will be considered empty if it is any of the following...

									- =null=
									- =undefined=
									- =NaN= (the special not-a-number value)
									- =false=
									- =0=
									- =''= (empty string)
									- =[]= (empty array)
									- ={}= (empty object)

									NOTES
									- see also the more specific =expectEmptyArray=, =expectEmptyObject=, and =expectEmptyString= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNonEmpty:function (_value) {
						return _expectSuccess (this,!_Uize.isEmpty (_value),'non-empty',_valueToJsonSerializer (_value));
						/*?
							Instance Methods
								expectNonEmpty
									Returns a boolean, indicating whether or not the specified value is regarded as being empty.

									SYNTAX
									..................................................
									resultBOOL = myTest.expectNonEmpty (valueANYTYPE);
									..................................................

									A value specified for the =valueANYTYPE= parameter will be considered empty if it is any of the following...

									- =null=
									- =undefined=
									- =NaN= (the special not-a-number value)
									- =false=
									- =0=
									- =''= (empty string)
									- =[]= (empty array)
									- ={}= (empty object)

									NOTES
									- see also the more specific =expectNonEmptyArray=, =expectNonEmptyObject=, and =expectNonEmptyString= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

				/*** convenience methods for compound expectations ***/
					expectInteger:function (_value) {
						return (
							this.expectNumber (_value) &&
							_expectSuccess (this,Math.floor (_value) == _value,'integer',_valueToJsonSerializer (_value))
						);
						/*?
							Instance Methods
								expectInteger
									Returns a boolean, indicating whether or not the specified value is an integer.

									SYNTAX
									.................................................
									resultBOOL = myTest.expectInteger (valueANYTYPE);
									.................................................

									A value specified for the =valueANYTYPE= parameter will be considered to be an integer when the following conditions are met...

									- the value is of type ='number'=
									- the value does not have a fractional component

									EXAMPLES
									.................................................................
									myTest.expectInteger (10);                       // returns true
									myTest.expectInteger (0);                        // returns true
									myTest.expectInteger (-10);                      // returns true
									myTest.expectInteger (Infinity);                 // returns true

									myTest.expectInteger (10.5);                     // returns false
									myTest.expectInteger ('10');                     // returns false
									myTest.expectInteger (new Number (10));          // returns false
									myTest.expectInteger (Uize.Class ({value:10}));  // returns false
									myTest.expectInteger (NaN);                      // returns false
									.................................................................

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

					expectIntegerInRange:function (_minValue,_maxValue,_value) {
						return this.expectInteger (_value) && this.expectInRange (_minValue,_maxValue,_value);
						/*?
							Instance Methods
								expectIntegerInRange
									Returns a boolean, indicating whether or not the specified value is an integer that falls within the specified range.

									SYNTAX
									................................................................................
									resultBOOL = myTest.expectIntegerInRange (minValueNUM,maxValueNUM,valueANYTYPE);
									................................................................................

									The =expectIntegerInRange= method uses the =expectInteger= and =expectInRange= methods in its implementation. The statement =myTest.expectIntegerInRange (0,100,value)= would be equivalent to the statement =myTest.expectInteger (value) && myTest.expectInRange (0,100,value)=.

									Range Boundary Order Unimportant
										When specifying a value range, the order of the boundaries is unimportant.

										So, while it is customary to specify minimum value first and maximum value second, the order can be reversed. For example, the statement =myTest.expectIntegerInRange (0,100,value)= would be equivalent to the statement =myTest.expectIntegerInRange (100,0,value)=. This is particularly useful when the range values are determined programmatically and the first value is not guaranteed to be lower than the second value.

									Range Boundaries Can Be Floating Point
										While the =expectIntegerInRange= method tests, for one thing, that the value of the =valueANYTYPE= parameter is an integer, it is *not* required that the range boundary values be integers.

										So, for example, the statement =myTest.expectIntegerInRange (0,100.25,100)= would return the value =true=, because the value =100= *is* in the range of =0= to =100.25=.

									EXAMPLES
									.......................................................................
									myTest.expectIntegerInRange (0,100,0);                 // returns true
									myTest.expectIntegerInRange (0,100,100);               // returns true
									myTest.expectIntegerInRange (0,100,50);                // returns true
									myTest.expectIntegerInRange (100,0,50);                // returns true
									myTest.expectIntegerInRange (0,100.25,100);            // returns true

									myTest.expectIntegerInRange (100,0,.5);                // returns false
									myTest.expectIntegerInRange (0,100,-1);                // returns false
									myTest.expectIntegerInRange (0,100,101);               // returns false
									myTest.expectIntegerInRange (0,100,'.5');              // returns false
									myTest.expectIntegerInRange (0,100,true);              // returns false
									myTest.expectIntegerInRange (0,100,new Number (.5));   // returns false
									.......................................................................

									NOTES
									- see the related =expectNegativeNumber=, =expectPositiveNumber=, =expectNegativeInteger=, =expectPositiveInteger=, and =expectNumberInRange= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNegativeInteger:function (_value) {
						return this.expectInteger (_value) && this.expectNegative (_value);
						/*?
							Instance Methods
								expectNegativeInteger
									Returns a boolean, indicating whether or not the specified value is a negative integer.

									SYNTAX
									.........................................................
									resultBOOL = myTest.expectNegativeInteger (valueANYTYPE);
									.........................................................

									A value will be considered to be a negative integer when the following conditions are met...

									- the value is of type ='number'=
									- the value does not have a fractional component
									- the value is in the range of =-Infinity= to =0= (=0= is considered both a negative *and* a positive number)

									The =expectNegativeInteger= method uses the =expectIntegerInRange= method in its implementation. The statement =myTest.expectNegativeInteger (value)= would be equivalent to the statement =myTest.expectIntegerInRange (-Infinity,0,value)=.

									EXAMPLE
									.........................................................................
									myTest.expectNegativeInteger (0);                        // returns true
									myTest.expectNegativeInteger (-1);                       // returns true
									myTest.expectNegativeInteger (-Infinity);                // returns true

									myTest.expectNegativeInteger (-1.5);                     // returns false
									myTest.expectNegativeInteger ('-1');                     // returns false
									myTest.expectNegativeInteger (Uize.Class ({value:-1}));  // returns false
									myTest.expectNegativeInteger (1);                        // returns false
									myTest.expectNegativeInteger (1.5);                      // returns false
									.........................................................................

									NOTES
									- see the companion =expectPositiveInteger= instance method
									- see the related =expectNegativeNumber=, =expectPositiveNumber=, =expectIntegerInRange=, and =expectNumberInRange= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectPositiveInteger:function (_value) {
						return this.expectInteger (_value) && this.expectPositive (_value);
						/*?
							Instance Methods
								expectPositiveInteger
									Returns a boolean, indicating whether or not the specified value is a positive integer.

									SYNTAX
									.........................................................
									resultBOOL = myTest.expectPositiveInteger (valueANYTYPE);
									.........................................................

									A value will be considered to be a positive integer when the following conditions are met...

									- the value is of type ='number'=
									- the value does not have a fractional component
									- the value is in the range of =0= to =Infinity= (=0= is considered both a positive *and* a positive number)

									The =expectPositiveInteger= method uses the =expectIntegerInRange= method in its implementation. The statement =myTest.expectPositiveInteger (value)= would be equivalent to the statement =myTest.expectIntegerInRange (0,Infinity,value)=.

									EXAMPLE
									........................................................................
									myTest.expectPositiveInteger (0);                       // returns true
									myTest.expectPositiveInteger (1);                       // returns true
									myTest.expectPositiveInteger (Infinity);                // returns true

									myTest.expectPositiveInteger (1.5);                     // returns false
									myTest.expectPositiveInteger ('1');                     // returns false
									myTest.expectPositiveInteger (Uize.Class ({value:1}));  // returns false
									myTest.expectPositiveInteger (-1);                      // returns false
									myTest.expectPositiveInteger (-1.5);                    // returns false
									........................................................................

									NOTES
									- see the companion =expectNegativeInteger= instance method
									- see the related =expectNegativeNumber=, =expectPositiveNumber=, =expectIntegerInRange=, and =expectNumberInRange= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNoRepeats:function (_value) {
						return _expectSuccess (
							this,
							_Uize.totalKeys (_Uize.lookup (_value)) == _value.length,
							'array with no repeated values',
							_valueToJsonSerializer (_value)
						);
						/*?
							Instance Methods
								expectNoRepeats
									Returns a boolean, indicating whether or not there are no repeated values in the specified array.

									SYNTAX
									...................................................
									resultBOOL = myTest.expectNoRepeats (valueANYTYPE);
									...................................................

									EXAMPLES
									.........................................................
									myTest.expectNoRepeats ([1,2,3,4,5]);    // returns true
									myTest.expectNoRepeats ([1,2,3,4,5,2]);  // returns false
									.........................................................

									NOTES
									- this method is one of the many available `expectation methods`
						*/
					},

					expectEmptyArray:function (_value) {
						return this.expectArray (_value) && this.expectEmpty (_value);
						/*?
							Instance Methods
								expectEmptyArray
									Returns a boolean, indicating whether or not the specified value is an instance of JavaScript's built-in =Array= object and has zero length.

									SYNTAX
									.......................................................
									resultBOOL = myTest.expectEmptyArray (valueANYTYPE);
									.......................................................

									This method uses the =expectArray= and =expectEmpty= methods in its implementation. The statement =myTest.expectEmptyArray (value)= is equivalent to the statement =this.expectArray (value) && this.expectEmpty (value)=.

									EXAMPLES
									............................................................................
									myTest.expectEmptyArray ([]);                            // returns true
									myTest.expectEmptyArray (new Array);                     // returns true

									myTest.expectEmptyArray (['foo','bar']);                 // returns false
									myTest.expectEmptyArray (new Array ('foo','bar'));       // returns false
									myTest.expectEmptyArray (new Array (5));                 // returns false
									myTest.expectEmptyArray (Uize.Class ({value:['foo']}));  // returns false
									myTest.expectEmptyArray ({foo:'bar'});                   // returns false
									myTest.expectEmptyArray (1.2345);                        // returns false
									myTest.expectEmptyArray (true);                          // returns false
									............................................................................

									NOTES
									- compare to the =expectEmpty=, =expectEmptyObject=, and =expectEmptyString= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNonEmptyArray:function (_value) {
						return this.expectArray (_value) && this.expectNonEmpty (_value);
						/*?
							Instance Methods
								expectNonEmptyArray
									Returns a boolean, indicating whether or not the specified value is an instance of JavaScript's built-in =Array= object and has a non-zero length.

									SYNTAX
									.......................................................
									resultBOOL = myTest.expectNonEmptyArray (valueANYTYPE);
									.......................................................

									This method uses the =expectArray= and =expectNonEmpty= methods in its implementation. The statement =myTest.expectNonEmptyArray (value)= is equivalent to the statement =this.expectArray (value) && this.expectNonEmpty (value)=.

									EXAMPLES
									............................................................................
									myTest.expectNonEmptyArray (['foo','bar']);                 // returns true
									myTest.expectNonEmptyArray (new Array ('foo','bar'));       // returns true
									myTest.expectNonEmptyArray (new Array (5));                 // returns true

									myTest.expectNonEmptyArray ([]);                            // returns false
									myTest.expectNonEmptyArray (new Array);                     // returns false
									myTest.expectNonEmptyArray (Uize.Class ({value:['foo']}));  // returns false
									myTest.expectNonEmptyArray ({foo:'bar'});                   // returns false
									myTest.expectNonEmptyArray (1.2345);                        // returns false
									myTest.expectNonEmptyArray (true);                          // returns false
									............................................................................

									NOTES
									- compare to the =expectNonEmpty=, =expectNonEmptyObject=, and =expectNonEmptyString= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectEmptyObject:function (_value) {
						return this.expectObject (_value) && this.expectEmpty (_value);
						/*?
							Instance Methods
								expectEmptyObject
									Returns a boolean, indicating whether or not the specified value is of type ='object'= and has 0 enumerable properties.

									SYNTAX
									.....................................................
									resultBOOL = myTest.expectEmptyObject (valueANYTYPE);
									.....................................................

									This method uses the =expectObject= and =expectEmpty= methods in its implementation. The statement =myTest.expectEmptyObject (value)= is equivalent to the statement =this.expectObject (value) && this.expectEmpty (value)=.

									EXAMPLES
									........................................................................
									myTest.expectEmptyObject ({});                          // returns true
									myTest.expectEmptyObject (new Object);                  // returns true
									myTest.expectEmptyObject ([]);                          // returns true
									myTest.expectEmptyObject (new Array);                   // returns true

									myTest.expectEmptyObject ({foo:'bar'});                 // returns false
									myTest.expectEmptyObject (new Object ({foo:'bar'}));    // returns false
									myTest.expectEmptyObject (['foo','bar']);               // returns false
									myTest.expectEmptyObject (new Array (5));               // returns false
									myTest.expectEmptyObject (Uize.Class ({value:'foo'}));  // returns false
									myTest.expectEmptyObject (1.2345);                      // returns false
									myTest.expectEmptyObject (true);                        // returns false
									........................................................................

									Not Only Object Instances Are Object Type
										The =expectEmptyObject= method relies on JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of many of JavaScript's built-in objects (such as the =Date=, =RegExp=, =Number=, =Boolean=, and =String= objects) are considered of type ='object'= - not just instances of the built-in =Object= object. Therefore, instances of any object or class will be considered empty objects if they contain 0 enumerable properties.

									NOTES
									- compare to the =expectEmpty=, =expectEmptyArray=, and =expectEmptyString= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNonEmptyObject:function (_value) {
						return this.expectObject (_value) && this.expectNonEmpty (_value);
						/*?
							Instance Methods
								expectNonEmptyObject
									Returns a boolean, indicating whether or not the specified value is of type ='object'= and has at least one enumerable property.

									SYNTAX
									........................................................
									resultBOOL = myTest.expectNonEmptyObject (valueANYTYPE);
									........................................................

									This method uses the =expectObject= and =expectNonEmpty= methods in its implementation. The statement =myTest.expectNonEmptyObject (value)= is equivalent to the statement =this.expectObject (value) && this.expectNonEmpty (value)=.

									EXAMPLES
									...........................................................................
									myTest.expectNonEmptyObject ({foo:'bar'});                 // returns true
									myTest.expectNonEmptyObject (new Object ({foo:'bar'}));    // returns true
									myTest.expectNonEmptyObject (['foo','bar']);               // returns true
									myTest.expectNonEmptyObject (new Array (5));               // returns true
									myTest.expectNonEmptyObject (Uize.Class ({value:'foo'}));  // returns true
									myTest.expectNonEmptyObject ({});                          // returns false
									myTest.expectNonEmptyObject (new Object);                  // returns false
									myTest.expectNonEmptyObject ([]);                          // returns false
									myTest.expectNonEmptyObject (new Array);                   // returns false
									myTest.expectNonEmptyObject (1.2345);                      // returns false
									myTest.expectNonEmptyObject (true);                        // returns false
									...........................................................................

									Not Only Object Instances Are Object Type
										The =expectNonEmptyObject= method relies on JavaScript's built-in =typeof= operator to determine the type of the specified actual value.

										Using the =typeof= operator, instances of many of JavaScript's built-in objects (such as the =Date=, =RegExp=, =Number=, =Boolean=, and =String= objects) are considered of type ='object'= - not just instances of the built-in =Object= object. Therefore, instances of any object or class will be considered non-empty objects if they contain any enumerable properties.

									NOTES
									- compare to the =expectNonEmpty=, =expectNonEmptyArray=, and =expectNonEmptyString= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectEmptyString:function (_value) {
						return this.expectString (_value) && this.expectEmpty (_value);
						/*?
							Instance Methods
								expectEmptyString
									Returns a boolean, indicating whether or not the specified value is of type ='string'= and contains 0 characters.

									SYNTAX
									.....................................................
									resultBOOL = myTest.expectEmptyString (valueANYTYPE);
									.....................................................

									This method uses the =expectString= and =expectEmpty= methods in its implementation. The statement =myTest.expectEmptyString (value)= is equivalent to the statement =this.expectString (value) && this.expectEmpty (value)=.

									EXAMPLES
									........................................................................
									myTest.expectEmptyString ('');                          // returns true

									myTest.expectEmptyString ('foo');                       // returns false
									myTest.expectEmptyString (new String (''));             // returns false
									myTest.expectEmptyString (new String ('foo'));          // returns false
									myTest.expectEmptyString (Uize.Class ({value:'foo'}));  // returns false
									myTest.expectEmptyString (1.2345);                      // returns false
									myTest.expectEmptyString (true);                        // returns false
									........................................................................

									NOTES
									- compare to the =expectEmpty=, =expectEmptyArray=, and =expectEmptyObject= instance methods
									- this method is one of the many available `expectation methods`
						*/
					},

					expectNonEmptyString:function (_value) {
						return this.expectString (_value) && this.expectNonEmpty (_value);
						/*?
							Instance Methods
								expectNonEmptyString
									Returns a boolean, indicating whether or not the specified value is of type ='string'= and contains one or more characters.

									SYNTAX
									........................................................
									resultBOOL = myTest.expectNonEmptyString (valueANYTYPE);
									........................................................

									This method uses the =expectString= and =expectNonEmpty= methods in its implementation. The statement =myTest.expectNonEmptyString (value)= is equivalent to the statement =this.expectString (value) && this.expectNonEmpty (value)=.

									EXAMPLES
									...........................................................................
									myTest.expectNonEmptyString ('foo');                       // returns true

									myTest.expectNonEmptyString ('');                          // returns false
									myTest.expectNonEmptyString (new String ('foo'));          // returns false
									myTest.expectNonEmptyString (Uize.Class ({value:'foo'}));  // returns false
									myTest.expectNonEmptyString (1.2345);                      // returns false
									myTest.expectNonEmptyString (true);                        // returns false
									...........................................................................

									NOTES
									- compare to the =expectNonEmpty=, =expectNonEmptyArray=, and =expectNonEmptyObject= instance methods
									- this method is one of the many available `expectation methods`
						*/
					}
			},

			staticMethods:{
				splitHostAndProperty:_splitHostAndProperty = function (_propertyFullName) {
					var _lastPeriodPos = _propertyFullName.lastIndexOf ('.');
					return {
						host:_propertyFullName.slice (0,_lastPeriodPos),
						property:_propertyFullName.slice (_lastPeriodPos + 1)
					};
					/*?
						Static Methods
							Uize.Test.splitHostAndProperty
								Returns an object, containing =host= and =property= properties that represent the specified property full path name split into the two parts.

								SYNTAX
								..........................................................................
								hostAndPropertyOBJ = Uize.Test.splitHostAndProperty (propertyFullNameSTR);
								..........................................................................

								RETURN VALUE
								.............................
								{
									host     : hostPathSTR,
									property : propertyNameSTR
								}
								.............................

								The value of the =propertyFullNameSTR= parameter should be a string that fully qualifies the path for referencing a property in the global context (e.g. ='Uize.Class.Test.resolve'=). The =Uize.Test.splitHostAndProperty= method splits this string into host and property strings, and packages these two string values into an object. Supplied our example value of ='Uize.Class.Test.resolve'=, the =Uize.Test.splitHostAndProperty= method would return the object ={host:'Uize.Class.Test',property:'resolve'}=.
					*/
				},

				/*** factory methods for creating test classes using declarative syntax ***/
					requiredModulesTest:function (_modules) {
						return this.resolve ({
							title:'REQUIRED MODULES TEST: ' + _modules,
							test:function (_continue) {_Uize.require (_modules,function () {_continue (true)})}
						});
						/*?
							Static Methods
								Uize.Test.requiredModulesTest
									Returns a =Uize.Test= subclass, for a test that tests whether or not the specified module(s) can be successfully required (and loaded and built, if necessary).

									SYNTAX
									..............................................................
									testCLASS = Uize.Test.requiredModulesTest (modulesSTRorARRAY);
									..............................................................

									modulesSTRorARRAY
										The value of the =modulesSTRorARRAY= parameter can be a string, specifying the full name of a single module or a comma-separated list of the full names for multiple modules, or an array of the full names for multiple modules.

										Essentially, the value specified for the =modulesSTRorARRAY= parameter can be any value that is acceptable for the =required= property in a =Uize.module= declaration (see the guide [[../guides/javascript-modules.html][JavaScript Modules]] for a refresher on modules).

									An Example
										The =Uize.Test.requiredModulesTest= method is useful for creating a first test in a series of tests for a module that is being tested. Consider the following example...

										EXAMPLE
										.............................................................
										var testClassForUizeArrayOrder = Uize.Test.resolve ({
											title:'Uize.Array.Order Module Test',
											test:[
												Uize.Test.requiredModulesTest ('Uize.Array.Order'),
												Uize.Test.staticMethodsTest ([
													// ...
													// static method tests here, in comma-separated list
													// ...
												])
											]
										});
										.............................................................

										In the above example, a test class is being created for testing the =Uize.Array.Order= module, using the =Uize.Test.resolve= static method (another of the `test class factory methods`). As you will notice, the very first child test in our test class is being created using the =Uize.Test.requiredModulesTest= method. This tests requiring the =Uize.Array.Order= module. If the test fails, then subsequent tests will not be performed. If the test succeeds, then the =Uize.Array.Order= module is guaranteed to be built and can be relied upon for the subsequent tests that will test the module's various features, such as its static methods.

									NOTES
									- this method is one of the many available `test class factory methods`
						*/
					},

					staticPropertyTest:function (_propertyFullName,_expectedType) {
						var
							_hostAndProperty = _splitHostAndProperty (_propertyFullName),
							_propertyHost = _hostAndProperty.host
						;
						return this.resolve ({
							title:'The static property ' + _propertyFullName + ' exists and is a ' + _expectedType,
							test:[
								{
									title:'The host ' + _propertyHost + ' is defined',
									test:function () {return this.expectNonNull (_Uize.getModuleByName (_propertyHost))}
								},
								{
									title:'The static property ' + _propertyFullName + ' is a ' + _expectedType,
									test:function () {
										return this.expectType (
											_expectedType,
											_Uize.getModuleByName (_propertyHost) [_hostAndProperty.property]
										);
									}
								}
							]
						});
						/*?
							Static Methods
								Uize.Test.staticPropertyTest
									Returns a =Uize.Test= subclass, for a test that tests whether or not the specified static property exists and is of the specified type.

									SYNTAX
									.......................................................................
									testCLASS = Uize.Test.staticPropertyTest (propertyFullNameSTR,typeSTR);
									.......................................................................

									propertyFullNameSTR
										A string, specifying the full name of the static property, including the full host path.

										For example, with the "isAsync" property of the =Uize.Class.Test= module, the value specified for the =propertyFullNameSTR= parameter would be ='Uize.Class.Test.isAsync'=.

									What Comprises a Static Property Test
										The test class created by the =Uize.Test.staticPropertyTest= method has two child tests.

										The first test tests whether or not the property's host is defined (with the value ='Uize.Class.Test.isAsync'= specified for the =propertyFullNameSTR= parameter, that would test for =Uize.Test= to be defined). The second test tests that the specified property is of the specified type.

									An Example
										The following example serves merely to illustrate the behavior of a static property test (typically static property tests won't be created in this way - they will typically be incorporated into a list of other tests, in a more concise declarative statement).

										EXAMPLE
										..................................................................
										var
											StaticPropertyTestClass = Uize.Test.staticPropertyTest (
												'Uize.Class.Test.isAsync','object'
											),
											staticPropertyTest = new StaticPropertyTestClass
										;
										staticPropertyTest.run (
											function () {
												alert (staticPropertyTest.get ('result'));  // displays true
											}
										);
										..................................................................

										In the above example, a test class is being created to test for the =Uize.Class.Test.isAsync= static property. The test class is assigned to the =StaticPropertyTestClass= variable. Then, an instance of that test class is created, assigned to the =staticPropertyTest= variable, and then run. Upon completion, the callback function is executed and the result of the test is reported in a JavaScript alert. The result is =true= (assuming something hasn't been broken in the =Uize.Test= module), since the =Uize.Class.Test.isAsync= static property is of type ='object'=.

									NOTES
									- this method is one of the many available `test class factory methods`
						*/
					},

					staticMethodTest:function (_methodFullName,_cases,_testProperties,_caseTestProperties) {
						var
							m = this,
							_hostAndProperty = _splitHostAndProperty (_methodFullName),
							_methodHostName = _hostAndProperty.host,
							_methodName = _hostAndProperty.property,
							_test = [m.staticPropertyTest (_methodFullName,'function')]
						;
						function _getCaseTest (_case) {
							var
								_caseIsArray = _Uize.isArray (_case),
								_caseTest = _caseIsArray
									? {
										title:_case [0],
										test:function () {
											var
												_methodHost = _Uize.getModuleByName (_methodHostName),
												_arguments = this.get ('cloneArguments') ? _Uize.clone (_case [1]) : _case [1]
											;
											return this.expect (
												_case [2],
												_methodHost [_methodName].apply (
													_methodHost,
													_Uize.isArray (_arguments) ? _arguments : [_arguments]
												)
											);
										}
									}
									: _case
							;
							if (!_caseIsArray && _Uize.isArray (_case.test))
								_case.test = _Uize.map (_case.test,_getCaseTest)
							;
							if (_caseTestProperties)
								_Uize_Util_Oop.inheritsFrom (_caseTest,_Uize.Test)
									? _caseTest.set (_caseTestProperties)
									: _Uize.copyInto (_caseTest,_caseTestProperties)
							;
							return _caseTest;
						}
						for (var _caseNo = -1, _casesLength = _cases.length; ++_caseNo < _casesLength;)
							_test.push (_getCaseTest (_cases [_caseNo]))
						;
						var _testClass = m.resolve (
							_Uize.copyInto (
								{
									title:'STATIC METHOD TEST: ' + _methodFullName,
									test:_test
								},
								_testProperties
							)
						);
						return _testClass;
						/*?
							Static Methods
								Uize.Test.staticMethodTest
									Returns a =Uize.Test= subclass, for a test that tests whether or not the specified static method is defined and all the specified test cases succeed.

									SYNTAX
									.................................................
									testCLASS = Uize.Test.staticMethodTest (
										methodFullNameSTR,
										casesARRAY,
										supplementalTestPropertiesOBJ,     // optional
										supplementalCaseTestPropertiesOBJ  // optional
									);
									.................................................

									methodFullNameSTR
										A string, specifying the full name of the static method, including the full host path.

										For example, with the "resolve" method of the =Uize.Class.Test= module, the value specified for the =methodFullNameSTR= parameter would be ='Uize.Class.Test.resolve'=.

									casesARRAY
										An array, containing a sequence of test cases, all of which need to succeed in order for the static method test to succeed.

										STRUCTURE
										..................
										[
											caseARRAYorOBJ,
											caseARRAYorOBJ,
											...
											caseARRAYorOBJ
										]
										..................

										Each element of the =casesARRAY= array should be of the type =caseARRAYorOBJ= and will be resolved to a =Uize.Test= subclass.

										caseARRAYorOBJ
											An array, providing a concise declaration of a synchronous, deterministic test case for the static method, or an object providing a declaration of a generic test, or an instance of a =Uize.Test= subclass.

											Synchronous and Deterministic Cases
												When an array value is specified for the =caseARRAYorOBJ= value type, then the case describes a synchronous and deterministic test of the static method, and the array should have the following structure...

												caseARRAY
												................................................................................
												[
													titleSTR,              // the title of the test case
													argumentsANYTYPE,      // arguments to be used when calling the static method
													expectedResultANYTYPE  // the expected return value for the test case
												]
												................................................................................

												- =titleSTR= - a string, specifying the title of the test case
												- =argumentsANYTYPE= - either an array of argument values, or a non-array value for the method's single argument (NOTE: in cases where the value for a method's single argument is an array, then that array value *must* be wrapped in an arguments array so that the =Uize.Test.staticMethodTest= method doesn't mistake that array for the arguments array)
												- =expectedResultANYTYPE= - the result that is expected to be returned by the static method when calling it with the arguments specified for the case

											Asynchronous or Non-deterministic Cases
												When a case is either asynchronous or non-deterministic (i.e. you can't be guaranteed to always get the same result returned for the same argument values), then you cannot use the concise array syntax for declaring the case as you can with `synchronous and deterministic cases`.

												Instead, you can use the object syntax accepted for the =testOBJ= parameter of the =Uize.Test.resolve= static method, or you can provide a =Uize.Test= subclass (created by one of the `test class factory methods`, or otherwise created).

									supplementalTestPropertiesOBJ
										When the optional =supplementalTestPropertiesOBJ= parameter is specified, then additional values for the state properties of the created =Uize.Test= subclass can be specified.

										Among other things, this allows the =title= of the test class to be specified (rather than using the automatically generated title).

									supplementalCaseTestPropertiesOBJ
										The optional =supplementalCaseTestPropertiesOBJ= parameter lets you specify supplemental test properties that should be applied to each of the cases specified by the =casesARRAY= parameter.

									An Example
										In the following example, a test class is being created for the =Uize.capFirstChar= static method.

										EXAMPLE
										..................................................................
										Uize.Test.staticMethodTest (
											'Uize.capFirstChar',
											[
												['Many letters, first letter is lowercase','hello','Hello'],
												['Many letters, first letter is uppercase','Hello','Hello'],
												['Single letter, lowercase','h','H'],
												['Single letter, uppercase','H','H'],
												['Empty string','','']
											]
										);
										..................................................................

										Notice how, with each of the test cases, the value specified for the arguments is a string - not an array. This is because the =Uize.capFirstChar= method takes only one parameter, and for cases where methods only take a single parameter, the =Uize.Test.staticMethodTest= method supports that single value being specified without the arguments array "wrapper".

									NOTES
									- see the related =Uize.Test.staticMethodsTest= static method
									- this method is one of the many available `test class factory methods`
						*/
					},

					staticMethodsTest:function (_staticMethodsTest) {
						var m = this;
						return m.resolve ({
							title:'Static Method Tests',
							test:_Uize.map (
								_staticMethodsTest,
								function (_staticMethodTest) {
									return (
										_Uize.isArray (_staticMethodTest)
											? m.staticMethodTest.apply (m,_staticMethodTest)
											: _staticMethodTest
									);
								}
							)
						});
						/*?
							Static Methods
								Uize.Test.staticMethodsTest
									Returns a =Uize.Test= subclass, for a test that tests all the specified test cases of all the specified static methods.

									SYNTAX
									.................................................................
									testCLASS = Uize.Test.staticMethodsTest (staticMethodsTestARRAY);
									.................................................................

									The =Uize.Test.staticMethodsTest= method is a convenience method that provides a more concise way to declare static methods tests for multiple static methods in a single statement.

									staticMethodsTestARRAY
										An array, where each element of the array specifies a test for a specific static method.

										STRUCTURE
										..............................
										[
											staticMethodTestARRAYorOBJ,
											staticMethodTestARRAYorOBJ,
											...
											staticMethodTestARRAYorOBJ
										]
										..............................

									staticMethodTestARRAYorOBJ
										An array, specifying the parameter values for a call to the =Uize.Test.staticMethodTest= static method, or a value that can be used for the =testOBJ= parameter of the =Uize.Test.resolve= static method and that will be resolved to a =Uize.Test= subclass.

										If an array value is specified for the =staticMethodTestARRAYorOBJ= value type, then it should have the following structure...

										staticMethodTestARRAY
										...........................................................................
										[
											methodFullNameSTR,  // full name of static method, including module path
											casesARRAY          // array of test cases
										]
										...........................................................................

										When a non-array value is specified for the =staticMethodTestARRAYorOBJ= value type, then it will be resolved to a =Uize.Test= subclass using the =Uize.Test.resolve= static method.

									EXAMPLE
									.........................................................................
									Uize.Test.staticMethodsTest ([
										['Uize.Str.Trim.trimLeft',[
											['Left-trimming an empty string produces an empty string',
												'',
												''
											],
											['Left-trimming a string with no padding returns the same string',
												'hello',
												'hello'
											],
											['Left-trimming does not affect inner whitesapce',
												' hello \t there ',
												'hello \t there '
											]
										]],
										['Uize.Str.Trim.trimRight',[
											['Right-trimming an empty string produces an empty string',
												'',
												''
											],
											['Right-trimming a string with no padding returns the same string',
												'hello',
												'hello'
											],
											['Right-trimming does not affect inner whitesapce',
												' hello \t there ',
												' hello \t there'
											]
										]]
									]);
									.........................................................................

									In the above (rather long) example, static method tests are being declared for the =Uize.Str.Trim.trimLeft= and =Uize.Str.Trim.trimRight= static methods of the =Uize.Str.Trim= module.

									NOTES
									- see the related =Uize.Test.staticMethodTest= static method
									- this method is one of the many available `test class factory methods`
						*/
					},

					testModuleTest:function (_testModule) {
						var _loadTestModuleTest = this.requiredModulesTest (_testModule);
						_loadTestModuleTest.set ({title:'REQUIRE TEST MODULE: ' + _testModule});
						return this.resolve ({
							title:'TEST MODULE: ' + _testModule,
							test:[
								_loadTestModuleTest,
								{
									title:'RUN TEST MODULE: ' + _testModule,
									test:function (_continue) {
										var
											m = this,
											_testModuleInstance = _Uize.getModuleByName (_testModule) ()
										;
										if (_testModuleInstance) {
											_testModuleInstance.wire (
												'Done',
												function (_event) {
													var _eventSource = _event.source;
													_eventSource.get ('reasonForFailure') && m.set ({
														reasonForFailure:
															'running test module failed with the following synopsis...\n\n' +
															_eventSource.getSynopsis ()
													});
													_eventSource.parent || _continue (_eventSource.get ('result'));
												}
											);
											_testModuleInstance.run ();
										} else {
											_continue (true);
										}
									}
								}
							]
						});
						/*?
							Static Methods
								Uize.Test.testModuleTest
									Returns a =Uize.Test= subclass, for a test that safely tests the loading and running of a test module.

									SYNTAX
									.....................................................
									testCLASS = Uize.Test.testModuleTest (testModuleSTR);
									.....................................................

									The test class created by this method first tests whether or not the specified test module can be successfully required (and loaded and built, if necessary). It does this using a child test created using the =Uize.Test.requiredModulesTest= static method. If the test module can be successfully required, then it is run by instantiating it and calling its =run= instance method.

									EXAMPLE
									............................................................................
									uizeDataTestModuleRunner = Uize.Test.testModuleTest ('Uize.Test.Uize.Data');
									............................................................................

									NOTES
									- this method is one of the many available `test class factory methods`
						*/
					},

					testSuite:function (_testSuiteTitle,_testSuiteModules) {
						var m = this;
						return m.resolve ({
							title:_testSuiteTitle,
							test:_Uize.map (
								_testSuiteModules,
								function (_testSuiteModule) {return m.testModuleTest (_testSuiteModule)}
							)
						});
						/*?
							Static Methods
								Uize.Test.testSuite
									Returns a =Uize.Test= subclass, for a test that combines multiple separate test modules into a single test suite.

									SYNTAX
									..........................................................................
									testCLASS = Uize.Test.testSuite (testSuiteTitleSTR,testSuiteModulesARRAY);
									..........................................................................

									The =Uize.Test.testSuite= method wraps each of the test modules specified in the =testSuiteModulesARRAY= parameter in a test module test, using the =Uize.Test.testModuleTest= static method. This ensures that the many individual test modules that make up a test suite are only loaded dynamically as needed when the test suite is run - they are not directly required by the test suite test, and they do not need to be loaded in just so that the test suite's test class can be built. This is a good thing, because many of the test modules are rather large.

									EXAMPLE
									..........................................
									var uizeTestSuite = Uize.Test.testSuite (
										'UIZE JavaScript Framework Unit Tests',
										[
											'Uize.Test.Uize.Data',
											'Uize.Test.Uize',
											'Uize.Test.Uize.Array',
											'Uize.Test.Uize.Array.Order',
											'Uize.Test.Uize.Array.Sort',
											'Uize.Test.Uize.Data.Csv',
											'Uize.Test.Uize.Date',
											// ... ... ... ... ... ...
											// more test modules here
											// ... ... ... ... ... ...
										]
									);
									..........................................

									In the above example, a test suite test class is being created to sequence execution of a series of test modules that test various modules of the UIZE JavaScript Framework.

									NOTES
									- this method is one of the many available `test class factory methods`
						*/
					},

					moduleAliasTest:function (_moduleAliasName,_moduleTrueName) {
						return _Uize.Test.resolve ({
							title:'Test for the ' + _moduleAliasName + ' Alias Module',
							test:[
								_Uize.Test.requiredModulesTest (_moduleAliasName),
								_Uize.Test.requiredModulesTest (_moduleTrueName),
								{
									title:'The ' + _moduleAliasName + ' module is simply an alias / reference to the ' + _moduleTrueName + ' module',
									test:function () {
										return this.expectSameAs (
											_Uize.getModuleByName (_moduleAliasName),
											_Uize.getModuleByName (_moduleTrueName)
										);
									}
								}
							]
						});
					},

					migratedStaticMethodsTest:function (_migratedMethods) {
						return _migratedStaticFeaturesTest (_migratedMethods,'method');
					},

					migratedStaticPropertiesTest:function (_migratedProperties) {
						return _migratedStaticFeaturesTest (_migratedProperties,'property');
					}
			}
		});
	}
});

