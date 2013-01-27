/*______________
|	   ______  |   U I Z E	J A V A S C R I P T	F R A M E W O R K
|	 /	  /  |   ---------------------------------------------------
|	/	O /   |	MODULE : Uize.Widget.AutoSuggest Class
|   /	/ /	|
|  /	/ /  /| |	ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|		  /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|			 http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.AutoSuggest= widget manages requesting and display a set of selectable suggestions based on user input into a textbox and supports fine-grained specification of how suggestions are displayed.

		Queries are normalized before requesting suggestions: whitespaces are trimmed.

		When =querySeparators= are specified, text between separators are treated as independent queries.

		The simplest way to specify how suggestions are shown are to set the =highlightMode= and the =cssClass*= state properties.

		For more advanced customization, the =optionDataAdapter=, =optionsWidgetClass=, and =optionsWidgetProperties= state properties allow for fine-grained control over the widgets managing the suggestions.

		*DEVELOPERS:* `Vinson Chuong`

		Issues and Notes
		- Ignoring typeRequestDelay when pasting relies on the onpaste event, which is not supported in Opera.
		- We use min-width to keep the width of the suggestions palette at least the width of the textbox, which doesn't work in IE6.
		- If a suggestion is too long, it overflows the textbox (the last letters and the caret are not shown).
		- Positioning of the palette may be off by varying amounts in different browsers.
*/

