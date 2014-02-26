/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.Tag Class
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
		The =Uize.Test.Uize.Parse.Xml.Tag= module defines a suite of unit tests for the =Uize.Parse.Xml.Tag= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.Tag',
	builder:function () {
		'use strict';

		function _parserTest (_title,_sourceStr,_expectedParsedSegment,_index) {
			_index = _index || 0;
			return {
				title:_title,
				test:function () {
					var _parser = new Uize.Parse.Xml.Tag;
					_parser.parse (_sourceStr);
					return (
						this.expect (_expectedParsedSegment,_parser.tag) &&
						this.expect (_expectedParsedSegment.length,_parser.length) &&
						this.expect (!!_expectedParsedSegment,_parser.isValid)
					);
				}
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Parse.Xml.Tag Module',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Parse.Xml.NodeList',
					'Uize.Parse.Xml.Tag'
				]),
				{
					title:'',
					test:[
						{
							title:'',
							test:function () {
								var _tagParser = new Uize.Parse.Xml.NodeList (
									'<div id="goo">text\nnode 1<!-- this is a comment --><img src="foo.png" width="100" height="200"/><namespace:tag namespace:attr="foo">stuff</namespace:tag>text node 2<![CDATA[ this is some cdata </div> ]]>text node 3</div>'
								);
								console.log (_tagParser);
								console.log (_tagParser.serialize ());
								return true;
							}
						}
						/*
						,
						_parserTest (
							'',
							'<',
							''
						),
						_parserTest (
							'',
							'<img',
							'<img'
						),
						_parserTest (
							'',
							'<img>',
							'<img>'
						)
						*/
					]
				}
			]
		});
	}
});

