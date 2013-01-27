/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.String.Lines Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.String.Lines= module provides methods for working with multi-line strings, supporting indenting, changing linebreaks, modifying lines, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
			The =Uize.String.Lines= module provides methods for...

			- `Iterating Across Lines`
			- `Modifying the Contents of Lines`
			- `Filtering Lines for Removal or Retention`
			- `Removing Unwanted Whitespace`
			- `Working with Indentation`
			- `Working with Linebreaks`
			- `Working with Lines More Generally`

			Iterating Across Lines
				The =Uize.String.Lines.forEach= static method can be used to iterate through all lines of a multi-line string, executing a custom function for handling each line.

			Modifying the Contents of Lines
				The contents of all lines of a multi-line string can be modified using the =Uize.String.Lines.modify= static method, where a custom line modifier function can be specified for processing each line.

			Filtering Lines for Removal or Retention
				Lines of a multi-line string can be filtered out for removal or retention using the =Uize.String.Lines.removeBlanks=, =Uize.String.Lines.removeMatching=, and =Uize.String.Lines.retainMatching= static methods.

			Removing Unwanted Whitespace
				Unwanted whitespace can be trimmed from all lines of a multi-line string using the =Uize.String.Lines.trim=, =Uize.String.Lines.trimLeft=, and =Uize.String.Lines.trimRight= static methods.

			Working with Indentation
				Indentation of lines in a multi-line string can be analyzed and modified using the =Uize.String.Lines.getIndentRange=, =Uize.String.Lines.indent=, =Uize.String.Lines.switchIndentType=, and =Uize.String.Lines.normalizeIndent= static methods.

			Working with Linebreaks
				Linebreak type for lines in a multi-line string can be analyzed and modified using the =Uize.String.Lines.getLinebreakType= and =Uize.String.Lines.switchLinebreakType= static methods.

			Working with Lines More Generally
				In order to work with lines more generally, a multi-line string can be split into a lines array using the =Uize.String.Lines.split= static method.
*/

