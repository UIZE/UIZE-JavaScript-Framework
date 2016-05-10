/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Strings.Metrics Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Loc.Strings.Metrics= module defines a suite of unit tests for the =Uize.Loc.Strings.Metrics= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Strings.Metrics',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Strings.Metrics Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Strings.Metrics'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Strings.Metrics.getStringMetrics',[
						['When the source string is an empty string, the word count is zero, the character count it zero, and there are no tokens.',
							[''],
							{
								words:0,
								chars:0,
								tokens:[]
							}
						],

						/*** test the default word splitter ***/
							['With the default word splitter, whitespace splits words and does not contribute to the character count',
								['Word word    word\tword\nword\n\n\nword'],
								{
									words:6,
									chars:24,
									tokens:[]
								}
							],
							['With the default word splitter, punctuation splits words and does not contribute to the character count',
								['Word,word:word;word.Word!!!!Word????'],
								{
									words:6,
									chars:24,
									tokens:[]
								}
							],
							['Basic word and character count metrics can be calculated for a simple string using the default word splitter.',
								['This is a very basic sentence with no fancy punctuation.'],
								{
									words:10,
									chars:46,
									tokens:[]
								}
							],
							['With the default word splitter, numbers are not considered to be words and do not contribute to the character count',
								['Word 1 word 0 1234 1.234 123.456 word'],
								{
									words:3,
									chars:12,
									tokens:[]
								}
							],

						/*** test a custom word splitter ***/
							['A custom word splitter can be specified in otder to deal with situations like strings that contain HTML markup',
								[
									'<div>This <b>string</b> contains some HTML markup!</div>',
									/((?:<.+?>|\s|[\?!\.;,&=\(\)\[\]"])+)/g
								],
								{
									words:6,
									chars:32,
									tokens:[]
								}
							],
							['When the word splitter produces empty word segments between word splitter segments, those empty word segments do not contribute to the word or character counts',
								['Word.........word',/(\.)/g],
								{
									words:2,
									chars:8,
									tokens:[]
								}
							],

						/*** test a custom token matcher ***/
							['When a token matcher is specified, the names of the tokens in the source string are returned as a part of the metrics, and the tokens do not contribute to the word or character counts',
								[
									'This string has a %firstToken% and a %secondToken%.',
									/((?:%\w+%|\s|[\?!\.;,&=\(\)\[\]"])+)/g,
									/%(\w+)%/g
								],
								{
									words:6,
									chars:18,
									tokens:['firstToken','secondToken']
								}
							],
							['When a token is used multiple times inside the same string, only one entry for it is added to the tokens array that is returned as a part of the metrics',
								[
									'This string has a %firstToken% and a %secondToken% and repeats the %firstToken%.',
									/((?:%\w+%|\s|[\?!\.;,&=\(\)\[\]"])+)/g,
									/%(\w+)%/g
								],
								{
									words:9,
									chars:31,
									tokens:['firstToken','secondToken']
								}
							],
							['A token matcher regular expression may contain multiple token name captures for different token patterns, and the names of tokens of all pattern types are correctly added to the tokens array',
								[
									'This string has a %firstToken% and a {secondToken} and a <thirdToken>.',
									/((?:%\w+%|\{\w+\}|<\w+>|\s|[\?!\.;,&=\(\)\[\]"])+)/g,
									/%(\w+)%|\{(\w+)\}|<(\w+)>/g
								],
								{
									words:8,
									chars:22,
									tokens:['firstToken','secondToken','thirdToken']
								}
							]
					]],
					['Uize.Loc.Strings.Metrics.getStringsMetrics',[
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
								tokenUsageSummary:[],
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

