/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Has Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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
	required:'Uize.Class.Value',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Has Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Has'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Has.has',[
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
					['Uize.Str.Has.hasPrefix',[
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
					['Uize.Str.Has.hasSuffix',[
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
					]]
				])
			]
		});
	}
});

