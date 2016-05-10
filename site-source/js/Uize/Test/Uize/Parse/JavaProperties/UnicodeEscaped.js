/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaProperties.UnicodeEscaped Class
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
		The =Uize.Test.Uize.Parse.JavaProperties.UnicodeEscaped= module defines a suite of unit tests for the =Uize.Parse.JavaProperties.UnicodeEscaped= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaProperties.UnicodeEscaped',
	superclass:'Uize.Test',
	builder:function (_superclass) {
		'use strict';

		var _iso8859Str = Uize.map (256,'String.fromCharCode (key)').join ('');

		/*** Utility Functions ***/
			function _char (_charCode) {
				return String.fromCharCode (_charCode);
			}

		return _superclass.subclass ({
			set:{
				title:'Test for Uize.Parse.JavaProperties.UnicodeEscaped Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaProperties.UnicodeEscaped'),
					Uize.Test.staticMethodsTest ([
						['Uize.Parse.JavaProperties.UnicodeEscaped.to',[
							['An empty string is escaped to an empty string',
								'',
								''
							],
							['When a string that contains no non ISO-8859-1 characters is escaped, the string is returned as is',
								_iso8859Str,
								_iso8859Str
							],
							['When a string being escaped contains a mixture of ISO-8859-1 characters and non ISO-8859-1 characters, only the non ISO-8859-1 characters are escaped',
								_char (317) + _iso8859Str + _char (605) + _char (993) + _iso8859Str + _char (2450),
								'\\u013D' + _iso8859Str + '\\u025D\\u03E1' + _iso8859Str + '\\u0992'
							],
							['When a string being escaped contains only non ISO-8859-1 characters, all characters in the string are escaped',
								_char (317) + _char (605) + _char (993) + _char (2450),
								'\\u013D\\u025D\\u03E1\\u0992'
							],
							['When a custom escaping threshold is specified in the optional encoding options argument, then the custom escaping threshold is respected - characters with character codes below the specified threshold are not escaped, while characters with character codes equal to or greater than the threshold are',
								[_char (192) + _char (193) + _char (194) + _char (195),{escapingThreshold:194}],
								'ÀÁ\\u00C2\\u00C3'
							]
						]],
						['Uize.Parse.JavaProperties.UnicodeEscaped.from',[
							['An empty string is unescaped to an empty string',
								'',
								''
							],
							['When a string that contains no Unicode-escaped characters is unescaped, the string is returned as is',
								_iso8859Str,
								_iso8859Str
							],
							['When a string being unescaped contains a mixture of ISO-8859-1 characters and Unicode-escaped characters, all the Unicode-escaped characters are unescaped',
								'\\u013D' + _iso8859Str + '\\u025D\\u03E1' + _iso8859Str + '\\u0992',
								_char (317) + _iso8859Str + _char (605) + _char (993) + _iso8859Str + _char (2450)
							],
							['When a string being unescaped contains only Unicode-escaped characters, all characters in the string are unescaped',
								'\\u013D\\u025D\\u03E1\\u0992',
								_char (317) + _char (605) + _char (993) + _char (2450)
							]
						]]
					])
				]
			}
		});
	}
});

