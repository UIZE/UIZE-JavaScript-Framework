/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Camel Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		The =Uize.Test.Uize.Str.Camel= module defines a suite of unit tests for the =Uize.Str.Camel= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Camel',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Camel Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Camel'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Camel.to',[
						['When the source string is a single, lowercased word with no delimiters, then it is returned as is',
							'hello',
							'hello'
						],
						['When the source string is a single, uppercased word with no delimiters, then it is returned lowercased',
							'HELLO',
							'hello'
						],
						['When the source string is a single, lowercased word with no delimiters and the value true is specified for the optional capFirstChar second argument, then the first character of the result string is capitalized',
							['hello',true],
							'Hello'
						],
						['When the source string is a single, lowercased word with no delimiters and the value false is specified for the optional capFirstChar second argument, then the first character of the result string is not capitalized',
							['hello',false],
							'hello'
						],
						['When the source string is a single, uppercased word with no delimiters and the value true is specified for the optional capFirstChar second argument, then it is returned lowercased but with the first character capitalized',
							['HELLO',true],
							'Hello'
						],
						['When the source string is a single, uppercased word with no delimiters and the value false is specified for the optional capFirstChar second argument, then it is returned lowercased with the first character not capitalized',
							['HELLO',false],
							'hello'
						],
						['When the source string contains space-delimited, lowercased words, then the delimiters are removed and the words after the first word are capitalized',
							'hello there john',
							'helloThereJohn'
						],
						['When the source string contains space-delimited, lowercased words and the value true is specified for the optional capFirstChar second argument, then the delimiters are removed and all the words are capitalized',
							['hello there john',true],
							'HelloThereJohn'
						],
						['When the source string contains space-delimited, uppercased words, then the delimiters are removed, the words are lowercased, and the words after the first word are capitalized',
							'HELLO THERE JOHN',
							'helloThereJohn'
						],
						['When the source string contains space-delimited, uppercased words and the value true is specified for the optional capFirstChar second argument, then the delimiters are removed, the words are lowercased, and all the words are capitalized',
							['HELLO THERE JOHN',true],
							'HelloThereJohn'
						],
						['A combination of a comma and a space can be used to delimit words',
							'city, state, zip',
							'cityStateZip'
						],
						['A "." (period) character can be used to delimit words',
							'www.uize.com',
							'wwwUizeCom'
						],
						['A mixture of "/" (slash) characters and "." (period) characters can be used to delimit words',
							'theme/css/button.css',
							'themeCssButtonCss'
						],
						['A "-" (hyphen) character can be used to delimit words',
							'nav-arrow-horz-next',
							'navArrowHorzNext'
						],
						['A "_" (underscore) character can be used to delimit words',
							'nav_arrow_horz_next',
							'navArrowHorzNext'
						],
						['Redundant delimiters ar the start and end of the source string are ignored and do not affect word capitalization',
							'-hyphens-are-cool-',
							'hyphensAreCool'
						],
						['Words may be delimited by an arbitrary mix of one or more non-word characters',
							'-_%one#$....two!three:::four>>>five*six???seven===',
							'oneTwoThreeFourFiveSixSeven'
						],
						['When an array is specified as the source rather than a string, then the array is concatenated first to form a source string for camelCasing',
							[['employee address','city','state','zip']],
							'employeeAddressCityStateZip'
						]
					]],
					['Uize.Str.Camel.from',[
						['When the source string contains a single word, then it is returned as is',
							'hello',
							'hello'
						],
						['When the source string contains multiple words that are camelCased, then the words are separated at the capitalized first letters of each word, the first letters are lowercased, and the words are then concatenated using a "-" (hyphen) character as a delimiter',
							'oneTwoThreeFourFiveSixSeven',
							'one-two-three-four-five-six-seven'
						],
						['Every capitalized letter is treated as the start of a new word',
							'propertyAValue',
							'property-a-value'
						],
						['Digits are not treated as word starters',
							'property1Value',
							'property1-value'
						],
						['When the source string contains multiple words that are camelCased, and the very first word is capitalized, it is not prefixed with a delimiter',
							'FooBarBazQux',
							'foo-bar-baz-qux'
						],
						['When the value true is specified for the optional lowerCaseFirstChar decoding option, then the first character of each word in the camelCased source string is lowercased',
							['FooBarBazQux',{lowerCaseFirstChar:true}],
							'foo-bar-baz-qux'
						],
						['When the value false is specified for the optional lowerCaseFirstChar decoding option, then the first character of each word in the camelCased source string is left as is and is not lowercased',
							['FooBarBazQux',{lowerCaseFirstChar:false}],
							'Foo-Bar-Baz-Qux'
						],
						['When the value null is specified for the optional lowerCaseFirstChar decoding option, the value for this option is defaulted to true',
							['FooBarBazQux',{lowerCaseFirstChar:null}],
							'foo-bar-baz-qux'
						],
						['When the value undefined is specified for the optional lowerCaseFirstChar decoding option, the value for this option is defaulted to true',
							['FooBarBazQux',{lowerCaseFirstChar:undefined}],
							'foo-bar-baz-qux'
						],
						['A custom delimiter can be specified using the optional delimiter decoding option',
							['FooBarBazQux',{delimiter:'-=-'}],
							'foo-=-bar-=-baz-=-qux'
						],
						['When the value null is specified for the optional delimiter decoding option, the value for this option is defaulted to "-"',
							['FooBarBazQux',{delimiter:null}],
							'foo-bar-baz-qux'
						],
						['When the value undefined is specified for the optional delimiter decoding option, the value for this option is defaulted to "-"',
							['FooBarBazQux',{delimiter:undefined}],
							'foo-bar-baz-qux'
						],
						['When an empty string is specified for the optional delimiter decoding option, the words in the returned string will not be separated by any delimiter',
							['FooBarBazQux',{delimiter:''}],
							'foobarbazqux'
						]
					]]
				])
			]
		});
	}
});

