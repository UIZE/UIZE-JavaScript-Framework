/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Whitespace Class
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Str.Whitespace= module defines a suite of unit tests for the =Uize.Str.Whitespace= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Whitespace',
	builder:function () {
		'use strict';

		var
			_whitespaceChars = [
				'\t',
				'\n',
				'\x0b',
				' ',
				'\f',
				'\r',
				'\x20',
				'\xa0',
				'\u2000',
				'\u2001',
				'\u2002',
				'\u2003',
				'\u2004',
				'\u2005',
				'\u2006',
				'\u2007',
				'\u2008',
				'\u2009',
				'\u200a',
				'\u200b',
				'\u2028',
				'\u2029',
				'\u3000'
			],
			_whitespaceStr = _whitespaceChars.join ('')
		;

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Whitespace Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Whitespace'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Whitespace.isWhitespace',[
						['A string containing only whitespace characters is considered whitespace',
							_whitespaceStr,
							true
						],
						['A string that is all whitespace characters except for a single non-whitespace character is not considered whitespace',
							'#' + _whitespaceStr,
							false
						],
						['An empty string is not considered whitespace, since it contains no whitespace characters',
							'',
							false
						]
					]],
					['Uize.Str.Whitespace.isNonWhitespace',[
						['A string containing only non-whitespace characters is considered non-whitespace',
							'foobar',
							true
						],
						['A string that is all non-whitespace characters except for a single whitespace character is not considered non-whitespace',
							'foo bar',
							false
						],
						['An empty string is not considered non-whitespace, since it contains no non-whitespace characters',
							'',
							false
						]
					]]
				])
			]
		});
	}
});

