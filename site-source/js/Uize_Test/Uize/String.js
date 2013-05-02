/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.String Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.String= module defines a suite of unit tests for the =Uize.String= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.String',
	required:[
		'Uize.Class',
		'Uize.Class.Value'
	],
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Test for Uize.String Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.String'),
				Uize.Test.staticMethodsTest ([
					['Uize.String.hasPadding',[
						['Test that leading whitespace is detected as padding',
							'   leading whitespace',
							true
						],
						['Test that trailing whitespace is detected as padding',
							'trailing whitespace     ',
							true
						],
						['Test that leading and trailing whitespace is detected as padding',
							'   leading and trailing whitespace   ',
							true
						],
						['Test that padding is not detected in a string that has no padding',
							'noPadding',
							false
						],
						['Test that whitespace only in the middle is not detected as padding',
							'no         padding',
							false
						],
						['Test that a string that is only whitespace is treated as having padding',
							'                ',
							true
						],
						['Test that an empty string is not considered to have padding',
							'',
							false
						]
					]],
					['Uize.String.hugJoin',[
						['Test that specifying prefix, suffix, and separator works',
							[['A','B','C','D','E'],'<','>','-'],
							'<A>-<B>-<C>-<D>-<E>'
						],
						['Test that specifying empty prefix, suffix, and separator works',
							[['A','B','C','D','E'],'','',''],
							'ABCDE'
						],
						['Test that specifying number type prefix, suffix, and separator works',
							[['A','B','C','D','E'],0,1,NaN],
							'0A1NaN0B1NaN0C1NaN0D1NaN0E1'
						],
						['Test that specifying boolean type prefix, suffix, and separator works',
							[['A','B','C','D','E'],false,true,true],
							'falseAtruetruefalseBtruetruefalseCtruetruefalseDtruetruefalseEtrue'
						],
						['Test that specifying object type prefix, suffix, and separator works',
							[
								['A','B','C','D','E'],
								Uize.Class.Value ({value:'<'}),
								Uize.Class.Value ({value:'>'}),
								Uize.Class.Value ({value:'-'})
							],
							'<A>-<B>-<C>-<D>-<E>'
						],
						['Test that specifying just prefix and suffix, but no separator, works',
							[['A','B','C','D','E'],'<','>'],
							'<A><B><C><D><E>'
						],
						['Test that specifying an empty array produces an empty string result',
							[[],'<','>','-'],
							''
						],
						['Test that specifying a non-zero length array that is unpopulated (elements are empty) works',
							[new Array (5),'<','>','-'],
							'<>-<>-<>-<>-<>'
						],
						['Test that specifying array containing different value types works',
							[[1,true,'hello',Infinity,NaN,null,undefined],'<','>','-'],
							'<1>-<true>-<hello>-<Infinity>-<NaN>-<>-<>'
						]
					]],
					['Uize.String.joinUsingSuffixPriority',[
						['Test when max length is greater than combined lengths of prefix and suffix',
							['prefix',' - suffix',20],
							'prefix - suffix'
						],
						['Test when max length is equal to combined lengths of prefix and suffix',
							['prefix',' - suffix',15],
							'prefix - suffix'
						],
						['Test when max length is less than combined lengths of prefix and suffix',
							['prefix',' - suffix',12],
							'pre - suffix'
						],
						['Test when max length is equal to length of suffix',
							['prefix',' - suffix',9],
							' - suffix'
						],
						['Test when max length is less than length of suffix',
							['prefix',' - suffix',6],
							' - suf'
						],
						['Test when max length is zero',
							['prefix',' - suffix',0],
							''
						],
						['Test when max length is negative',
							['prefix',' - suffix',-1],
							''
						]
					]],
					['Uize.String.limitLength',[
						['Test that max length of zero produces empty string',
							['0123456789',0],
							''
						],
						['Test that negative max length produces empty string',
							['0123456789',-1],
							''
						],
						['Test that max length greater than source string length produces source string',
							['0123456789',15],
							'0123456789'
						],
						['Test that max length equal to source string length produces source string',
							['0123456789',10],
							'0123456789'
						],
						['Test that max length less than source string length produces correct result',
							['0123456789',9],
							'012345...'
						],
						['Test that max length equal to continuation string length produces just truncated source string',
							['0123456789',3],
							'012'
						],
						['Test that max length less than continuation string length produces just truncated source string',
							['0123456789',1],
							'0'
						]
					]],
					['Uize.String.split',[
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
					['Uize.String.splitInTwo',[
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
					]],
					['Uize.String.startsWith',[
						['Test that an empty string starts with an empty string',
							['',''],
							true
						],
						['Test that a non-empty string starts with an empty string',
							['prefixSuffix',''],
							true
						],
						['Test that a suffix of source string doesn\'t test as a prefix',
							['prefixSuffix','Suffix'],
							false
						],
						['Test that prefix of larger string doesn\'t start with that larger string',
							['prefix','prefixSuffix'],
							false
						],
						['Test that suffix of larger string doesn\'t start with that larger string',
							['Suffix','prefixSuffix'],
							false
						],
						['Test that source string starts with itself',
							['prefixSuffix','prefixSuffix'],
							true
						],
						['Test that spaces in the middle of test string are significant',
							['prefixSuffix','prefix Suffix'],
							false
						],
						['Test that spaces at the end of test string are significant',
							['prefixSuffix','prefixSuffix   '],
							false
						],
						['Test that spaces at beginning of test string are significant',
							['prefixSuffix','   prefixSuffix'],
							false
						],
						['Test that string doesn\'t end with uppercase version of itself',
							['prefixSuffix','PREFIXSUFFIX'],
							false
						],
						['Test that string does start with a leading portion of itself',
							['prefixSuffix','prefix'],
							true
						],
						['Test that one character prefix works correctly',
							['prefixSuffix','p'],
							true
						],
						['Test that one character non-prefix works correctly',
							['prefixSuffix','-'],
							false
						],
						['Test that two character prefix works correctly',
							['prefixSuffix','pr'],
							true
						],
						['Test that two character non-prefix works correctly (first of two characters is non-match)',
							['prefixSuffix','-r'],
							false
						],
						['Test that two character non-prefix works correctly (second of two characters is non-match)',
							['prefixSuffix','p-'],
							false
						]
					]],
					['Uize.String.endsWith',[
						['Test that an empty string ends with an empty string',
							['',''],
							true
						],
						['Test that a non-empty string ends with an empty string',
							['prefixSuffix',''],
							true
						],
						['Test that a prefix of source string doesn\'t test as a suffix',
							['prefixSuffix','prefix'],
							false
						],
						['Test that prefix of larger string doesn\'t end with that larger string',
							['prefix','prefixSuffix'],
							false
						],
						['Test that suffix of larger string doesn\'t end with that larger string',
							['Suffix','prefixSuffix'],
							false
						],
						['Test that source string ends with itself',
							['prefixSuffix','prefixSuffix'],
							true
						],
						['Test that spaces in the middle of test string are significant',
							['prefixSuffix','prefix Suffix'],
							false
						],
						['Test that spaces at the end of test string are significant',
							['prefixSuffix','prefixSuffix   '],
							false
						],
						['Test that spaces at beginning of test string are significant',
							['prefixSuffix','   prefixSuffix'],
							false
						],
						['Test that string doesn\'t end with uppercase version of itself',
							['prefixSuffix','PREFIXSUFFIX'],
							false
						],
						['Test that string does end with a tail portion of itself',
							['prefixSuffix','Suffix'],
							true
						],
						['Test that one character suffix works correctly',
							['prefixSuffix','x'],
							true
						],
						['Test that one character non-suffix works correctly',
							['prefixSuffix','-'],
							false
						],
						['Test that two character suffix works correctly',
							['prefixSuffix','ix'],
							true
						],
						['Test that two character non-suffix works correctly (first of two characters is non-match)',
							['prefixSuffix','-x'],
							false
						],
						['Test that two character non-suffix works correctly (second of two characters is non-match)',
							['prefixSuffix','i-'],
							false
						]
					]],
					['Uize.String.contains',[
						['Test that an empty string contains an empty string',
							['',''],
							true
						],
						['Test that a non-empty string contains an empty string',
							['prefixMiddleSuffix',''],
							true
						],
						['Test that a string can\'t contain a string of which it is only a prefix',
							['prefix','prefixMiddleSuffix'],
							false
						],
						['Test that a string can\'t contain a string of which it is only a middle portion',
							['Middle','prefixMiddleSuffix'],
							false
						],
						['Test that a string can\'t contain a string of which it is only a suffix',
							['Suffix','prefixMiddleSuffix'],
							false
						],
						['Test that a string does contain a string that is its prefix',
							['prefixMiddleSuffix','prefix'],
							true
						],
						['Test that a string does contain a string that is a middle portion of it',
							['prefixMiddleSuffix','Middle'],
							true
						],
						['Test that a string does contain a string that is its suffix',
							['prefixMiddleSuffix','Suffix'],
							true
						]
					]],
					['Uize.String.repeat',[
						['Test that repeating an empty string one time produces an empty string',
							['',10],
							''
						],
						['Test that repeating an empty string a positive number of times produces an empty string',
							['',10],
							''
						],
						['Test that repeating a non-empty string zero times produces an empty string',
							['Blah',0],
							''
						],
						['Test that repeating a non-empty string a negative number of times produces an empty string',
							['Blah',-10],
							''
						],
						['Test that repeating a non-empty string one time produces that same string',
							['Blah',1],
							'Blah'
						],
						['Test that repeating a non-empty string a positive number of times works correctly',
							['Blah',10],
							'BlahBlahBlahBlahBlahBlahBlahBlahBlahBlah'
						],
						['Test that repeating a single space a positive number of times works correctly',
							[' ',10],
							'          '
						],
						{
							title:'Test that repeated use of repeating a single space works correctly (given the way that this special case is handled)',
							test:function () {
								return (
									Uize.String.repeat (' ',15) == '               ' &&
									Uize.String.repeat (' ',20) == '                    ' &&
									Uize.String.repeat (' ',9) == '         '
								);
							}
						}
					]],
					['Uize.String.toCamel',[
						['Test single lowercased word with no delimiters',
							'hello',
							'hello'
						],
						['Test single uppercased word with no delimiters',
							'HELLO',
							'hello'
						],
						['Test single lowercased word with no delimiters, but capitalize first character',
							['hello',true],
							'Hello'
						],
						['Test single uppercased word with no delimiters, but capitalize first character',
							['HELLO',true],
							'Hello'
						],
						['Test three lowercased words with space delimiters',
							'hello there john',
							'helloThereJohn'
						],
						['Test three lowercased words with space delimiters, capitalize first character',
							['hello there john',true],
							'HelloThereJohn'
						],
						['Test three uppercased words with space delimiters',
							'HELLO THERE JOHN',
							'helloThereJohn'
						],
						['Test three uppercased words with space delimiters, capitalize first character',
							['HELLO THERE JOHN',true],
							'HelloThereJohn'
						],
						['Test mixture of comma and space as delimiters',
							'city, state, zip',
							'cityStateZip'
						],
						['Test period character as delimiter',
							'www.uize.com',
							'wwwUizeCom'
						],
						['Test mixture of slashes and periods as delimiters',
							'theme/css/button.css',
							'themeCssButtonCss'
						],
						['Test hyphen character as delimiter',
							'nav-arrow-horz-next',
							'navArrowHorzNext'
						],
						['Test hyphen character as delimiter, with leading redundant hyphens',
							'--hyphens-are-cool--',
							'hyphensAreCool'
						],
						['Test specifying array instead of source string',
							[['employee address','city','state','zip']],
							'employeeAddressCityStateZip'
						]
					]],
					['Uize.String.trim',[
						['Test that trimming empty string produces empty string','',''],
						['Test that trimming string with no padding returns the same string','hello','hello'],
						['Test that trimming string with leading spaces works','   hello','hello'],
						['Test that trimming string with trailing spaces works','hello   ','hello'],
						['Test that trimming string with leading and trailing spaces works','   hello   ','hello'],
						['Test that trimming does not affect inner whitesapce',' hello \t there ','hello \t there'],
						['Test that trimming string with tab padding works','\t\thello\t\t','hello'],
						['Test that left-trimming can be performed by specifying -1 for the optional side parameter',
							['   hello   ',-1],
							'hello   '
						],
						['Test that right-trimming can be performed by specifying 1 for the optional side parameter',
							['   hello   ',1],
							'   hello'
						],
						['Test that trimming on both sides can be performed by specifying 0 for the optional side parameter',
							['   hello   ',0],
							'hello'
						]
					]],
					['Uize.String.trimLeft',[
						['Test that left-trimming empty string produces empty string','',''],
						['Test that left-trimming string with no padding returns the same string','hello','hello'],
						['Test that left-trimming string with leading spaces works','   hello','hello'],
						['Test that left-trimming string with trailing spaces works','hello   ','hello   '],
						['Test that left-trimming string with leading and trailing spaces works','   hello   ','hello   '],
						['Test that left-trimming does not affect inner whitesapce',' hello \t there ','hello \t there '],
						['Test that left-trimming string with tab padding works','\t\thello\t\t','hello\t\t']
					]],
					['Uize.String.trimRight',[
						['Test that right-trimming empty string produces empty string','',''],
						['Test that right-trimming string with no padding returns the same string','hello','hello'],
						['Test that right-trimming string with leading spaces works','   hello','   hello'],
						['Test that right-trimming string with trailing spaces works','hello   ','hello'],
						['Test that right-trimming string with leading and trailing spaces works','   hello   ','   hello'],
						['Test that right-trimming does not affect inner whitesapce',' hello \t there ',' hello \t there'],
						['Test that right-trimming string with tab padding works','\t\thello\t\t','\t\thello']
					]]
				])
			]
		});
	}
});

