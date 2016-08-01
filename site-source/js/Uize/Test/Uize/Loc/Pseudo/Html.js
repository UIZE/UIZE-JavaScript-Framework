/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Pseudo.Html Class
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
		The =Uize.Test.Uize.Loc.Pseudo.Html= module defines a suite of unit tests for the =Uize.Loc.Pseudo.Html= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Pseudo.Html',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Pseudo.Html Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Pseudo.Html'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Pseudo.Html.pseudoLocalize',[
						/*** test that there is no wrapper for pseudo-localized HTML ***/
							['There are no wrapper characters enclosing pseudo-localized HTML',
								'<div>This is some <b>pseudo-localizable</b> content.</div>',
								'<div>Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.</div>'
							],
							['The wrapper pseudo-localization option is not supported for HTML pseudo-localization, and if it is specified, it is ignored',
								[
									'<div>This is some <b>pseudo-localizable</b> content.</div>',
									{
										wrapper:'[]'
									}
								],
								'<div>Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.</div>'
							],

						/*** test that certain tag attributes are pseudo-localized ***/
							['The values of title attributes of any tags are pseudo-localized',
								[
									'<img src="http://foo.com/img.jpg" title="This is an image">',
									'<input type="text" title="This is a text input"/>',
									'<div title="This is a div">Some div contents</div>'
								].join ('\n'),
								[
									'<img src="http://foo.com/img.jpg" title="Ţĥîš_ îš_ åñ îɱåĝé__"/>',
									'<input type="text" title="Ţĥîš_ îš_ å ţéẋţ_ îñþûţ__"/>',
									'<div title="Ţĥîš_ îš_ å ðîṽ_">Šöɱé_ ðîṽ_ çöñţéñţš__</div>'
								].join ('\n')
							],
							['The values of alt attributes of img tags are pseudo-localized',
								[
									'<img src="http://foo.com/img1.jpg" alt="This is an image">',
									'<img src="http://foo.com/img2.jpg" alt="This is another image">',
									'<input type="text" alt="This is a text input"/>',
									'<div alt="This is a div">Some div contents</div>'
								].join ('\n'),
								[
									'<img src="http://foo.com/img1.jpg" alt="Ţĥîš_ îš_ åñ îɱåĝé__"/>',
									'<img src="http://foo.com/img2.jpg" alt="Ţĥîš_ îš_ åñöţĥéŕ__ îɱåĝé_"/>',
									'<input type="text" alt="This is a text input"/>',
									'<div alt="This is a div">Šöɱé__ ðîṽ çöñţéñţš___</div>'
								].join ('\n')
							],
							['The values of placeholder attributes of input and textarea tags are pseudo-localized',
								[
									'<input type="text" placeholder="Please enter some text"/>',
									'<textarea placeholder="Please enter some multi-line text"></textarea>',
									'<div placeholder="This is a div">Some div contents</div>'
								].join ('\n'),
								[
									'<input type="text" placeholder="Þļéåšé__ éñţéŕ_ šöɱé__ ţéẋţ_"/>',
									'<textarea placeholder="Þļéåšé__ éñţéŕ_ šöɱé_ ɱûļţî__-ļîñé_ ţéẋţ_"></textarea>',
									'<div placeholder="This is a div">Šöɱé_ ðîṽ_ çöñţéñţš___</div>'
								].join ('\n')
							],

						/*** test that the contents of certain tags are not pseudo-localized ***/
							['The contents of style tags is not pseudo-localized',
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
									'		<div>',
									'			This is some <b>pseudo-localizable</b> content.',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n'),
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
									'		<div>',
									'			Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n')
							],
							['The contents of script tags is not pseudo-localized',
								[
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Foo Page</title>',
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
								[
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Ƒöö_ Þåĝé_</title>',
									'	</head>',
									'	<body>',
									'		<script type="text/javascript">',
									'			/* this is some JavaScript code that should not be pseudo-localized */',
									'			function double (argument) {',
									'				return argument * 2;',
									'			}',
									'		</script>',
									'		<div>',
									'			Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n')
							],

						/*** test HTML repair and fallback behavior ***/
							['Certain HTML errors, such as self-closing tags that are missing a "/" are repaired so that true HTML pseudo-localization can be performed',
								[
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Foo Page</title>',
									'		<meta name="keywords" content="foo bar">',
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
									'		<div>',
									'			This is some <b>pseudo-localizable</b> content.',
									'			<br>',
									'			<img src="http://foo.com/img.jpg" title="This is an image">',
									'			<br>',
									'			<input type="text" placeholder="This is an input placeholder">',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n'),
								[
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Ƒöö_ Þåĝé_</title>',
									'		<meta name="keywords" content="foo bar"/>',
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
									'		<div>',
									'			Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.',
									'			<br/>',
									'			<img src="http://foo.com/img.jpg" title="Ţĥîš__ îš åñ_ îɱåĝé_"/>',
									'			<br/>',
									'			<input type="text" placeholder="Ţĥîš_ îš_ åñ_ îñþûţ_ þļåçéĥöļðéŕ___"/>',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n')
							],
							['A string that contains HTML that is not well formed and that cannot be repaired will be pseudo-localized using a more rudimentary process where the HTML tag pattern is part of the word splitter',
								'<foo title="bad HTML">This is some <b>pseudo-localizable</b> content.</bar>',
								'<foo title="bad HTML">Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.</bar>'
							],

						/*** miscellaneous tests ***/
							['A string may be a complete HTML document with a prolog containing XML and DOCTYPE declarations, and the prolog declarations are ignored during pseudo-localization',
								[
									'<?xml version="1.0" encoding="UTF-8"?>',
									'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Foo Page</title>',
									'	</head>',
									'	<body>',
									'		<div>',
									'			This is some <b>pseudo-localizable</b> content.',
									'			<img src="http://foo.com/img.jpg" title="This is an image"/>',
									'			<input type="text" placeholder="This is an input placeholder"/>',
									'		</div>',
									'	</body>',
									'</html>'
								].join ('\n'),
								[
									'<?xml version="1.0" encoding="UTF-8"?>',
									'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
									'<html xmlns="http://www.w3.org/1999/xhtml">',
									'	<head>',
									'		<title>Ƒöö_ Þåĝé_</title>',
									'	</head>',
									'	<body>',
									'		<div>',
									'			Ţĥîš_ îš_ šöɱé_ <b>þšéûðö__-ļöçåļîžåƀļé___</b> çöñţéñţ__.',
									'			<img src="http://foo.com/img.jpg" title="Ţĥîš__ îš åñ_ îɱåĝé_"/>',
									'			<input type="text" placeholder="Ţĥîš_ îš_ åñ_ îñþûţ_ þļåçéĥöļðéŕ___"/>',
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

