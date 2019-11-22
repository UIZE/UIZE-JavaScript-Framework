/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Has Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.Has= module provides methods for testing if a string starts with, ends with, or contains a specified substring.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Has',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _stringHasPrefixOrSuffix (_sourceStr,_subStr,_isSuffixTest) {
				if (!_subStr) return true;
				if (!_sourceStr) return false;
				var
					_sourceStrLength = _sourceStr.length,
					_subStrLength = _subStr.length,
					_startPos = _isSuffixTest ? _sourceStrLength - _subStrLength : 0,
					_endPos = _startPos + _subStrLength - 1
				;
				return (
					_subStrLength <= _sourceStrLength &&
					_sourceStr.charCodeAt (_startPos) == _subStr.charCodeAt (0) &&
					(
						_subStrLength == 1 ||
						(
							_sourceStr.charCodeAt (_endPos) == _subStr.charCodeAt (_subStrLength - 1) &&
							(
								_subStrLength == 2 ||
								(
									_subStrLength == _sourceStrLength
										? _subStr == _sourceStr
										: _isSuffixTest
											? _sourceStr.indexOf (_subStr,_startPos) == _startPos
											: _sourceStr.lastIndexOf (_subStr,_endPos) == 0
								)
							)
						)
					)
				);
			}

		return Uize.package ({
			has:function (_sourceStr,_subStr) {
				return (
					_subStr.length <= _sourceStr.length &&
					(
						_stringHasPrefixOrSuffix (_sourceStr,_subStr) ||
						_stringHasPrefixOrSuffix (_sourceStr,_subStr,true) ||
						_sourceStr.indexOf (_subStr) > -1
					)
				);
				/*?
					Static Methods
						Uize.Str.Has.has
							Returns a boolean, indicating whether or not the specified source string has the specified substring.

							SYNTAX
							..............................................
							hasBOOL = Uize.Str.Has.has (sourceSTR,subSTR);
							..............................................

							If a source string starts with or ends with a substring, then that source string also has the substring. In other words, if =Uize.Str.Has.hasPrefix (sourceStr,subStr)= returns =true=, or if =Uize.Str.Has.hasSuffix (sourceStr,subStr)= returns =true=, then =Uize.Str.Has.has (sourceStr,subStr)= must also return =true=.

							EXAMPLES
							........................................................................
							Uize.Str.Has.has ('JavaScript','Java');                 // returns true
							Uize.Str.Has.has ('JavaScript','JavaScript');           // returns true
							Uize.Str.Has.has ('JavaScript','Script');               // returns true
							Uize.Str.Has.has ('JavaScript','S');                    // returns true
							Uize.Str.Has.has ('JavaScript','ava');                  // returns true
							Uize.Str.Has.has ('JavaScript','');                     // returns true
							Uize.Str.Has.has ('','');                               // returns true
							Uize.Str.Has.has ('JavaScript','JAVASCRIPT');           // returns false
							Uize.Str.Has.has ('JavaScript','script');               // returns false
							Uize.Str.Has.has ('Java','JavaScript');                 // returns false
							Uize.Str.Has.has ('JavaScript','Java Script');          // returns false
							Uize.Str.Has.has ('JavaScript','JavaScript   ');        // returns false
							Uize.Str.Has.has ('JavaScript','   JavaScript');        // returns false
							Uize.Str.Has.has ('JavaScript','JavaScript Framework'); // returns false
							........................................................................

							NOTES
							- see the related =Uize.Str.Has.hasPrefix= and =Uize.Str.Has.hasSuffix= static methods
							- this method is case sensitive
				*/
			},

			hasSuffix:function (_sourceStr,_subStr) {
				return _stringHasPrefixOrSuffix (_sourceStr,_subStr,true);
				/*?
					Static Methods
						Uize.Str.Has.hasSuffix
							Returns a boolean, indicating whether or not the specified source string ends with the specified suffix string.

							SYNTAX
							.......................................................
							hasSuffixBOOL = Uize.Str.Has.hasSuffix (sourceSTR,subSTR);
							.......................................................

							The test that this method performs is case and space sensitive. In cases where you need to test without regards to case or whitespace, it is best to construct a regular expression using the "$" (anchor to end) metacharacter and the =i= (case-insensitivity) switch.

							EXAMPLES
							..............................................................................
							Uize.Str.Has.hasSuffix ('JavaScript','Java');                 // returns false
							Uize.Str.Has.hasSuffix ('Java','JavaScript');                 // returns false
							Uize.Str.Has.hasSuffix ('JavaScript','JavaScript');           // returns true
							Uize.Str.Has.hasSuffix ('JavaScript','Java Script');          // returns false
							Uize.Str.Has.hasSuffix ('JavaScript','JavaScript   ');        // returns false
							Uize.Str.Has.hasSuffix ('JavaScript','   JavaScript');        // returns false
							Uize.Str.Has.hasSuffix ('JavaScript','JAVASCRIPT');           // returns false
							Uize.Str.Has.hasSuffix ('JavaScript','Script');               // returns true
							Uize.Str.Has.hasSuffix ('JavaScript','JavaScript Framework'); // returns false
							Uize.Str.Has.hasSuffix ('JavaScript','');                     // returns true
							..............................................................................

							NOTES
							- see the companion =Uize.Str.Has.hasPrefix= static method
							- see the related =Uize.Str.Has.has= static method
							- when the value =''= (empty string) is specified for the =subSTR= parameter, this method will return =true= (all strings can be said to end with an empty string)
				*/
			},

			hasPrefix:_stringHasPrefixOrSuffix
				/*?
					Static Methods
						Uize.Str.Has.hasPrefix
							Returns a boolean, indicating whether or not the specified source string starts with the specified prefix string.

							SYNTAX
							..........................................................
							hasPrefixBOOL = Uize.Str.Has.hasPrefix (sourceSTR,subSTR);
							..........................................................

							The test that this method performs is case and space sensitive. In cases where you need to test without regards to case or whitespace, it is best to construct a regular expression using the "^" (anchor to beginning) metacharacter and the =i= (case-insensitivity) switch.

							EXAMPLES
							..............................................................................
							Uize.Str.Has.hasPrefix ('JavaScript','Java');                 // returns true
							Uize.Str.Has.hasPrefix ('Java','JavaScript');                 // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','JavaScript');           // returns true
							Uize.Str.Has.hasPrefix ('JavaScript','Java Script');          // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','JavaScript   ');        // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','   JavaScript');        // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','JAVASCRIPT');           // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','Script');               // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','JavaScript Framework'); // returns false
							Uize.Str.Has.hasPrefix ('JavaScript','');                     // returns true
							..............................................................................

							NOTES
							- see the companion =Uize.Str.Has.hasSuffix= static method
							- see the related =Uize.Str.Has.has= static method
							- when the value =''= (empty string) is specified for the =subSTR= parameter, this method will return =true= (all strings can be said to start with an empty string)
				*/

		});
	}
});

