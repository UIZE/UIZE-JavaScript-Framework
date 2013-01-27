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
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined
			;

		/*** General Variables ***/
			var
				_sacredEmptyArray = [],
				_nonWhitespaceCharRegExp = new RegExp ('[^ \\n\\r\\t\\f\\x0b\\xa0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u3000]'),
				_whiteSpaceCharCodes = {
					9:1, 10:1, 11:1, 12:1, 13:1, 32:1, 160:1, 8192:1, 8193:1, 8194:1, 8195:1, 8196:1, 8197:1, 8198:1, 8199:1, 8200:1, 8201:1, 8202:1, 8203:1, 8232:1, 8233:1, 12288:1
				},
				_hasSplitUsingRegExpIssue =
					'a,,b'.split (/,/) != 3 ||                // incorrectly dropping empty string values
					'1-2'.split (/(-)/).join ('|') != '1|-|2' // not storing captures in result array
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

		/*** Public Static Methods ***/
			_package.contains = function (_sourceStr,_subStr) {
				return (
					_subStr.length <= _sourceStr.length &&
					(
						_package.startsWith (_sourceStr,_subStr) ||
						_package.endsWith (_sourceStr,_subStr) ||
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
			};

			_package.endsWith = function (_sourceStr,_subStr) {
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
			};

			var _hasPadding = _package.hasPadding = function (_sourceStr) {
				var _sourceStrLength = _sourceStr.length;
				return !!(
					_sourceStrLength &&
					(
						_whiteSpaceCharCodes [_sourceStr.charCodeAt (0)] ||
						_whiteSpaceCharCodes [_sourceStr.charCodeAt (_sourceStrLength - 1)]
					)
				);
				/*?
					Static Methods
						Uize.String.hasPadding
							Returns a boolean, indicidating whether or not the specified string has whitespace padding on either - or both - of its sides (ie. leading or trailing whitespace).

							SYNTAX
							....................................................
							hasPaddingBOOL = Uize.String.hasPadding (sourceSTR);
							....................................................

							EXAMPLES
							...................................................................................
							Uize.String.hasPadding ('   leading whitespace');                  // returns true
							Uize.String.hasPadding ('trailing whitespace     ');               // returns true
							Uize.String.hasPadding ('   leading and trailing whitespace   ');  // returns true
							Uize.String.hasPadding ('no         padding');                     // returns false
							Uize.String.hasPadding ('   ');                                    // returns true
							Uize.String.hasPadding ('');                                       // returns false
							...................................................................................

							NOTES
							- see the related =Uize.String.trim= static method
				*/
			};

			_package.hugJoin = function (_items,_prefix,_suffix,_separator) {
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
			};

			_package.joinUsingSuffixPriority = function (_prefix,_suffix,_maxLength) {
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
			};

			var _limitLength = _package.limitLength = function (_sourceStr,_maxLength) {
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
			};

			var
				_repeaterArray = [],
				_repeat = _package.repeat = function (_sourceStr,_repeatTimes) {
					if (_repeatTimes < 1 || !_sourceStr) return '';
					if (_repeatTimes == 1) return _sourceStr;
					if (_sourceStr == ' ') return _getManySpaces (_repeatTimes);
					_repeaterArray.length = _repeatTimes + 1;
					return _repeaterArray.join (_sourceStr);
				}
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
			;

			_package.split = function (_sourceStr,_splitter,_limit) {
				if (_hasSplitUsingRegExpIssue && _splitter instanceof RegExp) {
					/*** prep parameters ***/
						if (_limit == _undefined) _limit = Infinity;
						if (!_limit) return [];
						_sourceStr += '';

						/*** ensure splitter regular expression has global flag set ***/
							_splitter = new RegExp (
								_splitter.source,
								'g' + (_splitter.multiline ? 'm' : '') + (_splitter.ignoreCase ? 'i' : '')
							);

					var _sourceStrLength = _sourceStr.length;
					if (_sourceStrLength) {
						var
							_result = [],
							_match = 1,
							_matchStr,
							_lastIndex = 0
						;
						while (_match && _lastIndex < _sourceStrLength && _result.length < _limit) {
							if ((_match = _splitter.exec (_sourceStr)) && !(_matchStr = _match [0]))
								_match.index = _lastIndex + 1
							;
							_result.push (_sourceStr.slice (_lastIndex,_match ? _match.index : _sourceStrLength));
							if (_match) {
								_match.length > 1 && _match.index < _sourceStrLength &&
									_result.push.apply (_result,_match.slice (1))
								;
								_lastIndex = _splitter.lastIndex = _match.index + _matchStr.length;
								_matchStr && _lastIndex == _sourceStrLength &&
									// if match is non-empty and _lastIndex is at end of string, then add an empty string
									_result.push ('')
								;
							}
						}
						return _result;
					} else {
						return _splitter.test ('') ? [] : [''];
					}
				} else {
					var _arguments = [_splitter + '',_limit];
					/* NOTE:
						We coerce the splitter to a string, because Firefox 6 introduced an issue where an undefined splitter was no longer being treated as the string "undefined", where all other JS interpreters do handle it this way. FF6 doesn't even seem to default an undefined splitter to ",", but just doesn't split the source string at all with this value.
					*/
					_arguments.length = arguments.length - 1;
					return _sourceStr.split.apply (_sourceStr,_arguments);
				}
				/*?
					Static Methods
						Uize.String.split
							Splits the specified string value into an array of string elements, using the specified splitter string or regular expression.

							SYNTAX
							....................................................................
							splitPartsARRAY = Uize.String.split (sourceSTR,splitterSTRorREGEXP);
							....................................................................

							Why Not Use the split Instance Method?
								As you may be aware, JavaScript's built-in =String= object provides a =split= instance method.

								Unfortunately, this method has poor implementations in some JavaScript interpreters that may lead to well written code behaving inconcistently and exhibiting buggy behavior in the faulty interpreters. The =Uize.String.split= method `compensates for poor implementations` by providing an implementation that is in strict accordance with the ECMA-262 specification.

							Examples
								Splitting Words Delimited by a Semi-colon
									In this example, a string containing a list of fruit names separated by single semi-colons is being split using a string type splitter that is a single semi-colon.

									EXAMPLE
									.................................................................................
									fruits = Uize.String.split ('apple;orange;pear;peach;strawberry;watermelon',';');
									.................................................................................

									After the above statement has been executed, the value of the =fruits= variable will be the array =['apple','orange','pear','peach','strawberry','watermelon']=.

								Splitting Words Delimited by One or More Non-Word Characters
									In this example, a string containing a list of fruit names separated by various different delimiters that are one or more non-word characters is being split using a regular expression splitter that matches on one or more non-word characters.

									EXAMPLE
									........................................................................................
									fruits = Uize.String.split ('apple-|-orange,pear;peach<>strawberry...watermelon',/\W+/);
									........................................................................................

									After the above statement has been executed, the value of the =fruits= variable will be the array =['apple','orange','pear','peach','strawberry','watermelon']=.

								Splitting A Multi-line String Into Separate Lines
									In this example, a multi-line string is being split using a regular expression that supports a variety of different EOL (End Of Line) styles.

									EXAMPLE
									.............................................................................
									lines = Uize.String.split ('line 1\rline 2\nline 3\r\nline 4',/\r\n|[\r\n]/);
									.............................................................................

									After the above statement has been executed, the value of the =lines= variable will be the array =['line 1','line 2','line 3','line 4']=. The regular expression being used to split the multi-line string supports three different EOL styles: a carriage return (the ='\r'= character) followed by a line feed (the ='\n'= character), just a single carriage return character, or just a single line feed character.

								Splitting Using a Regular Expression And Getting Captures
									Because the =Uize.String.split= method is a strict implementation of the ECMA-262 specification for the =split= instance method of JavaScript's =String= object, it supports including the regular expression captures in the returned array.

									So, for example, if we were `splitting a multi-line string into separate lines` and wanted to capture the specific line ending characters used for each of the lines (they may be inconcistent across all the lines of the multi-line string), then we can use the unique behavior of the =Uize.String.split= method as follows...

									EXAMPLE
									...............................................................................
									lines = Uize.String.split ('line 1\rline 2\nline 3\r\nline 4',/(\r\n|[\r\n])/);
									...............................................................................

									After the above statement has been executed, the value of the =lines= variable will be the array =['line 1','\r','line 2','\n','line 3','\r\n','line 4']=. Because the entire splitter regular expression is inside a capture (ie. the parentheses), the entire matched splitter is included in the returned array for each line of the multi-line string. When the =Uize.String.split= method builds up the result array, it follows the array element for each split part with elements for all the captures in the regular expression, in the order in which the captures occur in the regular expression.

								Splitting Using a Regular Expression And Ignoring Captures
									Because the =Uize.String.split= method includes captures from a regular expression splitter in the returned array, an extra step is needed if you wish to use parentheses for grouping in a regular expression but don't wish the captures to be included in the result array.

									EXAMPLE
									..................................................................................
									words = Uize.String.split ('solar<_-_>power<_-_-_>will<_-_-_-_>win',/<(?:-=)+->/);
									..................................................................................

									After the above statement has been executed, the value of the =words= variable will be the array =['solar','power','will','win']=. The regular expression is using a group to allow matching of one or more of the substring ='-&#61;'=. However, we don't want those matched characters to pollute the result array - we only want the words that are split out from the string. To accomplish this, we use a feature of regular expressions that allows a group to not be treated as a capture, simply by prefixing the contents of the group expression (ie. the stuff inside the group's parentheses) with the special characters =?:= - this tells the regular expression engine to not capture the characters matched by the group.

							Splitter Ommitted From Result
								The splitter string or regular expression match is not included in the string elements of the returned array.

								So, for example, the statement =Uize.String.split ('foo#bar','#')= would return the array value =['foo','bar']= - the splitter, which is a ='#'= (pound) character string literal in this case, is stripped from the values of the returned array elements.

								With a regular expression splitter, the entire substring matched by the regular expression will be omitted. So, for example, the statement =Uize.String.split ('foo####bar',/#+/)= would return the array value =['foo','bar']= - the splitter, which is a =/#+/= (one or more pound characters) regular expression in this case, strips out all the contiguous pound characters from the values of the returned array elements.

								The only way to include the substring matched by a splitter is to use a regular expression splitter and to enclose the entire regular expression in parentheses - this invokes the behavior of including regular expression captures in the result array. The matched substrings are still not included as part of the split values, but as separate elements of the result array - between the elements for the split values (see the example `Splitting Using a Regular Expression And Getting Captures`).

							Compensates for Poor Implementations
								The =Uize.String.split= method is implemented in strict accordance with the ECMA-262 specification (ie. the JavaScript language specification).

								The =Uize.String.split= method addresses poor implementations of the =split= instance method of JavaScript's built-in =String= object in some JavaScript interpreters, such as Microsoft's JScript interpreter that is used by Internet Explorer and WSH (Windows Script Host). Specifically, the =Uize.String.split= method addresses two known issues when using a regular expression splitter: `incorrect dropping of empty split values` and `incorrect omission of captures in the result array`.

								Incorrect Dropping of Empty Split Values
									Microsoft's JScript interpreter exhibits an issue where empty split values are omitted when a regular expression splitter is used (but not when a string splitter is used).

									EXAMPLE
									................................
									result = 'foo,,bar'.split (/,/);
									................................

									In the above example, a string is being split using a regular expression splitter that matches a single comma. In compliant JavaScript interpreters, the above statement would produce a result array with the value =['foo','','bar']= - exactly the same result as if you used a simple string splitter (ie. ='foo,,bar'.split (',')=).

									For a reason that is hard to fathom, the JScript interpreter omits the second empty string element to produce, instead, the result =['foo','bar']=. It's hard to justify or defend this implementation choice, as it wreaks havoc with using the =split= instance method to parse lists of values that were serialized using the =Array= object's =join= instance method, and where some of the values were empty strings.

									The =Uize.String.split= method fixes this issue, so it can be used in Internet Explorer and WSH (Windows Script Host) to safely split strings using a regular expression splitter.

								Incorrect Omission of Captures in the Result Array
									While the =split= instance method of JavaScript's built-in =String= object is supposed to include captures from a regular expression splitter in the returned array, this behavior is not supported by some JavaScript interpreters - notably Microsoft's JScript interpreter.

									This means that the statement ='line 1\rline 2\nline 3\r\nline 4'.split (/(\r\n|[\r\n])/)= would return the result array =['line 1','line 2','line 3','line 4']= in the JScript interpreter, and not the array =['line 1','\r','line 2','\n','line 3','\r\n','line 4']= as it should. The =Uize.String.split= method fixes this issue, so it can be used in Internet Explorer and WSH (Windows Script Host) to safely split strings using a regular expression splitter.

							NOTES
							- compare to the =Uize.String.splitInTwo= static method
				*/
			};

			_package.splitInTwo = function (_sourceStr,_splitter) {
				if (_splitter instanceof RegExp)
					_splitter = (_sourceStr.match (_splitter) || _sacredEmptyArray) [0]
				;
				var _splitPos = _splitter != _undefined ? _sourceStr.indexOf (_splitter) : -1;
				return (
					_splitPos > -1
						? [_sourceStr.substr (0,_splitPos),_sourceStr.substr (_splitPos + _splitter.length)]
						: [_sourceStr,'']
				);
				/*?
					Static Methods
						Uize.String.splitInTwo
							Returns an array of exactly two elements, representing the two segments of the specified source string after splitting it using the specified splitter string.

							SYNTAX
							...............................................................
							twoPartsARRAY = Uize.String.splitInTwo (sourceSTR,splitterSTR);
							...............................................................

							EXAMPLE
							............................................................................
							var nameValue = Uize.String.splitInTwo ('TITLE: The Matrix: Reloaded',': ');
							............................................................................

							In the above example, the =nameValue= variable would be left with the array value =['TITLE','The Matrix: Reloaded']=. In contrast, the built-in =split= method of the =String= object would produce the three element array =['TITLE','The Matrix','Reloaded']= when splitting the above string using =': '=.

							If the splitter string is not found within the source string, then the returned array will contain the entire source string for its first element, and an empty string for its second element.

							EXAMPLE
							......................................................
							var nameValue = Uize.String.splitInTwo ('TITLE',': ');
							......................................................

							In the above example, the =nameValue= variable would be left with the array value =['TITLE','']=.

							VARIATION
							..................................................................
							twoPartsARRAY = Uize.String.splitInTwo (sourceSTR,splitterREGEXP);
							..................................................................

							When a =splitterREGEXP= parameter is specified, the =sourceSTR= value will be split on the regular expression, and the two resulting parts will exclude the substring that was matched by the splitter regular expression.

							EXAMPLE
							......................................................................................
							var nameValue =
								Uize.String.splitInTwo ('TITLE   :   The Matrix: Reloaded',new RegExp ('\\s*:\\s*')
							;
							......................................................................................

							In the above example, the =nameValue= variable would be left with the array value =['TITLE','The Matrix: Reloaded']=. In this case, the regular expression specified for the =splitterREGEXP= parameter matches a substring of any number of spaces, followed by a colon, followed by any number of spaces - in other words, a colon with optional padding. The two parts of the result will not include the whitespace padding around the colon, since it was part of the splitter match.
				*/
			};

			_package.startsWith = _stringHasPrefixOrSuffix;
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

			_package.toCamel = function (_source,_capFirstChar) {
				return (
					(Uize.isArray (_source) ? _source.join (' ') : _source).toLowerCase (
					).replace (
						/^\W+/,'' // remove leading non-word chars
					).replace (
						/\W+$/,'' // remove trailing non-word chars
					).replace (
						_capFirstChar ? /(^|\W+)./g : /\W+./g,
						function (_match) {return _match.slice (-1).toUpperCase ()}
					)
				);
				/*?
					Static Methods
						Uize.String.toCamel
							Returns a string, that is the specified source string converted to a camelCase formatted string.

							SYNTAX
							...............................................
							camelCaseSTR = Uize.String.toCamel (sourceSTR);
							...............................................

							This method removes all non-word characters separating words in the source string, capitalizes the first letters of the words, and lowercases all other letters.

							EXAMPLES
							.............................................................................
							Uize.String.toCamel ('encode HTML entity');    // returns 'encodeHtmlEntity'
							Uize.String.toCamel ('XML document');          // returns 'xmlDocument'
							Uize.String.toCamel ('XML document',true);     // returns 'XmlDocument'
							Uize.String.toCamel ('city, state, zip');      // returns 'cityStateZip'
							Uize.String.toCamel ('www.uize.com');          // returns 'wwwUizeCom'
							Uize.String.toCamel ('theme/css/button.css');  // returns 'themeCssButtonCss'
							Uize.String.toCamel ('nav-arrow-horz-next');   // returns 'navArrowHorzNext'
							Uize.String.toCamel ('json 2 XML');            // returns 'json2Xml'
							Uize.String.toCamel ('--hyphens-are-cool--');  // returns 'hyphensAreCool'
							.............................................................................

							The above example illustrates how the method will behave with a variety of input values.

							VARIATION
							................................................................
							camelCaseSTR = Uize.String.toCamel (sourceSTR,capFirstCharBOOL);
							................................................................

							By default, the first letter of the camelCased string is lowercase, although the optional =capFirstCharBOOL= parameter allows control over this behavior. Specify the value =true= for this parameter and the first letter of the camelCased string will be uppercase.

							VARIATION
							.........................................................
							camelCaseSTR = Uize.String.toCamel (stringSegmentsARRAY);
							.........................................................

							In addition to being able to camelCase a source string, the =Uize.String.toCamel= method can also generate a camelCase string from an array of string segments.

							EXAMPLE
							........................................................................
							Uize.String.toCamel (['city','state','zip']);  // returns 'cityStateZip'
							........................................................................

							VARIATION
							..........................................................................
							camelCaseSTR = Uize.String.toCamel (stringSegmentsARRAY,capFirstCharBOOL);
							..........................................................................

							Naturally, the optional =capFirstCharBOOL= parameter can also be used when the =stringSegmentsARRAY= parameter is specified.
				*/
			};

			_package.trim = function (_sourceStr,_side) {
				/* NOTES:
					- performance
						- return early for empty string and string with no padding (avoid doing any string operation if there is no whitespace to trim)
						- don't create regular expression (use pre-created, if necessary)
						- try to avoid use of regular expression
						- don't perform multiple string operations or assignments
						- to find a non-whitespace character, check charCode and look in hash
						- perform trim by doing slice - not replace
					- what is whitespace? Different JS interpreters apparently interpret \s differently
				*/
				if (!_hasPadding (_sourceStr)) return _sourceStr;
				var
					_firstNonSpaceCharPos = _side == 1 ? 0 : _sourceStr.search (_nonWhitespaceCharRegExp),
					_lastNonSpaceCharPos = _sourceStr.length - 1
				;
				if (_firstNonSpaceCharPos == -1) return '';
				if (_side != -1)
					while (_whiteSpaceCharCodes [_sourceStr.charCodeAt (_lastNonSpaceCharPos)]) _lastNonSpaceCharPos--
				;
				return _sourceStr.slice (_firstNonSpaceCharPos,_lastNonSpaceCharPos + 1);
				/*?
					Static Methods
						Uize.String.trim
							Returns a string, that is the specified source string minus any whitespace padding to the left and right of the first and last non-whitespace characters, respectively.

							SYNTAX
							..........................................
							trimmedSTR = Uize.String.trim (sourceSTR);
							..........................................

							EXAMPLES
							.............................................................................
							Uize.String.trim ('  THIS IS A STRING  ');      // returns 'THIS IS A STRING'
							Uize.String.trim ('\tTHIS IS A STRING\t');      // returns 'THIS IS A STRING'
							Uize.String.trim ('\n\nTHIS IS A STRING\n\n');  // returns 'THIS IS A STRING'
							Uize.String.trim ('  \t \n\n \t');              // returns ''
							.............................................................................

							Working with Multi-line Strings
								This method regards linebreak characters as whitespace.

								Therefore, this method cannot be used to trim whitespace padding on a line by line basis. To trim line by line, use the =Uize.String.Lines.trim= method implemented in the =Uize.String.Lines= module that is dedicated to working with multi-line strings.

							NOTES
							- see the companion =Uize.String.trimLeft= and =Uize.String.trimRight= static methods
							- see the related =Uize.String.hasPadding= static method
				*/
			};

			_package.trimLeft = function (_sourceStr) {
				return _package.trim (_sourceStr,-1);
				/*?
					Static Methods
						Uize.String.trimLeft
							Returns a string, that is the specified source string minus any whitespace padding to the left of the first non-whitespace character or the end of the string (ie. leading whitespace).

							SYNTAX
							..................................................
							leftTrimmedSTR = Uize.String.trimLeft (sourceSTR);
							..................................................

							EXAMPLES
							................................................................................
							Uize.String.trim ('  THIS IS A STRING  ');      // returns 'THIS IS A STRING  '
							Uize.String.trim ('\tTHIS IS A STRING\t');      // returns 'THIS IS A STRING\t'
							Uize.String.trim ('\n\nTHIS IS A STRING\n\n');  // returns 'THIS IS A STRING\n\n'
							Uize.String.trim ('  \t \n\n \t');              // returns ''
							.................................................................................

							Working with Multi-line Strings
								This method regards linebreak characters as whitespace.

								Therefore, this method cannot be used to trim whitespace padding on a line by line basis. To left trim line by line, use the =Uize.String.Lines.trimLeft= method implemented in the =Uize.String.Lines= module that is dedicated to working with multi-line strings.

							NOTES
							- see the companion =Uize.String.trim= and =Uize.String.trimRight= static methods
				*/
			};

			_package.trimRight = function (_sourceStr) {
				return _package.trim (_sourceStr,1);
				/*?
					Static Methods
						Uize.String.trimRight
							Returns a string, that is the specified source string minus any whitespace padding to the right of the last non-whitespace character or the start of the string (ie. trailing whitespace).

							SYNTAX
							....................................................
							rightTrimmedSTR = Uize.String.trimRight (sourceSTR);
							....................................................

							EXAMPLES
							.................................................................................
							Uize.String.trim ('  THIS IS A STRING  ');      // returns '  THIS IS A STRING'
							Uize.String.trim ('\tTHIS IS A STRING\t');      // returns '\tTHIS IS A STRING'
							Uize.String.trim ('\n\nTHIS IS A STRING\n\n');  // returns '\n\nTHIS IS A STRING'
							Uize.String.trim ('  \t \n\n \t');              // returns ''
							.................................................................................

							Working with Multi-line Strings
								This method regards linebreak characters as whitespace.

								Therefore, this method cannot be used to trim whitespace padding on a line by line basis. To right trim line by line, use the =Uize.String.Lines.trimRight= method implemented in the =Uize.String.Lines= module that is dedicated to working with multi-line strings.

							NOTES
							- see the companion =Uize.String.trim= and =Uize.String.trimLeft= static methods
				*/
			};

		return _package;
	}
});

