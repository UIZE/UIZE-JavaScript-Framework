/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Strings.Util Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 70
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Loc.Strings.Util= module defines a suite of unit tests for the =Uize.Loc.Strings.Util= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Strings.Util',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_translatableLanguageStrings = {
					widget1:{
						translatableString1:'[Widget 1, Translatable String 1]',
						$nonTranslatableString1:'',
						translatableString2:'[Widget 1, Translatable String 2]',
						$nonTranslatableString2:'[Widget 1, Non-translatable String 2]'
					},
					widget2:{
						translatableString1:'[Widget 2, Translatable String 1]',
						$nonTranslatableString1:'[Widget 2, Non-translatable String 1]',
						translatableString2:'',
						$nonTranslatableString2:''
					}
				},
				_primaryLanguageStrings = {
					widget1:{
						translatableString1:'Widget 1, Translatable String 1',
						$nonTranslatableString1:'Widget 1, Non-Translatable String 1',
						translatableString2:'Widget 1, Translatable String 2',
						$nonTranslatableString2:'Widget 1, Non-translatable String 2',
						translatableString3:'Widget 1, Translatable String 3',
						$nonTranslatableString3:'Widget 1, Non-Translatable String 3'
					},
					widget2:{
						translatableString1:'Widget 2, Translatable String 1',
						$nonTranslatableString1:'Widget 2, Non-translatable String 1',
						translatableString2:'Widget 2, Translatable String 2',
						$nonTranslatableString2:'Widget 2, Non-translatable String 2',
						translatableString3:'Widget 2, Translatable String 3',
						$nonTranslatableString3:'Widget 2, Non-Translatable String 3'
					}
				}
		;

		function _isStringTranslatable (_string) {
			return _string.key.charAt (0) != '$';
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Strings.Util Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Strings.Util'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Strings.Util.initNonTranslatable',[
						['When the value "never" is specified for the initNonTranslatable parameter, then the non-translatable strings for the translatable language are left as is',
							[
								Uize.clone (_translatableLanguageStrings),
								Uize.clone (_primaryLanguageStrings),
								'never',
								_isStringTranslatable
							],
							Uize.clone (_translatableLanguageStrings)
						],
						['When the value "blank" is specified for the initNonTranslatable parameter, then the values for all non-translatable strings for the translatable language are initialized to an empty string',
							[
								Uize.clone (_translatableLanguageStrings),
								Uize.clone (_primaryLanguageStrings),
								'blank',
								_isStringTranslatable
							],
							{
								widget1:{
									translatableString1:'[Widget 1, Translatable String 1]',
									$nonTranslatableString1:'',
									translatableString2:'[Widget 1, Translatable String 2]',
									$nonTranslatableString2:''
								},
								widget2:{
									translatableString1:'[Widget 2, Translatable String 1]',
									$nonTranslatableString1:'',
									translatableString2:'',
									$nonTranslatableString2:''
								}
							}
						],
						['When the value "primary" is specified for the initNonTranslatable parameter, then the value for each non-translatable string for the translatable language is initialized to the corresponding value for the string from the primary language',
							[
								Uize.clone (_translatableLanguageStrings),
								Uize.clone (_primaryLanguageStrings),
								'primary',
								_isStringTranslatable
							],
							{
								widget1:{
									translatableString1:'[Widget 1, Translatable String 1]',
									$nonTranslatableString1:'Widget 1, Non-Translatable String 1',
									translatableString2:'[Widget 1, Translatable String 2]',
									$nonTranslatableString2:'Widget 1, Non-translatable String 2'
								},
								widget2:{
									translatableString1:'[Widget 2, Translatable String 1]',
									$nonTranslatableString1:'Widget 2, Non-translatable String 1',
									translatableString2:'',
									$nonTranslatableString2:'Widget 2, Non-translatable String 2'
								}
							}
						],
						['When the value "primary-if-blank" is specified for the initNonTranslatable parameter, then the value for each blank non-translatable string for the translatable language is initialized to the corresponding value for the string from the primary language',
							[
								Uize.clone (_translatableLanguageStrings),
								Uize.clone (_primaryLanguageStrings),
								'primary-if-blank',
								_isStringTranslatable
							],
							{
								widget1:{
									translatableString1:'[Widget 1, Translatable String 1]',
									$nonTranslatableString1:'Widget 1, Non-Translatable String 1',
									translatableString2:'[Widget 1, Translatable String 2]',
									$nonTranslatableString2:'[Widget 1, Non-translatable String 2]'
								},
								widget2:{
									translatableString1:'[Widget 2, Translatable String 1]',
									$nonTranslatableString1:'[Widget 2, Non-translatable String 1]',
									translatableString2:'',
									$nonTranslatableString2:'Widget 2, Non-translatable String 2'
								}
							}
						],
						['When a falsy value is specified for the initNonTranslatable parameter, then it is defaulted to  "primary-if-blank"',
							[
								Uize.clone (_translatableLanguageStrings),
								Uize.clone (_primaryLanguageStrings),
								null,
								_isStringTranslatable
							],
							{
								widget1:{
									translatableString1:'[Widget 1, Translatable String 1]',
									$nonTranslatableString1:'Widget 1, Non-Translatable String 1',
									translatableString2:'[Widget 1, Translatable String 2]',
									$nonTranslatableString2:'[Widget 1, Non-translatable String 2]'
								},
								widget2:{
									translatableString1:'[Widget 2, Translatable String 1]',
									$nonTranslatableString1:'[Widget 2, Non-translatable String 1]',
									translatableString2:'',
									$nonTranslatableString2:'Widget 2, Non-translatable String 2'
								}
							}
						]
					]],
					['Uize.Loc.Strings.Util.serializeStringPath',[
						['A string path containing multiple elements can be serialized',
							[['foo/bar.properties','widgetName','stringKey',0]],
							'[\'foo/bar.properties\',\'widgetName\',\'stringKey\',0]'
						]
					]],
					['Uize.Loc.Strings.Util.parseStringPath',[
						['A serialized string path containing multiple elements can be parsed',
							'[\'foo/bar.properties\',\'widgetName\',\'stringKey\',0]',
							['foo/bar.properties','widgetName','stringKey',0]
						]
					]],
					['Uize.Loc.Strings.Util.removeEmptyStrings',[
						['All empty string values in a hierarchical strings object can be removed',
							{
								foo:'',
								bar:undefined,
								baz:{
									qux:''
								},
								nux:'nux nux nux',
								hello:{
									world:null,
									helloAgain:{
										helloAgainAgain:''
									}
								}
							},
							{
								bar:undefined,
								nux:'nux nux nux',
								hello:{
									world:null
								}
							}
						]
					]],
					['Uize.Loc.Strings.Util.pseudoLocalizeResources',[
						['All translatable string values in a hierarchical project strings object can be pseudo-localized',
							[
								{
									'folder1/file1.properties':{
										foo:'foo',
										bar:'bar',
										$baz:'baz'
									},
									'folder2/file2.properties':{
										widget1:{
											title:'Widget 1 Title',
											tooltip:'Widget 1 Tooltip',
											$url:'http://www.somewhere.com'
										},
										page:{
											widget2:{
												title:'Widget 2 Title',
												tooltip:'Widget 2 Tooltip',
												$color:'red'
											},
											widget3:{
											}
										}
									}
								},
								function (_string) {return _string.key.charAt (0) != '$'},
								function (_string) {return _string.value.toUpperCase ()}
							],
							{
								'folder1/file1.properties':{
									foo:'FOO',
									bar:'BAR',
									$baz:'baz'
								},
								'folder2/file2.properties':{
									widget1:{
										title:'WIDGET 1 TITLE',
										tooltip:'WIDGET 1 TOOLTIP',
										$url:'http://www.somewhere.com'
									},
									page:{
										widget2:{
											title:'WIDGET 2 TITLE',
											tooltip:'WIDGET 2 TOOLTIP',
											$color:'red'
										},
										widget3:{
										}
									}
								}
							}
						]
					]],
					['Uize.Loc.Strings.Util.stringsMetricsFromStringsInfo',[
						['The word and character counts for non-translatable strings are not added to the total word and character counts for the strings metrics',
							[
								[
									{
										path:['foo/bar.strings','STRING1'],
										value:'This is some text from string 1',
										metrics:{
											words:6,
											chars:24,
											tokens:[]
										},
										isBrandSpecific:false,
										brand:'',
										hasHtml:false,
										isLong:false,
										isKeyValid:true,
										hasWeakTokens:false,
										isTranslatable:true
									},
									{
										path:['foo/bar.strings','ERROR_CODE'],
										value:'GENERICERROR',
										metrics:{
											words:1,
											chars:12,
											tokens:[]
										},
										isBrandSpecific:false,
										brand:'',
										hasHtml:false,
										isLong:false,
										isKeyValid:true,
										hasWeakTokens:false,
										isTranslatable:false
									}
								]
							],
							{
								resourceStrings:{
									all:2,
									brandSpecific:0,
									tokenized:0,
									html:0,
									long:0,
									invalidKey:0,
									weakTokens:0,
									nonTranslatable:1,
									duped:0,
									perBrand:{}
								},
								wordCount:{
									all:6,
									brandSpecific:0,
									perBrand:{}
								},
								charCount:{
									all:24,
									brandSpecific:0,
									perBrand:{}
								},
								tokens:0,
								dupedResourceStringsDetails:{},
								tokenUsage:{},
								tokenHistogram:{
									0:2
								},
								wordCountHistogram:{
									0:1,
									6:1
								},
								charCountHistogram:{
									0:1,
									24:1
								}
							}
						]
						/*
							- test that word count is tallied correctly
							- test that the word count histogram is compiled correctly
							- test that char count is tallied correctly
							- test that the char count histogram is compiled correctly

							- test that the duped resource string details is compiled correctly
							- test that the token usage obect and histogram are compiled correctly

							- test that brands are tallied correctly
							- test that tokens are tallied correctly

							- test that strings containing HTML are tallied correctly
							- test that long strings are tallied correctly
							- test that strings with invalid keys are tallied correctly
							- test that strings with weak tokens are tallied correctly
							- test that non-translatable strings are tallied correctly
						*/
					]]
				])
			]
		});
	}
});

