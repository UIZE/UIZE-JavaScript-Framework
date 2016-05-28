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
							['A string that contains an HTML tag that is empty is not considered to have HTML',
								'<>',
								false
							],
							['A string that contains an HTML tag with a slash both at the start and at the end is not considered to have HTML',
								'</div/>',
								false
							],
							['A string that contains a closing HTML tag with attributes is not considered to have HTML',
								'</div foo="bar">',
								false
							],
							['A string that contains an HTML tag with invalid characters is not considered to have HTML',
								'<div ^$%:foo="bar":>',
								false
							],
							['A string that contains an HTML tag with only attributes but no tag name is not considered to have HTML',
								'< foo="bar" baz>',
								false
							],
							['A string that contains an HTML tag with an attribute that has mismatching quotes is not considered to have HTML',
								'<img src="foo.jpg\'>',
								false
							],
							['A string that contains an HTML tag with an attribute that has mismatching quotes is not considered to have HTML',
								'<img src=\'foo.jpg">',
								false
							],
							['A string that contains an HTML tag with an attribute that is missing a closing quote is not considered to have HTML',
								'<img src="foo.jpg>',
								false
							],
							['A string that contains an HTML tag that is missing its opening "<" character is not considered to have HTML',
								'img src="foo.jpg">',
								false
							],
							['A string that contains an HTML tag that is missing its closing ">" character is not considered to have HTML',
								'<img src="foo.jpg"',
								false
							],
							['A string that contains an HTML tag that has no whitespace separating multiple attributes is not considered to have HTML',
								'<img src="foo"bar="baz">',
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
							['A string containing a self-closing HTML tag with attributes is considered to have HTML',
								'<img src="http://www.foo.com/pic.gif" style="width: 100px; height: 200px;"/>',
								true
							],
							['A string containing an HTML tag with whitespace padding is considered to have HTML',
								'< span  class = "foo bar" style = "font-size: 12px;" >foo bar< / span >',
								true
							],
							['A string containing an HTML tag that is spread across multiple lines is considered to have HTML',
								[
									'<img ',
									'	src="http://www.foo.com/pic.gif"',
									'	style="width: 100px; height: 200px;"',
									'/>'
								].join ('\n'),
								true
							]
					]]
				])
			]
		});
	}
});

