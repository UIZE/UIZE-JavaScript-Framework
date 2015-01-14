/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaProperties.PropertyName Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Uize.Parse.JavaProperties.PropertyName= module defines a suite of unit tests for the =Uize.Parse.JavaProperties.PropertyName= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaProperties.PropertyName',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.JavaProperties.PropertyName'},

			set:{
				title:'Test for Uize.Parse.JavaProperties.PropertyName Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaProperties.PropertyName'),
					{
						title:'A property name can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A property name may be a single word containing alphabetical characters',
								['Property'],
								{
									name:'Property',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property name may contain digits',
								['Property0123456789'],
								{
									name:'Property0123456789',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property name may unescaped special characters that are not ":" or "="',
								['Property~!@#$%^&*()_+-`[]{}|;".,/?'],
								{
									name:'Property~!@#$%^&*()_+-`[]{}|;".,/?',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Parsing of a property name is terminated by a ":" (colon) character',
								['Property:Value'],
								{
									name:'Property',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Parsing of a property name is terminated by a "=" (equals) character',
								['Property=Value'],
								{
									name:'Property',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Parsing of a property name is terminated by a " " (space) character',
								['Property Value'],
								{
									name:'Property',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property name may contain ":" (colon), "=" (equals), or " " (space) characters, as long as they are escaped with a "\" (backslash) character',
								['Foo\\:Bar\\=Baz\\ Qux=Value'],
								{
									name:'Foo:Bar=Baz Qux',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property name may not start with whitespace',
								[' Property'],
								{
									name:'',
									isValid:false
								}
							)
						]
					},
					{
						title:'A property name can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A property name that is a single word containing alphabetical characters can be serialized',
								{
									name:'Property',
									isValid:true
								},
								'Property'
							),
							Uize.Test.ParserTest.serializerTest (
								'A property name containing digits can be serialized',
								{
									name:'Property0123456789',
									isValid:true
								},
								'Property0123456789'
							),
							Uize.Test.ParserTest.serializerTest (
								'A property name containing special characters that are not ":" (colon), "=" (equals), or " " (space) can be serialized',
								{
									name:'Property~!@#$%^&*()_+-`[]{}|;".,/?',
									isValid:true
								},
								'Property~!@#$%^&*()_+-`[]{}|;".,/?'
							),
							Uize.Test.ParserTest.serializerTest (
								'When a property contains ":" (colon), "=" (equals), or " " (space) characters, they are escaped with a "\" (backslash) character when the property name is serizlied',
								{
									name:'Foo:Bar=Baz Qux',
									isValid:true
								},
								'Foo\\:Bar\\=Baz\\ Qux'
							)
						]
					}
				]
			}
		});
	}
});

