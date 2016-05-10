/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Strings.PluralUtils Class
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
		The =Uize.Test.Uize.Loc.Strings.PluralUtils= module defines a suite of unit tests for the =Uize.Loc.Strings.PluralUtils= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Strings.PluralUtils',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Strings.PluralUtils Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Strings.PluralUtils'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Strings.PluralUtils.processPluralStrings',[
						{
							title:'A language resources object may contain multiple plural strings, at different levels in the resources object hierarchy, and all plural strings - and only plural strings - will be processed by the specified processor function',
							test:function () {
								var
									_newMessages = {
										one:'You have {count} new message.',
										other:'You have {count} new messages.'
									},
									_confirmDelete = {
										one:'Are you sure you would like to delete the {count} selected file?',
										other:'Are you sure you would like to delete the {count} selected files?'
									},
									_minutesRemaining = {
										one:'You have {count} remaining service minute.',
										other:'You have {count} remaining service minutes.',
										junk:{
											one:'You have {count} remaining service minute.',
											other:'You have {count} remaining service minutes.'
										}
									},
									_processedPluralStrings = []
								;
								Uize.Loc.Strings.PluralUtils.processPluralStrings (
									{
										messages:{
											newMessages:_newMessages,
											confirmDelete:_confirmDelete,
											moreMessages:{
												minutesRemaining:_minutesRemaining
											}
										},
										welcome:'Welcome to the Foo Bar messenger application',
										errors:{
											fileNotFound:'The file you specified could not be found.',
											requestFailed:'Your request could not be processed at this time.'
										},
										one:'One cow jumped over the moon.',
										other:'Other string that is not a plural variant'
									},
									function (_pluralString) {
										_processedPluralStrings.push (_pluralString);
									}
								);
								return (
									this.expect (3,_processedPluralStrings.length) &&
									this.expectSameAs (_newMessages,_processedPluralStrings [0]) &&
									this.expectSameAs (_confirmDelete,_processedPluralStrings [1]) &&
									this.expectSameAs (_minutesRemaining,_processedPluralStrings [2])
								);
							}
						}
					]],
					['Uize.Loc.Strings.PluralUtils.isPluralString',[
						['A string type value is not considered a plural string',
							'You have {count} new messages.',
							false
						],
						['An object is not considered a plural string if it does not contain an "other" property',
							{
								zero:'You have {count} new messages.',
								one:'You have {count} new message.',
								two:'You have {count} new messages.',
								few:'You have {count} new messages.',
								many:'You have {count} new messages.'
							},
							false
						],
						['An object is considered a plural string if contains an "other" property whose value is a string',
							{
								other:'You have {count} new messages.'
							},
							true
						],
						['A plural string object may contain properties for all the plural classes, as long as it contains at least an "other" property whose value is a string',
							{
								zero:'You have {count} new messages.',
								one:'You have {count} new message.',
								two:'You have {count} new messages.',
								few:'You have {count} new messages.',
								many:'You have {count} new messages.',
								other:'You have {count} new messages.'
							},
							true
						]
					]],
					['Uize.Loc.Strings.PluralUtils.normalizePluralStringsForPrimaryLanguage',[
						['When the primary language resources contains plural strings, the plural strings are normalized to contain values for the "zero", "two", "few", and "many" plural classes that are derived from the value of the "other" plural class"',
							{
								messages:{
									newMessages:{
										one:'You have {count} new message.',
										other:'You have {count} new messages.'
									},
									confirmDelete:{
										one:'Are you sure you would like to delete the {count} selected file?',
										other:'Are you sure you would like to delete the {count} selected files?'
									}
								},
								welcome:'Welcome to the Foo Bar messenger application',
								errors:{
									fileNotFound:'The file you specified could not be found.',
									requestFailed:'Your request could not be processed at this time.'
								}
							},
							{
								messages:{
									newMessages:{
										zero:'You have {count} new messages.',
										one:'You have {count} new message.',
										two:'You have {count} new messages.',
										few:'You have {count} new messages.',
										many:'You have {count} new messages.',
										other:'You have {count} new messages.'
									},
									confirmDelete:{
										zero:'Are you sure you would like to delete the {count} selected files?',
										one:'Are you sure you would like to delete the {count} selected file?',
										two:'Are you sure you would like to delete the {count} selected files?',
										few:'Are you sure you would like to delete the {count} selected files?',
										many:'Are you sure you would like to delete the {count} selected files?',
										other:'Are you sure you would like to delete the {count} selected files?'
									}
								},
								welcome:'Welcome to the Foo Bar messenger application',
								errors:{
									fileNotFound:'The file you specified could not be found.',
									requestFailed:'Your request could not be processed at this time.'
								}
							}
						]
					]],
					['Uize.Loc.Strings.PluralUtils.normalizePluralStringsForTranslatableLanguage',[
						['When the translatable language resources contains plural strings, the plural strings are normalized to contain values for all plural classes, but where the values for the plural classes not supported by the language are set to the dummy value "---"',
							[
								{
									messages:{
										newMessages:{
											other:'你有{count}个新的消息。'
										},
										confirmDelete:{
											other:'你确定要删除选定的{count}个文件？'
										}
									},
									welcome:'欢迎来到富律师信使应用程序',
									errors:{
										fileNotFound:'您指定的文件找不到。',
										requestFailed:'您的请求不能在此时进行处理。'
									}
								},
								'zh-CN'
							],
							{
								messages:{
									newMessages:{
										zero:'---',
										one:'---',
										two:'---',
										few:'---',
										many:'---',
										other:'你有{count}个新的消息。'
									},
									confirmDelete:{
										zero:'---',
										one:'---',
										two:'---',
										few:'---',
										many:'---',
										other:'你确定要删除选定的{count}个文件？'
									}
								},
								welcome:'欢迎来到富律师信使应用程序',
								errors:{
									fileNotFound:'您指定的文件找不到。',
									requestFailed:'您的请求不能在此时进行处理。'
								}
							}
						]
					]],
					['Uize.Loc.Strings.PluralUtils.removeUnsupportedPluralsForTranslatableLanguage',[
						['When the translatable language resources contains plural strings, properties in the plural string objects for plural classes that are not supported by the language are removed',
							[
								{
									messages:{
										newMessages:{
											zero:'---',
											one:'---',
											two:'---',
											few:'---',
											many:'---',
											other:'你有{count}个新的消息。'
										},
										confirmDelete:{
											zero:'---',
											one:'---',
											two:'---',
											few:'---',
											many:'---',
											other:'你确定要删除选定的{count}个文件？'
										}
									},
									welcome:'欢迎来到富律师信使应用程序',
									errors:{
										fileNotFound:'您指定的文件找不到。',
										requestFailed:'您的请求不能在此时进行处理。'
									}
								},
								'zh-CN'
							],
							{
								messages:{
									newMessages:{
										other:'你有{count}个新的消息。'
									},
									confirmDelete:{
										other:'你确定要删除选定的{count}个文件？'
									}
								},
								welcome:'欢迎来到富律师信使应用程序',
								errors:{
									fileNotFound:'您指定的文件找不到。',
									requestFailed:'您的请求不能在此时进行处理。'
								}
							}
						]
					]]
				])
			]
		});
	}
});

