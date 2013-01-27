/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TextInput Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
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
		'Uize.Node',
		'Uize.Node.Event',
		'Uize.Tooltip'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype.validate = _classPrototype._validate = function() {
				var
					_this = this,
					_validator = _this._validator,
					_value = _this + '',
					_valueLength = _value.length,
					_isValid =
						_valueLength >= _this._minLength && _valueLength <= _this._maxLength &&
						(
							_validator == _null ||
							(
								_validator instanceof RegExp
									? _validator.test (_value)
									: (Uize.isFunction (_validator) ? _validator (_value) : _value == _validator)
							)
						),
					_forceUiDisplay = !_isValid && _this._isValid == _isValid
				;
				_this._isValid != _isValid
					? _this.set ({_isValid:_isValid})
					: _isValid ? 0 : _this._displayWarningUi ()
				;
			};

			_classPrototype._displayWarningUi = function() {
				if (this.isWired) {
					var
						_this = this,
						_displayError = _this._showWarning && !_this._isValid
					;
					// if we're able to give visual indicators, then change the textInput color and pop up the icon/tooltip duo.
					_this.setNodeProperties([_this._inputNode,'label'],{className:_displayError ? 'error' : 'good'});
					_this.setNodeStyle('warningIcon', {display:_displayError ? 'inline' : 'none'});
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.blur = function () {
				this._inputNode && this._inputNode.blur ()
				/*?
					Instance Methods
						blur
							Blur the =input= implied node of the instance.

							SYNTAX
							....................
							myTextInput.blur ();
							....................

							NOTES
							- see the companion =focus= instance method
				*/
			};

			_classPrototype.focus = function () {
				this._inputNode && this._inputNode.focus ()
				/*?
					Instance Methods
						focus
							Focuses the =input= implied node of the instance.

							SYNTAX
							.....................
							myTextInput.focus ();
							.....................

							NOTES
							- see the companion =blur= instance method
				*/
			};

			_classPrototype.selectWarningMessage = function () { return this._selectWarningMessage() };

			_classPrototype.updateUi = function () {
				var
					_this = this,
					_inputNode = _this._inputNode
				;
				if (_this.isWired && _inputNode) {
					_inputNode.disabled = !_this.get('enabled');

					if (_inputNode.value != _this._value)
						_inputNode.value = _this._value
					;
				}

				// there can (not) be only one!
				(_this._validateOnExit ^ _this._currentNodeEventIsBlur) || _this._validate();
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._inputNode = _this.getNode ('input');

					if (_this._inputNode) {
						_this._inputNodeIsInputTag = _this._inputNode.tagName == 'INPUT';

						_this.wireNode (
							_this._inputNode,
							{
								keydown:function (_domEvent) {
									if (
										_this._inputNodeIsInputTag &&
										Uize.Node.Event.isKeyEnter (_domEvent) &&
										_this.fire ({name:'Ok',domEvent:_domEvent}).cancelSubmit
									) {
										var _inputNodeForm = _this._inputNode.form;
										if (_inputNodeForm) {
											_this._storedFormOnsubmit = _inputNodeForm.onsubmit;
											_this._blockedFormSubmit = _true;
											_inputNodeForm.onsubmit = Uize.returnFalse;
										}
									}
								},
								keypress:function (_domEvent) {
									_this._keyAborted = _this.fire ({name:'Key Press',domEvent:_domEvent}).abort &&
										Uize.Node.Event.abort (_domEvent)
									;
								},
								keyup:function (_domEvent) {
									if (_this._keyAborted) {
										_this._keyAborted = _false;
									} else {
										if (_this._blockedFormSubmit) {
											_this._inputNode.form.onsubmit = _this._storedFormOnsubmit;
											_this._storedFormOnsubmit = _this._blockedFormSubmit = _undefined;
										}
										Uize.Node.Event.isKeyEscape (_domEvent) &&
											_this.fire ({name:'Cancel',domEvent:_domEvent})
										;
										_this.set ({_value:_this._inputNode.value});
										_this.updateUi (); // the conformer might result in the value not being the current text
										_this._deferUiWarning && _this.set ({showWarning:_true});
									}
									_this.fire ({name:'Key Up',domEvent:_domEvent});
								},
								blur:function() {
									_this._blurClass &&
										_this.setNodeProperties(
											_this._inputNode,
											{
												className:_this._inputNode.className.replace(_this._focusClass, _this._blurClass)
											}
										)
									;
									_this._currentNodeEventIsBlur = _true;
									_this._validateOnExit && _this._value == _this._inputNode.value
										? _this._validate() // force an update
										: _this.set ({_value:_this._inputNode.value}) // catch any last values that might have been missed by blurring
									;
									_this.set ({_inFocus:_false});
									_this.fire('Blur');
									_this._currentNodeEventIsBlur = _false;
								},
								focus:function() {
									_this._focusClass &&
										_this.setNodeProperties(
											_this._inputNode,
											{
												className:_this._inputNode.className.replace(_this._blurClass, _this._focusClass)
											}
										)
									;
									_this._inputNode.value && _this.set({_value:_this._inputNode.value});
									_this.set ({_inFocus:_true});
									_this.fire('Focus');
								}
							}
						);
					}

					//set up the tooltip warnings
					_this.wireNode (
						'warningIcon',
						{
							mouseover:function() {
								Uize.Node.setInnerHtml (_this._tooltip, _this._selectWarningMessage());
								Uize.Tooltip.showTooltip (_this._tooltip,_true);
							},
							mouseout:function() {Uize.Tooltip.hideTooltip(_this._tooltip)}
						}
					);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
					onChange:function() { this._displayWarningUi() },
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
					onChange:function() { this._displayWarningUi() },
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
							_this = this,
							_maxLength = _this._maxLength
						;
						if (_this._filterType == 'LAN' && /[^a-z0-9]/.test (_value))
							_value = _value.toLowerCase ().replace(/[^a-z0-9]/g,'')
						;
						if (_value.length > _maxLength)
							_value = _value.slice (0,_maxLength)
						;
						return _value;
					},
					onChange:_classPrototype.updateUi,
					value:''
				},
				_warningMessages:{
					name:'warningMessages',
					value:_null
				},
				_filterType:'filterType'
					/***
					LAN - lowerAlphaNumeric
					***/
			});

		return _class;
	}
});

