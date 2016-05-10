/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Build.Util.Whitespace Class
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
		The =Uize.Test.Uize.Build.Util.Whitespace= module defines a suite of unit tests for the =Uize.Build.Util.Whitespace= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Build.Util.Whitespace',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_stringWithMixedIndentAndLinebreaks =
					'Line 1\n' +
					'	Line 2\r' +
					' Line 3\r\n' +
					'   	Line 4\n'
		;

		return Uize.Test.resolve ({
			title:'Test for Uize.Build.Util.Whitespace Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Build.Util.Whitespace'),
				Uize.Test.staticMethodsTest ([
					['Uize.Build.Util.Whitespace.alterNormalizedWhitespace',[
						/*** test defaulting when the value of the whitespaceOptions parameter is falsy ***/
							['When no whitespaceOptions parameter is specified, then the whitespace characters in the source string are not altered',
								_stringWithMixedIndentAndLinebreaks,
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value undefined is specified for the whitespaceOptions parameter, then the whitespace characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,undefined],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value null is specified for the whitespaceOptions parameter, then the whitespace characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,null],
								_stringWithMixedIndentAndLinebreaks
							],

						/*** test handling of the linebreakChars property when its value is falsy or normal ***/
							['When the linebreakChars property is not specified in the whitespaceOptions object, then the linebreak characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{}],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value undefined is specified for the linebreakChars property in the whitespaceOptions object, then the linebreak characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{linebreakChars:undefined}],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value null is specified for the linebreakChars property in the whitespaceOptions object, then the linebreak characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{linebreakChars:null}],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value "\\n" (a single newline character) is specified for the linebreakChars property in the whitespaceOptions object, then the linebreak characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{linebreakChars:'\n'}],
								_stringWithMixedIndentAndLinebreaks
							],

						/*** test handling of the indentChars property when its value is falsy or normal ***/
							['When the indentChars property is not specified in the whitespaceOptions object, then the indent characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{}],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value undefined is specified for the indentChars property in the whitespaceOptions object, then the indent characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{indentChars:undefined}],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value null is specified for the indentChars property in the whitespaceOptions object, then the indent characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{indentChars:null}],
								_stringWithMixedIndentAndLinebreaks
							],
							['When the value "\\t" (a single tab character) is specified for the indentChars property in the whitespaceOptions object, then the indent characters in the source string are not altered',
								[_stringWithMixedIndentAndLinebreaks,{indentChars:'\t'}],
								_stringWithMixedIndentAndLinebreaks
							],

						/*** test altering either or both of the linebreak and indent characters ***/
							['When just a non-normal linebreak character is specified for the linebreakChars property of the whitespaceOptions object, then just the linebreak characters are altered',
								[
									'Line 1\n' +
									'	Line 2\n' +
									'   Line 3\n' +
									'	   Line 4\n' +
									'	   	Line 5',
									{linebreakChars:'\r\n'}
								],
								'Line 1\r\n' +
								'	Line 2\r\n' +
								'   Line 3\r\n' +
								'	   Line 4\r\n' +
								'	   	Line 5'
							],
							['When just a non-normal indent character sequence is specified for the indentChars property of the whitespaceOptions object, then just the indent characters are altered',
								[
									'Line 1\n' +
									'	Line 2\r' +
									'	Line 3\r\n' +
									'		Line 4\n' +
									'			Line 5',
									{indentChars:'    '}
								],
								'Line 1\n' +
								'    Line 2\r' +
								'    Line 3\r\n' +
								'        Line 4\n' +
								'            Line 5'
							],
							['When both a non-normal linebreak character and a non-normal indent character sequence are specified in the whitespaceOptions object, then both the linebreak and indent characters are altered',
								[
									'Line 1\n' +
									'	Line 2\n' +
									'	Line 3\n' +
									'		Line 4\n' +
									'			Line 5',
									{
										linebreakChars:'\r\n',
										indentChars:'    '
									}
								],
								'Line 1\r\n' +
								'    Line 2\r\n' +
								'    Line 3\r\n' +
								'        Line 4\r\n' +
								'            Line 5'
							]
					]]
				])
			]
		});
	}
});

