/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Form Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Form= widget provides functionality for managing form elements and handling validation

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Form',
	required:[
		'Uize.Widget.FormElements',
		'Uize.Widget.FormElement',
		'Uize.Widget.Committer',
		'Uize.Widget.FormWarnings',
		'Uize.Widget.Button',
		'Uize.Node',
		'Uize.Node.Event',
		'Uize.Data'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_undefined,

				_Uize = Uize,
				_Uize_Widget = _Uize.Widget,

				/*** validation/warning variables ***/
					_never = 'never',
					_valueChanged = 'valueChanged',
					_validated = 'validated',
					_finished = 'finished',
					_validatedAfterFirstFinish = 'validatedAfterFirstFinish'
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function() {
						// this is just a dummy private variable so that when we are examining
						// child widgets, we'll know we're dealing with a form widget (or subclass)
						// and not a form element widget
						this.isForm = this._isForm = _true;
					},
					function() {
						var
							_this = this,
							_committer = _this.addChild(
								'committer',
								_Uize_Widget.Committer,
								{
									watchedProperties:{},
									ignoreDisabled:_true
								}
							),
							_formWarnings = _this.addChild('formWarnings', _Uize_Widget.FormWarnings, {watchedElements:[]}),
							_elements = _this.addChild('elements', _Uize_Widget.FormElements)
						;

						// Save private instance references
						_this._elements = _elements;
						_this._committer = _committer;
						_this._formWarnings = _formWarnings;

						// Wire form elements container
							_elements.wire(
								'Element Added',
								function(_event) {
									var _childElement = _event.element;

									_childElement.wire({
										'Changed.isDirtyInherited':function() {
											_childElement.get('isDirtyInherited')
												&& _this.set({_isDirty:_true})
										},
										Ok:function() { _this._submit() },
										'Changed.focused':function() {
											// NOTE: so unfortunately the browsers support an autofill feature that
											// will prepopulate fields, but it doesn't fire onChange events for
											// each field.  So when we blur a text field, we ensure that all of the
											// programmatic values for fields match the DOM values
											if (!_childElement.get('focused'))
												_this._foreachElement(
													function(_element, _elementName, _elementIsForm) {
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
												_this.set({_isSubmitting:_false});
										},
										'Changed.tentativeValue':function() {
											_this.set({
												_isSubmitting:_false,

												// NOTE: in order to support async validation, we could no longer set isSubmitting to false
												// if isValid was false, which means that there was nothing setting isSubmitting to false after
												// clicking the submit. This means that you could run into a case where you submit and invalid form,
												// get the warnings, fix the values and the form auto-submits.
												_tentativeValue:_Uize.copyInto(
													{},
													_this._tentativeValue,
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
											function() {
												_childElement.get('isSubmitting')
													&& _this._submit()
											}
										);
									}

									_formWarnings.addWatchedElements(_childElement);

									_committer.addWatchedProperties([{
										alias:_childElement.get('name'),
										instance:_childElement,
										name:'value'
									}]);
								}
							);

						// Wire committer
							function _updateValue() { _this._updateValue() }

							_committer.wire({
								'Changed.committedValues':_updateValue,
								'Changed.uncommittedValues':_updateValue,
								'Changed.allValid':function() { _this._validate() }/*,
								'Changed.anyNotCommitted':function() {
									_committer.get('anyNotCommitted')
										|| _this.set({_isFinished:_true})
								}*/
							});

						Uize.Widget.Button.addChildButton.call(
							_this,
							'submit',
							function() { _this._submit() }
						);

						_this._isInitialized = _true;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildElement = function(_elementName, _elementClass, _elementProperties) {
				return this._elements.addChild(_elementName, _elementClass, _elementProperties)
			};

			_classPrototype._foreachElement = function(_function) {
				if (this._elements) {
					var _elements = this._elements.children;

					for (var _elementName in _elements) {
						var _element = _elements[_elementName];

						_function(_element, _element.get('name'), _element.isForm);
					}
				}
			};

			// Note: duplicated from Uize.Widget.FormElement.  mix-in?
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

			_classPrototype._restore = function(_committerMethod) {
				var _this = this;

				_this.set({
					_finishedAtLeastOnce:_false,
					_isSubmitting:_false,
					_isDirty:'inherit'
				});

				_this._foreachElement( function(_element) { _element.restore() } );
				_this._committer[_committerMethod]();
			};

			_classPrototype._updateSummaryStateProperties = function() {
				var _this = this;

				_this.set({_okToSubmit:_this._isSubmitting && _this._isValid});
			};

			_classPrototype._updateFormAttributes = function() {
				var _this = this;

				if (_this.isWired) {
					_this.setNodeProperties(
						'form',
						{
							action:_this._action,
							enctype:_this._enctype,
							method:_this._method,
							target:_this._target
						}
					);
				}
			};

			_classPrototype._updateValue = function() {
				var
					_this = this,
					_committer = _this._committer
				;

				// NOTE: until there's a way to cause changing the contents of an object to fire
				// onChange, we'll just have to create a new object
				_this.set({
					_value:Uize.copyInto(
						{},
						_this._value,
						_committer.get('committedValues'),
						_committer.get('uncommittedValues')
					)
				});
			};

			_classPrototype._updateUiWarning = function() {
				var
					_this = this,
					_formWarnings = _this._formWarnings,
					_warningShown = _this._warningShown
				;

				if (_this.isWired) {
					if (_formWarnings) {
						_formWarnings.set({shown:_warningShown});

						if (_warningShown && _this.isWired) {
						// hide any server warnings if we're showing the client-side warnings
							_this.displayNode('serverWarnings', _false);
							
							if (_this._scrollToWarnings) {
								var _formWarningsRootNode = _formWarnings.getNode();
								
								_formWarningsRootNode
									&& Uize.module({
										required:'Uize.Fx',
										builder:function() { Uize.Fx.scrollToNode(_formWarningsRootNode) }
									})
								;
							}
						}
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.addForm = function(_formName, _formClass, _formProperties) {
				return this._addChildElement(_formName, _formClass || _Uize_Widget.Form, _formProperties)
			};

			_classPrototype.addFormElement = function(_formElementName, _formElementClass, _formElementProperties) {
				return this._addChildElement(_formElementName, _formElementClass || _Uize_Widget.FormElement, _formElementProperties)
			};

			// NOTE: can be overidden by subclasses
			_classPrototype.checkIsEmpty = function() {
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
			};

			// Note: duplicated from Uize.Widget.FormElement.  mix-in?
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

			_classPrototype.clear = function() { this._restore('clearAll') };

			_classPrototype.getFormElement = function(_elementName) {
				var _formElement;
				
				if (this._elements) {
					var _elementsLookup = this._elements.children;
					
					_formElement = _elementName == _undefined
						? _Uize.values(_elementsLookup)
						: _elementsLookup[_elementName]
					;
				}
				
				return _formElement;
			};
			
			_classPrototype.removeFormElement = function(_elementName) {
				var
					_this = this,
					_formElement = _this.getFormElement(_elementName)
				;
				
				if (_formElement) {
					_formElement.removeUi();
					_this._elements.removeChild(_formElement);
				}
			};

			_classPrototype.reset = _classPrototype.restore = function() { this._restore('restoreInitial') };

			_classPrototype.submit = _classPrototype._submit = function() {
				this.set({
					_isDirty:_true,
					_isFinished:_true,
					_isSubmitting:!this._okToSubmit
				})
			};

			_classPrototype.updateUi = function () {
				var _this = this;

				if (_this.isWired) {
					_this._updateFormAttributes();
					_this._updateUiWarning();
					_this._foreachElement(  function(_element) { _element.updateUi()} );

					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.validate = _classPrototype._validate = function() {
				this.set({_isValid:this._committer.get('allValid')})
			};

			_classPrototype.wireUi = function () {
				var _this = this;

				if (!_this.isWired) {
					var _formNode = _this.getNode('form');

					/*** Initialize get-set properties to be form attributes if not specified ***/
						if (_formNode) {
							function _hasNoValue(_propertyValue) {
								return _propertyValue == _null;
							}

							if (_hasNoValue(_this._action)) _this._action = _formNode.action;
							if (_hasNoValue(_this._enctype)) _this._enctype = _formNode.enctype;
							if (_hasNoValue(_this._method)) _this._method = _formNode.method;
							if (_hasNoValue(_this._target)) _this._target = _formNode.target;

							_this.wireNode(
								_formNode,
								'submit',
								function (_event) {
									Uize.Node.Event.abort(_event);
									// NOTE: this will fire before any events on the form elements
									// sync their values
									_this._submit();
								}
							);
						}

					_superclass.prototype.wireUi.call (_this);

					_this._updateValue();
					_this._validate();
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_action:{
					name:'action',
					onChange:_classPrototype._updateFormAttributes
				},
				_enctype:{
					name:'enctype',
					onChange:_classPrototype._updateFormAttributes
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
					onChange:[
						function() {
							var _this = this;

							if (_this._isFinished) {
								_this._validateWhen == _finished
									&& _this._validate();
								!_this._finishedAtLeastOnce && _this._isInitialized
									&& _this.set({_finishedAtLeastOnce:_true});
							}
							else
								_this.set({_finishedAtLeastOnce:_false})
							;
						},
						_classPrototype._checkWarningShown
					],
					value:_true
				},
				_isSubmitting:{
					name:'isSubmitting',
					onChange:[
						function() {
							var _this = this;

							_this._isSubmitting
								&& _this._committer
								&& _this._committer.commit()
							;
						},
						_classPrototype._checkWarningShown,
						_classPrototype._updateSummaryStateProperties
					],
					value:_false
				},
				_isValid:{
					name:'isValid',
					onChange:[
						function() {
							var _this = this;

							// if the form is invalid then we are no longer submitting
							_this._isValid == _false
								&& _this.set({_isSubmitting:_false});
						},
						_classPrototype._checkWarningShown,
						_classPrototype._updateSummaryStateProperties
					],
					value:_false
				},
				_method:{
					name:'method',
					onChange:_classPrototype._updateFormAttributes
				},
				_okToSubmit:{ // readonly
					name:'okToSubmit',
					onChange:function() {
						var _this = this;

						if (_this._okToSubmit && _this._useNormalSubmit) {
							var _formNode = _this.getNode('form');

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
					onChange:_classPrototype._updateFormAttributes
				},
				_tentativeValue:{	// readonly
					name:'tentativeValue',
					conformer:function(_tentativeValue) {
						return _Uize.Data.identical(_tentativeValue, this._tentativeValue) ? this._tentativeValue : _tentativeValue
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
						return _Uize.Data.identical(_value, this._value) ? this._value : _value
					},
					onChange:function() {
						var _this = this;
						
						_this.set({_tentativeValue:_Uize.clone(_this._value)});
						
						if (_this._elements) {
							var
								_elements = _this._elements.children,
								_value = _this._value || {}
							;
	
							for (var _fieldName in _value) {
								var _element = _elements[_fieldName];
	
								_element	// can we assume field name and widget name are the same?
									&& _element.set({value:_value[_fieldName]});
							}
	
							_this.set({
								_isSubmitting:_false,
								_isFinished:_false,
								_isEmpty:_this.checkIsEmpty()
							});
	
							_this._validateWhen == _valueChanged
								&& _this._validate();
						}
					}
				},
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
				_warningShown:{
					name:'warningShown',
					onChange:[
						function() {
							var _this = this;
	
							_this._foreachElement( function(_element) { _element.checkWarningShown() } );
						},
						_classPrototype._updateUiWarning
					],
					value:_false
				},
				_warningShownWhen:{
					name:'warningShownWhen',
					onChange:_classPrototype._checkWarningShown,
					value:_validatedAfterFirstFinish	// valid values: 'validated', 'finished', validatedAfterFirstFinish'
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
