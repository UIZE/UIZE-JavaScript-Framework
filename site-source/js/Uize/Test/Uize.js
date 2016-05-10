/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		'Uize.Data.Compare',
		'Uize.Class',
		'Uize.Class.Value',
		'Uize.Json'
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
					title:
						'The value ' + Uize.Json.to (_value) + ' is coerced to ' + Uize.Json.to (_expectedValue) +
						' (' +
							'wrapped with object = ' + _wrapValueWithObject + ', ' +
							'wrapped with function = ' + _wrapValueWithFunction +
						')',
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
				title:'Various types of values are coerced to number',
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
				title:'The function always returns the value of its first argument, unmodified',
				test:[
					{
						title:'Calling with no parameters returns undefined',
						test:function () {
							return this.expect (undefined,_functionGenerator () ());
						}
					},
					{
						title:'Calling with the value undefined returns the value undefined',
						test:function () {
							return this.expect (undefined,_functionGenerator () (undefined));
						}
					},
					{
						title:'Calling with the value null returns the value null',
						test:function () {
							return this.expect (null,_functionGenerator () (null));
						}
					},
					{
						title:'Calling with a number value returns that same number value',
						test:function () {
							return this.expect (42,_functionGenerator () (42));
						}
					},
					{
						title:'Calling with a boolean value returns that same boolean value',
						test:function () {
							return this.expect (false,_functionGenerator () (false));
						}
					},
					{
						title:'Calling with a string value returns that same string value',
						test:function () {
							return this.expect ('foo',_functionGenerator () ('foo'));
						}
					},
					{
						title:'Calling with a function value returns that same function value',
						test:function () {
							function _function () {}
							return this.expectSameAs (_function,_functionGenerator () (_function));
						}
					},
					{
						title:'Calling with an array value returns that same array, unmodified',
						test:function () {
							var _array = ['foo','bar'];
							return (
								this.expectSameAs (_array,_functionGenerator () (_array)) &&
								this.expect (['foo','bar'],_array)
							);
						}
					},
					{
						title:'Calling with an object value returns that same object, unmodified',
						test:function () {
							var _object = {foo:'bar'};
							return (
								this.expectSameAs (_object,_functionGenerator () (_object)) &&
								this.expect ({foo:'bar'},_object)
							);
						}
					},
					{
						title:'Calling with a regular expression value returns that same regular expression value',
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
					title:'Calling with ' + _inputValueName + ' returns the result ' + _expectedReturnValue,
					test:function () {
						return this.expect (_expectedReturnValue,_function (_inputValueName));
					}
				};
			}
			return {
				title:'The method always returns the value ' + _expectedReturnValue + ', regardless of its input',
				test:[
					{
						title:'Calling with no parameters returns ' + _expectedReturnValue,
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
			return Uize.Test.resolve ({
				title:'The targetARRAYorBOOL parameter is handled correctly for various types of values',
				test:[
					{
						title:'Specifying the value false for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (false);
							return (
								this.expect (true,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Specifying the value true for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (true);
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Specifying an empty array for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ([]);
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Specifying an array that is already populated with more elements for the optional targetARRAYorBOOL parameter is handled correctly',
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
						title:'Specifying an array that is already populated, but with the same number of elements, for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (_sourceArrayContents.concat ());
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Specifying the source array for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ();
							return (
								this.expect (true,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Specifying an empty object for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ({});
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (Uize.copy (_expectedTargetArrayContents),_target)
							);
						}
					},
					{
						title:'Specifying an object that already has some properties for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							var _someExtraCrud = {some:1,extra:1,crud:1};
							_callMethodWithTargetArgumentValue (Uize.copy (_someExtraCrud));
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (Uize.copy (_someExtraCrud,_expectedTargetArrayContents),_target)
							);
						}
					}
				]
			});
		}

		var _class = Uize.Test.resolve ({
			title:'Test for Uize Base Module',
			test:[
				Uize.Test.staticMethodsTest ([
					['Uize.noNew',[
						{
							title:'A wrapper object constructor is returned that is not the same as the wrapped object constructor',
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
							title:'Calling the wrapper object constructor results in the wrapped object constructor being called once',
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
							title:'When the wrapper object constructor is called using the new operator, an instance of the wrapper object is successfully created',
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
							title:'When the wrapper object constructor is called without using the new operator, an instance of the wrapper object is successfully created',
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
							title:'When the wrapper object constructor is called with a context of undefined, an instance of the wrapper object is created',
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
							title:'When the wrapper object constructor is called with a context of null, an instance of the wrapper object is created',
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
							title:'The wrapped object constructor is called as a method on the same instance as is returned by the wrapper object constructor',
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
							title:'When the wrapper object constructor is called as a method on an instance of the wrapper object constructor, the wrapped object constructor is called as a method on that same instance, and that same instance is returned',
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
							title:'When the wrapper object constructor is called as a method on an instance of an object other than the wrapper object, an instance of the wrapper object is created',
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
							title:'The arguments supplied to the wrapper object constructor when creating an instance are supplied also to the wrapped object constructor',
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
							title:'When two different wrapper object constructors are created for two different wrapped object constructors, there is no cross contamination of static and instance methods between the wrapper object constructors',
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
							title:'The properties of the wrapped object constructor are not transferred to the wrapper object constructor',
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
						['When the value is lower than the lower limit of the range, then the lower limit is returned',
							[-20,-10,10],
							-10
						],
						['When the value is equal to the lower limit of the range, then the lower limit is returned',
							[-10,-10,10],
							-10
						],
						['When the value is higher than the upper limit of the range, then the upper limit is returned',
							[20,-10,10],
							10
						],
						['When the value is equal to the upper limit of the range, then the upper limit is returned',
							[10,-10,10],
							10
						],
						['When the value is between the lower and upper limits of the range, then the value is returned',
							[1,-10,10],
							1
						],
						['When the range is reversed, constraining a value that is lower than the lower limit returns the lower limit',
							[-20,10,-10],
							-10
						],
						['When the range is reversed, constraining a value that is equal to the lower limit returns that value',
							[-10,10,-10],
							-10
						],
						['When the range is reversed, constraining a value that is higher than the upper limit returns the upper limit',
							[20,10,-10],
							10
						],
						['When the range is reversed, constraining a value that is equal to the upper limit returns that value',
							[10,10,-10],
							10
						],
						['When the range is reversed, constraining value that is within the range simply returns that value',
							[1,10,-10],
							1
						],
						['When the lower limit and the upper limit are equal, constraining a value that is lower than the lower limit returns the lower limit',
							[5,10,10],
							10
						],
						['When the lower limit and the upper limit are equal, constraining a value that is higher than the upper limit returns the upper limit',
							[15,10,10],
							10
						]
					]],
					['Uize.inRange',[
						['A number that is lower than the lower bound of a range is not considered in range',
							[-50,100,0],
							false
						],
						['A number that is at the lower bound of a range is considered in range',
							[0,100,0],
							true
						],
						['A number that is between the lower and upper bounds of a range is considered in range',
							[50,100,0],
							true
						],
						['A number that is at the upper bound of a range is considered in range',
							[100,100,0],
							true
						],
						['A number that is higher than the upper bound of a range is not considered in range',
							[150,100,0],
							false
						],

						/*** test support for date values ***/
							['A date that falls before the lower bound of a date range is not considered in range',
								[new Date ('01/01/1999'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								false
							],
							['A date that is at the lower bound of a date range is considered in range',
								[new Date ('01/01/2000'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['A date that is between the lower and upper bounds of a date range is considered in range',
								[new Date ('01/01/2005'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['A date that is at the upper bound of a date range is considered in range',
								[new Date ('01/01/2010'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['A date that falls after the upper bound of a date range is not considered in range',
								[new Date ('01/01/2011'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								false
							],

						/*** test support for object's with valueOf implemented ***/
							['An object whose value is lower than the lower bound of a range is not considered in range',
								[
									Uize.Class.Value ({value:-50}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								false
							],
							['An object whose value is at the lower bound of a range is considered in range',
								[
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								true
							],
							['An object whose value is between the lower and upper bounds of a range is considered in range',
								[
									Uize.Class.Value ({value:50}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								true
							],
							['An object whose value is at the upper bound of a range is considered in range',
								[
									Uize.Class.Value ({value:100}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								true
							],
							['An object whose value is higher than the upper bound of a range is not considered in range',
								[
									Uize.Class.Value ({value:150}),
									Uize.Class.Value ({value:0}),
									Uize.Class.Value ({value:100})
								],
								false
							],

						/*** test support for strings ***/
							['A string that falls before the lower bound of a string range is not considered in range',
								['a','b','y'],
								false
							],
							['A string that is at the lower bound of a string range is considered in range',
								['b','b','y'],
								true
							],
							['A string that is between the lower and upper bounds of a string range is considered in range',
								['m','b','y'],
								true
							],
							['A string that is at the upper bound of a string range is considered in range',
								['y','b','y'],
								true
							],
							['A string that falls after the upper bound of a string range is not considered in range',
								['z','b','y'],
								false
							],

						/*** test support for reversed range bounds ***/
							['When the bounds of a range are reversed, a value that is lower than the lower bound of the range is not considered in range',
								[-50,100,0],
								false
							],
							['When the bounds of a range are reversed, a value that is at the lower bound of the range is considered in range',
								[0,100,0],
								true
							],
							['When the bounds of a range are reversed, a value that is between the lower and upper bounds of the range is considered in range',
								[50,100,0],
								true
							],
							['When the bounds of a range are reversed, a value that is at the upper bound of the range is considered in range',
								[100,100,0],
								true
							],
							['When the bounds of a range are reversed, a value that is higher than the upper bound of the range is not considered in range',
								[150,100,0],
								false
							]
					]],
					['Uize.defaultNully',[
						['The value null is defaulted',[null,'foo'],'foo'],
						['The value undefined is defaulted',[undefined,'foo'],'foo'],
						['The boolean value false is not defaulted',[false,'foo'],false],
						['An empty string is not defaulted',['','foo'],''],
						['The number value 0 is not defaulted',[0,'foo'],0],
						['The special value NaN is not defaulted',[NaN,'foo'],NaN],
						{
							title:'An object type value is not defaulted',
							test:function () {
								var _object = {};
								return this.expectSameAs (_object,Uize.defaultNully (_object,'foo'));
							}
						},
						{
							title:'An array type value is not defaulted',
							test:function () {
								var _array = [];
								return this.expectSameAs (_array,Uize.defaultNully (_array,'foo'));
							}
						},
						{
							title:'A function type value is not defaulted',
							test:function () {
								var _function = Uize.nop;
								return this.expectSameAs (_function,Uize.defaultNully (_function,'foo'));
							}
						}
					]],
					['Uize.isArray',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as an array',undefined,false],
						['The value null is not regarded as an array',null,false],
						['A string type value is not regarded as an array','hello',false],
						['A String object instance is not regarded as an array',new String ('hello'),false],
						['A number type value is not regarded as an array',5,false],
						['A Number object instance is not regarded as an array',new Number (5),false],
						['A boolean type value is not regarded as an array',true,false],
						['A Boolean object instance is not regarded as an array',new Boolean (true),false],
						['An empty object is not regarded as an array',{},false],
						['A function is not regarded as an array',Uize.nop,false],
						['A regular expression instance is not regarded as an array',/\d+/,false],
						['An empty array is regarded as an array',[[]],true],
						['An array with elements is regarded as an array',[[1,2,3,4]],true]
					]],
					['Uize.isList',[
						/*** test values that should be considered to be list ***/
							['An empty JavaScript array is considered to be a list',
								[[]],
								true
							],
							['A JavaScript array with elements is considered to be a list',
								[['foo','bar','hello','world']],
								true
							],
							{
								title:'JavaScript\'s special arguments variable inside functions is considered to be a list',
								test:function () {
									return this.expect (true,Uize.isList (arguments));
								}
							},
							['An object with length property that is a number is considered to be a list',
								[_arrayToListObject (['foo','bar','hello','world'])],
								true
							],

						/*** test values that should not be considered to be list ***/
							['A number is not considered to be a list',42,false],
							['A boolean is not considered to be a list',true,false],
							['A string is not considered to be a list','foo',false],
							['The value null is not considered to be a list',null,false],
							['The value undefined is not considered to be a list',null,false],
							['A regular expression is not considered to be a list',/\d+/,false],
							['A function is not considered to be a list',function () {},false],
							['An object that has no length property is not considered to be a list',
								[{0:'foo',1:'bar'}],
								false
							],
							{
								title:'An object that has a length property that is not a number is not considered to be a list',
								test:function () {
									var _object = {0:'foo',1:'bar'};
									_object.length = '2';
									return this.expect (false,Uize.isList (_object));
								}
							}
					]],
					['Uize.isArguments',[
						['A non-empty arguments list object is considered to be an arguments object',
							[(function () {return arguments}) ('foo','bar')],
							true
						],
						['An empty arguments list object is considered to be an arguments object',
							[(function () {return arguments}) ()],
							true
						],
						['A regular array is not considered to be an arguments object',
							[['foo','bar']],
							false
						],
						['A listy object is not considered to be an arguments object',
							{0:'foo',1:'bar',length:2},
							false
						],
						['A non-listy object is not considered to be an arguments object',
							{foo:'bar'},
							false
						],
						['A function is not considered to be an arguments object',
							function () {},
							false
						],
						['A regular expression is not considered to be an arguments object',
							/foo/gi,
							false
						],
						['A string value is not considered to be an arguments object',
							'foo',
							false
						],
						['A boolean value is not considered to be an arguments object',
							true,
							false
						],
						['A number value is not considered to be an arguments object',
							42,
							false
						],
						['The value undefined is not considered to be an arguments object',
							undefined,
							false
						],
						['The value null is not considered to be an arguments object',
							null,
							false
						]
					]],
					['Uize.isNumber',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as a number',undefined,false],
						['The value null is not regarded as a number',null,false],
						['A number format string type value is not regarded as a number','5',false],
						['A number format String object instance is not regarded as a number',new String ('5'),false],
						['A boolean type value is not regarded as a number',true,false],
						['A Boolean object instance is not regarded as a number',new Boolean (true),false],
						['An object is not regarded as a number',{},false],
						['An array is not regarded as a number',[[]],false],
						['A function is not regarded as a number',Uize.nop,false],
						['A regular expression instance is not regarded as a number',/\d+/,false],
						['A number type value is regarded as a number',5,true],
						['The special value Infinity is regarded as a number',Infinity,true],
						['The special value -Infinity is regarded as a number',-Infinity,true],
						['The special value NaN is not regarded as a number',NaN,false],
						['A Number object instance is not regarded as a number',new Number (5),false]
					]],
					['Uize.isString',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as a string',undefined,false],
						['The value null is not regarded as a string',null,false],
						['A boolean type value is not regarded as a string',true,false],
						['A Boolean object instance is not regarded as a string',new Boolean (true),false],
						['An object is not regarded as a string',{},false],
						['An array is not regarded as a string',[[]],false],
						['A function is not regarded as a string',Uize.nop,false],
						['A regular expression instance is not regarded as a string',/\d+/,false],
						['A non-empty string value is regarded as a string','foo',true],
						['An empty string value is regarded as a string','',true],
						['A String object instance is not regarded as a string',new String ('foo'),false]
					]],
					['Uize.isBoolean',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as a boolean',undefined,false],
						['The value null is not regarded as a boolean',null,false],
						['A string value is not regarded as a boolean','foo',false],
						['An object is not regarded as a boolean',{},false],
						['An array is not regarded as a boolean',[[]],false],
						['A function is not regarded as a boolean',Uize.nop,false],
						['A regular expression instance is not regarded as a boolean',/\d+/,false],
						['The boolean value false is regarded as a boolean',false,true],
						['The boolean value true is regarded as a boolean',true,true],
						['A Boolean object instance is not regarded as a boolean',new Boolean (true),false]
					]],
					['Uize.isFunction',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as a function',undefined,false],
						['The value null is not regarded as a function',null,false],
						['A string value is not regarded as a function','foo',false],
						['A boolean value is not regarded as a function',true,false],
						['A number value is not regarded as a function',42,false],
						['An object is not regarded as a function',{},false],
						['An array is not regarded as a function',[[]],false],
						['A regular expression instance is not regarded as a function',/\d+/,false],
						['A function *is* regarded as a function',Uize.nop,true]
					]],
					['Uize.isNully',[
						['Calling with no parameters returns true',[],true],
						['The value undefined is regarded as being nully',undefined,true],
						['The value null is regarded as being nully',null,true],
						['A string value is not regarded as being nully','',false],
						['A boolean value is not regarded as being nully',false,false],
						['A number value is not regarded as being nully',0,false],
						['The special value NaN is not regarded as being nully',NaN,false],
						['An object is not regarded as being nully',{},false],
						['An array is not regarded as being nully',[[]],false],
						['A function is not regarded as being nully',Uize.nop,false],
						['A regular expression instance is not regarded as being nully',/\d+/,false]
					]],
					['Uize.isObject',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as being an object',undefined,false],
						['The value null is not regarded as being an object',null,false],
						['A string value is not regarded as being an object','foo',false],
						['A boolean value is not regarded as being an object',true,false],
						['A number value is not regarded as being an object',42,false],
						['The special value NaN is not regarded as being an object',NaN,false],
						['A function is not regarded as being an object',Uize.nop,false],
						['An object *is* regarded as being an object',{},true],
						['An array is regarded as being an object',[[]],true],
						['A regular expression instance is regarded as being an object',/\d+/,true],
						['A String object instance is regarded as being an object',new String (''),true],
						['A Boolean object instance is regarded as being an object',new Boolean (false),true],
						['A Number object instance is regarded as being an object',new Number (0),true]
					]],
					['Uize.canExtend',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as being extendable',undefined,false],
						['The value null is not regarded as being extendable',null,false],
						['A string value is not regarded as being extendable','foo',false],
						['A boolean value is not regarded as being extendable',true,false],
						['A number value is not regarded as being extendable',42,false],
						['The special value NaN is not regarded as being extendable',NaN,false],
						['A function is regarded as being extendable',Uize.nop,true],
						['An object is regarded as being extendable',{},true],
						['An array is regarded as being extendable',[[]],true],
						['A regular expression instance is regarded as being extendable',/\d+/,true],
						['A String object instance is regarded as being extendable',new String (''),true],
						['A Boolean object instance is regarded as being extendable',new Boolean (false),true],
						['A Number object instance is regarded as being extendable',new Number (0),true]
					]],
					['Uize.isPlainObject',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as being a plain object',undefined,false],
						['The value null is not regarded as being a plain object',null,false],
						['A string value is not regarded as being a plain object','foo',false],
						['A boolean value is not regarded as being a plain object',true,false],
						['A number value is not regarded as being a plain object',42,false],
						['The special value NaN is not regarded as being a plain object',NaN,false],
						['A function is not regarded as being a plain object',Uize.nop,false],
						['A plain object *is* regarded as being a plain object',{},true],
						['An array is not regarded as being a plain object',[[]],false],
						['A regular expression instance is not regarded as being a plain object',/\d+/,false],
						['A String object instance is not regarded as being a plain object',new String (''),false],
						['A Boolean object instance is not regarded as being a plain object',new Boolean (false),false],
						['A Number object instance is not regarded as being a plain object',new Number (0),false],
						['A Uize class instance is not regarded as being a plain object',Uize.Class (),false],
						{
							title:'An object that doesn\'t have a hasOwnProperty method is not regarded as being a plain object',
							test:function () {
								function _TestObject () {}
								_TestObject.prototype.hasOwnProperty = null;
								return this.expect (false,Uize.isPlainObject (new _TestObject));
							}
						}
					]],
					['Uize.isPrimitive',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as being a primitive',undefined,false],
						['The value null is not regarded as being a primitive',null,false],
						['A string value is regarded as being a primitive','',true],
						['A boolean value is regarded as being a primitive',false,true],
						['A number value is regarded as being a primitive',0,true],
						['The special value NaN is regarded as being a primitive',NaN,true],
						['A function is not regarded as being a primitive',Uize.nop,false],
						['An object is not regarded as being a primitive',{},false],
						['An array is not regarded as being a primitive',[[]],false],
						['A regular expression instance is not regarded as being a primitive',/\d+/,false],
						['A String object instance is not regarded as being a primitive',new String ('foo'),false],
						['A Boolean object instance is not regarded as being a primitive',new Boolean (true),false],
						['A Number object instance is not regarded as being a primitive',new Number (42),false]
					]],
					['Uize.isRegExp',[
						['Calling with no parameters returns false',[],false],
						['The value undefined is not regarded as being a regular expression',undefined,false],
						['The value null is not regarded as being a regular expression',null,false],
						['A string value is not regarded as being a regular expression','foo',false],
						['A boolean value is not regarded as being a regular expression',true,false],
						['A number value is not regarded as being a regular expression',42,false],
						['A function is not regarded as being a regular expression',Uize.nop,false],
						['An object is not regarded as being a regular expression',{foo:'bar'},false],
						['An array is not regarded as being a regular expression',[['foo','bar']],false],
						['A regular expression instance is regarded as being a regular expression',/\d+/,true],
						['A regular expression instance created using the RegExp constructor is regarded as being a regular expression',
							new RegExp ('\\d+'),
							true
						],
						['An empty regular expression instance is regarded as being a regular expression',
							new RegExp (''),
							true
						]
					]],
					['Uize.isNaN',[
						['The value NaN is considered to be NaN',NaN,true],
						['A function is not considered to be NaN',function () {},false],
						['A Number object initialized with the value NaN is not considered to be NaN',
							new Number (NaN),
							false
						],
						['A Date object instance, even if set to an invalid date, is not considered to be NaN',
							new Date ('foo'),
							false
						],
						['The value undefined is not considered to be NaN',undefined,false],
						['The value null is not considered to be NaN',null,false],
						['An empty string is not considered to be NaN','',false],
						['A string value, even if it is not coercible to a number, is not considered to be NaN',
							'foo',
							false
						],
						['A number is not considered to be NaN',42,false],
						['A boolean value is not considered to be NaN',true,false],
						['An object is not considered to be NaN',{foo:'bar'},false],
						['An array is not considered to be NaN',[['foo','bar']],false]
					]],
					['Uize.isSameAs',[
						['The value NaN is considered to be the same as NaN',[NaN,NaN],true],
						{
							title:'Only values that are equal in a strict equality are considered to be the same as one another',
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
							title:'Calling with no parameters produces a transformer function that always returns the value of its first argument',
							test:[
								_returnXTest (function () {return Uize.resolveTransformer ()})
							]
						},
						{
							title:'Specifying the value undefined produces a transformer function that always returns the value of its first argument',
							test:[
								_returnXTest (function () {return Uize.resolveTransformer (undefined)})
							]
						},
						{
							title:'Specifying the value null produces a transformer function that always returns the value of its first argument',
							test:[
								_returnXTest (function () {return Uize.resolveTransformer (null)})
							]
						},
						{
							title:'Specifying a function type transformer results in that exact function being returned',
							test:function () {
								function _function () {}
								return this.expectSameAs (_function,Uize.resolveTransformer (_function));
							}
						},
						{
							title:'Specifying a string type transformer results in a function being created using that transformer expression string as the function body and accepting value and key arguments',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer ('value + "|" + key');
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect ('foo|bar',_resolvedTransformer ('foo','bar'))
								);
							}
						},
						{
							title:'Specifying a regular expression transformer results in a function being created that uses the regular expression to test the value parameter after it\'s been coerced to a string',
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
							title:'Specifying an object type transformer results in a function that uses the object transformer as a lookup for remapping the input value, leaving the input value unchanged if it is not found in the lookup',
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
							title:'Specifying a number type transformer results in a function being created that returns that exact number value as its result',
							test:function () {
								var _resolvedTransformer = Uize.resolveTransformer (42);
								return (
									this.expectType ('function',_resolvedTransformer) &&
									this.expect (42,_resolvedTransformer ('foo'))
								);
							}
						},
						{
							title:'Specifying a boolean type transformer results in a function being created that returns that exact boolean value as its result',
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
							title:'Calling with no parameters produces a matcher function that always returns true',
							test:[
								_returnsSpecificValueTest (function () {return Uize.resolveMatcher ()},true)
							]
						},
						{
							title:'Specifying the value undefined produces a matcher function that always returns true',
							test:[
								_returnsSpecificValueTest (function () {return Uize.resolveMatcher (undefined)},true)
							]
						},
						{
							title:'Specifying the value null produces a matcher function that always returns true',
							test:[
								_returnsSpecificValueTest (function () {return Uize.resolveMatcher (null)},true)
							]
						},
						{
							title:'Specifying a function type matcher results in that exact function being returned',
							test:function () {
								function _function () {}
								return this.expectSameAs (_function,Uize.resolveMatcher (_function));
							}
						},
						{
							title:'Specifying a string type matcher results in a function being created using that matcher expression string as the function body and accepting value and key arguments',
							test:function () {
								var _resolvedMatcher = Uize.resolveMatcher ('value + "|" + key');
								return (
									this.expectType ('function',_resolvedMatcher) &&
									this.expect ('foo|bar',_resolvedMatcher ('foo','bar'))
								);
							}
						},
						{
							title:'Specifying a regular expression matcher results in a function being created that uses the regular expression to test the value parameter after it\'s been coerced to a string',
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
							title:'Specifying a boolean type matcher results in a function being created that returns that exact boolean value as its result',
							test:function () {
								var _resolvedMatcher = Uize.resolveMatcher (false);
								return (
									this.expectType ('function',_resolvedMatcher) &&
									this.expect (false,_resolvedMatcher ('foo'))
								);
							}
						},
						{
							title:'Specifying a plain object results in a function being created that uses the specified object as a lookup, where the returned result is true if the looked up value is truthy and false otherwise',
							test:function () {
								var _resolvedMatcher = Uize.resolveMatcher ({
									foo:1,
									bar:true,
									baz:0
								});
								return (
									this.expectType ('function',_resolvedMatcher) &&
									this.expect (true,_resolvedMatcher ('foo')) &&
									this.expect (true,_resolvedMatcher ('bar')) &&
									this.expect (false,_resolvedMatcher ('baz')) &&
									this.expect (false,_resolvedMatcher ('qux'))
								);
							}
						}
					]],
					['Uize.escapeRegExpLiteral',[
						['All of the regular expression special characters are escaped',
							'^$|{}[]()?.*+\\',
							'\\^\\$\\|\\{\\}\\[\\]\\(\\)\\?\\.\\*\\+\\\\'
						],
						['Characters that are not regular expression special characters are not escaped',
							'foobar,:;\'"~`<>/!@#%&_-=',
							'foobar,:;\'"~`<>/!@#%&_-='
						]
					]],
					['Uize.toNumber',[
						['Calling with no parameters produces the result NaN',[],NaN],

						/*** test coercion of value to number, not wrapped in object or function ***/
							_toNumberTestBatch (false,false),

						/*** test coercion of value to number, wrapped in object ***/
							_toNumberTestBatch (true,false),

						/*** test coercion of value to number, wrapped in function ***/
							_toNumberTestBatch (false,true),

						/*** test coercion of value to number, wrapped in object that is wrapped in function ***/
							_toNumberTestBatch (true,true),

						/*** test that the optional default value is returned if value can't be coerced to number ***/
							['The optional default value is returned when trying to coerce NaN to a number',
								[NaN,42],
								42
							],
							['The optional default value is returned when trying to coerce an empty object to a number',
								[{},42],
								42
							],
							['The optional default value is returned when trying to coerce an array to a number',
								[[1],42],
								42
							],
							['The optional default value is returned when trying to coerce a regular expression to a number',
								[/\d+/,42],
								42
							],
							['The optional default value is returned when trying to coerce an empty string to a number',
								['',42],
								42
							],
							['The optional default value is returned when a string can\'t be successfully coerced to a number',
								['foo',42],
								42
							],
							['The optional default value is returned when trying to coerce undefined to a number',
								[undefined,42],
								42
							],
							['The optional default value is returned when trying to coerce null to a number',
								[null,42],
								42
							],

						/*** test that the optional default value is not itself coerced to a number ***/
							['A string type default value is not coerced to a number',['foo','bar'],'bar'],
							['A boolean type default value is not coerced to a number',['foo',true],true],
							['The default value null is not coerced to a number',['foo',null],null],
							['The default value undefined is not coerced to a number',['foo',undefined],undefined],
							['The default value NaN is not coerced to a number',['foo',NaN],NaN],
							{
								title:'An object type default value is not coerced to a number',
								test:function () {
									var _defaultValue = {};
									return this.expectSameAs (Uize.toNumber ('foo',_defaultValue),_defaultValue);
								}
							},
							{
								title:'An array type default value is not coerced to a number',
								test:function () {
									var _defaultValue = [];
									return this.expectSameAs (Uize.toNumber ('foo',_defaultValue),_defaultValue);
								}
							},
							{
								title:'A regular expression default value is not coerced to a number',
								test:function () {
									var _defaultValue = /\d+/;
									return this.expectSameAs (Uize.toNumber ('foo',_defaultValue),_defaultValue);
								}
							},

						/*** miscellaneous ***/
							['If the value is a function that returns a function, it cannot be coerced to a number',
								[function () {return function () {return 5}},42],
								42
							],
							['If the value is an object whose valueOf method returns an object, it cannot be coerced to a number',
								[{valueOf:function () {return {valueOf:function () {return 5}}}},42],
								42
							],
							['If the value is an object whose valueOf method returns a function, it cannot be coerced to a number',
								[{valueOf:function () {return function () {}}},42],
								42
							]
					]],
					['Uize.copyInto',
						[
							['Calling with only a target object and no source object results in the target object being returned unchanged',
								{foo:'bar',hello:'world'},
								{foo:'bar',hello:'world'}
							],
							['Specifying the value null for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null],
								{foo:'bar',hello:'world'}
							],
							['Specifying the value undefined for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},undefined],
								{foo:'bar',hello:'world'}
							],
							['A source object is copied into a target object',
								[{foo:'foo',hello:'there',otherInTarget:'blah'},{foo:'bar',hello:'world',otherInSource:'yawn'}],
								{foo:'bar',hello:'world',otherInTarget:'blah',otherInSource:'yawn'}
							],
							{
								title:'The target object is returned and not a new object',
								test:function () {
									var _target = {foo:'bar'};
									return this.expectSameAs (_target,Uize.copyInto (_target,{hello:'world'}));
								}
							},
							['There can be an arbitrary number of source objects',
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
							['The contents of source objects are copied into the target in the order in which the source objects are specified',
								[
									{foo:'foo',otherInTarget:'blah'},
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',otherInTarget:'blah',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Specifying the value null or undefined for all of the source objects results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null,undefined,undefined,null],
								{foo:'bar',hello:'world'}
							],
							['Specifying the value null for the target object results in the value null being returned',
								[null,{foo:'bar',hello:'world'}],
								null
							],
							['Specifying the value undefined for the target object results in the value undefined being returned',
								[undefined,{foo:'bar',hello:'world'}],
								undefined
							],

							/*** test support for function target and sources ***/
								{
									title:'When the target is a function, the properties from the sources are copied in as custom properties of the function',
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
									title:'When any of the sources are functions, then any custom properties of those function type sources will be copied into the target',
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
					['Uize.copy',
						[
							['Calling with no arguments results in an empty object being returned',
								[],
								{}
							],
							['Specifying the value null for the source object results in an empty object being returned',
								null,
								{}
							],
							['Specifying the value undefined for the source object results in an empty object being returned',
								undefined,
								{}
							],
							['Copying a source object produces a copy of the source object',
								{foo:'bar',hello:'world',otherInSource:'yawn'},
								{foo:'bar',hello:'world',otherInSource:'yawn'}
							],
							{
								title:'A fresh object is returned and not the source object',
								test:function () {
									var
										_source = {foo:'bar'},
										_copy = Uize.copy (_source)
									;
									return this.expect (_source,_copy) && _copy != _source;
								}
							},
							['There can be an arbitrary number of source objects',
								[
									{propFromSource1:'bar'},
									{propFromSource2:'hello'},
									{propFromSource3:'world'}
								],
								{
									propFromSource1:'bar',
									propFromSource2:'hello',
									propFromSource3:'world'
								}
							],
							['The contents of source objects are copied into the fresh object in the order in which the source objects are specified',
								[
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Specifying the value null or undefined for all of the source objects results in an empty object being returned',
								[null,undefined,undefined,null],
								{}
							],

							/*** test support for function sources ***/
								{
									title:'When any of the sources are functions, then any custom properties of those function type sources will be copied into the fresh object returned',
									test:function () {
										var
											_source1 = function () {},
											_source2 = function () {},
											_source3 = function () {}
										;
										_source1.foo = 'bar';
										_source2.hello = 'world';
										_source3.theAnswer = 42;
										var _result = Uize.copy (_source1,_source2,_source3);
										return this.expect (
											{
												foo:'bar',
												hello:'world',
												theAnswer:42
											},
											_result
										);
									}
								}
						],
						null,
						{cloneArguments:true}
					],
					['Uize.copyList',[
						['When an empty list object is copied, an empty array is produced',
							{length:0},
							[]
						],
						['When a populated list object is copied, an array containing the values in the list is produced',
							{0:'foo',1:'bar',2:'baz',3:'qux',length:4},
							['foo','bar','baz','qux']
						],
						['When a sparsely populated list object is copied, an array containing undefined values for the missing elements is produced',
							{0:'foo',3:'qux',length:4},
							['foo',undefined,undefined,'qux']
						],
						{
							title:'When a function\'s arguments object is copied, an array containing the argument values is produced',
							test:function () {
								var _result;
								function _variadicFunction () {
									_result = Uize.copyList (arguments);
								}
								_variadicFunction ('foo','bar','baz','qux');
								return this.expect (['foo','bar','baz','qux'],_result);
							}
						},
						{
							title:'Creating a copy of an array does not modify the source array',
							test:function () {
								var _source = ['foo','bar','baz','qux'];
								Uize.copyList (_source);
								return this.expect (['foo','bar','baz','qux'],_source);
							}
						},
						{
							title:'Creating a copy of an array returns a fresh array and not the source array',
							test:function () {
								var _source = [];
								return this.expect (true,Uize.copy (_source) != _source);
							}
						},
						['Copying an empty array creates an empty array',
							[[]],
							[]
						],
						['A copy of a populated source array contains the elements of the source array',
							[['foo','bar','baz','qux']],
							['foo','bar','baz','qux']
						]
					]],
					['Uize.push',
						[
							{
								title:'General tests',
								test:[
									{
										title:'When the target is an array, then a reference to the target is returned',
										test:function () {
											var
												_target = [],
												_result = Uize.push (_target,[])
											;
											return this.expectSameAs (_target,_result);
										}
									},
									{
										title:'When the target is a list object, then a reference to the target is returned',
										test:function () {
											var
												_target = {length:0},
												_result = Uize.push (_target,[])
											;
											return this.expectSameAs (_target,_result);
										}
									},
									{
										title:'The source is not modified',
										test:function () {
											var _source = ['foo','bar','baz','qux'];
											Uize.push ([],_source);
											return this.expect (['foo','bar','baz','qux'],_source);
										}
									}
								]
							},
							{
								title:'Items can be pushed onto a target array',
								test:[
									['The elements of an empty list object can be pushed onto a target array',
										[['foo','bar'],{length:0}],
										['foo','bar']
									],
									['The elements of a populated list object can be pushed onto a target array',
										[['foo','bar'],{0:'baz',1:'qux',length:2}],
										['foo','bar','baz','qux']
									],
									['The elements of a sparsely populated list object can be pushed onto a target array',
										[['foo','bar'],{0:'baz',3:'qux',length:4}],
										['foo','bar','baz',undefined,undefined,'qux']
									],
									['The elements of an empty array can be pushed onto a target array',
										[['foo','bar'],[]],
										['foo','bar']
									],
									['The elements of a populated array can be pushed onto a target array',
										[['foo','bar'],['baz','qux']],
										['foo','bar','baz','qux']
									],
									['The elements of a sparsely populated array can be pushed onto a target array',
										[['foo','bar'],Uize.copyInto ([],{1:'baz',3:'qux'})],
										['foo','bar',undefined,'baz',undefined,'qux']
									],
									{
										title:'The elements of a function\'s arguments list object can be pushed onto a target array',
										test:function () {
											var _target = ['foo','bar'];
											function _variadicFunction () {
												Uize.push (_target,arguments);
											}
											_variadicFunction ('baz','qux');
											return this.expect (['foo','bar','baz','qux'],_target);
										}
									}
								]
							},
							{
								title:'Items can be pushed onto a target list object',
								test:[
									['The elements of an empty list object can be pushed onto a target list object',
										[{0:'foo',1:'bar',length:2},{length:0}],
										{0:'foo',1:'bar',length:2}
									],
									['The elements of a populated list object can be pushed onto a target list object',
										[{0:'foo',1:'bar',length:2},{0:'baz',1:'qux',length:2}],
										{0:'foo',1:'bar',2:'baz',3:'qux',length:4}
									],
									['The elements of a sparsely populated list object can be pushed onto a target list object',
										[{0:'foo',1:'bar',length:2},{1:'qux',length:2}],
										{0:'foo',1:'bar',2:undefined,3:'qux',length:4}
									],
									['The elements of an empty array can be pushed onto a target list object',
										[{0:'foo',1:'bar',length:2},[]],
										{0:'foo',1:'bar',length:2}
									],
									['The elements of a populated array can be pushed onto a target list object',
										[{0:'foo',1:'bar',length:2},['baz','qux']],
										{0:'foo',1:'bar',2:'baz',3:'qux',length:4}
									],
									['The elements of a sparsely populated array can be pushed onto a target list',
										[{0:'foo',1:'bar',length:2},Uize.copyInto ([],{1:'baz',3:'qux'})],
										{0:'foo',1:'bar',2:undefined,3:'baz',4:undefined,5:'qux',length:6}
									],
									{
										title:'The elements of a function\'s arguments list object can be pushed onto a target list object',
										test:function () {
											var _target = {0:'foo',1:'bar',length:2};
											function _variadicFunction () {
												Uize.push (_target,arguments);
											}
											_variadicFunction ('baz','qux');
											return this.expect ({0:'foo',1:'bar',2:'baz',3:'qux',length:4},_target);
										}
									}
								]
							}
						],
						null,
						{cloneArguments:true}
					],
					['Uize.mergeInto',
						[
							['Calling with only a target object and no source object results in the target object being returned unchanged',
								{foo:'bar',hello:'world'},
								{foo:'bar',hello:'world'}
							],
							['Specifying the value null for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null],
								{foo:'bar',hello:'world'}
							],
							['Specifying the value undefined for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},undefined],
								{foo:'bar',hello:'world'}
							],
							['A one level deep source object can be merged into a one level deep target object',
								[{foo:'foo',hello:'there',otherInTarget:'blah'},{foo:'bar',hello:'world',otherInSource:'yawn'}],
								{foo:'bar',hello:'world',otherInTarget:'blah',otherInSource:'yawn'}
							],
							{
								title:'The target object is returned and not a new object',
								test:function () {
									var _target = {foo:'bar'};
									return this.expectSameAs (_target,Uize.mergeInto (_target,{hello:'world'}));
								}
							},
							['There can be an arbitrary number of source objects',
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
							['The contents of source objects are merged into the target in the order in which the source objects are specified',
								[
									{foo:'foo',otherInTarget:'blah'},
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',otherInTarget:'blah',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Specifying the value null or undefined for all of the source objects results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null,undefined,undefined,null],
								{foo:'bar',hello:'world'}
							],
							['Specifying the value null for the target object results in the value null being returned',
								[null,{foo:'bar',hello:'world'}],
								null
							],
							['Specifying the value undefined for the target object results in the value undefined being returned',
								[undefined,{foo:'bar',hello:'world'}],
								undefined
							],
							{
								title:'If the values of a property in the target object and the source object are not both plain objects, then the value of the property in the target object is simply overwritten by the value from the source object (no recursive merging takes place)',
								test:function () {
									var
										_values = [
											'', 'foo', 42, NaN, Infinity, false, /\d+/g, new String ('foo'), new Boolean (false), new Number (42), new Date, Uize.Class (), {foo:'bar'}, ['foo','bar'], null, undefined
										],
										_valuesLength = _values.length,
										_result = true
									;
									for (var _valueNo = -1, _value; _result && ++_valueNo < _valuesLength;) {
										_value = _values [_valueNo];
										for (
											var _sourcePropertyValueNo = -1, _sourcePropertyValue;
											_result && ++_sourcePropertyValueNo < _valuesLength;
										) {
											_sourcePropertyValue = _values [_sourcePropertyValueNo];
											if (!Uize.isPlainObject (_value) || !Uize.isPlainObject (_sourcePropertyValue)) {
												var
													_targetObject = {property:_value},
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
							['When the value of a property is a plain object in both the source and target objects, then the contents of the property from the source object are merged into the property in the target object',
								[{foo:{bar:1}},{foo:{hello:'world'}}],
								{foo:{bar:1,hello:'world'}}
							],
							['When the target object has properties that the source object doesn\'t, those properties are left in the target object',
								[{foo:'bar',junk:{hello:'world'}},{simple:'simon',junk:{bye:'bye'}}],
								{foo:'bar',simple:'simon',junk:{hello:'world',bye:'bye'}}
							],
							['Complex objects can be merged, requiring merging at multiple depths',
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
							['Deep merging is carried out for all sources, even when multiple sources are specified',
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
								title:'Merging object type properties from a source object into a target object results in the object type properties being copied by reference',
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
									title:'When the target is a function, the properties from the sources will be merged in as custom properties of the function',
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
									title:'When any of the sources are functions, then any custom properties of those function type sources will be merged into the target',
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
					['Uize.merge',
						[
							['Calling with no source object results in an empty object being returned',
								[],
								{}
							],
							['Specifying the value null for the source object results in an empty object being returned',
								null,
								{}
							],
							['Specifying the value undefined for the source object results in an empty object being returned',
								undefined,
								{}
							],
							['There can be an arbitrary number of source objects',
								[
									{propFromSource1:'bar'},
									{propFromSource2:'hello'},
									{propFromSource3:'world'}
								],
								{
									propFromSource1:'bar',
									propFromSource2:'hello',
									propFromSource3:'world'
								}
							],
							['The contents of source objects are merged in the order in which the source objects are specified',
								[
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Specifying the value null or undefined for all of the source objects results in an empty object being returned',
								[null,undefined,undefined,null],
								{}
							],
							{
								title:'If the values of a property in two source objects are not both plain objects, then the value of the property from the first is simply overwritten by the value from the second source object (no recursive merging takes place)',
								test:function () {
									var
										_values = [
											'', 'foo', 42, NaN, Infinity, false, /\d+/g, new String ('foo'), new Boolean (false), new Number (42), new Date, Uize.Class (), {foo:'bar'}, ['foo','bar'], null, undefined
										],
										_valuesLength = _values.length,
										_result = true
									;
									for (
										var _source1PropertyValueNo = -1, _source1PropertyValue;
										_result && ++_source1PropertyValueNo < _valuesLength;
									) {
										_source1PropertyValue = _values [_source1PropertyValueNo];
										for (
											var _source2PropertyValueNo = -1, _source2PropertyValue;
											_result && ++_source2PropertyValueNo < _valuesLength;
										) {
											_source2PropertyValue = _values [_source2PropertyValueNo];
											if (
												!Uize.isPlainObject (_source1PropertyValue) ||
												!Uize.isPlainObject (_source2PropertyValue)
											) {
												var
													_sourceObject1 = {property:_source1PropertyValue},
													_sourceObject2 = {property:_source2PropertyValue},
													_mergedObject = Uize.merge (_sourceObject1,_sourceObject2)
												;
												_result = Uize.isSameAs (_mergedObject.property,_source2PropertyValue);
											}
										}
									}
									return _result;
								}
							},
							['When the value of a property is a plain object in two source objects, then the contents of the property from the second source object are merged with the contents of the property from the first source object',
								[{foo:{bar:1}},{foo:{hello:'world'}}],
								{foo:{bar:1,hello:'world'}}
							],
							['Complex objects can be merged, requiring merging at multiple depths',
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
							['Deep merging is carried out for all sources, even when multiple sources are specified',
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
								title:'Merging object type properties from a source object results in the object type properties being copied by reference',
								test:function () {
									var
										_objectProperty = {
											foo:'bar',
											junk:{hello:'world'},
											moreJunk:['this','is','some','more','junk']
										},
										_result = Uize.merge ({objectProperty:_objectProperty})
									;
									return this.expectSameAs (_objectProperty,_result.objectProperty);
								}
							},
							{
								title:'A fresh object is returned, and not a reference to any of the source objects being merged',
								test:function () {
									var
										_source1 = {propertyFromSource1:'propertyFromSource1Value'},
										_source2 = {propertyFromSource2:'propertyFromSource2Value'},
										_source3 = {propertyFromSource3:'propertyFromSource3Value'},
										_result = Uize.merge (_source1,_source2,_source3)
									;
									return (
										this.expect (
											{
												propertyFromSource1:'propertyFromSource1Value',
												propertyFromSource2:'propertyFromSource2Value',
												propertyFromSource3:'propertyFromSource3Value'
											},
											_result
										) &&
										_result != _source1 &&
										_result != _source2 &&
										_result != _source3
									);
								}
							},
							{
								title:'When any of the sources are functions, then any custom properties of those function type sources will be merged into the target',
								test:function () {
									var
										_source1 = function () {},
										_source2 = function () {},
										_source3 = function () {}
									;
									_source1.foo = 'bar';
									_source2.hello = 'world';
									_source3.theAnswer = 42;
									var _result = Uize.merge (_source1,_source2,_source3);
									return this.expect (
										{
											foo:'bar',
											hello:'world',
											theAnswer:42
										},
										_result
									);
								}
							}
						],
						null,
						{cloneArguments:true}
					],
					['Uize.pairUp',[
						['Calling with no parameters returns {undefined:undefined}',[],{undefined:undefined}],
						['The value undefined is the default for the valueANYTYPE parameter',['key'],{key:undefined}],
						['The key can be a string','key',{key:undefined}],
						['The key can be a number',5,{5:undefined}],
						['The key can be the special value Infinity',Infinity,{Infinity:undefined}],
						['The key can be the special value NaN',NaN,{NaN:undefined}],
						['The key can be a boolean',false,{'false':undefined}],
						['The key can be undefined',undefined,{undefined:undefined}],
						['The key can be null',null,{'null':undefined}],
						['The value can be a string',['key','value'],{key:'value'}],
						['The value can be a number',['key',5],{key:5}],
						['The value can be the special value Infinity',['key',Infinity],{key:Infinity}],
						['The value can be the special value NaN',['key',NaN],{key:NaN}],
						['The value can be a boolean',['key',false],{key:false}],
						['The value can be undefined',['key',undefined],{key:undefined}],
						['The value can be null',['key',null],{key:null}],
						['The value can be an object',['key',{propName:'propValue'}],{key:{propName:'propValue'}}],
						['There can be an arbitrary number of arguments',
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
						['If there is only one argument whose value is an array, then that array is treated as the arguments list',
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
						['Calling with no parameters produces an empty string',
							[],
							''
						],
						['Calling with just a source string simply produces that string',
							'Hello, world!',
							'Hello, world!'
						],
						['Specifying the value null for substitutions produces the source string',
							['Hello, world!',null,'[#KEY]'],
							'Hello, world!'
						],
						['Specifying the value undefined for substitutions produces the source string',
							['Hello, world!',undefined,'[#KEY]'],
							'Hello, world!'
						],
						['Substituting into an empty string produces an empty string',
							['',{name:'Eric'},'[#KEY]'],
							''
						],
						['Substitution of a single token works correctly',
							['My name is [#name].',{name:'Eric'},'[#KEY]'],
							'My name is Eric.'
						],
						['There can be multiple substitutions in the same string',
							['My name is [#name], and I am a [#occupation].',{name:'Eric',occupation:'viking'},'[#KEY]'],
							'My name is Eric, and I am a viking.'
						],
						['A custom token naming specifier can be provided',
							['My name is <%name%>, and I am a <%occupation%>.',{name:'Eric',occupation:'viking'},'<%KEY%>'],
							'My name is Eric, and I am a viking.'
						],
						['The token opener and closer can be empty strings',
							['I am name, and I am a occupation.',{name:'Eric',occupation:'viking'},'KEY'],
							'I am Eric, and I am a viking.'
						],
						['The default for token naming is [#KEY]',
							['My name is [#name].',{name:'Eric'}],
							'My name is Eric.'
						],
						['Specifying an empty object for substitutions simply produces the source string',
							['Hello, world!',{}],
							'Hello, world!'
						],
						['The same substitution can be used multiple times',
							['My name is [#name]. [#name] is my name. You can call me [#name].',{name:'Eric'}],
							'My name is Eric. Eric is my name. You can call me Eric.'
						],
						['Substitution values that contain tokens are not further substituted into',
							['[#token1][#token2]',{token1:'[#token2]foo',token2:'bar'}],
							'[#token2]foobar'
						],
						['Tokens in the source string for which there aren\'t substitutions are left in the source string',
							['My name is [#name].',{occupation:'viking'}],
							'My name is [#name].'
						],
						['Substitutions for which there aren\'t tokens in the source string are ignored',
							['My name is [#name].',{name:'Eric',occupation:'viking'}],
							'My name is Eric.'
						],
						['Specifying an array for substitutions is handled correctly',
							['My name is [#0], and I am a [#1].',['Eric','viking']],
							'My name is Eric, and I am a viking.'
						],
						['Specifying an empty array for substitutions simply produces the source string',
							['Hello, world!',[]],
							'Hello, world!'
						],
						['Non-string substitution values are coerced to strings',
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
						['A string type substitution is treated as a substitutions array with one element',
							['My name is [#0].','Eric'],
							'My name is Eric.'
						],
						['A number type substitution is treated as a substitutions array with one element',
							['Pi is approximately [#0].',3.14159265359],
							'Pi is approximately 3.14159265359.'
						],
						['A boolean type substitution is treated as a substitutions array with one element',
							['It is not [#0] that the Earth is flat.',true],
							'It is not true that the Earth is flat.'
						],
						['Substitution keys are case-sensitive',
							['My name is [#name], and not [#NAME]!',{name:'Eric',NAME:'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Substitution keys are space-sensitive',
							['My name is [#name], and not [# name ]!',{name:'Eric',' name ':'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Spaces in the token opener and token closer are significant',
							['[name] [ name] [name ] [ name ]',{name:'Eric'},'[ KEY ]'],
							'[name] [ name] [name ] Eric'
						],
						['A token opener may contain regular expression special characters',
							['My name is [^$|{}[]()?.*+\\name].',{name:'Eric'},'[^$|{}[]()?.*+\\KEY]'],
							'My name is Eric.'
						],
						['A token closer may contain regular expression special characters',
							['My name is [name^$|{}[]()?.*+\\].',{name:'Eric'},'[KEY^$|{}[]()?.*+\\]'],
							'My name is Eric.'
						],
						['A substitution key may contain regular expression special characters',
							['My name is [^$|{}[]()?.*+\\].',{'^$|{}[]()?.*+\\':'Eric'},'[KEY]'],
							'My name is Eric.'
						],
						['The source for substituting into can be a number',
							[3.14159265359,{'.':','},'KEY'],
							'3,14159265359'
						],
						['The source for substituting into can be a boolean',
							[true,{ru:'Russia'},'KEY'],
							'tRussiae'
						],
						['The source for substituting into can be an object that implements a value interface',
							[Uize.Class.Value ({value:'My name is [#name].'}),{name:'Eric'}],
							'My name is Eric.'
						],
						['The source for substituting into can be an array, whose elements will be concatenated',
							[['[#name]','[#occupation]'],{name:'Eric',occupation:'viking'}],
							'Eric,viking'
						]
					]],
					['Uize.indexIn',[
						/*** test support for source being an array ***/
							['Specifying an empty array for the source parameter produces the result -1',
								[[],1],
								-1
							],
							['The fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
								[[0,1,'1','1',1,2],'1',true,false],
								4
							],
							['The strictEqualityBOOL parameter is defaulted to true',
								[[0,1,'1','1',1,2],'1',true],
								3
							],
							['The fromEndBOOL parameter is defaulted to false',
								[[0,1,'1','1',1,2],'1'],
								2
							],
							['The value -1 is returned when the value is not found in the source array',
								[[0,1,'1','1',1,2],'0'],
								-1
							],
							['The method doesn\'t scan past the end of the source array and find a match for undefined in the first element beyond the end of the array',
								[[0,1,'1','1',1,2],undefined],
								-1
							],

						/*** test support for source being a list object ***/
							['Specifying an empty list object for the source parameter produces the result -1',
								[_arrayToListObject ([]),1],
								-1
							],
							['When the source is a list object, the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
								[_arrayToListObject ([0,1,'1','1',1,2]),'1',true,false],
								4
							],
							['When the source is a list object, the strictEqualityBOOL parameter is defaulted to true',
								[_arrayToListObject ([0,1,'1','1',1,2]),'1',true],
								3
							],
							['When the source is a list object, the fromEndBOOL parameter is defaulted to false',
								[_arrayToListObject ([0,1,'1','1',1,2]),'1'],
								2
							],
							['When the source is a list object, -1 is returned when the value is not found in the source list object',
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
							['Specifying an empty non-list object for the source parameter produces the result -1',
								[{},1],
								-1
							],
							['When the source is a non-list object, the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'1',true,false],
								'p4'
							],
							['When the source is a non-list object, the strictEqualityBOOL parameter is defaulted to true',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'1',true],
								'p3'
							],
							['When the source is a non-list object, the fromEndBOOL parameter is defaulted to false',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'1'],
								'p2'
							],
							['When the source is a non-list object, -1 is returned when the value is not found in the object',
								[{p0:0,p1:1,p2:'1',p3:'1',p4:1,p5:2},'0'],
								-1
							],

						/*** test handling of source being neither array nor object ***/
							['Calling with no parameters produces the result -1',
								[],
								-1
							],
							['Specifying null for the source parameter produces the result -1',
								[null,null],
								-1
							],
							['Specifying undefined for the source parameter produces the result -1',
								[undefined,undefined],
								-1
							],
							['Specifying a number for the source parameter produces the result -1',
								[5,5],
								-1
							],
							['Specifying a string for the source parameter produces the result -1',
								['hello','hello'],
								-1
							],
							['Specifying a boolean for the source parameter produces the result -1',
								[true,true],
								-1
							]
					]],
					['Uize.isIn',[
						['Calling with no parameters produces the result false',
							[],
							false
						],
						['Specifying null for the source parameter produces the result false',
							[null,null],
							false
						],
						['Specifying undefined for the source parameter produces the result false',
							[undefined,undefined],
							false
						],
						['Specifying a number for the source parameter produces the result false',
							[5,5],
							false
						],
						['Specifying a string for the source parameter produces the result false',
							['hello','hello'],
							false
						],
						['Specifying a boolean for the source parameter produces the result false',
							[true,true],
							false
						],
						['Specifying an empty array for the source parameter produces the result false',
							[[],1],
							false
						],
						['When the value false is specified for the strictEqualityBOOL parameter, then an element that is only loosely equal with be found',
							[[0,1],'1',false],
							true
						],
						['When the value true is specified for the strictEqualityBOOL parameter, then an element that is only loosely equal will not be found',
							[[0,1],'1',true],
							false
						],
						['The strictEqualityBOOL parameter is defaulted to true',
							[[0,1],'1'],
							false
						],
						['The value false is returned when the value is not found in the source array',
							[[0,1],2],
							false
						],

						/*** test support for object source ***/
							['The value true is returned when the source is an object, and the value is the value of one of the source object\'s properties',
								[{foo:'bar',hello:'world'},'bar'],
								true
							],
							['The value false is returned when the source is an object, and the value is not one of the object\'s propertes\' values',
								[{foo:'bar',hello:'world'},'blah'],
								false
							],
							['The value false for the strictEqualityBOOL parameter ia observed correctly when the source is an object',
								[{prop1:0,prop2:1},'1',false],
								true
							],
							['The value true for the strictEqualityBOOL parameter ia observed correctly when the source is an object',
								[{prop1:0,prop2:1},'1',true],
								false
							]
					]],
					['Uize.isEmpty',[
						['An empty object is considered empty',[{}],true],
						['An empty array is considered empty',[[]],true],
						['An empty string is considered empty',[''],true],
						['A String object initialized to empty string is considered empty',[new String ('')],true],
						['The number zero is considered empty',[0],true],
						['A Number object initialized to zero is considered empty',[new Number (0)],true],
						['The boolean false is considered empty',[false],true],
						['A Boolean object initialized to false is considered empty',[new Boolean (false)],true],
						['The value null is considered empty',[null],true],
						['The value undefined is considered empty',[undefined],true],
						['The value NaN is considered empty',[NaN],true],
						['A class instance with an empty value state property is considered empty',
							[Uize.Class.Value ({value:0})],
							true
						],
						['A non-empty object is not considered empty',[{blah:0}],false],
						['A non-empty array is not considered empty',[['blah']],false],
						['A non-empty string is not considered empty',['blah'],false],
						['A String object initialized to non-empty string is not considered empty',
							[new String ('foo')],
							false
						],
						['A non-zero number is not considered empty',[1],false],
						['A Number object initialized to non-zero number is not considered empty',
							[new Number (1)],
							false
						],
						['The boolean true is not considered empty',[true],false],
						['A Boolean object initialized to true is not considered empty',[new Boolean (true)],false],
						//['A regular expression is not considered empty',[/^.+$/],false],
						['A function (even an empty one) is not considered empty',function () {},false],
						['A class instance with a non-empty value state property is not considered empty',
							[Uize.Class.Value ({value:1})],
							false
						]
					]],
					['Uize.emptyOut',[
						{
							title:'Emptying out an already empty array produces that same empty array as the result',
							test:function () {
								var
									_source = [],
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Emptying out an already empty object produces that same empty object as the result',
							test:function () {
								var
									_source = {},
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Emptying out an array with contents produces that same array with no contents as the result',
							test:function () {
								var
									_source = [1,2,3,4,5],
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,[]);
							}
						},
						{
							title:'Emptying out an object with contents produces that same object with no contents as the result',
							test:function () {
								var
									_source = {foo:1,bar:1},
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,{});
							}
						},
						['Specifying the value null for the source produces the value null as the result',
							null,
							null
						],
						['Specifying the value undefined for the source produces the value undefined as the result',
							undefined,
							undefined
						]
					]],
					['Uize.recordMatches',[
						['Specifying the value null for the record produces the result false',
							[null,{foo:'bar'}],
							false
						],
						['Specifying the value undefined for the record produces the result false',
							[undefined,{foo:'bar'}],
							false
						],
						['Specifying the value null for the match object produces the result true',
							[{foo:'bar'},null],
							true
						],
						['Specifying the value undefined for the match object produces the result true',
							[{foo:'bar'},undefined],
							true
						],
						['Specifying an empty match object produces the result true',
							[{foo:'bar'},{}],
							true
						],
						['Specifying a match object that contains properties that aren\'t in the record produces the result false',
							[{foo:'bar'},{hello:'world'}],
							false
						],
						['Specifying a match object with a property that is in the record but whose value is not the same produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'dunno'}],
							false
						],
						['Specifying a match object with a property that is in the record and whose values is equal but not in a strict equality produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'42'}],
							false
						],
						['Specifying a match object with a property that is in the record and whose values is equal in a strict equality produces the result true',
							[{meaningOfLife:42},{meaningOfLife:42}],
							true
						],
						['Specifying a match object with multiple properties and that is only a partial match with the record produces the result false',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'there',meaningOfLife:42}],
							false
						],
						['Specifying a match object with multiple properties and that is a complete match with the record produces the result true',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'world',meaningOfLife:42}],
							true
						],
						['Properties that are in the record but that are not in the match object are not considered and do not affect the success of the match',
							[{foo:'bar',hello:'world',meaningOfLife:42},{meaningOfLife:42}],
							true
						]
					]],
					['Uize.findRecordNo',[
						['Specifying null for the records results in the value -1 being returned, regardless of what the specified default value is',
							[null,{},5],
							-1
						],
						['Specifying undefined for the records results in the value -1 being returned, regardless of what the specified default value is',
							[undefined,{},5],
							-1
						],
						['Not specifying a default number results in the value -1 being used for default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'}],
							-1
						],
						['Specifying the value null for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},null],
							-1
						],
						['Specifying the value undefined for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},undefined],
							-1
						],
						['Specifying a string value for detault number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},'2'],
							2
						],
						['Specifying a boolean value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},true],
							1
						],
						['Specifying an object value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},Uize.Class.Value ({value:2})],
							2
						],
						['Specifying an object value for the default number that cannot be coerced to a number results in the value -1 being used for the default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},Uize.Class.Value ({value:'blah'})],
							-1
						],
						['The index of the first matching record is returned when the match matches a record',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'bar'}],
							1
						],
						['The value 0 is returned when the value null is specified for the match',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],null],
							0
						]
					]],
					['Uize.findRecord',[
						['Specifying null for the records results in the value null being returned',
							[null,{},5],
							null
						],
						['Specifying undefined for the records results in the value null being returned',
							[undefined,{},5],
							null
						],
						{
							title:'The first matching record is returned when the match matches a record',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [1],Uize.findRecord (_records,{foo:'bar'}));
							}
						},
						{
							title:'The first record is returned when the value null is specified for the match',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [0],Uize.findRecord (_records,null));
							}
						},
						{
							title:'The record for the specified default record number is returned when no matching record is found',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [2],Uize.findRecord (_records,{foo:'woo'},2));
							}
						}
					]],
					['Uize.getGuid',[
						{
							title:'A string type value is returned',
							test:function () {return this.expectNonEmptyString (Uize.getGuid ())}
						},
						{
							title:'The result is different across ten successive calls',
							test:function () {
								var _callResults = [];
								for (var _callNo = -1; ++_callNo < 10;)
									_callResults.push (Uize.getGuid ())
								;
								return this.expectNoRepeats (_callResults);
							}
						}
					]],
					['Uize.global',[
						{
							title:'A reference to the global object is returned',
							test:function () {
								return this.expectSameAs (
									Function ('return (function () {return this}) ()') (),
									Uize.global ()
								);
							}
						}
					]],
					['Uize.eval',[
						['The specified code is evaluated and that the result of the evaluated code is returned',
							'2 + 3',
							5
						],
						{
							title:'The specified code is evaluated in a quarantined fashion, having access only to the global scope',
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
							title:'The specified code is evaluated using JavaScript strict mode',
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
						['The specified code is evaluated and that the result of the evaluated code is returned',
							'2 + 3',
							5
						],
						{
							title:'The specified code is evaluated in a quarantined fashion, having access only to the global scope',
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
							title:'The specified code is evaluated using non-strict mode',
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
							title:'A new function is returned, and not just a reference to the source function',
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
							title:'The quarantined function is equivalent to the source function in its behavior',
							test:function () {
								var
									_functionToQuarantine = function (a,b) {return Math.pow (a,b)},
									_quarantinedFunction = Uize.quarantine (_functionToQuarantine)
								;
								return this.expect (8,_quarantinedFunction (2,3));
							}
						},
						{
							title:'The quarantined function is quarantined from the scope of the source function',
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
							['Calling with no parameters produces the result undefined',[],undefined],
							['The value null is resolved to result undefined',null,undefined],
							['The value undefined is resolved to result undefined',null,undefined],

						/*** test resolving JavaScript primitives to a class ***/
							['A number primitive is resolved to the Number object',42,Number],
							['The special number value Infinity is resolved to the Number object',Infinity,Number],
							['The special number value NaN is resolved to the Number object',NaN,Number],
							['A string value is resolved to the String object','foo',String],
							['A boolean value is resolved to the Boolean object',true,Boolean],

						/*** test resolving instances of JavaScript's built-in objects to a class ***/
							['A Number object instance is resolved to the Number object',new Number (42),Number],
							['A String object instance is resolved to the String object',new String ('foo'),String],
							['A Boolean object instance is resolved to the Boolean object',
								new Boolean (true),
								Boolean
							],
							['A RegExp object instance is resolved to the RegExp object',new RegExp ('\\d+'),RegExp],

						/*** test resolving implicitly created instances of JavaScript's built-in objects to a class ***/
							['An object created using literal syntax is resolved to the Object object',
								{foo:'bar'},
								Object
							],
							['An array created using literal syntax is resolved to the Array object',
								[['foo','bar']],
								Array
							],
							['A regular expression created using literal syntax is resolved to the RegExp object',
								/\d+/,
								RegExp
							],

						/*** test resolving instances of Uize.Class subclasses ***/
							['An instance of the Uize.Class base class is resolved to the Uize.Class class',
								Uize.Class (),
								Uize.Class
							],

						/*** test resolving classes and object constructors to a class ***/
							['The Object object is resolved to the Object object',Object,Object],
							['The Number object is resolved to the Number object',Number,Number],
							['The String object is resolved to the String object',String,String],
							['The Boolean object is resolved to the Boolean object',Boolean,Boolean],
							['The RegExp object is resolved to the RegExp object',RegExp,RegExp],
							['The Uize.Class object is resolved to the Uize.Class object',Uize.Class,Uize.Class],
							{
								title:'Resolving a function to a class results in the function being returned',
								test:function () {
									var _function = function () {};
									return this.expectSameAs (_function,Uize.getClass (_function));
								}
							}
					]],
					['Uize.isInstance',[
						['Calling with no parameters produces the result false',[],false],
						['The value null is not regarded as a Uize subclass instance',null,false],
						['The value undefined is not regarded as a Uize subclass instance',undefined,false],
						['A string is not regarded as a Uize subclass instance','hello',false],
						['A number is not regarded as a Uize subclass instance',5,false],
						['A boolean is not regarded as a Uize subclass instance',true,false],
						['A simple object is not regarded as a Uize subclass instance',{},false],
						['An array is not regarded as a Uize subclass instance',[],false],
						['A regular expression is not regarded as a Uize subclass instance',/\d+/,false],
						['A function is not regarded as a Uize subclass instance',Uize.nop,false],
						['A Uize class is not regarded as a Uize subclass instance',Uize,false],
						['A Uize package is not regarded as a Uize subclass instance',Uize.Data,false],
						['A Uize instance is correctly regarded as a Uize subclass instance',Uize.Class (),true]
					]],
					['Uize.clone',[
						/*** test cloning of null values ***/
							['Cloning the value null produces the value null',null,null],
							['Cloning the value undefined produces the value undefined',undefined,undefined],

						/*** test cloning of string valus ***/
							['Cloning an empty string produces an empty string','',''],
							['Cloning a non-empty string returns that same string','solar','solar'],

						/*** test cloning of number values ***/
							['Cloning the value 0 produces the value 0',0,0],
							['Cloning a negative number produces that same number',-1,-1],
							['Cloning a positive number produces that same number',1,1],
							['Cloning the special number value NaN produces the value NaN',NaN,NaN],
							['Cloning the special number value Infinity produces the value Infinity',Infinity,Infinity],
							['Cloning the special number value -Infinity produces the value -Infinity',-Infinity,-Infinity],

						/*** test cloning of boolean values ***/
							['Cloning the boolean value false produces the value false',false,false],
							['Cloning the boolean value true produces the value true',true,true],

						/*** test cloning of instances of JavaScript's built-in objects ***/
							_cloneObjectTest (
								'Cloning an instance of the RegExp object produces an equivalent clone',
								RegExp,
								new RegExp ('^\\s+$','gim')
							),
							_cloneObjectTest (
								'Cloning an instance of the Date object produces an equivalent clone',
								Date,
								'2001/9/11'
							),
							_cloneObjectTest (
								'Cloning an instance of the String object produces an equivalent clone',
								String,
								'solar'
							),
							_cloneObjectTest (
								'Cloning an instance of the Number object produces an equivalent clone',
								Number,
								42
							),
							_cloneObjectTest (
								'Cloning an instance of the Boolean object produces an equivalent clone',
								Boolean,
								true
							),

						/*** test cloning of one level deep simple objects ***/
							['Cloning an empty object produces an empty object',{},{}],
							_cloneObjectTest (
								'The clone of an object is not a reference to that object, but is a new object',
								Object,
								{}
							),
							['Cloning a non-empty object produces an identical copy of that object',
								_oneLevelDeepTestObjectForCloning,
								_oneLevelDeepTestObjectForCloning
							],

						/*** test cloning of one level deep arrays ***/
							['Cloning an empty array produces an empty array',[[]],[]],
							_cloneObjectTest (
								'The clone of an array is not a reference to that array, but is a new array',
								Array,
								[]
							),
							['Cloning a non-empty array produces an identical copy of that array',
								[_oneLevelDeepTestArrayForCloning],
								_oneLevelDeepTestArrayForCloning
							],
							{
								title:'Cloning a non-empty array with custom properties preserves the custom properties in the clone',
								test:function () {
									var _arrayWithCustomProperties = [0,1,2];
									_arrayWithCustomProperties.foo = 'bar';
									return this.expect (_arrayWithCustomProperties,Uize.clone (_arrayWithCustomProperties));
								}
							},

						/*** test cloning of complex data structures ***/
							['Cloning a complex object data structure produces an equivalent clone',
								[_complexObjectDataStructure],
								_complexObjectDataStructure
							],
							['Cloning a complex array data structure produces an equivalent clone',
								[_complexArrayDataStructure],
								_complexArrayDataStructure
							],

						/*** test cloning of value types that should just be copied by reference ***/
							{
								title:'Cloning a function simply returns a reference to that function',
								test:function () {
									var _toClone = Uize.nop;
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},
							{
								title:'Cloning a Uize class instance simply returns a reference to that instance',
								test:function () {
									var _toClone = Uize.Class ();
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},

						/*** miscellaneous ***/
							['Specifying no parameter is equivalent to cloning the value undefined',
								[],
								undefined
							]
					]],
					['Uize.map',[
						['A function mapper gets each element\'s value as the first argument',
							[['a','b','c'],function (_value) {return _value.toUpperCase ()}],
							['A','B','C']
						],
						['A function mapper gets each element\'s key as the second argument',
							[['a','b','c'],function (_value,_key) {return _key}],
							[0,1,2]
						],
						['A function mapper is called as an instance method on the source array',
							[['a','b','c'],function () {return this.length}],
							[3,3,3]
						],
						['A number can be specified in place of a source array',
							[['a','b','c'],function (_value,_key) {return (_key + 1) + ' of ' + this.length + ' = ' + _value}],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['A string can be used to specify a mapper',
							[['a','b','c'],'(key + 1) + \' of \' + this.length + \' = \' + value'],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['A source object is automatically mapped to a object',
							[{a:0,b:1,c:2},'key + value'],
							{a:'a0',b:'b1',c:'c2'}
						],
						['An empty array maps to an empty array',
							[[],'value'],
							[]
						],
						['An empty object maps to an empty object',
							[{},'value'],
							{}
						],

						/*** test target parameter ***/
							['An array source can be converted to an object by specifying an empty object target',
								[['a','b','c'],'value',{}],
								{0:'a',1:'b',2:'c'}
							],
							['An object source can be converted to an array by specifying an empty array target',
								[{0:'a',1:'b',2:'c'},'value',[]],
								['a','b','c']
							],
							['When an empty object target is specified, then an empty array source maps to an empty object',
								[[],'value',{}],
								{}
							],
							['When an empty array target is specified, then an empty object source maps to an empty array',
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
								title:'When the source is an empty array, then the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach ([],function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'When the source is an array, then the iteration handler is called as a method on the optionally specified context',
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
								title:'When the source is an array, then the iteration handler receives the value of elements of the array as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (['foo','bar'],function (_value) {_seenValues.push (_value)});
									return this.expect (['foo','bar'],_seenValues);
								}
							},
							{
								title:'When the source is an array, then the iteration handler receives the index of elements of the array as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (['foo','bar'],function (_value,_key) {_seenKeys.push (_key)});
									return this.expect ([0,1],_seenKeys);
								}
							},
							{
								title:'When the source is an array, then the iteration handler receives a reference to the source array as its third argument',
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
								title:'When the source is an array, then the iteration handler is called only for assigned elements of the source array when the optional allArrayElemnts parameter is not specified',
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
								title:'When the source is an array, then the iteration handler is called only for assigned elements of the source array when false is specified for the optional allArrayElemnts parameter',
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
								title:'When the source is an array, then the iteration handler is called even for unassigned elements of the source array when true is specified for the optional allArrayElemnts parameter',
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
								title:'When the source is an empty object, then the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach ({},function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'When the source is an object, then the iteration handler is called as a method on the optionally specified context',
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
								title:'When the source is an object, then the iteration handler receives the value of properties of the object as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach ({foo:'bar',hello:'world'},function (_value) {_seenValues.push (_value)});
									return this.expect (['bar','world'],_seenValues);
								}
							},
							{
								title:'When the source is an object, then the iteration handler receives the name of properties of the object as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach ({foo:'bar',hello:'world'},function (_value,_key) {_seenKeys.push (_key)});
									return this.expect (['foo','hello'],_seenKeys);
								}
							},
							{
								title:'When the source is an object, then the iteration handler receives a reference to the source object as its third argument',
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
								title:'When the source is an object, then specifying false for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
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
								title:'When the source is an object, then specifying true for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
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
								title:'When the source is the number zero, then the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach (0,function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'When the source is a number, then the iteration handler is called as a method on the optionally specified context',
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
								title:'When the source is a number, then the iteration handler receives the iteration index as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (10,function (_value) {_seenValues.push (_value)});
									return this.expect ([0,1,2,3,4,5,6,7,8,9],_seenValues);
								}
							},
							{
								title:'When the source is a number, then the iteration handler receives the iteration index as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (10,function (_value,_key) {_seenKeys.push (_key)});
									return this.expect ([0,1,2,3,4,5,6,7,8,9],_seenKeys);
								}
							},
							{
								title:'When the source is a number, then the iteration handler receives the source as its third argument',
								test:function () {
									var _seenSource;
									Uize.forEach (10,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (10,_seenSource);
								}
							},
							{
								title:'When the source is a number, then specifying false for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
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
								title:'When the source is a number, then specifying true for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
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
								title:'When the iteration handler is a string, then the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var _context = {};
									Uize.forEach (1,'this.foo = "bar"',_context);
									return this.expect ({foo:'bar'},_context);
								}
							},
							{
								title:'When the iteration handler is a string, then the iteration handler receives the iteration index as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (['foo','bar'],'this.push (value)',_seenValues);
									return this.expect (['foo','bar'],_seenValues);
								}
							},
							{
								title:'When the iteration handler is a string, then the iteration handler receives the iteration index as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (['foo','bar'],'this.push (key)',_seenKeys);
									return this.expect ([0,1],_seenKeys);
								}
							},
							{
								title:'When the iteration handler is a string, then the iteration handler receives the source as its third argument',
								test:function () {
									var
										_source = {foo:'bar'},
										_context = {}
									;
									Uize.forEach (_source,'source [key] = value.toUpperCase ()',_context);
									return this.expect ({foo:'BAR'},_source);
								}
							},

						/*** test support for source being an arguments object ***/
							{
								title:'When the source is an arguments object, it is iterated over like an array',
								test:function () {
									var
										_context = {},
										_seenValues = [],
										_seenKeys = [],
										_correctSourcesSeen = [],
										_correctContextsSeen = [],
										_arguments = ['foo','bar','baz','qux']
									;
									function _someFunction () {
										var _arguments = arguments;
										Uize.forEach (
											_arguments,
											function (_value,_key,_source) {
												_seenValues.push (_value);
												_seenKeys.push (_key);
												_correctSourcesSeen.push (_source == _arguments);
												_correctContextsSeen.push (this == _context);
											},
											_context
										);
									}
									_someFunction.apply (0,_arguments);
									return (
										this.expect (_arguments,_seenValues) &&
										this.expect ([0,1,2,3],_seenKeys) &&
										this.expect ([true,true,true,true],_correctSourcesSeen) &&
										this.expect ([true,true,true,true],_correctContextsSeen)
									);
								}
							},

						/*** test handling of a non-object source ***/
							{
								title:'When the source is neither an array, object, nor length, then the iterator is never called',
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
					['Uize.applyAll',[
						{
							title:'An array of functions is executed in the specified sequence, and called on the specified context for every call',
							test:function () {
								var
									_actualCalls = [],
									_actualContexts = [],
									_context = {}
								;
								Uize.applyAll (
									_context,
									[
										function () {
											_actualCalls.push ('a');
											_actualContexts.push (this);
										},
										function () {
											_actualCalls.push ('b');
											_actualContexts.push (this);
										},
										function () {
											_actualCalls.push ('c');
											_actualContexts.push (this);
										}
									]
								);
								return (
									this.expect (['a','b','c'],_actualCalls) &&
									this.expect ([_context,_context,_context],_actualContexts)
								);
							}
						},
						{
							title:'A list object of functions is treated in the same way as an array of functions',
							test:function () {
								var
									_actualCalls = [],
									_actualContexts = [],
									_context = {}
								;
								Uize.applyAll (
									_context,
									{
										2:function () {
											_actualCalls.push ('c');
											_actualContexts.push (this);
										},
										1:function () {
											_actualCalls.push ('b');
											_actualContexts.push (this);
										},
										0:function () {
											_actualCalls.push ('a');
											_actualContexts.push (this);
										},
										length:3
									}
								);
								return (
									this.expect (['a','b','c'],_actualCalls) &&
									this.expect ([_context,_context,_context],_actualContexts)
								);
							}
						},
						{
							title:'When an optional arguments list is provided, the arguments list is used for each function call',
							test:function () {
								var
									_argsForCalls = ['foo','bar',42,true,null,undefined,NaN],
									_seenArgsForCalls = []
								;
								Uize.applyAll (
									0,
									[
										function () {_seenArgsForCalls.push (Uize.copyList (arguments))},
										function () {_seenArgsForCalls.push (Uize.copyList (arguments))},
										function () {_seenArgsForCalls.push (Uize.copyList (arguments))}
									],
									_argsForCalls
								);
								return this.expect ([_argsForCalls,_argsForCalls,_argsForCalls],_seenArgsForCalls);
							}
						}
					]],
					['Uize.callOn',[
						{
							title:'Specifying null for the object results in no action',
							test:function () {
								var _success = true;
								Uize.callOn (null,function () {_success = false});
								return _success;
							}
						},
						{
							title:'Specifying undefined for the object results in no action',
							test:function () {
								var _success = true;
								Uize.callOn (undefined,function () {_success = false});
								return _success;
							}
						},
						{
							title:
								'Specifying a value for method that is neither a string nor a function results in no error being produced',
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
								'Specifying a function as the method and an instance as the target results in the function being called as an instance method on the instance',
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
								'When the optional arguments parameter is not specified, then the arguments are defaulted to an empty array',
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
								'When the optional arguments parameter is specified, those arguments are passed in the call correctly',
							test:function () {
								var
									_target = Uize.Class (),
									_expectedArguments = ['foo',42,true],
									_actualArguments
								;
								Uize.callOn (
									_target,
									function () {_actualArguments = Uize.copyList (arguments)},
									_expectedArguments
								);
								return this.expect (_expectedArguments,_actualArguments);
							}
						},
						{
							title:
								'Specifying the target as an instance and the method as a string does not result in an error being produced when the method is not defined on the instance',
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
								'Specifying the target as an instance and the method as a string results in the specified method being called as an instance method on the instance',
							test:function () {
								var
									_target = Uize.Class (),
									_success = false,
									_expectedArguments = ['foo',42,true],
									_actualArguments
								;
								_target.someSillyMethodName = function () {_actualArguments = Uize.copyList (arguments)};
								Uize.callOn (_target,'someSillyMethodName',_expectedArguments);
								return this.expect (_expectedArguments,_actualArguments);
							}
						},
						{
							title:
								'Specifying an array as the target results in the method being called correctly on all elements of the array',
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
											_arguments:Uize.copyList (arguments)
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
								'Specifying an object as the target results in the method being called correctly on all property values of the object',
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
											_arguments:Uize.copyList (arguments)
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
							title:'When the target is a complex data structure, it is fully recursed',
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
											_arguments:Uize.copyList (arguments)
										});
									},
									_testArguments
								);
								return this.expect (_expectedCallLog,_actualCallLog);
							}
						},
						{
							title:'A function can be called as a method on values that are primitives or instances of objects that are not Uize subclasses',
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
						['An array containing the keys of the source object is returned',[{foo:1,bar:2}],['foo','bar']],
						['When the source is a populated array, then an array containing the indexes of the elements is returned',[['a','b','c','d']],['0','1','2','3']],
						['When the source is a sparsely populated array, then an array containing the indexes of only the populated elements is returned',
							[_sparselyPopulatedArray],
							['2','7']
						],
						['A non-zero length array that is unpopulated has no keys',[new Array (5)],[]],
						['An empty array has no keys',[[]],[]],
						['An empty object has no keys',[{}],[]],
						['The value null has no keys',null,[]],
						['The value undefined has no keys',undefined,[]],
						['A boolean value has no keys',false,[]],
						['A number value has no keys',5,[]],
						['A string value has no keys','hello',[]]
					]],
					['Uize.totalKeys',[
						['The total number of keys of the source object is returned',[{foo:1,bar:2}],2],
						['When the source is a populated array, then the length of the array is returned',[['a','b','c','d']],4],
						['When the source is a sparsely populated array, then the total number of populated elements is returned',
							[_sparselyPopulatedArray],
							2
						],
						['A non-zero length array that is unpopulated has 0 keys',[new Array (5)],0],
						['An empty array has 0 keys',[[]],0],
						['An empty object has 0 keys',[{}],0],
						['The value null has 0 keys',null,0],
						['The value undefined has 0 keys',undefined,0],
						['A boolean value has 0 keys',false,0],
						['A number value has 0 keys',5,0],
						['A string value has 0 keys','hello',0]
					]],
					['Uize.values',[
						['An array containing the values of the source object\'s properties is returned',[{foo:1,bar:2}],[1,2]],
						['When the source is a populated array, then an array containing the values of the elements is returned',
							[['a','b','c','d']],
							['a','b','c','d']
						],
						{
							title:'Getting values for an array simply returns the array',
							test:function () {return Uize.values (_sparselyPopulatedArray) == _sparselyPopulatedArray}
						},
						['When the source is a sparsely populated array, then an equivalent sparsely populated array is returned',
							[_sparselyPopulatedArray],
							_sparselyPopulatedArray
						],
						['When the source is a non-zero length unpopulated array, then an unpopulated array of equal length is returned',
							[new Array (5)],
							new Array (5)
						],
						['An empty array has no values',[[]],[]],
						['An empty object has no values',[{}],[]],
						['The value null has no values',null,[]],
						['The value undefined has no values',undefined,[]],
						['A boolean value has no values',false,[]],
						['A number value has no values',5,[]],
						['A string value has no values','hello',[]]
					]],
					['Uize.meldKeysValues',[
						['The specified keys and values are melded together to form a single object, where the keys are paired with corresponding values to form object properties',
							[['foo','hello'],['bar','world']],
							{foo:'bar',hello:'world'}
						],
						['Surplus values are ignored',
							[['foo'],['bar','world']],
							{foo:'bar'}
						],
						['Surplus keys are ignored',
							[['foo','hello'],['bar']],
							{foo:'bar'}
						]
					]],
					['Uize.lookup',[
						['The value true is the default value for the lookupValue paramter',
							[['foo','bar']],
							{foo:true,bar:true}
						],
						['Any value can be specified as a value for the lookupValue paramter',
							[['foo','bar'],5],
							{foo:5,bar:5}
						],
						['The value undefined can be specified as a value for the lookupValue paramter',
							[['foo','bar'],undefined],
							{foo:undefined,bar:undefined}
						],
						['The source values array may contain duplicate values',
							[['foo','foo','bar','bar']],
							{foo:true,bar:true}
						],
						['If the source values array contains non-string values, they will be coerced to strings to form key names in the resulting lookup',
							[['','string',true,4.01,NaN,Infinity,null,undefined],1],
							{'':1,'string':1,'true':1,'4.01':1,'NaN':1,'Infinity':1,'null':1,'undefined':1}
						],
						['An empty values array produces an empty lookup object',
							[[]],
							{}
						],
						['A sparsely populated values array produces a lookup object with a single "undefined" key for all the missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:true,2:true,'undefined':true}
						],
						['A non-zero length values array that is unpopulated produces a lookup object with a single "undefined" key for all the undefined element values',
							[new Array (5)],
							{'undefined':true}
						],

						/*** test handling of the optional safeOrTarget parameter ***/
							['Specifying the value true for the optional safeOrTarget parameter results in a safe lookup object being created',
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
								title:'Specifying the value false for the optional safeOrTarget parameter results in an unsafe lookup object being created',
								test:function () {
									var _lookup = Uize.lookup (null,1,false);
									return this.expect (
										true,
										!!(_lookup.constructor && _lookup.toLocaleString && _lookup.toString && _lookup.valueOf)
									);
								}
							},
							['Specifying the value true for the optional safeOrTarget parameter is handled correctly when the source array contains values that coincide with properties of the Object prototype',
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
								title:'When a target object is specified for the optional safeOrTarget parameter, then that target object is populated with the lookup keys',
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
						['Calling with no parameter produces an empty object',
							[],
							{}
						],
						['Calling with the value null specified produces an empty object',
							[null],
							{}
						],
						['Calling with the value undefined specified produces an empty object',
							[undefined],
							{}
						],
						['A reverse lookup can be produced from a source object',
							[{foo:1,bar:2}],
							{1:'foo',2:'bar'}
						],
						['When the source object contains duplicate values, the name of the last property having the duplicate value will be used as the value in the reverse lookup (last mapping wins)',
							[{foo:1,bar:1}],
							{1:'bar'}
						],
						['An empty object produces an empty reverse lookup object',
							[{}],
							{}
						],
						['If the properties of the source object have non-string values, they will be coerced to strings to form key names in the resulting reverse lookup',
							[{prop1:'',prop2:'string',prop3:true,prop4:4.01,prop5:NaN,prop6:Infinity,prop7:null,prop8:undefined}],
							{'':'prop1','string':'prop2','true':'prop3','4.01':'prop4','NaN':'prop5',Infinity:'prop6','null':'prop7','undefined':'prop8'}
						],
						['An array can be specified as a source object',
							[['foo','bar']],
							{foo:'0',bar:'1'}
						],
						['An empty array produces an empty reverse lookup object',
							[{}],
							{}
						],
						['A sparsely populated values array produces a reverse lookup object with no "undefined" key for missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:'2',2:'7'}
						],
						['A non-zero length values array that is unpopulated produces an empty reverse lookup object',
							[new Array (5)],
							{}
						],
						['The value null produces an empty reverse lookup object',null,{}],
						['The value undefined produces an empty reverse lookup object',undefined,{}],
						['A boolean value produces an empty reverse lookup object',false,{}],
						['A number value produces an empty reverse lookup object',5,{}],
						['A string value produces an empty reverse lookup object','hello',{}],

						/*** test handling of the optional safeOrTarget parameter ***/
							['Specifying the value true for the optional safeOrTarget parameter results in a safe reverse lookup object being created',
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
								title:'Specifying the value false for the optional safeOrTarget parameter results in an unsafe reverse lookup object being created',
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
							['Specifying the value true for the optional safeOrTarget parameter is handled correctly when the source object contains values that coincide with properties of the Object prototype',
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
								title:'When a target object is specified for the optional safeOrTarget parameter, then that target object is populated with the lookup keys',
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
						['The maximum value is obtained from the values of all the properties of a source object',
							[{foo:1,bar:2}],
							2
						],
						['The maximum value is obtained from the values of all the elements of a source array',
							[[1,2]],
							2
						],
						['The maximum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['The maximum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['The maximum value from an empty array is -Infinity',[[]],-Infinity],
						['The maximum value from an empty object is -Infinity',[{}],-Infinity],
						['The maximum value from null is -Infinity',null,-Infinity],
						['The maximum value from undefined is -Infinity',undefined,-Infinity],
						['The maximum value from a boolean value is -Infinity',false,-Infinity],
						['The maximum value from a number value is -Infinity',5,-Infinity],
						['The maximum value from a string value is -Infinity','hello',-Infinity]
					]],
					['Uize.min',[
						['The minimum value is obtained from the values of all the properties of a source object',
							[{foo:1,bar:2}],
							1
						],
						['The minimum value is obtained from the values of all the elements of a source array',
							[[1,2]],
							1
						],
						['The minimum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['The minimum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['The minimum value from an empty array is Infinity',[[]],Infinity],
						['The minimum value from an empty object is Infinity',[{}],Infinity],
						['The minimum value from null is Infinity',null,Infinity],
						['The minimum value from undefined is Infinity',undefined,Infinity],
						['The minimum value from a boolean value is Infinity',false,Infinity],
						['The minimum value from a number value is Infinity',5,Infinity],
						['The minimum value from a string value is Infinity','hello',Infinity]
					]],
					['Uize.now',[
						{
							title:'An integer is returned',
							test:function () {return this.expectInteger (Uize.now ())}
						},
						{
							title:'The current time in milliseconds is returned',
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

					['Uize.module',[
					]],
					['Uize.getModuleByName',[
					]],
					['Uize.moduleLoader',[
					]],
					['Uize.moduleUrlResolver',[
					]],
					['Uize.getPathToLibrary',[
					]],
					['Uize.package',[
						{
							title:'A function object is returned',
							test:function () {
								return this.expectFunction (Uize.package ());
							}
						},
						{
							title:'A new function object is returned each time',
							test:function () {
								var
									_package1 = Uize.package (),
									_package2 = Uize.package (),
									_package3 = Uize.package ()
								;
								return (
									this.expectFunction (_package1) &&
									this.expectFunction (_package2) &&
									this.expectFunction (_package3) &&
									_package1 != _package2 &&
									_package2 != _package3 &&
									_package3 != _package1
								);
							}
						},
						{
							title:'When no statics are specified, a function object is returned that contains no additional properties',
							test:function () {
								var
									_package = Uize.package (),
									_function = function () {},
									_packageHasExtraProperties = false
								;
								for (var _property in _package) {
									if (_packageHasExtraProperties = !(_property in _function))
										break
									;
								}
								return this.expect (false,_packageHasExtraProperties);
							}
						},
						{
							title:'When statics are specified, those statics are all copied into the function object that is returned',
							test:function () {
								var
									_method1 = function () {},
									_method2 = function () {},
									_statics = {
										someProperty1:'foo',
										someProperty2:'bar',
										someMethod1:_method1,
										someMethod2:_method2
									},
									_package = Uize.package (_statics)
								;
								return (
									this.expect ('foo',_package.someProperty1) &&
									this.expect ('bar',_package.someProperty2) &&
									this.expect (_method1,_package.someMethod1) &&
									this.expect (_method2,_package.someMethod2)
								);
							}
						}
					]]
				]),
				{
					title:'Data Module Pattern with Caching Accessor',
					test:function () {
						var _result;

						/*** declare MyNamespace namespace ***/
							Uize.module ('MyNamespace');

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
									_result = Uize.Data.Compare.identical (
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
