/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class.mChildObjectBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Class.mChildObjectBindings= mixin implements features to provide a declarative approach to binding the state properties of a class instance to those of its child objects.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Class.mChildObjectBindings',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_forEach = _Uize.forEach,
				_isString = _Uize.isString,
				_isArray = _Uize.isArray,
				_resolveTransformer = _Uize.resolveTransformer,
				_pairUp = _Uize.pairUp,
				_returnTrue = _Uize.returnTrue,

			/*** Variables for Performance Optimzation ***/
				_bindingFormatRegExp = /^\s*([<\->]+)?\s*(\w*?)\s*(\.\s*(.+?))?\s*(\:\s*(.+?))?\s*$/
		;

		function _getSourceValue(_sourceObject, _sourceProperty, _destinationObject, _valueTransformer) {
			var _sourceValue = _sourceObject.get(_sourceProperty);
			return _valueTransformer
				? _valueTransformer(_sourceValue, _sourceObject, _destinationObject) // passing _sourceObject & _destinationObject so function transformers can have the references in case they are needed
				: _sourceValue
			;
		}

		function _syncObjects(_sourceObject, _sourceProperty, _destinationObject, _destinationProperty, _valueTransformer, _whenCondition) {
			if (this.isMet(_whenCondition)) {
				var _sourceValue = _getSourceValue(_sourceObject, _sourceProperty, _destinationObject, _valueTransformer);

				_sourceValue != _destinationObject.get(_destinationProperty)
					&& _destinationObject.set(_destinationProperty, _sourceValue)
				;
			}
		}

		return function (_class) {
			_class.declare ({
				staticMethods:{
					childObjectBindings:function(_properties) {
						var
							_bindingsFunctionName = _properties.declaration,
							_childObjectsInstancePropertyName = _properties.instanceProperty,
							_addedChildObjectsPropertyName = _properties.addedInstanceProperty,
							_childObjectsStatePropertyName = _properties.stateProperty,

							_bindingWiringsStaticDataName = 'mChildObjectBindings_' + _bindingsFunctionName + '_wirings',
							_childObjectsToChildStaticDataName = 'mChildObjectBindings_' + _bindingsFunctionName + '_toChild'
						;

						function _getChildObjectsToSet(m, _includePropertyFunc) {
							var
								_toChildInfo = m.Class[_childObjectsToChildStaticDataName],
								_childObjects = m[_childObjectsInstancePropertyName],
								_childObjectsToSet = {}
							;

							for (var _childName in _toChildInfo) {
								var
									_toChildInfoForChild = _toChildInfo[_childName],
									_childObjectToSet = _childObjectsToSet[_childName] = _childObjectsToSet[_childName] || {}
								;

								for (var _childPropertyName in _toChildInfoForChild) {
									var _toChildInfoForChildProperty = _toChildInfoForChild[_childPropertyName];

									for (var _instancePropertyName in _toChildInfoForChildProperty) {
										var _info = _toChildInfoForChildProperty[_instancePropertyName];

										if (_includePropertyFunc(_instancePropertyName, _info) && m.isMet(_info._whenCondition)) {
											var
												_child = _childName ? _childObjects[_childName] : m,
												_instancePropertyValue = _getSourceValue(
													m,
													_instancePropertyName,
													_child,
													_info._valueTransformerAtoB
												)
											;

											// An optimization to not include the property value if it actually won't
											// cause a change
											if (!_child || _instancePropertyValue != _child.get(_childPropertyName))
												_childObjectToSet[_childPropertyName] = _instancePropertyValue;
										}
									}
								}
							}

							return _childObjectsToSet;
						}

						this.declare({
							staticProperties:_pairUp(
								_bindingWiringsStaticDataName, {},
								_childObjectsToChildStaticDataName, {}
							),

							staticMethods:_pairUp(
								_bindingsFunctionName,
								function(_bindings) {
									var
										mClass = this,
										_bindingWirings = mClass[_bindingWiringsStaticDataName],
										_toChildInfo = mClass[_childObjectsToChildStaticDataName],
										_sharedPropertiesOnChangedHandlerLookup = {},

										_sharedPropertiesOnChangeHandler = function(_changedState) {
											var
												m = this,
												_childObjects = m[_childObjectsInstancePropertyName],

												_changedProperties = _Uize.lookup(_Uize.keys(_changedState)),
												_childObjectsToSet = _getChildObjectsToSet(
													m,
													// make sure property is in the list of changed properties
													function(_instancePropertyName) { return _instancePropertyName in _changedProperties }
												)
											;

											for (var _childName in _childObjectsToSet) {
												var
													_childObject = _childName ? _childObjects[_childName] : m,
													_childStateToSet = _childObjectsToSet[_childName]
												;

												_childObject
													&& !_Uize.isEmpty(_childStateToSet)
													&& _childObject.set(_childStateToSet)
												;
											}
										}
									;

									_forEach(
										_bindings,
										function(_bindingForProperty, _propertyName) {
											function _processBinding(_binding) {
												var _formatMatch = _isString(_binding) && _binding.match(_bindingFormatRegExp);
												if (_formatMatch) // canonicalize string
													_binding = {
														child:_formatMatch[2],
														property:_formatMatch[4],
														direction:_formatMatch[1],
														when:_formatMatch[6]
													}
												;

												var
													_childName = _binding.child || '',
													_childPropertyName = _binding.property || _propertyName

												;

												if (_childName || (_propertyName != _childPropertyName)) { // no point binding the same property to itself for an instance (!childName)
													var
														_direction = _binding.direction || '<->', // bi-directional is the default
														_directionLength = _direction.length,
														_valueAdapter = _binding.valueAdapter,
														_valueTransformerAtoB = _valueAdapter && _valueAdapter.aToB && _resolveTransformer(_valueAdapter.aToB),
														_valueTransformerBtoA = _valueAdapter && _valueAdapter.bToA && _resolveTransformer(_valueAdapter.bToA),
														_whenCondition = _binding.when || _returnTrue,

														_directionIsToChild = _direction.indexOf('->') == (_directionLength - 2),  // parent -> child
														_directionIsFromChild = !_direction.indexOf('<-'),  // child -> parent
														_directionIsTwoWay = !_direction.indexOf('<->'),
														_childObjectChangedPropertyEventName = 'Changed.' + _childPropertyName,

														_toChildInfoForChild = _toChildInfo[_childName] = _toChildInfo[_childName] || {},
														_toChildInfoForChildProperty = _toChildInfoForChild[_childPropertyName] = _toChildInfoForChild[_childPropertyName] || {}
													;

													if (_directionIsToChild) {
														// Instead of wiring Changed.* event on each instance, we'll just augment the state property definition
														// to include a shared onChange handler in order to update the child when the instance changes.
														// And by using a shared onChange we can update *all* of the bound properties for the child at once instead
														// of one by one.
														if (!(_propertyName in _sharedPropertiesOnChangedHandlerLookup)) { // register the state property only once the first time we encounter it
															_sharedPropertiesOnChangedHandlerLookup[_propertyName] = 1;
															mClass.stateProperties(
																_pairUp(
																	_propertyName,
																	{
																		name:_propertyName,
																		onChange:_sharedPropertiesOnChangeHandler
																	}
																)
															);
														}

														// Save the value transformation for the child's property from the instance's property so that we can have the child
														// instantiated w/ the data (provided the direction is to-child)
														_toChildInfoForChildProperty[_propertyName] = {
															_directionIsTwoWay:_directionIsTwoWay,
															_valueTransformerAtoB:_valueTransformerAtoB,
															_whenCondition:_whenCondition
														};
													}

													// Construct function to be called once the child is added. It will actually create the bindings
													(_bindingWirings[_childName] = _bindingWirings[_childName] || {})[_propertyName + '/' + _childPropertyName] = function(m) {
														var
															_childObject = _childName ? m[_childObjectsInstancePropertyName][_childName] : m,
															_syncFromChildEvent,
															_whenConditionWheneverWiring
														;

														function _syncToChild() { _syncObjects.call(m, m, _propertyName, _childObject, _childPropertyName, _valueTransformerAtoB, _whenCondition) }
														function _syncFromChild() { _syncObjects.call(m, _childObject, _childPropertyName, m, _propertyName, _valueTransformerBtoA, _whenCondition) }

														if (_directionIsToChild) {
															// First set child object to have same value as instance. We still need this here despite setting
															// the child objects' initial data when they are added in the event that a child is added, removed,
															// and added again. In that case the child objects special state property won't have the data we need.
															// We don't want to do this if the binding is bi-drectional and the instance is undefined.
															// In that case we'd rather the child object be the driver
															(!_directionIsTwoWay || m.get(_propertyName) !== _undefined)
																&& _syncToChild()
															;

															// Sync to child event is handled by adding onChange handler for state property
														}
														if (_directionIsFromChild) {
															// First set instance to have same value as child if it's one-way (or the instance's property was undefined for bi-directional)
															(!_directionIsTwoWay || m.get(_propertyName) == _undefined)
																&& _syncFromChild();

															// Then wire Changed.* handler on child to update instance
															_childObject.wire(_syncFromChildEvent = _pairUp(_childObjectChangedPropertyEventName, _syncFromChild));
														}

														// if a when condition is specified, we need to register a whenever condition handler to sync when the condition
														// becomes true
														if (_whenCondition != _returnTrue)
															_whenConditionWheneverWiring = m.whenever(
																_whenCondition,
																function() {
																	if (_directionIsToChild && (!_directionIsTwoWay || m.get(_propertyName) !== _undefined))
																		_syncToChild();
																	else if (_directionIsFromChild)
																		_syncFromChild();
																}
															)
														;

														// Finally, wire up unwire if/when the child is removed
														_childName
															&& m[_addedChildObjectsPropertyName].whenever(
																'!' + _childName,
																function() {
																	if (_childObject) {
																		// NOTE: can't unwire onChange (it just checks to see if child exists)

																		// unwire child -> parent (even though child is removed, it is not necessarilly destroyed)
																		_syncFromChildEvent && _childObject && _childObject.unwire(_syncFromChildEvent);

																		// unwire whenever condition handler
																		_whenConditionWheneverWiring && m.unwire(_whenConditionWheneverWiring);

																		// clear out our reference to the removed child object to not potentially hang on memory that can be disposed
																		_childObject = undefined;
																	}
																}
															)
														;
													};
												}
											}

											_isArray(_bindingForProperty)
												? _forEach(_bindingForProperty, _processBinding)
												: _processBinding(_bindingForProperty)
											;
										}
									);
								}
							),

							alphastructor:function () {
								var
									m = this,
									_addedChildObjects = m[_addedChildObjectsPropertyName]
								;

								/* NOTE: Format of _bindingWiringsStaticDataName:
									{
										childA:{
											'propertyA/childPropertyA':function() {
												// set up bindings
											}
										}
									}
								*/

								_forEach(
									m.Class[_bindingWiringsStaticDataName],
									function(_bindingWiringsForChild, _childName) {
										var
											_applyBinding = function() {
												for (var _key in _bindingWiringsForChild)
													_bindingWiringsForChild[_key](m)
												;
											}
										;
										_childName
											? _addedChildObjects.whenever(_childName, _applyBinding)
											: _applyBinding()
										;
									}
								);
							},

							omegastructor:function() {
								var m = this;

								// set initial values for children on state proprety so that when the children are
								// constructed they'll have those values ready at construction, which should eliminate
								// an initial changed event. Optimization!
								m.set(
									_childObjectsStatePropertyName,
									_getChildObjectsToSet(
										m,
										// We don't want to do this if the binding is bi-drectional and the instance is undefined.
										// In that case we'd rather the child object be the driver.
										// Also make sure that the when condition is met, otherwise we don't want to sync the instance's state
										// with that of the child.
										function(_instancePropertyName, _info) { return !_info._directionIsTwoWay || m.get(_instancePropertyName) !== _undefined }
									)
								);
							}
						});
						/*?
							Static Methods
								Uize.Class.mChildObjectBindings.childObjectBindings
									Lets you conveniently declare the type of child objects binding to declare on the class.

									SYNTAX
									.........................................
									MyClass.mChildObjectBindings (childObjectBindingsPropertiesOBJ);
									.........................................

									The sole =childObjectBindingsPropertiesOBJ= parameter supports the following properties...

									- =declaration= - the name of the actual child object bindings declaration =function= to create (such as ='childBindings'= for =Uize.Widget.mChildBindings=)
									- =instanceProperty= - the name of the instance property that contains the references to the child objects (such as ='children'= for =Uize.Widget.mChildBindings=)
									- =addedInstanceProperty= - the name of the =Uize.Class= instance property that contains state about which child objects have been added (such as ='addedChildren' for =Uize.Widget.mChildBindings=)
									- =stateProperty= - the name of the special state property that allows for setting state of child objects (such as ='children'= for =Uize.Widget.mChildBindings=)
						*/
					}
				}
			});
		};
	}
});
