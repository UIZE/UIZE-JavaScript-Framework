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

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Xml.TagName Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Xml.TagName'),
				{
					title:'',
					test:[
						{
							title:'Test that a string fails parsing as a tag name if any of the contiguous characters after the leading whitespace are not valid tag name characters',
							test:function () {
								var _parser = new Uize.Util.Xml.TagName;
								_parser.parse ('');
								return true;
							}
						}
					]
				}
			]
		});
	}
});

