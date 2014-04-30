/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.TagOrAttributeName Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Parse.Xml.TagOrAttributeName= module defines a suite of unit tests for the =Uize.Parse.Xml.TagOrAttributeName= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.TagOrAttributeName',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.TagOrAttributeName'},

			set:{
				title:'Test for Uize.Parse.Xml.TagOrAttributeName Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.TagOrAttributeName'),
					{
						title:'A tag or attribute name can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'An empty strings fails parsing as a tag/attribute name',
								'',
								'',
								false
							),
							Uize.Test.ParserTest.parserTest (
								'A string fails parsing as a tag/attribute name if the first character is not a valid tag/attribute name start character',
								'0img',
								'',
								false
							),
							Uize.Test.ParserTest.parserTest (
								'A string is successfully parsed as a tag/attribute name if its first character is a valid tag/attribute name start character',
								'_###',
								'_',
								true
							),
							Uize.Test.ParserTest.parserTest (
								'All characters, following the initial start character, that are valid tag/attribute name continuation characters are included in the parse tag/attribute name',
								'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789###',
								'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789',
								true
							),
							Uize.Test.ParserTest.parserTest (
								'When the value specified for the optional starting index starts the parser at a valid tag start character, then parsing succeeds',
								'%%% img',
								'img',
								true,
								4
							),
							Uize.Test.ParserTest.parserTest (
								'When the value specified for the optional starting index starts the parser at a non-valid tag start character, then parsing fails',
								'img %%%',
								'',
								false,
								3
							)
						]
					},
					{
						title:'Arguments passed to the parser object\'s constructor are used for initial parsing during construction',
						test:function () {
							var
								_classPrototype = Uize.Parse.Xml.TagOrAttributeName.prototype,
								_parse = _classPrototype.parse,
								_actualParseSource,
								_actualParseIndex
							;
							_classPrototype.parse = function (_source,_index) {
								_actualParseSource = _source;
								_actualParseIndex = _index;
							};
							var _parser = new Uize.Parse.Xml.TagOrAttributeName ('foo',10);
							_classPrototype.parse = _parse;
							return this.expect ('foo',_actualParseSource) && this.expect (10,_actualParseIndex);
						}
					}
				]
			}
		});
	}
});

