/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.AutoSuggest Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
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
		'Uize.Str.Trim',
		'Uize.Widget.Options.Selector'
	],
	builder: function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_null = null,
				_undefined,
				_Uize = Uize,
				_Uize_Data = _Uize.Data,
				_Uize_Node = _Uize.Node,
				_Uize_Node_Event = _Uize_Node.Event,
				_trim = Uize.Str.Trim.trim,
				_supportsPlaceholder = typeof document != 'undefined'
					&& 'placeholder' in document.createElement('input'),

			/*** General Variables ***/
				_highlightModes = { none: 1, query: 1, remaining: 1 }
		;

		/*** Private Helper Functions ***/
			// Returns a conformer which constrains values to be atleast the given minimum
			function _constrainAtLeast(_min) {
				return function (_value) { return Uize.constrain(_value, _min, Infinity) };
			}

			// Returns x (mod y) in modular arithmetic
			function _mod(_x, _y) { return ((_x % _y) + _y) % _y }

			function _getDisplay (_tokenInfo, _suggestion) {
				var
					_tokens = _tokenInfo.tokens.concat(),
					_index = _tokenInfo.tokenIndex,
					_text
				;

				if (_suggestion) {
					_tokens[_index] = _suggestion;
					_text = _tokens.join('');
				} else
					_text = _tokenInfo.query;

				return {
					text: _text,
					position: _tokens.splice(0, _index + 1).join('').length
				};
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,
					_preFocusQuery = ''
				;

				/*** Private Instance Variables ***/
				m._ignoreNextRequestDelay = _false;
				m._preventRequests = _false;
				m._typedQueryTokenInfo = _null;
				m._tokenInfo = _null;
				m._canUpdateLastTypedQuery = _true;
				m._suggestionHoverHandler = function (_suggestion) {
					var
						_displayInfo = _suggestion ?
							_getDisplay(m._tokenInfo, _suggestion) :
							_getDisplay(m._typedQueryTokenInfo)
					;
					m._preventRequests = _true;
					if (_displayInfo.text === m + '') m.set('value', '');
					m.set('value', _displayInfo.text);
					m._preventRequests = _false;
					m.setCaretPosition(_displayInfo.position);
					m._tokenInfo = _getTokenInfo(m,_displayInfo.text, _displayInfo.position);
				};

				/*** Wire Events on Inherited Widget ***/
				// hide suggestions when the caret is positioned over a different subquery
				function _checkSubqueryChange(_oldTokenInfo, _newTokenInfo) {
					if (m._querySeparators) {
						if (_oldTokenInfo.tokenIndex != _newTokenInfo.tokenIndex) {
							m._typedQueryTokenInfo = _newTokenInfo;
							m.children.suggestions.set({
								tentativeValue: _null,
								tentativeValueNo: -1,
								value: _null,
								values: []
							});
							_updateSuggestionsPalette(m);
						}
					}
				}

				m.wire({
					// Maintain the semantics of the Cancel event from Uize.Widget.FormElement:
					// to restore the pre-focus value of the input
					Cancel: function () {
						m._preventRequests = _true;
						m.set('value', _preFocusQuery);
						m._preventRequests = _false;
					},
					'Changed.focused': function () {
						if (m.get('focused')) {
							_preFocusQuery = m + '';
							m._typedQueryTokenInfo = m._tokenInfo = _getTokenInfo(
								m,
								m.get('tentativeValue'),
								m.getCaretPosition()
							);
							_updateSuggestions(m);
						}
						_updateSuggestionsPalette(m);
					},

					// _preventRequests is set to true whenever we want to distinguish text input by the
					// widget and by the user. When the widget changes the value of the input (eg to show
					// the currently selected/hovered suggestion), we don't want new suggestions to be
					// requested.
					'Changed.tentativeValue': function () {
						if (!m._preventRequests && m.get('focused')) {
							clearTimeout(m._typeSuggestTimeout);
							if (m._ignoreNextRequestDelay) {
								m._ignoreNextRequestDelay = _false;
								_updateSuggestions(m);
							} else
								m._typeSuggestTimeout = setTimeout(
									function () { _updateSuggestions(m) },
									m._typeSuggestDelay
								);
						}
					},

					'Key Up': function (_event) {
						var
							_oldTokenInfo = m._tokenInfo,
							_domEvent = _event.domEvent
						;

						// re-tokenize input, taking care that it is done at-most once per user-action
						if (_Uize_Node_Event.isKeyEscape(_domEvent)) {
							m._typedQueryTokenInfo =
								m._tokenInfo =
								_getTokenInfo(m,_preFocusQuery, -1);
						} else if (
							!(
								m.isWired &&
								m._allowKeypress &&
								m.getNodeStyle('suggestionsPalette', 'display') != 'none' &&
								(
									_Uize_Node_Event.isKeyUpArrow(_domEvent) ||
									_Uize_Node_Event.isKeyDownArrow(_domEvent)
								)
							)
						) {
							m._tokenInfo = _getTokenInfo(
								m,
								m.get('tentativeValue'),
								m.getCaretPosition()
							);
							if (!m._preventRequests && m.get('focused'))
								m._typedQueryTokenInfo = m._tokenInfo;
						}

						// hide suggestions when caret moves into different subquery
						_oldTokenInfo && _checkSubqueryChange(_oldTokenInfo, m._tokenInfo);

						// handle keystroke control semantics
						_handleKeyboardControl(m,_event.domEvent);
					},

					// hide suggestions when caret moves into different subquery
					// Click event fires when the textbox is clicked on
					Click: function () {
						var _oldTokenInfo = m._tokenInfo;
						m._tokenInfo = _getTokenInfo(
							m,
							m.get('tentativeValue'),
							m.getCaretPosition()
						);

						_oldTokenInfo && _checkSubqueryChange(_oldTokenInfo, m._tokenInfo);
					},

					Ok: function () { m.set('focused', _false) }
				});
			},

			instanceMethods:{
				// prevents the Ok event from being fired on Enter when a suggestion is hovered
				// overrides Uize.Widget.FormElement.Text
				fireOkOnEnter:function () {
					var _suggestions = this.children.suggestions;
					return !(_suggestions && _suggestions.get('tentativeValue'));
				},

				updateUi:function () {
					var m = this;

					if (m.isWired) {
						_updateSuggestionsPalette(m);

						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var
						m = this,
						_docBody = document.body,
						_suggestionsPaletteNode = m.getNode('suggestionsPalette')
					;

					if (!m.isWired) {
						m.wireNode(
							'input',
							{
								// handle pasting (does not work in Opera)
								// onpaste fires before Changed.tentativeValue
								paste: function () { m._ignoreNextRequestDelay = _true },

								// prevent:
								// - cursor movement on input via up/down arrow
								// - form submission when a suggestion is selected with the Enter key
								// - changing form elements on Tab when a suggestion is available
								keydown: function (_domEvent) {
									var _suggestions = m.children.suggestions;
									m._allowKeypress &&
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
							m.setNodeStyle(
								_suggestionsPaletteNode,
								{
									display: 'none',
									position: 'absolute',
									zIndex: 10000,
									left: '',
									top: '',
									right: '',
									bottom: ''
								}
							);
						}

						// disable browser autocomplete
						m.setNodeProperties('input', { autocomplete: 'off' });

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_additionalAutoSuggestParams:{
					name: 'additionalAutoSuggestParams',
					value: {}
				},
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
				_autoPositionSuggestionsPalette: {
					name: 'autoPositionSuggestionsPalette',
					value: true
					/*?
						State Properties
							autoPositionSuggestionsPalette
								Set this to false to use the default CSS positioning for the suggestions palette.
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
				_cssClassSelected:{
					name:'cssClassSelected',
					value:'selectedSuggestion'
					/*?
						State Properties
							cssClassSelected
								A string, indicating the CSS class used for the (tentatively) selected suggestion

								NOTES
								- the initial value is ='selectedSuggestion'=
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
				_lastTypedQuery:{
					name:'lastTypedQuery'
					/*?
						State Properties
							lastTypedQuery
								A read only string, specifies the last query used for auto suggest

								NOTES
								- the initial value is =undefined=
								- Read Only
					*/
				},
				_numCharsBeforeSuggest: {
					name: 'numCharsBeforeSuggest',
					conformer: _constrainAtLeast(0),
					value: 1
					/*?
						State Properties
							numCharsBeforeSuggest
								An integer, specifying the minimum number of characters input before suggestions are requested.

								The primary use of such a minimum is to increase the relevance of the returned suggestions.

								NOTES
								- the value must be at least 0
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
						};
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
									prefix: '',
									suffix: _term.substr(_normalizedQuery.length),
									fullWord: _term

								};
							}
						);
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
			}
		});
	}
});
