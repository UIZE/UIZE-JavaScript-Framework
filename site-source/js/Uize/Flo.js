/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Flo Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 70
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Flo= module...

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
			The =Uize.Flo= module offers a number of unique features that sets it apart from many other async libraries.

			- *Supports Familiar Control Flow Constructs* - Unlike most async libraries, Flo supports familiar control flow constructs, with the ability to break from loop flos and return from "function" flos. Flo also supports multi-stage (a)synchronous if and switch conditional flos.
			- *Supports Mixed Synchronous and Asynchronous Execution* - Unlike many async libraries that expect functions to be asynchronous (or even worse, force all synchronous execution to become asynchronous), Flo lets synchronous and asynchronous execution mix harmoniously, even allowing functions to dynamically be either synchronous or asynchronous, or to change between synchronous and asynchronous as an application evolves over time.
			- *Has the Ability to Breathe* - Flo implements an innovative feature that allows us to configure a threshold for how long execution should remain synchronous before taking a "breath" by introducing an asynchronous interruption.
			- *Uses Regular Old Callbacks* - Unlike many other async libraries, Flo does not use promises or deferreds - just plain old callbacks - sweet and simple.
			- *Works on Client and Server* - Flo works just as well in NodeJS as it does in a browser, so you can safely use it in code that might be executed on either side of the client-server divide.
			- *No Compilation Required* - You don't need to set up any code pre-compilation process on a server, or anything like that, in order to use Flo in parts of your code - just require it and use it.
			- *Works in Older Browsers* - Flo doesn't rely upon the features of newer versions of JavaScript, such as the =yield= statement, in order to work its magic. That means that your code using Flo can even run in IE7 (see `A Note on Older Browsers`).
			- *Unifies Error Handling*
			- *A Small Module* - The =Uize.Flo= module is relatively small for what it provides, at around 2K scrunched and gzipped.

		### An Example
			.

		A Note on Older Browsers
			Because the =Uize.Flo= module provides methods for creating (a)synchronous control flow structures that are equivalent to JavaScript's built-in control flow structures, many of the methods are named after reserved words.

			For example, the Flo equivalent of a =for= loop can be set up using the =Uize.Flo.for= method. This is not a problem in browsers that support ES5 (ECMAScript version 5) or later, but it will be a problem in some older browsers like IE8 and earlier. Because this restriction is going away, it was decided to not avoid this issue by coming up with different names for the methods (like some weird prefix character or uppercasing) but, instead, to rely on property name quoting for cases where older browser support is desired.

			SAFE ONLY IN ES5 AND LATER
			.........................
			Uize.Flow.for (
				setupStatementFUNC,
				testStatementFUNC,
				advanceStatementFUNC,
				iterationStatementFUNC
			);
			.........................

			SAFE FOR ALL
			.........................
			Uize.Flow ['for'] (
				setupStatementFUNC,
				testStatementFUNC,
				advanceStatementFUNC,
				iterationStatementFUNC
			);
			.........................

			NOTES
			- If you're using Flo inside an environment like NodeJS, then this is not an issue that you need to worry about.
			- If you're writing your code in CoffeeScript, this issue is detected and the naked reserved word property names are automatically "clothed" in quotes for you when your code is compiled to JavaScript.

	### In-depth
		Basic Terminology
			Flo Construct
				A flo construct is a control flow construct that supports mixed synchronous/asynchronous execution.

				Examples of flo constructs are blocks, loops, and conditional branches. Flo constructs are built from zero or more `flo statements`.

			Flo Construct Method
				A flo construct method is a method that creates a `flo instance generator` for a specific type of `flo construct`.

				For example, the =flo.for= method is a flo construct method that creates a generator for instances of the for loop `flo construct`.

			Flo Instance Generator
				A flo instance generator is a function that, when called, creates a new `flo instance` and starts it running.

			Flo Instance
				A flo instance is a specific instance of execution of a `flo construct`.

				A flo instance is created by calling a `flo instance generator` and manages execution of the `flo statements` for the `flo construct`.

			Flo Statement ~~ Flo Statements
				A flo construct is built from zero or more flo statements.

		Different Types of Flos
			Block Flo
				The block flow is the most basic type of flo and is the building block for all other types flo types.

				The block flo is most analagous to a statement block in synchronous coding. A block is essentially a set of `flo statements` that is executed sequentially. Once all flo statements in a block have been executed, the callback for the block is called, which may be the continuation function for a parent block (see `Flos Can Have Children`).

				Blocks Can be Aborted
					.

				Any Statement Can be Substituted by a Block
					Since the signature of a block is identical to the signature of a `flo statement`, any statement can be substituted by a block.

				Blocks Can be Nested
					.

				Flos Are Composable
					The signature of a block flo is identical to the signature of a `flo statement`, which means that blocks (all types) are inherently composable.

					It may at first seem counterintuitive that the =flo.for= method returns a function, for instance, and that you have to call that function it in order to run the loop. A more typical alternative, found in some other asynchronous libraries, is to have the asynchronous control flow methods execute their action immediately upon being called, but this makes composition a little more tedious. It also doesn't lend itself as well to allowing a control flow to be handed off to others to be invoked multiple times (possibly concurrently). Once again, you can still do this with these libraries, but it requires a bit more wrapper code.

					ONE APPROACH
					...
					someLibrary.while (
						testFunction,
						iterationFunction,
						callback
					)
					...

					THE FLO APPROACH
					...
					flo.while (
						testFunction,
						iterationFunction
					) (callback)
					...

					Sequenced Nested
						ONE APPROACH
						...
						someLibrary.sequence (
							function (next) {
								someLibrary.while (testFunction,iterationFunction,next);
							},
							function (next) {
								someLibrary.while (testFunction,iterationFunction,next);
							},
							callback
						)
						...

						THE FLO APPROACH
						...
						flo.block (
							flo.while (testFunction,iterationFunction),
							flo.while (testFunction,iterationFunction)
						) (callback)
						...

				An Undefined Statement is Skipped
					.

				Literal Result Statements
					.

				Flo Statement ~~ Flo Statements
					The atomic unit of a flo is a flo statement.

					How Flo Statements are Called
						.

						With Flo Instance as Context
							.

						The Continuation Function
							.

						Function Flo First Statement
							.

			Loop Flos
				The flo library provides the basic looping control flow constructs that programmers will be familiar with.

				The basic library doesn't aim to dramatically expand the types of looping constructs available - it is the intention that other extension / plug-in libraries might provide more exotic looping constructs for other types of applications.

				The flo library provides the following methods for creating the most basic, tried and tested looping constructs...

				- =do= - create a do...while loop flo invoker
				- =for= - create a for loop flo invoker
				- =forIn= - create a for...in loop flo invoker
				- =forEach= - create a foreach loop flo invoker
				- =ongoing= - create an ongoing loop flo invoker (like a while-true type loop)
				- =while= - create a while loop flo invoker

				Breakable
					All of the looping constructs provided in the flo library are breakable.

					The way that flo works, you can break a loop (like an (a)synchronous while loop) from anywhere inside a deeply nested child flo, simply by calling the break method on the child flo object. The end result is exactly what you would expect from a normal, synchronous while loop - the loop is terminated and flow continues at the next statement after the loop.

					Consider the following example...

					...
					flo.while (
						function () {},
						function () {}
					);
					...

				I Can Has "While True"?
					Yes, you most certainly can has "while true".

					......................................................
					var items = ['foo','bar','baz','qux','hello','world'];
					function getAnotherItemAsync (callback) {
						setTimeout (function () {
							callback (items.shift ());
						}, 100);
					}

					flo.while (
						true,
						function (next) {
							getAnotherItemAsync (function (item) {
								if (item == undefined) {
									return next.flo.break ();
								}
								console.log (item);
								next ();
							});
						}
					) (function () {
						console.log ('ran out of items');
					});
					......................................................

					...or...

					.........................................
					flo.ongoing (function (next) {
						getAnotherItemAsync (function (item) {
							if (item == undefined) {
								return next.flo.break ();
							}
							console.log (item);
							next ();
						});
					}) (function () {
						console.log ('ran out of items');
					});
					.........................................

				Externally Breakable
					.

				Storing Loop State
					.

			Function Flos
				.

				- =function= - create a function flo

				Receiving Arguments in a Function Flo
					Function Flo First Statement
						.

				Returning from a Function Flo
					.

					Returning a Result
						.

						Passing the Result in the Return
							.

						Setting the Result Via Continuation
							.

					Calling a Function Flo
						.

			Conditional Flos
				.

				- =if= - create a multi-stage if...then...elseif...then...else... flo
				- =switch= - create a multi-case switch flo

			More About Flos
				Flos are Repeatable
					.

				Flos are Composable
					.

				Flos Can Run Concurrently
					.

				Flos are Multi-instantiable
					.

				Flos Can Have Children
					.

		Overview of the Methods
			Flo Creation Methods
				.

				- =block= -
				- =do= -
				- =for= -
				- =forIn= -
				- =function= -
				- =while= -

			Control Flow Methods
				.

				- =abort= -
				- =break= -
				- =continue= -
				- =next= -
				- =return= -

				Call Methods on the Current Flo
					.

					Current Flo Accessible on Continuation Function
						.

				Return on Control Flow Methods, Unless Last to Execute
					.

			Flo Error Handling Methods
				.

				- =try=
				- =throw=

		Advanced Topics
			Mixing Synchronous and Asynchronous
				.

			Learning How to Breathe
				.

			Flo Parenting
				.

			Error Handling
				Throwing and Catching Errors
					.

			Storing Flo State
				Using the flo Object
					.

				Using a Closure
					.
