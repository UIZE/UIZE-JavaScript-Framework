/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 80
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize= module defines a suite of unit tests for the =Uize= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize',
	required:[
		'Uize.Data',
		'Uize.Class',
		'Uize.Class.Value'
	],
	builder:function () {
		'use strict';

		var
			_strictModeSupported =
				(function () {
					try {
						eval ('\'use strict\'; with ({}) {}');
					} catch (_error) {
						return true;
					}
					return false;
				}) (),
			_oneLevelDeepTestObjectForCloning = {
				undefinedValue:undefined,
				nullValue:null,
				emptyString:'',
				nonEmptyString:'solar',
				numberValueZero:0,
				numberValueNegative:-1,
				numberValuePositive:1,
				numberValueNaN:NaN,
				numberValueInfinity:Infinity,
				numberValueNegativeInfinity:-Infinity,
				booleanFalse:false,
				booleanTrue:true
			},
			_oneLevelDeepTestArrayForCloning = [
				undefined,
				null,
				'',
				'solar',
				0,
				-1,
				1,
				NaN,
				Infinity,
				-Infinity,
				false,
				true
			],
			_complexObjectDataStructure = {
				anObject:_oneLevelDeepTestObjectForCloning,
				anArray:_oneLevelDeepTestArrayForCloning
			},
			_complexArrayDataStructure = [
				_oneLevelDeepTestObjectForCloning,
				_oneLevelDeepTestArrayForCloning
			],
			_sparselyPopulatedArray = []
		;
		_sparselyPopulatedArray [2] = 1;
		_sparselyPopulatedArray [7] = 2;

		function _copyArguments (_arguments) {
			var _result = [];
			_result.push.apply (_result,_arguments);
			return _result;
		}

		function _arrayToListObject (_array) {
			var _listObject = Uize.map (_array,'value',{});
			_listObject.length = _array.length;
			return _array;
		}

		function _cloneObjectTest (_title,_class,_instantiationValue) {
			return {
				title:_title,
				test:function () {
					var
						_sourceObject = new _class (_instantiationValue),
						_clonedObject = Uize.clone (_sourceObject)
					;
					return (
						this.expect (true,_clonedObject != _sourceObject) &&
						this.expectSameAs (_sourceObject.constructor,_clonedObject.constructor) &&
						this.expect (_sourceObject.valueOf (),_clonedObject.valueOf ())
					);
				}
			};
		}

		function _toNumberTestBatch (_wrapValueWithObject,_wrapValueWithFunction) {
			function _toNumberTest (_value,_expectedValue) {
				return {
					title:'Blah',
					test:function () {
						return this.expect (
							_expectedValue,
							Uize.toNumber (
								_wrapValueWithObject && _wrapValueWithFunction
									? function () {return Uize.Class.Value ({value:_value})}
									: _wrapValueWithObject
										? Uize.Class.Value ({value:_value})
										: _wrapValueWithFunction
											? function () {return _value}
											: _value
							)
						);
					}
				};
			}
			return {
				title:'Test coercion of value to number',
				test:[
					_toNumberTest (42,42),
					_toNumberTest (Infinity,Infinity),
					_toNumberTest (true,1),
					_toNumberTest (false,0),
					_toNumberTest ('-1.234',-1.234),
					_toNumberTest ('Infinity',Infinity),
					_toNumberTest ('0xff',255),
					_toNumberTest ('foo',NaN),
					_toNumberTest (NaN,NaN),
					_toNumberTest ({},NaN),
					_toNumberTest ([],NaN),
					_toNumberTest ([1],NaN),
					_toNumberTest (/\d+/,NaN),
					_toNumberTest (undefined,NaN),
					_toNumberTest (null,NaN),
					_toNumberTest ('',NaN)
				]
			};
		}

		function _returnXTest (_functionGenerator) {
			return {
				title:'Test that the function always returns the value of its first argument, unmodified',
				test:[
					{
						title:'Test that calling with no parameters returns undefined',
						test:function () {
							return this.expect (undefined,_functionGenerator () ());
						}
					},
					{
						title:'Test that calling with the value undefined returns the value undefined',
						test:function () {
							return this.expect (undefined,_functionGenerator () (undefined));
						}
					},
					{
						title:'Test that calling with the value null returns the value null',
						test:function () {
							return this.expect (null,_functionGenerator () (null));
						}
					},
					{
						title:'Test that calling with a number value returns that same number value',
						test:function () {
							return this.expect (42,_functionGenerator () (42));
						}
					},
					{
						title:'Test that calling with a boolean value returns that same boolean value',
						test:function () {
							return this.expect (false,_functionGenerator () (false));
						}
					},
					{
						title:'Test that calling with a string value returns that same string value',
						test:function () {
							return this.expect ('foo',_functionGenerator () ('foo'));
						}
					},
					{
						title:'Test that calling with a function value returns that same function value',
						test:function () {
							function _function () {};
							return this.expectSameAs (_function,_functionGenerator () (_function));
						}
					},
					{
						title:'Test that calling with an array value returns that same array, unmodified',
						test:function () {
							var _array = ['foo','bar'];
							return (
								this.expectSameAs (_array,_functionGenerator () (_array)) &&
								this.expect (['foo','bar'],_array)
							);
						}
					},
					{
						title:'Test that calling with an object value returns that same object, unmodified',
						test:function () {
							var _object = {foo:'bar'};
							return (
								this.expectSameAs (_object,_functionGenerator () (_object)) &&
								this.expect ({foo:'bar'},_object)
							);
						}
					},
					{
						title:'Test that calling with a regular expression value returns that same regular expression value',
						test:function () {
							var _regExp = /^\d+$/;
							return (
								this.expectSameAs (_regExp,_functionGenerator () (_regExp)) &&
								this.expect (/^\d+$/,_regExp)
							);
						}
					}
				]
			};
		}

		function _returnsSpecificValueTest (_methodNameOrFunctionGenerator,_expectedReturnValue) {
			var _function = typeof _methodNameOrFunctionGenerator == 'function'
				? _methodNameOrFunctionGenerator ()
				: Uize [_methodNameOrFunctionGenerator]
			;
			function _inputValueTest (_inputValue,_inputValueName) {
				return {
					title:'Test that calling with ' + _inputValueName + ' returns the result ' + _expectedReturnValue,
					test:function () {
						return this.expect (_expectedReturnValue,_function (_inputValueName));
					}
				};
			}
			return {
				title:'Test that the method always returns the value ' + _expectedReturnValue + ', regardless of its input',
				test:[
					{
						title:'Test that calling with no parameters returns ' + _expectedReturnValue,
						test:function () {return this.expect (_expectedReturnValue,_function ())}
					},
					_inputValueTest (undefined,'undefined'),
					_inputValueTest (null,'null'),
					_inputValueTest ('foo','a string value'),
					_inputValueTest (42,'a number value'),
					_inputValueTest (true,'a boolean value'),
					_inputValueTest (['foo','bar'],'an array value'),
					_inputValueTest ({foo:'bar'},'an object value'),
					_inputValueTest (/\d+/,'a regular expression')
				]
			};
		}

		function _arrayMethodTargetTest (
			_hostName,
			_methodName,
			_sourceArrayContents,
			_expectedTargetArrayContents,
			_argumentsTemplate,
			_sourceArgumentNo,
			_targetArgumentNo
		) {
			if (!_argumentsTemplate) _argumentsTemplate = [];
			if (_sourceArgumentNo == null) _sourceArgumentNo = 0;
			if (_targetArgumentNo == null) _targetArgumentNo = 1;
			var _sourceArray, _target;

			function _callMethodWithTargetArgumentValue (_targetArgumentValue) {
				var
					_host = Uize.getModuleByName (_hostName),
					_arguments = _argumentsTemplate.concat ()
				;
				_arguments [_sourceArgumentNo] = _sourceArray = _sourceArrayContents.concat ();
				_arguments [_targetArgumentNo] = _targetArgumentValue !== undefined ? _targetArgumentValue : _sourceArray;
				_target = _host [_methodName].apply (_host,_arguments);
			}
			return Uize.Test.declare ({
				title:'Test that the targetARRAYorBOOL parameter is handled correctly for various types of values',
				test:[
					{
						title:'Test that specifying the value false for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (false);
							return (
								this.expect (true,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying the value true for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (true);
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying an empty array for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ([]);
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying an array that is already populated with more elements for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							var _someExtraCrud = ['some','extra','crud'];
							_callMethodWithTargetArgumentValue (_sourceArrayContents.concat (_someExtraCrud));
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents.concat (_someExtraCrud),_target)
							);
						}
					},
					{
						title:'Test that specifying an array that is already populated, but with the same number of elements, for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (_sourceArrayContents.concat ());
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying the source array for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ();
							return (
								this.expect (true,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying an empty object for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ({});
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (Uize.copyInto ({},_expectedTargetArrayContents),_target)
							);
						}
					},
					{
						title:'Test that specifying an object that already has some properties for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							var _someExtraCrud = {some:1,extra:1,crud:1};
							_callMethodWithTargetArgumentValue (Uize.copyInto ({},_someExtraCrud));
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (Uize.copyInto ({},_someExtraCrud,_expectedTargetArrayContents),_target)
							);
						}
					}
				]
			});
		}

		var _class = Uize.Test.declare ({
			title:'Test for Uize Base Module',
			test:[
				Uize.Test.staticMethodsTest ([
					['Uize.noNew',[
						{
							title:'Test that this method returns a wrapper object constructor that is not the same as the wrapped object constructor',
							test:function () {
								var
									_wrappedConstructor = function () {},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor)
								;
								return (
									this.expectFunction (_wrapperConstructor) &&
									this.expect (true,_wrapperConstructor != _wrappedConstructor)
								);
							}
						},
						{
							title:'Test that calling the wrapper object constructor results in the wrapped object constructor being called once',
							test:function () {
								var
									_timesWrappedConstructorCalled = 0,
									_wrappedConstructor = function () {_timesWrappedConstructorCalled++},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor)
								;
								_wrapperConstructor ();
								return this.expect (1,_timesWrappedConstructorCalled);
							}
						},
						{
							title:'Test that, when the wrapper object constructor is called using the new operator, an instance of the wrapper object is successfully created',
							test:function () {
								var
									_wrappedConstructor = function () {},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instance = new _wrapperConstructor ()
								;
								return this.expectInstanceOf (_wrapperConstructor,_instance);
							}
						},
						{
							title:'Test that, when the wrapper object constructor is called without using the new operator, an instance of the wrapper object is successfully created',
							test:function () {
								var
									_wrappedConstructor = function () {},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instance = _wrapperConstructor ()
								;
								return this.expectInstanceOf (_wrapperConstructor,_instance);
							}
						},
						{
							title:'Test that, when the wrapper object constructor is called with a context of undefined, an instance of the wrapper object is created',
							test:function () {
								var
									_wrappedConstructor = function () {},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instance = _wrapperConstructor.call (undefined)
								;
								return this.expectInstanceOf (_wrapperConstructor,_instance);
							}
						},
						{
							title:'Test that, when the wrapper object constructor is called with a context of null, an instance of the wrapper object is created',
							test:function () {
								var
									_wrappedConstructor = function () {},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instance = _wrapperConstructor.call (null)
								;
								return this.expectInstanceOf (_wrapperConstructor,_instance);
							}
						},
						{
							title:'Test that the wrapped object constructor is called as a method on the same instance as is returned by the wrapper object constructor',
							test:function () {
								var
									_instanceSeenByWrappedConstructor,
									_wrappedConstructor = function () {_instanceSeenByWrappedConstructor = this},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instanceReturnedByWrapperConstructor = _wrapperConstructor ()
								;
								return this.expectSameAs (
									_instanceReturnedByWrapperConstructor,
									_instanceSeenByWrappedConstructor
								);
							}
						},
						{
							title:'Test that, when the wrapper object constructor is called as a method on an instance of the wrapper object constructor, the wrapped object constructor is called as a method on that same instance, and that same instance is returned',
							test:function () {
								var
									_instanceSeenByWrappedConstructor,
									_wrappedConstructor = function () {_instanceSeenByWrappedConstructor = this},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instance = _wrapperConstructor (),
									_resultInstance = _wrapperConstructor.call (_instance)
								;
								return (
									this.expectSameAs (_instance,_instanceSeenByWrappedConstructor) &&
									this.expectSameAs (_instance,_resultInstance)
								);
							}
						},
						{
							title:'Test that, when the wrapper object constructor is called as a method on an instance of an object other than the wrapper object, an instance of the wrapper object is created',
							test:function () {
								var
									_wrappedConstructor = function () {},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor),
									_instance = _wrapperConstructor.call (new RegExp)
								;
								return this.expectInstanceOf (_wrapperConstructor,_instance);
							}
						},
						{
							title:'Test that arguments supplied to the wrapper object constructor when creating an instance are supplied also to the wrapped object constructor',
							test:function () {
								var
									_argumentsSuppliedToWrapper = ['foo','bar'],
									_argumentsSuppliedToWrapped,
									_wrappedConstructor = function () {_argumentsSuppliedToWrapped = [].slice.call (arguments)},
									_wrapperConstructor = Uize.noNew (_wrappedConstructor)
								;
								_wrapperConstructor.apply (null,_argumentsSuppliedToWrapper);
								return this.expect (_argumentsSuppliedToWrapper,_argumentsSuppliedToWrapped);
							}
						},
						{
							title:'Test that, when two different wrapper object constructors are created for two different wrapped object constructors, there is no cross contamination of static and instance methods between the wrapper object constructors',
							test:function () {
								var
									_wrappedConstructorA = function () {},
									_wrapperConstructorA = Uize.noNew (_wrappedConstructorA)
								;
								_wrapperConstructorA.staticMethodForA = function () {};
								_wrapperConstructorA.prototype.instanceMethodForA = function () {};

								var
									_wrappedConstructorB = function () {},
									_wrapperConstructorB = Uize.noNew (_wrappedConstructorB)
								;
								_wrapperConstructorB.staticMethodForB = function () {};
								_wrapperConstructorB.prototype.instanceMethodForB = function () {};

								return (
									this.expect (false,'staticMethodForA' in _wrapperConstructorB) &&
									this.expect (false,'instanceMethodForA' in _wrapperConstructorB.prototype) &&
									this.expect (false,'staticMethodForB' in _wrapperConstructorA) &&
									this.expect (false,'instanceMethodForB' in _wrapperConstructorA.prototype)
								);
							}
						},
						{
							title:'Test that properties of the wrapped object constructor are not transferred to the wrapper object constructor',
							test:function () {
								var _wrappedConstructor = function () {};
								_wrappedConstructor.staticMethod = function () {};
								_wrappedConstructor.prototype.instanceMethod = function () {};
								var _wrapperConstructor = Uize.noNew (_wrappedConstructor);

								return (
									this.expect (true,'staticMethod' in _wrappedConstructor) &&
									this.expect (true,'instanceMethod' in _wrappedConstructor.prototype) &&
									this.expect (false,'staticMethod' in _wrapperConstructor) &&
									this.expect (false,'instanceMethod' in _wrapperConstructor.prototype)
								);
							}
						}
					]],
					['Uize.capFirstChar',[
						['Many letters, first letter is lowercase','hello','Hello'],
						['Many letters, first letter is uppercase','Hello','Hello'],
						['Single letter, lowercase','h','H'],
						['Single letter, uppercase','H','H'],
						['Empty string','','']
					]],
					['Uize.constrain',[
						['Test that constraining a value that is lower than the lower limit returns the lower limit',
							[-20,-10,10],
							-10
						],
						['Test that constraining a value that is equal to the lower limit returns that value',
							[-10,-10,10],
							-10
						],
						['Test that constraining a value that is higher than the upper limit returns the upper limit',
							[20,-10,10],
							10
						],
						['Test that constraining a value that is equal to the upper limit returns that value',
							[10,-10,10],
							10
						],
						['Test that constraining value that is within the range simply returns that value',
							[1,-10,10],
							1
						],
						['Test that, when the range is reversed, constraining a value that is lower than the lower limit returns the lower limit',
							[-20,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the lower limit returns that value',
							[-10,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is higher than the upper limit returns the upper limit',
							[20,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the upper limit returns that value',
							[10,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining value that is within the range simply returns that value',
							[1,10,-10],
							1
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is lower than the lower limit returns the lower limit',
							[5,10,10],
							10
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is higher than the upper limit returns the upper limit',
							[15,10,10],
							10
						]
					]],
					['Uize.inRange',[
						['Test that a number that is lower than the lower bound of a range is not considered in range',
							[-50,100,0],
							false
						],
						['Test that a number that is at the lower bound of a range is considered in range',
							[0,100,0],
							true
						],
						['Test that a number that is between the lower and upper bounds of a range is considered in range',
							[50,100,0],
							true
						],
						['Test that a number that is at the upper bound of a range is considered in range',
							[100,100,0],
							true
						],
						['Test that a number that is higher than the upper bound of a range is not considered in range',
							[150,100,0],
							false
						],

						/*** test support for date values ***/
							['Test that a date that falls before the lower bound of a date range is not considered in range',
								[new Date ('01/01/1999'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								false
							],
							['Test that a date that is at the lower bound of a date range is considered in range',
								[new Date ('01/01/2000'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['Test that a date that is between the lower and upper bounds of a date range is considered in range',
								[new Date ('01/01/2005'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['Test that a date that is at the upper bound of a date range is considered in range',
								[new Date ('01/01/2010'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['Test that a date that falls after the upper bound of a date range is not considered in range',
								[new Date ('01/01/2011'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								false
							],

						/*** test support for object's with valueOf implemented ***/
							['Test that an object whose value is lower than the lower bound of a range is not considered in range',
								[
									Uize.Class.Value ({value:-50}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								false
							],
							['Test that an object whose value is at the lower bound of a range is considered in range',
								[
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								true
							],
							['Test that an object whose value is between the lower and upper bounds of a range is considered in range',
								[
									Uize.Class.Value ({value:50}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								true
							],
							['Test that an object whose value is at the upper bound of a range is considered in range',
								[
									Uize.Class.Value ({value:100}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								true
							],
							['Test that an object whose value is higher than the upper bound of a range is not considered in range',
								[
									Uize.Class.Value ({value:150}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								false
							],

						/*** test support for strings ***/
							['Test that a string that falls before the lower bound of a string range is not considered in range',
								['a','b','y'],
								false
							],
							['Test that a string that is at the lower bound of a string range is considered in range',
								['b','b','y'],
								true
							],
							['Test that a string that is between the lower and upper bounds of a string range is considered in range',
								['m','b','y'],
								true
							],
							['Test that a string that is at the upper bound of a string range is considered in range',
								['y','b','y'],
								true
							],
							['Test that a string that falls after the upper bound of a string range is not considered in range',
								['z','b','y'],
								false
							],

						/*** test support for reversed range bounds ***/
							['Test that, when the bounds of a range are reversed, a value that is lower than the lower bound of the range is not considered in range',
								[-50,100,0],
								false
							],
							['Test that, when the bounds of a range are reversed, a value that is at the lower bound of the range is considered in range',
								[0,100,0],
								true
							],
							['Test that, when the bounds of a range are reversed, a value that is between the lower and upper bounds of the range is considered in range',
								[50,100,0],
								true
							],
							['Test that, when the bounds of a range are reversed, a value that is at the upper bound of the range is considered in range',
								[100,100,0],
								true
							],
							['Test that, when the bounds of a range are reversed, a value that is higher than the upper bound of the range is not considered in range',
								[150,100,0],
								false
							]
					]],
					['Uize.defaultNully',[
						['Test that the value null is defaulted',[null,'foo'],'foo'],
						['Test that the value undefined is defaulted',[undefined,'foo'],'foo'],
						['Test that the boolean value false is not defaulted',[false,'foo'],false],
						['Test that an empty string is not defaulted',['','foo'],''],
						['Test that the number value 0 is not defaulted',[0,'foo'],0],
						['Test that the special value NaN is not defaulted',[NaN,'foo'],NaN],
						{
							title:'Test that an object type value is not defaulted',
							test:function () {
								var _object = {};
								return this.expectSameAs (_object,Uize.defaultNully (_object,'foo'));
							}
						},
						{
							title:'Test that an array type value is not defaulted',
							test:function () {
								var _array = [];
								return this.expectSameAs (_array,Uize.defaultNully (_array,'foo'));
							}
						},
						{
							title:'Test that a function type value is not defaulted',
							test:function () {
								var _function = Uize.nop;
								return this.expectSameAs (_function,Uize.defaultNully (_function,'foo'));
							}
						}
					]],
					['Uize.isArray',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as an array',undefined,false],
						['Test that the value null is not regarded as an array',null,false],
						['Test that a string type value is not regarded as an array','hello',false],
						['Test that a String object instance is not regarded as an array',new String ('hello'),false],
						['Test that a number type value is not regarded as an array',5,false],
						['Test that a Number object instance is not regarded as an array',new Number (5),false],
						['Test that a boolean type value is not regarded as an array',true,false],
						['Test that a Boolean object instance is not regarded as an array',new Boolean (true),false],
						['Test that an empty object is not regarded as an array',{},false],
						['Test that a function is not regarded as an array',Uize.nop,false],
						['Test that a regular expression instance is not regarded as an array',/\d+/,false],
						['Test that an empty array is regarded as an array',[[]],true],
						['Test that an array with elements is regarded as an array',[[1,2,3,4]],true]
					]],
					['Uize.isList',[
						/*** test values that should be considered to be list ***/
							['Test that an empty JavaScript array is considered to be a list',
								[[]],
								true
							],
							['Test that a JavaScript array with elements is considered to be a list',
								[['foo','bar','hello','world']],
								true
							],
							{
								title:'Test that JavaScript\'s special arguments variable inside functions is considered to be a list',
								test:function () {
									return this.expect (true,Uize.isList (arguments));
								}
							},
							['Test that an object with length property that is a number is considered to be a list',
								[_arrayToListObject (['foo','bar','hello','world'])],
								true
							],

						/*** test values that should not be considered to be list ***/
							['Test that a number is not considered to be a list',42,false],
							['Test that a boolean is not considered to be a list',true,false],
							['Test that a string is not considered to be a list','foo',false],
							['Test that the value null is not considered to be a list',null,false],
							['Test that the value undefined is not considered to be a list',null,false],
							['Test that a regular expression is not considered to be a list',/\d+/,false],
							['Test that a function is not considered to be a list',function () {},false],
							['Test that an object that has no length property is not considered to be a list',
								[{0:'foo',1:'bar'}],
								false
							],
							{
								title:'Test that an object that has a length property that is not a number is not considered to be a list',
								test:function () {
									var _object = {0:'foo',1:'bar'};
									_object.length = '2';
									return this.expect (false,Uize.isList (_object));
								}
							}
					]],
					['Uize.isNumber',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a number',undefined,false],
						['Test that the value null is not regarded as a number',null,false],
						['Test that a number format string type value is not regarded as a number','5',false],
						['Test that a number format String object instance is not regarded as a number',new String ('5'),false],
						['Test that a boolean type value is not regarded as a number',true,false],
						['Test that a Boolean object instance is not regarded as a number',new Boolean (true),false],
						['Test that an object is not regarded as a number',{},false],
						['Test that an array is not regarded as a number',[[]],false],
						['Test that a function is not regarded as a number',Uize.nop,false],
						['Test that a regular expression instance is not regarded as a number',/\d+/,false],
						['Test that a number type value is regarded as a number',5,true],
						['Test that the special value Infinity is regarded as a number',Infinity,true],
						['Test that the special value -Infinity is regarded as a number',-Infinity,true],
						['Test that the special value NaN is not regarded as a number',NaN,false],
						['Test that a Number object instance is not regarded as a number',new Number (5),false]
					]],
					['Uize.isString',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a string',undefined,false],
						['Test that the value null is not regarded as a string',null,false],
						['Test that a boolean type value is not regarded as a string',true,false],
						['Test that a Boolean object instance is not regarded as a string',new Boolean (true),false],
						['Test that an object is not regarded as a string',{},false],
						['Test that an array is not regarded as a string',[[]],false],
						['Test that a function is not regarded as a string',Uize.nop,false],
						['Test that a regular expression instance is not regarded as a string',/\d+/,false],
						['Test that a non-empty string value is regarded as a string','foo',true],
						['Test that an empty string value is regarded as a string','',true],
						['Test that a String object instance is not regarded as a string',new String ('foo'),false]
					]],
					['Uize.isBoolean',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a boolean',undefined,false],
						['Test that the value null is not regarded as a boolean',null,false],
						['Test that a string value is not regarded as a boolean','foo',false],
						['Test that an object is not regarded as a boolean',{},false],
						['Test that an array is not regarded as a boolean',[[]],false],
						['Test that a function is not regarded as a boolean',Uize.nop,false],
						['Test that a regular expression instance is not regarded as a boolean',/\d+/,false],
						['Test that the boolean value false is regarded as a boolean',false,true],
						['Test that the boolean value true is regarded as a boolean',true,true],
						['Test that a Boolean object instance is not regarded as a boolean',new Boolean (true),false]
					]],
					['Uize.isFunction',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a function',undefined,false],
						['Test that the value null is not regarded as a function',null,false],
						['Test that a string value is not regarded as a function','foo',false],
						['Test that a boolean value is not regarded as a function',true,false],
						['Test that a number value is not regarded as a function',42,false],
						['Test that an object is not regarded as a function',{},false],
						['Test that an array is not regarded as a function',[[]],false],
						['Test that a regular expression instance is not regarded as a function',/\d+/,false],
						['Test that a function *is* regarded as a function',Uize.nop,true]
					]],
					['Uize.isNully',[
						['Test that calling with no parameters returns true',[],true],
						['Test that the value undefined is regarded as being nully',undefined,true],
						['Test that the value null is regarded as being nully',null,true],
						['Test that a string value is not regarded as being nully','',false],
						['Test that a boolean value is not regarded as being nully',false,false],
						['Test that a number value is not regarded as being nully',0,false],
						['Test that the special value NaN is not regarded as being nully',NaN,false],
						['Test that an object is not regarded as being nully',{},false],
						['Test that an array is not regarded as being nully',[[]],false],
						['Test that a function is not regarded as being nully',Uize.nop,false],
						['Test that a regular expression instance is not regarded as being nully',/\d+/,false]
					]],
					['Uize.isObject',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being an object',undefined,false],
						['Test that the value null is not regarded as being an object',null,false],
						['Test that a string value is not regarded as being an object','foo',false],
						['Test that a boolean value is not regarded as being an object',true,false],
						['Test that a number value is not regarded as being an object',42,false],
						['Test that the special value NaN is not regarded as being an object',NaN,false],
						['Test that a function is not regarded as being an object',Uize.nop,false],
						['Test that an object *is* regarded as being an object',{},true],
						['Test that an array is regarded as being an object',[[]],true],
						['Test that a regular expression instance is regarded as being an object',/\d+/,true],
						['Test that a String object instance is regarded as being an object',new String (''),true],
						['Test that a Boolean object instance is regarded as being an object',new Boolean (false),true],
						['Test that a Number object instance is regarded as being an object',new Number (0),true]
					]],
					['Uize.canExtend',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being extendable',undefined,false],
						['Test that the value null is not regarded as being extendable',null,false],
						['Test that a string value is not regarded as being extendable','foo',false],
						['Test that a boolean value is not regarded as being extendable',true,false],
						['Test that a number value is not regarded as being extendable',42,false],
						['Test that the special value NaN is not regarded as being extendable',NaN,false],
						['Test that a function is regarded as being extendable',Uize.nop,true],
						['Test that an object is regarded as being extendable',{},true],
						['Test that an array is regarded as being extendable',[[]],true],
						['Test that a regular expression instance is regarded as being extendable',/\d+/,true],
						['Test that a String object instance is regarded as being extendable',new String (''),true],
						['Test that a Boolean object instance is regarded as being extendable',new Boolean (false),true],
						['Test that a Number object instance is regarded as being extendable',new Number (0),true]
					]],
					['Uize.isPlainObject',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being a plain object',undefined,false],
						['Test that the value null is not regarded as being a plain object',null,false],
						['Test that a string value is not regarded as being a plain object','foo',false],
						['Test that a boolean value is not regarded as being a plain object',true,false],
						['Test that a number value is not regarded as being a plain object',42,false],
						['Test that the special value NaN is not regarded as being a plain object',NaN,false],
						['Test that a function is not regarded as being a plain object',Uize.nop,false],
						['Test that a plain object *is* regarded as being a plain object',{},true],
						['Test that an array is not regarded as being a plain object',[[]],false],
						['Test that a regular expression instance is not regarded as being a plain object',/\d+/,false],
						['Test that a String object instance is not regarded as being a plain object',new String (''),false],
						['Test that a Boolean object instance is not regarded as being a plain object',new Boolean (false),false],
						['Test that a Number object instance is not regarded as being a plain object',new Number (0),false],
						['Test that a Uize class instance is not regarded as being a plain object',Uize.Class (),false],
						{
							title:'Test that an object that doesn\'t have a hasOwnProperty method is not regarded as being a plain object',
							test:function () {
								function _TestObject () {}
								_TestObject.prototype.hasOwnProperty = null;
								return this.expect (false,Uize.isPlainObject (new _TestObject));
							}
						}
					]],
					['Uize.isPrimitive',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being a primitive',undefined,false],
						['Test that the value null is not regarded as being a primitive',null,false],
						['Test that a string value is regarded as being a primitive','',true],
						['Test that a boolean value is regarded as being a primitive',false,true],
						['Test that a number value is regarded as being a primitive',0,true],
						['Test that the special value NaN is regarded as being a primitive',NaN,true],
						['Test that a function is not regarded as being a primitive',Uize.nop,false],
						['Test that an object is not regarded as being a primitive',{},false],
						['Test that an array is not regarded as being a primitive',[[]],false],
						['Test that a regular expression instance is not regarded as being a primitive',/\d+/,false],
						['Test that a String object instance is not regarded as being a primitive',new String ('foo'),false],
						['Test that a Boolean object instance is not regarded as being a primitive',new Boolean (true),false],
						['Test that a Number object instance is not regarded as being a primitive',new Number (42),false]
					]],
					['Uize.isRegExp',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being a regular expression',undefined,false],
						['Test that the value null is not regarded as being a regular expression',null,false],
						['Test that a string value is not regarded as being a regular expression','foo',false],
						['Test that a boolean value is not regarded as being a regular expression',true,false],
						['Test that a number value is not regarded as being a regular expression',42,false],
						['Test that a function is not regarded as being a regular expression',Uize.nop,false],
						['Test that an object is not regarded as being a regular expression',{foo:'bar'},false],
						['Test that an array is not regarded as being a regular expression',[['foo','bar']],false],
						['Test that a regular expression instance is regarded as being a regular expression',/\d+/,true],
						['Test that a regular expression instance created using the RegExp constructor is regarded as being a regular expression',
							new RegExp ('\\d+'),
							true
						],
						['Test that an empty regular expression instance is regarded as being a regular expression',
							new RegExp (''),
							true
						]
					]],
					['Uize.isNaN',[
						['Test that the value NaN is considered to be NaN',NaN,true],
						['Test that a function is not considered to be NaN',function () {},false],
						['Test that a Number object initialized with the value NaN is not considered to be NaN',
							new Number (NaN),
							false
						],
						['Test that a Date object instance, even if set to an invalid date, is not considered to be NaN',
							new Date ('foo'),
							false
						],
						['Test that undefined is not considered to be NaN',undefined,false],
						['Test that null is not considered to be NaN',null,false],
						['Test that an empty string is not considered to be NaN','',false],
						['Test that a string value, even if it is not coercible to a number, is not considered to be NaN',
							'foo',
							false
						],
						['Test that a number is not considered to be NaN',42,false],
						['Test that a boolean value is not considered to be NaN',true,false],
						['Test that an object is not considered to be NaN',{foo:'bar'},false],
						['Test that an array is not considered to be NaN',[['foo','bar']],false]
					]],
					['Uize.isSameAs',[
						['Test that NaN is considered to be the same as NaN',[NaN,NaN],true],
						{
							title:'Test that only values that are equal in a strict equality are considered to be the same as one another',
							test:function () {
								var
									_values = [
										'', 'foo', 42, NaN, Infinity, true, false, /\d+/g, new String ('foo'), new Boolean (false), new Number (42), new Date, Uize.Class (), {foo:'bar'}, ['foo','bar'], null, undefined
									],
									_valuesLength = _values.length,
									_result = true
								;
								for (var _valueANo = -1, _valueA; _result && ++_valueANo < _valuesLength;) {
									_valueA = _values [_valueANo];
									for (var _valueBNo = -1, _valueB; _result && ++_valueBNo < _valuesLength;) {
										_valueB = _values [_valueBNo];
										_result = Uize.isSameAs (_valueA,_valueB) == (_valueANo == _valueBNo);
									}
								}
								return this.expect (true,_result);
							}
						}
					]],
					['Uize.returnFalse',[
						_returnsSpecificValueTest ('returnFalse',false)
					]],
					['Uize.returnTrue',[
						_returnsSpecificValueTest ('returnTrue',true)
					]],
					['Uize.returnX',[
						_returnXTest (function () {return Uize.returnX})
					]],
					['Uize.nop',[
						_returnsSpecificValueTest ('nop',undefined)
					]],
					['Uize.resolveTransformer',[
						{
							title:'Test that calling with no parameters produces a transformer function that always returns the value of its first argument',
							test:[
								_returnXTest (function () {return Uize.resolveTransformer ()})
							]
						},
						{
							title:'Test that specifying the value undefined produces a transformer function that always returns the value of its first argument',
							test:[
								_returnXTest (function () {return Uize.resolveTransformer (undefined)})
							]
						},
						{
							title:'Test that specifying the value null produces a transformer function that always returns the value of its first argument',
							test:[
								_returnXTest (function () {return Uize.resolveTransformer (null)})
							]
						},
						{
							title:'Test that specifying a function type transformer results in that exact function being returned',
							test:function () {
								function _function () {}
								return this.expectSameAs (_function,Uize.resolveTransformer (_function));
							}
						},
						{
							title:'Test that specifying a string type transformer results in a function being created using that transformer expression string as the function body and accepting value and key arguments',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer ('value + "|" + key');
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect ('foo|bar',_resolvedTransformer ('foo','bar'))
								);
							}
						},
						{
							title:'Test that specifying a regular expression transformer results in a function being created that uses the regular expression to test the value parameter after it\'s been coerced to a string',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer (/^42$/);
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect (true,_resolvedTransformer ('42')) &&
									this.expect (true,_resolvedTransformer (42)) &&
									this.expect (false,_resolvedTransformer (' 42 '))
								);
							}
						},
						{
							title:'Test that specifying an object type transformer results in a function that uses the object transformer as a lookup for remapping the input value, leaving the input value unchanged if it is not found in the lookup',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer ({
									foo:'bar',
									hello:'world'
								});
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect ('bar',_resolvedTransformer ('foo')) &&
									this.expect ('world',_resolvedTransformer ('hello')) &&
									this.expect (42,_resolvedTransformer (42))
								);
							}
						},
						{
							title:'Test that specifying a number type transformer results in a function being created that returns that exact number value as its result',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer (42);
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect (42,_resolvedTransformer ('foo'))
								);
							}
						},
						{
							title:'Test that specifying a boolean type transformer results in a function being created that returns that exact boolean value as its result',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer (false);
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect (false,_resolvedTransformer ('foo'))
								);
							}
						}
					]],
					['Uize.resolveMatcher',[
						{
							title:'Test that calling with no parameters produces a matcher function that always returns true',
							test:[
								_returnsSpecificValueTest (function () {return Uize.resolveMatcher ()},true)
							]
						},
						{
							title:'Test that specifying the value undefined produces a matcher function that always returns true',
							test:[
								_returnsSpecificValueTest (function () {return Uize.resolveMatcher (undefined)},true)
							]
						},
						{
							title:'Test that specifying the value null produces a matcher function that always returns true',
							test:[
								_returnsSpecificValueTest (function () {return Uize.resolveMatcher (null)},true)
							]
						},
						{
							title:'Test that specifying a function type matcher results in that exact function being returned',
							test:function () {
								function _function () {}
								return this.expectSameAs (_function,Uize.resolveMatcher (_function));
							}
						},
						{
							title:'Test that specifying a string type matcher results in a function being created using that matcher expression string as the function body and accepting value and key arguments',
							test:function () {
								var _resolvedMatcher = Uize.resolveMatcher ('value + "|" + key');
								return (
									this.expectType ('function',_resolvedMatcher) &&
									this.expect ('foo|bar',_resolvedMatcher ('foo','bar'))
								);
							}
						},
						{
							title:'Test that specifying a regular expression matcher results in a function being created that uses the regular expression to test the value parameter after it\'s been coerced to a string',
							test:function () {
								var _resolvedMatcher = Uize.resolveMatcher (/^42$/);
								return (
									this.expectType ('function',_resolvedMatcher) &&
									this.expect (true,_resolvedMatcher ('42')) &&
									this.expect (true,_resolvedMatcher (42)) &&
									this.expect (false,_resolvedMatcher (' 42 '))
								);
							}
						},
						{
							title:'Test that specifying a boolean type matcher results in a function being created that returns that exact boolean value as its result',
							test:function () {
								var _resolvedMatcher = Uize.resolveMatcher (false);
								return (
									this.expectType ('function',_resolvedMatcher) &&
									this.expect (false,_resolvedMatcher ('foo'))
								);
							}
						}
					]],
					['Uize.escapeRegExpLiteral',[
						['Test that all of the regular expression special characters are escaped correctly',
							'^$|{}[]()?.*+\\',
							'\\^\\$\\|\\{\\}\\[\\]\\(\\)\\?\\.\\*\\+\\\\'
						],
						['Test that characters that are not regular expression special characters are not escaped',
							'foobar,:;\'"~`<>/!@#%&_-=',
							'foobar,:;\'"~`<>/!@#%&_-='
						]
					]],
					['Uize.toNumber',[
						['Test that calling with no parameters produces the result NaN',[],NaN],

						/*** test coercion of value to number, not wrapped in object or function ***/
							_toNumberTestBatch (false,false),

						/*** test coercion of value to number, wrapped in object ***/
							_toNumberTestBatch (true,false),

						/*** test coercion of value to number, wrapped in function ***/
							_toNumberTestBatch (false,true),

						/*** test coercion of value to number, wrapped in object that is wrapped in function ***/
							_toNumberTestBatch (true,true),

						/*** test that the optional default value is returned if value can't be coerced to number ***/
							['Test that the optional default value is returned when trying to coerce NaN to a number',
								[NaN,42],
								42
							],
							['Test that the optional default value is returned when trying to coerce an empty object to a number',
								[{},42],
								42
							],
							['Test that the optional default value is returned when trying to coerce an array to a number',
								[[1],42],
								42
							],
							['Test that the optional default value is returned when trying to coerce a regular expression to a number',
								[/\d+/,42],
								42
							],
							['Test that the optional default value is returned when trying to coerce an empty string to a number',
								['',42],
								42
							],
							['Test that the optional default value is returned when a string can\'t be successfully coerced to a number',
								['foo',42],
								42
							],
							['Test that the optional default value is returned when trying to coerce undefined to a number',
								[undefined,42],
								42
							],
							['Test that the optional default value is returned when trying to coerce null to a number',
								[null,42],
								42
							],

						/*** test that the optional default value is not itself coerced to a number ***/
							['Test that a string type default value is not coerced to a number',['foo','bar'],'bar'],
							['Test that a boolean type default value is not coerced to a number',['foo',true],true],
							['Test that the default value null is not coerced to a number',['foo',null],null],
							['Test that the default value undefined is not coerced to a number',['foo',undefined],undefined],
							['Test that the default value NaN is not coerced to a number',['foo',NaN],NaN],
							{
								title:'Test that an object type default value is not coerced to a number',
								test:function () {
									var _defaultValue = {};
									return this.expectSameAs (Uize.toNumber ('foo',_defaultValue),_defaultValue);
								}
							},
							{
								title:'Test that an array type default value is not coerced to a number',
								test:function () {
									var _defaultValue = [];
									return this.expectSameAs (Uize.toNumber ('foo',_defaultValue),_defaultValue);
								}
							},
							{
								title:'Test that a regular expression default value is not coerced to a number',
								test:function () {
									var _defaultValue = /\d+/;
									return this.expectSameAs (Uize.toNumber ('foo',_defaultValue),_defaultValue);
								}
							},

						/*** miscellaneous ***/
							['Test that if the value is a function that returns a function, it cannot be coerced to a number',
								[function () {return function () {return 5}},42],
								42
							],
							['Test that if the value is an object whose valueOf method returns an object, it cannot be coerced to a number',
								[{valueOf:function () {return {valueOf:function () {return 5}}}},42],
								42
							],
							['Test that if the value is an object whose valueOf method returns a function, it cannot be coerced to a number',
								[{valueOf:function () {return function () {}}},42],
								42
							]
					]],
					['Uize.copyInto',
						[
							['Test that calling with only a target object and no source object results in the target object being returned unchanged',
								{foo:'bar',hello:'world'},
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value undefined for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},undefined],
								{foo:'bar',hello:'world'}
							],
							['Test that copying a source object into a target object works correctly',
								[{foo:'foo',hello:'there',otherInTarget:'blah'},{foo:'bar',hello:'world',otherInSource:'yawn'}],
								{foo:'bar',hello:'world',otherInTarget:'blah',otherInSource:'yawn'}
							],
							{
								title:'Test that the target object is returned and not a new object',
								test:function () {
									var _target = {foo:'bar'};
									return this.expectSameAs (_target,Uize.copyInto (_target,{hello:'world'}));
								}
							},
							['Test that an arbitrary number of source objects is supported',
								[
									{propFromTarget:'foo'},
									{propFromSource1:'bar'},
									{propFromSource2:'hello'},
									{propFromSource3:'world'}
								],
								{
									propFromTarget:'foo',
									propFromSource1:'bar',
									propFromSource2:'hello',
									propFromSource3:'world'
								}
							],
							['Test that the contents of source objects are copied into the target in the order in which the source objects are specified',
								[
									{foo:'foo',otherInTarget:'blah'},
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',otherInTarget:'blah',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Test that specifying the value null or undefined for all of the source objects results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null,undefined,undefined,null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the target object results in the value null being returned',
								[null,{foo:'bar',hello:'world'}],
								null
							],
							['Test that specifying the value undefined for the target object results in the value undefined being returned',
								[undefined,{foo:'bar',hello:'world'}],
								undefined
							],

							/*** test support for function target and sources ***/
								{
									title:'Test that the source can be a function, and that the properties from the sources will be copied in as custom properties of the function',
									test:function () {
										var
											_target = function () {},
											_result = Uize.copyInto (_target,{foo:'bar'},{hello:'world'},{theAnswer:42})
										;
										return (
											this.expectSameAs (_target,_result) &&
											this.expect ('bar',_target.foo) &&
											this.expect ('world',_target.hello) &&
											this.expect (42,_target.theAnswer)
										);
									}
								},
								{
									title:'Test that any source can be a function that has custom properties, and that the properties from all such sources will be copied into the target',
									test:function () {
										var
											_source1 = function () {},
											_source2 = function () {},
											_source3 = function () {},
											_target = {}
										;
										_source1.foo = 'bar';
										_source2.hello = 'world';
										_source3.theAnswer = 42;
										Uize.copyInto (_target,_source1,_source2,_source3);
										return this.expect (
											{
												foo:'bar',
												hello:'world',
												theAnswer:42
											},
											_target
										);
									}
								}
						],
						null,
						{cloneArguments:true}
					],
					['Uize.mergeInto',
						[
							['Test that calling with only a target object and no source object results in the target object being returned unchanged',
								{foo:'bar',hello:'world'},
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value undefined for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},undefined],
								{foo:'bar',hello:'world'}
							],
							['Test that merging a one level deep source object into a one level deep target object works correctly',
								[{foo:'foo',hello:'there',otherInTarget:'blah'},{foo:'bar',hello:'world',otherInSource:'yawn'}],
								{foo:'bar',hello:'world',otherInTarget:'blah',otherInSource:'yawn'}
							],
							{
								title:'Test that the target object is returned and not a new object',
								test:function () {
									var _target = {foo:'bar'};
									return this.expectSameAs (_target,Uize.mergeInto (_target,{hello:'world'}));
								}
							},
							['Test that an arbitrary number of source objects is supported',
								[
									{propFromTarget:'foo'},
									{propFromSource1:'bar'},
									{propFromSource2:'hello'},
									{propFromSource3:'world'}
								],
								{
									propFromTarget:'foo',
									propFromSource1:'bar',
									propFromSource2:'hello',
									propFromSource3:'world'
								}
							],
							['Test that the contents of source objects are merged into the target in the order in which the source objects are specified',
								[
									{foo:'foo',otherInTarget:'blah'},
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',otherInTarget:'blah',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Test that specifying the value null or undefined for all of the source objects results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null,undefined,undefined,null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the target object results in the value null being returned',
								[null,{foo:'bar',hello:'world'}],
								null
							],
							['Test that specifying the value undefined for the target object results in the value undefined being returned',
								[undefined,{foo:'bar',hello:'world'}],
								undefined
							],
							{
								title:'Test that, if the values of a property in the target object and the source object are not both plain objects, then the value of the property in the target object is simply overwritten by the value from the source object (no recursive merging takes place)',
								test:function () {
									var
										_values = [
											'', 'foo', 42, NaN, Infinity, false, /\d+/g, new String ('foo'), new Boolean (false), new Number (42), new Date, Uize.Class (), {foo:'bar'}, ['foo','bar'], null, undefined
										],
										_valuesLength = _values.length,
										_result = true
									;
									for (
										var _targetPropertyValueNo = -1, _targetPropertyValue;
										_result && ++_targetPropertyValueNo < _valuesLength;
									) {
										_targetPropertyValue = _values [_targetPropertyValueNo];
										for (
											var _sourcePropertyValueNo = -1, _sourcePropertyValue;
											_result && ++_sourcePropertyValueNo < _valuesLength;
										) {
											_sourcePropertyValue = _values [_sourcePropertyValueNo];
											if (
												!Uize.isPlainObject (_targetPropertyValue) ||
												!Uize.isPlainObject (_sourcePropertyValue)
											) {
												var
													_targetObject = {property:_targetPropertyValue},
													_sourceObject = {property:_sourcePropertyValue}
												;
												Uize.mergeInto (_targetObject,_sourceObject);
												_result = Uize.isSameAs (_targetObject.property,_sourcePropertyValue);
											}
										}
									}
									return _result;
								}
							},
							['Test that, when the value of a property is a plain object in both the source and target objects, then the contents of the property from the source object are merged into the property in the target object',
								[{foo:{bar:1}},{foo:{hello:'world'}}],
								{foo:{bar:1,hello:'world'}}
							],
							['Test that, when the target object has properties that the source object doesn\'t, those properties are left in the target object',
								[{foo:'bar',junk:{hello:'world'}},{simple:'simon',junk:{bye:'bye'}}],
								{foo:'bar',simple:'simon',junk:{hello:'world',bye:'bye'}}
							],
							['Test that merging complex objects, requiring merging at multiple depths, is handled correctly',
								[
									{
										foo:'bar',
										junk:{
											hey:'there',
											moreJunk:{
												simple:'simon'
											}
										}
									},
									{
										foo:'BAR',
										junk:{
											boo:'yah',
											moreJunk:{
												peter:'pan'
											}
										}
									}
								],
								{
									foo:'BAR',
									junk:{
										hey:'there',
										boo:'yah',
										moreJunk:{
											simple:'simon',
											peter:'pan'
										}
									}
								}
							],
							['Test that deep merging is handled correctly for multiple sources',
								[
									{
										foo:'bar',
										junk:{
											hey:'there',
											moreJunk:{
												simple:'simon'
											}
										}
									},
									{
										foo:'BAR',
										junk:{
											boo:'yah',
											moreJunk:{
												peter:'pan'
											}
										}
									},
									{
										foo:'BAR!!!',
										i:'can haz more property',
										junk:{
											hell:'yeah',
											moreJunk:{
												captain:'hook'
											}
										}
									}
								],
								{
									foo:'BAR!!!',
									i:'can haz more property',
									junk:{
										hey:'there',
										boo:'yah',
										hell:'yeah',
										moreJunk:{
											simple:'simon',
											peter:'pan',
											captain:'hook'
										}
									}
								}
							],
							{
								title:'Test that merging object properties from a source object into a target object results in the object properties being copied by reference',
								test:function () {
									var
										_objectProperty = {
											foo:'bar',
											junk:{hello:'world'},
											moreJunk:['this','is','some','more','junk']
										},
										_targetObject = {simple:'simon'}
									;
									Uize.mergeInto (_targetObject,{objectProperty:_objectProperty});
									return this.expectSameAs (_objectProperty,_targetObject.objectProperty);
								}
							},

							/*** test support for function target and sources ***/
								{
									title:'Test that the source can be a function, and that the properties from the sources will be merged in as custom properties of the function',
									test:function () {
										var
											_target = function () {},
											_result = Uize.mergeInto (_target,{foo:'bar'},{hello:'world'},{theAnswer:42})
										;
										return (
											this.expectSameAs (_target,_result) &&
											this.expect ('bar',_target.foo) &&
											this.expect ('world',_target.hello) &&
											this.expect (42,_target.theAnswer)
										);
									}
								},
								{
									title:'Test that any source can be a function that has custom properties, and that the properties from all such sources will be merged into the target',
									test:function () {
										var
											_source1 = function () {},
											_source2 = function () {},
											_source3 = function () {},
											_target = {}
										;
										_source1.foo = 'bar';
										_source2.hello = 'world';
										_source3.theAnswer = 42;
										Uize.mergeInto (_target,_source1,_source2,_source3);
										return this.expect (
											{
												foo:'bar',
												hello:'world',
												theAnswer:42
											},
											_target
										);
									}
								}
						],
						null,
						{cloneArguments:true}
					],
					['Uize.pairUp',[
						['Test that calling with no parameters returns {undefined:undefined}',[],{undefined:undefined}],
						['Test that undefined is the default for the valueANYTYPE parameter',['key'],{key:undefined}],
						['Test that the key can be a string','key',{key:undefined}],
						['Test that the key can be a number',5,{5:undefined}],
						['Test that the key can be the special value Infinity',Infinity,{Infinity:undefined}],
						['Test that the key can be the special value NaN',NaN,{NaN:undefined}],
						['Test that the key can be a boolean',false,{'false':undefined}],
						['Test that the key can be undefined',undefined,{undefined:undefined}],
						['Test that the key can be null',null,{'null':undefined}],
						['Test that the value can be a string',['key','value'],{key:'value'}],
						['Test that the value can be a number',['key',5],{key:5}],
						['Test that the value can be the special value Infinity',['key',Infinity],{key:Infinity}],
						['Test that the value can be the special value NaN',['key',NaN],{key:NaN}],
						['Test that the value can be a boolean',['key',false],{key:false}],
						['Test that the value can be undefined',['key',undefined],{key:undefined}],
						['Test that the value can be null',['key',null],{key:null}],
						['Test that the value can be an object',['key',{propName:'propValue'}],{key:{propName:'propValue'}}],
						['Test that an arbitrary number of arguments is supported',
							[
								'string','foo',
								'number',42,
								'boolean',false,
								'regexp',/\d+/,
								'undefined',undefined,
								'null',null,
								'NaN',NaN,
								'object',{},
								'array',[]
							],
							{
								'string':'foo',
								'number':42,
								'boolean':false,
								'regexp':/\d+/,
								'undefined':undefined,
								'null':null,
								'NaN':NaN,
								'object':{},
								'array':[]
							}
						],
						['Test that if there is only one argument whose value is an array, then that array is treated as the arguments list',
							[
								[
									'string','foo',
									'number',42,
									'boolean',false,
									'regexp',/\d+/,
									'undefined',undefined,
									'null',null,
									'NaN',NaN,
									'object',{},
									'array',[]
								]
							],
							{
								'string':'foo',
								'number':42,
								'boolean':false,
								'regexp':/\d+/,
								'undefined':undefined,
								'null':null,
								'NaN':NaN,
								'object':{},
								'array':[]
							}
						]
					]],
					['Uize.substituteInto',[
						['Test that calling with no parameters produces an empty string',
							[],
							''
						],
						['Test that calling with just a source string simply produces that string',
							'Hello, world!',
							'Hello, world!'
						],
						['Test that specifying the value null for substitutions produces the source string',
							['Hello, world!',null,'[#KEY]'],
							'Hello, world!'
						],
						['Test that specifying the value undefined for substitutions produces the source string',
							['Hello, world!',undefined,'[#KEY]'],
							'Hello, world!'
						],
						['Test that substituting into an empty string produces an empty string',
							['',{name:'Eric'},'[#KEY]'],
							''
						],
						['Test that substitution of a single token works correctly',
							['My name is [#name].',{name:'Eric'},'[#KEY]'],
							'My name is Eric.'
						],
						['Test that multiple substitutions are handled corretly',
							['My name is [#name], and I am a [#occupation].',{name:'Eric',occupation:'viking'},'[#KEY]'],
							'My name is Eric, and I am a viking.'
						],
						['Test that a custom token naming specifier is handled correctly',
							['My name is <%name%>, and I am a <%occupation%>.',{name:'Eric',occupation:'viking'},'<%KEY%>'],
							'My name is Eric, and I am a viking.'
						],
						['Test that token naming where token opener and closer are empty strings is handled correcly',
							['I am name, and I am a occupation.',{name:'Eric',occupation:'viking'},'KEY'],
							'I am Eric, and I am a viking.'
						],
						['Test that default for token naming is [#KEY]',
							['My name is [#name].',{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that specifying an empty object for substitutions simply produces the source string',
							['Hello, world!',{}],
							'Hello, world!'
						],
						['Test that the same substitution can be used multiple times',
							['My name is [#name]. [#name] is my name. You can call me [#name].',{name:'Eric'}],
							'My name is Eric. Eric is my name. You can call me Eric.'
						],
						['Test that substitution values that contain tokens are not further substituted into',
							['[#token1][#token2]',{token1:'[#token2]foo',token2:'bar'}],
							'[#token2]foobar'
						],
						['Test that tokens in the source string for which there aren\'t substitutions are left in the source string',
							['My name is [#name].',{occupation:'viking'}],
							'My name is [#name].'
						],
						['Test that substitutions for which there aren\'t tokens in the source string are ignored',
							['My name is [#name].',{name:'Eric',occupation:'viking'}],
							'My name is Eric.'
						],
						['Test that specifying an array for substitutions is handled correctly',
							['My name is [#0], and I am a [#1].',['Eric','viking']],
							'My name is Eric, and I am a viking.'
						],
						['Test that specifying an empty array for substitutions simply produces the source string',
							['Hello, world!',[]],
							'Hello, world!'
						],
						['Test that non-string substitution values are correctly coerced to strings',
							[
								'[#int] [#neg] [#float] [#nan] [#infinity] [#true] [#false] [#obj] [#null] [#undefined]',
								{
									int:5,neg:-5,float:5.5,nan:NaN,infinity:Infinity,
									'true':true,'false':false,
									obj:Uize.Class.Value ({value:'OBJECT'}),
									'null':null,'undefined':undefined
								}
							],
							'5 -5 5.5 NaN Infinity true false OBJECT null undefined'
						],
						['Test that a string type substitution is treated as a substitutions array with one element',
							['My name is [#0].','Eric'],
							'My name is Eric.'
						],
						['Test that a number type substitution is treated as a substitutions array with one element',
							['Pi is approximately [#0].',3.14159265359],
							'Pi is approximately 3.14159265359.'
						],
						['Test that a boolean type substitution is treated as a substitutions array with one element',
							['It is not [#0] that the Earth is flat.',true],
							'It is not true that the Earth is flat.'
						],
						['Test that substitution keys are case-sensitive, as designed',
							['My name is [#name], and not [#NAME]!',{name:'Eric',NAME:'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that substitution keys are space-sensitive, as designed',
							['My name is [#name], and not [# name ]!',{name:'Eric',' name ':'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that spaces in the token opener and token closer are significant, as designed',
							['[name] [ name] [name ] [ name ]',{name:'Eric'},'[ KEY ]'],
							'[name] [ name] [name ] Eric'
						],
						['Test that a token opener containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\name].',{name:'Eric'},'[^$|{}[]()?.*+\\KEY]'],
							'My name is Eric.'
						],
						['Test that a token closer containing regular expression special characters is handled correctly',
							['My name is [name^$|{}[]()?.*+\\].',{name:'Eric'},'[KEY^$|{}[]()?.*+\\]'],
							'My name is Eric.'
						],
						['Test that a substitution key containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\].',{'^$|{}[]()?.*+\\':'Eric'},'[KEY]'],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be a number',
							[3.14159265359,{'.':','},'KEY'],
							'3,14159265359'
						],
						['Test that the source for substituting into can be a boolean',
							[true,{ru:'Russia'},'KEY'],
							'tRussiae'
						],
						['Test that the source for substituting into can be an object that implements a value interface',
							[Uize.Class.Value ({value:'My name is [#name].'}),{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be an array, whose elements will be concatenated',
							[['[#name]','[#occupation]'],{name:'Eric',occupation:'viking'}],
							'Eric,viking'
						]
					]],
					['Uize.indexIn',[
						/*** test support for source being an array ***/
							['Test that specifying an empty array for the source parameter produces the result -1',
								[[],1],
								-1
							],
							['Test that the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
								[[0,1,'1','1',1,2],'1',true,false],
								4
							],
							['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
								[[0,1,'1','1',1,2],'1',true],
								3
							],
							['Test that the fromEndBOOL parameter is defaulted to false, as designed',
								[[0,1,'1','1',1,2],'1'],
								2
							],
							['Test that -1 is returned when the value is not found in the source array',
								[[0,1,'1','1',1,2],'0'],
								-1
							],
							['Test that the method doesn\'t scan past the end of the source array and find a match for undefined in the first element beyond the end of the array',
								[[0,1,'1','1',1,2],undefined],
								-1
							],

						/*** test support for source being a list object ***/
							['Test that specifying an empty list object for the source parameter produces the result -1',
								[_arrayToListObject ([]),1],
								-1
							],
							['Test that, when the source is a list object, the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
								[_arrayToListObject ([0,1,'1','1',1,2]),'1',true,false],
								4
							],
							['Test that, when the source is a list object, the strictEqualityBOOL parameter is defaulted to true, as designed',
								[_arrayToListObject ([0,1,'1','1',1,2]),'1',true],
								3
							],
							['Test that, when the source is a list object, the fromEndBOOL parameter is defaulted to false, as designed',
								[_arrayToListObject ([0,1,'1','1',1,2]),'1'],
								2
							],
							['Test that, when the source is a list object, -1 is returned when the value is not found in the source list object',
								[_arrayToListObject ([0,1,'1','1',1,2]),'0'],
								-1
							],
							{
								title:'Test that the method will correctly find the index of a value in JavaScript\'s special arguments variable inside functions',
								test:function () {
									function _dummyFunction () {
										return Uize.indexIn (arguments,'1',true,false);
									}
									return this.expect (4,_dummyFunction (0,1,'1','1',1,2));
								}
							},

						/*** test support for source being a non-list object ***/
							['Test that specifying an empty non-list object for the source parameter produces the result -1',
								[{},1],
								-1
							],
							['Test that, when the source is a non-list object, the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'1',true,false],
								'p4'
							],
							['Test that, when the source is a non-list object, the strictEqualityBOOL parameter is defaulted to true, as designed',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'1',true],
								'p3'
							],
							['Test that, when the source is a non-list object, the fromEndBOOL parameter is defaulted to false, as designed',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'1'],
								'p2'
							],
							['Test that, when the source is a non-list object, -1 is returned when the value is not found in the object',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'0'],
								-1
							],

						/*** test handling of source being neither array nor object ***/
							['Test that calling with no parameters produces the result -1',
								[],
								-1
							],
							['Test that specifying null for the source parameter produces the result -1',
								[null,null],
								-1
							],
							['Test that specifying undefined for the source parameter produces the result -1',
								[undefined,undefined],
								-1
							],
							['Test that specifying a number for the source parameter produces the result -1',
								[5,5],
								-1
							],
							['Test that specifying a string for the source parameter produces the result -1',
								['hello','hello'],
								-1
							],
							['Test that specifying a boolean for the source parameter produces the result -1',
								[true,true],
								-1
							]
					]],
					['Uize.isIn',[
						['Test that calling with no parameters produces the result false',
							[],
							false
						],
						['Test that specifying null for the source parameter produces the result false',
							[null,null],
							false
						],
						['Test that specifying undefined for the source parameter produces the result false',
							[undefined,undefined],
							false
						],
						['Test that specifying a number for the source parameter produces the result false',
							[5,5],
							false
						],
						['Test that specifying a string for the source parameter produces the result false',
							['hello','hello'],
							false
						],
						['Test that specifying a boolean for the source parameter produces the result false',
							[true,true],
							false
						],
						['Test that specifying an empty array for the source parameter produces the result false',
							[[],1],
							false
						],
						['Test that the value false for the strictEqualityBOOL parameter ia observed correctly',
							[[0,1],'1',false],
							true
						],
						['Test that the value true for the strictEqualityBOOL parameter ia observed correctly',
							[[0,1],'1',true],
							false
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1],'1'],
							false
						],
						['Test that false is returned when the value is not found in the source array',
							[[0,1],2],
							false
						],

						/*** test support for object source ***/
							['Test that true is returned when the source is an object, and the value is the value of one of the source object\'s properties',
								[{foo:'bar',hello:'world'},'bar'],
								true
							],
							['Test that false is returned when the source is an object, and the value is not one of the object\'s propertes\' values',
								[{foo:'bar',hello:'world'},'blah'],
								false
							],
							['Test that the value false for the strictEqualityBOOL parameter ia observed correctly when the source is an object',
								[{prop1:0,prop2:1},'1',false],
								true
							],
							['Test that the value true for the strictEqualityBOOL parameter ia observed correctly when the source is an object',
								[{prop1:0,prop2:1},'1',true],
								false
							]
					]],
					['Uize.isEmpty',[
						['Test that empty object is considered empty',[{}],true],
						['Test that empty array is considered empty',[[]],true],
						['Test that empty string is considered empty',[''],true],
						['Test that String object initialized to empty string is considered empty',[new String ('')],true],
						['Test that the number zero is considered empty',[0],true],
						['Test that Number object initialized to zero is considered empty',[new Number (0)],true],
						['Test that the boolean false is considered empty',[false],true],
						['Test that Boolean object initialized to false is considered empty',[new Boolean (false)],true],
						['Test that null is considered empty',[null],true],
						['Test that undefined is considered empty',[undefined],true],
						['Test that NaN is considered empty',[NaN],true],
						['Test that class instance with empty value state property is considered empty',
							[Uize.Class.Value ({value:0})],
							true
						],
						['Test that a non-empty object is not considered empty',[{blah:0}],false],
						['Test that a non-empty array is not considered empty',[['blah']],false],
						['Test that a non-empty string is not considered empty',['blah'],false],
						['Test that String object initialized to non-empty string is not considered empty',
							[new String ('foo')],
							false
						],
						['Test that a non-zero number is not considered empty',[1],false],
						['Test that Number object initialized to non-zero number is not considered empty',
							[new Number (1)],
							false
						],
						['Test that the boolean true is not considered empty',[true],false],
						['Test that Boolean object initialized to true is not considered empty',[new Boolean (true)],false],
						//['Test that a regular expression is not considered empty',[/^.+$/],false],
						['Test that a function (even an empty one) is not considered empty',function () {},false],
						['Test that class instance with non-empty value state property is not considered empty',
							[Uize.Class.Value ({value:1})],
							false
						]
					]],
					['Uize.emptyOut',[
						{
							title:'Test that emptying out an already empty array produces that same empty array as the result',
							test:function () {
								var
									_source = [],
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Test that emptying out an already empty object produces that same empty object as the result',
							test:function () {
								var
									_source = {},
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Test that emptying out an array with contents produces that same array with no contents as the result',
							test:function () {
								var
									_source = [1,2,3,4,5],
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,[]);
							}
						},
						{
							title:'Test that emptying out an object with contents produces that same object with no contents as the result',
							test:function () {
								var
									_source = {foo:1,bar:1},
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,{});
							}
						},
						['Test that specifying the value null for the source produces the value null as the result',
							null,
							null
						],
						['Test that specifying the value undefined for the source produces the value undefined as the result',
							undefined,
							undefined
						]
					]],
					['Uize.recordMatches',[
						['Test that specifying the value null for the record produces the result false',
							[null,{foo:'bar'}],
							false
						],
						['Test that specifying the value undefined for the record produces the result false',
							[undefined,{foo:'bar'}],
							false
						],
						['Test that specifying the value null for the match object produces the result true',
							[{foo:'bar'},null],
							true
						],
						['Test that specifying the value undefined for the match object produces the result true',
							[{foo:'bar'},undefined],
							true
						],
						['Test that specifying an empty match object produces the result true',
							[{foo:'bar'},{}],
							true
						],
						['Test that specifying a match object that contains properties that aren\'t in the record produces the result false',
							[{foo:'bar'},{hello:'world'}],
							false
						],
						['Test that specifying a match object with a property that is in the record but whose value is not the same produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'dunno'}],
							false
						],
						['Test that specifying a match object with a property that is in the record and whose values is equal but not in a strict equality produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'42'}],
							false
						],
						['Test that specifying a match object with a property that is in the record and whose values is equal in a strict equality produces the result true',
							[{meaningOfLife:42},{meaningOfLife:42}],
							true
						],
						['Test that specifying a match object with multiple properties and that is only a partial match with the record produces the result false',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'there',meaningOfLife:42}],
							false
						],
						['Test that specifying a match object with multiple properties and that is a complete match with the record produces the result true',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'world',meaningOfLife:42}],
							true
						],
						['Test that properties that are in the record but that are not in the match object are not considered and do not affect the success of the match',
							[{foo:'bar',hello:'world',meaningOfLife:42},{meaningOfLife:42}],
							true
						]
					]],
					['Uize.findRecordNo',[
						['Test that specifying null for the records results in the value -1 being returned, regardless of what the specified default value is',
							[null,{},5],
							-1
						],
						['Test that specifying undefined for the records results in the value -1 being returned, regardless of what the specified default value is',
							[undefined,{},5],
							-1
						],
						['Test that not specifying a default number results in the value -1 being used for default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'}],
							-1
						],
						['Test that specifying the value null for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},null],
							-1
						],
						['Test that specifying the value undefined for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},undefined],
							-1
						],
						['Test that specifying a string value for detault number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},'2'],
							2
						],
						['Test that specifying a boolean value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},true],
							1
						],
						['Test that specifying an object value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},Uize.Class.Value ({value:2})],
							2
						],
						['Test that specifying an object value for the default number that cannot be coerced to a number results in the value -1 being used for the default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},Uize.Class.Value ({value:'blah'})],
							-1
						],
						['Test that the index of the first matching record is returned when the match matches a record',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'bar'}],
							1
						],
						['Test that the value 0 is returned when the value null is specified for the match',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],null],
							0
						]
					]],
					['Uize.findRecord',[
						['Test that specifying null for the records results in the value null being returned',
							[null,{},5],
							null
						],
						['Test that specifying undefined for the records results in the value null being returned',
							[undefined,{},5],
							null
						],
						{
							title:'Test that the first matching record is returned when the match matches a record',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [1],Uize.findRecord (_records,{foo:'bar'}));
							}
						},
						{
							title:'Test that the first record is returned when the value null is specified for the match',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [0],Uize.findRecord (_records,null));
							}
						},
						{
							title:'Test that the record for the specified default record number is returned when no matching record is found',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [2],Uize.findRecord (_records,{foo:'woo'},2));
							}
						}
					]],
					['Uize.getGuid',[
						{
							title:'Test that a string type value is returned, as expected',
							test:function () {return this.expectNonEmptyString (Uize.getGuid ())}
						},
						{
							title:'Test that result is different across ten successive calls',
							test:function () {
								var _callResults = [];
								for (var _callNo = -1; ++_callNo < 10;)
									_callResults.push (Uize.getGuid ())
								;
								return this.expectNoRepeats (_callResults);
							}
						}
					]],
					{
						title:'Test that the deprecated Uize.globalEval method is still supported and is simply a reference to the Uize.laxEval method',
						test:function () {
							return this.expectSameAs (Uize.globalEval,Uize.laxEval);
						}
					},
					['Uize.global',[
						{
							title:'Test that the method returns a reference to the global object',
							test:function () {
								return this.expectSameAs (
									Function ('return (function () {return this}) ()') (),
									Uize.global ()
								);
							}
						}
					]],
					['Uize.eval',[
						['Test that the specified code is evaluated and that the result of the evaluated code is returned',
							'2 + 3',
							5
						],
						{
							title:'Test that the specified code is evaluated in a quarantined fashion, having access only to the global scope',
							test:function () {
								var
									_Uize_eval = Uize.eval,
									_evalResult
								;
								(function () {
									/* NOTE:
										Because of variable hoisting, we need to do our trick with a local Uize variable inside a nested immediately invoked anonymous function.
									*/
									var Uize = {};
									_evalResult = _Uize_eval ('Uize.eval');
								}) ();
								return this.expectSameAs (_Uize_eval,_evalResult);
							}
						},
						{
							title:'Test that the specified code is evaluated using JavaScript strict mode',
							test:function () {
								var _errorThrown = false;
								try {
									Uize.eval ('with ({}) {}');
								} catch (_error) {
									_errorThrown = true;
								}
								return this.expect (_strictModeSupported,_errorThrown);
							}
						}
					]],
					['Uize.laxEval',[
						['Test that the specified code is evaluated and that the result of the evaluated code is returned',
							'2 + 3',
							5
						],
						{
							title:'Test that the specified code is evaluated in a quarantined fashion, having access only to the global scope',
							test:function () {
								var
									_Uize_laxEval = Uize.laxEval,
									_laxEvalResult
								;
								(function () {
									/* NOTE:
										Because of variable hoisting, we need to do our trick with a local Uize variable inside a nested immediately invoked anonymous function.
									*/
									var Uize = {};
									_laxEvalResult = _Uize_laxEval ('Uize.laxEval');
								}) ();
								return this.expectSameAs (_Uize_laxEval,_laxEvalResult);
							}
						},
						{
							title:'Test that the specified code is evaluated using non-strict mode',
							test:function () {
								var _errorThrown = false;
								try {
									Uize.laxEval ('with ({}) {}');
								} catch (_error) {
									_errorThrown = true;
								}
								return this.expect (false,_errorThrown);
							}
						}
					]],
					['Uize.quarantine',[
						{
							title:'Test that the method returns a function that is not just a reference to the source function',
							test:function () {
								var
									_functionToQuarantine = function () {},
									_quarantinedFunction = Uize.quarantine (_functionToQuarantine)
								;
								return (
									this.expectFunction (_quarantinedFunction) &&
									this.expect (false,_quarantinedFunction === _functionToQuarantine)
								);
							}
						},
						{
							title:'Test that the quarantined function is equivalent to the source function in its behavior',
							test:function () {
								var
									_functionToQuarantine = function (a,b) {return Math.pow (a,b)},
									_quarantinedFunction = Uize.quarantine (_functionToQuarantine)
								;
								return this.expect (8,_quarantinedFunction (2,3));
							}
						},
						{
							title:'Test that the quarantined function is truly quarantined from the scope of the source function',
							test:function () {
								var
									_quarantinedFunction = Uize.quarantine (function () {return Uize.quarantine}),
									_Uize_quarantine = Uize.quarantine,
									_quarantinedFunctionResult
								;
								(function () {
									/* NOTE:
										Because of variable hoisting, we need to do our trick with a local Uize variable inside a nested immediately invoked anonymous function.
									*/
									var Uize = {};
									_quarantinedFunctionResult = _quarantinedFunction ();
								}) ();
								return this.expectSameAs (_Uize_quarantine,_quarantinedFunctionResult);
							}
						}
					]],
					['Uize.getClass',[
						/*** test when value can't be resolved to a class ***/
							['Test that calling with no parameters produces the result undefined',[],undefined],
							['Test that the value null is resolved to result undefined',null,undefined],
							['Test that the value undefined is resolved to result undefined',null,undefined],

						/*** test resolving JavaScript primitives to a class ***/
							['Test that a number primitive is resolved to the Number object',42,Number],
							['Test that the special number value Infinity is resolved to the Number object',Infinity,Number],
							['Test that the special number value NaN is resolved to the Number object',NaN,Number],
							['Test that a string value is resolved to the String object','foo',String],
							['Test that boolean value is resolved to the Boolean object',true,Boolean],

						/*** test resolving instances of JavaScript's built-in objects to a class ***/
							['Test that a Number object instance is resolved to the Number object',new Number (42),Number],
							['Test that a String object instance is resolved to the String object',new String ('foo'),String],
							['Test that a Boolean object instance is resolved to the Boolean object',
								new Boolean (true),
								Boolean
							],
							['Test that a RegExp object instance is resolved to the RegExp object',new RegExp ('\\d+'),RegExp],

						/*** test resolving implicitly created instances of JavaScript's built-in objects to a class ***/
							['Test that an object created using literal syntax is resolved to the Object object',
								{foo:'bar'},
								Object
							],
							['Test that an array created using literal syntax is resolved to the Array object',
								[['foo','bar']],
								Array
							],
							['Test that a regular expression created using literal syntax is resolved to the RegExp object',
								/\d+/,
								RegExp
							],

						/*** test resolving instances of Uize.Class subclasses ***/
							['Test that an instance of the Uize.Class base class is resolved to the Uize.Class class',
								Uize.Class (),
								Uize.Class
							],

						/*** test resolving classes and object constructors to a class ***/
							['Test that the Object object is resolved to the Object object',Object,Object],
							['Test that the Number object is resolved to the Number object',Number,Number],
							['Test that the String object is resolved to the String object',String,String],
							['Test that the Boolean object is resolved to the Boolean object',Boolean,Boolean],
							['Test that the RegExp object is resolved to the RegExp object',RegExp,RegExp],
							['Test that the Uize.Class object is resolved to the Uize.Class object',Uize.Class,Uize.Class],
							{
								title:'Test that resolving a function to a class results in the function being returned',
								test:function () {
									var _function = function () {};
									return this.expectSameAs (_function,Uize.getClass (_function));
								}
							}
					]],
					['Uize.isInstance',[
						['Test that calling with no parameters produces the result false',[],false],
						['Test that null is not regarded as a Uize subclass instance',null,false],
						['Test that undefined is not regarded as a Uize subclass instance',undefined,false],
						['Test that a string is not regarded as a Uize subclass instance','hello',false],
						['Test that a number is not regarded as a Uize subclass instance',5,false],
						['Test that a boolean is not regarded as a Uize subclass instance',true,false],
						['Test that a simple object is not regarded as a Uize subclass instance',{},false],
						['Test that an array is not regarded as a Uize subclass instance',[],false],
						['Test that a regular expression is not regarded as a Uize subclass instance',/\d+/,false],
						['Test that a function is not regarded as a Uize subclass instance',Uize.nop,false],
						['Test that a Uize class is not regarded as a Uize subclass instance',Uize,false],
						['Test that a Uize package is not regarded as a Uize subclass instance',Uize.Data,false],
						['Test that a Uize instance is correctly regarded as a Uize subclass instance',Uize.Class (),true]
					]],
					['Uize.clone',[
						/*** test cloning of null values ***/
							['Test that cloning the value null produces the value null',null,null],
							['Test that cloning the value undefined produces the value undefined',undefined,undefined],

						/*** test cloning of string valus ***/
							['Test that cloning an empty string produces an empty string','',''],
							['Test that cloning a non-empty string is handled correctly','solar','solar'],

						/*** test cloning of number values ***/
							['Test that cloning the value 0 produces the value 0',0,0],
							['Test that cloning a negative number is handled correctly',-1,-1],
							['Test that cloning a positive number is handled correctly',1,1],
							['Test that cloning the special number value NaN is handled correctly',NaN,NaN],
							['Test that cloning the special number value Infinity is handled correctly',Infinity,Infinity],
							['Test that cloning the special number value -Infinity is handled correctly',-Infinity,-Infinity],

						/*** test cloning of boolean values ***/
							['Test that cloning the boolean value false produces the value false',false,false],
							['Test that cloning the boolean value true produces the value true',true,true],

						/*** test cloning of instances of JavaScript's built-in objects ***/
							_cloneObjectTest (
								'Test that cloning an instance of the RegExp object is handled correctly',
								RegExp,
								new RegExp ('^\\s+$','gim')
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Date object is handled correctly',
								Date,
								'2001/9/11'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the String object is handled correctly',
								String,
								'solar'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Number object is handled correctly',
								Number,
								42
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Boolean object is handled correctly',
								Boolean,
								true
							),

						/*** test cloning of one level deep simple objects ***/
							['Test that cloning an empty object produces an empty object',{},{}],
							_cloneObjectTest (
								'Test that the clone of an object is not a reference to that object, but is a new object',
								Object,
								{}
							),
							['Test that cloning a non-empty object produces an identical copy of that object',
								_oneLevelDeepTestObjectForCloning,
								_oneLevelDeepTestObjectForCloning
							],

						/*** test cloning of one level deep arrays ***/
							['Test that cloning an empty array produces an empty array',[[]],[]],
							_cloneObjectTest (
								'Test that the clone of an array is not a reference to that array, but is a new array',
								Array,
								[]
							),
							['Test that cloning a non-empty array produces an identical copy of that array',
								[_oneLevelDeepTestArrayForCloning],
								_oneLevelDeepTestArrayForCloning
							],
							{
								title:'Test that cloning a non-empty array with custom properties preserves the custom properties in the clone',
								test:function () {
									var _arrayWithCustomProperties = [0,1,2];
									_arrayWithCustomProperties.foo = 'bar';
									return this.expect (_arrayWithCustomProperties,Uize.clone (_arrayWithCustomProperties));
								}
							},

						/*** test cloning of complex data structures ***/
							['Test that cloning a complex object data structure is handled correctly',
								[_complexObjectDataStructure],
								_complexObjectDataStructure
							],
							['Test that cloning a complex array data structure is handled correctly',
								[_complexArrayDataStructure],
								_complexArrayDataStructure
							],

						/*** test cloning of value types that should just be copied by reference ***/
							{
								title:'Test that cloning a function simply returns a reference to that function',
								test:function () {
									var _toClone = Uize.nop;
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},
							{
								title:'Test that cloning a Uize class instance simply returns a reference to that instance',
								test:function () {
									var _toClone = Uize.Class ();
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},

						/*** miscellaneous ***/
							['Test that specifying no parameter is equivalent to cloning the value undefined',
								[],
								undefined
							]
					]],
					['Uize.map',[
						['Test that function mapper gets element value as a parameter correctly',
							[['a','b','c'],function (_value) {return _value.toUpperCase ()}],
							['A','B','C']
						],
						['Test that function mapper gets element key as a parameter correctly',
							[['a','b','c'],function (_value,_key) {return _key}],
							[0,1,2]
						],
						['Test that function mapper is called as instance method on array correctly',
							[['a','b','c'],function () {return this.length}],
							[3,3,3]
						],
						['Test that number can be specified in place of a source array',
							[['a','b','c'],function (_value,_key) {return (_key + 1) + ' of ' + this.length + ' = ' + _value}],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['Test that a string can be used to specify a mapper',
							[['a','b','c'],'(key + 1) + \' of \' + this.length + \' = \' + value'],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['Test that a source object is automatically mapped to a object',
							[{a:0,b:1,c:2},'key + value'],
							{a:'a0',b:'b1',c:'c2'}
						],
						['Test that an empty array maps to an empty array',
							[[],'value'],
							[]
						],
						['Test that an empty object maps to an empty object',
							[{},'value'],
							{}
						],

						/*** test target parameter ***/
							['Test that map can be used to convert an array to an object by specifying an empty object target',
								[['a','b','c'],'value',{}],
								{0:'a',1:'b',2:'c'}
							],
							['Test that map can be used to convert an object to an array by specifying an empty array target',
								[{0:'a',1:'b',2:'c'},'value',[]],
								['a','b','c']
							],
							['Test that an empty array maps to an empty object, when an empty object target is specified',
								[[],'value',{}],
								{}
							],
							['Test that an empty object maps to an empty array, when an empty array target is specified',
								[{},'value',[]],
								[]
							],
							_arrayMethodTargetTest (
								'Uize',
								'map',
								[1,2,3,4,5],
								[2,4,6,8,10],
								[null,'value * 2',null],
								0,
								2
							)
					]],
					['Uize.forEach',[
						/*** test support for the source being an array ***/
							{
								title:'Test that, when the source is an empty array, the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach ([],function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var
										_context = {},
										_seenContext
									;
									Uize.forEach (['foo'],function () {_seenContext = this},_context);
									return this.expectSameAs (_context,_seenContext);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler receives the value of elements of the array as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (['foo','bar'],function (_value) {_seenValues.push (_value)});
									return this.expect (['foo','bar'],_seenValues);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler receives the index of elements of the array as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (['foo','bar'],function (_value,_key) {_seenKeys.push (_key)});
									return this.expect ([0,1],_seenKeys);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler receives a reference to the source array as its third argument',
								test:function () {
									var
										_source = ['foo'],
										_seenSource
									;
									Uize.forEach (_source,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (_source,_seenSource);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called only for assigned elements of the source array when the optional allArrayElemnts parameter is not specified',
								test:function () {
									var
										_source = [],
										_seenElements = []
									;
									_source [1] = 'foo';
									_source [3] = 'bar';
									Uize.forEach (_source,function (_element) {_seenElements.push (_element)});
									return this.expect (['foo','bar'],_seenElements);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called only for assigned elements of the source array when false is specified for the optional allArrayElemnts parameter',
								test:function () {
									var
										_source = [],
										_seenElements = []
									;
									_source [1] = 'foo';
									_source [3] = 'bar';
									Uize.forEach (_source,function (_element) {_seenElements.push (_element)},false);
									return this.expect (['foo','bar'],_seenElements);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called even for unassigned elements of the source array when true is specified for the optional allArrayElemnts parameter',
								test:function () {
									var
										_source = [],
										_seenElements = []
									;
									_source [1] = 'foo';
									_source [3] = 'bar';
									Uize.forEach (_source,function (_element) {_seenElements.push (_element)},0,true);
									return this.expect ([undefined,'foo',undefined,'bar'],_seenElements);
								}
							},

						/*** test support for the source being an object ***/
							{
								title:'Test that, when the source is an empty object, the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach ({},function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var
										_context = {},
										_seenContext
									;
									Uize.forEach ({foo:'bar'},function () {_seenContext = this},_context);
									return this.expectSameAs (_context,_seenContext);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler receives the value of properties of the object as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach ({foo:'bar',hello:'world'},function (_value) {_seenValues.push (_value)});
									return this.expect (['bar','world'],_seenValues);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler receives the name of properties of the object as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach ({foo:'bar',hello:'world'},function (_value,_key) {_seenKeys.push (_key)});
									return this.expect (['foo','hello'],_seenKeys);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler receives a reference to the source object as its third argument',
								test:function () {
									var
										_source = {foo:'bar'},
										_seenSource
									;
									Uize.forEach (_source,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (_source,_seenSource);
								}
							},
							{
								title:'Test that, when the source is an object, specifying false for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_source = {foo:'bar'},
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										_source,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										false
									);
									return (
										this.expect ('bar',_seenValue) &&
										this.expect ('foo',_seenKey) &&
										this.expectSameAs (_source,_seenSource)
									);
								}
							},
							{
								title:'Test that, when the source is an object, specifying true for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_source = {foo:'bar'},
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										_source,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										true
									);
									return (
										this.expect ('bar',_seenValue) &&
										this.expect ('foo',_seenKey) &&
										this.expectSameAs (_source,_seenSource)
									);
								}
							},

						/*** test support for source being a length ***/
							{
								title:'Test that, when the source is the number zero, the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach (0,function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var
										_context = {},
										_seenContext
									;
									Uize.forEach (1,function () {_seenContext = this},_context);
									return this.expectSameAs (_context,_seenContext);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler receives the iteration index as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (10,function (_value) {_seenValues.push (_value)});
									return this.expect ([0,1,2,3,4,5,6,7,8,9],_seenValues);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler receives the iteration index as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (10,function (_value,_key) {_seenKeys.push (_key)});
									return this.expect ([0,1,2,3,4,5,6,7,8,9],_seenKeys);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler receives the source as its third argument',
								test:function () {
									var _seenSource;
									Uize.forEach (10,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (10,_seenSource);
								}
							},
							{
								title:'Test that, when the source is a number, specifying false for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										1,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										false
									);
									return (
										this.expect (0,_seenValue) &&
										this.expect (0,_seenKey) &&
										this.expectSameAs (1,_seenSource)
									);
								}
							},
							{
								title:'Test that, when the source is a number, specifying true for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										1,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										true
									);
									return (
										this.expect (0,_seenValue) &&
										this.expect (0,_seenKey) &&
										this.expectSameAs (1,_seenSource)
									);
								}
							},

						/*** test support for string iteration handler ***/
							{
								title:'Test that, when the iteration handler is a string, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var _context = {};
									Uize.forEach (1,'this.foo = "bar"',_context);
									return this.expect ({foo:'bar'},_context);
								}
							},
							{
								title:'Test that, when the iteration handler is a string, the iteration handler receives the iteration index as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (['foo','bar'],'this.push (value)',_seenValues);
									return this.expect (['foo','bar'],_seenValues);
								}
							},
							{
								title:'Test that, when the iteration handler is a string, the iteration handler receives the iteration index as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (['foo','bar'],'this.push (key)',_seenKeys);
									return this.expect ([0,1],_seenKeys);
								}
							},
							{
								title:'Test that, when the iteration handler is a string, the iteration handler receives the source as its third argument',
								test:function () {
									var
										_source = {foo:'bar'},
										_context = {}
									;
									Uize.forEach (_source,'source [key] = value.toUpperCase ()',_context);
									return this.expect ({foo:'BAR'},_source);
								}
							},

						/*** test handling of a non-object source ***/
							{
								title:'Test that, when the source is neither an array, object, nor length, the iterator is never called',
								test:function () {
									var _timesIteratorCalled = 0;
									function _iterator () {_timesIteratorCalled++}

									Uize.forEach (undefined,_iterator);
									Uize.forEach (null,_iterator);
									Uize.forEach (true,_iterator);
									Uize.forEach (NaN,_iterator);
									Uize.forEach ('foo',_iterator);

									return this.expect (0,_timesIteratorCalled);
								}
							}
					]],
					['Uize.callOn',[
						{
							title:'Test that specifying null for the object results in no action',
							test:function () {
								var _success = true;
								Uize.callOn (null,function () {_success = false});
								return _success;
							}
						},
						{
							title:'Test that specifying undefined for the object results in no action',
							test:function () {
								var _success = true;
								Uize.callOn (undefined,function () {_success = false});
								return _success;
							}
						},
						{
							title:
								'Test that specifying a value for method that is neither a string nor a function results in no error being produced',
							test:function () {
								var _target = Uize.Class ();
								Uize.callOn (_target);
								Uize.callOn (_target,null);
								Uize.callOn (_target,undefined);
								Uize.callOn (_target,42);
								Uize.callOn (_target,true);
								Uize.callOn (_target,{});
								Uize.callOn (_target,[]);
								return true;
							}
						},
						{
							title:
								'Test that specifying a function as the method and an instance as the target results in the function being called as an instance method on the instance',
							test:function () {
								var
									_target = Uize.Class (),
									_success = false
								;
								Uize.callOn (_target,function () {_success = this == _target});
								return _success;
							}
						},
						{
							title:
								'Test that when the optional arguments parameter is not specified, the arguments are defaulted to an empty array',
							test:function () {
								var
									_target = Uize.Class (),
									_success = false
								;
								Uize.callOn (_target,function () {_success = arguments.length == 0});
								return _success;
							}
						},
						{
							title:
								'Test that when the optional arguments parameter is specified, those arguments are passed in the call correctly',
							test:function () {
								var
									_target = Uize.Class (),
									_expectedArguments = ['foo',42,true],
									_actualArguments
								;
								Uize.callOn (
									_target,
									function () {_actualArguments = _copyArguments (arguments)},
									_expectedArguments
								);
								return this.expect (_expectedArguments,_actualArguments);
							}
						},
						{
							title:
								'Test that specifying the target as an instance and the method as a string does not result in an error being produced when the method is not defined on the instance',
							test:function () {
								var
									_target = Uize.Class (),
									_bogusMethodName = 'SOME-BOGUS-METHOD-NAME'
								;
								delete _target [_bogusMethodName];
								Uize.callOn (_target,_bogusMethodName);
								return true;
							}
						},
						{
							title:
								'Test that specifying the target as an instance and the method as a string results in the specified method being called as an instance method on the instance',
							test:function () {
								var
									_target = Uize.Class (),
									_success = false,
									_expectedArguments = ['foo',42,true],
									_actualArguments
								;
								_target.someSillyMethodName = function () {_actualArguments = _copyArguments (arguments)};
								Uize.callOn (_target,'someSillyMethodName',_expectedArguments);
								return this.expect (_expectedArguments,_actualArguments);
							}
						},
						{
							title:
								'Test that specifying an array as the target results in the method being called correctly on all elements of the array',
							test:function () {
								var
									_callLog = [],
									_DummyClass = Uize.Class.subclass (),
									_testArguments = ['foo',42,true],
									_subTarget0 = new _DummyClass ({name:'subTarget0'}),
									_subTarget1 = new _DummyClass ({name:'subTarget1'}),
									_subTarget2 = new _DummyClass ({name:'subTarget2'}),
									_target = [_subTarget0,_subTarget1,_subTarget2]
								;
								Uize.callOn (
									_target,
									function () {
										_callLog.push ({
											_name:this.get ('name'),
											_arguments:_copyArguments (arguments)
										});
									},
									_testArguments
								);
								return this.expect (
									[
										{_name:'subTarget0',_arguments:_testArguments},
										{_name:'subTarget1',_arguments:_testArguments},
										{_name:'subTarget2',_arguments:_testArguments}
									],
									_callLog
								);
							}
						},
						{
							title:
								'Test that specifying an object as the target results in the method being called correctly on all property values of the object',
							test:function () {
								var
									_callLog = [],
									_DummyClass = Uize.Class.subclass (),
									_testArguments = ['foo',42,true],
									_subTarget0 = new _DummyClass ({name:'subTarget0'}),
									_subTarget1 = new _DummyClass ({name:'subTarget1'}),
									_subTarget2 = new _DummyClass ({name:'subTarget2'}),
									_target = {foo:_subTarget0,bar:_subTarget1,helloworld:_subTarget2}
								;
								Uize.callOn (
									_target,
									function () {
										_callLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (
									[
										{_name:'subTarget0',_arguments:_testArguments},
										{_name:'subTarget1',_arguments:_testArguments},
										{_name:'subTarget2',_arguments:_testArguments}
									],
									_callLog
								);
							}
						},
						{
							title:'Test that recursion is handled correctly when the target is a complex data structure',
							test:function () {
								var
									_expectedCallLog = [],
									_actualCallLog = [],
									_DummyClass = Uize.Class.subclass (),
									_testArguments = ['foo',42,true],
									_subTargetNo = -1
								;
								function _getNextSubTarget () {
									var _subTargetName = 'subTarget' + ++_subTargetNo;
									_expectedCallLog.push ({
										_name:_subTargetName,
										_arguments:_testArguments
									});
									return new _DummyClass ({name:_subTargetName});
								}
								var _target = {
									foo:_getNextSubTarget (),
									bar:[ // array nested in an object
										_getNextSubTarget (),
										{ // object nested in an array
											hello:_getNextSubTarget (),
											there:{ // object nested in an object
												silly:_getNextSubTarget (),
												sausage:_getNextSubTarget ()
											},
											world:_getNextSubTarget ()
										},
										[ // array nested in an array
											_getNextSubTarget (),
											_getNextSubTarget ()
										]
									],
									blah:_getNextSubTarget ()
								};
								Uize.callOn (
									_target,
									function () {
										_actualCallLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (_expectedCallLog,_actualCallLog);
							}
						},
						{
							title:'Test that a function can be called as a method on values that are primitives or instances of objects that are not Uize subclasses',
							test:function () {
								var
									_values = [true,42,'foo',NaN,new Date ('01/01/2011'),/\d+/],
									_valuesCoercedToString = [],
									_valuesSeenByFunctionCoercedToString = []
								;
								for (var _valueNo = -1, _valuesLength = _values.length; ++_valueNo < _valuesLength;)
									_valuesCoercedToString.push (_values [_valueNo] + '')
								;
								Uize.callOn (_values,function () {_valuesSeenByFunctionCoercedToString.push (this + '')});
								return this.expect (_valuesCoercedToString,_valuesSeenByFunctionCoercedToString);
							}
						}
					]],
					['Uize.keys',[
						['Test that an object\'s keys are reported correctly',[{foo:1,bar:2}],['foo','bar']],
						['Test that a populated array\'s keys are reported correctly',[['a','b','c','d']],['0','1','2','3']],
						['Test that a sparsely populated array\'s keys are reported correctly',
							[_sparselyPopulatedArray],
							['2','7']
						],
						['Test that a non-zero length array that is unpopulated has no keys',[new Array (5)],[]],
						['Test that an empty array has no keys',[[]],[]],
						['Test that an empty object has no keys',[{}],[]],
						['Test that null has no keys',null,[]],
						['Test that undefined has no keys',undefined,[]],
						['Test that a boolean value has no keys',false,[]],
						['Test that a number value has no keys',5,[]],
						['Test that a string value has no keys','hello',[]]
					]],
					['Uize.totalKeys',[
						['Test that an object\'s total keys are reported correctly',[{foo:1,bar:2}],2],
						['Test that a populated array\'s total keys are reported correctly',[['a','b','c','d']],4],
						['Test that a sparsely populated array\'s total keys are reported correctly',
							[_sparselyPopulatedArray],
							2
						],
						['Test that a non-zero length array that is unpopulated has 0 keys',[new Array (5)],0],
						['Test that an empty array has 0 keys',[[]],0],
						['Test that an empty object has 0 keys',[{}],0],
						['Test that null has 0 keys',null,0],
						['Test that undefined has 0 keys',undefined,0],
						['Test that a boolean value has 0 keys',false,0],
						['Test that a number value has 0 keys',5,0],
						['Test that a string value has 0 keys','hello',0]
					]],
					['Uize.values',[
						['Test that an object\'s values are reported correctly',[{foo:1,bar:2}],[1,2]],
						['Test that a populated array\'s values are reported correctly',
							[['a','b','c','d']],
							['a','b','c','d']
						],
						{
							title:'Test that getting values for an array simply returns the array',
							test:function () {return Uize.values (_sparselyPopulatedArray) == _sparselyPopulatedArray}
						},
						['Test that a sparsely populated array\'s values are reported correctly',
							[_sparselyPopulatedArray],
							_sparselyPopulatedArray
						],
						['Test that a non-zero length array that is unpopulated has no values',
							[new Array (5)],
							new Array (5)
						],
						['Test that an empty array has no values',[[]],[]],
						['Test that an empty object has no values',[{}],[]],
						['Test that null has no values',null,[]],
						['Test that undefined has no values',undefined,[]],
						['Test that a boolean value has no values',false,[]],
						['Test that a number value has no values',5,[]],
						['Test that a string value has no values','hello',[]]
					]],
					['Uize.meldKeysValues',[
						['Test that the method correctly melds together the specified keys and values',
							[['foo','hello'],['bar','world']],
							{foo:'bar',hello:'world'}
						],
						['Test that surplus values are ignored',
							[['foo'],['bar','world']],
							{foo:'bar'}
						],
						['Test that surplus keys are ignored',
							[['foo','hello'],['bar']],
							{foo:'bar'}
						]
					]],
					['Uize.lookup',[
						['Test that true is the default value for the lookupValue paramter',
							[['foo','bar']],
							{foo:true,bar:true}
						],
						['Test that default can be specified as a value for the lookupValue paramter',
							[['foo','bar'],undefined],
							{foo:undefined,bar:undefined}
						],
						['Test that a values array with duplicate values is handled correctly',
							[['foo','foo','bar','bar']],
							{foo:true,bar:true}
						],
						['Test that a values array with different types of values is handled correctly',
							[['','string',true,4.01,NaN,Infinity,null,undefined],1],
							{'':1,'string':1,'true':1,'4.01':1,'NaN':1,'Infinity':1,'null':1,'undefined':1}
						],
						['Test that an empty values array produces an empty lookup object',
							[[]],
							{}
						],
						['Test that a sparsely populated values array produces a lookup object with a single "undefined" key for all the missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:true,2:true,'undefined':true}
						],
						['Test that a non-zero length values array that is unpopulated produces a lookup object with a single "undefined" key for all the undefined element values',
							[new Array (5)],
							{'undefined':true}
						],

						/*** test handling of the optional safeOrTarget parameter ***/
							['Test that specifying the value true for the optional safeOrTarget parameter results in a safe lookup object being created',
								[['foo','bar'],1,true],
								{
									foo:1,
									bar:1,
									constructor:undefined,
									toLocaleString:undefined,
									toString:undefined,
									valueOf:undefined
								}
							],
							{
								title:'Test that specifying the value false for the optional safeOrTarget parameter results in an unsafe lookup object being created',
								test:function () {
									var _lookup = Uize.lookup (null,1,false);
									return this.expect (
										true,
										!!(_lookup.constructor && _lookup.toLocaleString && _lookup.toString && _lookup.valueOf)
									);
								}
							},
							['Test that specifying the value true for the optional safeOrTarget parameter is handled correctly when the source array contains values that coincide with properties of the Object prototype',
								[['foo','bar','constructor','toLocaleString','toString','valueOf'],1,true],
								{
									foo:1,
									bar:1,
									constructor:1,
									toLocaleString:1,
									toString:1,
									valueOf:1
								}
							],
							{
								title:'Test that specifying a target object for the optional safeOrTarget parameter is handled correctly',
								test:function () {
									var
										_target = {foo:1},
										_lookup = Uize.lookup (['bar','hello','world'],2,_target)
									;
									return (
										this.expectSameAs (_target,_lookup) &&
										this.expect ({foo:1,bar:2,hello:2,world:2},_lookup)
									);
								}
							}
					]],
					['Uize.reverseLookup',[
						['Test that calling with no parameter produces an empty object',
							[],
							{}
						],
						['Test that calling with the value null specified produces an empty object',
							[null],
							{}
						],
						['Test that calling with the value undefined specified produces an empty object',
							[undefined],
							{}
						],
						['Test that an object with no duplicate values is handled correctly',
							[{foo:1,bar:2}],
							{1:'foo',2:'bar'}
						],
						['Test that an object with duplicate values is handled as expected (last mapping wins)',
							[{foo:1,bar:1}],
							{1:'bar'}
						],
						['Test that an empty object produces an empty reverse lookup object',
							[{}],
							{}
						],
						['Test that an object with different types of values is handled correctly',
							[{prop1:'',prop2:'string',prop3:true,prop4:4.01,prop5:NaN,prop6:Infinity,prop7:null,prop8:undefined}],
							{'':'prop1','string':'prop2','true':'prop3','4.01':'prop4','NaN':'prop5',Infinity:'prop6','null':'prop7','undefined':'prop8'}
						],
						['Test that an array can be specified as a source object',
							[['foo','bar']],
							{foo:'0',bar:'1'}
						],
						['Test that an empty array produces an empty reverse lookup object',
							[{}],
							{}
						],
						['Test that a sparsely populated values array produces a reverse lookup object with no "undefined" key for missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:'2',2:'7'}
						],
						['Test that a non-zero length values array that is unpopulated produces an empty reverse lookup object',
							[new Array (5)],
							{}
						],
						['Test that null produces an empty reverse lookup object',null,{}],
						['Test that undefined produces an empty reverse lookup object',undefined,{}],
						['Test that a boolean value produces an empty reverse lookup object',false,{}],
						['Test that a number value produces an empty reverse lookup object',5,{}],
						['Test that a string value produces an empty reverse lookup object','hello',{}],

						/*** test handling of the optional safeOrTarget parameter ***/
							['Test that specifying the value true for the optional safeOrTarget parameter results in a safe reverse lookup object being created',
								[{foo:'bar'},true],
								{
									bar:'foo',
									constructor:undefined,
									toLocaleString:undefined,
									toString:undefined,
									valueOf:undefined
								}
							],
							{
								title:'Test that specifying the value false for the optional safeOrTarget parameter results in an unsafe reverse lookup object being created',
								test:function () {
									var _reverseLookup = Uize.reverseLookup ({foo:'bar'},false);
									return this.expect (
										true,
										!!(
											_reverseLookup.constructor &&
											_reverseLookup.toLocaleString &&
											_reverseLookup.toString &&
											_reverseLookup.valueOf
										)
									);
								}
							},
							['Test that specifying the value true for the optional safeOrTarget parameter is handled correctly when the source object contains values that coincide with properties of the Object prototype',
								[{foo:'bar',prop1:'constructor',prop2:'toLocaleString',prop3:'toString',prop4:'valueOf'},true],
								{
									bar:'foo',
									constructor:'prop1',
									toLocaleString:'prop2',
									toString:'prop3',
									valueOf:'prop4'
								}
							],
							{
								title:'Test that specifying a target object for the optional safeOrTarget parameter is handled correctly',
								test:function () {
									var
										_target = {foo:'bar',hello:'world'},
										_reverseLookup = Uize.reverseLookup (_target,_target)
									;
									return (
										this.expectSameAs (_target,_reverseLookup) &&
										this.expect ({foo:'bar',hello:'world',bar:'foo',world:'hello'},_reverseLookup)
									);
								}
							}
					]],
					['Uize.max',[
						['Test that the maximum value from an object is reported correctly',[{foo:1,bar:2}],2],
						['Test that the maximum value from an array is reported correctly',[[1,2]],2],
						['Test that the maximum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['Test that the maximum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['Test that the maximum value from an empty array is -Infinity',[[]],-Infinity],
						['Test that the maximum value from an empty object is -Infinity',[{}],-Infinity],
						['Test that the maximum value from null is -Infinity',null,-Infinity],
						['Test that the maximum value from undefined is -Infinity',undefined,-Infinity],
						['Test that the maximum value from a boolean value is -Infinity',false,-Infinity],
						['Test that the maximum value from a number value is -Infinity',5,-Infinity],
						['Test that the maximum value from a string value is -Infinity','hello',-Infinity]
					]],
					['Uize.min',[
						['Test that the minimum value from an object is reported correctly',[{foo:1,bar:2}],1],
						['Test that the minimum value from an array is reported correctly',[[1,2]],1],
						['Test that the minimum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['Test that the minimum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['Test that the minimum value from an empty array is Infinity',[[]],Infinity],
						['Test that the minimum value from an empty object is Infinity',[{}],Infinity],
						['Test that the minimum value from null is Infinity',null,Infinity],
						['Test that the minimum value from undefined is Infinity',undefined,Infinity],
						['Test that the minimum value from a boolean value is Infinity',false,Infinity],
						['Test that the minimum value from a number value is Infinity',5,Infinity],
						['Test that the minimum value from a string value is Infinity','hello',Infinity]
					]],
					['Uize.now',[
						{
							title:'Test that the method returns an integer',
							test:function () {return this.expectInteger (Uize.now ())}
						},
						{
							title:'Test that the method returns the current time in milliseconds',
							test:function () {
								var
									_nowMs = +new Date,
									_result = Uize.now ()
								;
								return this.expectIntegerInRange (
									_nowMs,
									_nowMs + 10, // shouldn't take longer than 10ms to get into the method and compute its result
									_result
								);
							}
						}
					]],

					['Uize.toString',[
						/* TODO: implement tests */
					]],
					['Uize.module',[
						/* TODO: implement tests */
					]],
					['Uize.getModuleByName',[
						/* TODO: implement tests */
					]],
					['Uize.moduleLoader',[
						/* TODO: implement tests */
					]],
					['Uize.moduleUrlResolver',[
						/* TODO: implement tests */
					]],
					['Uize.getPathToLibrary',[
						/* TODO: implement tests */
					]]
				]),
				{
					title:'Data Module Pattern with Caching Accessor',
					test:function () {
						var _result;

						/*** declare MyNamespace namespace ***/
							Uize.module ({name:'MyNamespace'});

						/*** declare module with data records for engineering employees ***/
							Uize.module ({
								name:'MyNamespace.EngineeringEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module with data records for finance employees ***/
							Uize.module ({
								name:'MyNamespace.FinanceEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module that combines data for engineering and finance employees ***/
							Uize.module ({
								name:'MyNamespace.AllEmployees',
								required:[
									'MyNamespace.EngineeringEmployees',
									'MyNamespace.FinanceEmployees'
								],
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [].concat (
											MyNamespace.EngineeringEmployees (true),
											MyNamespace.FinanceEmployees (true)
										);
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare anonymous module that requires all employees module and compares to expected ***/
							Uize.module ({
								required:'MyNamespace.AllEmployees',
								builder:function () {
									_result = Uize.Data.identical (
										MyNamespace.AllEmployees (),
										[
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'},
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										]
									);
								}
							});

						return _result;
					}
				}
			]
		});

		/*** Public Static Methods ***/
			_class.arrayMethodTargetTest = _arrayMethodTargetTest;

		return _class;
	}
});

