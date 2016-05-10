/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaProperties.PropertyValue Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 60
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Parse.JavaProperties.PropertyValue= module defines a suite of unit tests for the =Uize.Parse.JavaProperties.PropertyValue= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaProperties.PropertyValue',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_asciiCharactersExceptLinebreaks = Uize.map (
					256,
					function (_value,_charCode) {
						var _char = String.fromCharCode (_charCode);
						return _char != '\n' && _char != '\r' && _char != '\\' ? _char : undefined;
					}
				).join ('')
		;

		/*** Utility Functions ***/
			function _char (_charCode) {
				return String.fromCharCode (_charCode);
			}

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.JavaProperties.PropertyValue'},

			set:{
				title:'Test for Uize.Parse.JavaProperties.PropertyValue Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaProperties.PropertyValue'),
					{
						title:'A property value can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A property value may contain ASCII characters',
								[_asciiCharactersExceptLinebreaks],
								{
									value:_asciiCharactersExceptLinebreaks,
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property value may contain spaces',
								['this is a property value'],
								{
									value:'this is a property value',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property value may contain linebreaks and other special whitespace characters, as long as they are expressed using the appropriate escape sequences ("\\b", "\\t", "\\n", "\\f", "\\r")',
								['property\\b\\t\\n\\f\\rvalue'],
								{
									value:'property\b\t\n\f\rvalue',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property value may contain escaped single quotes, double quotes, and backslashes',
								['\\\'\\"\\\\'],
								{
									value:'\'"\\',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property value is terminated by a linebreak character',
								['property value\n not part of the property value'],
								{
									value:'property value',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property value is terminated by a carriage return character',
								['property value\r not part of the property value'],
								{
									value:'property value',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'When a property value contains Unicode-escaped characters, those characters are unescaped',
								['\\u013D-FOO-\\u025D\\u03E1-BAR-\\u0992'],
								{
									value:_char (317) + '-FOO-' + _char (605) + _char (993) + '-BAR-' + _char (2450),
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Whitespace at the end of a property value is preserved',
								['This is a property value   \t\t  \n  not a part of the property value'],
								{
									value:'This is a property value   \t\t  ',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property value can span multiple lines if linebreaks are escaped with a backslash, and leading whitespace on subsequent lines is ignored',
								['foo, \\\n          bar, \\\r    baz, \\\r\n     qux'],
								{
									value:'foo, bar, baz, qux',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'When a property value spans multiple lines, leading whitespace on subsequent lines that spans multiple lines is ignored',
								['foo, \\\n  \r   \r\n  \n  \n        bar'],
								{
									value:'foo, bar',
									isValid:true
								}
							)
						]
					},
					{
						title:'A property value can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A property value that is a single word containing alphabetical characters can be serialized',
								{
									value:'Property',
									isValid:true
								},
								'Property'
							),
							Uize.Test.ParserTest.serializerTest (
								'When a property value contains backspace, tab, linefeed, form feed, carriage return, or backslash characters, those characters are escaped with a backslash during serialization',
								{
									value:'-\b-\t-\n-\f-\r-\\-',
									isValid:true
								},
								'-\\b-\\t-\\n-\\f-\\r-\\\\-'
							),
							Uize.Test.ParserTest.serializerTest (
								'When a property value contains Unicode characters, those characters are Unicode-escaped during serialization',
								{
									value:_char (317) + '-FOO-' + _char (605) + _char (993) + '-BAR-' + _char (2450),
									isValid:true
								},
								'\\u013D-FOO-\\u025D\\u03E1-BAR-\\u0992'
							)
						]
					}
				]
			}
		});
	}
});