*/

Uize.module ({
	name:'Uize.Flo',
	superclass:'Uize.Oop.BasicClass',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,

			/*** Variables for Performance Optimization ***/
				_isArray = Uize.isArray,
				_isFunction = Uize.isFunction,

			/*** General Variables ***/
				_arraySlice = [].slice,
				_loopProperties = {isBreakable:true,isContinuable:true},
				_sacredEmptyObject = {},
				_isFloClass = function () {}
		;

		/*** Utility Functions ***/
			function _isFloInstance (_object) {
				return _object && _object.constructor._isFloClass == _isFloClass;
			}

			function _block (_creationFlo,_statements,_properties) {
				var _floInvoker = function () {
					var
						_arguments = arguments,
						_argumentsLengthMinus1 = _arguments.length - 1,
						_lastArgument = _arguments [_argumentsLengthMinus1],
						_invokationProperties = !_lastArgument
							? _sacredEmptyObject
							: Uize.isPlainObject (_lastArgument)
								? _lastArgument
								: {callback:_lastArgument}
						,
						_callback = _invokationProperties.callback,
						_flo = new (_isFloInstance (_creationFlo) ? _creationFlo.Class : _creationFlo) (
							_creationFlo,(_callback && _callback.flo) || this
						),
						_floNext = _flo.floNext = function () {
							arguments.length ? _next.apply (_flo,arguments) : _flo.next ();
						}
					;
					_floNext.flo = _flo;
					_flo.statements = _statements;
					_flo.callback = _callback;
					_flo.breathe =
						(
							'breatheAfter' in _floInvoker || 'breatheFor' in _floInvoker ||
							'breatheAfter' in _invokationProperties || 'breatheFor' in _invokationProperties
						)
						? Uize.copy (_floInvoker,_invokationProperties,{lastBreath:Uize.now ()})
						: _flo.parent && _flo.parent.breathe
					;
					_properties && Uize.copyInto (_flo,_properties);
					if (_flo.isFunction)
						_flo.arguments = _argumentsLengthMinus1 ? _arraySlice.call (_arguments,0,_argumentsLengthMinus1) : []
					;
					_flo.next ();
					return _flo;
				};
				return _floInvoker;
			}

			function _forInOrEach (_creationFlo,_getItems,_iteration,_eachStyle) {
				return _creationFlo ['for'] (
					_getItems,
					function () {
						var _flo = this;
						if (_flo.keyNo == undefined) { // do one time initialization
							var
								_items = _flo.items = _flo.result,
								_itemsIsArray = _flo.itemsIsArray = _eachStyle && Uize.isArray (_items)
							;
							_flo.totalKeys = _itemsIsArray ? _items.length : (_flo.keys = Uize.keys (_items)).length;
							_flo.keyNo = 0;
						}
						var _doIteration = _flo.keyNo < _flo.totalKeys;
						if (_doIteration)
							_flo.value = _flo.items [_flo.key = _flo.itemsIsArray ? _flo.keyNo : _flo.keys [_flo.keyNo]]
						;
						_flo.next (_doIteration);
					},
					function () {this.keyNo++; this.next ()},
					_iteration
				);
			}

			function _next (_result) {
				var _flo = this;
				if (arguments.length)
					_flo.result = _result
				;
				_flo.isSynchronous = true;
				if (!_flo.inNext) {
					var
						_statements = _flo.statements,
						_statement,
						_breathe = _flo.breathe
					;
					if (_breathe)
						_breathe.lastBreath = Uize.now ()
					;
					_flo.inNext = true;
					while (_flo.isSynchronous) {
						_flo.isSynchronous = false;
						if (++_flo.statementNo >= _statements.length) {
							_flo.callback && (_flo.isFunction ? _flo.callback (_flo.result) : _flo.callback ());
						} else {
							_statement = _statements [_flo.statementNo];
							var
								_statementIsUndefined = _statement === _undefined,
								_statementIsFunction = !_statementIsUndefined && _isFunction (_statement),
								_statementIsArray = !_statementIsUndefined && !_statementIsFunction && _isArray (_statement)
							;
							if (_statementIsFunction || _statementIsArray) {
								if (_statementIsArray)
									_statement = _block (_flo,_statement)
								;
								_flo.isFunction && !_flo.statementNo && _flo.arguments.length
									? _statement.apply (_flo,_flo.arguments.concat (_flo.floNext))
									: _statement.call (_flo,_flo.floNext)
								;
							} else {
								if (!_statementIsUndefined)
									_flo.result = _statement
								;
								_flo.isSynchronous = true;
							}
						}
						if (_flo.isSynchronous) {
							if (_breathe && Uize.since (_breathe.lastBreath) >= (_breathe.breatheAfter || 0)) {
								_flo.isSynchronous = false;
								setTimeout (_flo.floNext,_breathe.breatheFor || 0);
							}
						}
					}
					_flo.inNext = false;
				}
			}

			function _findApplicableFloUpFloChain (_flo,_flagName,_action,_error) {
				while (_flo) {
					if (_flo [_flagName]) {
						_action (_flo);
						break;
					} else {
						_flo.statementNo = Infinity;
						_flo = _flo.parent;
					}
				}
				if (!_flo && _error)
					throw _resolveError (_error)
				;
			}

			/*** reusable block statements (they don't need deeper closure flo, so put them here) ***/
				function _abortStatement () {
					this.abort ();
				}

				function _goToSecondStepStatement () {
					this.statementNo = 0;
					this.next ();
				}

				function _ifResultFalseAbortStatement () {
					this.result ? this.next () : this.abort ();
				}

				function _restartStatement () {
					this.statementNo = -1;
					this.next ();
				}

				function _resolveError (_error) {
					return typeof _error == 'string' ? new Error (_error) : _error;
				}

				function _skipTwoIfResultFalseStatement () {
					if (!this.result) this.statementNo += 2;
					this.next ();
				}

				function _stashSwitchExpressionResultStatement () {
					this.switchExpressionResult = this.result;
					this.result = false;
					this.next ();
				}

				function _handleCaseExpressionResultStatement () {
					(this.result = this.result == this.switchExpressionResult) || this.statementNo++;
					this.next ();
				}

				function _skipTwoIfResultTrueStatement () {
					if (this.result) this.statementNo += 2;
					this.next ();
				}

		return _superclass.subclass ({
			constructor:function (_creationFlo,_invokationFlo) {
				this.statementNo = -1;
				this.parent = _isFloInstance (_creationFlo)
					? _creationFlo
					: _isFloInstance (_invokationFlo)
						? _invokationFlo
						: _undefined
				;
			},

			instanceMethods:{
				abort:function () {
					this.statementNo = Infinity;
					this.next ();
					/*?
						Instance Methods
							abort
								Aborts execution of the `flo statements` in the flo on which the method is called.

								SYNTAX
								.....................
								floInstance.abort ();
								.....................

								EXAMPLE
								...
								...
					*/
				},

				next:_next,
					/*?
						Instance Methods
							next
								Continues execution of the flo on which the method is called, optionally passing back a result value.

								DIFFERENT USAGES

								`Advance to the Next Statement`
								............
								flo.next ();
								............

								`Advance to the Next Statement, Passing a Result Value`
								.........................
								flo.next (resultANYTYPE);
								.........................
					*/

				'continue':function () {
					_findApplicableFloUpFloChain (
						this,
						'isContinuable',
						function (_flo) {
							_flo.statementNo = 3; // this is the iteration statement in the foundational for loop, so the next call will take control to the modify count statement
							_flo.next ();
						},
						'Can\'t call continue outside of a continuable flo'
					);
					/*?
						Instance Methods
							continue
								.

								SYNTAX
								................
								flo.continue ();
								................

								NOTES
								- see also the related =break= instance method
					*/
				},

				'break':function () {
					_findApplicableFloUpFloChain (
						this,
						'isBreakable',
						function (_flo) {_flo.abort ()},
						'Can\'t call break outside of a breakable flo'
					);
					/*?
						Instance Methods
							break
								Breaks execution of the nearest loop up the flo chain.

								SYNTAX
								.....................
								floInstance.break ();
								.....................

								EXAMPLE
								...
								flo.forIn (
									fs.dir,
									function (next) {
										if (next.flo.value) {
											next.flo.break ();
										}
									}
								) (function () {console.log ('finished with asynchronous for')});
								...

								Must be Within a Loop or Switch Flo
									If the =break= method is called on a flo and there is no breakable flo up the parent chain, then an error will be thrown.

									A breakable flo is defined as either a loop flo (created by methods like =do=, =for=, =forIn=, and =while=) or a switch flow (created by the =switch= method).

									EXAMPLE
									...
									...
					*/
				},

				'return':function (_result) {
					var _arguments = arguments;
					_findApplicableFloUpFloChain (
						this,
						'isFunction',
						function (_flo) {
							if (_arguments.length) _flo.result = _result;
							_flo.abort ();
						},
						'Can\'t call return outside of a function flo'
					);
					/*?
						Instance Methods
							return
								Returns from the nearest function flo up the flo chain.

								DIFFERENT USAGES

								`Return from a Function Flo`
								.............
								flo.return ()
								.............

								Must be Within a Function Flo
									If the =return= method is called on a flo and there is no function flo up the parent chain, then an error will be thrown.

									EXAMPLE
									...
									...
					*/
				},

				'throw':function (_error) {
					_error = _resolveError (_error);
					_findApplicableFloUpFloChain (
						this,
						'isTry',
						function (_flo) {
							_flo = _flo.parent;
							_flo.statementNo = 1; // this is the abort statement between the try and catch in the try-catch block, so the next call will catch the error
							_flo.result = _error;
							_flo.next ();
						},
						_error
					);
					/*?
						Instance Methods
							throw
								.

								SYNTAX
								..........................
								flo.throw (errorSTRorOBJ);
								..........................

								NOTES
								- see also the related =try= instance method
					*/
				}
			},

			staticMethods:{
				abort:_abortStatement,
				async:function (_function) {
					return function () {
						var
							m = this,
							_arguments = arguments
						;
						setTimeout (function () {_function.apply (m,_arguments)},0);
					};
				},
				'break':function () {this ['break'] ()},
				breathe:function (duration) {return function (next) {setTimeout (next,duration)}},
				'continue':function () {this ['continue'] ()},
				next:function () {this.next ()}
			},

			dualContextMethods:{
				block:function () {
					return _block (this,arguments);
					/*?
						Static Methods
							Uize.Flo.block
								.

						Instance Methods
							block
								Creates a parented block flo that will sequentially execute a set of statements, where any or all of the statements can be either synchronous or asynchronous.

								SYNTAX
								............................
								floInvokerFUNC = flo.block (
									statement0FUNC,
									statement1FUNC,
									...,
									statementNFUNC
								);
								............................
					*/
				},

				'if':function () {
					/*
						an if...then...else if...then...else chain can be broken down into three basic types of statements...

						- if / else if: calculate result (delivered via next)
						- then: if result false then skip over next two else next, followed by do and next, followed by abort (unless last then)
						- else: do and next

						examples of chains...

						if...then...
						if...then...else...
						if...then...else if...then...
						if...then...else if...then...else...
						if...then...else if...then...else if...then...
						if...then...else if...then...else if...then...else...

						the type of any statement in the chain is determined according to the following rules...

						- statement is if / else if, if statement is even-numbered (zero-based) and not last statement
						- statement is then, if statement is odd-numbered (zero-based)
						- statement is else, if statement is even-numbered (zero-based) and last statement

						examples of expansions...

						if...then...

						- calculate result
						- if result false, skip over next two
						- do and next

						if...then...else...

						- calculate result
						- if result false, skip over next two
						- do and next
						- abort
						- do and next

						if...then...else if...then...

						- calculate result
						- if result false, skip over next two
						- do and next
						- abort
						- calculate result
						- if result false, skip over next two
						- do and next
					*/
					var _blockStatements = [];
					for (
						var
							_statementNo = -1,
							_statements = arguments,
							_statementsLength = _statements.length
						;
						++_statementNo < _statementsLength;
					) {
						var _statement = _statements [_statementNo];
						if (_statementNo % 2) {
							// statement is odd-numbered (zero-based), so is then
							_blockStatements.push (_skipTwoIfResultFalseStatement,_statement);
							_statementNo < _statementsLength - 1 && _blockStatements.push (_abortStatement);
						} else {
							// statement is even-numbered (zero-based), so is if / else if or else
							_blockStatements.push (_statement);
						}
					}
					return _block (this,_blockStatements);
					/*?
						Instance Methods
							if
								Creates an if flo, with support for an arbitrary number of optional elseif sections and an optional final else statement, and where any or all of the statements can be either synchronous or asynchronous.

								DIFFERENT USAGES

								`Create a Simple if...then Flo`
								.........................
								floInvokerFUNC = flo.if (
									testStatementFUNC,
									thenStatementFUNC
								)
								.........................

								`Create an if...then...else Flo`
								.........................
								floInvokerFUNC = flo.if (
									testStatementFUNC,
									thenStatementFUNC,
									elseStatementFUNC
								)
								.........................

								`Create an if...then...elseif...then Flo`
								...........................
								floInvokerFUNC = flo.if (
									testStatementFUNC,
									thenStatementFUNC,
									elseifTestStatementFUNC,
									elseifThenStatementFUNC
								)
								...........................

								`Create an if...then...elseif...then...else Flo`
								...........................
								floInvokerFUNC = flo.if (
									testStatementFUNC,
									thenStatementFUNC,
									elseifTestStatementFUNC,
									elseifThenStatementFUNC,
									elseStatementFUNC
								)
								...........................

						Static Methods
							Uize.Flo.if
								Same as for the =if= instance method, but creates a `flo invoker` with no imposed parent flo.
					*/
				},

				'for':function (_setup,_test,_updateCount,_iteration) {
					return _block (
						this,
						[
							_setup,
							_test,
							_ifResultFalseAbortStatement,
							_iteration,
							_updateCount,
							_goToSecondStepStatement
						],
						_loopProperties
					);
					/*?
						Instance Methods
							for
								Creates a for flo, where any or all of the setup, test, advance, and iteration statements can be either synchronous or asynchronous.

								SYNTAX
								.........................
								floInvokerFUNC = flo.for (
									setupStatementFUNC,
									testStatementFUNC,
									advanceStatementFUNC,
									iterationStatementFUNC
								)
								.........................

								EXAMPLE
								...
								...

					*/
				},

				forIn:function (_getItems,_iteration) {
					return _forInOrEach (this,_getItems,_iteration);
					/*?
						Instance Methods
							forIn
								SYNTAX
								................................
								floInvokerFUNC = flo.forIn (
									sourceGeneratorStatementFUNC,
									iterationStatementFUNC
								)
								................................

								NOTES
					*/
				},

				forEach:function (_getItems,_iteration) {
					return _forInOrEach (this,_getItems,_iteration,true);
					/*?
						Instance Methods
							forEach
								.

								SYNTAX
								................................
								floInvokerFUNC = flo.while (
									sourceGeneratorStatementFUNC,
									iterationStatementFUNC
								)
								................................

								NOTES
					*/
				},

				'while':function (_test,_iteration) {
					return _block (this,[_test,_ifResultFalseAbortStatement,_iteration,_restartStatement],_loopProperties);
					/*?
						Instance Methods
							while
								.

								SYNTAX
								............................
								floInvokerFUNC = flo.while (
									testStatementFUNC,
									iterationStatementFUNC
								)
								............................
					*/
				},

				ongoing:function () {
					return _block (this,_arraySlice.call (arguments,0).concat (_restartStatement),_loopProperties);
					/*?
						Instance Methods
							ongoing
								Returns a `flo invoker` function for invoking a flo that executes the specified one or more statements in an ongoing loop.

								SYNTAX
								..............................
								floInvokerFUNC = flo.ongoing (
									statement0FUNC,
									statement1FUNC,
									...,
									statementNFUNC
								)
								..............................

								Breaking an Ongoing Loop
									Because an ongoing loop flo has no built-in terminating test step, it is your responsibility to break the loop. This can be done in one of two ways...

									- *internal break* - within any statement of the flo or any sub-flo, the =break= instance method can be called to break the execution of the ongoing loop
									- *external break* - provided that code external to the flo has a reference to the flo or one of its sub-flos, the =break= instance method can be called on such a reference in order to break execution of the ongoing loop

								Beware of Synchronous Ongoing Loops
									.

								You May Want to Breathe
									.
					*/
				},

				'do':function (_iteration,_test) {
					return _block (this,[_iteration,_test,_ifResultFalseAbortStatement,_restartStatement],_loopProperties);
					/*?
						Instance Methods
							do
								Create a =do...while= loop flo

								SYNTAX
								.........................
								floInvokerFUNC = flo.do (
									iterationStatementFUNC
									testStatementFUNC,
								)
								.........................

								EXAMPLE
								...
								...
					*/
				},

				'try':function (_try,_catch) {
					return _block (this,[_block (this,[_try],{isTry:true}),_abortStatement,_catch]);
					/*?
						Instance Methods
							try
								.

								SYNTAX
								..........................
								floInvokerFUNC = flo.try (
									tryStatementFUNC,
									catchStatementFUNC
								);
								..........................

								NOTES
								- see also the related =throw= instance method
					*/
				},

				'switch':function () {
					/*
						- first statement is expression to switch on
						- if an even numbers of statements, then the last statement is the default case
						- every pair of statements after first statement (the switch expression) is a case expression and case matched statement
						- like regular switch, if a case matches, then all the remaining case matched statements are executed until a break occurs
						- switch is breakable
					*/
					var
						_statements = arguments,
						_blockStatements = [
							_statements [0],
							_stashSwitchExpressionResultStatement
						]
					;
					for (
						var _statementNo = -1, _statementsLength = _statements.length;
						(_statementNo += 2) < _statementsLength - 1;
					) {
						_statementNo > 1 && _blockStatements.push (_skipTwoIfResultTrueStatement);
						_blockStatements.push (
							_statements [_statementNo],
							_handleCaseExpressionResultStatement,
							_statements [_statementNo + 1]
						);
					}
					if (_statementNo == _statementsLength - 1) // add the dangling statement (if present) for the default case
						_blockStatements.push (_statements [_statementNo])
					;
					return _block (this,_blockStatements,{isBreakable:true});
					/*?
						Instance Methods
							switch
								Creates a switch flo, with support for an arbitrary number of case sections and an optional default statement, and and where any or all of the statements can be either synchronous or asynchronous.

								SYNTAX
								.............................
								floInvokerFUNC = flo.switch (
									switchExpressionFUNC,

									case0ExpressionFUNC,
									case0StatementFUNC,

									case1ExpressionFUNC,
									case1StatementFUNC,

									...

									caseNExpressionFUNC,
									caseNStatementFUNC,

									defaultStatementFUNC
								)
								.............................

								Breaking from a Switch Flo
									.

							NOTES
							- see also the related =if= instance method
					*/
				},

				call:function () {
					return function (_callback) {
					}
				},

				'function':function () {
					return _block (this,arguments,{isFunction:true});
					/*?
						Instance Methods
							function
								.

								SYNTAX
								...............................
								floInvokerFUNC = flo.function (
									statement0FUNC,
									statement1FUNC,
									...,
									statementNFUNC
								);
								...............................

								NOTES
								- see also the related =return= instance method
					*/
				}
			},

			staticProperties:{
				_isFloClass:_isFloClass
			}
		});
	}
});

