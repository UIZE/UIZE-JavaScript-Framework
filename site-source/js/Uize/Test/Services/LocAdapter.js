/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Services.LocAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Services.LocAdapter= module provides convenience methods for writing unit test modules for localization service adapter modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Services.LocAdapter',
	superclass:'Uize.Test.Class',
	required:[
		'Uize.Str.Split',
		'Uize.Loc.Strings.Metrics'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,

			/*** Variables for Performance Optimization ***/
				_split = _Uize.Str.Split.split
		;

		/*** Utility Functions ***/
			function _getCasesTest (m,_title,_cases,_arrayCaseTestFunctionResolver) {
				function _getCaseTest (_case) {
					var
						_caseIsArray = _Uize.isArray (_case),
						_caseTest = _caseIsArray
							? {
								title:_case [0],
								test:_arrayCaseTestFunctionResolver (_case.slice (1))
							}
							: _case
					;
					if (!_caseIsArray && _Uize.isArray (_case.test))
						_case.test = _Uize.map (_case.test,_getCaseTest)
					;
					return _caseTest;
				}
				return m.resolve ({
					title:_title,
					test:_Uize.map (_cases,_getCaseTest)
				});;
			}

		return _superclass.subclass ({
			staticMethods:{
				wordSplitterTest:function (_cases) {
					var m = this;
					return _getCasesTest (
						m,
						'Word Splitter Test',
						_cases,
						function (_caseArgs) {
							return function () {
								return this.expect (
									_caseArgs [1],
									_split (_caseArgs [0],m.getModule ().prototype.wordSplitter,null,'none')
								);
							}
						}
					);
				},

				tokenRegExpTest:function (_cases) {
					var m = this;
					return _getCasesTest (
						m,
						'Token Regular Expression Test',
						_cases,
						function (_caseArgs) {
							return function () {
								var _tokenRegExp = m.getModule ().prototype.tokenRegExp;
								_tokenRegExp.lastIndex = 0;
								var _match = _tokenRegExp.exec (_caseArgs [0]);
								return (
									_caseArgs [1]
										? (
											this.expect (true,!!_match) &&
											this.expect (_caseArgs [0],_match [0]) &&
											this.expect (_caseArgs [1],Uize.Loc.Strings.Metrics.getTokenNameFromMatch (_match))
										)
										: this.expect (false,!!_match && _caseArgs [0] === _match [0])
								);
							}
						}
					);
				}
			}
		});
	}
});
