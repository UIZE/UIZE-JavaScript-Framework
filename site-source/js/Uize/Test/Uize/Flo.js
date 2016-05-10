/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Flo Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 2
	codeCompleteness: 2
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Flo= module defines a suite of unit tests for the =Uize.Flo= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Flo',
	builder:function () {
		'use strict';

		function _asyncPushActualAndNext (_actual,_toPush) {
			return function (_next) {
				setTimeout (
					function () {
						_actual.push (_toPush);
						_next ();
					},
					0
				);
			};
		}

		function _syncPushActualAndNext (_actual,_toPush) {
			return function (_next) {
				_actual.push (_toPush);
				_next ();
			};
		}

		function _async (_function) {
			return function () {
				var
					m = this,
					_arguments = arguments
				;
				setTimeout (function () {_function.apply (m,_arguments)},0);
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Flo Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Flo'),
				Uize.Test.staticMethodsTest ([
					['Uize.Flo.block',[
						{
							title:'Statements of a block are executed in the order in which they are declared, when all statements execute asynchronously',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','c'],
									_actual = []
								;
								Uize.Flo.block (
									_asyncPushActualAndNext (_actual,'a'),
									_asyncPushActualAndNext (_actual,'b'),
									_asyncPushActualAndNext (_actual,'c')
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						},
						{
							title:'Statements of a block are executed in the order in which they are declared, when all statements execute synchronously',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','c'],
									_actual = []
								;
								Uize.Flo.block (
									_syncPushActualAndNext (_actual,'a'),
									_syncPushActualAndNext (_actual,'b'),
									_syncPushActualAndNext (_actual,'c')
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						},
						{
							title:'Test that nested blocks are supported correctly',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','A','B','1','2','C','c'],
									_actual = []
								;
								Uize.Flo.block (
									_asyncPushActualAndNext (_actual,'a'),
									_asyncPushActualAndNext (_actual,'b'),
									Uize.Flo.block (
										_asyncPushActualAndNext (_actual,'A'),
										_asyncPushActualAndNext (_actual,'B'),
										Uize.Flo.block (
											_asyncPushActualAndNext (_actual,'1'),
											_asyncPushActualAndNext (_actual,'2')
										),
										_asyncPushActualAndNext (_actual,'C')
									),
									_asyncPushActualAndNext (_actual,'c')
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						},
						{
							title:'In a block of only synchronous statements, all statements are executed synchronously and no asynchronous breaks are introduced',
							test:function () {
								var
									_expected = ['a','b','c'],
									_actual = []
								;
								Uize.Flo.block (
									_syncPushActualAndNext (_actual,'a'),
									_syncPushActualAndNext (_actual,'b'),
									_syncPushActualAndNext (_actual,'c')
								) ();
								return this.expect (_expected,_actual);
							}
						}
					]],
					['Uize.Flo.abort',[
						{
							title:'Test aborting from a block',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b'],
									_actual = []
								;
								Uize.Flo.block (
									_asyncPushActualAndNext (_actual,'a'),
									_asyncPushActualAndNext (_actual,'b'),
									function (_next) {setTimeout (function () {_next.flo.abort ()},0)},
									_asyncPushActualAndNext (_actual,'c')
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						}
					]],
					['Uize.Flo.if',[
						{
							title:'Test that synchronous statements are handled correctly',
							test:[
								{
									title:'Test a basic if, where the statements are synchronous and the condition is false',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('if'); _next ()}
										) ();
										return this.expect ([],_statementsExecuted);
									}
								},
								{
									title:'Test a basic if, where the statements are synchronous and the condition is true',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (true)},
											function (_next) {_statementsExecuted.push ('if'); _next ()}
										) ();
										return this.expect (['if'],_statementsExecuted);
									}
								},
								{
									title:'Test an if-else, where the statements are synchronous and the condition is false',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('if'); _next ()},
											function (_next) {_statementsExecuted.push ('else'); _next ()}
										) ();
										return this.expect (['else'],_statementsExecuted);
									}
								},
								{
									title:'Test an if-else, where the statements are synchronous and the condition is true',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (true)},
											function (_next) {_statementsExecuted.push ('if'); _next ()},
											function (_next) {_statementsExecuted.push ('else'); _next ()}
										) ();
										return this.expect (['if'],_statementsExecuted);
									}
								},
								{
									title:'Test an if-then-elseif, where the statements are synchronous and the first condition is false and the elseif condition is also false',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('if'); _next ()},
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('else-if'); _next ()}
										) ();
										return this.expect ([],_statementsExecuted);
									}
								},
								{
									title:'Test an if-then-elseif, where the statements are synchronous and the first condition is false and the elseif condition is true',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('if'); _next ()},
											function (_next) {_next (true)},
											function (_next) {_statementsExecuted.push ('else-if'); _next ()}
										) ();
										return this.expect (['else-if'],_statementsExecuted);
									}
								},
								{
									title:'Test an if-then-elseif-else, where the statements are synchronous and the first condition is false and the elseif condition is also false',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('if'); _next ()},
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('else-if'); _next ()},
											function (_next) {_statementsExecuted.push ('else'); _next ()}
										) ();
										return this.expect (['else'],_statementsExecuted);
									}
								},
								{
									title:'Test an if-then-elseif-else, where the statements are synchronous and the first condition is false and the elseif condition is true',
									test:function () {
										var _statementsExecuted = [];
										Uize.Flo ['if'] (
											function (_next) {_next (false)},
											function (_next) {_statementsExecuted.push ('if'); _next ()},
											function (_next) {_next (true)},
											function (_next) {_statementsExecuted.push ('else-if'); _next ()},
											function (_next) {_statementsExecuted.push ('else'); _next ()}
										) ();
										return this.expect (['else-if'],_statementsExecuted);
									}
								}
							]
						},
						{
							title:'Test that asynchronous statements are handled correctly',
							test:[
								{
									title:'Test a basic if, where the statements are asynchronous and the condition is false',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()})
										) (
											function () {_next (m.expect ([],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test a basic if, where the statements are asynchronous and the condition is true',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (true)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()})
										) (
											function () {_next (m.expect (['if'],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test an if-else, where the statements are asynchronous and the condition is false',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()}),
											_async (function (_next) {_statementsExecuted.push ('else'); _next ()})
										) (
											function () {_next (m.expect (['else'],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test an if-else, where the statements are asynchronous and the condition is true',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (true)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()}),
											_async (function (_next) {_statementsExecuted.push ('else'); _next ()})
										) (
											function () {_next (m.expect (['if'],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test an if-then-elseif, where the statements are asynchronous and the first condition is false and the elseif condition is also false',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()}),
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('else-if'); _next ()})
										) (
											function () {_next (m.expect ([],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test an if-then-elseif, where the statements are asynchronous and the first condition is false and the elseif condition is true',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()}),
											_async (function (_next) {_next (true)}),
											_async (function (_next) {_statementsExecuted.push ('else-if'); _next ()})
										) (
											function () {_next (m.expect (['else-if'],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test an if-then-elseif-else, where the statements are asynchronous and the first condition is false and the elseif condition is also false',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()}),
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('else-if'); _next ()}),
											_async (function (_next) {_statementsExecuted.push ('else'); _next ()})
										) (
											function () {_next (m.expect (['else'],_statementsExecuted))}
										);
									}
								},
								{
									title:'Test an if-then-elseif-else, where the statements are asynchronous and the first condition is false and the elseif condition is true',
									test:function (_next) {
										var
											m = this,
											_statementsExecuted = []
										;
										Uize.Flo ['if'] (
											_async (function (_next) {_next (false)}),
											_async (function (_next) {_statementsExecuted.push ('if'); _next ()}),
											_async (function (_next) {_next (true)}),
											_async (function (_next) {_statementsExecuted.push ('else-if'); _next ()}),
											_async (function (_next) {_statementsExecuted.push ('else'); _next ()})
										) (
											function () {_next (m.expect (['else-if'],_statementsExecuted))}
										);
									}
								}
							]
						}
					]],
					['Uize.Flo.switch',[
					]],
					['Uize.Flo.breathe',[
					]],
					['Uize.Flo.do',[
						{
							title:'Test that a do loop where the statements are asynchronous is handled correctly',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','c','d','e','f','g'],
									_actual = [],
									_items = _expected.concat ()
								;
								Uize.Flo ['do'] (
									_async (function (_next) {_actual.push (_items.shift ()); _next ();}),
									_async (function (_next) {_next (_items.length)})
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						},
						{
							title:'Test that a do loop where the statements are synchronous is handled correctly',
							test:function () {
								var
									m = this,
									_expected = ['a','b','c','d','e','f','g'],
									_actual = [],
									_items = _expected.concat ()
								;
								Uize.Flo ['do'] (
									function (_next) {_actual.push (_items.shift ()); _next ();},
									function (_next) {_next (_items.length)}
								) ();
								return m.expect (_expected,_actual);
							}
						}
					]],
					['Uize.Flo.while',[
						{
							title:'Test that a while loop where the statements are asynchronous is handled correctly',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','c','d','e','f','g'],
									_actual = [],
									_items = _expected.concat ()
								;
								Uize.Flo ['while'] (
									_async (function (_next) {_next (_items.length)}),
									_async (function (_next) {_actual.push (_items.shift ()); _next ();})
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						},
						{
							title:'Test that a while loop where the statements are synchronous is handled correctly',
							test:function () {
								var
									m = this,
									_expected = ['a','b','c','d','e','f','g'],
									_actual = [],
									_items = _expected.concat ()
								;
								Uize.Flo ['while'] (
									function (_next) {_next (_items.length)},
									function (_next) {_actual.push (_items.shift ()); _next ();}
								) ();
								return m.expect (_expected,_actual);
							}
						}
					]],
					['Uize.Flo.for',[
						{
							title:'Test that a for loop where the statements are asynchronous is handled correctly',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','c','d','e','f','g'],
									_actual = [],
									_itemNo,
									_items = _expected.concat ()
								;
								Uize.Flo ['for'] (
									_async (function (_next) {_itemNo = 0; _next ()}),
									_async (function (_next) {_next (_itemNo < _items.length)}),
									_async (function (_next) {_itemNo++; _next ()}),
									_async (function (_next) {_actual.push (_items [_itemNo]); _next ()})
								) (
									function () {
										_next (m.expect (_expected,_actual));
									}
								);
							}
						},
						{
							title:'Test that a for loop where the statements are synchronous is handled correctly',
							test:function () {
								var
									m = this,
									_expected = ['a','b','c','d','e','f','g'],
									_actual = [],
									_itemNo,
									_items = _expected.concat ()
								;
								Uize.Flo ['for'] (
									function (_next) {_itemNo = 0; _next ()},
									function (_next) {_next (_itemNo < _items.length)},
									function (_next) {_itemNo++; _next ()},
									function (_next) {_actual.push (_items [_itemNo]); _next ()}
								) ();
								return m.expect (_expected,_actual);
							}
						}
					]],
					['Uize.Flo.forEach',[
					]],
					['Uize.Flo.ongoing',[
						{
							title:'Test that an ongoing loop can be terminated with an internal break',
							test:function (_next) {
								var
									m = this,
									_items = ['a','b','c','d','e','f','g'],
									_actual = []
								;
								Uize.Flo.ongoing (
									_async (
										function (_next) {
											_actual.push (_items.shift ());
											_next ();
										}
									),
									_async (function (_next) {_actual.length == 4 ? _next.flo ['break'] () : _next ()})
								) (
									function () {
										_next (m.expect (['a','b','c','d'],_actual));
									}
								);
							}
						},
						{
							title:'When an ongoing loop contains only synchronous statements, the entire loop is executed synchronously',
							test:function () {
								var
									_items = ['a','b','c','d','e','f','g'],
									_actual = []
								;
								Uize.Flo.ongoing (
									function (_next) {
										_actual.push (_items.shift ());
										_next ();
									},
									function (_next) {_actual.length == 4 ? _next.flo ['break'] () : _next ()}
								) ();
								return this.expect (['a','b','c','d'],_actual);
							}
						},
						{
							title:'Test that an ongoing loop can be terminated by calling break on the flo reference that would be accessible externally',
							test:function (_next) {
								var
									m = this,
									_items = ['a','b','c','d','e','f','g'],
									_actual = [],
									_flo = Uize.Flo.ongoing (
										_async (
											function (_next) {
												_actual.push (_items.shift ());
												_next ();
											}
										),
										_async (function (_next) {_actual.length == 4 ? _flo ['break'] () : _next ()})
									) (
										function () {
											_next (m.expect (['a','b','c','d'],_actual));
										}
									)
								;
							}
						}
					]],
					['Uize.Flo.forIn',[
						{
							title:'Test that a forIn loop where the statements are asynchronous is handled correctly',
							test:function (_next) {
								var
									m = this,
									_source = {foo:'bar',hello:'world'},
									_actualKeyNos = [],
									_actualKeys = [],
									_actualValues = []
								;
								Uize.Flo.forIn (
									_async (function (_next) {_next (_source)}),
									_async (
										function (_next) {
											_actualKeyNos.push (this.keyNo);
											_actualKeys.push (this.key);
											_actualValues.push (this.value);
											_next ();
										}
									)
								) (
									function () {
										_next (
											m.expect ([0,1],_actualKeyNos) &&
											m.expect (['foo','hello'],_actualKeys) &&
											m.expect (['bar','world'],_actualValues)
										);
									}
								);
							}
						},
						{
							title:'Test that a forIn loop where the statements are synchronous is handled correctly',
							test:function () {
								var
									m = this,
									_source = {foo:'bar',hello:'world'},
									_actualKeyNos = [],
									_actualKeys = [],
									_actualValues = []
								;
								Uize.Flo.forIn (
									function (_next) {_next (_source)},
									function (_next) {
										_actualKeyNos.push (this.keyNo);
										_actualKeys.push (this.key);
										_actualValues.push (this.value);
										_next ();
									}
								) ();
								return (
									m.expect ([0,1],_actualKeyNos) &&
									m.expect (['foo','hello'],_actualKeys) &&
									m.expect (['bar','world'],_actualValues)
								);
							}
						}
					]],
					['Uize.Flo.break',[
					]],
					['Uize.Flo.continue',[
					]],
					['Uize.Flo.next',[
					]],
					['Uize.Flo.function',[
					]],
					['Uize.Flo.call',[
					]],
					['Uize.Flo.try',[
					]]
				]),
				{
					title:'Test the instance methods',
					test:[
						{
							title:'Test that the continue instance method works correctly',
							test:[
								/*
									- test that the continue instance method works correctly for a do loop
									- test that the continue instance method works correctly for a while loop
									- test that the continue instance method works correctly for a for loop
									- test that the continue instance method works correctly for a forIn loop
								*/
							]
						}
					]
				},
				{
					title:'Test breathing features',
					test:[
						{
							title:'When breathing is enabled, asynchronous breaks are introduced between all statements in a block of synchronous statements',
							test:function (_next) {
								var
									m = this,
									_expected = ['a','b','c'],
									_actual = []
								;
								Uize.Flo.block (
									_syncPushActualAndNext (_actual,'a'),
									_syncPushActualAndNext (_actual,'b'),
									_syncPushActualAndNext (_actual,'c')
								) ({
									breatheAfter:0,
									callback:function () {
										_next (
											m.expect (['a'],_actualImmediatelyAfterFloInvokation) &&
											m.expect (_expected,_actual)
										);
									}
								});
								var _actualImmediatelyAfterFloInvokation = _actual.concat ();
							}
						}
					]
				}
			]
		});
	}
});

