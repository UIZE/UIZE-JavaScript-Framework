/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.TagOrAttributeName Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
								'A tag or attribute name may not be an empty string',
								[''],
								{
									name:'',
									length:0,
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag or attribute name must start with a valid character for tag or attribute names',
								['0img'],
								{
									name:'',
									length:0,
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A string is successfully parsed as a tag/attribute name if its first character is a valid tag/attribute name start character',
								['_###'],
								{
									name:'_',
									length:1,
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'All characters, following the initial start character, that are valid tag/attribute name continuation characters are included in the parsed tag/attribute name',
								['__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789###'],
								{
									name:'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789',
									length:65,
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'When the value specified for the optional starting index starts the parser at a valid tag start character, then parsing succeeds',
								['%%% img',4],
								{
									name:'img',
									length:3,
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'When the value specified for the optional starting index starts the parser at a non-valid tag start character, then parsing fails',
								['img %%%',3],
								{
									name:'',
									length:0,
									isValid:false
								}
							)
						]
					},
					{
						title:'Arguments passed to the parser class\'s constructor are used for initial parsing during construction',
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

