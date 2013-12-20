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

		*DEVELOPERS:* `Tim Carter`, `Chris van Rensburg`, `Ben Ilegbodu`, `Vinson Chuong`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.FormElement',
	required:[
		'Uize.Node',
		'Uize.Node.Event',
		'Uize.Widget.FormElementWarning',
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
				
				_Uize = Uize,
				_Uize_Node = _Uize.Node,
				_Uize_Node_Event = _Uize_Node.Event,

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
							m = this,
							_warningWidget = m._warningWidget = m.addChild(
								'warning',
								m._warningWidgetClass || _Uize.Widget.FormElementWarning
							),
							_updateUiState = function () {m._updateUiState()}
						;

						m.wire ({
							'Changed.busyInherited':_updateUiState,
							'Changed.enabledInherited':_updateUiState
						});

						m._isInitialized = _true;
						m._lastKeyDown = -1;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._getInputNode = function () { return this.getNode('input') };

			_classPrototype._getParentForm = function () {
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
				var m = this;
				if (m.isWired) {
					var _enabled = m.get ('enabledInherited') && !m.get ('busyInherited');
					m.setNodeProperties (m._getInputNode(), {disabled:!_enabled});
				}
			};

			_classPrototype._updateUiValue = function () {
				var m = this;
				if (m.isWired) {
					var
						_inputNode = m._getInputNode(),
						_value = m._value
					;
					_value != m.getNodeValue (_inputNode)
						&& m.setNodeValue (_inputNode, _value === _undefined ? '' : _value)
					;
				}
			};

			_classPrototype._updateUiWarning = function () {
				var
					m = this,
					_warningShown = m._warningShown,
					_warningMessage = m._warningMessage
				;

				if (m.isWired) {
					// Update warning widget
					m._warningWidget &&
						m._warningWidget.set(
							_Uize.copyInto(
								{shown:_warningShown},
								_warningMessage ? {message:_warningMessage} : _null
							)
						);

					// visual indicators of warning state
					_Uize_Node.Classes.setState(
						[m._getInputNode(),m.getNode('label'),m.getNode ('shell')],
						m._errorClassName,
						_warningShown
					);
				}
			};

		/*** Public Methods ***/
			// NOTE: can be overidden by subclasses
			_classPrototype.fireOkOnEnter = _Uize.returnTrue;

			_classPrototype.checkIsEmpty = function () { return this._value == _null || this._value === '' };

			_classPrototype.checkWarningShown = _classPrototype._checkWarningShown = function () {
				var
					m = this,
					_warningShownWhen = m._warningShownWhen,
					_parentForm = m._getParentForm(),
					_currentWarningShown = m._warningShown
				;

				m.set({
					_warningShown:m._warningAllowedInherited
						&& m._isValid == _false
						&& (
							_parentForm
								? _parentForm.get('warningShown')
								: (
									m._isDirtyInherited
										&& (
											_warningShownWhen == _validated
											// keep the current warningShown value if warningShowWhen is set to a value
											// but that's not the current state
											|| (_warningShownWhen == _finished && (m._isFinished || _currentWarningShown))
											|| (_warningShownWhen == _validatedAfterFirstFinish && (m._finishedAtLeastOnce || _currentWarningShown))
										)
								)
						)
				});
			};

			// To be overridden as necessary by subclasses (should return an array)
			_classPrototype.getMoreValidators = _undefined;

			_classPrototype.getRootNode = function () { return this.getNode() || this.getNode('input') };

			_classPrototype.restore = function () {
				this.set({
					_finishedAtLeastOnce:_false,
					_isDirty:'inherit',
					_value:this._initialValue
				});
			};

			_classPrototype.updateUi = function () {
				var m = this;

				if (m.isWired) {
					m._updateUiState();
					m._updateUiValue();
					m._updateUiWarning();

					_superclass.doMy (m,'updateUi');
				}
			};
			
			_classPrototype.valueConformer = function(_value) {
				return _Uize.isFunction (this._valueConformer) ? this._valueConformer(_value) : _value;
			};

			_classPrototype.validate = _classPrototype._validate = function () {
				var m = this;

				if (m._isInitialized) {
					var
						_validator = m._validator,
						_validators =
							(
								_Uize.isArray(_validator)
									? _validator
									: (_validator != _null ? [_validator] : _null)
							),
						_moreValidators = m.getMoreValidators ? m.getMoreValidators() : _null
					;

					if (_moreValidators)
						_validators = _validators ? _validators.concat(_moreValidators) : _moreValidators
					;

					var _setIsValid = function (_isValid) { m.set({_isValid:_isValid}) };

					if (_validators != _null) {
						var
							_value = m._validateWhen == _tentativeValueChanged
								? m._tentativeValue : m._value,
							_validatorsLength = _validators.length,
							_validatorNo = -1,
							_processNextValidator = function () {
								if (++_validatorNo < _validatorsLength) {
									var
										_handleIsValid = function (_isValid, _newWarningMessage) {
											if (_isValid == _false) {
												m.set({_warningMessage:_newWarningMessage || m._initialWarningMessage});
												_setIsValid(_false);
											}
											else _processNextValidator();
										},
										_validatorToEvaluate = _validators[_validatorNo],
										_validatorFunction = _validatorToEvaluate.func || (_Uize.isFunction (_validatorToEvaluate) ? _validatorToEvaluate : _null),
										_isValid = _validatorFunction
											? _validatorFunction.call(m, _value, _handleIsValid)
											: (
												_validatorToEvaluate instanceof RegExp
													? _validatorToEvaluate.test (_value)
													: _value == _validatorToEvaluate
											)
									;

									if (_isValid != _null)	// sign that the validation is asynchronous
										_handleIsValid(_isValid, _validatorToEvaluate.msg);
								}
								else _setIsValid(_true);
							}
						;

						_processNextValidator();
					}
					else _setIsValid(_true);
				}
			};

			_classPrototype.wireUi = function () {
				var m = this;

				if (!m.isWired) {
					var _inputNode = m._getInputNode();

					if (_inputNode) {
						/*** Set up the read-only state properties (attributes of the node) ***/
							m._type = _inputNode.type;
							m._elementName = _inputNode.name;

						var
							_fire = function (_eventName, _domEvent) { m.fire ({name:_eventName,domEvent:_domEvent}) },
							_fireClick = function (_event) { _fire ('Click', _event) },
							_fireKeyUp = function (_event) { _fire ('Key Up', _event) },
							_setValue = function (_isInitial) {
								m.set ({_value:m.getNodeValue(_inputNode)});
								!_isInitial && m._isDirty != _true &&
									m.set({_isDirty:_true});
							},
							_eventsToWire = {
								blur:function () {
									_setValue();
									m.set({_focused:_false});
								},
								focus:function () { m.set({_focused:_true}) },
								click:function (_event) {
									_setValue();
									_fireClick (_event);
								},
								keydown:function (_event) {
									m._lastKeyDown = _event.keyCode;
									_fire ('Key Down', _event);

									_Uize_Node_Event.isKeyEnter(_event)
										&& m._type != 'textarea'
										&& _Uize_Node_Event.abort(_event)
									;
								}
							}
						;

						// Build up events to wire
						switch (m._type) {
							case 'checkbox':
								break;

							case 'radio':	// operates on a group of like-named radio buttons, but one has to have the implied node id
								m.set ({
									nodeMap:_Uize.copyInto(
										m.get('nodeMap') || {},
										{
											input:_Uize_Node.find({
												tagName:'INPUT',
												type:'radio',
												name:m._elementName
											})
										}
									)
								});
								_inputNode = m._getInputNode();
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
									if (m._type != 'textarea' && m._lastKeyDown == _event.keyCode && _Uize_Node_Event.isKeyEnter (_event)) {
										_setValue ();
										m.fireOkOnEnter()
											&& _fire ('Ok', _event)
										;
									}
									else if (_Uize_Node_Event.isKeyEscape (_event)) {
										m._updateUiValue();		// replace with old (saved) value
										_fire ('Cancel', _event);
										_inputNode.blur();
									}
									else {
										m.set({
											_tentativeValue:m.getNodeValue(_inputNode),
											_isFinished:_false
										});
									}

									_fireKeyUp (_event);
								};
								_eventsToWire.click = _fireClick;
								break;
						}

						m.wireNode(_inputNode, _eventsToWire);

						// if no value was set, then grab the value from the node
						m._value === _undefined
							? _setValue(_true)
							: m._updateUiValue()
						;
					}

					m._validate();

					_superclass.doMy (m,'wireUi');
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
					onChange:function () {
						var
							m = this,
							_warningWidget = m.children.warning,
							_focused = m._focused
						;

						_warningWidget && _warningWidget.set({focused:_focused});

						if (m.isWired) {
							var _inputNode = m._getInputNode();

							// If focused state property is out of sync with 'focused' state of the DOM node (via document.activeElement)
							// then force a focus.  We don't force a blur because blurring isn't as important (an apparently it causes
							// issues with Samsung Galaxy Tab 10.1)
							if (_focused && _inputNode && document.activeElement != _inputNode) {
								setTimeout(
									function() {
										try { (_Uize_Node.isNode(_inputNode) ? _inputNode : _inputNode[0]).focus(); }
										catch(_ex) {}
									}, 0
								);

								// sync up the value with the UI, in case conformer had changed a UI value to something that already matched the programmatic value
								m.setNodeValue('input', m._value);
							}
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
					onChange:function () {
						var
							m = this,
							_parentForm = m._getParentForm(),
							_isDirty = m._isDirty == 'inherit'
								? (_parentForm ? _parentForm.get('isDirtyInherited') : _false)
								: m._isDirty
						;

						m.set({_isDirtyInherited:_isDirty});
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
					onChange:function () {
						var m = this;

						if (m._isFinished && m._isInitialized) {
							m._validateWhen == _finished
								&& m._validate();
							m._finishedAtLeastOnce
								|| m.set({_finishedAtLeastOnce:_true});
						}

						m._checkWarningShown();
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
					onChange:function () {
						this._validateWhen == _tentativeValueChanged
							&& this._validate()
						;
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
					conformer:function (_value) {
						var m = this;

						// conform the value to boolean if type is checkbox
						_value = m._type == 'checkbox' ? _value == _true : _value;

						return m.valueConformer(_value);
					},
					onChange:function () {
						var m = this;

						// As long as the widget is not wired & the value changes, update the initial value
						// so that when the widget is wired we have something restore to. We need to do it here
						// so that if value is set after construction but before wiring, we'll still capture
						// it as an initial value
						if (!m.isWired)
							m._initialValue = m._value
						;

						m.set({
							_tentativeValue:m._value, // sync tentative value
							_isFinished:_true,
							_isEmpty:m.checkIsEmpty()
						});

						m._validateWhen == _valueChanged
							&& m._validate();

						m._updateUiValue();
					}/*,
					value:_null*/
				},
				_valueConformer:'valueConformer',
				_warningAllowed:{
					name:'warningAllowed',
					onChange:function () {
						var
							m = this,
							_parentForm = m._getParentForm(),
							_warningAllowed = m._warningAllowed == 'inherit'
								? (_parentForm ? _parentForm.get('warningAllowedInherited') : _true)
								: m._warningAllowed
						;

						m.set({_warningAllowedInherited:_warningAllowed});
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
						function () {
							var m = this;

							if (!m.isWired)
								m._initialWarningMessage = m._warningMessage;
						},
						_classPrototype._updateUiWarning
					]
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
				_warningWidgetClass:'warningWidgetClass',

				/*** Private properties used for managing internal state w/ onChange functionality ***/
					_finishedAtLeastOnce:{
						onChange:_classPrototype._checkWarningShown,
						value:_false
					}
			});

		return _class;
	}
});
