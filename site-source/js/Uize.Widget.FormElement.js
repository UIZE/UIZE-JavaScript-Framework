/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElement Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 80
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Widget.FormElement= class serves as a wrapper class in order to provide an interface for any form element (input, select, textarea, etc).

		*DEVELOPERS:* `Tim Carter`, `Chris van Rensburg`, `Ben Ilegbodu`, `Vinson Chuong`
*/

Uize.module ({
	name:'Uize.Widget.FormElement',
	required:[
		'Uize.Node',
		'Uize.Node.Event',
		'Uize.Widget.Collapsy',
		'Uize.Node.Classes'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_undefined,

				/*** validation/warning variables ***/
					_never = 'never',
					_tentativeValueChanged = 'tentativeValueChanged',
					_valueChanged = 'valueChanged',
					_validated = 'validated',
					_finished = 'finished',
					_validatedAfterFirstFinish = 'validatedAfterFirstFinish'
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var
							_this = this,
							_warningWidget = _this.addChild('warning', Uize.Widget.Collapsy, _this._warningMessageProperties)
						;

						function _updateUiState() { _this._updateUiState() }
						_this.wire ({
							'Changed.busyInherited':_updateUiState,
							'Changed.enabledInherited':_updateUiState,
							Blur:function() { _warningWidget.set({collapsed:_true}) },
							Focus:function() { _warningWidget.set({collapsed:_false}) }
						});

						_this._warningWidget = _warningWidget;
						_this._isInitialized = _true;
						_this._lastKeyDown = -1;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._getInputNode = function() { return this.getNode('input') };

			_classPrototype._getParentForm = function() {
				var
					_parentElementsWidget = this.parent,
					_parentForm
				;
				if (_parentElementsWidget && _parentElementsWidget.parent) {
					_parentForm = _parentElementsWidget.parent;

					if (!_parentForm.isForm)
						_parentForm = _null;
				}
				return _parentForm;
			};

			_classPrototype._updateUiState = function () {
				var _this = this;
				if (_this.isWired) {
					var _enabled = _this.get ('enabledInherited') && !_this.get ('busyInherited');
					_this.setNodeProperties (_this._getInputNode(), {readOnly:!_enabled,disabled:!_enabled});
				}
			};

			_classPrototype._updateUiValue = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_inputNode = _this._getInputNode(),
						_value = _this._value
					;
					_value + '' != _this.getNodeValue (_inputNode)
						&& _this.setNodeValue (_inputNode, _value)
					;
				}
			};

			_classPrototype._updateUiWarning = function() {
				var
					_this = this,
					_warningShown = _this._warningShown,
					_warningMessage = _this._warningMessage
				;

				if (_this.isWired) {
					// Update warning widget
					_this._warningWidget &&
						_this._warningWidget.set(
							Uize.copyInto(
								{shown:_warningShown},
								_warningMessage ? {expandedMessage:_warningMessage} : _null
							)
						);

					// visual indicators of warning state
					Uize.Node.Classes.setState(
						[_this._getInputNode(),_this.getNode('label')],
						_this._errorClassName,
						_warningShown
					);
				}
			};

		/*** Public Methods ***/
			// NOTE: can be overidden by subclasses
			_classPrototype.fireOkOnEnter = Uize.returnTrue;

			_classPrototype.checkIsEmpty = function() { return this._value == _null || this._value == '' };

			_classPrototype.checkWarningShown = _classPrototype._checkWarningShown = function() {
				var
					_this = this,
					_warningShownWhen = _this._warningShownWhen,
					_parentForm = _this._getParentForm(),
					_currentWarningShown = _this._warningShown
				;

				_this.set({
					_warningShown:_this._warningAllowedInherited
						&& _this._isValid == _false
						&& (
							_parentForm
								? _parentForm.get('warningShown')
								: (
									_this._isDirtyInherited
										&& (
											_warningShownWhen == _validated
											// keep the current warningShown value if warningShowWhen is set to a value
											// but that's not the current state
											|| (_warningShownWhen == _finished && (_this._isFinished || _currentWarningShown))
											|| (_warningShownWhen == _validatedAfterFirstFinish && (_this._finishedAtLeastOnce || _currentWarningShown))
										)
								)
						)
				});
			};

			// To be overridden as necessary by subclasses (should return an array)
			_classPrototype.getMoreValidators = _undefined;

			_classPrototype.getRootNode = function() {
				return this.getNode() || this.getNode('input')
			};

			_classPrototype.restore = function() {
				this.set({
					_finishedAtLeastOnce:_false,
					_isDirty:'inherit',
					_value:this._initialValue
				})
			};

			_classPrototype.updateUi = function () {
				var _this = this;

				if (_this.isWired) {
					_this._updateUiState();
					_this._updateUiValue();
					_this._updateUiWarning();

					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.validate = _classPrototype._validate = function() {
				var _this = this;

				if (_this._isInitialized) {
					var
						_validator = _this._validator,
						_validators =
							(
								Uize.isArray(_validator)
									? _validator
									: (_validator != _null ? [_validator] : _null)
							),
						_moreValidators = _this.getMoreValidators ? _this.getMoreValidators() : _null
					;

					if (_moreValidators)
						_validators = _validators ? _validators.concat(_moreValidators) : _moreValidators
					;

					var _setIsValid = function (_isValid) { _this.set({_isValid:_isValid}) };

					if (_validators != _null) {
						var
							_value = _this._validateWhen == _tentativeValueChanged
								? _this._tentativeValue : _this._value,
							_validatorsLength = _validators.length,
							_validatorNo = -1,
							_processNextValidator = function () {
								if (++_validatorNo < _validatorsLength) {
									var
										_handleIsValid = function (_isValid, _newWarningMessage) {
											if (_isValid == _false) {
												_this.set({_warningMessage:_newWarningMessage || _this._initialWarningMessage});
												_setIsValid(_false);
											}
											else _processNextValidator();
										},
										_validatorToEvaluate = _validators[_validatorNo],
										_isValid = _validatorToEvaluate instanceof RegExp
											? _validatorToEvaluate.test (_value)
											: (
												_validatorToEvaluate.func || Uize.isFunction (_validatorToEvaluate)
													? (
														_validatorToEvaluate.func || _validatorToEvaluate
													).call(_this, _value, _handleIsValid)
													: _value == _validatorToEvaluate
											)
									;

									_handleIsValid(_isValid, _validatorToEvaluate.msg);
								}
								else _setIsValid(_true);
							}
						;
						_processNextValidator();
					}
					else _setIsValid(_true)
				}
			};

			_classPrototype.wireUi = function() {
				var _this = this;

				if (!_this.isWired) {
					var _inputNode = _this._getInputNode();

					if (_inputNode) {
						/*** Set up the read-only state properties (attributes of the node) ***/
							_this._type = _inputNode.type;
							_this._elementName = _inputNode.name;

						var
							/*** Helper functions ***/
								_fire = function (_eventName, _domEvent) { _this.fire ({name:_eventName,domEvent:_domEvent}) },
								_fireClick = function (_event) { _fire ('Click', _event) },
								_fireKeyUp = function (_event) { _fire ('Key Up', _event) },
								_setValue = function (_isInitial) {
									_this.set ({_value:_this.getNodeValue(_inputNode)});
									!_isInitial && _this._isDirty != _true &&
										_this.set({_isDirty:_true});
								},

							_eventsToWire = {
								blur:function () {
									_setValue();
									_this.set({_focused:_false});
								},
								focus:function () { _this.set({_focused:_true}) },
								click:function (_event) {
									_setValue();
									_fireClick (_event);
								},
								keydown:function (_event) {
									_this._lastKeyDown = _event.keyCode;
									_fire ('Key Down', _event);
								}
							}
						;

						// Build up events to wire
						switch (_this._type) {
							case 'checkbox':
								break;

							case 'radio':	// operates on a group of like-named radio buttons, but one has to have the implied node id
								_this.set ({
									nodeMap:Uize.copyInto(
										_this.get('nodeMap') || {},
										{
											input:Uize.Node.find({
												tagName:'INPUT',
												type:'radio',
												name:_this._elementName
											})
										}
									)
								});
								_inputNode = _this._getInputNode();
								break;

							case 'select-one':
							case 'select-multiple':
								_eventsToWire.change = _setValue;
								_eventsToWire.keyup = function (_event) {
									_setValue ();
									_fireKeyUp (_event);
								};
								_eventsToWire.click = _fireClick;
								break;

							default: // text, password, HTML5 text input, textarea, etc...
								_eventsToWire.keyup = function (_event) {
									// NOTE: When inputting Kanji, it's standard to use the enter button to choose kanji characters.
									// So everytime a user wants to type a multi-kanji word, 'Ok' would fire (which could ultimately
									// cause a form submission, which would be bad). So now the check to see if we should fire 'Ok'
									// checks to see if both keydown AND keyup are ENTER (since when you type kanji, you keydown on
									// a non-enter key, do stuff, then keyup to continue).
									if (_this._type != 'textarea' && _this._lastKeyDown == _event.keyCode && Uize.Node.Event.isKeyEnter (_event)) {
										_setValue ();
										_this.fireOkOnEnter()
											&& _fire ('Ok', _event)
										;
									}
									else if (Uize.Node.Event.isKeyEscape (_event)) {
										_this._updateUiValue();		// replace with old (saved) value
										_fire ('Cancel', _event);
										_inputNode.blur();
									}
									else {
										_this.set({
											_tentativeValue:_this.getNodeValue(_inputNode),
											_isFinished:_false
										});
									}

									_fireKeyUp (_event);
								};
								_eventsToWire.click = _fireClick;
								break;
						}

						_this.wireNode(_inputNode, _eventsToWire);

						// if no value was set, then grab the value from the node
						_this._value === _undefined
							? _setValue(_true)
							: _this._updateUiValue()
						;
					}

					_this._validate();

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties({
				_elementName:'elementName', // read-only
					/*?
						State Properties
							elementName
								The name associated with the input nodes belonging to the form element.

								EXAMPLE
								........................................................
								<input id="myWidget-input" type='button' name='foobar'/>
								........................................................

								For a =Uize.Widget.FormElement= instance with the =idPrefix= of ='myWidget'= and the above HTML for its =input= implied node, the value of the =elementName= state property will be ='foobar'=.
					*/
				_errorClassName:{
					name:'errorClassName',
					value:'error'
				},
				_focused:{
					name:'focused',
					onChange:function() {
						var
							_this = this,
							_warningWidget = _this.children.warning
						;

						_warningWidget && _warningWidget.set({collapsed:!_this._focused});

						if (_this.isWired) {
							var _inputNode = _this._getInputNode();

							try {
							_inputNode &&
								(Uize.Node.isNode(_inputNode) ? _inputNode : _inputNode[0])[
									_this._focused ? 'focus' : 'blur'
								]()
							;

								// synch up the value with the UI, in case conformer had changed a UI value to something that already matched the programmatic value
								_this.setNodeValue('input', _this._value);
							}
							catch(_ex) {}
						}
					},
					value:_false
				},
				_isEmpty:{
					name:'isEmpty',
					value:_true
				},
				_isDirty:{
					name:'isDirty',
					onChange:function() {
						var
							_this = this,
							_parentForm = _this._getParentForm(),
							_isDirty = _this._isDirty == 'inherit'
								? (_parentForm ? _parentForm.get('isDirtyInherited') : _false)
								: _this._isDirty
						;

						_this.set({_isDirtyInherited:_isDirty});
					},
					value:'inherit'
				},
				_isDirtyInherited:{
					name:'isDirtyInherited',
					onChange:_classPrototype._checkWarningShown,
					value:_false
				},
				_isFinished:{
					name:'isFinished',
					onChange:function() {
						var _this = this;

						if (_this._isFinished && _this._isInitialized) {
							_this._validateWhen == _finished
								&& _this._validate();
							_this._finishedAtLeastOnce
								|| _this.set({_finishedAtLeastOnce:_true});
						}

						_this._checkWarningShown();
					},
					value:_true
				},
				_isValid:{
					name:'isValid',
					onChange:_classPrototype._checkWarningShown,
					value:_false
				},
				_tentativeValue:{	// readonly
					name:'tentativeValue',
					onChange:function() {
						this._validateWhen == _tentativeValueChanged
							&& this._validate()
					},
					value:_null
				},
				_type:'type', // read-only
					/*?
						State Properties
							type
								The type associated with the input node belonging to the form element.

								EXAMPLE
								........................................................
								<input id="myWidget-input" type='button' name='foobar'/>
								........................................................

								For a =Uize.Widget.FormElement= instance with the =idPrefix= of ='myWidget'= and the above HTML for its =input= implied node, the value of the =type= state property will be ='button'=.
					*/
				_validateWhen:{
					name:'validateWhen',
					value:_tentativeValueChanged	// valid values: 'never', 'tentativeValueChanged', 'valueChanged' & 'finished'
				},
				_validator:{
					name:'validator',
					onChange:_classPrototype._validate,
					value:_null
				},
				_value:{
					name:'value',
					conformer:function(_value) {
						var _this = this;

						// conform the value to boolean if type is checkbox
						_value = _this._type == 'checkbox' ? _value == _true : _value;

						return Uize.isFunction (this._valueConformer) ? this._valueConformer(_value) : _value
					},
					onChange:function() {
						var _this = this;

						// As long as the widget is not wired & the value changes, update the initial value
						// so that when the widget is wired we have something restore to. We need to do it here
						// so that if value is set after construction but before wiring, we'll still capture
						// it as an initial value
						if (!_this.isWired)
							_this._initialValue = _this._value
						;

						_this.set({
							_tentativeValue:_this._value, // sync tentative value
							_isFinished:_true,
							_isEmpty:_this.checkIsEmpty()
						});

						_this._validateWhen == _valueChanged
							&& _this._validate();

						_this._updateUiValue();
					}/*,
					value:_null*/
				},
				_valueConformer:'valueConformer',
				_warningAllowed:{
					name:'warningAllowed',
					onChange:function() {
						var
							_this = this,
							_parentForm = _this._getParentForm(),
							_warningAllowed = _this._warningAllowed == 'inherit'
								? (_parentForm ? _parentForm.get('warningAllowedInherited') : _true)
								: _this._warningAllowed
						;

						_this.set({_warningAllowedInherited:_warningAllowed});
					},
					value:'inherit'
				},
				_warningAllowedInherited:{
					name:'warningAllowedInherited',
					onChange:_classPrototype._checkWarningShown,
					value:_false
				},
				_warningMessage:{
					name:'warningMessage',
					onChange:[
						function() {
							var _this = this;

							if (!_this.isWired)
								_this._initialWarningMessage = _this._warningMessage;
						},
						_classPrototype._updateUiWarning
					]
				},
				_warningMessageProperties:{ // for the warning
					name:'warningMessageProperties',
					onChange:function() {  this._warningWidget.set(this._warningMessageProperties) }
				},
				_warningShown:{
					name:'warningShown',
					onChange:_classPrototype._updateUiWarning,
					value:_false
				},
				_warningShownWhen:{
					name:'warningShownWhen',
					onChange:_classPrototype._checkWarningShown,
					value:_validated	// valid values: 'validated', 'finished', validatedAfterFirstFinish'
				},

				/*** Private properties used for managing internal state w/ onChange functionality ***/
					_finishedAtLeastOnce:{
						onChange:_classPrototype._checkWarningShown,
						value:_false
					}
			});

		return _class;
	}
});
