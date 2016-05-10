/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class.mChildObjectEventBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 6
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Class.mChildObjectEventBindings= mixin implements features to provide a declarative approach to wiring Uize events on instances and their child objects (such as widget and child widget events), as well as other types of events on other types of objects (such as DOM events on DOM nodes for widgets).

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Class.mChildObjectEventBindings',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,

				_forEach = _Uize.forEach,
				_returnTrue = _Uize.returnTrue,
				_isFunction = _Uize.isFunction,
				_isPlainObject = _Uize.isPlainObject,
				_pairUp = _Uize.pairUp
		;

		return function (_class) {
			_class.declare ({
				staticMethods:{
					childObjectEventBindings:function(_properties) {
						var
							_eventBindingsFunctionName = _properties.declaration,
							_childObjectsInstancePropertyName = _properties.instanceProperty,
							_addedChildObjectsPropertyName = _properties.addedInstanceProperty,
							_eventBindingsTypesInfo = _Uize.copyInto(
								{'':{namePrefix:''}},
								_properties.additionalTypes
							),
							_eventBindingsStaticDataName = 'mChildObjectEventBindings_' + _eventBindingsFunctionName
						;

						this.declare({
							staticProperties:_pairUp(_eventBindingsStaticDataName, {}),

							staticMethods:_pairUp(
								_eventBindingsFunctionName,
								function(_bindings) {
									var
										mClass = this,
										_eventBindings = mClass[_eventBindingsStaticDataName]
									;

									_forEach(
										_eventBindingsTypesInfo,
										function(_eventBindingsTypeInfo, _objectType) {
											var
												_eventBindingTypeNamePrefix = _eventBindingsTypeInfo.namePrefix,
												_isRegularObjectEventBindings = _eventBindingTypeNamePrefix === '', // NOTE: "regular" event bindings are those on the instance and/or its child objects


												_eventBindingsForType = _eventBindings[_objectType] = _eventBindings[_objectType] || {}
											;

											_forEach(
												_bindings,
												function(_eventBindingValue, _eventBindingKey) {
													var
														_eventBindingKeyTokens = _eventBindingKey.split(':'), // NOTE: instance events with colons won't work as a result
														_sourceName = _eventBindingKeyTokens[0],
														_sourceNameStartsWithPrefix = !_sourceName.indexOf(_eventBindingTypeNamePrefix)
													;

													if (_sourceNameStartsWithPrefix) {
														var
															_addBinding = function(_binding, _eventName) {
																if (!_sourceName && _isRegularObjectEventBindings && _isFunction(_binding) && !_eventName.indexOf('Changed.')) {
																	var _propertyName = _eventName.slice(8);
																	// For optimization purposes, we want to add a self instance Changed.* handler for the onChange property
																	// of the property name
																	mClass.stateProperties(
																		_pairUp(
																			_propertyName,
																			{
																				name:_propertyName,
																				onChange:function() {
																					var m = this;
																					_binding.call(
																						m,
																						{
																							name:_eventName,
																							source:m,
																							newValue:m.get(_propertyName)
																						},
																						m
																					);
																				}
																			}
																		)
																	);
																}
																else
																	// push binding info to an array instead of adding to an object (with event name as key) so that subclasses can also wire
																	// up the same event for the same child without overriding
																	(_eventBindingsForType[_sourceName] || (_eventBindingsForType[_sourceName] = [])).push([_eventName, _isPlainObject(_binding) ? _binding : {handler:_binding}])
																;
															}
														;

														_sourceName = _sourceName.substr(_eventBindingTypeNamePrefix.length);

														_eventBindingKeyTokens.length > 1 // short-hand syntax where the 2nd token is the event
															? _addBinding(_eventBindingValue, _eventBindingKeyTokens[1])
															: _forEach(_eventBindingValue, _addBinding)
														;
													}
												}
											);
										}
									);
								}
							),

							alphastructor:function () {
								var
									m = this,
									mClass = m.Class,
									_eventBindings = mClass[_eventBindingsStaticDataName],
									_addedChildObjects = m[_addedChildObjectsPropertyName],
									_childObjects = m[_childObjectsInstancePropertyName],
									_wiredRegularObjectEvents = {} // keep track of wired "regular" events so we can remove them if the child objects get removed
								;

								function _wrapBinding(_context, _binding, _source, _defaultFireIf) {
									return function(_event) {
										// ensure that the required child objects have been added before calling the handler
										// or that the fireIf condition has been met
										(!_binding.required || _addedChildObjects.isMet(_binding.required))
											&& m.isMet(_binding.fireIf || _defaultFireIf)
											&& _binding.handler.call(_context, _event, _source)
										;
									};
								}

								/* NOTE: format of bindings
									{
										[namePrefix]:{
											sourceName:[
												[
													eventName,
													{
														handler:function() { },
														required:'',
														fireIf:''
													}
												]
											]
										}
									}
								*/

								_forEach(
									_eventBindings,
									function(_typeBindings, _objectType) {
										var
											_typeInfo = _eventBindingsTypesInfo[_objectType],
											_namePrefix = _typeInfo.namePrefix,
											_wireWhenever = _typeInfo.wireWhenever,

											_isRegularObjectEventBindings = _namePrefix === '',

											_wireBindings = function() {
												if (_isRegularObjectEventBindings) { // wire up "regular" objects like the instance or child objects
													_forEach(
														_typeBindings,
														function(_bindings, _objectName) {
															function _wire(_object) {
																for (
																	var
																		_bindingNo = -1,
																		_bindingsLength = _bindings.length
																	;
																	++_bindingNo < _bindingsLength;
																) {
																	var
																		_bindingInfo = _bindings[_bindingNo],
																		_eventToWire = _pairUp(_bindingInfo[0], _wrapBinding(m, _bindingInfo[1], _object, _returnTrue))
																	;

																	_object.wire(_eventToWire);

																	// store a reference to the wired event for later unwiring
																	(_wiredRegularObjectEvents[_objectName] || (_wiredRegularObjectEvents[_objectName] = [])).push(_eventToWire);
																}
															}

															if (_objectName) {
																var _childObject;
																_addedChildObjects.wire( // adding or removing child objects
																	'Changed.' + _objectName,
																	function() {
																		if (_addedChildObjects.isMet(_objectName))
																			_wire(_childObject = _childObjects[_objectName]);
																		else {
																			// unwire all the events this instance wired so that we don't have a removed child object still potentially
																			// firing events
																			for (var _wiredEventForInstance = _wiredRegularObjectEvents[_objectName], _eventNo = -1; ++_eventNo < _wiredEventForInstance.length;)
																				_childObject.unwire(_wiredEventForInstance[_eventNo]);

																			// delete our cache of the wired event so things don't get mixed up when if we
																			// add back a child w/ the same name
																			delete _wiredRegularObjectEvents[_objectName];

																			// clear out our reference to the removed child object to not potentially hang on memory that can be disposed
																			_childObject = undefined;
																		}
																	}
																);
															}
															else _wire(m); // '' is self
														}
													);
												}
												else { // wire up non-"regular" objects like DOM nodes
													var
														_getObjectMethodName = _typeInfo.getObjectMethod,
														_wireObjectMethodName = _typeInfo.wireObjectMethod,
														_defaultFireIf = _typeInfo.defaultFireIf
													;

													for (var _objectName in _typeBindings) {
														for (
															var
																_bindings = _typeBindings[_objectName],
																_object = m[_getObjectMethodName](_objectName),
																_bindingNo = -1,
																_bindingsLength = _bindings.length
															;
															++_bindingNo < _bindingsLength;
														) {
															var _bindingInfo = _bindings[_bindingNo];
															m[_wireObjectMethodName](_object, _bindingInfo[0], _wrapBinding(m, _bindingInfo[1], _object, _defaultFireIf));
														}
													}
												}
											}
										;

										_wireWhenever
											? m.whenever(_wireWhenever, _wireBindings)
											: _wireBindings()
										;
									}
								);
							}
						});
						/*?
							Static Methods
								Uize.Class.mChildObjectEventBindings.childObjectEventBindings
									Lets you conveniently declare the type of event bindings to declare on the class.

									SYNTAX
									.........................................
									MyClass.childObjectEventBindings (childObjectEventBindingsPropertiesOBJ);
									.........................................

									The sole =childObjectEventBindingsPropertiesOBJ= parameter supports the following properties...

									- =declaration= - the name of the actual child object event bindings declaration =function= to create (such as ='eventBindings'= for =Uize.Widget.mEventBindings=)
									- =instanceProperty= - the name of the instance property that contains the references to the child objects (such as ='children'= for =Uize.Widget.mEventBindings=)
									- =addedInstanceProperty= - the name of the =Uize.Class= instance property that contains state about which child objects have been added (such as ='addedChildren' for =Uize.Widget.mEventBindings=)
									- =additionalTypes= - an =object= of additional type name =string=s to type definition =object=s

									Each =object= in =additionalTypes= supports the following properties...
									- =namePrefix= - a =string= representing the prefix indicating that a source object name is of the given type (such as ='#'= for node events for =Uize.Widget.mEventBindings=)
									- =wireWhenever= - a condition =string=, =array= or =function= indicating when to wire up the event bindings (such as ='wired'= for node events for =Uize.Widget.mEventBindings=). Default value is =undefined=, meaning the events will be wired immediately upon construction of the instance.
									- =getObjectMethod= - the name of he instance method that returns the object given the object's name (such as ='getNode'= for nodes for =Uize.Widget.mEventBindings=)
									- =wireObjectMethod= - the name of the instance method that wires the object, given an event name and handler =function= (such as ='wireNode'= for nodes for =Uize.Widget.mEventingBindings=)
									- =defaultFireIf= - a default condition =string=, =array= or =function= indicating under what conditions the instance must be in order to call an event handler if an explicit condition is unspecified in the event bindings (such as ='enabledInherited,!busyInherited'= for nodes for =Uize.Widget.mEventBindings=)

									NOTES
									- An assumption is made that for non-"regular" types (i.e. those that specify =namePrefix=) that if the object is removed from the instance unwiring will happen automatically or will otherwise be taken care of (such as when nodes are removed from a widget, they are also unwired)
						*/
					}
				}
			});
		};
	}
});
