/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Scruncher Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 8
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.Scruncher= package provides a method for scrunching (compressing / minifying) JavaScript source code into compact / obfuscated scrunched code.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/* NOTES
	- whitespace is regarded as being any continuous segment of tab and/or space characters
	- for any amount of whitespace that is necessary for separating tokens, a single space will be substituted
	- if whitespace is being used to separate identifiers and operators and is therefore not essential, it should be removed
	- whitespace is considered necessary when it
		- separates reserved words, identifiers, and literals
			eg. function blah () {} BECOMES--> function blah(){}
		- separates consecutive operators
			eg. a += ++b; BECOMES--> a+= ++b;
	- whitespace is considered unnecessary when it
		- occurs at the start of a line, before any non-whitespace characters
			eg.
				function blah () {
					a++;
				}

				BECOMES-->

				function blah(){
				a++;
				}

		- separates reserved words, identifiers, or literals from operators
			eg. a += b; BECOMES--> a+=b;
		- separates reserved words, identifiers, or literals from delimiters
			eg. a += 2 * (b - 3) BECOMES--> a+=2*(b-3)
			eg. myArray [5] BECOMES--> myArray[5]
			eg. a++ ; BECOMES--> a++;
			eg. myFunction ( 2 , 'hello' , 7 ); BECOMES--> myFunction(2,'hello',7);
		- separates delimiters from each other
			eg. myFunction () ; BECOMES--> myFunction();
			eg. myArray1 [myArray2 [5] ] ; BECOMES--> myArray1[myArray2[5]];
		- separates operators from delimiters
			eg. a ++ ; BECOMES--> a++;
			eg. myVariable += (myArray [a ++ ] - 5) ; BECOMES--> myVariable+=(myArray[a++]-5);
*/

