/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.Text Class
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
		The =Uize.Test.Uize.Parse.Xml.Text= module defines a suite of unit tests for the =Uize.Parse.Xml.Text= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.Text',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.Text'},

			set:{
				title:'Test for Uize.Parse.Xml.Text Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.Text'),
					{
						title:'A text node can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A text node can be empty',
								[''],
								{
									text:'',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A text node containing contents can be parsed',
								['some text content'],
								{
									text:'some text content',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A text node is terminated by the first "<" character that is encountered',
								['foo bar<baz><qux></qux></baz>'],
								{
									text:'foo bar',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A text node may contain linebreaks and other whitespace characters, and such characters are treated as literal text that is part of the contents of that text node',
								['Line 1\nLine 2\rLine 3\r\n\t\tLine 4'],
								{
									text:'Line 1\nLine 2\rLine 3\r\n\t\tLine 4',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A text node may contain character entity escape sequences, and such escape sequences are unescaped',
								['&amp;&quot;&lt;&gt;&#216;'],
								{
									text:'&"<>Ø',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A text node may not start with a "<" character',
								['<'],
								{
									text:'',
									isValid:false
								}
							)
						]
					},
					{
						title:'A text node can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A text node with no contents is serialized correctly',
								{
									text:'',
									isValid:true
								},
								''
							),
							Uize.Test.ParserTest.serializerTest (
								'Limited XML encoding is performed on the contents of a text node when it is serialized',
								{
									text:'&"<>Ø',
									isValid:true
								},
								'&amp;"&lt;&gt;Ø'
							)
						]
					}
				]
			}
		});
	}
});

