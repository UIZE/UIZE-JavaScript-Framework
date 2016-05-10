/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Has Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Str.Has= module defines a suite of unit tests for the =Uize.Str.Has= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Has',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Has Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Has'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Has.has',[
						['An empty string does contain an empty string',
							['',''],
							true
						],
						['A non-empty string does contain an empty string',
							['prefixMiddleSuffix',''],
							true
						],
						['A string does not contain a string of which it is only a prefix',
							['prefix','prefixMiddleSuffix'],
							false
						],
						['A string does not contain a string of which it is only a middle portion',
							['Middle','prefixMiddleSuffix'],
							false
						],
						['A string does not contain a string of which it is only a suffix',
							['Suffix','prefixMiddleSuffix'],
							false
						],
						['A string does contain a string that is its prefix',
							['prefixMiddleSuffix','prefix'],
							true
						],
						['A string does contain a string that is a middle portion of it',
							['prefixMiddleSuffix','Middle'],
							true
						],
						['A string does contain a string that is its suffix',
							['prefixMiddleSuffix','Suffix'],
							true
						]
					]],
					['Uize.Str.Has.hasPrefix',[
						['An empty string starts with an empty string',
							['',''],
							true
						],
						['A non-empty string starts with an empty string',
							['prefixSuffix',''],
							true
						],
						['A suffix of the source string doesn\'t test as a prefix',
							['prefixSuffix','Suffix'],
							false
						],
						['The prefix of a larger string does not start with that larger string',
							['prefix','prefixSuffix'],
							false
						],
						['The suffix of a larger string does not start with that larger string',
							['Suffix','prefixSuffix'],
							false
						],
						['A source string starts with itself',
							['prefixSuffix','prefixSuffix'],
							true
						],
						['Spaces in the middle of test string are significant',
							['prefixSuffix','prefix Suffix'],
							false
						],
						['Spaces at the end of test string are significant',
							['prefixSuffix','prefixSuffix   '],
							false
						],
						['Spaces at beginning of test string are significant',
							['prefixSuffix','   prefixSuffix'],
							false
						],
						['A mixed case string does not end with an uppercased version of itself',
							['prefixSuffix','PREFIXSUFFIX'],
							false
						],
						['A string does start with a leading portion of itself',
							['prefixSuffix','prefix'],
							true
						],
						['A string does start with a single character prefix, if that character is the first character of the string',
							['prefixSuffix','p'],
							true
						],
						['A string does not start with a single character prefix, if that character is not the first character of the string',
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
					['Uize.Str.Has.hasSuffix',[
						['An empty string ends with an empty string',
							['',''],
							true
						],
						['A non-empty string ends with an empty string',
							['prefixSuffix',''],
							true
						],
						['A prefix of a source string does not test as a suffix',
							['prefixSuffix','prefix'],
							false
						],
						['The prefix of a larger string does not end with that larger string',
							['prefix','prefixSuffix'],
							false
						],
						['The suffix of a larger string does not end with that larger string',
							['Suffix','prefixSuffix'],
							false
						],
						['A source string ends with itself',
							['prefixSuffix','prefixSuffix'],
							true
						],
						['Spaces in the middle of test string are significant',
							['prefixSuffix','prefix Suffix'],
							false
						],
						['Spaces at the end of test string are significant',
							['prefixSuffix','prefixSuffix   '],
							false
						],
						['Spaces at beginning of test string are significant',
							['prefixSuffix','   prefixSuffix'],
							false
						],
						['A mixed case string does not end with an uppercased version of itself',
							['prefixSuffix','PREFIXSUFFIX'],
							false
						],
						['A string does end with a tail portion of itself',
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
					]]
				])
			]
		});
	}
});

