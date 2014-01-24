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

		function _parserTest (_title,_sourceStr,_expectedParsedSegment,_index) {
			_index = _index || 0;
			return {
				title:_title,
				test:function () {
					var _parser = new Uize.Util.Xml.TagName;
					_parser.parse (_sourceStr);
					return (
						this.expect (_expectedParsedSegment,_parser.tagName) &&
						this.expect (_expectedParsedSegment.length,_parser.length) &&
						this.expect (!!_expectedParsedSegment,_parser.isValid)
					);
				}
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Xml.TagName Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Xml.TagName'),
				{
					title:'',
					test:[
						_parserTest (
							'Test that a string fails parsing as a tag name if the first character is not a valid tag name start character',
							'0img',
							''
						),
						_parserTest (
							'Test that a string is successfully parsed as a tag name if its first character is a valid tag name start character',
							'_:::',
							'_'
						),
						_parserTest (
							'Test that all characters, following the initial start character, that are valid tag name continuation characters are included in the parse tag name',
							'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789:::',
							'__abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789'
						)
					]
				}
			]
		});
	}
});

