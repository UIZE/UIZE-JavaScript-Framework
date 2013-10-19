/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.String Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.String= module eases working with strings, and supports trimming, camel-casing, multi-line indenting, starts-with / ends-with tests, and more.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.String',
	required:[
		'Uize.Str.Camel',
		'Uize.Str.Split',
		'Uize.Str.Trim'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_endsWith,
				_limitLength,
				_repeat,
				_Uize_Str = Uize.Str,
				_Uize_Str_Split = _Uize_Str.Split,
				_Uize_Str_Trim = _Uize_Str.Trim,

			/*** General Variables ***/
				_repeaterArray = []
		;

		/*** Utility Functions ***/
			var _manySpaces, _manySpacesLength;
			function _getManySpaces (_amount) {
				if (!_manySpacesLength)
					_manySpacesLength = (_manySpaces = '          '.replace (/ /g,'          ')).length // 100 spaces
				;
				if (_amount > _manySpacesLength)
					_manySpacesLength = (
						_manySpaces =
							_repeat (_manySpaces,Math.floor (_amount / _manySpacesLength)) +
							_manySpaces.substr (0,_amount % _manySpacesLength)
					).length
				;
				return _manySpaces.substr (0,_amount);
			}

			function _stringHasPrefixOrSuffix (_sourceStr,_subStr,_isSuffixTest) {
				if (!_subStr) return true;
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
			contains:function (_sourceStr,_subStr) {
				return (
					_subStr.length <= _sourceStr.length &&
					(
						_stringHasPrefixOrSuffix (_sourceStr,_subStr) ||
						_endsWith (_sourceStr,_subStr) ||
						_sourceStr.indexOf (_subStr) > -1
					)
				);
				/*?
					Static Methods
						Uize.String.contains
							Returns a boolean, indicating whether or not the specified source string contains the specified substring.

							SYNTAX
							.......................................................
							containsBOOL = Uize.String.contains (sourceSTR,subSTR);
							.......................................................

							If a source string starts with or ends with a substring, then that source string also contains the substring. In other words, if =Uize.String.startsWith (sourceStr,subStr)= returns =true=, or if =Uize.String.endsWith (sourceStr,subStr)= returns =true=, then =Uize.String.contains (sourceStr,subStr)= must also return =true=.

							EXAMPLES
							............................................................................
							Uize.String.contains ('JavaScript','Java');                 // returns true
							Uize.String.contains ('JavaScript','JavaScript');           // returns true
							Uize.String.contains ('JavaScript','Script');               // returns true
							Uize.String.contains ('JavaScript','S');                    // returns true
							Uize.String.contains ('JavaScript','ava');                  // returns true
							Uize.String.contains ('JavaScript','');                     // returns true
							Uize.String.contains ('','');                               // returns true
							Uize.String.contains ('JavaScript','JAVASCRIPT');           // returns false
							Uize.String.contains ('JavaScript','script');               // returns false
							Uize.String.contains ('Java','JavaScript');                 // returns false
							Uize.String.contains ('JavaScript','Java Script');          // returns false
							Uize.String.contains ('JavaScript','JavaScript   ');        // returns false
							Uize.String.contains ('JavaScript','   JavaScript');        // returns false
							Uize.String.contains ('JavaScript','JavaScript Framework'); // returns false
							............................................................................

							NOTES
							- see the related =Uize.String.startsWith= and =Uize.String.endsWith= static methods
							- this method is case sensitive
				*/
			},

			endsWith:_endsWith = function (_sourceStr,_subStr) {
				return _stringHasPrefixOrSuffix (_sourceStr,_subStr,true);
				/*?
					Static Methods
						Uize.String.endsWith
							Returns a boolean, indicating whether or not the specified source string ends with the specified substring.

							SYNTAX
							.......................................................
							endsWithBOOL = Uize.String.endsWith (sourceSTR,subSTR);
							.......................................................

							The test that this method performs is case and space sensitive. In cases where you need to test without regards to case or whitespace, it is best to construct a regular expression using the "$" (anchor to end) metacharacter and the =i= (case-insensitivity) switch.

							EXAMPLES
							............................................................................
							Uize.String.endsWith ('JavaScript','Java');                 // returns false
							Uize.String.endsWith ('Java','JavaScript');                 // returns false
							Uize.String.endsWith ('JavaScript','JavaScript');           // returns true
							Uize.String.endsWith ('JavaScript','Java Script');          // returns false
							Uize.String.endsWith ('JavaScript','JavaScript   ');        // returns false
							Uize.String.endsWith ('JavaScript','   JavaScript');        // returns false
							Uize.String.endsWith ('JavaScript','JAVASCRIPT');           // returns false
							Uize.String.endsWith ('JavaScript','Script');               // returns true
							Uize.String.endsWith ('JavaScript','JavaScript Framework'); // returns false
							Uize.String.endsWith ('JavaScript','');                     // returns true
							............................................................................

							NOTES
							- see the companion =Uize.String.startsWith= static method
							- see the related =Uize.String.contains= static method
							- when the value =''= (empty string) is specified for the =subSTR= parameter, this method will return =true= (all strings can be said to end with an empty string)
				*/
			},

			hugJoin:function (_items,_prefix,_suffix,_separator) {
				return (
					_items.length
						? (
							'' + _prefix +
							_items.join ('' + _suffix + (_separator != _undefined ? _separator : '') + _prefix) +
							_suffix
						)
						: ''
				);
				/*?
					Static Methods
						Uize.String.hugJoin
							Returns a string, that is the concatenation of the specified array of items, where a prefix and suffix can be specified for hugging each item in the array, and where an optional separator can additionally be specified.

							SYNTAX
							.........................................................................
							joinedSTR = Uize.String.hugJoin (itemsARRAY,itemPrefixSTR,itemSuffixSTR);
							.........................................................................

							EXAMPLE 1
							.....................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.String.hugJoin (actions,'[ ',' ]'));
							.....................................................

							EXAMPLE 1 - OUTPUT
							..........................................
							[ view ][ reset ][ save ][ open ][ close ]
							..........................................

							VARIATION
							......................................................................................
							joinedSTR = Uize.String.hugJoin (itemsARRAY,itemPrefixSTR,itemSuffixSTR,separatorSTR);
							......................................................................................

							When the optional =separatorSTR= parameter is specified, then the items being joined will be separated by the specified separator string. This provides you with the functionality you would normally get from the built-in =join= instance method of the =Array= object.

							Technically, the statement =Uize.String.hugJoin (array,'','',separator)= would be equivalent to the statement =array.join (separator)=. But, if you just wanted to join an array with a separator string, then you would just use the =join= method, so the =separatorSTR= parameter is the last parameter and is optional for the =Uize.String.hugJoin= method, since the assumption is that you're likely using this method for its prefix/suffix feature.

							EXAMPLE 2
							......................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.String.hugJoin (actions,'[ ',' ]',' - '));
							......................................................

							EXAMPLE 2 - OUTPUT
							......................................................
							[ view ] - [ reset ] - [ save ] - [ open ] - [ close ]
							......................................................

							EXAMPLE 3
							...............................................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.String.hugJoin (actions,'\t','\n')); // on separate lines, indented
							...............................................................................

							EXAMPLE 3 - OUTPUT
							........
								view
								reset
								save
								open
								close
							........

							EXAMPLE 4
							............................................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.String.hugJoin (actions,'action: "','"\n','---------------\n'));
							............................................................................

							EXAMPLE 4 - OUTPUT
							................
							action: "view"
							---------------
							action: "reset"
							---------------
							action: "save"
							---------------
							action: "open"
							---------------
							action: "close"
							................
				*/
			},

			joinUsingSuffixPriority:function (_prefix,_suffix,_maxLength) {
				var _suffixLength = _suffix.length;
				return (
					_maxLength < _suffixLength
						? _suffix.substr (0,_maxLength)
						: _maxLength == _suffixLength
							? _suffix
							: _limitLength (_prefix,_maxLength - _suffixLength) + _suffix
				);
				/*?
					Static Methods
						Uize.String.joinUsingSuffixPriority
							Returns a string, that is the concatenation of the two specified strings, limited to the specified maximum length, and such that the suffix string takes precedence if any characters must be lost in order to limit the length of the resulting string.

							SYNTAX
							...................................................................................
							joinedSTR = Uize.String.joinUsingSuffixPriority (prefixSTR,suffixSTR,maxLengthINT);
							...................................................................................

							EXAMPLE
							.....................................................................................
							Uize.String.joinUsingSuffixPriority ('Some Greate Product Title',' - Customized',30);
							.....................................................................................

							In the above example, this method would produce the result ='Some Greate Produ - Customized'=.
				*/
			},

			limitLength:_limitLength = function (_sourceStr,_maxLength) {
				var
					_continuationStr = '...',
					_continuationStrLength = _continuationStr.length
				;
				return (
					_maxLength < 1
						? ''
						: _maxLength <= _continuationStrLength
							? _sourceStr.slice (0,_maxLength)
							: _sourceStr.length > _maxLength
								? (_sourceStr.substr (0,_maxLength - _continuationStrLength) + _continuationStr)
								: _sourceStr
				);
				/*?
					Static Methods
						Uize.String.limitLength
							Returns a string, that is the specified source string limited to the specified maximum length.

							SYNTAX
							..............................................................
							limitedSTR = Uize.String.limitLength (sourceSTR,maxLengthINT);
							..............................................................

							If the string specified in the =sourceSTR= has to be truncated, it will be truncated to accommodate an ellipsis of "..." (three periods), such that the final length of the returned string is guaranteed to be no greater than the maximum length specified in the =maxLengthINT= parameter.

							EXAMPLE
							................................................................................
							Uize.String.limitLength ('012345678901',15);        // returns '012345678901'
							Uize.String.limitLength ('0123456789012',15);       // returns '0123456789012'
							Uize.String.limitLength ('01234567890123',15);      // returns '01234567890123'
							Uize.String.limitLength ('012345678901234',15);     // returns '012345678901234'
							Uize.String.limitLength ('0123456789012345',15);    // returns '012345678901...'
							Uize.String.limitLength ('01234567890123456',15);   // returns '012345678901...'
							Uize.String.limitLength ('012345678901234567',15);  // returns '012345678901...'
							................................................................................

							Notice how, once the limit of =15= characters has been hit, all the resulting strings are only 15 characters long, with the last three characters being the ellipsis periods.
				*/
			},

			repeat:_repeat = function (_sourceStr,_repeatTimes) {
				if (_repeatTimes < 1 || !_sourceStr) return '';
				if (_repeatTimes == 1) return _sourceStr;
				if (_sourceStr == ' ') return _getManySpaces (_repeatTimes);
				_repeaterArray.length = _repeatTimes + 1;
				return _repeaterArray.join (_sourceStr);
				/*?
					Static Methods
						Uize.String.repeat
							Returns a string, that is the specified source string repeated the specified number of times.

							SYNTAX
							............................................................
							repeatedSTR = Uize.String.repeat (sourceSTR,repeatTimesINT);
							............................................................

							EXAMPLE 1
							.................................................
							var hundredDashes = Uize.String.repeat ('-',100);
							.................................................

							EXAMPLE 2
							........................................................
							var paddingStr = Uize.String.repeat (' ',paddingAmount);
							........................................................

							EXAMPLE 3
							................................................
							var tenBrTags = Uize.String.repeat ('<br/>',10);
							................................................

							The value of the =sourceSTR= parameter can contain any number of any characters. In the above example, a string containing ten =br= tags is being generated.
				*/
			},

			startsWith:_stringHasPrefixOrSuffix,
				/*?
					Static Methods
						Uize.String.startsWith
							Returns a boolean, indicating whether or not the specified source string starts with the specified substring.

							SYNTAX
							...........................................................
							startsWithBOOL = Uize.String.startsWith (sourceSTR,subSTR);
							...........................................................

							The test that this method performs is case and space sensitive. In cases where you need to test without regards to case or whitespace, it is best to construct a regular expression using the "^" (anchor to beginning) metacharacter and the =i= (case-insensitivity) switch.

							EXAMPLES
							..............................................................................
							Uize.String.startsWith ('JavaScript','Java');                 // returns true
							Uize.String.startsWith ('Java','JavaScript');                 // returns false
							Uize.String.startsWith ('JavaScript','JavaScript');           // returns true
							Uize.String.startsWith ('JavaScript','Java Script');          // returns false
							Uize.String.startsWith ('JavaScript','JavaScript   ');        // returns false
							Uize.String.startsWith ('JavaScript','   JavaScript');        // returns false
							Uize.String.startsWith ('JavaScript','JAVASCRIPT');           // returns false
							Uize.String.startsWith ('JavaScript','Script');               // returns false
							Uize.String.startsWith ('JavaScript','JavaScript Framework'); // returns false
							Uize.String.startsWith ('JavaScript','');                     // returns true
							..............................................................................

							NOTES
							- see the companion =Uize.String.endsWith= static method
							- see the related =Uize.String.contains= static method
							- when the value =''= (empty string) is specified for the =subSTR= parameter, this method will return =true= (all strings can be said to start with an empty string)
				*/

			toCamel:_Uize_Str.Camel.to,
			split:_Uize_Str_Split.split,
			splitInTwo:_Uize_Str_Split.splitInTwo,
			hasPadding:_Uize_Str_Trim.hasPadding,
			trim:_Uize_Str_Trim.trim,
			trimLeft:_Uize_Str_Trim.trimLeft,
			trimRight:_Uize_Str_Trim.trimRight
		});
	}
});

