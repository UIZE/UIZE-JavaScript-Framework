/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mChildBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 95
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mChildBindings= mixin implements features to provide a declarative approach to binding the state properties of a widget to those of its children.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mChildBindings',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_forEach = _Uize.forEach,
				
			/*** Variables for Performance Optimzation ***/
				_bindingFormatRegExp = /^([<\->]+)?(\w+)(\.(.+))?$/,
				_syncWidgets = function(_sourceWidget, _sourceProperty, _destinationWidget, _destinationProperty, _valueTransformer) {
					var _sourceValue = _sourceWidget.get(_sourceProperty);
					_destinationWidget.set(
						_destinationProperty,
						_valueTransformer
							? _valueTransformer(_sourceValue)
							: _sourceValue
					);	
				}
		;

		return function (_class) {
			_class.declare ({
				alphastructor:function () {
					var
						m = this,
						_addedChildren = m.addedChildren
					;

					_forEach(
						m.Class.mChildBindings_bindings,
						function(_childBindingsForProperty) {
							_forEach(
								_childBindingsForProperty,
								function(_bindingsForChild, _childName) {
									_addedChildren.whenever(
										_childName,
										function() { _Uize.applyAll(m, _Uize.values(_bindingsForChild)) }
									);
								}
							);
						}
					);
				},
				
				staticMethods:{
					childBindings:function(_bindings) {
						var _childBindings = this.mChildBindings_bindings;

						_forEach(
							_bindings,
							function(_bindingForProperty, _propertyName) {
								var
									_childBindingsForProperty = _childBindings[_propertyName] = _childBindings[_propertyName] || {},
									_processBinding = function (_binding) {
										var _formatMatch = _Uize.isString(_binding) && _binding.match(_bindingFormatRegExp);
										if (_formatMatch) //canonicalize string
											_binding = {
												child:_formatMatch[2],
												property:_formatMatch[4],
												direction:_formatMatch[1]
											}
										;
										
										if (_Uize.isPlainObject(_binding) && _binding.child) {
											var
												_childName = _binding.child,
												_childPropertyName = _binding.property || _propertyName,
												_direction = _binding.direction || '<->', // bi-directional is the default
												_directionLength = _direction.length,
												_valueAdapter = _binding.valueAdapter,
												_valueTransformerAtoB = _valueAdapter && _valueAdapter.aToB && _Uize.resolveTransformer(_valueAdapter.aToB),
												_valueTransformerBtoA = _valueAdapter && _valueAdapter.bToA && _Uize.resolveTransformer(_valueAdapter.bToA)
											;

											// Construct function to be called once the child is added. It will actually create the bindings
											(_childBindingsForProperty[_childName] = _childBindingsForProperty[_childName] || {})[_childPropertyName] = function() {
												var
													m = this,
													_childWidget = m.children[_childName],
													_syncToChild = function() { _syncWidgets(m, _propertyName, _childWidget, _childPropertyName, _valueTransformerAtoB) },
													_syncFromChild = function() { _syncWidgets(_childWidget, _childPropertyName, m, _propertyName, _valueTransformerBtoA) },
													_syncToChildEvent,
													_syncFromChildEvent
												;
												
												if (_direction.indexOf('->') == (_directionLength - 2)) { // parent -> child
													// First set child widget to have same value as widget
													// We don't want to do this if the binding is bi-drectional and the widget is undefined.
													// In that case we'd rather the child widget be the driver
													(_direction.indexOf('<->') || m.get(_propertyName) !== _undefined)
														&& _syncToChild()
													;
													
													// Then wire Changed.* handler on widget to update child widget
													m.wire(_syncToChildEvent = _Uize.pairUp('Changed.' + _propertyName, _syncToChild));
												}
												if (!_direction.indexOf('<-')) { // child -> parent
													// First set widget to have same value as child
													_syncFromChild();
													
													// Then wire Changed.* handler on child to update widget
													_childWidget.wire(_syncFromChildEvent = _Uize.pairUp('Changed.' + _childPropertyName, _syncFromChild));
												}
													
												// Finally wire up unwire if/when the child is removed
												m.addedChildren.whenever(
													'!' + _childName,
													function() {
														if (_childWidget) {
															// unwire parent -> child
															_syncToChildEvent && m.unwire(_syncToChildEvent);
															
															// unwire child -> parent (even though child is removed, it is not necessarilly destroyed)
															_syncFromChildEvent && _childWidget && _childWidget.unwire(_syncFromChildEvent);
															
															// clear out our reference to the removed child widget to not potentially hang on memory that can be disposed
															_childWidget = undefined;
														}
													}
												);
											};
										}
									}
								;
								_Uize.isArray(_bindingForProperty)
									? _forEach(_bindingForProperty, _processBinding)
									: _processBinding(_bindingForProperty)
								;
							}
						);
						/*?
							Static Methods
								Uize.Widget.mChildBindings.childBindings
									.

									SYNTAX
									.........................................
									MyWidgetClass.childBindings (bindingsOBJ);
									.........................................

									VERBOSE EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mChildBindings.subclass ({
										childBindings:{
											size:{
												child:'sizeWidget',
												property:'value',
												direction:'<->' // bi-directional changes (default),
												valueAdapter:{
													aToB:function(value) { return value * value },
													bToA:function(value) { return Math.sqrt(value) }
												}
											},
											value:[ // parent-to-many-children
												{
													child:'valueWidget',
													direction:'->',
													valueAdapter:{
														aToB:'value * value' // via Uize.resolveValueTransformer
													}
												},
												{
													child:'valueWidget2',
													direction:'<-',
													valueAdapter:{
														bToA:'Math.sqrt(value)' // via Uize.resolveValueTransformer
													}
												}
											]
										}
									});
									......................................................

									SHORT-HAND EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mChildBindings.subclass ({
										childBindings:{
											size:'<->sizeWidget.value',  // bi-directional changes with "value" state proprety in "sizeWidget" child
											value:[ // parent-to-many-children
												'->valueWidget', // changes to child only
												'<-valueWidget2' // changes from child only
											],
											values:'valuesWidget' // bi-directional changes with same-named state proprety in "valuesWidget" child
										}
									});
									......................................................
						*/
					}
				},

				staticProperties:{
					mChildBindings_bindings:{}
				}
			});
		};
	}
});
