/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Services.LocAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 3
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Services.LocAdapter= module defines a suite of unit tests for the =Uize.Services.LocAdapter= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Services.LocAdapter',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Services.LocAdapter Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Services.LocAdapter'),
				Uize.Test.staticMethodsTest ([
					['Uize.Services.LocAdapter.resolveProjectLanguages',[
						['When no languages option is present, it is defined as an empty array',
							{},
							{
								languages:[],
								languagesSuperset:[]
							}
						],
						['When there are languages specified only in the languages property, those languages are populated into the languagesSuperset property',
							{
								languages:['en-GB','fr-FR']
							},
							{
								languages:['en-GB','fr-FR'],
								languagesSuperset:['en-GB','fr-FR']
							}
						],
						['When there are languages specified only in the brandLanguages property, then the languages property will be defined as an empty array and the superset of the languages specified for all the brands will be populated into the languagesSuperset property',
							{
								brandLanguages:{
									fooBrand:['en-GB','fr-CA','ja-JP'],
									barBrand:['fr-CA','ja-JP','es-ES','zh-CN']
								}
							},
							{
								languages:[],
								brandLanguages:{
									fooBrand:['en-GB','fr-CA','ja-JP'],
									barBrand:['fr-CA','ja-JP','es-ES','zh-CN']
								},
								languagesSuperset:['en-GB','fr-CA','ja-JP','es-ES','zh-CN']
							}
						],
						['When languages and brand languages are specified, the languagesSuperset property will contain the superset of the languages specified in the languages property and the languages specified for all of the brands in the brandLanguages property, without any duplicates',
							{
								languages:['en-GB','fr-FR'],
								brandLanguages:{
									fooBrand:['en-GB','fr-CA','ja-JP'],
									barBrand:['fr-CA','ja-JP','es-ES','zh-CN']
								}
							},
							{
								languages:['en-GB','fr-FR'],
								brandLanguages:{
									fooBrand:['en-GB','fr-CA','ja-JP'],
									barBrand:['fr-CA','ja-JP','es-ES','zh-CN']
								},
								languagesSuperset:['en-GB','fr-FR','fr-CA','ja-JP','es-ES','zh-CN']
							}
						],
						['The languages in the languagesSuperset property contain no duplicates, even if the specified common languages and brand languages contain duplicates',
							{
								languages:['en-GB','en-GB'],
								brandLanguages:{
									fooBrand:['fr-CA','fr-CA'],
									barBrand:['ja-JP','ja-JP','ja-JP','es-ES','es-ES','es-ES']
								}
							},
							{
								languages:['en-GB','en-GB'],
								brandLanguages:{
									fooBrand:['fr-CA','fr-CA'],
									barBrand:['ja-JP','ja-JP','ja-JP','es-ES','es-ES','es-ES']
								},
								languagesSuperset:['en-GB','fr-CA','ja-JP','es-ES']
							}
						]
					]],
					['Uize.Services.LocAdapter.doesBrandSupportLanguage',[
						['The configured pseudo-locale is considered a supported language for a brand, even if it is not explicitly configured in the list of supported common languages or languages for the brand',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP']
									},
									languagesSuperset:['en-GB','ja-JP'],
									pseudoLocale:'en-ZZ'
								},
								'fooBrand',
								'en-ZZ'
							],
							true
						],
						['A language is considered supported for a brand if it is one of the specified common languages for the project',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP']
									},
									languagesSuperset:['en-GB','ja-JP']
								},
								'fooBrand',
								'en-GB'
							],
							true
						],
						['A language is considered supported for a brand if it is one of the specified brand languages for the brand',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP']
									},
									languagesSuperset:['en-GB','ja-JP']
								},
								'fooBrand',
								'ja-JP'
							],
							true
						],
						['A language is considered unsupported for a brand if it is neither one of the specified common languages for the project, nor one of the specified brand languages for the brand',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP'],
										barBrand:['fr-FR']
									},
									languagesSuperset:['en-GB','ja-JP','fr-FR']
								},
								'fooBrand',
								'fr-FR'
							],
							false
						],
						['A language is considered supported for the empty brand (i.e. unbranded) if the language is one of the specified common languages for the project',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP'],
										barBrand:['fr-FR']
									},
									languagesSuperset:['en-GB','ja-JP','fr-FR']
								},
								'',
								'en-GB'
							],
							true
						],
						['A language is considered supported for the empty brand (i.e. unbranded) if the language is one of the specified brand languages for any of the brands',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP'],
										barBrand:['fr-FR']
									},
									languagesSuperset:['en-GB','ja-JP','fr-FR']
								},
								'',
								'ja-JP'
							],
							true
						],
						['A language is considered unsupported for the empty brand (i.e. unbranded) if the language is neither one of the specified common languages for the project, nor one of the specified brand languages for the brand',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP'],
										barBrand:['fr-FR']
									},
									languagesSuperset:['en-GB','ja-JP','fr-FR']
								},
								'',
								'es-ES'
							],
							false
						],
						['A language is considered supported for an unconfigured brand if the language is one of the specified common languages for the project',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP'],
										barBrand:['fr-FR']
									},
									languagesSuperset:['en-GB','ja-JP','fr-FR']
								},
								'bazBrand',
								'en-GB'
							],
							true
						],
						['A language is considered unsupported for an unconfigured brand if the language is not one of the specified common languages for the project',
							[
								{
									languages:['en-GB'],
									brandLanguages:{
										fooBrand:['ja-JP'],
										barBrand:['fr-FR']
									},
									languagesSuperset:['en-GB','ja-JP','fr-FR']
								},
								'bazBrand',
								'ja-JP'
							],
							false
						]
					]]
				])
			]
		});
	}
});

