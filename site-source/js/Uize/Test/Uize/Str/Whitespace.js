/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Whitespace Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
			_inlineWhitespaceChars = [
				'\t',
				'\x0b',
				' ',
				'\f',
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
			_linebreakWhitespaceChars = [
				'\n',
				'\r'
			],
			_whitespaceChars = _inlineWhitespaceChars.concat (_linebreakWhitespaceChars),
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
					]],
					['Uize.Str.Whitespace.hasWhitespace',[
						['A string containing only non-whitespace characters is not considered to have whitespace',
							'foobar',
							false
						],
						['A string that starts with whitespace characters is considered to have whitespace',
							'  \t foobar',
							true
						],
						['A string that ends with whitespace characters is considered to have whitespace',
							'foobar  \t ',
							true
						],
						['A string with whitespace characters in the middle is considered to have whitespace',
							'foo \t bar',
							true
						],
						['A string that is all whitespace characters is considered to have whitespace',
							_whitespaceStr,
							true
						],
						['An empty string is not considered to have whitespace',
							'',
							false
						]
					]],
					['Uize.Str.Whitespace.hasNonWhitespace',[
						['A string containing only non-whitespace characters is considered to have non-whitespace',
							'foobar',
							true
						],
						['A string that starts with non-whitespace characters is considered to have non-whitespace',
							'foobar  \t\n\r',
							true
						],
						['A string that ends with non-whitespace characters is considered to have non-whitespace',
							'  \t\n\rfoobar',
							true
						],
						['A string with non-whitespace characters in the middle is considered to have non-whitespace',
							'  \t\n\rfoobar  \t\n\r',
							true
						],
						['A string that is all whitespace characters is not considered to have non-whitespace',
							_whitespaceStr,
							false
						],
						['An empty string is not considered to have non-whitespace',
							'',
							false
						]
					]],
					['Uize.Str.Whitespace.indexOfWhitespace',[
						['When the source string is empty, the value -1 is returned',
							'',
							-1
						],
						['When the source string contains only non-whitespace characters, the value -1 is returned',
							'foobar',
							-1
						],
						['When the source string starts with whitespace, the value 0 is returned',
							'   foobar',
							0
						],
						['When the source string contains multiple whitespace segments, the index of the first whitespace segment is returned',
							'foo bar baz qux ',
							3
						],
						['When the optional start pos argument is specified, the index of the first whitespace segment after the start pos is returned',
							['foo bar baz qux ',4],
							7
						],
						['When the optional start pos lies in the middle of a whitespace segment, then the start pos value is returned',
							['foo \r\n\t\n \rbar',5],
							5
						],
						['When the optional start pos is less than 0, then the index of the first whitespace character is returned',
							['foo barbazqux ',-100],
							3
						],
						['When the optional start pos argument is specified and there is no whitespace segment after the start pos, then the value -1 is returned',
							['foo barbazqux',4],
							-1
						],
						['When the optional start pos lies after the end of the source string, then the value -1 is returned',
							['foo barbazqux ',100],
							-1
						]
					]],
					['Uize.Str.Whitespace.indexOfNonWhitespace',[
						['When the source string is empty, the value -1 is returned',
							'',
							-1
						],
						['When the source string contains only whitespace characters, the value -1 is returned',
							'  \r\t\n  ',
							-1
						],
						['When the source string starts with a non-whitespace character, the value 0 is returned',
							'foo bar',
							0
						],
						['When the source string ends with a non-whitespace segment, the index of the first character in that segment is returned',
							'        foo',
							8
						],
						['When the source string contains multiple non-whitespace segments, the index of the first non-whitespace character is returned',
							'   foo bar   ',
							3
						],
						['When the optional start pos argument is specified, the index of the first non-whitespace character after the start pos is returned',
							['foo  bar  baz',3],
							5
						],
						['When the optional start pos lies in the middle of a non-whitespace segment, then the start pos value is returned',
							['   foobarbaz   ',8],
							8
						],
						['When the optional start pos is less than 0, then the index of the first non-whitespace character is returned',
							['   foobarbaz   ',-100],
							3
						],
						['When the optional start pos argument is specified and there are no non-whitespace characters after the start pos, then the value -1 is returned',
							['foo  \r\n\t ',3],
							-1
						],
						['When the optional start pos lies after the end of the source string, then the value -1 is returned',
							['foobarbazqux',100],
							-1
						]
					]],
					['Uize.Str.Whitespace.lastIndexOfWhitespace',[
						['When the source string is empty, the value -1 is returned',
							'',
							-1
						],
						['When the source string contains only non-whitespace characters, the value -1 is returned',
							'foobar',
							-1
						],
						['When the source string ends with whitespace, the index of the last character in the string is returned',
							'foobar   ',
							8
						],
						['When the source string contains multiple whitespace segments, the index of the last whitespace character is returned',
							'foo  bar  baz',
							9
						],
						['When the optional start pos argument is specified, the index of the last whitespace segment before the start pos is returned',
							['foo bar baz qux ',10],
							7
						],
						['When the optional start pos lies in the middle of a whitespace segment, then the start pos value is returned',
							['foo \r\n\t\n \rbar',8],
							8
						],
						['When the optional start pos lies after the end of the source string, then the index of the last whitespace character before the end of the string is returned',
							['foo  bar',100],
							4
						],
						['When the optional start pos argument is specified and there is no whitespace segment before the start pos, then the value -1 is returned',
							['foobarbaz qux',8],
							-1
						],
						['When the optional start pos is less than 0, then the value -1 is returned',
							['foo barbazqux ',-100],
							-1
						]
					]],
					['Uize.Str.Whitespace.lastIndexOfNonWhitespace',[
						['When the source string is empty, the value -1 is returned',
							'',
							-1
						],
						['When the source string contains only whitespace characters, the value -1 is returned',
							' \r\n\t\n ',
							-1
						],
						['When the source string ends with non-whitespace, the index of the last character in the string is returned',
							'   foobar',
							8
						],
						['When the source string contains multiple non-whitespace segments, the index of the last non-whitespace character is returned',
							'  foo  bar  ',
							9
						],
						['When the optional start pos argument is specified, the index of the last non-whitespace segment before the start pos is returned',
							['  foo   bar  ',7],
							4
						],
						['When the optional start pos lies in the middle of a non-whitespace segment, then the start pos value is returned',
							['   foobar   ',6],
							6
						],
						['When the optional start pos lies after the end of the source string, then the index of the last non-whitespace character before the end of the string is returned',
							['  foo  bar  ',100],
							9
						],
						['When the optional start pos argument is specified and there is no non-whitespace segment before the start pos, then the value -1 is returned',
							['  \r\n\t  foobar ',5],
							-1
						],
						['When the optional start pos is less than 0, then the value -1 is returned',
							['foo barbazqux ',-100],
							-1
						]
					]]
				]),

				/*** tests for static properties ***/
					Uize.Test.staticPropertyTest ('Uize.Str.Whitespace.inlineWhitespaceCharCodes','object'),
					{
						title:'The Uize.Str.Whitespace.inlineWhitespaceCharCodes static property contains a list of the character codes for all the inline whitespace characters',
						test:function () {
							return this.expect (
								_inlineWhitespaceChars.sort (),
								Uize.map (Uize.Str.Whitespace.inlineWhitespaceCharCodes,'String.fromCharCode (value)').sort ()
							);
						}
					},
					Uize.Test.staticPropertyTest ('Uize.Str.Whitespace.linebreakCharCodes','object'),
					{
						title:'The Uize.Str.Whitespace.linebreakCharCodes static property contains a list of the character codes for all the line break whitespace characters',
						test:function () {
							return this.expect (
								_linebreakWhitespaceChars.sort (),
								Uize.map (Uize.Str.Whitespace.linebreakCharCodes,'String.fromCharCode (value)').sort ()
							);
						}
					}
			]
		});
	}
});

