/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Options= class manages state for a group of option buttons, with support for dynamically rebuilding the UI when the values set changes.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`, `Ben Ilegbodu`, original code donated by `Zazzle Inc.`

		###
			- for value and values, discuss specific requirements for when the values are objects
			- document child widgets
			- document implied nodes
*/

Uize.module ({
	name:'Uize.Widget.Options',
	required:'Uize.Widget.Button',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_null = null,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						/*** Private Instance Properties ***/
							this._lastValueNo = -1;
							this._totalOptionChildButtons = 0;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiOptionSelected = function() {
				var _this = this;
				if (_this.isWired && _this._valueNo != _this._lastValueNo) {
					function _setOptionSelected (_optionNo,_selected) {
						_optionNo >= 0 &&
							Uize.callOn (_this.children ['option' + _optionNo],'set',[{selected:_selected}])
						;
					}
					_setOptionSelected (_this._lastValueNo,_false);
					_setOptionSelected (_this._lastValueNo = _this._valueNo,true);
				}
			};

			_classPrototype._updateValueNo = function () {
				var _this = this;
				_this.set ({_valueNo:_this.getValueNoFromValue (_this._value)});
				_this._updateUiOptionSelected ();
			};

		/*** Public Instance Methods ***/
			_classPrototype.forAll = function (_function) {
				for (
					var _valueNo = -1, _valuesLength = this._values.length, _children = this.children;
					++_valueNo < _valuesLength;
				)
					if (_function (_children ['option' + _valueNo],_valueNo) === _false) break;
				;
				/*?
					Instance Methods
						forAll
							An iterator method that is provided as a convenience and that lets you iterate over all the option buttons for the instance.

							SYNTAX
							..................................
							myInstance.forAll (iterationFUNC);
							..................................

							The function specified in the =iterationFUNC= parameter will be called on each iteration and can expect to receive two parameters for the current iteration: an object reference to the option button widget, and an integer representing the index of the option. The function does not need to return any value. However, if the function wishes to terminate the iteration, it can return the boolean value =false=.

							EXAMPLE
							.....................................................................
							myOptionsWidget.forAll (
								function (optionButton,optionNo) {
									optionButton.set ({enabled: optionNo % 2 ? 'inherit' : false});
								}
							);
							.....................................................................

							In the above example, the =forAll= instance method is being used to iterate over all the option buttons in order to disable every second option button - not a terribly practical example, but it illustrates the usage.
				*/
			};

			_classPrototype.getValueNoFromValue = function (_value) {
				var _values = this._values;
				return (
					_values.length
						? (
							typeof _values [0] == 'object'
								? Uize.findRecordNo (_values,{name:_value})
								: Uize.indexIn (_values,_value,_false,_false)
						)
						: -1
				);
				/*?
					Instance Methods
						getValueNoFromValue
							Returns an integer, representing the index of the specified value in the =values= set. If the specified value is not one of the values in the =values= set, then this method returns =-1=.

							SYNTAX
							...........................................................
							valueNoINT = myInstance.getValueNoFromValue (valueANYTYPE);
							...........................................................
				*/
			};

			_classPrototype.getOptionProperties = function(_valueNo, _valueObject) {
				return _null
			};
				/*?
					Instance Methods
						getOptionProperties
							A hook method for subclasses to provide additional state properties to add to the general =optionWidgetProperties= for a specific child option button widget. The base implementation returns =null=.

							SYNTAX
							...................................................................................
							optionPropertiesOBJ = myInstance.getOptionProperties (valueNoINT, valueObjectOBJ);
							...................................................................................

							=valueNoINT= contains the child widget button index. =valueObjectOBJ= is the object in the =values= state property at index =valueNoINT=.

							This hook method is useful when a =Uize.Widget.Options= subclass wants specific data from each value object within the =values= state property passed to the option button child widget when it is created. This data is added to the =optionWidgetProperties= which are common accross all option buton child widgets.

							EXAMPLE
							...........................................................................................
							_class.prototype.getOptionProperties = function(valueNo, valueObject) {
								return Uize.copyInto(
									_superclass.prototype.getOptionProperties.call (this, valueNo, valueObject) || {},
									{
										value:valueObject.name,
										valueDetails:valueObject.valueDetails
									}
								);
							};
							...........................................................................................

							In the above example, the =getOptionProperties= hook method was overridden in a subclass to add =value= and =valueDetails= properties to the state properties that will be set on the option button child widget. These values are retrieved from the =valueObjectOBJ=.
				*/

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiOptionSelected();
					_superclass.prototype.updateUi.call(_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._valueNo = -1;
					var
						_optionWidgetClass = _this._optionWidgetClass || Uize.Widget.Button,
						_optionWidgetProperties = _this._optionWidgetProperties,
						_values = _this._values,
						_valuesLength = _this._totalOptionChildButtons = _values.length,
						_restoreValueTimeout, _tentativeValueTimeout
					;
					function _restoreValue () {
						_restoreValueTimeout = _null;
						_this.set ({
							_tentativeValue:_this._value,
							_tentativeValueNo:_this._valueNo
						});
					}
					function _clearTentativeValueTimeouts () {
						_restoreValueTimeout && clearTimeout (_restoreValueTimeout);
						_tentativeValueTimeout && clearTimeout (_tentativeValueTimeout);
					}
					Uize.forEach (
						_values,
						function _setupOption (_valueObject,_valueNo) {
							var _value =
								((typeof _valueObject == 'object' && _valueObject) || (_valueObject = {name:_valueObject})).name
							;
							function _setValue () {
								_this.set (
									_this._setValueOnMouseover
										? {_value:_value}
										: {_tentativeValue:_value,_tentativeValueNo:_valueNo}
								);
							}
							_this.addChild (
								'option' + _valueNo,
								_optionWidgetClass,
								Uize.copyInto (
									{},
									_optionWidgetProperties,
									_this.getOptionProperties(_valueNo, _valueObject)
								)
							)
								.wire (
									'*',
									function (_event) {
										if (_event.name == 'Click') {
											_this.fire ({name:'Before Value Change',value:_value,valueNo:_valueNo}).cancel ||
												_this.set ({_value:_value})
												/*?
													Instance Events
														Before Value Change
															This event fires just as an option button is clicked, but before the =value= state property for the instance is updated.

															This event offers the handler the opportunity to cancel the value change. The event contains a "value" property (which is the new value that would be set) and a "valueNo" property (which is the index of the new value that would be set). To cancel the set action, the handler can set the event object's "cancel" property to =true=. The handler can inspect the "value" and "valueNo" properties of the event to determine if the value change should be permitted.
												*/
											;
											_this.fire (_event);
										} else if (_event.name == 'Over') {
											_clearTentativeValueTimeouts ();
											_this._tentativeRestTime
												? (_tentativeValueTimeout = setTimeout (_setValue,_this._tentativeRestTime))
												: _setValue ()
											;
										} else if (_event.name == 'Out') {
											_clearTentativeValueTimeouts ();
											_restoreValueTimeout = setTimeout (_restoreValue,250);
										}
										_this.fire ({
											name:'Option Event',
											value:_value,
											childEvent:_event
											/*?
												Instance Events
													Option Event
														Fires each time an event fires for one of the option button child widgets.

														When this event fires, the event object will have a "value" property whose value corresponds to the value associated with the option, as well as a "childEvent" property that carries the event object associated with the option button event.
											*/
										});
									}
								)
							;
						}
					);

					/*** seed root node references for buttons, if possible (performance optimization) ***/
						/* NOTE:
							This is a performance optimization that relies on the fact that in many typical cases, the HTML for the option buttons will be child nodes of the root node. In such cases, iterating through and seeding the root node references for all the option buttons is more efficient than leaving it up to the button widgets to get their root node by id - especially for large options sets.
						*/
						if (_valuesLength) {
							var _optionsNode = _this.getNode ();
							if (_optionsNode) {
								for (
									var
										_childNodeNo = -1,
										_childNode,
										_childNodeId,
										_child,
										_childNodes = _optionsNode.childNodes || [],
										_childNodesLength = _childNodes.length,
										_children = _this.children,
										_idPrefix = _this.get ('idPrefix'),
										_idPrefixLength = _idPrefix.length
									;
									++_childNodeNo < _childNodesLength;
								) {
									if (
										(_childNodeId = (_childNode = _childNodes [_childNodeNo]).id) &&
										!_childNodeId.indexOf (_idPrefix) &&
										(_child = _children [_childNodeId.slice (_idPrefixLength + 1)])
									)
										_child.set ({nodeMap:{'':_childNode,shell:_null,bed:_null}})
									;
								}
							}
						}

					_superclass.prototype.wireUi.call (_this);
					_this._updateValueNo ();
				}
			};

		/*** State Properties ***/
			function _getValidValue(_value) {
				var
					_this = this,
					_values = this._values
				;

				return (
					!_this._ensureValueInValues || !_values || !_values.length || _this.getValueNoFromValue(_value) > -1
						? _value
						: (typeof _values[0] == 'object' ? _values[0].name : _values[0])
				);
			}
			_class.stateProperties ({
				_ensureValueInValues:{
					name:'ensureValueInValues',
					onChange:function() {
						var _this = this;
						_this.set({_value:_getValidValue.call(_this, _this._value)});
					},
					value:_false
					/*?
						State Properties
							ensureValueInValues
								A boolean, indicating whether or not the value of the =value= state property should be one of the values within the =values= state property.

								When this property is set to =true=, the =value= state property will be enforced to be within the =values= state property. If the =value= state property is set with a value not within the =values= state property, the first value within the =values= state property will be chosen. When this is property is set to =false=, the value is no longer restricted to be one of the values within the =values= state property.

								NOTES
								- the initial value is =false=
					*/
				},
				_optionWidgetClass:'optionWidgetClass',
					/*?
						State Properties
							optionWidgetClass
								An object reference to a widget class that should be used for the option buttons.

								By default, the =Uize.Widget.Button= class is used for the option buttons. However, in some cases you may wish to use a class with richer functionality for the option buttons. You can create such a class by subclassing the =Uize.Widget.Button= class. If the widget class to be used for the option buttons is *not* a subclass of =Uize.Widget.Button=, then it will at least have to provide an equivalent interface in order to work with the =Uize.Widget.Options= class.

								NOTES
								- when this property is set to =null= or left =undefined=, then the =Uize.Widget.Button= class will be used for option buttons
								- see the companion =optionWidgetProperties= state property
								- the initial value is =undefined=
					*/
				_optionWidgetProperties:'optionWidgetProperties',
					/*?
						State Properties
							optionWidgetProperties
								An object, specifying values for state properties that should be used when creating option button child widgets.

								The =optionWidgetProperties= property lets you specify values for state properties that will be common to all option button widgets that are created. This can be useful in cases where you are using the =optionWidgetClass= state property to use a widget class other than =Uize.Widget.Button= for the option buttons, and where that other widget class may provide further configurability through additional state properties beyond what the =Uize.Widget.Button= class provides. In such cases, option button instances that are created for a particular =Uize.Widget.Options= instance can be configured for that instance by specifying state property values through the =optionWidgetProperties= property.

								NOTES
								- see the companion =optionWidgetClass= state property
								- the initial value is =undefined=
					*/
				_setValueOnMouseover:'setValueOnMouseover',
					/*?
						State Properties
							setValueOnMouseover
								A boolean, indicating whether or not the value of the =value= state property should be set when the user rests the mouse over an option, instead of the values of the =tentativeValue= and =tentativeValueNo= state properties.

								When this property is set to =true=, the =value= state property will be set when the user rests the mouse over an option. When this property is set to =false=, =null=, =0=, or left =undefined=, then the values of the =tentativeValue= and =tentativeValueNo= properties will be set.

								When =setValueOnMouseover= is set to =true=, the user will not be required to click in order for a selection to be made. In such a case, if the =tentativeRestTime= property is set to =0=, then the =value= property will be set immediately on mousing over an option. When =tentativeRestTime= is set to a value greater than =0=, then the user will have to rest the mouse on the option for the amount of time specified by the =tentativeRestTime= property before the =value= property is set. Of course, the user can still click immediately after mousing over the option to expedite selection.

							NOTES
							- the initial value is =undefined=
					*/
				_tentativeRestTime:{
					name:'tentativeRestTime',
					value:0
					/*?
						State Properties
							tentativeRestTime
								An integer, representing the time (in milliseconds) that the user must remain moused over an option button before the =tentativeValue= state property will be set to the value corresponding to that button.

								NOTES
								- the special value of =0= indicates that the =tentativeValue= mechanism should be disabled
								- the initial value is =0=
					*/
				},
				_tentativeValue:{
					name:'tentativeValue',
					value:_null
					/*?
						State Properties
							tentativeValue
								A value of any type, that represents the current value that is tentatively being set / considered by the user.

								NOTES
								- the initial value is =null=
								- whenever the =value= state property is set, this property is also set to the same value
								- in "resting" state (ie. when the user is not interacting with the widget), this property will have the same value as the =value= state property
					*/
				},
				_tentativeValueNo:{
					name:'tentativeValueNo',
					value:-1
					/*?
						State Properties
							tentativeValueNo
								An integer, representing the index of the current =tentativeValue= in the =values= set.

								NOTES
								- the initial value is =-1=
								- when no value is selected, this property is set to =-1=
								- this property is read-only
					*/
				},
				_value:{
					name:'value',
					conformer:_getValidValue,
					onChange:function () {
						var _this = this;
						_this._updateValueNo ();
						_this.set ({_tentativeValueNo:_this._valueNo,_tentativeValue:_this._value});
					},
					value:_null
					/*?
						State Properties
							value
								A simple type value (string, boolean, or number), that should either match one of the values in an array of simple type values specified by the =values= state property, or should match the name property of one of the objects in an array of object type values specified by the =values= state property.

								NOTES
								- the initial value is =null=
								- whenever this property is set, the =tentativeValue= state property is set to the same value
					*/
				},
				_valueNo:{
					name:'valueNo',
					value:-1
					/*?
						State Properties
							valueNo
								An integer, representing the index of the current =value= in the =values= set.

								NOTES
								- the initial value is =-1=
								- when no value is selected, this property is set to =-1=
								- this property is read-only
					*/
				},
				_values:{
					name:'values',
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							for (
								var _valueNo = -1, _totalOptionChildButtons = _this._totalOptionChildButtons || 0;
								++_valueNo < _totalOptionChildButtons;
							)
								_this.removeChild ('option' + _valueNo)
							;
							_this.unwireUi ();
							_this.get ('html') != _undefined && _this.set ({built:_false});
							_this.insertOrWireUi ();
						}
					},
					value:[]
					/*?
						State Properties
							values
								An array of simple type values (string, boolean, or number) or objects, representing the value set for the widget.

								EXAMPLE 1
								................................................................
								myOptions.set ({values:['orange','avocadoPear','sweetPotato']});
								................................................................

								In the above example, the =values= for =myOptions= is being set to an array of strings. In order to select the sweet potato value, one would use the statement =myOptions.set ({value:'sweetPotato'})=.

								EXAMPLE 2
								....................................
								myOptions.set ({
									values:[
										{
											name:'orange',
											displayName:'Orange',
											category:'fruit'
										},
										{
											name:'avocadoPear',
											displayName:'Avocado Pear',
											category:'fruit'
										},
										{
											name:'sweetPotato',
											displayName:'Sweet Potato',
											category:'vegetable'
										}
									]
								});
								....................................

								When an array of objects is specified for the =values= state property, each object should contain a =name= property. Then, when setting a value for the =value= state property, the object from the =values= array will be selected whose =name= property matches the value of the =value= state property. In the above example, the =values= for =myOptions= is being set to an array of objects. In order to select the sweet potato value now, one would use the statement =myOptions.set ({value:'sweetPotato'})=.

								NOTES
								- if this property is changed once the widget is already wired, then the widget will be unwired and then wired again
								- the initial value is =[]= (an empty array)
					*/
				}
			});

		return _class;
	}
});

