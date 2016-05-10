/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Pseudo Class
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
		The =Uize.Test.Uize.Loc.Pseudo= module defines a suite of unit tests for the =Uize.Loc.Pseudo= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Pseudo',
	builder:function () {
		'use strict';

		var
			_alphabetCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			_alphabetCharactersLookup = Uize.lookup (_alphabetCharacters.split ('')),
			_nonAlphabetCharacters = Uize.map (
				127,
				function (_charCode) {
					var _char = String.fromCharCode (_charCode);
					return _char in _alphabetCharactersLookup ? '' : _char;
				}
			).join (''),
			_truthyValues = [true,'0',-1,{},[],function () {},/\d/],
			_falsyValues = [false,'',0,null,undefined,NaN]
		;

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Pseudo Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Pseudo'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Pseudo.accent',[
						['All alphabetical characters are converted to extended character set versions',
							_alphabetCharacters,
							'åƀçðéƒĝĥîĵķļɱñöþǫŕšţûṽŵẋýžÅƁÇÐÉƑĜĤÎĴĶĻṀÑÖÞǪŔŠŢÛṼŴẊÝŽ'
						],
						['Non-alphabetical characters in the ASCII character set are left unmodified',
							_nonAlphabetCharacters,
							_nonAlphabetCharacters
						]
					]],
					['Uize.Loc.Pseudo.pseudoLocalize',[
						['The options are defaulted when the optional options argument is not specified',
							'This pseudo-localization thing is pretty cool!',
							'[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]'
						],

						/*** test handling for the accent option ***/
							['When the optional options argument is specified, the value of the accent option is defaulted to true if it is not specified',
								['This pseudo-localization thing is pretty cool!',{}],
								'[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]'
							],
							{
								title:'When a falsy value (other than the values null or undefined) is specified for the accent property of the optional options argument, then accenting is disabled as expected',
								test:function () {
									var
										_testString = 'Test string',
										_unaccentedTestString = '[Test_ string__]',
										_actual = [],
										_expected = []
									;
									Uize.forEach (
										_falsyValues,
										function (_falsyValue) {
											if (_falsyValue != undefined) {
												_expected.push (_unaccentedTestString);
												_actual.push (Uize.Loc.Pseudo.pseudoLocalize (_testString,{accent:_falsyValue}))
											}
										}
									);
									return this.expect (_expected,_actual);
								}
							},
							{
								title:'When a truthy value is specified for the accent property of the optional options argument, then accenting is enabled as expected',
								test:function () {
									var
										_testString = 'Test string',
										_accentedTestString = '[Ţéšţ_ šţŕîñĝ__]',
										_actual = [],
										_expected = []
									;
									Uize.forEach (
										_truthyValues,
										function (_truthyValue) {
											_expected.push (_accentedTestString);
											_actual.push (Uize.Loc.Pseudo.pseudoLocalize (_testString,{accent:_truthyValue}))
										}
									);
									return this.expect (_expected,_actual);
								}
							},

						/*** test handling for the wrapper option ***/
							['When the optional options argument is specified, the value of the wrapper option is defaulted to square brackets if it is not specified',
								['This pseudo-localization thing is pretty cool!',{}],
								'[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]'
							],
							['When the value null is specified for the wrapper option, its value is defaulted to square brackets',
								['This pseudo-localization thing is pretty cool!',{wrapper:null}],
								'[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]'
							],
							['When the value undefined is specified for the wrapper option, its value is defaulted to square brackets',
								['This pseudo-localization thing is pretty cool!',{wrapper:null}],
								'[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]'
							],
							['When a two character wrapper is specified for the wrapper option, the first character is used as the opener and the second character is used as the closer',
								['This pseudo-localization thing is pretty cool!',{wrapper:'{}'}],
								'{Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!}'
							],
							['When a string with more than two characters is specified for the wrapper option, the first half is used as the opener and the second half is used as the closer',
								['This pseudo-localization thing is pretty cool!',{wrapper:'<~==~>'}],
								'<~=Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!=~>'
							],
							['When a string with an odd number of characters is specified for the wrapper option, the first half is used as the opener and the second half is used as the closer, and the opener has one less character than the closer',
								['This pseudo-localization thing is pretty cool!',{wrapper:'<~=+=~>'}],
								'<~=+Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!=~>'
							],
							['When an empty string is specified for the wrapper option, the returned result has no wrapper characters',
								['This pseudo-localization thing is pretty cool!',{wrapper:''}],
								'Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!'
							],

						/*** test handling for the expansion option ***/
							['When the optional options argument is specified, the value of the expansion option is defaulted to 1.3 if it is not specified',
								['0123456789',{}],
								'[0123456789___]'
							],
							['When the value null is specified for the expansion option, its value is defaulted to 1.3',
								['0123456789',{expansion:null}],
								'[0123456789___]'
							],
							['When the value undefined is specified for the expansion option, its value is defaulted to 1.3',
								['0123456789',{expansion:null}],
								'[0123456789___]'
							],
							['When the value NaN is specified for the expansion option, its value is defaulted to 1.3',
								['0123456789',{expansion:null}],
								'[0123456789___]'
							],
							['When the value 1 is specified for the expansion option, then no expansion is applied',
								['0123456789',{expansion:1}],
								'[0123456789]'
							],
							['When a value less than 1 is specified for the expansion option, then no expansion is applied',
								['0123456789',{expansion:.5}],
								'[0123456789]'
							],
							['When a value greater than 1 is specified for the expansion option, then the number of expansion characters that are added is equal to the expansion value minus one and then multiplied by the length of the source string',
								['0123456789',{expansion:2.5}],
								'[0123456789_______________]'
							],
							['When the source string has multiple words, the expansion characters are distributed across all the words, with the number of characters added to a word proportional to the size of the word',
								['123 123456 12345 12345678',{expansion:2}],
								'[123___ 123456______ 12345_____ 12345678________]'
							],
							['The number of expansion characters is based only on the lengths of the words and not whitespace, punctuation characters, or added wrapper characters',
								['The cat,     which was big and fat,     shat on the mat!!!',{expansion:2,wrapper:'<<<>>>'}],
								'<<<Ţĥé___ çåţ___,     ŵĥîçĥ_____ ŵåš___ ƀîĝ___ åñð___ ƒåţ___,     šĥåţ____ öñ__ ţĥé___ ɱåţ___!!!>>>'
							],

						/*** test handling for the expansionChar option ***/
							['When the optional options argument is specified, the value of the expansionChar option is defaulted to an underscore if it is not specified',
								['This pseudo-localization thing is pretty cool!',{}],
								'[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]'
							],
							['When an empty string is specified for the expansionChar option, in effect no expansion characters are added',
								['This pseudo-localization thing is pretty cool!',{expansion:2,expansionChar:''}],
								'[Ţĥîš þšéûðö-ļöçåļîžåţîöñ ţĥîñĝ îš þŕéţţý çööļ!]'
							],
							['When a character is specified for the expansionChar option, then the specified expansion character is used for the word expansion',
								['This pseudo-localization thing is pretty cool!',{expansionChar:'#'}],
								'[Ţĥîš# þšéûðö-ļöçåļîžåţîöñ###### ţĥîñĝ# îš# þŕéţţý## çööļ#!]'
							],

						/*** test handling for the wordSplitter option ***/
							['When the optional options argument is specified, the value of the wordSplitter option is defaulted to split on whitespace and punctuation',
								[
									'11 22	33\n44! 55,  66 - - 77? 88. 99; 00: 11. 22 (33\'s) "44" < 55 > [66 & 77 = 88]',
									{expansion:2}
								],
								'[11__ 22__	33__\n44__! 55__,  66__ -_ -_ 77__? 88__. 99__; 00:___ 11__. 22__ (33\'š____) "44__" < 55__ > [66__ & 77__ = 88__]]'
							],
							['When a custom word splitter regular expression is specified, it is used as expected to split the words in the source string',
								[
									'<div>This <b>pseudo-localization</b> thing is pretty cool!</div>',
									{wordSplitter:/((?:<.+?>|\{[^\}]+\}|\s|[\?!\.;,&=\(\)\[\]"])+)/g}
								],
								'[<div>Ţĥîš_ <b>þšéûðö-ļöçåļîžåţîöñ______</b> ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!</div>]'
							],

						/*** test handling for specifying an array as source ***/
							['When a string array is specified as the source, then all elements of the array are pseudo-localized, but the total expansion characters are calculated based upon the total word character count of all elements in the array, and the expansion characters are distributed appropriately across the elements',
								[
									['This','pseudo-localization','thing','is','pretty','cool!'],
									{wrapper:''}
								],
								['Ţĥîš_','þšéûðö-ļöçåļîžåţîöñ______','ţĥîñĝ_','îš_','þŕéţţý__','çööļ_!']
							]
					]]
				])
			]
		});
	}
});

