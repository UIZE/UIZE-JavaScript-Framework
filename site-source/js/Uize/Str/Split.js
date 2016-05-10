/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Split Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Str.Split= module provides some utility methods for splitting strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Split',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,

			/*** General Variables ***/
				_sacredEmptyArray = [],
				_hasSplitUsingRegExpIssue =
					'a,,b'.split (/,/) != 3 ||                // incorrectly dropping empty string values
					'1-2'.split (/(-)/).join ('|') != '1|-|2' // not storing captures in result array
		;

		return Uize.package ({
			split:function (_sourceStr,_splitter,_limit,_includeMatchMode) {
				if (_includeMatchMode || (_hasSplitUsingRegExpIssue && _splitter instanceof RegExp)) {
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
								if (_match.index < _sourceStrLength) {
									if (!_includeMatchMode || _includeMatchMode == 'captures') {
										_match.length > 1 && Uize.push (_result,_match.slice (1));
										/*
											segments and captures are returned
											eg. ['segmentA','capture0','capture1','segmentB']
										*/
									} else if (_includeMatchMode == 'match') {
										_result.push (_matchStr);
										/*
											segments and matches are returned
											eg. ['segmentA','match','segmentB']
										*/
									} else if (_includeMatchMode == 'match array') {
										_result.push (_match);
										/*
											segments and match arrays are returned
											eg. ['segmentA',['match','capture0','capture1'],'segmentB']
										*/
									} else if (_includeMatchMode == 'none') {
										/*
											only the segments between matches are returned in the result array
											eg. ['segmentA','segmentB']
										*/
									} else if (_includeMatchMode == 'match and captures') {
										Uize.push (_result,_match);
										/*
											segments and match and captures are returned
											eg. ['segmentA','match','capture0','capture1','segmentB']
										*/
									}
								}
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
						Uize.Str.Split.split
							Splits the specified string value into an array of string elements, using the specified splitter string or regular expression.

							SYNTAX
							.......................................................................
							splitPartsARRAY = Uize.Str.Split.split (sourceSTR,splitterSTRorREGEXP);
							.......................................................................

							Why Not Use the split Instance Method?
								As you may be aware, JavaScript's built-in =String= object provides a =split= instance method.

								Unfortunately, this method has poor implementations in some JavaScript interpreters that may lead to well written code behaving inconcistently and exhibiting buggy behavior in the faulty interpreters. The =Uize.Str.Split.split= method `compensates for poor implementations` by providing an implementation that is in strict accordance with the ECMA-262 specification.

							Examples
								Splitting Words Delimited by a Semi-colon
									In this example, a string containing a list of fruit names separated by single semi-colons is being split using a string type splitter that is a single semi-colon.

									EXAMPLE
									....................................................................................
									fruits = Uize.Str.Split.split ('apple;orange;pear;peach;strawberry;watermelon',';');
									....................................................................................

									After the above statement has been executed, the value of the =fruits= variable will be the array =['apple','orange','pear','peach','strawberry','watermelon']=.

								Splitting Words Delimited by One or More Non-Word Characters
									In this example, a string containing a list of fruit names separated by various different delimiters that are one or more non-word characters is being split using a regular expression splitter that matches on one or more non-word characters.

									EXAMPLE
									...........................................................................................
									fruits = Uize.Str.Split.split ('apple-|-orange,pear;peach<>strawberry...watermelon',/\W+/);
									...........................................................................................

									After the above statement has been executed, the value of the =fruits= variable will be the array =['apple','orange','pear','peach','strawberry','watermelon']=.

								Splitting A Multi-line String Into Separate Lines
									In this example, a multi-line string is being split using a regular expression that supports a variety of different EOL (End Of Line) styles.

									EXAMPLE
									................................................................................
									lines = Uize.Str.Split.split ('line 1\rline 2\nline 3\r\nline 4',/\r\n|[\r\n]/);
									................................................................................

									After the above statement has been executed, the value of the =lines= variable will be the array =['line 1','line 2','line 3','line 4']=. The regular expression being used to split the multi-line string supports three different EOL styles: a carriage return (the ='\r'= character) followed by a line feed (the ='\n'= character), just a single carriage return character, or just a single line feed character.

								Splitting Using a Regular Expression And Getting Captures
									Because the =Uize.Str.Split.split= method is a strict implementation of the ECMA-262 specification for the =split= instance method of JavaScript's =String= object, it supports including the regular expression captures in the returned array.

									So, for example, if we were `splitting a multi-line string into separate lines` and wanted to capture the specific line ending characters used for each of the lines (they may be inconcistent across all the lines of the multi-line string), then we can use the unique behavior of the =Uize.Str.Split.split= method as follows...

									EXAMPLE
									..................................................................................
									lines = Uize.Str.Split.split ('line 1\rline 2\nline 3\r\nline 4',/(\r\n|[\r\n])/);
									..................................................................................

									After the above statement has been executed, the value of the =lines= variable will be the array =['line 1','\r','line 2','\n','line 3','\r\n','line 4']=. Because the entire splitter regular expression is inside a capture (i.e. the parentheses), the entire matched splitter is included in the returned array for each line of the multi-line string. When the =Uize.Str.Split.split= method builds up the result array, it follows the array element for each split part with elements for all the captures in the regular expression, in the order in which the captures occur in the regular expression.

								Splitting Using a Regular Expression And Ignoring Captures
									Because the =Uize.Str.Split.split= method includes captures from a regular expression splitter in the returned array, an extra step is needed if you wish to use parentheses for grouping in a regular expression but don't wish the captures to be included in the result array.

									EXAMPLE
									.....................................................................................
									words = Uize.Str.Split.split ('solar<_-_>power<_-_-_>will<_-_-_-_>win',/<(?:-=)+->/);
									.....................................................................................

									After the above statement has been executed, the value of the =words= variable will be the array =['solar','power','will','win']=. The regular expression is using a group to allow matching of one or more of the substring ='-&#61;'=. However, we don't want those matched characters to pollute the result array - we only want the words that are split out from the string. To accomplish this, we use a feature of regular expressions that allows a group to not be treated as a capture, simply by prefixing the contents of the group expression (i.e. the stuff inside the group's parentheses) with the special characters =?:= - this tells the regular expression engine to not capture the characters matched by the group.

							Splitter Ommitted From Result
								The splitter string or regular expression match is not included in the string elements of the returned array.

								So, for example, the statement =Uize.Str.Split.split ('foo#bar','#')= would return the array value =['foo','bar']= - the splitter, which is a ='#'= (pound) character string literal in this case, is stripped from the values of the returned array elements.

								With a regular expression splitter, the entire substring matched by the regular expression will be omitted. So, for example, the statement =Uize.Str.Split.split ('foo####bar',/#+/)= would return the array value =['foo','bar']= - the splitter, which is a =/#+/= (one or more pound characters) regular expression in this case, strips out all the contiguous pound characters from the values of the returned array elements.

								The only way to include the substring matched by a splitter is to use a regular expression splitter and to enclose the entire regular expression in parentheses - this invokes the behavior of including regular expression captures in the result array. The matched substrings are still not included as part of the split values, but as separate elements of the result array - between the elements for the split values (see the example `Splitting Using a Regular Expression And Getting Captures`).

							Compensates for Poor Implementations
								The =Uize.Str.Split.split= method is implemented in strict accordance with the ECMA-262 specification (i.e. the JavaScript language specification).

								The =Uize.Str.Split.split= method addresses poor implementations of the =split= instance method of JavaScript's built-in =String= object in some JavaScript interpreters, such as Microsoft's JScript interpreter that is used by Internet Explorer and WSH (Windows Script Host). Specifically, the =Uize.Str.Split.split= method addresses two known issues when using a regular expression splitter: `incorrect dropping of empty split values` and `incorrect omission of captures in the result array`.

								Incorrect Dropping of Empty Split Values
									Microsoft's JScript interpreter exhibits an issue where empty split values are omitted when a regular expression splitter is used (but not when a string splitter is used).

									EXAMPLE
									................................
									result = 'foo,,bar'.split (/,/);
									................................

									In the above example, a string is being split using a regular expression splitter that matches a single comma. In compliant JavaScript interpreters, the above statement would produce a result array with the value =['foo','','bar']= - exactly the same result as if you used a simple string splitter (i.e. ='foo,,bar'.split (',')=).

									For a reason that is hard to fathom, the JScript interpreter omits the second empty string element to produce, instead, the result =['foo','bar']=. It's hard to justify or defend this implementation choice, as it wreaks havoc with using the =split= instance method to parse lists of values that were serialized using the =Array= object's =join= instance method, and where some of the values were empty strings.

									The =Uize.Str.Split.split= method fixes this issue, so it can be used in Internet Explorer and WSH (Windows Script Host) to safely split strings using a regular expression splitter.

								Incorrect Omission of Captures in the Result Array
									While the =split= instance method of JavaScript's built-in =String= object is supposed to include captures from a regular expression splitter in the returned array, this behavior is not supported by some JavaScript interpreters - notably Microsoft's JScript interpreter.

									This means that the statement ='line 1\rline 2\nline 3\r\nline 4'.split (/(\r\n|[\r\n])/)= would return the result array =['line 1','line 2','line 3','line 4']= in the JScript interpreter, and not the array =['line 1','\r','line 2','\n','line 3','\r\n','line 4']= as it should. The =Uize.Str.Split.split= method fixes this issue, so it can be used in Internet Explorer and WSH (Windows Script Host) to safely split strings using a regular expression splitter.

							NOTES
							- compare to the =Uize.Str.Split.splitInTwo= static method
				*/
			},

			splitInTwo:function (_sourceStr,_splitter) {
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
						Uize.Str.Split.splitInTwo
							Returns an array of exactly two elements, representing the two segments of the specified source string after splitting it using the specified splitter string.

							SYNTAX
							..................................................................
							twoPartsARRAY = Uize.Str.Split.splitInTwo (sourceSTR,splitterSTR);
							..................................................................

							EXAMPLE
							...............................................................................
							var nameValue = Uize.Str.Split.splitInTwo ('TITLE: The Matrix: Reloaded',': ');
							...............................................................................

							In the above example, the =nameValue= variable would be left with the array value =['TITLE','The Matrix: Reloaded']=. In contrast, the built-in =split= method of the =String= object would produce the three element array =['TITLE','The Matrix','Reloaded']= when splitting the above string using =': '=.

							If the splitter string is not found within the source string, then the returned array will contain the entire source string for its first element, and an empty string for its second element.

							EXAMPLE
							.........................................................
							var nameValue = Uize.Str.Split.splitInTwo ('TITLE',': ');
							.........................................................

							In the above example, the =nameValue= variable would be left with the array value =['TITLE','']=.

							VARIATION
							.....................................................................
							twoPartsARRAY = Uize.Str.Split.splitInTwo (sourceSTR,splitterREGEXP);
							.....................................................................

							When a =splitterREGEXP= parameter is specified, the =sourceSTR= value will be split on the regular expression, and the two resulting parts will exclude the substring that was matched by the splitter regular expression.

							EXAMPLE
							.........................................................................................
							var nameValue =
								Uize.Str.Split.splitInTwo ('TITLE   :   The Matrix: Reloaded',new RegExp ('\\s*:\\s*')
							;
							.........................................................................................

							In the above example, the =nameValue= variable would be left with the array value =['TITLE','The Matrix: Reloaded']=. In this case, the regular expression specified for the =splitterREGEXP= parameter matches a substring of any number of spaces, followed by a colon, followed by any number of spaces - in other words, a colon with optional padding. The two parts of the result will not include the whitespace padding around the colon, since it was part of the splitter match.
				*/
			}
		});
	}
});

