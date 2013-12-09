/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Split Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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
		The =Uize.Test.Uize.Str.Split= module defines a suite of unit tests for the =Uize.Str.Split= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Split',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Split Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Split'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Split.split',[
						/*** test string type splitters ***/
							['Test that splitting an empty string using an empty string for the splitter produces an empty array',
								['',''],
								[]
							],
							['Test that splitting an empty string using a non-empty string for the splitter produces an array with a single element that is an empty string',
								['','-'],
								['']
							],
							['Test that splitting a non-empty string using an empty string for the splitter produces an array containing all the characters of the string as its elements',
								['FOOBAR',''],
								['F','O','O','B','A','R']
							],
							['Test that splitting a non-empty string using a non-empty string for the splitter that is present in the string being split is handled correctly',
								['FOO_+_BAR_+_FOREVER','_+_'],
								['FOO','BAR','FOREVER']
							],
							['Test that splitting a non-empty string using a non-empty string for the splitter that isn\'t present in the string being split produces an array with a single element that is the string being split',
								['FOOBARFOREVER','_'],
								['FOOBARFOREVER']
							],
							['Test that splitting a non-empty string using a splitter string that matches just the first part of the string being split results in an array with two elements, where the first element is an empty string and the second element is the string after the splitter match',
								['123456FOOBAR','123456'],
								['','FOOBAR']
							],
							['Test that splitting a non-empty string using a splitter that matches just the last part of the string being split results in an array with two elements, where the first element is the string up to the splitter match and the second element is an empty string',
								['FOOBAR123456','123456'],
								['FOOBAR','']
							],
							['Test that splitting a non-empty string using a non-empty string for the splitter that is the entire string being split produces an array with two elements that are empty strings',
								['FOOBARFOREVER','FOOBARFOREVER'],
								['','']
							],
							/*** test support for optional limit ***/
								['Test that specifying an optional limit of zero elements produces an empty array, even when there are more than zero elements possible in the result array',
									['FOOBAR','',0],
									[]
								],
								['Test that specifying an optional limit of three elements produces an array containing three elements, even when there are more than three elements possible in the result array',
									['FOOBAR','',3],
									['F','O','O']
								],

						/*** test support for regular expression splitters ***/
							['Test that splitting an empty string using a regular expression that matches an empty string produces an empty array',
								['',/-?/],
								[]
							],
							['Test that splitting an empty string using a regular expression that produces no matches produces an array with a single element that is an empty string',
								['',/-/],
								['']
							],
							['Test that splitting a non-empty string using a regular expression that matches the entire string being split produces an array with two elements that are empty strings',
								['FOO_BAR_FOREVER',/^.*$/],
								['','']
							],
							['Test that splitting a non-empty string using a regular expression that produces a zero length match produces an array containing all the characters of the string as its elements',
								['FOOBARFOREVER',/-?/],
								['F','O','O','B','A','R','F','O','R','E','V','E','R']
							],
							['Test that splitting a non-empty string using a regular expression that is matched in the string being split is handled correctly',
								['FOO__BAR_____FOREVER',/_+/],
								['FOO','BAR','FOREVER']
							],
							['Test that splitting a non-empty string using a regular expression that is not matched in the string being split produces an array with a single element that is the string being split',
								['FOO_BAR_FOREVER',/-+/],
								['FOO_BAR_FOREVER']
							],
							['Test that splitting a non-empty string using a regular expression that matches every character of the string being split produces an array whose length is one greater than the length of the string being split, and where every element is an empty string',
								['FOO_BAR_FOREVER',/./],
								['','','','','','','','','','','','','','','','']
							],
							['Test that splitting a non-empty string using a regular expression that matches just the first part of the string being split results in an array with two elements, where the first element is an empty string and the second element is the string after the splitter match',
								['123456FOOBAR',/\d+/],
								['','FOOBAR']
							],
							['Test that splitting a non-empty string using a regular expression that matches just the last part of the string being split results in an array with two elements, where the first element is the string up to the splitter match and the second element is an empty string',
								['FOOBAR123456',/\d+/],
								['FOOBAR','']
							],
							/*** test support for captures ***/
								['Test that captures in a regular expression splitter are added to the result array',
									['FOO_-_BAR_-_FOREVER',/((_)(-)(_))/],
									['FOO','_-_','_','-','_','BAR','_-_','_','-','_','FOREVER']
								],
								['Test that captures in a regular expression splitter are added to the result array (part two)',
									['foo',/(((((())))))/],
									['f','','','','','','','o','','','','','','','o']
								],
								['Test that captures in a regular expression splitter are not added to the result array if the splitter match is past the end of the string',
									['f',/(((((())))))/],
									['f']
								],

							/*** test support for optional limit ***/
								['Test that specifying an optional limit of zero elements produces an empty array, even when there are more than zero elements possible in the result array',
									['FOOBAR',/-?/,0],
									[]
								],
								['Test that specifying an optional limit of three elements produces an array containing three elements, even when there are more than three elements possible in the result array',
									['FOOBAR',/-?/,3],
									['F','O','O']
								],

						/*** test support for non-string and non-regex splitters ***/
							['Test that a splitter that is a number is handled correctly',
								['FOO1BAR1FOREVER',1],
								['FOO','BAR','FOREVER']
							],
							['Test that a splitter that is a boolean is handled correctly',
								['FOOfalseBARfalseFOREVER',false],
								['FOO','BAR','FOREVER']
							],
							['Test that a splitter that is null is handled correctly',
								['FOOnullBARnullFOREVER',null],
								['FOO','BAR','FOREVER']
							],
							['Test that a splitter that is undefined is handled correctly',
								['FOOundefinedBARundefinedFOREVER',undefined],
								['FOO','BAR','FOREVER']
							],
							['Test that a splitter that is an array is handled correctly',
								['FOO1,2,3BAR1,2,3FOREVER',[1,2,3]],
								['FOO','BAR','FOREVER']
							]
					]],
					['Uize.Str.Split.splitInTwo',[
						['Test using a string splitter',
							['TITLE: The Matrix: Reloaded',': '],
							['TITLE','The Matrix: Reloaded']
						],
						['Test using a regular expression splitter',
							['TITLE   :   The Matrix: Reloaded',/\s*:\s*/],
							['TITLE','The Matrix: Reloaded']
						],
						['Test when the specified splitter string is not in the source string',
							['TITLE: The Matrix: Reloaded','---'],
							['TITLE: The Matrix: Reloaded','']
						],
						['Test when the specified splitter regular expression is not matched in the source string',
							['TITLE: The Matrix: Reloaded',/\s*---\s*/],
							['TITLE: The Matrix: Reloaded','']
						],
						['Test when the specified splitter string is an empty string',
							['TITLE: The Matrix: Reloaded',''],
							['','TITLE: The Matrix: Reloaded']
						],
						['Test when the specified splitter is null',
							['TITLE: The Matrix: Reloaded',null],
							['TITLE: The Matrix: Reloaded','']
						]
					]]
				])
			]
		});
	}
});

