/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Flo Class Module
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 70
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Flo= module...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Flo',
	builder:function () {
		var
			_isArray = Uize.isArray,
			_isFunction = Uize.isFunction,
			_arraySlice = [].slice,
			_loopProperties = {isBreakable:true,isContinuable:true}
		;

		/*** Utility Functions ***/
			function _block (_creationFlo,_statements,_properties) {
				return function () {
					var
						_arguments = arguments,
						_argumentsLengthMinus1 = _arguments.length - 1,
						_callback = _arguments [_argumentsLengthMinus1],
						_flo = new _class (_creationFlo,(_callback && _callback.flo) || this),
						_floNext = _flo.floNext = function () {
							arguments.length ? _next.apply (_flo,arguments) : _flo.next ();
						}
					;
					_floNext.flo = _flo;
					_flo.statements = _statements;
					_flo.callback = _callback;
					_properties && Uize.copyInto (_flo,_properties);
					if (_flo.isFunction)
						_flo.arguments = _argumentsLengthMinus1 ? _arraySlice.call (_arguments,0,_argumentsLengthMinus1) : []
					;
					_flo.next ();
					return _flo;
				}
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
						_statement
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

		var
			_undefined,
			_class = function (_creationFlo,_invokationFlo) {
				this.statementNo = -1;
				this.parent = _creationFlo && _creationFlo.constructor == _class
					? _creationFlo
					: _invokationFlo && _invokationFlo.constructor == _class
						? _invokationFlo
						: _undefined
				;
			},
			_instanceStaticMethods = {
				block:function () {
					return _block (this,arguments);
					/*?
						Static Methods
							Uize.Flo.block
								.

						Instance Methods
							block
								Creates a parented block flo that will sequentially execute a set of statements, where any or all of the statements can be either synchronous or asynchronous.
					*/
				},

				if:function () {
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
				},

				for:function (_setup,_test,_updateCount,_iteration) {
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
				},

				forIn:function (_getItems,_iteration) {
					return this.for (
						_getItems,
						function () {
							var _flo = this;
							if (_flo.keyNo == undefined) {
								// do one time initialization
								_flo.keyNo = 0;
								_flo.totalKeys = (_flo.keys = Uize.keys (_flo.items = _flo.result)).length;
							}
							var _doIteration = _flo.keyNo < _flo.totalKeys;
							if (_doIteration)
								_flo.value = _flo.items [_flo.key = _flo.keys [_flo.keyNo]]
							;
							_flo.next (_doIteration);
						},
						function () {this.keyNo++; this.next ()},
						_iteration
					);
				},

				while:function (_test,_iteration) {
					return _block (this,[_test,_ifResultFalseAbortStatement,_iteration,_restartStatement],_loopProperties);
				},

				ongoing:function () {
					return _block (this,_arraySlice.call (arguments,0).concat (_restartStatement),_loopProperties);
				},

				do:function (_iteration,_test) {
					return _block (this,[_iteration,_test,_ifResultFalseAbortStatement,_restartStatement],_loopProperties);
				},

				try:function (_try,_catch) {
					return _block (this,[_block (_flo,[_try],{isTry:true}),_abortStatement,_catch]);
				},

				switch:function () {
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
				},

				call:function () {
					return function (_callback) {
					}
				},

				function:function () {
					return _block (this,arguments,{isFunction:true});
				}
			}
		;

		Uize.copyInto (
			_class,
			_instanceStaticMethods,
			{
				abort:_abortStatement,
				async:function (_function) {
					return function () {
						var
							_this = this,
							_arguments = arguments
						;
						setTimeout (function () {_function.apply (_this,_arguments)},0);
					};
				},
				break:function () {this.break ()},
				breathe:function (duration) {
					return function (next) {setTimeout (next,duration)}
				},
				continue:function () {this.continue ()},
				next:function () {this.next ()}
			}
		);

		Uize.copyInto (
			_class.prototype,
			_instanceStaticMethods,
			{
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

				continue:function () {
					_findApplicableFloUpFloChain (
						this,
						'isContinuable',
						function (_flo) {
							_flo.statementNo = 3; // this is the iteration statement in the foundational for loop, so the next call will take control to the modify count statement
							_flo.next ();
						},
						'Can\'t call continue outside of a continuable flo'
					);
				},

				break:function () {
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

				return:function (_result) {
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
				},

				throw:function (_error) {
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
				}
			}
		);

		return _class;
	}
});