Uize.module ({
	name:'Uize.String.Lines',
	required:'Uize.String',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined
			;

		/*** General Variables ***/
			var _multiLineStrRegExp = /\r\n|\n|\r/;

		/*** Static Methods ***/
			_package.forEach = function (_sourceStr,_lineHandler) {
				if (_sourceStr) {
					var
						_lineNo = 0,
						_lineRegExp = new RegExp ('([^\\n\\r]*)(\\r\\n|\\n|\\r|$)','g'),
						_lineMatch,
						_result
					;
					while (_result !== false && (_lineMatch = _lineRegExp.exec (_sourceStr)) && _lineMatch [0])
						_result = _lineHandler (_lineMatch [1],_lineMatch [2],_lineNo++)
					;
				} else {
					_lineHandler ('','',0);
				}
				/*?
					Static Methods
						Uize.String.Lines.forEach
							Lets you iterate through all of the lines of a multi-line string.

							SYNTAX
							......................................................
							Uize.String.Lines.forEach (sourceSTR,lineHandlerFUNC);
							......................................................

							lineHandlerFUNC
								A function specified for the =lineHandlerFUNC= parameter should expect to receive the following three parameters...

								- a string, containing the contents of the line being processed, without the linebreak characters
								- a string, containing just the linebreak characters, if present (the last line of a multi-line string may not have any linebreak characters)
								- a zero-based integer, representing the line number for the line being processed

								In your function it is not necessary to declare all three parameters. In many cases, you may not care about the linebreak characters or the line number, and in those cases your function can simply declare the first parameter. Returning the value =false= in your line handler function can be used for `terminating iteration`.

							An Example
								In this example, we're using the =Uize.String.Lines.forEach= method to iterate over all of the lines in a multi-line string in order to calculate the lengths (excluding linebreak characters) of the longest and shortest lines.

								EXAMPLE
								.....................................................................
								var
									longestLineLength = -Infinity,
									shortestLineLength = Infinity
								;
								Uize.String.Lines.forEach (
									'Sunlight can be converted into electricity \n' +
									'using photovoltaics (PV).\n' +
									'A solar cell, or photovoltaic cell (PV), \n' +
									'is a device that converts light into electric current \n' +
									'using the photoelectric effect.\n'
									,
									function (line) {
										longestLineLength = Math.max (longestLineLength,line.length);
										shortestLineLength = Math.min (shortestLineLength,line.length);
									}
								);
								.....................................................................

								After the above code has executed, the value of the =longestLineLength= variable will be =54=, and the value of the =shortestLineLength= variable will be =25=. Naturally, this code could be neatly wrapped up into a function that accepts a source string and returns an object with properties for the lengths of the longest and shortest lines of any specified source string.

							Terminating Iteration
								It is not necessary for your line handler function to return a value, but returning the boolean value =false= has a special meaning, indicating that iteration should be terminated.

								This is useful in cases where you wish to use the =Uize.String.Lines.forEach= method to scan through the lines of a multi-line string to find something. Once you've found what you're looking for, there's no need to waste further effort with continuing the iteration. Returning =false= acts like a =break= statement in a traditional =for= or =while= loop. Consider the following example...

								EXAMPLE
								..................................................................
								var dateLineNo;
								Uize.String.Lines.forEach (
									'SOLAR\n' +
									'2009/12/15\n' +
									'WIND\n' +
									'Tue Dec 15 2009 00:00:00 GMT-0800 (Pacific Standard Time)\n' +
									'BIOFUEL'
									,
									function (line,linebreakChars,lineNo) {
										var lineIsDate = !isNaN (+new Date (line));
										if (lineIsDate) dateLineNo = lineNo;
										return !lineIsDate;
									}
								);
								..................................................................

								In the above example, we're using the =Uize.String.Lines.forEach= method to iterate over all of the lines in a multi-line string in order to obtain the line number for the first line whose contents is a validly formatted date. After the above code has executed, the value of the =dateLineNo= variable will be =1=. Because the value =false= will be returned when the first line is encountered that is a validly formatted date, iteration will be terminated at that point and the second date in our example source string will not be encountered. If our source string did not contain any lines that were validly formatted dates, then the value of the =dateLineNo= variable would remain =undefined=.

							NOTES
							- compare to the =Uize.String.Lines.modify= static method
				*/
			};

			_package.getIndentRange = function (_sourceStr,_indentChars) {
				var
					_minValue = Infinity,
					_maxValue = -_minValue
				;
				if (_sourceStr) {
					if (_indentChars == _undefined) _indentChars = '\t';
					if (_indentChars) {
						var
							_indentCharsLength = _indentChars.length,
							_indentLevel,
							_indentRegExp = new RegExp (
								'(?:^|\\r\\n|\\n|\\r)((?:' + _indentChars.replace (/\t/g,'\\t') + ')*)\\S',
								'g'
							),
							_indentMatch
						;
						while (_indentMatch = _indentRegExp.exec (_sourceStr)) {
							_minValue = Math.min (_minValue,_indentLevel = _indentMatch [1].length / _indentCharsLength);
							_maxValue = Math.max (_maxValue,_indentLevel);
						}
					}
				}
				if (_minValue == Infinity) _minValue = _maxValue = 0;
				return {minValue:_minValue,maxValue:_maxValue};
				/*?
					Static Methods
						Uize.String.Lines.getIndentRange
							Returns a range object, specifying the range of indent levels found in the specified string.

							SYNTAX
							..............................................................
							indentRangeOBJ = Uize.String.Lines.getIndentRange (sourceSTR);
							..............................................................

							The =Uize.String.Lines.getIndentRange= method returns a range object with the following contents...

							.............................................................................
							{
								minValue : minIndentLevelINT,  // indent level for the least indented line
								maxValue : maxIndentLevelINT   // indent level for the most indented line
							}
							.............................................................................

							EXAMPLE
							....................................................
							var indentRange = Uize.String.Lines.getIndentRange (
								'\tThis line is indented one level\n' +
								'\t\tThis line is indented two levels\n' +
								'\t\t\tThis line is indented three levels\n' +
								'\n' +        // blank lines are not considered
								'\t\t\t\t\n'  // blank lines are not considered
							);
							....................................................

							After the above code has executed, the value of the =indentRange= variable will be the object ={minValue:1,maxValue:3}=. The least indented non-whitespace line has one level of indentation, and the most indented non-whitespace line has three levels of indentation. What you'll notice from the above example is that the two blank lines are not considered when calculating the indent range, even though the one blank line's indent level would be =0= and the other blank line's indent level would be =4=.

							VARIATION
							.............................................................................
							indentRangeOBJ = Uize.String.Lines.getIndentRange (sourceSTR,indentCharsSTR);
							.............................................................................

							Not all multi-line strings with indentation will necessarily be indented using tab characters (although, of course, they should). Some may be indented using multiple spaces to represent a single level of indentation. It could be three spaces in a row, or four, or less, or more. The optional =indentCharsSTR= parameter lets you specify any sequence of characters that should be considered to represent a single level of indentation. Consider the following example...

							EXAMPLE
							....................................................
							var indentRange = Uize.String.Lines.getIndentRange (
								'   This line is indented one level\n' +
								'      This line is indented two levels\n' +
								'         This line is indented three levels\n',
								'   '
							);
							....................................................

							As with the earlier example, the value of the =indentRange= variable after the above code has executed will be the object ={minValue:1,maxValue:3}=. Each line is indented using three spaces to represent a single level of indentation, and the value ='   '= (three spaces) is being specified for the =indentCharsSTR= parameter.

							Using minValue and maxValue
								In your code you may only care about the =minValue= property of the indent range object, or you may only care about the =maxLevel= property, or you may care about both.

								You can dereference the value of either - or both - of these properties as needed. Consider the following two example usages...

								Normalizing an Indented Multi-line String
									Using the =Uize.String.Lines.indent= method with the =Uize.String.Lines.getIndentRange= method, a multi-line string containing indentation can be "normalized" so that the least indented line has no indentation.

									EXAMPLE
									...............................................................
									var multiLineString =
										'\t\tLINE 1\n' +
										'\t\t\tLINE 2\n' +
										'\t\t\t\tLINE 3\n'
									;
									multiLineString = Uize.String.Lines.indent (
										multiLineString,
										-Uize.String.Lines.getIndentRange (multiLineString).minValue
									);
									...............................................................

									In the above example you'll notice that the least indented line of the multi-line string has two levels of indentation. We can strip two levels of indentation from all the lines by using the =Uize.String.Lines.indent= method and specifying a negative number for its =indentAmountINT= parameter. To calculate the amount to unindent, we use the =Uize.String.Lines.getIndentRange= method and access the value of the =minValue= property from the returned indent range object. Then we negate this value. Simple. After the above code has been executed, the value of the =multiLineString= variable would be...

									..............
									'LINE 1\n' +
									'\tLINE 2\n' +
									'\t\tLINE 3\n'
									..............

								Stripping all Indentation
									Because the =Uize.String.Lines.indent= static method supports over-unindenting a source string, you could use the value of the =maxValue= property of the indent range object to remove all indenting.

									EXAMPLE
									...............................................................
									var multiLineString =
										'\t\tLINE 1\n' +
										'\t\t\tLINE 2\n' +
										'\t\t\t\tLINE 3\n'
									;
									multiLineString = Uize.String.Lines.indent (
										multiLineString,
										-Uize.String.Lines.getIndentRange (multiLineString).maxValue
									);
									...............................................................

									As with `normalizing an indented multi-line string`, we are using the =Uize.String.Lines.getIndentRange= method to determine how many levels of indentation to remove across all lines of the multi-line string. By using the value of the =maxValue= property from the returned indent range object, we can make sure that all indentation is stripped from even the most deeply indented line. After the above code has been executed, the value of the =multiLineString= variable would be...

									............
									'LINE 1\n' +
									'LINE 2\n' +
									'LINE 3\n'
									............

							NOTES
							- see the related =Uize.String.Lines.indent= static method
							- lines in multi-line strings can be terminated with a carriage return (CR) character, a linefeed (LF) character, or a combination of carriage return plus linefeed (CRLF) characters
							- lines with only whitespace are not considered when calculating indent range values
				*/
			};

			_package.getLinebreakType = function (_sourceStr,_defaultLinebreakChars) {
				var _firstLinebreakMatch = _sourceStr.match (/\r\n|\n|\r/);
				return _firstLinebreakMatch ? _firstLinebreakMatch [0] : (_defaultLinebreakChars || '\n');
				/*?
					Static Methods
						Uize.String.Lines.getLinebreakType
							Returns a string, representing the first linebreak character(s) detected in the specified source string.

							SYNTAX
							............................................................................................
							linebreakCharsSTR = Uize.String.Lines.getLinebreakType (sourceSTR,defaultLinebreakCharsSTR);
							............................................................................................

							The value returned by this method will be either ='\n'= (a linefeed character), ='\r'= (a carriage return character), or ='\r\n'= (a combination of a carriage return character followed by a linefeed character). If the string specified by the =sourceSTR= parameter does not contain any linebreak characters (ie. it's a single line string with no linebreak at the end), then this method will return the value of the optional =defaultLinebreakCharsSTR= parameter.

							VARIATION
							...................................................................
							linebreakCharsSTR = Uize.String.Lines.getLinebreakType (sourceSTR);
							...................................................................

							When the optional =defaultLinebreakCharsSTR= parameter is not specified, or if the value =null=, =undefined=, or =''= (an empty string) is specified for it, then its value will be defaulted to ='\n'= (a linefeed character).

							EXAMPLES
							.................................................................................
							Uize.String.Lines.getLinebreakType ('LINE 1\nLINE 2');          // returns '\n'
							Uize.String.Lines.getLinebreakType ('LINE 1\rLINE 2');          // returns '\r'
							Uize.String.Lines.getLinebreakType ('LINE 1\r\nLINE 2');        // returns '\r\n'
							Uize.String.Lines.getLinebreakType ('LINE 1');                  // returns '\n'
							Uize.String.Lines.getLinebreakType ('LINE 1','\n');             // returns '\n'
							Uize.String.Lines.getLinebreakType ('LINE 1','\r');             // returns '\r'
							Uize.String.Lines.getLinebreakType ('LINE 1','\r\n');           // returns '\r\n'
							Uize.String.Lines.getLinebreakType ('LINE 1\rLINE 2\nLINE 3');  // returns '\r'
							.................................................................................

							NOTES
							- see the related =Uize.String.Lines.switchLinebreakType= static method
				*/
			};

			_package.indent = function (_sourceStr,_indentAmount,_indentChars,_indentFirstLine) {
				if (_indentChars == _undefined) _indentChars = '\t';
				if (!_sourceStr || !_indentAmount || !_indentChars) return _sourceStr;
				/* TO DO:
					detect repeated chars with match (/^(.+?)\1+$/) and factor down to single repeated chars and adjust indentAmount (this will fix problems with unindenting where there are incomplete indent space sets in the sourceStr)
				*/
				_indentFirstLine = _indentFirstLine !== false;

				var _indentToAddStr = Uize.String.repeat (_indentChars,_indentAmount);
				return (
					_indentToAddStr && _indentFirstLine && !_multiLineStrRegExp.test (_sourceStr)
						? _indentToAddStr + _sourceStr
						: _sourceStr.replace (
							new RegExp (
								'(^|\\r\\n|\\n|\\r)' + (
									_indentAmount > 0
										? '()'
										: '(' + _indentChars.replace (/\t/g,'\\t') + '){1,' + -_indentAmount + '}'
								) + '(' + (_indentAmount > 0 ? '[^\\n\\r]' : '') + ')',
								'g'
							),
							function (_match,_beforeLineChars,_indentStr,_firstCharAfterIndent) {
								return (
									_beforeLineChars + (_indentFirstLine || _beforeLineChars ? _indentToAddStr : '') + _firstCharAfterIndent
								);
							}
						)
				);
				/*?
					Static Methods
						Uize.String.Lines.indent
							Returns a string, that is the specified source string with all its lines indented (or unindented) by the specified amount.

							SYNTAX
							...................................................................
							indentedSTR = Uize.String.Lines.indent (sourceSTR,indentAmountINT);
							...................................................................

							EXAMPLE
							....................................................
							var myPrettyFunctionStr =
								'function myFunction () {\n' +
									Uize.String.Lines.indent (functionBodyStr,1) +
								'}\n'
							;
							....................................................

							In the above example, the =functionBodyStr= variable is assumed to contain a potentially multi-line function implementation block.

							Unindenting
								Using the =Uize.String.Lines.indent= method, it is possible to either indent *or* unindent a multi-line string. To unindent, simply specify a negative value for the =indentAmountINT= parameter. This negative value specifies how many indent levels to remove from the string.

								All indentation up to the specified number of indent levels to remove will be removed. So, for example, when you specify the value =-4= for the =indentAmountINT= parameter, all lines with one, two, three, and four levels of indentation will lose their indentation. Lines with five levels of indentation will be left with one, lines with six levels of indentation will be left with 2, and so on. This is consistent with the behavior of many text editors.

							VARIATION
							..................................................................................
							indentedSTR = Uize.String.Lines.indent (sourceSTR,indentAmountINT,indentCharsSTR);
							..................................................................................

							By default, the =Uize.String.Lines.indent= method uses a single tab character for indenting: one tab equals one level of indentation. When the optional =indentCharsSTR= parameter is specified, it is possible to control the characters that are used to represent a level of indentation.

							For example, if you wish one level of indentation to be represented by four spaces, simply specify a string containing four spaces for this parameter. This applies both for indenting *and* unindenting. For example, when the value =-2= is specified for the =indentAmountINT= parameter and a string of four spaces is specified for the =indentCharsSTR= parameter, then up to eight leading spaces will be removed from all lines.

							NOTES
							- when indenting a multi-line string, empty lines are not indented
				*/
			};

			_package.modify = function (_sourceStr,_lineModifier) {
				var
					_lineNo = 0,
					_modifiedLine
				;
				return (
					_sourceStr.replace (
						/([^\n\r]*)(\r\n|\n|\r|$)/g,
						function (_match,_line,_linebreakChars) {
							if (!_match) return '';
							return (
								typeof (_modifiedLine = _lineModifier (_line,_linebreakChars,_lineNo++)) != 'boolean'
									? _modifiedLine + _linebreakChars
									: _modifiedLine
										? _line + _linebreakChars
										: ''
							);
						}
					)
				);
				/*?
					Static Methods
						Uize.String.Lines.modify
							Returns a string, being the specified source string with all its lines modified by the specified line modifier function.

							SYNTAX
							.....................................................................
							multilineSTR = Uize.String.Lines.modify (sourceSTR,lineModifierFUNC);
							.....................................................................

							lineModifierFUNC
								A function specified for the =lineModifierFUNC= parameter should expect to receive the following three parameters...

								- a string, containing the contents of the line being processed, without the linebreak characters
								- a string, containing just the linebreak characters, if present (the last line of a multi-line string may not have any linebreak characters)
								- a zero-based integer, representing the line number for the line being processed

								In your function it is not necessary to declare all three parameters. In many cases, you may not care about the linebreak characters or the line number, and in those cases your function can simply declare the first parameter.

								Modifying Lines
									To modify lines, a line modifier function should return a string for the modified version of a line, and this modified version will be used in place of the original version when building the string to be returned by the =Uize.String.Lines.modify= method.

									Returning a string value in your line modifier function, there is no way to modify the linebreak characters - you can only return a modified version of the line's contents (excluding its linebreak characters).

								Filtering Lines
									In cases where you only wish to filter lines rather than to modify them, the line modifier function may return a boolean value, indicating whether or not a line should be retained.

									Returning the value =true= will result in a line being retained, and returning the value =false= will result in it being removed (along with its linebreak characters).

							Example 1
								In this example, the line modifier function is using the line number parameter passed to it to add line numbering to all lines of a multi-line string.

								EXAMPLE
								............................................................................
								numberedLines = Uize.String.Lines.modify (
									'line 1\n' +
									'line 2\n' +
									'line 3\n' +
									'line 4\n' +
									'line 5'
									,
									function (line,linebreakChars,lineNo) {return (lineNo + 1) + ': ' + line}
								)
								............................................................................

								OUTPUT
								...............
								'1: line 1\n' +
								'2: line 2\n' +
								'3: line 3\n' +
								'4: line 4\n' +
								'5: line 5'
								...............

							Example 2
								In this example, the line modifier function is using the ability to return a boolean value in order to extract only those lines within a range of line numbers.

								EXAMPLE
								............................................................................
								Uize.String.Lines.modify (
									'line 0\n' +
									'line 1\n' +
									'line 2\n' +
									'line 3\n' +
									'line 4\n' +
									'line 5\n' +
									'line 6\n' +
									'line 7\n' +
									'line 8\n' +
									'line 9'
									,
									function (line,linebreakChars,lineNo) {return lineNo >= 3 && lineNo <= 6}
								);
								............................................................................

								OUTPUT
								............
								'line 3\n' +
								'line 4\n' +
								'line 5\n' +
								'line 6\n'
								............

							NOTES
							- compare to the =Uize.String.Lines.forEach= static method
				*/
			};

			_package.normalizeIndent = function (_sourceStr,_indentChars) {
				return _package.indent (
					_sourceStr,
					-Uize.String.Lines.getIndentRange (_sourceStr,_indentChars).minValue,
					_indentChars
				);
				/*?
					Static Methods
						Uize.String.Lines.normalizeIndent
							Returns a string, being the specified source string with its indentation normalized (ie. unindented as much as necessary), so that the least indented line ends up being flush against the left.

							SYNTAX
							............................................................................
							multilineSTR = Uize.String.Lines.normalizeIndent (sourceSTR,indentCharsSTR);
							............................................................................

							This method is useful when extracting a portion of a structured text document that has many levels of indenting. In a portion that is extracted from such a string, the least indented line may still have many levels of indenting ahead of its first non-whitespace character. The =Uize.String.Lines.normalizeIndent= method can be used to unindent all lines of the multi-line string, only as much as is necessary in order to make the least indented line(s) of the string have no indent (ie. be flush left).

							VARIATION
							.............................................................
							multilineSTR = Uize.String.Lines.normalizeIndent (sourceSTR);
							.............................................................

							When the =indentCharsSTR= parameter is not specified, then the value ='\n'= (a single tab character) will be used as its default.

							An Example
								In this example, we're normalizing the indentation for all lines of a multi-line string, where each level of indentation is represented by three spaces.

								To do this, we specify the value ='   '= (three spaces) for the optional =indentCharsSTR= parameter. In our source string, the least indented line has three levels of indentation. This means that three levels of indentation (nine spaces) will be removed from all lines of the string.

								EXAMPLE
								...................................
								Uize.String.Lines.normalizeIndent (
									'         line 1\n' +
									'            line 2\n' +
									'               line 3\n' +
									'            line 4'
									,
									'   '
								);
								...................................

								OUTPUT
								..................
								'line 1\n' +
								'   line 2\n' +
								'      line 3\n' +
								'   line 4'
								..................
				*/
			};

			_package.removeBlanks = function (_sourceStr,_onlyCompletelyEmpty) {
				function _isNonEmptyString (_line) {return !!_line}
				return _package.removeMatching (_sourceStr,_onlyCompletelyEmpty ? _isNonEmptyString : Uize.String.trim,1);
				/*?
					Static Methods
						Uize.String.Lines.removeBlanks
							Returns a string, being the specified source string with all of its blank lines removed.

							SYNTAX
							..........................................................
							multilineSTR = Uize.String.Lines.removeBlanks (sourceSTR);
							..........................................................

							VARIATION
							..................................................................................
							multilineSTR = Uize.String.Lines.removeBlanks (sourceSTR,onlyCompletelyEmptyBOOL);
							..................................................................................

							By default, lines that are considered blank are lines that are either completely empty or that contain only whitespace. When the value =true= is specified for the optional =onlyCompletelyEmptyBOOL= parameter, then only lines that are completely empty will be removed - lines that contain only whitespace characters, such as spaces or tabs, will not be removed.

							Example 1
								In this example, the optional =onlyCompletelyEmptyBOOL= parameter is omitted.

								EXAMPLE
								................................
								Uize.String.Lines.removeBlanks (
									'SOLAR\n' +
									'\n' +
									'WIND\n' +
									'  \n' +
									'\t\n' +
									'BIOFUEL'
								);
								................................

								OUTPUT
								...........
								'SOLAR\n' +
								'WIND\n' +
								'BIOFUEL'
								...........

							Example 2
								In this example, the value =true= is specified for the optional =onlyCompletelyEmptyBOOL= parameter.

								EXAMPLE
								................................
								Uize.String.Lines.removeBlanks (
									'SOLAR\n' +
									'\n' +
									'WIND\n' +
									'  \n' +
									'\t\n' +
									'BIOFUEL',
									true
								);
								................................

								OUTPUT
								...........
								'SOLAR\n' +
								'WIND\n' +
								'  \n' +
								'\t\n' +
								'BIOFUEL'
								...........

							NOTES
							- see the related =Uize.String.Lines.removeMatching= and =Uize.String.Lines.retainMatching= static methods
				*/
			};

			_package.removeMatching = function (_sourceStr,_match,_retain) {
				_retain = !!_retain;
				return _package.modify (
					_sourceStr,
					Uize.isFunction (_match)
						? function (_line) {return !!_match (_line) == _retain}
						: function (_line) {return _match.test (_line) == _retain}
				);
				/*?
					Static Methods
						Uize.String.Lines.removeMatching
							Returns a string, being the specified source string with all lines that match a specified match function or regular expression removed.

							SYNTAX
							......................................................................................
							multilineSTR = Uize.String.Lines.removeMatching (sourceSTR,matchRegExpOBJorMatchFUNC);
							......................................................................................

							The value of the =matchRegExpOBJorMatchFUNC= parameter can be a regular expression or a match function. If a regular expression is specified, then the regular expression's =test= instance method will be used for each line to determine if the line matches the regular expression and should, therefore, be removed. If a function is specified instead of a regular expression, then the match function will be called for each line in order to determine if the line should be removed. The match function should expect to receive a single parameter, being the current line being evaluated - without the linebreak characters. The match function should return a boolean value, with the value =true= indicating that the line should be removed, and the value =false= indicating that it should be retained.

							Example 1
								In this example, a regular expression is being specified for the =matchRegExpOBJorMatchFUNC= parameter that will match all lines that begin with line numbering, so that all lines with line numbers will be removed.

								EXAMPLE
								..................................
								Uize.String.Lines.removeMatching (
									'line 1\n' +
									'2: line 2\n' +
									'3: line 3\n' +
									'line 4',
									/^\d+:/
								);
								..................................

								OUTPUT
								............
								'line 1\n' +
								'line 4'
								............

							Example 2
								In this example, a match function is being specified for the =matchRegExpOBJorMatchFUNC= parameter that will match all lines that are validly formatted date strings, so that all lines that are dates will be removed.

								EXAMPLE
								..................................................................
								Uize.String.Lines.removeMatching (
									'SOLAR\n' +
									'2009/12/15\n' +
									'WIND\n' +
									'Tue Dec 15 2009 00:00:00 GMT-0800 (Pacific Standard Time)\n' +
									'BIOFUEL',
									function (line) {return !isNaN (+new Date (line))}
								);
								..................................................................

								OUTPUT
								...........
								'SOLAR\n' +
								'WIND\n' +
								'BIOFUEL'
								...........

							NOTES
							- see the companion =Uize.String.Lines.retainMatching= static method
							- see the related =Uize.String.Lines.removeBlanks= static method
				*/
			};

			_package.retainMatching = function (_sourceStr,_match) {
				return _package.removeMatching (_sourceStr,_match,1);
				/*?
					Static Methods
						Uize.String.Lines.retainMatching
							Returns a string, being the specified source string with only those lines that match a specified match function or regular expression retained.

							SYNTAX
							......................................................................................
							multilineSTR = Uize.String.Lines.retainMatching (sourceSTR,matchRegExpOBJorMatchFUNC);
							......................................................................................

							The value of the =matchRegExpOBJorMatchFUNC= parameter can be a regular expression or a match function. If a regular expression is specified, then the regular expression's =test= instance method will be used for each line to determine if the line matches the regular expression and should, therefore, be retained. If a function is specified instead of a regular expression, then the match function will be called for each line in order to determine if the line should be retained. The match function should expect to receive a single parameter, being the current line being evaluated - without the linebreak characters. The match function should return a boolean value, with the value =true= indicating that the line should be retained, and the value =false= indicating that it should be removed.

							Example 1
								In this example, a regular expression is being specified for the =matchRegExpOBJorMatchFUNC= parameter that will match all lines that begin with line numbering, so that only lines with line numbers will be retained.

								EXAMPLE
								..................................
								Uize.String.Lines.retainMatching (
									'line 1\n' +
									'2: line 2\n' +
									'3: line 3\n' +
									'line 4',
									/^\d+:/
								);
								..................................

								OUTPUT
								...............
								'2: line 2\n' +
								'3: line 3\n'
								...............

							Example 2
								In this example, a match function is being specified for the =matchRegExpOBJorMatchFUNC= parameter that will match all lines that are validly formatted date strings, so that all lines that are dates will be retained.

								EXAMPLE
								..................................................................
								Uize.String.Lines.retainMatching (
									'SOLAR\n' +
									'2009/12/15\n' +
									'WIND\n' +
									'Tue Dec 15 2009 00:00:00 GMT-0800 (Pacific Standard Time)\n' +
									'BIOFUEL',
									function (line) {return !isNaN (+new Date (line))}
								);
								..................................................................

								OUTPUT
								.............................................................
								'2009/12/15\n' +
								'Tue Dec 15 2009 00:00:00 GMT-0800 (Pacific Standard Time)\n'
								.............................................................

							NOTES
							- see the companion =Uize.String.Lines.removeMatching= static method
							- see the related =Uize.String.Lines.removeBlanks= static method
				*/
			};

			_package.split = function (_sourceStr) {
				return (_sourceStr.indexOf ('\r') + 1 ? _sourceStr.replace (/\r\n?/g,'\n') : _sourceStr).split ('\n');
					/* NOTE:
						There's a silly issue with the way that Microsoft's JScript handles splitting a string when the splitter is a regular expression. Essentially, multiple consecutive occurrences of a match for a regular expression do not result in empty string elements populating the split call's resulting array - instead, multiple consecutive splitter matches seem to be collapsed down and effectively treated as a single split point. This behavior is problematic, because empty lines are then completely lost - as if they never even existed. Curiously, though, using the same regular expression that would have been used in a split call in a replace method call does what one would expect. So, we replace the \r\n with '\n' and then split on the string literal '\n' (rather than a regular expression).
					*/
				/*?
					Static Methods
						Uize.String.Lines.split
							Returns an array of strings, that is the specified source string split into individual lines.

							SYNTAX
							.................................................
							linesARRAY = Uize.String.Lines.split (sourceSTR);
							.................................................

							EXAMPLE
							...............................................................
							var lines = Uize.String.Lines.split ('line 1\nline 2\nline 3');
							...............................................................

							The above example would leave the variable =lines= with the array value =['line 1','line 2','line 3']=.

							NOTE

							This method handles an issue in Internet Explorer where using the split method of the =String= object with a linebreak regular expression collapses consecutive linebreaks in the string being split, resulting in an innacurate reflection of the number of lines in a multi-line string, and not accurately reflecting the presence of empty lines.
				*/
			};

			_package.switchIndentType = function (_sourceStr,_oldIndentChars,_newIndentChars) {
				if (_oldIndentChars == _undefined) _oldIndentChars = '    ';
				if (_newIndentChars == _undefined) _newIndentChars = '\t';
				var
					_oldIndentCharsLength = _oldIndentChars.length,
					_indentPaddingPerLevel = [],
					_indentLevel
				;
				return (
					_sourceStr.replace (
						new RegExp ('(^|\\r\\n|\\n|\\r)((?:' + _oldIndentChars.replace (/\t/g,'\\t') + ')+)','g'),
						function (_match,_beforeLineChars,_indentStr) {
							return (
								_beforeLineChars + (
									_indentPaddingPerLevel [_indentLevel = _indentStr.length / _oldIndentCharsLength] ||
									(_indentPaddingPerLevel [_indentLevel] = Uize.String.repeat (_newIndentChars,_indentLevel))
								)
							);
						}
					)
				);
				/*?
					Static Methods
						Uize.String.Lines.switchIndentType
							Returns a string, being the specified source string with its indentation switched from the specified old type to the specified new type.

							SYNTAX
							...............................................................................
							multilineSTR =
								Uize.String.Lines.switchIndentType (sourceSTR,oldIndentChars,newIndentChars)
							;
							...............................................................................

							VARIATION 1
							.............................................................................
							multilineSTR = Uize.String.Lines.switchIndentType (sourceSTR,oldIndentChars);
							.............................................................................

							When the =newIndentChars= parameter is not specified, then the value ='\t'= (a single tab character) will be used as its default.

							VARIATION 2
							..............................................................
							multilineSTR = Uize.String.Lines.switchIndentType (sourceSTR);
							..............................................................

							When the =oldIndentChars= parameter is not specified, then the value ='    '= (four spaces) will be used as its default.

							An example
								In this example, indentation for a string is being switched from four spaces per indent level to a single tab per indent level.

								EXAMPLE
								...........................................
								Uize.String.Lines.switchIndentType (
									'no indent\n' +
									'    one level of indent\n' +
									'        two levels of indent\n' +
									'            three levels of indent\n' +
									'            three levels of indent\n' +
									'        two levels of indent\n' +
									'    one level of indent\n' +
									'no indent',
									'    ',
									'\t'
								);
								...........................................

								OUTPUT
								..................................
								'no indent\n' +
								'\tone level of indent\n' +
								'\t\ttwo levels of indent\n' +
								'\t\t\tthree levels of indent\n' +
								'\t\t\tthree levels of indent\n' +
								'\t\ttwo levels of indent\n' +
								'\tone level of indent\n' +
								'no indent'
								..................................

							NOTES
							- see the related =Uize.String.Lines.switchLinebreakType= static method
				*/
			};

			_package.switchLinebreakType = function (_sourceStr,_linebreakChars) {
				return _sourceStr.replace (/\r\n|\n|\r/g,_linebreakChars == null ? '\n' : _linebreakChars);
				/*?
					Static Methods
						Uize.String.Lines.switchLinebreakType
							Returns a string, being the specified source string with its linebreak characters switched to the specified new linebreak characters - for all lines of the string.

							SYNTAX
							...................................................................................
							multilineSTR = Uize.String.Lines.switchLinebreakType (sourceSTR,linebreakCharsSTR);
							...................................................................................

							Using this method, you can switch a multi-line string from using a ='\r'= (carriage return) character to using a ='\n'= (linefeed) character for separating its lines. Or, you can switch from LF to CR, or from LF to CRLF, or CRLF to CR, etc. When using this method, it is not necessary to specify the existing linebreak type used in the source string - it will be automatically detected for you.

							VARIATION
							.................................................................
							multilineSTR = Uize.String.Lines.switchLinebreakType (sourceSTR);
							.................................................................

							When the =linebreakCharsSTR= parameter is not specified, or if the value =null= or =undefined= is specified for it, then its value will be defaulted to ='\n'=.

							Example 1
								In this example, the specified multi-line string contains mixed linebreak types, and the optional =linebreakCharsSTR= parameter is omitted.

								EXAMPLE
								.......................................
								Uize.String.Lines.switchLinebreakType (
									'LINE 1\r' +
									'LINE 2\n' +
									'LINE 3\r\n' +
									'LINE 4'
								);
								.......................................

								OUTPUT
								............
								'LINE 1\n' +
								'LINE 2\n' +
								'LINE 3\n' +
								'LINE 4'
								............

							Example 2
								In this example, the specified multi-line string contains mixed linebreak types, and the value ='\r\n'= is specified for the optional =linebreakCharsSTR= parameter.

								EXAMPLE
								.......................................
								Uize.String.Lines.switchLinebreakType (
									'LINE 1\r' +
									'LINE 2\n' +
									'LINE 3\r\n' +
									'LINE 4',
									'\r\n'
								);
								.......................................

								OUTPUT
								...............
								'LINE 1\r\n' +
								'LINE 2\r\n' +
								'LINE 3\r\n' +
								'LINE 4'
								...............

							Example 3
								In this example, the value =','= is specified for the optional =linebreakCharsSTR= parameter in order to collapse all lines of a multi-line string into a comma-separated single line string, demonstrating that you can use the =Uize.String.Lines.switchLinebreakType= method to replace linebreaks with something other than linebreaks.

								EXAMPLE
								.......................................
								Uize.String.Lines.switchLinebreakType (
									'LINE 1\r' +
									'LINE 2\n' +
									'LINE 3\r\n' +
									'LINE 4',
									','
								);
								.......................................

								OUTPUT
								.............................
								'LINE 1,LINE 2,LINE 3,LINE 4'
								.............................

							NOTES
							- see the related =Uize.String.Lines.getLinebreakType= static method
				*/
			};

			_package.trim = function (_sourceStr,_side) {
				return _package.modify (_sourceStr,function (_line) {return Uize.String.trim (_line,_side)});
				/*?
					Static Methods
						Uize.String.Lines.trim
							Returns a string, being the specified source string trimmed on both left and right sides, so that leading whitespace / indentation as well as trailing whitespace is removed from all lines.

							SYNTAX
							..................................................
							multilineSTR = Uize.String.Lines.trim (sourceSTR);
							..................................................

							EXAMPLE
							............................................................
							var stringWithNoWhitespacePadding = Uize.String.Lines.trim (
								'\tLINE 1\n' +
								'\t\tLINE 2\n' +
								'    LINE 3\n' +
								'LINE 4    \n' +
								'    LINE 5    \n'
							);
							............................................................

							In the above statement, the =Uize.String.Lines.trim= method will strip the indenting / leading whitespace as well as the trailing whitespace, from all lines of the multi-line string. This will produce the string...

							............
							'LINE 1\n' +
							'LINE 2\n' +
							'LINE 3\n' +
							'LINE 4\n' +
							'LINE 5\n'
							............

							NOTES
							- see the companion =Uize.String.Lines.trimLeft= and =Uize.String.Lines.trimRight= static methods
				*/
			};

			_package.trimLeft = function (_sourceStr) {
				return _package.trim (_sourceStr,-1);
				/*?
					Static Methods
						Uize.String.Lines.trimLeft
							Returns a string, being the specified source string left-trimmed so that leading whitespace / indentation is removed from all lines.

							SYNTAX
							......................................................
							multilineSTR = Uize.String.Lines.trimLeft (sourceSTR);
							......................................................

							EXAMPLE
							........................................................
							var stringWithNoIndenting = Uize.String.Lines.trimLeft (
								'\tLINE 1\n' +
								'\t\tLINE 2\n' +
								'    LINE 3\n' +
								'LINE 4    \n' +
								'    LINE 5    \n'
							);
							........................................................

							In the above statement, the =Uize.String.Lines.trimLeft= method will strip the leading whitespace from all lines of the multi-line string, but will leave the trailing whitespace. This will produce the string...

							................
							'LINE 1\n' +
							'LINE 2\n' +
							'LINE 3\n' +
							'LINE 4    \n' +
							'LINE 5    \n'
							................

							NOTES
							- see the companion =Uize.String.Lines.trim= and =Uize.String.Lines.trimRight= static methods
				*/
			};

			_package.trimRight = function (_sourceStr) {
				return _package.trim (_sourceStr,1);
				/*?
					Static Methods
						Uize.String.Lines.trimRight
							Returns a string, being the specified source string right-trimmed so that trailing whitespace is removed from all lines.

							SYNTAX
							.......................................................
							multilineSTR = Uize.String.Lines.trimRight (sourceSTR);
							.......................................................

							EXAMPLE
							..................................................................
							var stringWithNoTrailingWhitespace = Uize.String.Lines.trimRight (
								'\tLINE 1\n' +
								'\t\tLINE 2\n' +
								'    LINE 3\n' +
								'LINE 4    \n' +
								'    LINE 5    \n'
							);
							..................................................................

							In the above statement, the =Uize.String.Lines.trimRight= method will strip the trailing whitespace from all lines of the multi-line string, but will leave the indenting / leading whitespace. This will produce the string...

							................
							'\tLINE 1\n' +
							'\t\tLINE 2\n' +
							'    LINE 3\n' +
							'LINE 4\n' +
							'    LINE 5\n'
							................

							NOTES
							- see the companion =Uize.String.Lines.trim= and =Uize.String.Lines.trimLeft= static methods
				*/
			};

		return _package;
	}
});

