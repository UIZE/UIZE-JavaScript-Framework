/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Xliff Class
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
		The =Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Xliff= module defines a suite of unit tests for the =Uize.Loc.FileFormats.ProjectStrings.Xliff= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Xliff',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.FileFormats.ProjectStrings.Xliff Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.ProjectStrings.Xliff'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.ProjectStrings.Xliff.to',[
						['An object containing multiple resource strings for a file can be serialized to XLIFF format',
							{
								sourceLanguage:'en_US',
								targetLanguage:'fr_FR',
								strings:{
									'foo/bar.properties':{
										widget1:{
											TITLE:'widget 1 title',
											DESCRIPTION:'the first widget'
										},
										widget2:{
											TITLE:'widget 2 title',
											DESCRIPTION:'the second widget'
										}
									}
								}
							},
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 1 title</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the first widget</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 2 title</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the second widget</source>',
								'				<target></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['An object containing resource strings for multiple files can be serialized to XLIFF format',
							{
								sourceLanguage:'en_US',
								targetLanguage:'fr_FR',
								strings:{
									'foo/bar.properties':{
										widget1:{
											TITLE:'widget 1 title',
											DESCRIPTION:'the first widget'
										}
									},
									'baz/qux.properties':{
										widget2:{
											TITLE:'widget 2 title',
											DESCRIPTION:'the second widget'
										}
									}
								}
							},
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 1 title</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the first widget</source>',
								'				<target></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'	<file original="baz/qux.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 2 title</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the second widget</source>',
								'				<target></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['When the resource strings contain substitution tokens and a value is specified for the tokenSplitter option, then the substitution tokens are wrapped in <ph> tags when serialized to XLIFF format',
							[
								{
									sourceLanguage:'en_US',
									targetLanguage:'fr_FR',
									strings:{
										'foo/bar.properties':{
											STR1:'foo {param} bar',
											STR2:'foo {param}',
											STR3:'{param} bar',
											STR4:'{param}',
											STR5:'{param1}{param2}'
										}
									},

								},
								{tokenSplitter:/\{[\w\d]+\}/}
							],
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;STR1&apos;]">',
								'				<source>foo <ph id="1" ctype="x-param">{param}</ph> bar</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR2&apos;]">',
								'				<source>foo <ph id="2" ctype="x-param">{param}</ph></source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR3&apos;]">',
								'				<source><ph id="3" ctype="x-param">{param}</ph> bar</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR4&apos;]">',
								'				<source><ph id="4" ctype="x-param">{param}</ph></source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR5&apos;]">',
								'				<source><ph id="5" ctype="x-param">{param1}</ph><ph id="6" ctype="x-param">{param2}</ph></source>',
								'				<target></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['When the value true is specified for the seedTarget option, then the value of each <trans-unit> tag\'s <target> tag is seeded with the untranslated source value of the resource string',
							[
								{
									sourceLanguage:'en_US',
									targetLanguage:'fr_FR',
									strings:{
										'foo/bar.properties':{
											widget1:{
												TITLE:'widget 1 title',
												DESCRIPTION:'the first widget'
											},
											widget2:{
												TITLE:'widget 2 title',
												DESCRIPTION:'the second widget'
											}
										}
									}
								},
								{seedTarget:true}
							],
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 1 title</source>',
								'				<target>widget 1 title</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the first widget</source>',
								'				<target>the first widget</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 2 title</source>',
								'				<target>widget 2 title</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the second widget</source>',
								'				<target>the second widget</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['When an object value is specified for the seedTarget option, then the value of each <trans-unit> tag\'s <target> tag is seeded with a corresponding value from the seedTarget object, if present, or the untranslated source value of the resource string',
							[
								{
									sourceLanguage:'en_US',
									targetLanguage:'fr_FR',
									strings:{
										'foo/bar.properties':{
											widget1:{
												TITLE:'widget 1 title',
												DESCRIPTION:'the first widget'
											},
											widget2:{
												TITLE:'widget 2 title',
												DESCRIPTION:'the second widget'
											}
										}
									}
								},
								{
									seedTarget:{
										'foo/bar.properties':{
											widget1:{
												TITLE:'titre de widget de 1',
												DESCRIPTION:'le premier widget'
											}
										}
									}
								}
							],
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 1 title</source>',
								'				<target>titre de widget de 1</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the first widget</source>',
								'				<target>le premier widget</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 2 title</source>',
								'				<target>widget 2 title</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the second widget</source>',
								'				<target>the second widget</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['When an object value is specified for the seedTarget option, the value for each <trans-unit> tag\'s <target> tag is encoded in the same way as the value for its <source> tag',
							[
								{
									sourceLanguage:'en_US',
									targetLanguage:'fr_FR',
									strings:{
										'foo/bar.properties':{
											widgetN:{
												TITLE:'widget {widgetNo} title',
												DESCRIPTION:'<b>the first widget</b>',
												BODY:'<div>{body}</div>'
											}
										}
									}
								},
								{
									seedTarget:{
										'foo/bar.properties':{
											widgetN:{
												TITLE:'titre de widget de {widgetNo}',
												DESCRIPTION:'<b>le premier widget</b>',
												BODY:'<div>{body}</div>'
											}
										}
									},
									tokenSplitter:/\{[\w\d]+\}/
								}
							],
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widgetN&apos;,&apos;TITLE&apos;]">',
								'				<source>widget <ph id="1" ctype="x-param">{widgetNo}</ph> title</source>',
								'				<target>titre de widget de <ph id="2" ctype="x-param">{widgetNo}</ph></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widgetN&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>&lt;b&gt;the first widget&lt;/b&gt;</source>',
								'				<target>&lt;b&gt;le premier widget&lt;/b&gt;</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widgetN&apos;,&apos;BODY&apos;]">',
								'				<source>&lt;div&gt;<ph id="3" ctype="x-param">{body}</ph>&lt;/div&gt;</source>',
								'				<target>&lt;div&gt;<ph id="3" ctype="x-param">{body}</ph>&lt;/div&gt;</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['An object containing string arrays for a file can be serialized to XLIFF format',
							{
								sourceLanguage:'en_US',
								targetLanguage:'fr_FR',
								strings:{
									'foo/bar.properties':{
										widget1:{
											OPTIONS:[
												'Option 1',
												'Option 2'
											]
										},
										widget2:{
											OPTIONS:[
												'foo',
												'bar'
											]
										}
									}
								}
							},
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;OPTIONS&apos;,0]">',
								'				<source>Option 1</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;OPTIONS&apos;,1]">',
								'				<source>Option 2</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;OPTIONS&apos;,0]">',
								'				<source>foo</source>',
								'				<target></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;OPTIONS&apos;,1]">',
								'				<source>bar</source>',
								'				<target></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						],
						['When resource strings contain line break characters, these characters are encoded as XML entities',
							{
								sourceLanguage:'en_US',
								targetLanguage:'fr_FR',
								strings:{
									'foo/bar.properties':{
										STR:'this string\nspans\rmultiple\r\nlines'
									}
								}
							},
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;STR&apos;]">',
								'				<source>this string&#10;spans&#13;multiple&#13;&#10;lines</source>',
								'				<target></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n')
						]
					]],
					['Uize.Loc.FileFormats.ProjectStrings.Xliff.from',[
						['An XLIFF format document containing multiple resource strings for a file can be parsed to produce a resource strings object',
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 1 title</source>',
								'				<target>titre de widget de 1</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the first widget</source>',
								'				<target>le premier widget</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 2 title</source>',
								'				<target>titre de widget de 2</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the second widget</source>',
								'				<target>le deuxième widget</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n'),
							{
								'foo/bar.properties':{
									widget1:{
										TITLE:'titre de widget de 1',
										DESCRIPTION:'le premier widget'
									},
									widget2:{
										TITLE:'titre de widget de 2',
										DESCRIPTION:'le deuxième widget'
									}
								}
							}
						],
						['An XLIFF format document containing resource strings for multiple files can be parsed to produce a resource strings object',
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 1 title</source>',
								'				<target>titre de widget de 1</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the first widget</source>',
								'				<target>le premier widget</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'	<file original="baz/qux.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">',
								'				<source>widget 2 title</source>',
								'				<target>titre de widget de 2</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">',
								'				<source>the second widget</source>',
								'				<target>le deuxième widget</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n'),
							{
								'foo/bar.properties':{
									widget1:{
										TITLE:'titre de widget de 1',
										DESCRIPTION:'le premier widget'
									}
								},
								'baz/qux.properties':{
									widget2:{
										TITLE:'titre de widget de 2',
										DESCRIPTION:'le deuxième widget'
									}
								}
							}
						],
						['An XLIFF format document may contain trans-unit tags with substitution tokens wrapped in <ph> tags',
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;STR1&apos;]">',
								'				<source>foo <ph id="1" ctype="x-param">{param}</ph> bar</source>',
								'				<target>foo <ph id="1" ctype="x-param">{param}</ph> bar</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR2&apos;]">',
								'				<source>foo <ph id="2" ctype="x-param">{param}</ph></source>',
								'				<target>foo <ph id="2" ctype="x-param">{param}</ph></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR3&apos;]">',
								'				<source><ph id="3" ctype="x-param">{param}</ph> bar</source>',
								'				<target><ph id="3" ctype="x-param">{param}</ph> bar</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR4&apos;]">',
								'				<source><ph id="4" ctype="x-param">{param}</ph></source>',
								'				<target><ph id="4" ctype="x-param">{param}</ph></target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;STR5&apos;]">',
								'				<source><ph id="5" ctype="x-param">{param1}</ph><ph id="6" ctype="x-param">{param2}</ph></source>',
								'				<target><ph id="5" ctype="x-param">{param1}</ph><ph id="6" ctype="x-param">{param2}</ph></target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n'),
							{
								'foo/bar.properties':{
									STR1:'foo {param} bar',
									STR2:'foo {param}',
									STR3:'{param} bar',
									STR4:'{param}',
									STR5:'{param1}{param2}'
								}
							}
						],
						['An XLIFF format document may contain trans-unit tags with empty, self-closing source and target tags, and such tags are parsed to empty string values',
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;STR&apos;]">',
								'				<source/>',
								'				<target/>' +
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n'),
							{
								'foo/bar.properties':{
									STR:''
								}
							}
						],
						['An XLIFF format document may contain trans-unit tags that contain values for elements of string arrays, and these are parsed to produce string arrays in the returned strings object',
							[
								'<?xml version="1.0" ?>',
								'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
								'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">',
								'		<body>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;OPTIONS&apos;,0]">',
								'				<source>Option 1</source>',
								'				<target>Option 1</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget1&apos;,&apos;OPTIONS&apos;,1]">',
								'				<source>Option 2</source>',
								'				<target>Option 2</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;OPTIONS&apos;,0]">',
								'				<source>foo</source>',
								'				<target>le foo</target>',
								'			</trans-unit>',
								'			<trans-unit id="[&apos;widget2&apos;,&apos;OPTIONS&apos;,1]">',
								'				<source>bar</source>',
								'				<target>le bar</target>',
								'			</trans-unit>',
								'		</body>',
								'	</file>',
								'</xliff>'
							].join ('\n'),
							{
								'foo/bar.properties':{
									widget1:{
										OPTIONS:[
											'Option 1',
											'Option 2'
										]
									},
									widget2:{
										OPTIONS:[
											'le foo',
											'le bar'
										]
									}
								}
							}
						],
						{
							title:
								'When an XLIFF document is serialized from a strings object using the Uize.Loc.FileFormats.ProjectStrings.Xliff.to method and the seedTarget option, and that document is then parsed to produce a strings object using the Uize.Loc.FileFormats.ProjectStrings.Xliff.from method, the returned strings object is identical to the original strings object',
							test:function () {
								var
									_sourceStrings = {
										'foo/bar.properties':{
											widget1:{
												TITLE:'widget 1 title',
												DESCRIPTION:'the first widget'
											},
											widget2:{
												TITLE:'widget 2 title',
												DESCRIPTION:'the second widget'
											}
										}
									},
									_parsedStrings = Uize.Loc.FileFormats.ProjectStrings.Xliff.from (
										Uize.Loc.FileFormats.ProjectStrings.Xliff.to (
											{
												sourceLanguage:'en_US',
												targetLanguage:'fr_FR',
												strings:_sourceStrings
											},
											{seedTarget:true}
										)
									)
								;
								return this.expect (_sourceStrings,_parsedStrings);
							}
						}
					]]
				])
			]
		});
	}
});

