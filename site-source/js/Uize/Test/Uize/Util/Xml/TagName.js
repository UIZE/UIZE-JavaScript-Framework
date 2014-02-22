/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Xml.TagName Class
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
		The =Uize.Test.Uize.Util.Xml.TagName= module defines a suite of unit tests for the =Uize.Util.Xml.TagName= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Xml.TagName',
	builder:function () {
		'use strict';

		function _parserTest (_title,_sourceStr,_expectedParsedSegment,_expectedIsValid,_index) {
			_index = _index || 0;
			return {
				title:_title,
				test:function () {
					var _parser = new Uize.Util.Xml.TagName;
					_parser.parse (_sourceStr,_index);
					return (
						this.expect (_expectedParsedSegment,_parser.name) &&
						this.expect (_expectedParsedSegment.length,_parser.length) &&
						this.expect (_expectedIsValid,_parser.isValid)
					);
				}
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Xml.TagName Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Xml.TagName'),
				{
					title:'Test that the parser works correctly',
					test:[
						_parserTest (
							'Test that an empty strings fails parsing as a tag name',
							'',
							'',
							false
						),
						_parserTest (
							'Test that a string fails parsing as a tag name if the first character is not a valid tag name start character',
							'0img',
							'',
							false
						),
						_parserTest (
							'Test that a string is successfully parsed as a tag name if its first character is a valid tag name start character',
							'_:::',
							'_',
							true
						),
						_parserTest (
							'Test that all characters, following the initial start character, that are valid tag name continuation characters are included in the parse tag name',
							'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789:::',
							'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789',
							true
						),
						_parserTest (
							'Test that, when the value specified for the optional starting index starts the parser at a valid tag start character, then parsing succeeds',
							'%%% img',
							'img',
							true,
							4
						),
						_parserTest (
							'Test that, when the value specified for the optional starting index starts the parser at a non-valid tag start character, then parsing fails',
							'img %%%',
							'',
							false,
							3
						)
					]
				},
				{
					title:'Test that arguments passed to the parser object\'s constructor are used for initial parsing during construction',
					test:function () {
						var
							_classPrototype = Uize.Util.Xml.TagName.prototype,
							_parse = _classPrototype.parse,
							_actualParseSource,
							_actualParseIndex
						;
						_classPrototype.parse = function (_source,_index) {
							_actualParseSource = _source;
							_actualParseIndex = _index;
						};
						var _parser = new Uize.Util.Xml.TagName ('foo',10);
						_classPrototype.parse = _parse;
						return this.expect ('foo',_actualParseSource) && this.expect (10,_actualParseIndex);
					}
				}
			]
		});
	}
});

