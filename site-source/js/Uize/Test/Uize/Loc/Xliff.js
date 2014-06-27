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
							'<xliff version="1.0">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">\n' +
							'			<source>widget 1 title</source>\n' +
							'			<target></target>\n' +
							'		</trans-unit>\n' +
							'		<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'			<source>the first widget</source>\n' +
							'			<target></target>\n' +
							'		</trans-unit>\n' +
							'		<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">\n' +
							'			<source>widget 2 title</source>\n' +
							'			<target></target>\n' +
							'		</trans-unit>\n' +
							'		<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'			<source>the second widget</source>\n' +
							'			<target></target>\n' +
							'		</trans-unit>\n' +
							'	</file>\n' +
							'</xliff>'
						]
					]],
					['Uize.Loc.Xliff.from',[
						['An XLIFF format document containing multiple resource strings for a file can be parsed to produce an resource strings object',
							'<?xml version="1.0" ?>\n' +
							'<xliff version="1.0">\n' +
							'	<file original="foo/bar.properties" source-language="en_US" target-language="fr_FR" datatype="plaintext">\n' +
							'		<trans-unit id="[&apos;widget1&apos;,&apos;TITLE&apos;]">\n' +
							'			<source>widget 1 title</source>\n' +
							'			<target>titre de widget de 1</target>\n' +
							'		</trans-unit>\n' +
							'		<trans-unit id="[&apos;widget1&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'			<source>the first widget</source>\n' +
							'			<target>le premier widget</target>\n' +
							'		</trans-unit>\n' +
							'		<trans-unit id="[&apos;widget2&apos;,&apos;TITLE&apos;]">\n' +
							'			<source>widget 2 title</source>\n' +
							'			<target>titre de widget de 2</target>\n' +
							'		</trans-unit>\n' +
							'		<trans-unit id="[&apos;widget2&apos;,&apos;DESCRIPTION&apos;]">\n' +
							'			<source>the second widget</source>\n' +
							'			<target>le deuxième widget</target>\n' +
							'		</trans-unit>\n' +
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
						]
					]]
				])
			]
		});
	}
});

