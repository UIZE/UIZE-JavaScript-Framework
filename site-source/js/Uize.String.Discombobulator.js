/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.String.Discombobulator Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 0
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.String.Discombobulator= module lets you discombobulate text, with processes like uppercasing, special-charring, bracketing, hyphenating, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module({
	name:'Uize.String.Discombobulator',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_package = function () {}
			;

		/*** General Variables ***/
			var _settings = {
				_upperCasing:{},
				_specialCharring:{
					_letters:{
						'a':[97,64,224,225,226,227,228,229],
						'A':[65,192,193,194,195,196,197],
						'B':[66,223],
						'c':[99,162,169,231],
						'C':[67,169,199],
						'e':[101,232,233,234,235],
						'E':[69,200,201,202,203],
						'F':[70,163],
						'i':[105,161,236,237,238,239],
						'I':[73,124,204,205,206,207],
						'n':[110,241],
						'N':[78,209],
						'o':[111,164,186,242,243,244,245,246,248],
						'O':[79,210,211,212,213,214,216],
						'r':[114,174],
						'R':[82,174],
						'S':[83,36,167],
						'u':[117,181,250,251,252],
						'U':[85,217,218,219,220],
						'y':[121,255],
						'Y':[89,165],
						'.':[46,183],
						':':[44,184],
						'?':[63,191],
						'!':[33,161],
						'1':[49,185],
						'2':[50,178],
						'3':[51,179]
					}
				},
				_wordBracketing:{
					_charOpposites:{
						'(':')',
						')':'(',
						'{':'}',
						'}':'{',
						'[':']',
						']':'[',
						'<':'>',
						'>':'<',
						'/':'\\',
						'\\':'/'
					}
				},
				_intraWordHyphening:{},
				_interWordHyphening:{}
			};

		/*** Public Static Methods ***/
			_package.discombobulate = function (_inputText,_degreeFactor) {
				function _randomCharFromString (_string) {
					return _string.charAt (Math.round (Math.random () * (_string.length - 1)));
				}
				function _repeatChar (_char,_numberChars) {
					return '~~~~~~~~~~~~~~~~~~~~'.substr (0,_numberChars).replace (/~/g,_char);
				}
				function _mustPerformProcess (_process) {
					var _scaledDegree = typeof _degreeFactor == 'number' ? (_process.degree * _degreeFactor) : _process.degree;
					return Math.random () <= _scaledDegree;
				}
				var
					_outputText = '',
					_wordBracketingSetupDone = false
				;
				for (
					var _lineNo = -1, _lines = _inputText.split (/\n|\r|\n\r|\r\n/), _linesLength = _lines.length;
					++_lineNo < _linesLength;
				) {
					var
						_lineOld = _lines [_lineNo],
						_lineNew = ''
					;
					if (_lineOld) {
						var
							_wordSeparatorRegExp = /\s+[_\-=]+\s*|[_\-=]+\s+|[\s,\.;:!\?\*&%\$#]+/g,
							_punctuations = _lineOld.match (_wordSeparatorRegExp)
						;
						for (
							var _wordNo = -1, _words = _lineOld.split (_wordSeparatorRegExp), _wordsLength = _words.length;
							++_wordNo < _wordsLength;
						) {
							var
								_wordOld = _words [_wordNo],
								_wordSeparator = _wordNo > 0 ? _punctuations [_wordNo - 1] : '',
								_wordNew = '',
								_wordChars = []
							;
							for (var _charNo = -1; ++_charNo < _wordOld.length;) {
								var
									_currentChar = _wordOld.charAt (_charNo),
									_charCode = _wordOld.charCodeAt (_charNo)
								;
								/*** process: uppercasing ***/
									if (_mustPerformProcess (_settings._upperCasing))
										_currentChar = _currentChar.toUpperCase ()
									;
								/*** process: special character mangling ***/
									if (
										_mustPerformProcess (_settings._specialCharring) &&
										_settings._specialCharring._letters [_currentChar] !== _undefined
									) {
										var
											_alternativeCodes = _settings._specialCharring._letters [_currentChar],
											_alternativeCodeNo = Math.round (Math.random () * (_alternativeCodes.length - 2)) + 1
										;
										_currentChar = String.fromCharCode (_alternativeCodes [_alternativeCodeNo]);
										//_currentChar = '&#' + _alternativeCodes [_alternativeCodeNo] + ';';
									}

								_wordChars.push (_currentChar);
							}
							/*** process: intra-word hyphening ***/
								/* EXAMPLES:
									t-h-i-s  i-s  i-n-t-r-a  w-o-r-d  h-y-p-h-e-n-i-n-g
									t_h_i_s  i_s  i_n_t_r_a  w_o_r_d  h_y_p_h_e_n_i_n_g
									t~h~i~s  i~s  i~n~t~r~a  w~o~r~d  h~y~p~h~e~n~i~n~g
									t.h.i.s  i.s  i.n.t.r.a  w.o.r.d  h.y.p.h.e.n.i.n.g
									etc.

									- no intra-word hyphening is performed between a non-alphanumeric character and any other character
										eg. J-o-h-n's s-t-u-f-f
								*/
								var _intraWordHyphens = '';
								if (_mustPerformProcess (_settings._intraWordHyphening)) {
									var
										_intraWordHyphen = _randomCharFromString (_settings._intraWordHyphening.chars),
										_numberChars = _settings._intraWordHyphening.minLength + Math.round (Math.random () * (_settings._intraWordHyphening.maxLength - _settings._intraWordHyphening.minLength))
									;
									_intraWordHyphens = _repeatChar (_intraWordHyphen,_numberChars);
								}
								var
									_lastChar = _char = '',
									_wordCharRegExp = /[a-zA-Z0-9]/
								;
								for (var _charNo = -1; ++_charNo < _wordChars.length;) {
									_lastChar = _char;
									_char = _wordChars [_charNo];
									_wordNew += (_wordCharRegExp.test (_lastChar) && _wordCharRegExp.test (_char) ? _intraWordHyphens : '') + _char;
								}
							/*** process: word bracketing ***/
								/* EXAMPLES:
									[this] [is] [word] [bracketing]
									<this> <is> <word> <bracketing>
									(this) (is) (word) (bracketing)
									etc.

									- no bracketing is performed around a word that begins or ends with one of the bracketing characters
										eg. 1] [this] [is] [the] [first] [item]

									- no bracketing is performed around inter-word punctuation, since the punctuation is separated out initially and stitched back in later (ie. punctuation is not regarded as a word)
										eg. [so], [punctuation] [is] [not] [a] [word]!
								*/
								if (_mustPerformProcess (_settings._wordBracketing)) {
									if (!_wordBracketingSetupDone) {
										var
											_bracketChars = _settings._wordBracketing.chars,
											_bracketCharOpposites = _settings._wordBracketing._charOpposites,
											_allBracketChars = ''
										;
										for (var _charNo = -1; ++_charNo < _bracketChars.length;) {
											var _char = _bracketChars [_charNo];
											_allBracketChars += _char + (typeof _bracketCharOpposites [_char] == 'string' ? _bracketCharOpposites [_char] : '');
										}
										_wordBracketingSetupDone = true;
									}
									var
										_openingChar = _randomCharFromString (_settings._wordBracketing.chars),
										_closingChar = typeof _bracketCharOpposites [_openingChar] == 'string' ? _bracketCharOpposites [_openingChar] : _openingChar,
										_wordFirstChar = _wordNew.charAt (0),
										_wordLastChar = _wordNew.substr (-1)
									;
									if (_allBracketChars.indexOf (_wordFirstChar) < 0 && _allBracketChars.indexOf (_wordLastChar) < 0)
										_wordNew = _openingChar + _wordNew + _closingChar
									;
								}
							/*** process: inter-word hyphening ***/
								/* EXAMPLES:
									this --- is --- inter --- word --- hyphening
									this ... is ... inter ... word ... hyphening
									this ___ is ___ inter ___ word ___ hyphening
									etc.

									- inter-word hyphening is not performed when the punctuation separating words is anything other than whitespace
										eg. so, how --- are --- you --- feeling --- today ?
								*/
								if (
									_mustPerformProcess (_settings._interWordHyphening) &&
									/^\s+$/.test (_wordSeparator) && _lineNew && _wordNew
								) {
									var
										_hyphenChar = _randomCharFromString (_settings._interWordHyphening.chars),
										_numberChars = _settings._interWordHyphening.minLength + Math.round (Math.random () * (_settings._interWordHyphening.maxLength - _settings._interWordHyphening.minLength)),
										_hyphens = _repeatChar (_hyphenChar,_numberChars)
									;
									if (_hyphens) _wordSeparator = ' ' + _hyphens + ' ';
								}

							_lineNew += _wordSeparator + _wordNew;
						}
					}
					_outputText += (_lineNo > 0 ? '\n' : '') + _lineNew;
				}
				return _outputText;
			};

			_package.selectPreset = function (_presetName) {
				var _preset = _presets [_presetName];
				for (var _processName in _preset) {
					var _process = _preset [_processName];
					for (var _processParamName in _process)
						_settings [_processName] [_processParamName] = _process [_processParamName]
					;
				}
			};

		/*** Public Static Properties ***/
			var _presets = _package.presets = {
				classic:{
					_upperCasing:{degree:0},
					_specialCharring:{degree:1},
					_wordBracketing:{degree:0},
					_intraWordHyphening:{degree:0},
					_interWordHyphening:{degree:0}
				},
				nutcase:{
					_upperCasing:{degree:.5},
					_specialCharring:{degree:0},
					_wordBracketing:{degree:0},
					_intraWordHyphening:{degree:0},
					_interWordHyphening:{degree:0}
				},
				strokey:{
					_upperCasing:{degree:1},
					_specialCharring:{degree:0},
					_wordBracketing:{
						degree:.5,
						chars:'([<'
					},
					_intraWordHyphening:{
						degree:1,
						chars:'|/\\-_',
						minLength:1,
						maxLength:1
					},
					_interWordHyphening:{
						degree:1,
						chars:' ',
						minLength:1,
						maxLength:1
					}
				},
				bracketicious:{
					_upperCasing:{degree:0},
					_specialCharring:{degree:0},
					_wordBracketing:{
						degree:1,
						chars:'([<>{`":/\\'
					},
					_intraWordHyphening:{degree:0},
					_interWordHyphening:{
						degree:1,
						chars:' ',
						minLength:1,
						maxLength:1
					}
				},
				dotty:{
					_upperCasing:{degree:.5},
					_specialCharring:{degree:0},
					_wordBracketing:{
						degree:1,
						chars:':'
					},
					_intraWordHyphening:{
						degree:1,
						chars:'.',
						minLength:0,
						maxLength:4
					},
					_interWordHyphening:{
						degree:1,
						chars: '.',
						minLength:1,
						maxLength:5
					}
				},
				obfuscated:{
					_upperCasing:{degree:1},
					_specialCharring:{degree:0},
					_wordBracketing:{
						degree:1,
						chars:'abcdefghijklmnopqrstuvwxyz'
					},
					_intraWordHyphening:{
						degree:1,
						chars:'abcdefghijklmnopqrstuvwxyz',
						minLength:1,
						maxLength:1
					},
					_interWordHyphening:{
						degree:1,
						chars:'~#$%^&*:?+-|',
						minLength:1,
						maxLength:1
					}
				},
				extremes:{
					_upperCasing:{degree:.4},
					_specialCharring:{degree:0},
					_wordBracketing:{
						degree:.4,
						chars:'[({<|'
					},
					_intraWordHyphening:{
						degree:.4,
						chars:'-_.:',
						minLength:4,
						maxLength:5
					},
					_interWordHyphening:{
						degree:.4,
						chars:' -_.:',
						minLength:4,
						maxLength:5
					}
				}
			};

		return _package;
	}
});