Uize.module({
	name: 'Uize.Widget.AutoSuggest',
	superclass: 'Uize.Widget.FormElement.Text',
	required: [
		'Uize.Data.NameValueRecords',
		'Uize.Node',
		'Uize.Node.Event',
		'Uize.String',
		'Uize.Widget.Options.Selector'
	],
	builder: function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_emptyString = '',
				_null = null,
				_undefined,
				_Uize = Uize,
				_Uize_Data = _Uize.Data,
				_Uize_Node = _Uize.Node,
				_Uize_Node_Event = _Uize_Node.Event,
				_Uize_String = Uize.String
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass(
					_null,
					function () {
						var
							_this = this,
							_preFocusQuery = _emptyString
						;

						/*** Private Instance Variables ***/
						_this._ignoreNextRequestDelay = _false;
						_this._preventRequests = _false;
						_this._typedQueryTokenInfo = _null;
						_this._tokenInfo = _null;
						_this._suggestionHoverHandler = function (_suggestion) {
							var
								_displayInfo = _suggestion ?
									_this._getDisplay(_this._tokenInfo, _suggestion) :
									_this._getDisplay(_this._typedQueryTokenInfo)
							;
							_this._preventRequests = _true;
							if (_displayInfo.text === _this + _emptyString) _this.set('value', _emptyString);
							_this.set('value', _displayInfo.text);
							_this._preventRequests = _false;
							_this.setCaretPosition(_displayInfo.position);
							_this._tokenInfo = _this._getTokenInfo(_displayInfo.text, _displayInfo.position);
						};

						/*** Wire Events on Inherited Widget ***/
						// hide suggestions when the caret is positioned over a different subquery
						function _checkSubqueryChange(_oldTokenInfo, _newTokenInfo) {
							if (_this._querySeparators) {
								if (_oldTokenInfo.tokenIndex != _newTokenInfo.tokenIndex) {
									_this._typedQueryTokenInfo = _newTokenInfo;
									_this.children.suggestions.set({
										tentativeValue: _null,
										tentativeValueNo: -1,
										value: _null,
										values: []
									});
									_this._updateSuggestionsPalette();
								}
							}
						}

						_this.wire({
							// Maintain the semantics of the Cancel event from Uize.Widget.FormElement:
							// to restore the pre-focus value of the input
							Cancel: function () {
								_this._preventRequests = _true;
								_this.set('value', _preFocusQuery);
								_this._preventRequests = _false;
							},
							'Changed.focused': function () {
								var _suggestions = _this.children.suggestions;
								if (_this.get('focused'))
									_preFocusQuery = _this + _emptyString;
								_this._updateSuggestionsPalette();
							},

							// _preventRequests is set to true whenever we want to distinguish text input by the
							// widget and by the user. When the widget changes the value of the input (eg to show
							// the currently selected/hovered suggestion), we don't want new suggestions to be
							// requested.
							'Changed.tentativeValue': function (_event) {
								if (!_this._preventRequests && _this.get('focused')) {
									clearTimeout(_this._typeSuggestTimeout);
									if (_this._ignoreNextRequestDelay) {
										_this._ignoreNextRequestDelay = _false;
										_this._updateSuggestions();
									} else
										_this._typeSuggestTimeout = setTimeout(
											function () { _this._updateSuggestions() },
											_this._typeSuggestDelay
										);
								}
							},

							'Key Up': function (_event) {
								var
									_oldTokenInfo = _this._tokenInfo,
									_domEvent = _event.domEvent
								;

								// re-tokenize input, taking care that it is done at-most once per user-action
								if (_Uize_Node_Event.isKeyEscape(_domEvent)) {
									_this._typedQueryTokenInfo =
										_this._tokenInfo =
										_this._getTokenInfo(_preFocusQuery, -1);
								} else if (
									!(
										_this.isWired &&
										_this._allowKeypress &&
										_this.getNodeStyle('suggestionsPalette', 'display') != 'none' &&
										(
											_Uize_Node_Event.isKeyUpArrow(_domEvent) ||
											_Uize_Node_Event.isKeyDownArrow(_domEvent)
										)
									)
								) {
									_this._tokenInfo = _this._getTokenInfo(
										_this.get('tentativeValue'),
										_this.getCaretPosition()
									);
									if (!_this._preventRequests && _this.get('focused'))
										_this._typedQueryTokenInfo = _this._tokenInfo;
								}

								// hide suggestions when caret moves into different subquery
								_oldTokenInfo && _checkSubqueryChange(_oldTokenInfo, _this._tokenInfo);

								// handle keystroke control semantics
								_this._handleKeyboardControl(_event.domEvent);
							},

							// hide suggestions when caret moves into different subquery
							// Click event fires when the textbox is clicked on
							Click: function () {
								var _oldTokenInfo = _this._tokenInfo;
								_this._tokenInfo = _this._getTokenInfo(
									_this.get('tentativeValue'),
									_this.getCaretPosition()
								);

								_oldTokenInfo && _checkSubqueryChange(_oldTokenInfo, _this._tokenInfo);
							},

							Ok: function () { _this.set('focused', _false) }
						});
					}
				),
				_classPrototype = _class.prototype;
		;
		/*** General Variables ***/
			var _highlightModes = { none: 1, query: 1, remaining: 1 };

		/*** Private Helper Functions ***/
			// Returns a conformer which constrains values to be atleast the given minimum
			function _constrainAtLeast(_min) {
				return function (_value) { return Uize.constrain(_value, _min, Infinity) }
			}

			// Returns x (mod y) in modular arithmetic
			function _mod(_x, _y) { return ((_x % _y) + _y) % _y }

		/*** Private Instance Methods ***/
			// Allows for delayed wiring of suggestions widget incase suggestions are never requested
			_classPrototype._addAndWireSuggestions = function () {
				var
					_this = this,
					_suggestions = _this.addChild(
						'suggestions',
						_this._optionsWidgetClass || Uize.Widget.Options.Selector,
						Uize.copyInto(
							{
								built: _false,
								html: _true,
								optionWidgetProperties: {
									cssClassActive: 'selectedSuggestion',
									cssClassSelected: 'selectedSuggestion',
									cssClassTentativeSelected: 'selectedSuggestion'
								},
								values: []
							},
							_this._optionsWidgetProperties
						)
					)
				;

				_suggestions.wire({
					// When a suggestion is highlighted (eg hovered over), it is shown in the textbox.
					// When no suggestions are highlighted, the original query will be shown.
					'Changed.tentativeValue': function () {
						_this._showOnHover && _this._suggestionHoverHandler(_suggestions.get('tentativeValue'))
					},

					// When a suggestion is clicked, the value of this widget is set to the suggestion
					// and we submit.
					'Option Event': function (_event) {
						if (_event.childEvent.name === 'Click') {
							_this._showOnHover || _this._suggestionHoverHandler(_suggestions.get('tentativeValue'));
							_this.set('focused', _true);
							_this._fireSuggestionSelected(_event.childEvent.source);
						}
					}
				});

				_suggestions.wireUi();

				return _suggestions;
			};

			_classPrototype._fireSuggestionSelected = function (_option) {
				var _this = this;

				_this.fire({
					name: 'Suggestion Selected',
					option: _option
				});
				/*?
				Instance Events
				Suggestion Selected
				This event fires when a suggestion is selected (click or enter).

				When this event fires, the event object will have an =option= property whose value is the option widget representing the suggestion.
				*/
				_this._typedQueryTokenInfo = _this._tokenInfo;
				_this.children.suggestions.set({
					tentativeValue: _null,
					tentativeValueNo: -1,
					value: _null,
					values: []
				});
				_this._updateSuggestionsPalette();
			};

			_classPrototype._getDisplay = function (_tokenInfo, _suggestion) {
				var
					_tokens = _tokenInfo.tokens.concat(),
					_index = _tokenInfo.tokenIndex,
					_text
				;

				if (_suggestion) {
					_tokens[_index] = _suggestion;
					_text = _tokens.join(_emptyString);
				} else
					_text = _tokenInfo.query;

				return {
					text: _text,
					position: _tokens.splice(0, _index + 1).join(_emptyString).length
				};
			};

			_classPrototype._getNormalizedQuery = function (_tokenInfo) {
				return _tokenInfo ?
					_Uize_String.trim(_tokenInfo.tokens.concat()[_tokenInfo.tokenIndex]).replace(/\s+/g, ' ') :
					_emptyString
			};

			_classPrototype._getTokenInfo = function (_input, _position) {
				var
					_separators = this._querySeparators,
					_quotes = this._queryQuotes,
					_inputLength = _input.length,
					_queryIndex = _position,
					_tokens = [],
					_index = -1,
					_curToken = _emptyString,
					_curChar = _emptyString,
					_inQuotes = _false,
					_curQuotes = _emptyString,
					_tokenIndex = 0
				;

				if (_separators) {
					_separators = Uize.lookup(Uize.isArray(_separators) ? _separators : [_separators]);
					_quotes =
						_quotes ?
							_Uize_Data.NameValueRecords.toHash(
								_Uize.isArray(_quotes) ?
									typeof _quotes[0] === 'object' ?
										_quotes :
										_Uize.map(_quotes, function (_quote) { return { open: _quote, close: _quote} }) :
									typeof _quotes === 'object' ?
										[_quotes] :
										[{ open: _quotes, close: _quotes}],
								'open',
								'close'
							) :
							{}
					;

					while (++_index < _inputLength) {
						_curChar = _input[_index];
						if (!_inQuotes && (_curQuotes = _quotes[_curChar])) {
							_inQuotes = true;
							_curToken += _curChar;
						} else if (_inQuotes && _curChar === _curQuotes) {
							_inQuotes = false;
							_curToken += _curChar;
						} else if (!_inQuotes && _separators[_curChar]) {
							_tokens.push(_curToken);
							_tokens.push(_curChar);
							_curToken = _emptyString;
						} else {
							_curToken += _curChar;
						}
					}
					if (_curToken || !_tokens.length) _tokens.push(_curToken);
				} else
					_tokens.push(_input);

				if (_position == -1)
					_tokenIndex = -1;
				else
					while (_tokenIndex < _tokens.length - 1 && (_position -= _tokens[_tokenIndex].length) > 0) _tokenIndex++;

				return {
					query: _input,
					queryIndex: _queryIndex,
					tokens: _tokens,
					tokenIndex: _tokenIndex
				};
			};

			_classPrototype._handleKeyboardControl = function (_domEvent) {
				var
					_this = this,
					_separator = _this._querySeparators,
					_suggestions = _this.children.suggestions
				;

				if (_this.isWired) {
					if (
						_this._allowKeypress &&
						_suggestions &&
						_this.getNodeStyle('suggestionsPalette', 'display') != 'none'
					) {
						// "hover" over suggestions via up/down arrows
						if (_Uize_Node_Event.isKeyUpArrow(_domEvent) || _Uize_Node_Event.isKeyDownArrow(_domEvent)) {
							var
								_curNumSuggestions = _suggestions.get('values').length,
								_increment =
									_Uize_Node_Event.isKeyUpArrow(_domEvent) ? -1 :
									_Uize_Node_Event.isKeyDownArrow(_domEvent) ? 1 :
									0,
								_curValueNo = _suggestions.get('tentativeValueNo'),
								_curSuggestion = _suggestions.children['option' + _curValueNo],
								_nextSuggestion = _suggestions.children[
									'option' +
									(_mod(_curValueNo + 1 + _increment, _curNumSuggestions + 1) - 1)
								]
							;
							if (_increment && _curSuggestion) {
								_curSuggestion.set('state', _emptyString);
								_curSuggestion.fire('Out');
							}
							if (_increment && _nextSuggestion) {
								_nextSuggestion.set('state', 'over');
								_nextSuggestion.fire('Over');
							}
							_this._showOnMouseover ||
									_this._suggestionHoverHandler(_suggestions.get('tentativeValue'));
							// select a "hovered over" suggestion using enter or tab
						} else if (
							_suggestions.get('tentativeValue') &&
							(
								_Uize_Node_Event.isKeyEnter(_domEvent) ||
								_Uize_Node_Event.isKeyTab(_domEvent)
							)
						) {
							_this._fireSuggestionSelected(_suggestions.children['option' + _suggestions.get('tentativeValueNo')]);
							// select first suggestion on tab
						} else if (_Uize_Node_Event.isKeyTab(_domEvent)) {
							var _firstSuggestion = _suggestions.children['option0'];
							_firstSuggestion.set('state', 'over');
							_firstSuggestion.fire('Over');
							_this._fireSuggestionSelected(_firstSuggestion);
						}
					}
				}
			};

			_classPrototype._updateSuggestions = function () {
				function _highlight(_text) { return '<span class="' + _this._cssClassHighlight + '">' + _text + '</span>' }

				var
					_this = this,
					_children = _this.children,
					_normalizedQuery = _this._getNormalizedQuery(_this._typedQueryTokenInfo);
				;

				if (
					_normalizedQuery != _this.get('defaultValue') &&
					_normalizedQuery.length >= _this._numCharsBeforeSuggest &&
					_this._numSuggestions
				) {
					_this.ajax(
						Uize.pairUp(
							'serviceUrl', _this._serviceUrl,
							_this._serviceQueryParamName, _normalizedQuery,
							_this._serviceNumSuggestionsParamName, _this._numSuggestions
						),
						//{
							//cache: 'memory',
							//callbackSuccess: function (_response) {
							function (_response) {
								var _suggestions = _children.suggestions;
								(_suggestions || _this._addAndWireSuggestions()).set({
									tentativeValue: _null,
									tentativeValueNo: -1,
									values: _Uize.map(
										_this._responseAdapter(_normalizedQuery, _response),
										function (_suggestion) {
											var
												_term = _suggestion.fullWord,
												_highlightMode = _this._highlightMode,
												_formattedTerm =
													_highlightMode === 'none' ? _term :
													_highlightMode === 'query' ? _suggestion.prefix + _highlight(_normalizedQuery) + _suggestion.suffix :
													_suggestion.fullWord.indexOf(_normalizedQuery) === 0 ? _highlight(_suggestion.prefix) + _normalizedQuery + _highlight(_suggestion.suffix):
													_highlight(_suggestion.fullWord)
														/* NOTE:
															Hightlight the whole word if the word doesn't start with the normalizedQuery. This is the case when the normalized query is spelled wrong and the suggestion comes from the spell checker
														*/
											;
											return _this._optionDataAdapter(_term, _formattedTerm);
										}
									)
								});
								_this._updateSuggestionsPalette();
							// }
						}
					);
				} else if (_children.suggestions) {
					_children.suggestions.set({
						tentativeValue: _null,
						tentativeValueNo: -1,
						values: []
					});
					_this._updateSuggestionsPalette();
				}
			};

			_classPrototype._updateSuggestionsPalette = function () {
				var _this = this;

				if (_this.isWired) {
					var
						_inputNode = _this.getNode('input'),
						_suggestionsPaletteNode = _this.getNode('suggestionsPalette'),
						_focused = _this.get('focused'),
						_hasSuggestions = _this.children.suggestions && _this.children.suggestions.get('values').length
					;
					if (_focused && _hasSuggestions) {
						// The palette must have display:true to be positioned
						_this.showNode(_suggestionsPaletteNode, _false);
						_this.displayNode(_suggestionsPaletteNode);
						_Uize_Node.setAbsPosAdjacentTo(_suggestionsPaletteNode, _inputNode, 'y');
						// We want the palette to be at least as wide as the input and as wide as needed to display every
						// suggestion.
						_this.setNodeStyle(
							_suggestionsPaletteNode,
							{ minWidth: _Uize_Node.getDimensions(_inputNode).width }
						);
						_this.showNode(_suggestionsPaletteNode);
					} else if (_this.getNodeStyle('suggestionsPalette', 'display') != 'none') {
						// When the input loses focus, the following line is executed. When a suggestion is clicked,
						// the input loses focus. The blur event will fire before the Click event. We must wait until
						// the Click event is fired before setting display:none on the palette.
						setTimeout(
							function () {
								var _suggestions = _this.children.suggestions;
								_this.displayNode(_suggestionsPaletteNode, _false);
								_suggestions && _suggestions.set({
									tentativeValue: _null,
									tentativeValueNo: -1,
									value: _null,
									values: []
								});
							},
							200
						);
					}
				}
			};

		/*** Public Instance Methods ***/
			// prevents the Ok event from being fired on Enter when a suggestion is hovered
			// overrides Uize.Widget.FormElement.Text
			_classPrototype.fireOkOnEnter = function () {
				var _suggestions = this.children.suggestions;
				return !(_suggestions && _suggestions.get('tentativeValue'));
			};

			_classPrototype.updateUi = function () {
				var _this = this;

				if (_this.isWired) {
					_this._updateSuggestionsPalette();

					_superclass.prototype.updateUi.call(_this);
				}
			};

			_classPrototype.wireUi = function () {
				var
					_this = this,
					_docBody = document.body,
					_suggestionsPaletteNode = _this.getNode('suggestionsPalette')
				;

				if (!_this.isWired) {
					_this.wireNode(
						'input',
						{
							// handle pasting (does not work in Opera)
							// onpaste fires before Changed.tentativeValue
							paste: function () { _this._ignoreNextRequestDelay = _true },

							// prevent:
							// - cursor movement on input via up/down arrow
							// - form submission when a suggestion is selected with the Enter key
							// - changing form elements on Tab when a suggestion is available
							keydown: function (_domEvent) {
								var _suggestions = _this.children.suggestions;
								_this._allowKeypress &&
									(
										_Uize_Node_Event.isKeyUpArrow(_domEvent) ||
										_Uize_Node_Event.isKeyDownArrow(_domEvent) ||
										(
											_Uize_Node_Event.isKeyTab(_domEvent) &&
											_suggestions &&
											_suggestions.get('values').length
										) ||
										(
											_Uize_Node_Event.isKeyEnter(_domEvent) &&
											_suggestions &&
											_suggestions.get('tentativeValue')
										)
									) &&
									_Uize_Node_Event.preventDefault(_domEvent)
								;
							}
						}
					);

					// move suggestions palette to root
					if (_suggestionsPaletteNode && _suggestionsPaletteNode.parentNode != _docBody) {
						_docBody.insertBefore(_suggestionsPaletteNode, _docBody.childNodes[0]);
						_this.setNodeStyle(
							_suggestionsPaletteNode,
							{
								display: 'none',
								position: 'absolute',
								zIndex: 10000,
								left: _emptyString,
								top: _emptyString,
								right: _emptyString,
								bottom: _emptyString
							}
						);
					}

					// disable browser autocomplete
					_this.setNodeProperties('input', { autocomplete: "off" });

					_superclass.prototype.wireUi.call(_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties({
				_allowKeypress: {
					name: 'allowKeypress',
					value: _true
					/*?
						State Properties
							allowKeypress
								A boolean, specifying whether suggestions can be selected via keyboard control.

								NOTES
								- the initial value is =true=
					*/
				},
				_cssClassHighlight: {
					name: 'cssClassHighlight',
					value: 'suggestionHighlight'
					/*?
						State Properties
							cssClassHighlight
								A string, indicating the CSS class used for highlighting (see the =highlightMode= property) specified portions of the suggestions.

								NOTES
								- the initial value is ='suggestionHighlight'=
					*/
				},
				_highlightMode: {
					name: 'highlightMode',
					conformer: function (_value) { return _highlightModes[_value] ? _value : 'query' },
					value: 'query'
					/*?
						State Properties
							highlightMode
								A string, specifying the portion of each suggestion that is highlighted (wrapped in a span with class =cssClassHighlight=).

								NOTES
								- the value must be one of ='none'=, ='query'=, or ='remaining'=
								- the initial value is ='query'=
					*/
				},
				_numCharsBeforeSuggest: {
					name: 'numCharsBeforeSuggest',
					conformer: _constrainAtLeast(1),
					value: 1
					/*?
						State Properties
							numCharsBeforeSuggest
								An integer, specifying the minimum number of characters input before suggestions are requested.

								The primary use of such a minimum is to increase the relevance of the returned suggestions.

								NOTES
								- the value must be at least 1
								- the initial value is =1=
					*/
				},
				_numSuggestions: {
					name: 'numSuggestions',
					conformer: _constrainAtLeast(0),
					value: 10
					/*?
						State Properties
							numSuggestions
								An integer, specifying the maxinum number of suggestions requested and displayed.

								NOTES
								- the value must be at least =0=
								- setting the value to =0= completely disables suggestions
								- the initial value is =10=
					*/
				},
				_optionDataAdapter: {
					name: 'optionDataAdapter',
					value: function (_term, _formattedTerm) {
						return {
							name: _term,
							valueDetails: {
								name: _term,
								displayName: _formattedTerm
							}
						}
					}
					/*?
						State Properties
							optionDataAdapter
								A function which maps a suggestion and its formatted form to a form accepted by the ==values== property of the ==optionsWidgetClass==.

								NOTES
								- the initial value is a function which maps the suggestion and formatted suggestion into a form accepted by =Uize.Widget.Options.Selector=.
					*/
				},
				_optionsWidgetClass: 'optionsWidgetClass',
				/*?
					State Properties
						optionsWidgetClass
							An object reference to a widget class which is used for the suggestions.

							By default, when no class is specified, =Uize.Widget.Options.Selector= is used.

							NOTES
							- the initial value is =undefined=
				*/
				_optionsWidgetProperties: 'optionsWidgetProperties',
				/*?
					State Properties
						optionsWidgetProperties
							An object, specifying values for state properties that is used when creating the options widget.

							NOTES
							- see the companion =optionsWidgetClass= state property
							- the initial value is =undefined=
				*/
				_queryQuotes: 'queryQuotes',
				/*?
					State Properties
						queryQuotes
							A string, object, array of strings, or array of objects, used to enclose substrings in which separators are ignored.

							Accepted values include =quoteSTR=, =[quoteSTR1, quoteSTR2, ...]=, ={open:openQuoteSTR, close:closeQuoteSTR}=, and =[{open:openQuoteSTR1, close:closeQuoteSTR1}, {open:openQuoteSTR2, close:closeQuoteSTR2}]=

							A value of =undefined=, =null=, or ==''== disables this feature.

							NOTES
							- the initial value is =undefined=
							- this property is only used when =querySeparators= is defined
				*/
				_querySeparators: 'querySeparators',
				/*?
					State Properties
						querySeparators
							A character (string) or array of characters, used to split and distinguish independent subqueries.

							Accepted valeus include =separatorSTR= and =[separatorSTR1, separatorSTR2, ...]=.

							For example, for an input of ='foo,bar,baz'= with separator =','=, the subqueries would be ='foo'=, ='bar'=, and ='baz'=. An input of ='foo,bar|baz'= with separators =[',', '|']= would yield the same subqueries.

							A value of =undefined=, =null=, or ==''== disables this feature.

							NOTES
							- the initial value is =undefined=
				*/
				_responseAdapter: {
					name: 'responseAdapter',
					value: function (_normalizedQuery, _response) {
						return _Uize.map(
							_response,
							function (_term) {
								return {
									prefix: _emptyString,
									suffix: _term.substr(_normalizedQuery.length),
									fullWord: _term

								}
							}
						)
					}
					/*?
						State Properties
							responseAdapter
								A function which maps the normalized query and the response from the service used to request suggestions to an array of of objects containing a =prefix= and a =suffix=.

								NOTES
								- the initial value is a function which assumes that the service returns an array of suggestion strings (eg =['foo','bar','baz']=)
					*/
				},
				_serviceUrl: 'serviceUrl',
				/*?
				State Properties
					serviceUrl
						A string specifying the URL of the service from which suggestions are requested.

						This property is required to be set.

						NOTES
						- the initial value is =undefined=
				*/
				_serviceQueryParamName: {
					name: 'serviceQueryParamName',
					value: 'q'
					/*?
						State Properties
							serviceQueryParamName
								A string specifying the parameter name used by the service (provided at =serviceUrl=) to denote the query.

								NOTES
								- the initial value is ='q'=
					*/
				},
				_serviceNumSuggestionsParamName: {
					name: 'serviceNumSuggestionsParamName',
					value: 'num'
					/*?
						State Properties
							serviceNumSuggestionsParamName
								A string specifying the parameter name used by the service (provided at =serviceUrl=) to denote the number of suggestions to return.

								NOTES
								- the initial value is ='num'=
								- the number of suggestions to request is specified by =numSuggestions=
					*/
				},
				_showOnMouseover: {
					name: 'showOnMouseover',
					value: _false
					/*?
						State Properties
							showOnMouseover
								A boolean specifying whether on mouseover of a suggestion, the suggestion is shown in the input.

								NOTES
								- the initial value is =false=
								- This feature causes a usability issue. If the user's mouse is over where suggestions would appear, suggestions would be automatically selected and the contents of the input updated, while the user is still typing.
					*/
				},
				_typeSuggestDelay: {
					name: 'typeSuggestDelay',
					conformer: _constrainAtLeast(0),
					value: 10
					/*?
						State Properties
							typeSuggestDelay
								An integer, specifying the amount of time after the user stops typing before suggestions are requested.

								The primary use of such a delay is to increase responsiveness by minimizing the number of wasted requests sent.

								NOTES
								- the value must be at least =0=
								- the initial value is =0=
					*/
				}
			});

		return _class;
	}
});
