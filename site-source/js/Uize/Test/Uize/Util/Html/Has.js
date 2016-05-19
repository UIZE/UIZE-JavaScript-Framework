/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Html.Has Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2016 UIZE
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
		The =Uize.Test.Uize.Util.Html.Has= module defines a suite of unit tests for the =Uize.Util.Html.Has= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Html.Has',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Html.Has Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Html.Has'),
				Uize.Test.staticMethodsTest ([
					['Uize.Util.Html.Has.hasHtml',[
						/*** tests for strings that don't contain HTML ***/
							['An empty string does not have HTML',
								'',
								false
							],
							['A non-empty string that does not have HTML is not considered to have HTML',
								'foo bar baz & qux ; <span',
								false
							],

						/*** tests for strings that do contain HTML ***/
							['A string containing a named HTML entity is considered to have HTML',
								'Foo &amp; bar',
								true
							],
							['A string containing a decimal character code HTML entity is considered to have HTML',
								'Foo &#38; bar',
								true
							],
							['A string containing a hexadecimal character code HTML entity is considered to have HTML',
								'Foo &#x26; bar',
								true
							],
							['A string containing am opening HTML tag is considered to have HTML',
								'<b>foo',
								true
							],
							['A string containing a closing HTML tag is considered to have HTML',
								'bar</b>',
								true
							],
							['A string containing a self-closing HTML tag is considered to have HTML',
								'foo<br/>bar',
								true
							],
							['A string containing opening and closing HTML tags is considered to have HTML',
								'<b>foo bar</b>',
								true
							],
							['A string containing an HTML tag with attributes is considered to have HTML',
								'<span class="foo bar" style="font-size: 12px;">foo bar</span>',
								true
							],
							['A string containing an HTML tag with whitespace padding is considered to have HTML',
								'< span  class = "foo bar" style = "font-size: 12px;" >foo bar< / span >',
								true
							]
					]]
				])
			]
		});
	}
});

