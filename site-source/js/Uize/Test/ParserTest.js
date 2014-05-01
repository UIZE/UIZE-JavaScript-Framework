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
				parserTest:function (_title,_arguments,_expectedInstanceState) {
					return {
						title:_title,
						test:function () {
							var
								_parser = new (Uize.getModuleByName (this.Class.parserClass)),
								_result = true
							;
							_parser.parse.apply (_parser,_arguments);
							for (var _property in _expectedInstanceState) {
								if (
									!(_result = _result && this.expect (_expectedInstanceState [_property],_parser [_property]))
								)
									break;
								;
							}
							return _result;
						}
					};
				},

				serializerTest:function (_title,_instanceState,_expected) {
					return {
						title:_title,
						test:function () {
							var _parser = new (Uize.getModuleByName (this.Class.parserClass));
							Uize.copyInto (_parser,_instanceState);
							return this.expect (_expected,_parser.serialize ());
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

