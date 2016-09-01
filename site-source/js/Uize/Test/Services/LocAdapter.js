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
	required:'Uize.Str.Split',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,

			/*** Variables for Performance Optimization ***/
				_split = _Uize.Str.Split.split
		;

		return _superclass.subclass ({
			staticMethods:{
				wordSplitterTest:function (_cases) {
					var m = this;
					console.log (m.get ('moduleToTest'));
					function _getCaseTest (_case) {
						var
							_caseIsArray = _Uize.isArray (_case),
							_caseTest = _caseIsArray
								? {
									title:_case [0],
									test:function () {
										return this.expect (
											_case [2],
											_split (_case [1],m.getModule ().prototype.wordSplitter,null,'none')
										);
									}
								}
								: _case
						;
						if (!_caseIsArray && _Uize.isArray (_case.test))
							_case.test = _Uize.map (_case.test,_getCaseTest)
						;
						return _caseTest;
					}
					return m.resolve ({
						title:'Word Splitter Test',
						test:_Uize.map (_cases,_getCaseTest)
					});;
				}
			}
		});
	}
});
