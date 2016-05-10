/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TextInput Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 6
*/

/*?
	Introduction
		The =Uize.Widget.TextInput= class provides an interface for entering text, with support for min and max length, validation with warning tips, and more.

		*DEVELOPERS:* `Tim Carter`, `Ben Ilegbodu`, `Chris van Rensburg`, `Irena Pashchenko`
*/

Uize.module ({
	name:'Uize.Widget.TextInput',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Event',
		'Uize.Tooltip'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined
		;

		/*** Private Instance Methods ***/
			function _validate () {
				var
					m = this,
					_validator = m._validator,
					_value = m + '',
					_valueLength = _value.length,
					_isValid =
						_valueLength >= m._minLength && _valueLength <= m._maxLength &&
						(
							_validator == null ||
							(
								_validator instanceof RegExp
									? _validator.test (_value)
									: (Uize.isFunction (_validator) ? _validator (_value) : _value == _validator)
							)
						),
					_forceUiDisplay = !_isValid && m._isValid == _isValid
				;
				m._isValid != _isValid
					? m.set ({_isValid:_isValid})
					: _isValid ? 0 : _displayWarningUi (m)
				;
			}

			function _displayWarningUi (m) {
				if (m.isWired) {
					var _displayError = m._showWarning && !m._isValid;
					// if we're able to give visual indicators, then change the textInput color and pop up the icon/tooltip duo.
					m.setNodeProperties([m._inputNode,'label'],{className:_displayError ? 'error' : 'good'});
					m.setNodeStyle('warningIcon', {display:_displayError ? 'inline' : 'none'});
				}
			}

		return _superclass.subclass ({
			instanceMethods:{
				validate:_validate,

				blur:function () {
					this._inputNode && this._inputNode.blur ()
					/*?
						Instance Methods
							blur
								Blur the =input= DOM node of the instance.

								SYNTAX
								....................
								myTextInput.blur ();
								....................

								NOTES
								- see the companion =focus= instance method
					*/
				},

				focus:function () {
					this._inputNode && this._inputNode.focus ()
					/*?
						Instance Methods
							focus
								Focuses the =input= DOM node of the instance.

								SYNTAX
								.....................
								myTextInput.focus ();
								.....................

								NOTES
								- see the companion =blur= instance method
					*/
				},

				selectWarningMessage:function () { return this._selectWarningMessage() },

				updateUi:function () {
					var
						m = this,
						_inputNode = m._inputNode
					;
					if (m.isWired && _inputNode) {
						_inputNode.disabled = !m.get('enabled');

						if (_inputNode.value != m._value)
							_inputNode.value = m._value
						;
					}

					// there can (not) be only one!
					(m._validateOnExit ^ m._currentNodeEventIsBlur) || _validate.call(m);
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._inputNode = m.getNode ('input');

						if (m._inputNode) {
							m._inputNodeIsInputTag = m._inputNode.tagName == 'INPUT';

							m.wireNode (
								m._inputNode,
								{
									keydown:function (_domEvent) {
										if (
											m._inputNodeIsInputTag &&
											Uize.Dom.Event.isKeyEnter (_domEvent) &&
											m.fire ({name:'Ok',domEvent:_domEvent}).cancelSubmit
										) {
											var _inputNodeForm = m._inputNode.form;
											if (_inputNodeForm) {
												m._storedFormOnsubmit = _inputNodeForm.onsubmit;
												m._blockedFormSubmit = _true;
												_inputNodeForm.onsubmit = Uize.returnFalse;
											}
										}
									},
									keypress:function (_domEvent) {
										m._keyAborted = m.fire ({name:'Key Press',domEvent:_domEvent}).abort &&
											Uize.Dom.Event.abort (_domEvent)
										;
									},
									keyup:function (_domEvent) {
										if (m._keyAborted) {
											m._keyAborted = _false;
										} else {
											if (m._blockedFormSubmit) {
												m._inputNode.form.onsubmit = m._storedFormOnsubmit;
												m._storedFormOnsubmit = m._blockedFormSubmit = _undefined;
											}
											Uize.Dom.Event.isKeyEscape (_domEvent) &&
												m.fire ({name:'Cancel',domEvent:_domEvent})
											;
											m.set ({_value:m._inputNode.value});
											m.updateUi (); // the conformer might result in the value not being the current text
											m._deferUiWarning && m.set ({showWarning:_true});
										}
										m.fire ({name:'Key Up',domEvent:_domEvent});
									},
									blur:function () {
										m._blurClass &&
											m.setNodeProperties(
												m._inputNode,
												{
													className:m._inputNode.className.replace(m._focusClass, m._blurClass)
												}
											)
										;
										m._currentNodeEventIsBlur = _true;
										m._validateOnExit && m._value == m._inputNode.value
											? _validate.call(m) // force an update
											: m.set ({_value:m._inputNode.value}) // catch any last values that might have been missed by blurring
										;
										m.set ({_inFocus:_false});
										m.fire('Blur');
										m._currentNodeEventIsBlur = _false;
									},
									focus:function () {
										m._focusClass &&
											m.setNodeProperties(
												m._inputNode,
												{
													className:m._inputNode.className.replace(m._blurClass, m._focusClass)
												}
											)
										;
										m._inputNode.value && m.set({_value:m._inputNode.value});
										m.set ({_inFocus:_true});
										m.fire('Focus');
									}
								}
							);
						}

						//set up the tooltip warnings
						m.wireNode (
							'warningIcon',
							{
								mouseover:function () {
									Uize.Dom.Basics.setInnerHtml (m._tooltip, m._selectWarningMessage());
									Uize.Tooltip.showTooltip (m._tooltip,_true);
								},
								mouseout:function () {Uize.Tooltip.hideTooltip(m._tooltip)}
							}
						);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_blurClass:{
					name:'blurClass',
					value:''
				},
				_deferUiWarning:{
					name:'deferUiWarning',
					value:_false
					/***
					 * Delays the displaying of the warning state until the user has actually clicked
					 * on the textinput itself. This prevents a user from entering a page and immediately
					 * seeing a mess of red.
					 ***/
				},
				_focusClass:{
					name:'focusClass',
					value:''
				},
				_inFocus:{
					name:'inFocus',
					value:_false
				},
				_isValid:{
					name:'isValid',
					onChange:function () { _displayWarningUi(this) },
					value:_false
				},
				_maxLength:{
					name:'maxLength',
					value:Infinity
				},
				_minLength:{
					name:'minLength',
					value:0
				},
				_selectWarningMessage:{
					name:'selectWarningMessage'
				},
				_showWarning:{
					name:'showWarning',
					onChange:function () { _displayWarningUi(this) },
					value:_false
				},
				_tooltip:'tooltip',
				_validateOnExit:{
					name:'validateOnExit',
					value:_false // default validation is done during keyup, for a more responsive interface
				},
				_validator:{
					name:'validator',
					value:null
				},
				_value:{
					name:'value',
					conformer:function (_value) {
						_value += '';
						var
							m = this,
							_maxLength = m._maxLength
						;
						if (m._filterType == 'LAN' && /[^a-z0-9]/.test (_value))
							_value = _value.toLowerCase ().replace(/[^a-z0-9]/g,'')
						;
						if (m._filterType == 'NUM' && /[^0-9]/.test(_value))							
							_value = _value.toLowerCase().replace(/[^0-9]/g, '')
						;
						if (_value.length > _maxLength)
							_value = _value.slice (0,_maxLength)
						;
						return _value;
					},
					onChange:'updateUi',
					value:''
				},
				_warningMessages:{
					name:'warningMessages',
					value:null
				},
				_filterType:'filterType'
					/***
					LAN - lowerAlphaNumeric
					NUM - numbers
					***/
			}
		});
	}
});

