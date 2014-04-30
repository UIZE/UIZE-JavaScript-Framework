/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.ParserTest Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.ParserTest= module defines a base class for parser test classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.ParserTest',
	superclass:'Uize.Test',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				parserTest:function (_title,_sourceStr,_expectedParsedSegment,_expectedIsValid,_index) {
					_index = _index || 0;
					return {
						title:_title,
						test:function () {
							var _parser = new (Uize.getModuleByName (this.Class.parserClass));
							_parser.parse (_sourceStr,_index);
							return (
								//this.expect (_expectedParsedSegment,_parser.name) &&
								this.expect (_expectedParsedSegment.length,_parser.length) &&
								this.expect (_expectedIsValid,_parser.isValid)
							);
						}
					};
				}
			},

			staticProperties:{
				parserClass:null  // this should be overridden by subclasses
			}
		});
	}
});

