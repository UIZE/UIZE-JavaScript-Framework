/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Matches Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.Matches= module defines a suite of unit tests for the =Uize.Data.Matches= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Matches',
	builder:function () {
		'use strict';

		function _getArrayWithUnassignedElements () {
			var _result = [];
			_result [0] = undefined;
			_result [3] = 5;
			_result [5] = undefined;
			_result [8] = 'foo';
			_result.length = 10;
			return _result;
		}

		function _forEachMaxMatchesTest (_title,_maxMatches) {
			return {
				title:_title,
				test:function () {
					var
						_source = ['','hey','','there','foo','','','bar'],
						_allMatchValues = ['hey','there','foo','bar'],
						_matchValues = []
					;
					Uize.Data.Matches.forEach (
						_source,
						function (_value) {return !!_value},
						function (_value) {_matchValues.push (_value)},
						_maxMatches
					);
					return this.expect (
						_allMatchValues.slice (0,_maxMatches == undefined ? Infinity : Math.max (_maxMatches,0)),
						_matchValues
					);
				}
			};
		}

		function _forEachMatcherTest (_title,_source,_matcher,_expectedIteratorValues) {
			return {
				title:_title,
				test:function () {
					var _actualIteratorValues = [];
					Uize.Data.Matches.forEach (
						_source,
						_matcher,
						function (_value,_key) {_actualIteratorValues.push (_value)}
					);
					return this.expect (_expectedIteratorValues,_actualIteratorValues);
				}
			}
		}

		function _forEachIteratorTest (_title,_source,_expectedIteratorValues,_expectedIteratorKeys) {
			return {
				title:_title,
				test:function () {
					var
						_actualIteratorValues = [],
						_actualIteratorKeys = []
					;
					Uize.Data.Matches.forEach (
						_source,
						function (_value) {return !!_value},
						function (_value,_key) {
							_actualIteratorValues.push (_value);
							_actualIteratorKeys.push (_key);
						}
					);
					return (
						this.expect (_expectedIteratorValues,_actualIteratorValues) &&
						this.expect (_expectedIteratorKeys,_actualIteratorKeys)
					);
				}
			}
		}

		function _sourceTest (_methodName) {
			function _basicSourceTest (_title,_source,_expectedMatchValues,_expectedMatchKeys) {
				return {
					title:_title,
					test:function () {
						var
							_matchValues = [],
							_matchKeys = []
						;
						Uize.Data.Matches [_methodName] (
							_source,
							function (_value,_key) {
								_matchValues.push (_value);
								_matchKeys.push (_key);
							}
						);
						return (
							this.expect (_expectedMatchValues,_matchValues) &&
							this.expect (_expectedMatchKeys,_matchKeys)
						);
					}
				};
			}
			return {
				title:'Test support for different types of sources',
				test:[
					_basicSourceTest (
						'Test that an array source is supported correctly',
						['','hey','','there','foo','','','bar'],
						['','hey','','there','foo','','','bar'],
						[0,1,2,3,4,5,6,7]
					),
					_basicSourceTest (
						'Test that an array source is supported correctly',
						{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
						['','hey','','there','foo','','','bar'],
						['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7']
					),
					_basicSourceTest (
						'Test that the value null for the source results in no iterations being performed',
						null,
						[],
						[]
					),
					_basicSourceTest (
						'Test that the value undefined for the source results in no iterations being performed',
						undefined,
						[],
						[]
					),
					_basicSourceTest (
						'Test that a number source is supported correctly',
						5,
						[0,1,2,3,4],
						[0,1,2,3,4]
					)
				]
			}
		}

		function _matcherTest (_methodName) {
			var
				_global = Uize.global (),
				_dummyGlobalTestMethodName = 'Uize_Test_Uize_Data_Matches_dummyTestMethod'
			;
			function _matcherCallSignatureTest (
				_title,_source,_expectedMatchValues,_expectedMatchKeys,_useStringMatcher
			) {
				return {
					title:_title,
					test:function () {
						var
							_valuesSeenByMatcher = [],
							_keysSeenByMatcher = []
						;
						function _matcher (_value,_key) {
							_valuesSeenByMatcher.push (_value);
							_keysSeenByMatcher.push (_key);
						}
						if (_useStringMatcher)
							_global [_dummyGlobalTestMethodName] = _matcher
						;
						Uize.Data.Matches [_methodName] (
							_source,
							_useStringMatcher ? _dummyGlobalTestMethodName + ' (value,key)' : _matcher
						);
						if (_useStringMatcher)
							delete _global [_dummyGlobalTestMethodName]
						;
						return (
							this.expect (_expectedMatchValues,_valuesSeenByMatcher) &&
							this.expect (_expectedMatchKeys,_keysSeenByMatcher)
						);
					}
				};
			}
			return {
				title:'Test that the matcher parameter is supported correctly',
				test:[
					/*** test call signature for matcher function ***/
						_matcherCallSignatureTest (
							'Test that the matcher function receives value and index for each element of an array source as parameters',
							['','hey','','there','foo','','','bar'],
							['','hey','','there','foo','','','bar'],
							[0,1,2,3,4,5,6,7]
						),
						_matcherCallSignatureTest (
							'Test that the matcher function receives value and key for each property of an object source as parameters',
							{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
							['','hey','','there','foo','','','bar'],
							['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7']
						),
						_matcherCallSignatureTest (
							'Test that the matcher function receives value and index for each value of a range source as parameters',
							5,
							[0,1,2,3,4],
							[0,1,2,3,4]
						),

					/*** test support for string matcher expression ***/
						_matcherCallSignatureTest (
							'Test that a matcher expression string receives value and key values for each element of an array source',
							['','hey','','there','foo','','','bar'],
							['','hey','','there','foo','','','bar'],
							[0,1,2,3,4,5,6,7],
							true
						),
						_matcherCallSignatureTest (
							'Test that a matcher expression string receives value and key values for each property of an object source',
							{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
							['','hey','','there','foo','','','bar'],
							['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7'],
							true
						),
						_matcherCallSignatureTest (
							'Test that a matcher expression string receives value and key values for each value of a range source',
							5,
							[0,1,2,3,4],
							[0,1,2,3,4],
							true
						)
				]
			}
		}

		function _targetTestForRemoveOrRetainMethod (_methodName) {
			var
				_matcherPrefix = _methodName == 'retain' ? '!' : '',
				_matcher = _matcherPrefix + '!value',
				_matcherForNumberSource = _matcherPrefix + '(value % 2)'
			;
			return {
				title:'Test support for the optional target parameter',
				test:[
					{
						title:'Test support for the target parameter when the source is an object',
						test:[
							{
								title:'Test that, when the source is an object and the value true is specified for the target parameter, the result is returned in a fresh object',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,true)
									;
									return (
										this.expect (false,_source === _result) &&
										this.expect ({prop1:'hey',prop3:'there'},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an object and the value false is specified for the target parameter, the source object is modified and returned',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,false)
									;
									return (
										this.expectSameAs (_source,_result) &&
										this.expect ({prop1:'hey',prop3:'there'},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an object and the source is specified for the target parameter, the source is modified and returned',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_source)
									;
									return (
										this.expectSameAs (_source,_result) &&
										this.expect ({prop1:'hey',prop3:'there'},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an object and an empty object is specified for the target parameter, the target object is modified and returned',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_target = {},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ({prop1:'hey',prop3:'there'},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an object and a non-empty object is specified for the target parameter, the target object\'s contents is replaced with the result and returned',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_target = {foo:'bar'},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ({prop1:'hey',prop3:'there'},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an object and an empty array is specified for the target parameter, the target array remains empty but is extended with custom properties from the source object',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_target = [],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect (0,_result.length) &&
										this.expect (false,'prop0' in _target) &&
										this.expect (false,'prop2' in _target) &&
										this.expect ('hey',_target.prop1) &&
										this.expect ('there',_target.prop3)
									);
								}
							},
							{
								title:'Test that, when the source is an object and a non-empty array is specified for the target parameter, the target array is emptied and extended with custom properties from the source object',
								test:function () {
									var
										_source = {prop0:'',prop1:'hey',prop2:'',prop3:'there'},
										_target = ['foo','bar'],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect (0,_result.length) &&
										this.expect (false,'prop0' in _target) &&
										this.expect (false,'prop2' in _target) &&
										this.expect ('hey',_target.prop1) &&
										this.expect ('there',_target.prop3)
									);
								}
							}
						]
					},
					{
						title:'Test support for the target parameter when the source is an array',
						test:[
							{
								title:'Test that, when the source is an array and the value true is specified for the target parameter, the result is returned in a fresh array',
								test:function () {
									var
										_source = ['','hey','','there'],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,true)
									;
									return (
										this.expect (false,_source === _result) &&
										this.expect (['hey','there'],_result)
									);
								}
							},
							{
								title:'Test that, when the source is an array and the value false is specified for the target parameter, the source array is modified and returned',
								test:function () {
									var
										_source = ['','hey','','there'],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,false)
									;
									return (
										this.expectSameAs (_source,_result) &&
										this.expect (['hey','there'],_result)
									);
								}
							},
							{
								title:'Test that, when the source is an array and the source is specified for the target parameter, the source is modified and returned',
								test:function () {
									var
										_source = ['','hey','','there'],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_source)
									;
									return (
										this.expectSameAs (_source,_result) &&
										this.expect (['hey','there'],_result)
									);
								}
							},
							{
								title:'Test that, when the source is an array and an empty object is specified for the target parameter, the target object is modified to be a list and returned',
								test:function () {
									var
										_source = ['','hey','','there'],
										_target = {},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ({0:'hey',1:'there',length:2},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an array and a non-empty object is specified for the target parameter, the target object is emptied, modified to be a list, and returned',
								test:function () {
									var
										_source = ['','hey','','there'],
										_target = {foo:'bar'},
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ({0:'hey',1:'there',length:2},_result)
									);
								}
							},
							{
								title:'Test that, when the source is an array and an empty array is specified for the target parameter, the target array is modified and returned',
								test:function () {
									var
										_source = ['','hey','','there'],
										_target = [],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect (['hey','there'],_result)
									);
								}
							},
							{
								title:'Test that, when the source is an array and a non-empty array is specified for the target parameter, the target array\'s contents is replaced with the result and returned',
								test:function () {
									var
										_source = ['','hey','','there'],
										_target = ['foo','bar'],
										_result = Uize.Data.Matches [_methodName] (_source,_matcher,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect (['hey','there'],_result)
									);
								}
							}
						]
					},
					{
						title:'Test support for the target parameter when the source is a number',
						test:[
							{
								title:'Test that, when the source is a number and the value true is specified for the target parameter, the result is returned in a fresh array',
								test:function () {
									return this.expect (
										[0,2,4],
										Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,true)
									);
								}
							},
							{
								title:'Test that, when the source is a number and the value false is specified for the target parameter, the result is returned in a fresh array',
								test:function () {
									return this.expect (
										[0,2,4],
										Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,false)
									);
								}
							},
							{
								title:'Test that, when the source is a number and a number is specified for the target parameter, the result is returned in a fresh array',
								test:function () {
									return this.expect (
										[0,2,4],
										Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,10)
									);
								}
							},
							{
								title:'Test that, when the source is a number and an empty array is specified for the target parameter, the target array is modified and returned',
								test:function () {
									var
										_target = [],
										_result = Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ([0,2,4],_result)
									);
								}
							},
							{
								title:'Test that, when the source is a number and a non-empty array is specified for the target parameter, the target array\'s contents is replaced with the result and returned',
								test:function () {
									var
										_target = ['foo','bar'],
										_result = Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ([0,2,4],_result)
									);
								}
							},
							{
								title:'Test that, when the source is a number and an empty object is specified for the target parameter, the target object is modified to be a list and returned',
								test:function () {
									var
										_target = {},
										_result = Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ({0:0,1:2,2:4,length:3},_result)
									);
								}
							},
							{
								title:'Test that, when the source is a number and a non-empty object is specified for the target parameter, the target object is emptied, modified to be a list, and returned',
								test:function () {
									var
										_target = {foo:'bar'},
										_result = Uize.Data.Matches [_methodName] (5,_matcherForNumberSource,null,_target)
									;
									return (
										this.expectSameAs (_target,_result) &&
										this.expect ({0:0,1:2,2:4,length:3},_result)
									);
								}
							}
						]
					}
				]
			}
		}

		return Uize.Test.declare ({
			title:'Uize.Data.Matches Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Matches'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Matches.forEach',[
						/*** test support for different types of sources ***/
							_sourceTest ('forEach'),

						/*** test support for matcher ***/
							_matcherTest ('forEach'),

							/*** test when true is specified for matcher ***/
								_forEachMatcherTest (
									'Test that, when the value true is specified for the matcher, all elements of an array source are iterated over',
									['','hey','','there','foo','','','bar'],
									true,
									['','hey','','there','foo','','','bar']
								),
								_forEachMatcherTest (
									'Test that, when the value true is specified for the matcher, all properties of an object source are iterated over',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									true,
									['','hey','','there','foo','','','bar']
								),
								_forEachMatcherTest (
									'Test that, when the value true is specified for the matcher, all values of a range source are iterated over',
									5,
									true,
									[0,1,2,3,4]
								),

							/*** test when false is specified for matcher ***/
								_forEachMatcherTest (
									'Test that, when the value false is specified for the matcher, no elements of an array source are iterated over',
									['','hey','','there','foo','','','bar'],
									false,
									[]
								),
								_forEachMatcherTest (
									'Test that, when the value false is specified for the matcher, no properties of an object source are iterated over',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									false,
									[]
								),
								_forEachMatcherTest (
									'Test that, when the value false is specified for the matcher, no values of a range source are iterated over',
									5,
									false,
									[]
								),

							/*** test when null is specified for matcher ***/
								_forEachMatcherTest (
									'Test that, when the value null is specified for the matcher, all elements of an array source are iterated over',
									['','hey','','there','foo','','','bar'],
									true,
									['','hey','','there','foo','','','bar']
								),
								_forEachMatcherTest (
									'Test that, when the value null is specified for the matcher, all properties of an object source are iterated over',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									true,
									['','hey','','there','foo','','','bar']
								),
								_forEachMatcherTest (
									'Test that, when the value null is specified for the matcher, all values of a range source are iterated over',
									5,
									true,
									[0,1,2,3,4]
								),

							/*** test when undefined is specified for matcher ***/
								_forEachMatcherTest (
									'Test that, when the value undefined is specified for the matcher, all elements of an array source are iterated over',
									['','hey','','there','foo','','','bar'],
									true,
									['','hey','','there','foo','','','bar']
								),
								_forEachMatcherTest (
									'Test that, when the value undefined is specified for the matcher, all properties of an object source are iterated over',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									true,
									['','hey','','there','foo','','','bar']
								),
								_forEachMatcherTest (
									'Test that, when the value undefined is specified for the matcher, all values of a range source are iterated over',
									5,
									true,
									[0,1,2,3,4]
								),

							/*** test when regular expression is specified for matcher ***/
								_forEachMatcherTest (
									'Test that, when a regular expression is specified for the matcher, only elements of an array source whose values match the regular expression are iterated over',
									['boo','1234','hey','hi42','6','number 6',''],
									/^\d+$/,
									['1234','6']
								),
								_forEachMatcherTest (
									'Test that, when a regular expression is specified for the matcher, only properties of an object source whose values match the regular expression are iterated over',
									{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
									/^\d+$/,
									['1234','6']
								),
								_forEachMatcherTest (
									'Test that, when a regular expression is specified for the matcher, only values of a range source that match the regular expression are iterated over',
									100,
									/^\d*1$/,
									[1,11,21,31,41,51,61,71,81,91]
								),

						/*** test call signature for iterator function ***/
							_forEachIteratorTest (
								'Test that the iterator function receives value and index as parameters for each matched element of an array source as parameters',
								['','hey','','there','foo','','','bar'],
								['hey','there','foo','bar'],
								[1,3,4,7]
							),
							_forEachIteratorTest (
								'Test that the iterator function receives value and index as parameters for each matched element of an object source as parameters',
								{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
								['hey','there','foo','bar'],
								['prop1','prop3','prop4','prop7']
							),

						/*** test support for the maxMatches parameter ***/
							_forEachMaxMatchesTest (
								'Test that specifying the value 0 for the maxMatches parameter results in the iteration handler never being called, even if there are matches',
								0
							),
							_forEachMaxMatchesTest (
								'Test that specifying a negative value for the maxMatches parameter results in the iteration handler never being called, even if there are matches',
								-10
							),
							_forEachMaxMatchesTest (
								'Test that specifying a number for the maxMatches parameter that is lower than the number of actual matches results in the iteration handler being called only for matches before the max has been reached',
								2
							),
							_forEachMaxMatchesTest (
								'Test that specifying a number for the maxMatches parameter that is higher than the number of actual matches results in the iteration handler being called for all the matches',
								10
							),
							_forEachMaxMatchesTest (
								'Test that specifying the value null for the maxMatches parameter results in it being defaulted to Infinity',
								null
							),
							_forEachMaxMatchesTest (
								'Test that specifying the value undefined for the maxMatches parameter results in it being defaulted to Infinity',
								undefined
							),

						/*** miscellaneous tests ***/
							{
								title:'Test that unassigned elements of an array source are observed',
								test:function () {
									var
										_matchValues = [],
										_matchKeys = []
									;
									Uize.Data.Matches.forEach (
										_getArrayWithUnassignedElements (),
										function (_value) {return _value === undefined},
										function (_value,_key) {
											_matchValues.push (_value);
											_matchKeys.push (_key);
										}
									);
									return (
										this.expect (
											[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
											_matchValues
										) &&
										this.expect ([0,1,2,4,5,6,7,9],_matchKeys)
									);
								}
							}
					]],
					['Uize.Data.Matches.remove',
						[
							/*** test support for different types of sources ***/
								_sourceTest ('remove'),
								/*** further tests for array source ***/
									['Test that, when a matcher matches some elements of an array source, those matching elements are removed',
										[
											['','hey','','there','foo','','','bar'],
											function (_value) {return !_value}
										],
										['hey','there','foo','bar']
									],
									['Test that, when a matcher matches no elements of an array source, no elements are removed',
										[
											['','hey','','there','foo','','','bar'],
											Uize.returnFalse
										],
										['','hey','','there','foo','','','bar']
									],
									['Test that, when a matcher matches all elements of an array source, all elements are removed',
										[
											['','hey','','there','foo','','','bar'],
											Uize.returnTrue
										],
										[]
									],

								/*** further tests for object source ***/
									['Test that, when a matcher matches some properties of an object source, those matching properties are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											function (_value) {return !_value}
										],
										{prop1:'hey',prop3:'there',prop4:'foo',prop7:'bar'}
									],
									['Test that, when a matcher matches no properties of an object source, no properties are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											Uize.returnFalse
										],
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],
									['Test that, when a matcher matches all properties of an object source, all properties are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											Uize.returnTrue
										],
										{}
									],

								/*** tests for a range sounrce ***/
									['Test that, when a matcher matches some values of a range source, then an array of the range values with the matching values removed is returned',
										[6,function (_value) {return _value % 2}],
										[0,2,4]
									],
									['Test that, when a matcher matches all values of a range source, then an empty array is returned',
										[6,Uize.returnTrue],
										[]
									],
									['Test that, when a matcher matches no values of a range source, then an array containing all values in the range is returned',
										[6,Uize.returnFalse],
										[0,1,2,3,4,5]
									],

							/*** test support for matcher ***/
								_matcherTest ('remove'),

								/*** test when no matcher is specified ***/
									['Test that, when no matcher is specified, all elements of an array source are removed',
										[['','hey','','there','foo','','','bar']],
										[]
									],
									['Test that, when no matcher is specified, all properties of an object source are removed',
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										{}
									],
									['Test that, when no matcher is specified, all values of a range source are removed',
										5,
										[]
									],

								/*** test when true is specified for matcher ***/
									['Test that, when the value true is specified for the matcher, all elements of an array source are removed',
										[
											['','hey','','there','foo','','','bar'],
											true
										],
										[]
									],
									['Test that, when the value true is specified for the matcher, all properties of an object source are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											true
										],
										{}
									],
									['Test that, when the value true is specified for the matcher, all values of a range source are removed',
										[5,true],
										[]
									],

								/*** test when false is specified for matcher ***/
									['Test that, when the value false is specified for the matcher, no elements of an array source are removed',
										[
											['','hey','','there','foo','','','bar'],
											false
										],
										['','hey','','there','foo','','','bar']
									],
									['Test that, when the value false is specified for the matcher, no properties of an object source are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											false
										],
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],
									['Test that, when the value false is specified for the matcher, no values of a range source are iterated over',
										[5,false],
										[0,1,2,3,4]
									],

								/*** test when null is specified for matcher ***/
									['Test that, when the value null is specified for the matcher, all elements of an array source are removed',
										[
											['','hey','','there','foo','','','bar'],
											true
										],
										[]
									],
									['Test that, when the value null is specified for the matcher, all properties of an object source are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											true
										],
										{}
									],
									['Test that, when the value null is specified for the matcher, all values of a range source are removed',
										[5,true],
										[]
									],

								/*** test when undefined is specified for matcher ***/
									['Test that, when the value undefined is specified for the matcher, all elements of an array source are removed',
										[
											['','hey','','there','foo','','','bar'],
											true
										],
										[]
									],
									['Test that, when the value undefined is specified for the matcher, all properties of an object source are removed',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											true
										],
										{}
									],
									['Test that, when the value undefined is specified for the matcher, all values of a range source are removed',
										[5,true],
										[]
									],

								/*** test when regular expression is specified for matcher ***/
									['Test that, when a regular expression is specified for the matcher, only elements of an array source whose values match the regular expression are removed',
										[
											['boo','1234','hey','hi42','6','number 6',''],
											/^\d+$/
										],
										['boo','hey','hi42','number 6','']
									],
									['Test that, when a regular expression is specified for the matcher, only properties of an object source whose values match the regular expression are removed',
										[
											{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
											/^\d+$/
										],
										{prop1:'hey',prop2:'hi42',prop4:'number 6',prop5:''}
									],
									['Test that, when a regular expression is specified for the matcher, only values of a range source that match the regular expression are removed',
										[30,/1/],
										[0,2,3,4,5,6,7,8,9,20,22,23,24,25,26,27,28,29]
									],

							/*** test support for the maxMatches parameter ***/
								['Test that specifying the value 0 for the maxMatches parameter results in no elements of an array source being removed, even if there are matches',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										0
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that specifying a negative value for the maxMatches parameter results in no elements of an array source being removed, even if there are matches',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										-10
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that specifying a non-zero number for the maxMatches parameter that is lower than the number of actual matches results in only the specified maximum number of matches being removed from a source array',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										2
									],
									['','','foo','','','bar']
								],
								['Test that specifying a number for the maxMatches parameter that is higher than the number of actual matches in a source array results in all matching elements being removed',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										10
									],
									['','','','']
								],
								['Test that specifying the value null for the maxMatches parameter results in it being defaulted to Infinity',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										null
									],
									['','','','']
								],
								['Test that specifying the value undefined for the maxMatches parameter results in it being defaulted to Infinity',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										undefined
									],
									['','','','']
								],

							/*** test support for target parameter ***/
								_targetTestForRemoveOrRetainMethod ('remove')
						],
						null,
						{cloneArguments:true}
					],
					['Uize.Data.Matches.retain',
						[
							/*** test support for different types of sources ***/
								_sourceTest ('retain'),
								/*** further tests for array source ***/
									['Test that, when a matcher matches some elements of an array source, only those matching elements are retained',
										[
											['','hey','','there','foo','','','bar'],
											function (_value) {return _value}
										],
										['hey','there','foo','bar']
									],
									['Test that, when a matcher matches no elements of an array source, no elements are retained',
										[
											['','hey','','there','foo','','','bar'],
											Uize.returnFalse
										],
										[]
									],
									['Test that, when a matcher matches all elements of an array source, all elements are retained',
										[
											['','hey','','there','foo','','','bar'],
											Uize.returnTrue
										],
										['','hey','','there','foo','','','bar']
									],

								/*** further tests for object source ***/
									['Test that, when a matcher matches some properties of an object source, only those matching properties are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											function (_value) {return _value}
										],
										{prop1:'hey',prop3:'there',prop4:'foo',prop7:'bar'}
									],
									['Test that, when a matcher matches no properties of an object source, no properties are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											Uize.returnFalse
										],
										{}
									],
									['Test that, when a matcher matches all properties of an object source, all properties are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											Uize.returnTrue
										],
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],

								/*** tests for a range sounrce ***/
									['Test that, when a matcher matches some values of a range source, then an array of only those matching range values is returned',
										[6,function (_value) {return _value % 2}],
										[1,3,5]
									],
									['Test that, when a matcher matches all values of a range source, then an array containing all values in the range is returned',
										[6,Uize.returnTrue],
										[0,1,2,3,4,5]
									],
									['Test that, when a matcher matches no values of a range source, then an empty array is returned',
										[6,Uize.returnFalse],
										[]
									],

							/*** test support for matcher ***/
								_matcherTest ('retain'),

								/*** test when no matcher is specified ***/
									['Test that, when no matcher is specified, all elements of an array source are retained',
										[['','hey','','there','foo','','','bar']],
										['','hey','','there','foo','','','bar']
									],
									['Test that, when no matcher is specified, all properties of an object source are retained',
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],
									['Test that, when no matcher is specified, all values of a range source are retained',
										5,
										[0,1,2,3,4]
									],

								/*** test when true is specified for matcher ***/
									['Test that, when the value true is specified for the matcher, all elements of an array source are retained',
										[
											['','hey','','there','foo','','','bar'],
											true
										],
										['','hey','','there','foo','','','bar']
									],
									['Test that, when the value true is specified for the matcher, all properties of an object source are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											true
										],
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],
									['Test that, when the value true is specified for the matcher, all values of a range source are retained',
										[5,true],
										[0,1,2,3,4]
									],

								/*** test when false is specified for matcher ***/
									['Test that, when the value false is specified for the matcher, no elements of an array source are retained',
										[
											['','hey','','there','foo','','','bar'],
											false
										],
										[]
									],
									['Test that, when the value false is specified for the matcher, no properties of an object source are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											false
										],
										{}
									],
									['Test that, when the value false is specified for the matcher, no values of a range source are iterated over',
										[5,false],
										[]
									],

								/*** test when null is specified for matcher ***/
									['Test that, when the value null is specified for the matcher, all elements of an array source are retained',
										[
											['','hey','','there','foo','','','bar'],
											true
										],
										['','hey','','there','foo','','','bar']
									],
									['Test that, when the value null is specified for the matcher, all properties of an object source are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											true
										],
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],
									['Test that, when the value null is specified for the matcher, all values of a range source are retained',
										[5,true],
										[0,1,2,3,4]
									],

								/*** test when undefined is specified for matcher ***/
									['Test that, when the value undefined is specified for the matcher, all elements of an array source are retained',
										[
											['','hey','','there','foo','','','bar'],
											true
										],
										['','hey','','there','foo','','','bar']
									],
									['Test that, when the value undefined is specified for the matcher, all properties of an object source are retained',
										[
											{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
											true
										],
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'}
									],
									['Test that, when the value undefined is specified for the matcher, all values of a range source are retained',
										[5,true],
										[0,1,2,3,4]
									],

								/*** test when regular expression is specified for matcher ***/
									['Test that, when a regular expression is specified for the matcher, only elements of an array source whose values match the regular expression are retained',
										[
											['boo','1234','hey','hi42','6','number 6',''],
											/^\d+$/
										],
										['1234','6']
									],
									['Test that, when a regular expression is specified for the matcher, only properties of an object source whose values match the regular expression are retained',
										[
											{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
											/^\d+$/
										],
										{prop0:'1234',prop3:'6'}
									],
									['Test that, when a regular expression is specified for the matcher, only values of a range source that match the regular expression are retained',
										[100,/^\d*1$/],
										[1,11,21,31,41,51,61,71,81,91]
									],

							/*** test support for the maxMatches parameter ***/
								['Test that specifying the value 0 for the maxMatches parameter results in no elements of an array source being retained, even if there are matches',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										0
									],
									[]
								],
								['Test that specifying a negative value for the maxMatches parameter results in no elements of an array source being retained, even if there are matches',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										-10
									],
									[]
								],
								['Test that specifying a non-zero number for the maxMatches parameter that is lower than the number of actual matches results in only the specified maximum number of matches being retained from a source array',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										2
									],
									['hey','there']
								],
								['Test that specifying a number for the maxMatches parameter that is higher than the number of actual matches in a source array results in all matching elements being retained',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										10
									],
									['hey','there','foo','bar']
								],
								['Test that specifying the value null for the maxMatches parameter results in it being defaulted to Infinity',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										null
									],
									['hey','there','foo','bar']
								],
								['Test that specifying the value undefined for the maxMatches parameter results in it being defaulted to Infinity',
									[
										['','hey','','there','foo','','','bar'],
										function (_value) {return !!_value},
										undefined
									],
									['hey','there','foo','bar']
								],

							/*** test support for target parameter ***/
								_targetTestForRemoveOrRetainMethod ('retain')
						],
						null,
						{cloneArguments:true}
					],
					['Uize.Data.Matches.count',[
						/*** test support for different types of sources ***/
							_sourceTest ('count'),
							['Test that, when the source is an array, the number of matching elements is returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value}
								],
								4
							],
							['Test that, when the source is an object, the number of matching properties is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value}
								],
								4
							],
							['Test that, when the source is a range, the number of matching values in the range is returned',
								[
									5,
									function (_value) {return _value % 2}
								],
								2
							],

						/*** test support for matcher ***/
							_matcherTest ('count'),

							/*** test when no matcher is specified ***/
								['Test that, when no matcher is specified, all elements of an array source are counted',
									[['','hey','','there','foo','','','bar']],
									8
								],
								['Test that, when no matcher is specified, all properties of an object source are counted',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									8
								],
								['Test that, when no matcher is specified, all values of a range source are counted',
									5,
									5
								],

							/*** test when true is specified for matcher ***/
								['Test that, when the value true is specified for the matcher, all elements of an array source are counted',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									8
								],
								['Test that, when the value true is specified for the matcher, all properties of an object source are counted',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									8
								],
								['Test that, when the value true is specified for the matcher, all values of a range source are counted',
									[5,true],
									5
								],

							/*** test when false is specified for matcher ***/
								['Test that, when the value false is specified for the matcher, no elements of an array source are counted',
									[
										['','hey','','there','foo','','','bar'],
										false
									],
									0
								],
								['Test that, when the value false is specified for the matcher, no properties of an object source are counted',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										false
									],
									0
								],
								['Test that, when the value false is specified for the matcher, no values of a range source are iterated over',
									[5,false],
									0
								],

							/*** test when null is specified for matcher ***/
								['Test that, when the value null is specified for the matcher, all elements of an array source are counted',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									8
								],
								['Test that, when the value null is specified for the matcher, all properties of an object source are counted',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									8
								],
								['Test that, when the value null is specified for the matcher, all values of a range source are counted',
									[5,true],
									5
								],

							/*** test when undefined is specified for matcher ***/
								['Test that, when the value undefined is specified for the matcher, all elements of an array source are counted',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									8
								],
								['Test that, when the value undefined is specified for the matcher, all properties of an object source are counted',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									8
								],
								['Test that, when the value undefined is specified for the matcher, all values of a range source are counted',
									[5,true],
									5
								],

							/*** test when regular expression is specified for matcher ***/
								['Test that, when a regular expression is specified for the matcher, only elements of an array source whose values match the regular expression are counted',
									[
										['boo','1234','hey','hi42','6','number 6',''],
										/^\d+$/
									],
									2
								],
								['Test that, when a regular expression is specified for the matcher, only properties of an object source whose values match the regular expression are counted',
									[
										{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
										/^\d+$/
									],
									2
								],
								['Test that, when a regular expression is specified for the matcher, only values of a range source that match the regular expression are counted',
									[100,/^\d*1$/],
									10
								],

						/*** test that method returns numbers of matches ***/
							['Test that, when there are matches, the number of matches is returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value}
								],
								4
							],
							['Test that, when there are no matches, the value 0 is returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return _value == 'bat'}
								],
								0
							],

						/*** test support for matcher expression string ***/
							['Test that a matcher expression string is supported',
								[['','hey','','there','foo','','','bar'],'!value'],
								4
							],
							['Test that the index of each element for an array source is provided to a matcher expression',
								[['','hey','','there','foo','','','bar'],'key > 2'],
								5
							],
							['Test that the key of each property for an object source is provided to a matcher expression',
								[{foo0:1,bar0:1,bar1:1,foo1:1,bar2:1},'key.slice (0,3) == "foo"'],
								2
							],

						/*** miscellaneous tests ***/
							{
								title:'Test that unassigned elements of an array source are observed',
								test:function () {
									return this.expect (
										8,
										Uize.Data.Matches.count (
											_getArrayWithUnassignedElements (),
											function (_value) {return _value === undefined}
										)
									)
								}
							},

						/*** test support for the maxMatches parameter ***/
							['Test that specifying the value 0 for the maxMatches parameter produces the result 0, even if there are matches',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value},
									0
								],
								0
							],
							['Test that specifying a negative value for the maxMatches parameter produces the result 0, even if there are matches',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value},
									-10
								],
								0
							],
							['Test that specifying a non-zero number for the maxMatches parameter that is lower than the number of actual matches results in the maxMatches value being returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value},
									2
								],
								2
							],
							['Test that specifying a number for the maxMatches parameter that is higher than the number of actual matches results in the number of matches being returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value},
									10
								],
								4
							],
							['Test that specifying the value null for the maxMatches parameter results in it being defaulted to Infinity',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value},
									null
								],
								4
							],
							['Test that specifying the value undefined for the maxMatches parameter results in it being defaulted to Infinity',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value},
									undefined
								],
								4
							]
					]],
					['Uize.Data.Matches.keys',[
						/*** test support for different types of sources ***/
							_sourceTest ('keys'),
							['Test that, when the source is an array, the indexes of matching elements are returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value}
								],
								[1,3,4,7]
							],
							['Test that, when the source is an object, the keys of matching properties are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value}
								],
								['prop1','prop3','prop4','prop7']
							],
							['Test that, when the source is a range, the indexes of matching values in the range are returned',
								[
									5,
									function (_value) {return _value % 2}
								],
								[1,3]
							],

						/*** test support for matcher ***/
							_matcherTest ('keys'),

							/*** test when no matcher is specified ***/
								['Test that, when no matcher is specified, all indexes of an array source are returned',
									[['','hey','','there','foo','','','bar']],
									[0,1,2,3,4,5,6,7]
								],
								['Test that, when no matcher is specified, all keys of an object source are returned',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7']
								],
								['Test that, when no matcher is specified, all keys of a range source are returned',
									5,
									[0,1,2,3,4]
								],

							/*** test when true is specified for matcher ***/
								['Test that, when the value true is specified for the matcher, all indexes of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									[0,1,2,3,4,5,6,7]
								],
								['Test that, when the value true is specified for the matcher, all keys of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7']
								],
								['Test that, when the value true is specified for the matcher, all keys of a range source are returned',
									[5,true],
									[0,1,2,3,4]
								],

							/*** test when false is specified for matcher ***/
								['Test that, when the value false is specified for the matcher, no indexes of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										false
									],
									[]
								],
								['Test that, when the value false is specified for the matcher, no keys of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										false
									],
									[]
								],
								['Test that, when the value false is specified for the matcher, no keys of a range source are iterated over',
									[5,false],
									[]
								],

							/*** test when null is specified for matcher ***/
								['Test that, when the value null is specified for the matcher, all indexes of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									[0,1,2,3,4,5,6,7]
								],
								['Test that, when the value null is specified for the matcher, all keys of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7']
								],
								['Test that, when the value null is specified for the matcher, all keys of a range source are returned',
									[5,true],
									[0,1,2,3,4]
								],

							/*** test when undefined is specified for matcher ***/
								['Test that, when the value undefined is specified for the matcher, all indexes of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									[0,1,2,3,4,5,6,7]
								],
								['Test that, when the value undefined is specified for the matcher, all keys of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									['prop0','prop1','prop2','prop3','prop4','prop5','prop6','prop7']
								],
								['Test that, when the value undefined is specified for the matcher, all keys of a range source are returned',
									[5,true],
									[0,1,2,3,4]
								],

							/*** test when regular expression is specified for matcher ***/
								['Test that, when a regular expression is specified for the matcher, only indexes of an array source whose values match the regular expression are returned',
									[
										['boo','1234','hey','hi42','6','number 6',''],
										/^\d+$/
									],
									[1,4]
								],
								['Test that, when a regular expression is specified for the matcher, only keys of an object source\'s properties whose values match the regular expression are returned',
									[
										{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
										/^\d+$/
									],
									['prop0','prop3']
								],
								['Test that, when a regular expression is specified for the matcher, only keys for the values of a range source that match the regular expression are returned',
									[100,/^\d*1$/],
									[1,11,21,31,41,51,61,71,81,91]
								],

						/*** test support for maxMatches parameter ***/
							['Test that, when the value for the maxMatches parameter is greater than the number of matches, the keys for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									10
								],
								['prop1','prop3','prop4','prop7']
							],
							['Test that, when the value for the maxMatches parameter is less than the number of matches, the keys for the specified maximum number of matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									3
								],
								['prop1','prop3','prop4']
							],
							['Test that, when the value Infinity is specified for the maxMatches parameter, the keys for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									Infinity
								],
								['prop1','prop3','prop4','prop7']
							],
							['Test that, when the value null is specified for the maxMatches parameter, the keys for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									null
								],
								['prop1','prop3','prop4','prop7']
							],
							['Test that, when the value undefined is specified for the maxMatches parameter, the keys for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									undefined
								],
								['prop1','prop3','prop4','prop7']
							],
							['Test that, when the value 0 is specified for the maxMatches parameter, an array of zero length is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									0
								],
								[]
							],
							['Test that, when a negative value is specified for the maxMatches parameter, an array of zero length is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									0
								],
								[]
							]
					]],
					['Uize.Data.Matches.values',[
						/*** test support for different types of sources ***/
							_sourceTest ('values'),
							['Test that, when the source is an array, the values of matching elements are returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value}
								],
								['hey','there','foo','bar']
							],
							['Test that, when the source is an object, the values of matching properties are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value}
								],
								['hey','there','foo','bar']
							],
							['Test that, when the source is a range, the matching values in the range are returned',
								[
									5,
									function (_value) {return _value % 2}
								],
								[1,3]
							],

						/*** test support for matcher ***/
							_matcherTest ('values'),

							/*** test when no matcher is specified ***/
								['Test that, when no matcher is specified, all values of an array source are returned',
									[['','hey','','there','foo','','','bar']],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when no matcher is specified, all values of an object source are returned',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									['','hey','','there','foo','','','bar']
								],
								['Test that, when no matcher is specified, all values of a range source are returned',
									5,
									[0,1,2,3,4]
								],

							/*** test when true is specified for matcher ***/
								['Test that, when the value true is specified for the matcher, all values of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when the value true is specified for the matcher, all values of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when the value true is specified for the matcher, all values of a range source are returned',
									[5,true],
									[0,1,2,3,4]
								],

							/*** test when false is specified for matcher ***/
								['Test that, when the value false is specified for the matcher, no values of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										false
									],
									[]
								],
								['Test that, when the value false is specified for the matcher, no values of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										false
									],
									[]
								],
								['Test that, when the value false is specified for the matcher, no values of a range source are iterated over',
									[5,false],
									[]
								],

							/*** test when null is specified for matcher ***/
								['Test that, when the value null is specified for the matcher, all values of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when the value null is specified for the matcher, all values of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when the value null is specified for the matcher, all values of a range source are returned',
									[5,true],
									[0,1,2,3,4]
								],

							/*** test when undefined is specified for matcher ***/
								['Test that, when the value undefined is specified for the matcher, all values of an array source are returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when the value undefined is specified for the matcher, all values of an object source are returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									['','hey','','there','foo','','','bar']
								],
								['Test that, when the value undefined is specified for the matcher, all values of a range source are returned',
									[5,true],
									[0,1,2,3,4]
								],

							/*** test when regular expression is specified for matcher ***/
								['Test that, when a regular expression is specified for the matcher, only values of an array that match the regular expression are returned',
									[
										['boo','1234','hey','hi42','6','number 6',''],
										/^\d+$/
									],
									['1234','6']
								],
								['Test that, when a regular expression is specified for the matcher, only values of an object source\'s properties that match the regular expression are returned',
									[
										{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
										/^\d+$/
									],
									['1234','6']
								],
								['Test that, when a regular expression is specified for the matcher, only values of a range source that match the regular expression are returned',
									[100,/^\d*1$/],
									[1,11,21,31,41,51,61,71,81,91]
								],

						/*** test support for maxMatches parameter ***/
							['Test that, when the value for the maxMatches parameter is greater than the number of matches, the values for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									10
								],
								['hey','there','foo','bar']
							],
							['Test that, when the value for the maxMatches parameter is less than the number of matches, the values for the specified maximum number of matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									3
								],
								['hey','there','foo']
							],
							['Test that, when the value Infinity is specified for the maxMatches parameter, the values for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									Infinity
								],
								['hey','there','foo','bar']
							],
							['Test that, when the value null is specified for the maxMatches parameter, the values for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									null
								],
								['hey','there','foo','bar']
							],
							['Test that, when the value undefined is specified for the maxMatches parameter, the values for all matches are returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									undefined
								],
								['hey','there','foo','bar']
							],
							['Test that, when the value 0 is specified for the maxMatches parameter, an array of zero length is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									0
								],
								[]
							],
							['Test that, when a negative value is specified for the maxMatches parameter, an array of zero length is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value},
									0
								],
								[]
							]
					]],
					['Uize.Data.Matches.firstKey',[
						/*** test support for different types of sources ***/
							_sourceTest ('firstKey'),
							['Test that, when the source is an array, the index of the first matching element is returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value}
								],
								1
							],
							['Test that, when the source is an object, the key of the first matching property is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value}
								],
								'prop1'
							],
							['Test that, when the source is a range, the index of the first matching value in the range is returned',
								[
									5,
									function (_value) {return _value % 2}
								],
								1
							],

						/*** test support for matcher ***/
							_matcherTest ('firstKey'),
							['Test that, when a matcher matches a property of an object source, the key of the first matching property is returned',
								[
									{foo1:'hello',hello:'bar1',foo2:'bar2',foo3:'bar3'},
									function (_value,_key) {return _key.slice (0,3) == 'foo' && _value.slice (0,3) == 'bar'}
								],
								'foo2'
							],
							['Test that, when a matcher doesn\'t match any properties of an object source, the value undefined is returned',
								[
									{foo1:'hello',hello:'bar1',foo2:'bar2',foo3:'bar3'},
									function () {return false}
								],
								undefined
							],
							['Test that a matcher expression string is supported',
								[
									{foo1:'hello',hello:'bar1',foo2:'bar2',foo3:'bar3'},
									'key.slice (0,3) == "foo" && value.slice (0,3) == "bar"'
								],
								'foo2'
							],

							/*** test when no matcher is specified ***/
								['Test that, when no matcher is specified, the index of the first element of an array source is returned',
									[['','hey','','there','foo','','','bar']],
									0
								],
								['Test that, when no matcher is specified, the key of the first property of an object source is returned',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									'prop0'
								],
								['Test that, when no matcher is specified, the index of the first value of a range source is returned',
									5,
									0
								],

							/*** test when true is specified for matcher ***/
								['Test that, when the value true is specified for the matcher, the index for the first element of an array source is returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									0
								],
								['Test that, when the value true is specified for the matcher, the key of the first property of an object source is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									'prop0'
								],
								['Test that, when the value true is specified for the matcher, the index of the first value of a range source is returned',
									[5,true],
									0
								],

							/*** test when false is specified for matcher ***/
								['Test that, when the value false is specified for the matcher with an array source, the value undefined is returned',
									[
										['','hey','','there','foo','','','bar'],
										false
									],
									undefined
								],
								['Test that, when the value false is specified for the matcher with an object source, the value undefined is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										false
									],
									undefined
								],
								['Test that, when the value false is specified for the matcher with a range source, the value undefined is returned',
									[5,false],
									undefined
								],

							/*** test when null is specified for matcher ***/
								['Test that, when the value null is specified for the matcher, the index of the first element of an array source is returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									0
								],
								['Test that, when the value null is specified for the matcher, the key of the first property of an object source is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									'prop0'
								],
								['Test that, when the value null is specified for the matcher, the index of the first value of a range source is returned',
									[5,true],
									0
								],

							/*** test when undefined is specified for matcher ***/
								['Test that, when the value undefined is specified for the matcher, the index of the first element of an array source is returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									0
								],
								['Test that, when the value undefined is specified for the matcher, the key of the first property of an object source is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									'prop0'
								],
								['Test that, when the value undefined is specified for the matcher, the index of the first value of a range source is returned',
									[5,true],
									0
								],

							/*** test when regular expression is specified for matcher ***/
								['Test that, when a regular expression is specified for the matcher, the index for the first matching element of an array source is returned',
									[
										['boo','1234','hey','hi42','6','number 6',''],
										/^\d+$/
									],
									1
								],
								['Test that, when a regular expression is specified for the matcher, the key for the first maching property is returned',
									[
										{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
										/^\d+$/
									],
									'prop0'
								],
								['Test that, when a regular expression is specified for the matcher, the index for the first matching value of a range source is returned',
									[100,/^\d1$/],
									11
								]
					]],
					['Uize.Data.Matches.firstValue',[
						/*** test support for different types of sources ***/
							_sourceTest ('firstValue'),
							['Test that, when the source is an array, the value of the first matching element is returned',
								[
									['','hey','','there','foo','','','bar'],
									function (_value) {return !!_value}
								],
								'hey'
							],
							['Test that, when the source is an object, the value of the first matching property is returned',
								[
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									function (_value) {return !!_value}
								],
								'hey'
							],
							['Test that, when the source is a range, the first matching value in the range is returned',
								[
									5,
									function (_value) {return _value % 2}
								],
								1
							],

						/*** test support for matcher ***/
							_matcherTest ('firstValue'),
							['Test that, when a matcher matches a property of an object source, the value of the first matching property is returned',
								[
									{foo1:'hello',hello:'bar1',foo2:'bar2',foo3:'bar3'},
									function (_value,_key) {return _key.slice (0,3) == 'foo' && _value.slice (0,3) == 'bar'}
								],
								'bar2'
							],
							['Test that, when a matcher doesn\'t match any properties of an object source, the value undefined is returned',
								[
									{foo1:'hello',hello:'bar1',foo2:'bar2',foo3:'bar3'},
									function () {return false}
								],
								undefined
							],
							['Test that a matcher expression string is supported',
								[
									{foo1:'hello',hello:'bar1',foo2:'bar2',foo3:'bar3'},
									'key.slice (0,3) == "foo" && value.slice (0,3) == "bar"'
								],
								'bar2'
							],

							/*** test when no matcher is specified ***/
								['Test that, when no matcher is specified, the value of the first element of an array source is returned',
									[['','hey','','there','foo','','','bar']],
									''
								],
								['Test that, when no matcher is specified, the value of the first property of an object source is returned',
									{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
									''
								],
								['Test that, when no matcher is specified, the first value of a range source is returned',
									5,
									0
								],

							/*** test when true is specified for matcher ***/
								['Test that, when the value true is specified for the matcher, the value for the first element of an array source is returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									''
								],
								['Test that, when the value true is specified for the matcher, the value of the first property of an object source is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									''
								],
								['Test that, when the value true is specified for the matcher, the first value of a range source is returned',
									[5,true],
									0
								],

							/*** test when false is specified for matcher ***/
								['Test that, when the value false is specified for the matcher with an array source, the value undefined is returned',
									[
										['','hey','','there','foo','','','bar'],
										false
									],
									undefined
								],
								['Test that, when the value false is specified for the matcher with an object source, the value undefined is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										false
									],
									undefined
								],
								['Test that, when the value false is specified for the matcher with a range source, the value undefined is returned',
									[5,false],
									undefined
								],

							/*** test when null is specified for matcher ***/
								['Test that, when the value null is specified for the matcher, the value of the first element of an array source is returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									''
								],
								['Test that, when the value null is specified for the matcher, the value of the first property of an object source is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									''
								],
								['Test that, when the value null is specified for the matcher, the first value of a range source is returned',
									[5,true],
									0
								],

							/*** test when undefined is specified for matcher ***/
								['Test that, when the value undefined is specified for the matcher, the value of the first element of an array source is returned',
									[
										['','hey','','there','foo','','','bar'],
										true
									],
									''
								],
								['Test that, when the value undefined is specified for the matcher, the value of the first property of an object source is returned',
									[
										{prop0:'',prop1:'hey',prop2:'',prop3:'there',prop4:'foo',prop5:'',prop6:'',prop7:'bar'},
										true
									],
									''
								],
								['Test that, when the value undefined is specified for the matcher, the first value of a range source is returned',
									[5,true],
									0
								],

							/*** test when regular expression is specified for matcher ***/
								['Test that, when a regular expression is specified for the matcher, the value for the first matching element of an array source is returned',
									[
										['boo','1234','hey','hi42','6','number 6',''],
										/^\d+$/
									],
									'1234'
								],
								['Test that, when a regular expression is specified for the matcher, the value for the first maching property is returned',
									[
										{prop0:'1234',prop1:'hey',prop2:'hi42',prop3:'6',prop4:'number 6',prop5:''},
										/^\d+$/
									],
									'1234'
								],
								['Test that, when a regular expression is specified for the matcher, the first matching value of a range source is returned',
									[100,/^\d1$/],
									11
								]
					]]
				])
			]
		});
	}
});

