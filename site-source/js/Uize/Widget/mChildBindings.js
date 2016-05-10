/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mChildBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 95
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mChildBindings= mixin implements features to provide a declarative approach to binding the state properties of a widget to those of its children.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
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
				_isString = _Uize.isString,
				_isArray = _Uize.isArray,
				_isPlainObject = _Uize.isPlainObject,
				_resolveTransformer = _Uize.resolveTransformer,
				_pairUp = _Uize.pairUp,

			/*** Variables for Performance Optimzation ***/
				_bindingFormatRegExp = /^([<\->]+)?(\w+)(\.(.+))?$/
		;

		function _syncWidgets(_sourceWidget, _sourceProperty, _destinationWidget, _destinationProperty, _valueTransformer) {
			var _sourceValue = _sourceWidget.get(_sourceProperty);
			_destinationWidget.set(
				_destinationProperty,
				_valueTransformer
					? _valueTransformer(_sourceValue, _sourceWidget, _destinationWidget)
					: _sourceValue
			);
		}

		return function (_class) {
			_class.declare ({
				alphastructor:function () {
					var
						m = this,
						_addedChildren = m.addedChildren
					;

					/* NOTE: Format of mChildBindings_bindings:
						{
							childA:{
								'propertyA/childPropertyA':function() {
									// set up bindings
								}
							}
						}
					*/

					_forEach(
						m.Class.mChildBindings_bindings,
						function(_bindingsForChild, _childName) {
							_addedChildren.whenever(
								_childName,
								function() {
									for (var _key in _bindingsForChild)
										_bindingsForChild[_key](m)
									;
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
								function _processBinding(_binding) {
									var _formatMatch = _isString(_binding) && _binding.match(_bindingFormatRegExp);
									if (_formatMatch) //canonicalize string
										_binding = {
											child:_formatMatch[2],
											property:_formatMatch[4],
											direction:_formatMatch[1]
										}
									;

									if (_isPlainObject(_binding) && _binding.child) {
										var
											_childName = _binding.child,
											_childPropertyName = _binding.property || _propertyName,
											_direction = _binding.direction || '<->', // bi-directional is the default
											_directionLength = _direction.length,
											_valueAdapter = _binding.valueAdapter,
											_valueTransformerAtoB = _valueAdapter && _valueAdapter.aToB && _resolveTransformer(_valueAdapter.aToB),
											_valueTransformerBtoA = _valueAdapter && _valueAdapter.bToA && _resolveTransformer(_valueAdapter.bToA),

											_directionIsToChild = _direction.indexOf('->') == (_directionLength - 2),  // parent -> child
											_directionIsFromChild = !_direction.indexOf('<-'),  // child -> parent
											_directionIsTwoWay = _direction.indexOf('<->'),
											_widgetChangedPropertyEventName = 'Changed.' + _propertyName,
											_childWidgetChangedPropertyEventName = 'Changed.' + _childPropertyName
										;

										// Construct function to be called once the child is added. It will actually create the bindings
										(_childBindings[_childName] = _childBindings[_childName] || {})[_propertyName + '/' + _childPropertyName] = function(m) {
											var
												_childWidget = m.children[_childName],
												_syncToChildEvent,
												_syncFromChildEvent
											;

											function _syncToChild() { _syncWidgets(m, _propertyName, _childWidget, _childPropertyName, _valueTransformerAtoB) }
											function _syncFromChild() { _syncWidgets(_childWidget, _childPropertyName, m, _propertyName, _valueTransformerBtoA) }

											if (_directionIsToChild) {
												// First set child widget to have same value as widget
												// We don't want to do this if the binding is bi-drectional and the widget is undefined.
												// In that case we'd rather the child widget be the driver
												(_directionIsTwoWay || m.get(_propertyName) !== _undefined)
													&& _syncToChild()
												;

												// Then wire Changed.* handler on widget to update child widget
												m.wire(_syncToChildEvent = _pairUp(_widgetChangedPropertyEventName, _syncToChild));
											}
											if (_directionIsFromChild) {
												// First set widget to have same value as child
												_syncFromChild();

												// Then wire Changed.* handler on child to update widget
												_childWidget.wire(_syncFromChildEvent = _pairUp(_childWidgetChangedPropertyEventName, _syncFromChild));
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

								_isArray(_bindingForProperty)
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

