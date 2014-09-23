/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Xliff Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Test.Uize.Loc.Xliff= module defines a suite of unit tests for the =Uize.Loc.Xliff= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Xliff',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Xliff Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Xliff'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Xliff.to',[
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
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 1 title</source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the first widget</source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 2 title</source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the second widget</source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>'
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
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;STR1&apos;]">\n' +
							'				<source>foo <ph id="1" ctype="x-param">{param}</ph> bar</source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR2&apos;]">\n' +
							'				<source>foo <ph id="2" ctype="x-param">{param}</ph></source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR3&apos;]">\n' +
							'				<source><ph id="3" ctype="x-param">{param}</ph> bar</source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR4&apos;]">\n' +
							'				<source><ph id="4" ctype="x-param">{param}</ph></source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR5&apos;]">\n' +
							'				<source><ph id="5" ctype="x-param">{param1}</ph><ph id="6" ctype="x-param">{param2}</ph></source>\n' +
							'				<target></target>\n' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>'
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
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 1 title</source>\n' +
							'				<target>widget 1 title</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the first widget</source>\n' +
							'				<target>the first widget</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 2 title</source>\n' +
							'				<target>widget 2 title</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the second widget</source>\n' +
							'				<target>the second widget</target>\n' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>'
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
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 1 title</source>\n' +
							'				<target>titre de widget de 1</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the first widget</source>\n' +
							'				<target>le premier widget</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 2 title</source>\n' +
							'				<target>widget 2 title</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the second widget</source>\n' +
							'				<target>the second widget</target>\n' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>'
						]
					]],
					['Uize.Loc.Xliff.from',[
						['An XLIFF format document containing multiple resource strings for a file can be parsed to produce an resource strings object',
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 1 title</source>\n' +
							'				<target>titre de widget de 1</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the first widget</source>\n' +
							'				<target>le premier widget</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">\n' +
							'				<source>widget 2 title</source>\n' +
							'				<target>titre de widget de 2</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'				<source>the second widget</source>\n' +
							'				<target>le deuxième widget</target>\n' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>',
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
						['An XLIFF format document may contain trans-unit tags with substitution tokens wrapped in <ph> tags',
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;STR1&apos;]">\n' +
							'				<source>foo <ph id="1" ctype="x-param">{param}</ph> bar</source>\n' +
							'				<target>foo <ph id="1" ctype="x-param">{param}</ph> bar</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR2&apos;]">\n' +
							'				<source>foo <ph id="2" ctype="x-param">{param}</ph></source>\n' +
							'				<target>foo <ph id="2" ctype="x-param">{param}</ph></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR3&apos;]">\n' +
							'				<source><ph id="3" ctype="x-param">{param}</ph> bar</source>\n' +
							'				<target><ph id="3" ctype="x-param">{param}</ph> bar</target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR4&apos;]">\n' +
							'				<source><ph id="4" ctype="x-param">{param}</ph></source>\n' +
							'				<target><ph id="4" ctype="x-param">{param}</ph></target>\n' +
							'			</trans-unit>\n' +
							'			<trans-unit id="[&apos;STR5&apos;]">\n' +
							'				<source><ph id="5" ctype="x-param">{param1}</ph><ph id="6" ctype="x-param">{param2}</ph></source>\n' +
							'				<target><ph id="5" ctype="x-param">{param1}</ph><ph id="6" ctype="x-param">{param2}</ph></target>\n' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>',
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
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<body>\n' +
							'			<trans-unit id="[&apos;STR&apos;]">\n' +
							'				<source/>\n' +
							'				<target/>' +
							'			</trans-unit>\n' +
							'		</body>\n' +
							'	</file>\n' +
							'</xliff>',
							{
								'foo/bar.properties':{
									STR:''
								}
							}
						],
						{
							title:
								'When an XLIFF document is serialized from a strings object using the Uize.Loc.Xliff.to method and the seedTarget option, and that document is then parsed to produce a strings object using the Uize.Loc.Xliff.from method, the returned strings object is identical to the original strings object',
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
									_parsedStrings = Uize.Loc.Xliff.from (
										Uize.Loc.Xliff.to (
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

