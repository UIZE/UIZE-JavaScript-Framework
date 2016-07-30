/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Pseudo.Xml Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Loc.Pseudo.Xml= module defines a suite of unit tests for the =Uize.Loc.Pseudo.Xml= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Pseudo.Xml',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Pseudo.Xml Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Pseudo.Xml'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Pseudo.Xml.pseudoLocalize',[
						['The content from all text nodes is pseudo-localized, while tags are left as is',
							[
								'<div>' +
									'<div>Main Menu</div>' +
									'<div>' +
										'This is the awesome <span>body</span> content' +
									'</div>' +
									'<div>(c) Copyright 3001</div>' +
								'</div>',
								{wrapper:''}
							],
							'<div>' +
								'<div>Ṁåîñ_ Ṁéñû_</div>' +
								'<div>' +
									'Ţĥîš__ îš ţĥé_ åŵéšöɱé__ <span>ƀöðý_</span> çöñţéñţ___' +
								'</div>' +
								'<div>(ç) Çöþýŕîĝĥţ___ 3001_</div>' +
							'</div>'
						],
						['HTML entities that represent non-word characters are not modified by pseudo-localization',
							[
								'<div>&lt;&gt;&amp;</div>',
								{wrapper:''}
							],
							'<div>&lt;&gt;&amp;</div>'
						],
						['HTML entities that represent word characters are pseudo-localized in the same way as the non-entity (i.e. regular) representations of those characters',
							[
								'<div>&#102;&#111;&#111;&#32;&#98;&#97;&#114;</div>',
								{wrapper:''}
							],
							'<div>ƒöö_ ƀåŕ_</div>'
						],
						['When no attribute matcher is specified, then no attributes will be pseudo-localized',
							[
								'<div class="fancy">' +
									'<div class="heading" title="Main Menu">Main Menu</div>' +
									'<div class="body">' +
										'This is the awesome <span style="font-weight: bold;">body</span> content' +
									'</div>' +
									'<div class="footer">(c) Copyright 3001</div>' +
								'</div>',
								{wrapper:''}
							],
							'<div class="fancy">' +
								'<div class="heading" title="Main Menu">Ṁåîñ_ Ṁéñû_</div>' +
								'<div class="body">' +
									'Ţĥîš__ îš ţĥé_ åŵéšöɱé__ <span style="font-weight: bold;">ƀöðý_</span> çöñţéñţ___' +
								'</div>' +
								'<div class="footer">(ç) Çöþýŕîĝĥţ___ 3001_</div>' +
							'</div>'
						],
						['When an optional attribute matcher is specified, those attributes that match against the attribute matcher will be pseudo-localized, while attributes that do not match will not be pseudo-localized',
							[
								'<div class="fancy">' +
									'<div class="heading" title="Main Menu">Main Menu</div>' +
									'<div class="body">' +
										'This is the awesome <span style="font-weight: bold;">body</span> content' +
										'<img src="foo.gif" alt="This is an image"/>' +
										'<input name="fullName" type="text" placeholder="Full name"/>' +
										'<textarea name="interests" placeholder="Hobbies and interests"></textarea>' +
									'</div>' +
									'<div class="footer">(c) Copyright 3001</div>' +
								'</div>',
								{
									attributeMatcher:[
										'title',
										'img@alt',
										'[input|textarea]@placeholder'
									],
									wrapper:''
								}
							],
							'<div class="fancy">' +
								'<div class="heading" title="Ṁåîñ_ Ṁéñû_">Ṁåîñ__ Ṁéñû_</div>' +
								'<div class="body">' +
									'Ţĥîš_ îš_ ţĥé_ åŵéšöɱé__ <span style="font-weight: bold;">ƀöðý_</span> çöñţéñţ__' +
									'<img src="foo.gif" alt="Ţĥîš_ îš_ åñ îɱåĝé__"/>' +
									'<input name="fullName" type="text" placeholder="Ƒûļļ_ ñåɱé_"/>' +
									'<textarea name="interests" placeholder="Ĥöƀƀîéš__ åñð_ îñţéŕéšţš___"></textarea>' +
								'</div>' +
								'<div class="footer">(ç) Çöþýŕîĝĥţ___ 3001_</div>' +
							'</div>'
						],
						['When an optional tag name matcher is specified, only those tags whose names match against the tag name matcher will have their contents pseudo-localized',
							[
								[
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Foo Page</title>',
									'		<style type="text/css">',
									'			/* this is some CSS that should not be pseudo-localized */',
									'			div {',
									'				margin: 0;',
									'				font-family: Arial, Helvetica, Verdana;',
									'				font-size: 12px;',
									'			}',
									'		</style>',
									'	</head>',
									'	<body>',
									'		<script type="text/javascript">',
									'			/* this is some JavaScript code that should not be pseudo-localized */',
									'			function double (argument) {',
									'				return argument * 2;',
									'			}',
									'		</script>',
									'		<div>',
									'			This is some <b>pseudo-localizable</b> content.',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n'),
								{
									tagNameMatcher:function (_tagName) {
										return _tagName != 'style' && _tagName != 'script';
									},
									wrapper:''
								}
							],
							[
								'<html xmlns="http://www.w3.org/1999/xhtml">',
								'	<head>',
								'		<title>Ƒöö_ Þåĝé_</title>',
								'		<style type="text/css">',
								'			/* this is some CSS that should not be pseudo-localized */',
								'			div {',
								'				margin: 0;',
								'				font-family: Arial, Helvetica, Verdana;',
								'				font-size: 12px;',
								'			}',
								'		</style>',
								'	</head>',
								'	<body>',
								'		<script type="text/javascript">',
								'			/* this is some JavaScript code that should not be pseudo-localized */',
								'			function double (argument) {',
								'				return argument * 2;',
								'			}',
								'		</script>',
								'		<div>',
								'			Ţĥîš_ îš_ šöɱé_ <b>þšéûðö-ļöçåļîžåƀļé______</b> çöñţéñţ__.',
								'		</div>',
								'	</body>',
								'</html>'
							].join ('\n')
						]
					]]
				])
			]
		});
	}
});

