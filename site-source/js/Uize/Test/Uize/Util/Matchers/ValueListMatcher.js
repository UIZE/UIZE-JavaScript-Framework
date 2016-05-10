/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Matchers.ValueListMatcher Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Util.Matchers.ValueListMatcher= module defines a suite of unit tests for the =Uize.Util.Matchers.ValueListMatcher= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Matchers.ValueListMatcher',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Matchers.ValueListMatcher Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Matchers.ValueListMatcher'),
				Uize.Test.staticMethodsTest ([
					['Uize.Util.Matchers.ValueListMatcher.resolve',[
						/* NOTE:
							all the behaviors of this method are effectively tested by testing the test static method
						*/
					]],
					['Uize.Util.Matchers.ValueListMatcher.test',[
						/*** test support for specifying a value list as a pipe-delimited string ***/
							['When the value being tested is contained in a list of values specified as a pipe-delimited string, the value true is returned',
								['bar','foo|bar|baz'],
								true
							],
							['When the value being tested is not contained in a list of values specified as a pipe-delimited string, the value false is returned',
								['qux','foo|bar|baz'],
								false
							],
							['Testing a value against a list of values specified as a pipe-delimited string is case-sensitive',
								['FOO','foo|bar|baz'],
								false
							],
							['When a list of values is specified as a pipe-delimited string, then a value being tested may be the name of a built-in JavaScript method (e.g. toString), and the lookup object used to implement the matcher will not accidentally match such values',
								['toString','foo|bar|baz'],
								false
							],

							/*** test support for whitespace padding around values ***/
								['The first value in a list of values specified as a pipe-delimited string may have whitespace padding around it',
									['foo','  foo  |bar|baz'],
									true
								],
								['A middle value in a list of values specified as a pipe-delimited string may have whitespace padding around it',
									['bar','foo|  bar  |baz'],
									true
								],
								['The last value in a list of values specified as a pipe-delimited string may have whitespace padding around it',
									['baz','foo|bar|  baz  '],
									true
								],
								['Since whitespace padding around values in a list of values specified as a pipe-delimited string is ignored, values being tested may not contain whitespace padding',
									['  bar  ','foo|  bar  |baz'],
									false
								],

							/*** test support for optional enclosing square brackets ***/
								/*** test support for variations on the open square bracket ***/
									['The first value in a list of values specified as a pipe-delimited string may be preceded by an optional open square bracket',
										['foo','[foo|bar|baz]'],
										true
									],
									['The first value in a list of values specified as a pipe-delimited string may be preceded by an optional open square bracket and whitespace padding',
										['foo','[  foo|bar|baz]'],
										true
									],
									['The first value in a list of values specified as a pipe-delimited string may be preceded by whitespace padding and an optional open square bracket',
										['foo','  [foo|bar|baz]'],
										true
									],
									['The first value in a list of values specified as a pipe-delimited string may be preceded by whitespace padding, an optional open square bracket, and whitespace padding',
										['foo','  [  foo|bar|baz]'],
										true
									],

								/*** test support for variations on the close square bracket ***/
									['The last value in a list of values specified as a pipe-delimited string may be followed by an optional close square bracket',
										['baz','[foo|bar|baz]'],
										true
									],
									['The last value in a list of values specified as a pipe-delimited string may be followed by whitespace padding and an optional close square bracket',
										['baz','[foo|bar|baz  ]'],
										true
									],
									['The last value in a list of values specified as a pipe-delimited string may be followed by an optional close square bracket and whitespace padding',
										['baz','[foo|bar|baz]  '],
										true
									],
									['The last value in a list of values specified as a pipe-delimited string may be followed by whitespace padding, an optional close square bracket, and whitespace padding',
										['baz','[foo|bar|baz  ]  '],
										true
									],

						/*** test support for specifying a value list array ***/
							['When the value being tested is contained in a list of values specified as a values array, the value true is returned',
								['bar',['foo','bar','baz']],
								true
							],
							['When the value being tested is not contained in a list of values specified as a values array, the value false is returned',
								['qux',['foo','bar','baz']],
								false
							],
							['Testing a value against a list of values specified as a values array is case-sensitive',
								['FOO',['foo','bar','baz']],
								false
							],
							['When a list of values is specified as a values array, then whitespace padding in values is significant and not ignored',
								['bar',['foo','  bar  ','baz']],
								false
							],
							['When a list of values is specified as a values array, then a value being tested that has whitespace padding will match against a value in the values array that has identical padding',
								['  bar  ',['foo','  bar  ','baz']],
								true
							],
							['When a list of values is specified as a values array, then a value being tested may be the name of a built-in JavaScript method (e.g. toString), and the lookup object used to implement the matcher will not accidentally match such values',
								['toString',['foo','bar','baz']],
								false
							],

						/*** test support for specifying a value lookup object ***/
							['When the value being tested is defined with a truthy value in a value lookup object, the value true is returned',
								['bar',{foo:1,bar:1,baz:1}],
								true
							],
							['When the value being tested is defined with a falsy value in a value lookup object, the value false is returned',
								['bar',{foo:1,bar:0,baz:1}],
								false
							],
							['When the value being tested is not defined in a value lookup object, the value false is returned',
								['qux',{foo:1,bar:1,baz:1}],
								false
							],
							['Testing a value against a value lookup object is case-sensitive',
								['FOO',{foo:1,bar:1,baz:1}],
								false
							],
							['When a value list matcher is specified as a value lookup object, then whitespace padding in values is significant and not ignored',
								['bar',{foo:1,'  bar  ':1,baz:1}],
								false
							],
							['When a value list matcher is specified as a value lookup object, then a value being tested that has whitespace padding will match against a value in the value lookup object that has identical padding',
								['  bar  ',{foo:1,'  bar  ':1,baz:1}],
								true
							],
							['When a value list matcher is specified as a value lookup object, then a value being tested may be the name of a built-in JavaScript method (e.g. toString), and the lookup object used to implement the matcher will not accidentally match such values',
								['toString',{foo:1,bar:1,baz:1}],
								false
							],

						/*** test support for specifying a matcher regular expression ***/
							['When the value being tested is matched by a value list matcher specified as a regular expression, the value true is returned',
								['bar',/^(foo|bar|baz)$/],
								true
							],
							['When the value being tested is not matched by a value list matcher specified as a regular expression, the value false is returned',
								['qux',/^(foo|bar|baz)$/],
								false
							],

						/*** test support for specifying a matcher function ***/
							['When a value list matcher specified as a matcher function returns true, the value true is returned',
								['bar',Uize.returnTrue],
								true
							],
							['When a value list matcher specified as a matcher function returns false, the value false is returned',
								['bar',Uize.returnFalse],
								false
							],
							{
								title:'When a value list matcher is specified as a matcher function, then that function is passed the value being tested as its only argument',
								test:function () {
									var
										_valueBeingTested = 'foo',
										_argumentPassed,
										_totalArgumentsPassed
									;
									Uize.Util.Matchers.ValueListMatcher.test (
										_valueBeingTested,
										function (_value) {
											_argumentPassed = _value;
											_totalArgumentsPassed = arguments.length;
										}
									);
									return (
										this.expect (1,_totalArgumentsPassed) &&
										this.expect (_valueBeingTested,_argumentPassed)
									);
								}
							},

						/*** miscellaneous tests ***/
							['When the value null is specified for the value list matcher, the value true is always returned',
								['foo',null],
								true
							],
							['When the value undefined is specified for the value list matcher, the value true is always returned',
								['foo',undefined],
								true
							]
					]]
				])
			]
		});
	}
});

