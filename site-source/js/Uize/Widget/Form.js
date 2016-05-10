/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormWarnings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Form= widget provides functionality for managing form elements and handling validation

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Form',
	required:[
		'Uize.Widget.FormElements',
		'Uize.Widget.FormElement',
		'Uize.Widget.Committer',
		'Uize.Widget.FormWarnings',
		'Uize.Widget.Button',
		'Uize.Dom.Event',
		'Uize.Data.Compare',
		'Uize.Widget.mDeclarativeChildren',
		'Uize.Widget.mEventBindings'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_null = null,
				_undefined,

				_Uize = Uize,
				_Uize_Widget = _Uize.Widget,
				_identical = _Uize.Data.Compare.identical,

			/*** validation/warning variables ***/
				_never = 'never',
				_valueChanged = 'valueChanged',
				_validated = 'validated',
				_finished = 'finished',
				_validatedAfterFirstFinish = 'validatedAfterFirstFinish',

			/*** Helper Methods ***/
				_checkWarningShown = function () {
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
				},
				_restore = function () { this._restore('restoreInitial') },
				_submit = function () {
					this.set({
						_isDirty:_true,
						_isFinished:_true,
						_isSubmitting:!this._okToSubmit
					});
				},
				_updateFormAttributes = function () {
					var m = this;

					if (m.isWired) {
						m.setNodeProperties(
							'form',
							{
								action:m._action,
								enctype:m._enctype,
								method:m._method,
								target:m._target
							}
						);
					}
				},
				_updateSummaryStateProperties = function () { this.set({_okToSubmit:this._isSubmitting && this._isValid}) },
				_updateUiWarning = function () {
					var
						m = this,
						_formWarnings = m._formWarnings,
						_warningShown = m._warningShown
					;

					if (m.isWired) {
						if (_formWarnings) {
							_formWarnings.set({shown:_warningShown});

							if (_warningShown && m.isWired) {
							// hide any server warnings if we're showing the client-side warnings
								m.displayNode('serverWarnings', _false);

								if (m._scrollToWarnings) {
									var _formWarningsRootNode = _formWarnings.getNode();

									_formWarningsRootNode
										&& Uize.require(
											'Uize.Fx.Scroll',
											function(_Uize_Fx_Scroll) { _Uize_Fx_Scroll.scrollToNode(_formWarningsRootNode) }
										)
									;
								}
							}
						}
					}
				},
				_updateValue = function () {
					var
						m = this,
						_committer = m._committer
					;

					// NOTE: until there's a way to cause changing the contents of an object to fire
					// onChange, we'll just have to create a new object
					m.set({
						_value:_Uize.copy(
							m._value,
							_committer.get('committedValues'),
							_committer.get('uncommittedValues')
						)
					});
				},
				_validate = function () { this.set({_isValid:this._committer.get('allValid')}) }
		;

		return _superclass.subclass({
			mixins:[_Uize_Widget.mDeclarativeChildren, _Uize_Widget.mEventBindings],

			alphastructor:function () {
				// this is just a dummy private variable so that when we are examining
				// child widgets, we'll know we're dealing with a form widget (or subclass)
				// and not a form element widget
				this.isForm = this._isForm = _true;
			},

			children:{
				committer:{
					widgetClass:_Uize_Widget.Committer,
					ignoreDisabled:_true
				},
				elements:_Uize_Widget.FormElements,
				formWarnings:_Uize_Widget.FormWarnings,
				submit:_Uize_Widget.Button
			},

			omegastructor:function () {
				var
					m = this,
					_children = m.children,
					_elements = m._elements = _children.elements,
					_elementsChildren = _elements.children,
					_elementsAddedChildren = _elements.addedChildren,

					_wireAddedElement = function (_elementName) {
						var _childElement = _elementsChildren[_elementName];

						_childElement.wire({
							'Changed.isDirtyInherited':function (_event) {
								_event.newValue && m.set({_isDirty:_true});
							},
							Ok:function () { m._submit() },
							'Changed.focused':function (_event) {
								// NOTE: so unfortunately the browsers support an autofill feature that
								// will prepopulate fields, but it doesn't fire onChange events for
								// each field.  So when we blur a text field, we ensure that all of the
								// programmatic values for fields match the DOM values
								if (!_event.newValue)
									m._forEachElement(
										function (_element, _elementName, _elementIsForm) {
											if (!_elementIsForm) {
												var _nodeValue = _element.getNodeValue('input');

												_nodeValue !== _undefined
													&& _element.valueOf() != _nodeValue
													&& _element.get('placeholder') != _nodeValue
													&& _element.set({value:_nodeValue})
												;
											}
										}
									);
								else // see note below for Changed.tentativeValue
									m.set({_isSubmitting:_false});
							},
							'Changed.tentativeValue':function() {
								//FormElement.tentativeValue onChange also sets this to false,
								//	as it gets the event before us and so might trigger other stuff
								//	which causes a form submission.
								m.set({_isSubmitting:_false});

								m.set({
									// NOTE: in order to support async validation, we could no longer set isSubmitting to false
									// if isValid was false, which means that there was nothing setting isSubmitting to false after
									// clicking the submit. This means that you could run into a case where you submit and invalid form,
									// get the warnings, fix the values and the form auto-submits.
									_tentativeValue:_Uize.copy(
										m._tentativeValue,
										_Uize.pairUp(_childElement.get('name'), _childElement.get('tentativeValue'))
									)
								});
							}
						});

						if (_childElement.isForm) {
							// if form widget is added as child of another form, then it can't be using normal
							// submit since it's part of a bigger form
							_childElement.set({_useNormalSubmit:_false});

							_childElement.wire(
								'Changed.isSubmitting',
								function (_event) { _event.newValue && m._submit() }
							);
						}

						m._formWarnings.addWatchedElements(_childElement);

						m._committer.addWatchedProperties([{
							alias:_childElement.get('name'),
							instance:_childElement,
							name:'value'
						}]);
					},
					_wireAddedElements = function(_elementsLookup) {
						_Uize.forEach(
							_elementsLookup,
							function(_added, _elementName) {
								_added && _wireAddedElement(_elementName);
							}
						);
					},
					_updateNumWarningsShown = function () {
						m.set({ _numWarningsShown: m.get('warningShown') ? m._formWarnings.get('numWarnings') : 0 });
					}
				;

				// Save private instance references
				m._committer = _children.committer;
				m._formWarnings = _children.formWarnings;

				_wireAddedElements(_elementsAddedChildren.get());

				_elements.addedChildren.wire(
					'Changed.*',
					function(_event) { _wireAddedElements(_event.properties) }
				);

				// update numWarningsShown
				m._formWarnings.wire('Changed.numWarnings', function () { _updateNumWarningsShown(); });
				m.wire('Changed.warningShown', function () { _updateNumWarningsShown(); });

				m._isInitialized = _true;
			},

			instanceMethods:{
				/** Private **/
					_addChildElement:function (_elementName, _elementClass, _elementProperties) {
						return this._elements.addChild(_elementName, _elementClass, _elementProperties);
					},
					_checkWarningShown:_checkWarningShown,
					_forEachElement:function (_function) {
						if (this._elements) {
							var _elements = this._elements.children;

							for (var _elementName in _elements) {
								var _element = _elements[_elementName];

								if (_function (_element, _element.get('name'), _element.isForm) === _false) break;
							}
						}
					},
					_getParentForm:function () { // NOTE: duplicated from Uize.Widget.FormElement.  mix-in?
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
					},
					_restore:function (_committerMethod) {
						var m = this;

						m.set({
							_finishedAtLeastOnce:_false,
							_isSubmitting:_false,
							_isDirty:'inherit'
						});

						m._forEachElement(  function (_element) { _element.restore()} );
						m._committer[_committerMethod]();
					},
					_submit:_submit,
					_updateFormAttributes:_updateFormAttributes,
					_updateValue:_updateValue,
					_updateUiWarning:_updateUiWarning,
					_validate:_validate,

				/** Public **/
					addForm:function (_formName, _formClass, _formProperties) {
						return this._addChildElement(_formName, _formClass || _Uize_Widget.Form, _formProperties);
					},
					addFormElement:function (_formElementName, _formElementClass, _formElementProperties) {
						return this._addChildElement(_formElementName, _formElementClass || _Uize_Widget.FormElement, _formElementProperties);
					},
					checkIsEmpty:function () { // NOTE: can be overidden by subclasses
						var
							_elements = this._elements.children,
							_isEmpty = _true
						;

						if (_elements) {
							for (var _elementName in _elements) {
								if (!_elements[_elementName].get('isEmpty')) {
									_isEmpty = _false;
									break;
								}
							}
						}

						return _isEmpty;
					},
					checkWarningShown:_checkWarningShown, // NOTE: duplicated from Uize.Widget.FormElement.  mix-in?
					clear:function () { this._restore('clearAll') },
					getFormElement:function(_elementName) {
						var _formElement;

						if (this._elements) {
							var _elementsChildren = this._elements.children;

							_formElement = _elementName == _undefined
								? _Uize.values(_elementsChildren)
								: _elementsChildren[_elementName]
							;
						}

						return _formElement;
					},
					removeFormElement:function(_elementName) {
						var
							m = this,
							_value = m._value,
							_elements = m._elements,
							_committer = m._committer,
							_formWarnings = m._formWarnings,
							_element = m.getFormElement(_elementName),
							_formElementsToRemove = _Uize.isArray(_element) ? _element : [_element]
						;

						_Uize.forEach(
							_formElementsToRemove,
							function(_formElementToRemove) {
								if (_formElementToRemove) {
									var _elementName = _formElementToRemove.get('name');
									delete _value[_elementName];
									_committer.removeWatchedProperties([_elementName]);
									_formWarnings.removeWatchedElements(_formElementToRemove);
									_formElementToRemove.removeUi();
									_elements.removeChild(_formElementToRemove);
								}
							}
						);
					},
					reset:_restore,
					restore:_restore,
					submit:_submit,
					updateUi:function () {
						var m = this;

						if (m.isWired) {
							m._updateFormAttributes();
							m._updateUiWarning();
							m._forEachElement(  function (_element) { _element.updateUi()} );

							_superclass.doMy (m,'updateUi');
						}
					},
					validate:_validate,
					wireUi:function () {
						var m = this;

						if (!m.isWired) {
							var _formNode = m.getNode('form');

							/*** Initialize get-set properties to be form attributes if not specified ***/
								if (_formNode) {
									var _hasNoValue = function (_propertyValue) {
										return _propertyValue == _null;
									};

									if (_hasNoValue(m._action)) m._action = _formNode.action;
									if (_hasNoValue(m._enctype)) m._enctype = _formNode.enctype;
									if (_hasNoValue(m._method)) m._method = _formNode.method;
									if (_hasNoValue(m._target)) m._target = _formNode.target;

									m.wireNode(
										_formNode,
										'submit',
										function (_event) {
											_Uize.Dom.Event.abort(_event);
											// NOTE: this will fire before any events on the form elements
											// to sync their values
											m._submit();
										}
									);
								}

							_superclass.doMy (m,'wireUi');

							m._updateValue();
							m._validate();
						}
					}
			},

			stateProperties:{
				_action:{
					name:'action',
					onChange:_updateFormAttributes
				},
				_enctype:{
					name:'enctype',
					onChange:_updateFormAttributes
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
					onChange:_checkWarningShown,
					value:_false
				},
				_isFinished:{
					name:'isFinished',
					onChange:[
						function () {
							var m = this;

							if (m._isFinished) {
								m._validateWhen == _finished
									&& m._validate();
								!m._finishedAtLeastOnce && m._isInitialized
									&& m.set({_finishedAtLeastOnce:_true});
							}
							else
								m.set({_finishedAtLeastOnce:_false})
							;
						},
						_checkWarningShown
					],
					value:_true
				},
				_isSubmitting:{
					name:'isSubmitting',
					onChange:[
						function () {
							var m = this;

							m._isSubmitting
								&& m._committer
								&& m._committer.commit()
							;
						},
						_checkWarningShown,
						_updateSummaryStateProperties
					],
					value:_false
				},
				_isValid:{
					name:'isValid',
					onChange:[
						function () {
							var m = this;

							// if the form is invalid then we are no longer submitting
							m._isValid == _false
								&& m.set({_isSubmitting:_false});
						},
						_checkWarningShown,
						_updateSummaryStateProperties
					],
					value:_false
				},
				_method:{
					name:'method',
					onChange:_updateFormAttributes
				},
				_numWarningsShown:{
					name: 'numWarningsShown',
					value: 0
				},
				_okToSubmit:{ // readonly
					name:'okToSubmit',
					onChange:function () {
						var m = this;

						if (m._okToSubmit && m._useNormalSubmit) {
							var _formNode = m.getNode('form');

							_formNode && _formNode.submit();
						}
					},
					value:_false
				},
				_scrollToWarnings:{
					name:'scrollToWarnings',
					value:_true
				},
				_target:{
					name:'target',
					onChange:_updateFormAttributes
				},
				_tentativeValue:{	// readonly
					name:'tentativeValue',
					conformer:function(_tentativeValue) {
						return _identical(_tentativeValue, this._tentativeValue) ? this._tentativeValue : _tentativeValue;
					},
					value:_null
				},
				_useNormalSubmit:{
					name:'useNormalSubmit',
					value:_true
				},
				_validateWhen:{
					name:'validateWhen',
					value:_valueChanged	// valid values: 'never', 'tentativeValueChanged', 'valueChanged' & 'finished'
				},
				_value:{
					name:'value',
					conformer:function(_value) {
						return _identical(_value, this._value) ? this._value : _value;
					},
					onChange:function () {
						var m = this;

						m.set({_tentativeValue:_Uize.clone(m._value)});

						if (m._elements) {
							var
								_elements = m._elements.children,
								_value = m._value || {}
							;

							for (var _fieldName in _value) {
								var _element = _elements[_fieldName];

								_element	// can we assume field name and widget name are the same?
									&& _element.set({value:_value[_fieldName]});
							}

							m.set({
								_isSubmitting:_false,
								_isFinished:_false,
								_isEmpty:m.checkIsEmpty()
							});

							m._validateWhen == _valueChanged
								&& m._validate();
						}
					}
				},
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
					onChange:_checkWarningShown,
					value:_false
				},
				_warningShown:{
					name:'warningShown',
					onChange:[
						function () {
							var m = this;

							m._forEachElement( function(_element) { _element.checkWarningShown() } );
						},
						_updateUiWarning
					],
					value:_false
				},
				_warningShownWhen:{
					name:'warningShownWhen',
					onChange:_checkWarningShown,
					value:_validatedAfterFirstFinish	// valid values: 'validated', 'finished', validatedAfterFirstFinish'
				},

				/*** Private properties used for managing internal state w/ onChange functionality ***/
					_finishedAtLeastOnce:{
						onChange:_checkWarningShown,
						value:_false
					}
			},

			eventBindings:{
				committer:{
					'Changed.committedValues':_updateValue,
					'Changed.uncommittedValues':_updateValue,
					'Changed.allValid':_validate
				},
				'submit:Click':function () { this._submit() }
			}
		});
	}
});