Uize.module({
	name:'Uize.Build.Scruncher',
	required:[
		'Uize.Xml',
		'Uize.String'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false
			;

		/*** Utility Functions ***/
			function _makeCharLookup (_charsStr,_lookupValue) {
				return Uize.lookup (_charsStr.split (''),_lookupValue != null ? _lookupValue : _true);
			}

		/*** General Variables ***/
			var
				/*** token types ***/
					_NONE = 0,
					_WORD = 1,
					_NUMBER = 2,
					_DELIMITER = 3,
					_STRINGLITERAL = 4,
					_COMMENT = 5,
					_OPERATOR = 6,
					_LINEBREAK = 7,

				/*** char lookups ***/
					_operatorCharsLookup = _makeCharLookup ('+-*/%&|^~<>=!?:',_OPERATOR),
					_delimiterCharsLookup = _makeCharLookup ('.,()[]{};',_DELIMITER),
					_quoteCharsLookup = _makeCharLookup ('"\'',_STRINGLITERAL),
					_linebreakCharsLookup = _makeCharLookup ('\n\r',_LINEBREAK),
					_wordStarterCharsLookup = _makeCharLookup (
						'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$',
						_WORD
					),
					_digitsLookup = _makeCharLookup ('0123456789',_NUMBER),
					_numberCharsLookup = Uize.copyInto (_digitsLookup,{x:_NUMBER}),
					_tokenStarterCharsLookup = Uize.copyInto (
						{},
						_linebreakCharsLookup,
						_operatorCharsLookup,
						_delimiterCharsLookup,
						_quoteCharsLookup,
						_numberCharsLookup,
						_wordStarterCharsLookup
					),
					_wordCharsLookup = Uize.copyInto ({},_wordStarterCharsLookup,_numberCharsLookup),
					_closeParenOrSquareBracketMap = _makeCharLookup (')]'),

				_identifierChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split (''),
				_totalIdentifierChars = _identifierChars.length,
				_invalidOperatorRegExp = /^(:|!+|\*|-|\+|\||\|\||&|&&|%|>|>>|<|<<|=|==|\?|\^)\/$/
					/* EXAMPLES */
					//   object = {prop:/\w+/g}
					//   if (!/\w+/g.test (sourceStr)) {...}
					//   if (!!/\w+/g.test (sourceStr)) {...}
					//   2*/\w+/g.test (sourceStr)
					//   2-/\w+/g.test (sourceStr)
					//   1+/\w+/g.test (sourceStr)
					//   1|/\w+/g.test (sourceStr)
					//   bool||/\w+/g.test (sourceStr)
					//   1&/\w+/g.test (sourceStr)
					//   bool&&/\w+/g.test (sourceStr)
					//   10%/\w+/g.test (sourceStr)
					//   1>/\w+/g.test (sourceStr)
					//   1>>/\w+/g.test (sourceStr)
					//   1</\w+/g.test (sourceStr)
					//   1<</\w+/g.test (sourceStr)
					//   variable=/\w+/g.test (sourceStr)
					//   bool==/\w+/g.test (sourceStr)
					//   bool?/\w+/g.test (sourceStr):{}
					//   1^/\w+/g.test (sourceStr):{}
					/* TODO:
						There might be a better way of handling this. Perhaps one builds up an operator as large as one can make it without it becoming not a valid operator, at which point one terminates the token. This approach would involve maintaining a list of valid operators, rather than a list of valid operator characters and an exception mechanism for detecting invalid operators.
					*/
			;

		/*** Private Static Properties ***/
			var _settings = {};

		/*** Public Static Methods ***/
			_package.scrunch = function (_sourceCode,_scruncherSettings) {
				var
					/*** report variables ***/
						_uniqueIdentifiersScrunched = 0,
						_incidencesOfIdentifiersScrunched = 0,
						_savingsFromScrunchedIdentifiers = 0,
						_savingsFromRemovedWhitespace = 0,
						_savingsFromRemovedComments = 0,
						_savingsFromRemovedLinebreaks = 0,
						_totalCommentsRemoved = 0,

					_mappings,
					_endOfHeadComment = _false,
					_lineNo = 1,
					_scrunchedCode = '',
					_scrunchedCodeHeader = '',
					_comments = [],
					_stringsMap = {},
					_leaveNextComment = _false,
					_commentType,
					_quoteChar,
					_currentChar = '',
					_previousChar,
					_inEscape = _false,
					_tokenType = _NONE,
					_previousAddedToken = '',
					_previousAddedTokenType = _NONE,
					_currentToken = '',
					_tokenTerminated = _false,
					_currentBlock = '',
					_currentLine = '',
					_Uize_String_startsWith = Uize.String.startsWith
				;
				/*** initialize settings ***/
					/* IDEA:
						make this switchable, so that it doesn't always have to be performed for each scrunch (and so that groups of files can be scrunched in the same namespace?)
					*/
					_settings.LINECOMPACTING = 'TRUE';
					_settings.MAXLINELENGTH = 1024;
					_settings.MAPPINGS = '';
					_settings.KEEPHEADCOMMENT = 'TRUE';
					_settings.AUDITSTRINGS = 'FALSE';

				function _Mapping (_sourcePrefix,_targetPrefix) {
					/*** Constructor Properties ***/
						this._sourcePrefix = _sourcePrefix;
						this._targetPrefix = _targetPrefix || _sourcePrefix;

					/*** Private Instance Properties ***/
						this._scrunchMap = [];
						this._totalIdentifiers = 0;
				}

				function _parseScruncherSettings (_scruncherSettings) {
					function _stringToBoolean (_value) {
						_value = (_value + '').toUpperCase ();
						return _value == 'TRUE' || _value == 'ON' || _value == '1';
					}

					Uize.copyInto (
						_settings,
						typeof _scruncherSettings == 'string'
							? Uize.Xml.fromAttributes (_scruncherSettings,{nameCase:'upper'})
							: _scruncherSettings
					);

					/*** update/resolve settings ***/
						_settings.LINECOMPACTING = _stringToBoolean (_settings.LINECOMPACTING);
						_settings.KEEPHEADCOMMENT = _stringToBoolean (_settings.KEEPHEADCOMMENT);
						_settings.AUDITSTRINGS = _stringToBoolean (_settings.AUDITSTRINGS);

						/*** parse mappings to create mapping objects ***/
							_mappings = [];
							var _mappingPairs = _settings.MAPPINGS.split (',');
							for (var _pairNo = -1; ++_pairNo < _mappingPairs.length;) {
								var _sourcePrefixAndTargetPrefix = Uize.String.splitInTwo (_mappingPairs [_pairNo],'=');
								_mappings [_pairNo] = new _Mapping (
									_sourcePrefixAndTargetPrefix [0],
									_sourcePrefixAndTargetPrefix [1]
								);
							}
				}
				_parseScruncherSettings (_scruncherSettings);

				for (
					var
						_charNo = -1,
						_sourceCodeLength = _sourceCode.length,
						_sourceCodeLengthMinus1 = _sourceCodeLength - 1
					;
					++_charNo <= _sourceCodeLength;
				) {
					_previousChar = _currentChar;
					if (_charNo > _sourceCodeLengthMinus1) {
						_currentChar = '';
						_tokenTerminated = _true;
					} else {
						_currentChar = _sourceCode.charAt (_charNo);
						(_currentChar == '\r' || (_currentChar == '\n' && _previousChar != '\r')) &&
							_lineNo++
						;
						if (_tokenType == _WORD) {
							if (!_wordCharsLookup [_currentChar]) _tokenTerminated = _true;
						} else if (_tokenType == _NUMBER) {
							if (!_numberCharsLookup [_currentChar]) _tokenTerminated = _true;
						} else if (_tokenType == _DELIMITER) {
							if (!_delimiterCharsLookup [_currentChar]) _tokenTerminated = _true;
						} else if (_tokenType == _STRINGLITERAL) {
							if (_inEscape) {
								_inEscape = _false;
							} else if (_currentChar == '\\') {
								_inEscape = _true;
							} else if (_currentChar == _quoteChar) {
								if (_settings.AUDITSTRINGS && _quoteChar != '/') {
									var
										_string = _currentToken.slice (1),
										_stringProfile = _stringsMap [_string]
									;
									(_stringProfile instanceof Array ? _stringProfile : (_stringsMap [_string] = []))
										.push (_lineNo) // must handle the case of the valueOf and toString natives
									;
								}
								_currentToken += _currentChar;
								_currentChar = '';
								_tokenTerminated = _true;
							}
						} else if (_tokenType == _COMMENT) {
							if (_commentType == '//') {
								if (_currentChar == '\n' || _currentChar == '\r') _tokenTerminated = _true;
							} else if (_commentType == '/*') {
								if (_currentToken.length > 2 && _previousChar + _currentChar == '*/') {
									/* NOTE:
										making sure the length is greater than 2 when evaluating the current character avoids terminating a comment that's a forward slash + star + forward slash, where technically there is a comment opener and a comment closer, but they both share a star
									*/
									_currentToken += _currentChar;
									_tokenTerminated = _true;
									_currentChar = '';
								}
							}
						} else if (_tokenType == _OPERATOR) {
							if (_currentToken == '/' && (_currentChar == '/' || _currentChar == '*')) {
								_tokenType = _COMMENT;
								_commentType = _currentToken + _currentChar;
								/* NOTE:
									Following code is an optimization, to seek ahead to the end of the comment, rather than running through the characters one by one (which slows down scrunching dramatically).
								*/
								var _commentCloserPos;
								if (_currentChar == '*') {
									_commentCloserPos = _sourceCode.indexOf ('*/',_charNo + 1);
									if (_commentCloserPos < 0) _commentCloserPos = _sourceCodeLength;
								} else {
									var
										_nextLineFeed = _sourceCode.indexOf ('\n',_charNo + 1),
										_nextCarriageReturn = _sourceCode.indexOf ('\r',_charNo + 1)
									;
									_commentCloserPos = Math.min (
										_nextLineFeed < 0 ? _sourceCodeLength : _nextLineFeed,
										_nextCarriageReturn < 0 ? _sourceCodeLength : _nextCarriageReturn
									);
								}
								_currentToken = _sourceCode.slice (_charNo - 1,_commentCloserPos - 1);
								_currentChar = _sourceCode.charAt (_charNo = _commentCloserPos - 1);
							} else if (
								_currentToken == '/' &&
								(_previousAddedTokenType != _WORD || _previousAddedToken == 'return') &&
								_previousAddedTokenType != _NUMBER &&
								_previousAddedTokenType != _STRINGLITERAL &&
								!(
									_previousAddedTokenType == _DELIMITER &&
									_closeParenOrSquareBracketMap [_previousAddedToken.slice (-1)]
								)
							) {
								/* regular expression handling
									NOTE: by setting the _currentChar to an empty string and decrementing the _charNo counter, we force re-evualtion of the current character, now that we know we're in a regular expression
								*/
								_tokenType = _STRINGLITERAL;
								_quoteChar = '/';
								_currentChar = '';
								_charNo--;
							} else if (
								!_operatorCharsLookup [_currentChar] ||
								_invalidOperatorRegExp.test (_currentToken + _currentChar)
							) {
								_tokenTerminated = _true;
							}
						} else if (_tokenType == _LINEBREAK) {
							if (_currentChar != '\n' && _currentChar != '\r') _tokenTerminated = _true;
						}
						_endOfHeadComment =
							_endOfHeadComment ||
							(_tokenType && _tokenType != _COMMENT && (_tokenType != _LINEBREAK || _currentToken.length > 1))
						;
					}
					if (_tokenTerminated) {
						if (_tokenType == _WORD) {
							for (var _mappingNo = -1; ++_mappingNo < _mappings.length;) {
								var _mapping = _mappings [_mappingNo];
								if (_Uize_String_startsWith (_currentToken,_mapping._sourcePrefix + '_')) {
									_incidencesOfIdentifiersScrunched++;
									var _scrunchedToken = _mapping._scrunchMap [_currentToken] || '';
									if (!_scrunchedToken) {
										_uniqueIdentifiersScrunched++;
										var _numberToConvert = _mapping._totalIdentifiers++;
										do {
											_scrunchedToken =
												_identifierChars [
													_numberToConvert -
													_totalIdentifierChars * (
														_numberToConvert = Math.floor (_numberToConvert / _totalIdentifierChars)
													)
												] + _scrunchedToken
											;
										} while (_numberToConvert > 0);
										_scrunchedToken =
											_mapping._scrunchMap [_currentToken] = _mapping._targetPrefix + '_' + _scrunchedToken
										;
									}
									_savingsFromScrunchedIdentifiers +=
										_currentToken.length - (_currentToken = _scrunchedToken).length
									;
									break;
								}
							}
						} else if (_tokenType == _COMMENT) {
							_comments.push (_currentToken);
							_savingsFromRemovedComments += _currentToken.length;
							var _isScruncherDirective = _false;
							if (/^\/[\*\/]\s*scruncher/i.test (_currentToken)) {
								if (_currentToken.substr (2,17).toLowerCase () == 'scrunchersettings') {
									_isScruncherDirective = _true;
									_parseScruncherSettings (
										_currentToken.slice (2,_currentToken.length - (_commentType == '/*') * 2)
									);
									_currentToken = '';
								} else if (/^\/[\*\/]\s*scruncher:leave next comment/i.test (_currentToken)) {
									_isScruncherDirective = _leaveNextComment = _true;
									_currentToken = '';
								}
							}
							if (!_isScruncherDirective) {
								if ((_endOfHeadComment || !_settings.KEEPHEADCOMMENT) && !_leaveNextComment) {
									_currentToken = '';
								} else if (_commentType == '/*') {
									if (_leaveNextComment) {
										if (_settings.LINECOMPACTING) _currentToken = '\n' + _currentToken + '\n';
										_leaveNextComment = _false;
									}
									_currentToken += '\n';
								}
							}
							if (!_currentToken) _totalCommentsRemoved++;
							_savingsFromRemovedComments -= _currentToken.length;
						} else if (_tokenType == _LINEBREAK) {
							_savingsFromRemovedLinebreaks += _currentToken.length;
							_currentToken = '';
							if (
								!_settings.LINECOMPACTING ||
								(_currentBlock.length + _currentLine.length > _settings.MAXLINELENGTH)
							) {
								_scrunchedCode += _currentBlock + '\n';
								_savingsFromRemovedLinebreaks--;
								_currentBlock = '';
							}
							_currentBlock += _currentLine;
							_currentLine = '';
						}
						if (
							((_tokenType == _WORD || _tokenType == _OPERATOR) && _previousAddedTokenType == _tokenType) ||
							(
								_tokenType == _NUMBER &&
								_digitsLookup [_currentToken.charAt (0)] &&
								_previousAddedTokenType == _WORD
							)
						) {
							/* NOTE: whitespace is necessary when it separates...
								- two adjacent words (eg. function myFunction)
								- two adjacent operators (eg. myVariable += ++ myOtherVariable)
								- a word followed by a number that starts with a digit, rather than "+", "-", or "." (eg. return 1)
							*/
							_currentToken = ' ' + _currentToken;
							_savingsFromRemovedWhitespace--;
						}
						_tokenTerminated = _false;
						if (_currentToken) {
							_currentLine += _currentToken;
							_previousAddedToken = _currentToken;
							_previousAddedTokenType = _tokenType;
						}
						_currentToken = '';
						_tokenType = _NONE;
					}
					if (!_tokenType && _currentChar) {
						_tokenType = _tokenStarterCharsLookup [_currentChar];
						if (_tokenType == _STRINGLITERAL)
							_quoteChar = _currentChar
						;
					}
					_tokenType
						? (_currentToken += _currentChar)
						: (_savingsFromRemovedWhitespace += _currentChar.length)
					;
				}
				return {
					scrunchedCode:_scrunchedCode += _currentBlock + _currentLine,
					comments:_comments,
					stringsMap:_stringsMap,
					report:
						'Unique Identifiers Scrunched: ' + _uniqueIdentifiersScrunched + '\n' +
						'Incidences of Identifiers Scrunched: ' + _incidencesOfIdentifiersScrunched + '\n' +
						'Savings From Scrunched Identifiers: ' + _savingsFromScrunchedIdentifiers + '\n' +
						'Savings From Removed Whitespace: ' + _savingsFromRemovedWhitespace + '\n' +
						'Total Comments Removed: ' + _totalCommentsRemoved + '\n' +
						'Savings From Removed Comments: ' + _savingsFromRemovedComments + '\n' +
						'Savings From Removed Linebreaks: ' + _savingsFromRemovedLinebreaks + '\n' +
						'Supposed Total Savings: ' + (_savingsFromScrunchedIdentifiers + _savingsFromRemovedWhitespace + _savingsFromRemovedComments + _savingsFromRemovedLinebreaks - _scrunchedCodeHeader.length) + '\n' +
						'Real Total Savings: ' + (_sourceCode.length - _scrunchedCode.length) + '\n\n' +
						'FINAL SIZE: ' + _scrunchedCode.length
				};
				/*?
					Static Methods
						Uize.Build.Scruncher.scrunch
							Scrunches the specified source code string and returns an object, containing a string property for the scrunched form of the code, a string property with a report summarizing the savings from scrunching the code, and an array property containing all the comments from the source.

							SYNTAX
							..................................................................
							scruncherResultOBJ = Uize.Build.Scruncher.scrunch (sourceCodeSTR);
							..................................................................

							The returned object has the following composition...

							..........................................................................
							{
								scrunchedCode:scrunchedCodeSTR, // the scrunched form of the code
								report:reportSTR,               // a multi-line summary of size savings
								comments:commentsARRAY          // an array of strings
							}
							..........................................................................

							The multi-line report contained in the =report= string property summarizes the file size savings from removed whitespace, removed comments, removed linebreaks, and scrunched identifiers. The comments array specified by the =comments= property can be used in the generation of comment-based documentation, as is done by the =Uize.Doc.Sucker= package.

							VARIATION
							.......................................................................................
							scruncherResultOBJ = Uize.Build.Scruncher.scrunch (sourceCodeSTR,scruncherSettingsSTR);
							.......................................................................................

							When the optional =scruncherSettingsSTR= parameter is specified, the specified Scruncher settings string will be parsed and applied to the scrunching process. This is done after the Scruncher settings have been initialized and before any of the specified source file has been parsed, so before any Scruncher settings inside the source code are encountered. Therefore, Scruncher settings inside the code being scrunched will take precedence and will override any Scruncher settings specified in the =scruncherSettingsSTR= parameter.

							The value of the =scruncherSettingsSTR= parameter should have the following syntax...

							.................................................................
							[setting0Name]="[setting0Value]" [settingNName]="[settingNValue]"
							.................................................................

							This parameter is useful for providing initial values for Scruncher settings that may not be specified inside a file (or files) being scrunched, and is particularly useful when using the Scruncher in build scripts.

							EXAMPLE
							..........................................................................................
							var scruncherResult = Uize.Build.Scruncher.scrunch (sourceCode,'KeepHeadComment="FALSE"');
							..........................................................................................

							In the above example, the =scruncherSettingsSTR= parameter is being used to direct the Scruncher to omit the source code's head comment when scrunching it.
				*/
			};

		return _package;
	}
});
