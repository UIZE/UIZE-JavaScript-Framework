/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mEventBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 7
	codeCompleteness: 100
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mEventBindings= mixin implements features to provide a declarative approach to wiring Uize events on widgets and their children, as well as DOM events on implied nodes.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mEventBindings',
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
				alphastructor:function () {
					var
						m = this,
						_mClass = m.Class,
						_domEventsLookup = _mClass.mEventBindings_dom,
						_addedChildren = m.addedChildren,
						_children = m.children,
						_wiredWidgetEvents = {} // keep track of wired widget events so we can remove them if the children get removed
					;

					function _wrapBinding(_context, _binding, _source, _defaultFireIf) {
						return function(_event) {
							// ensure that the required child widgets have been added before calling the handler
							// or that the fireIf condition has been met
							(!_binding.required || _addedChildren.isMet(_binding.required))
								&& m.isMet(_binding.fireIf || _defaultFireIf)
								&& _binding.handler.call(_context, _event, _source)
							;
						};
					}

					/* NOTE: format of bindings
						{
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
					*/

					/*** wire up event handlers for DOM nodes ***/
						m.whenever (
							'wired',
							function () {
								for (var _nodeName in _domEventsLookup) {
									for (
										var
											_bindings = _domEventsLookup[_nodeName],
											_node = m.getNode(_nodeName),
											_bindingNo = -1,
											_bindingsLength = _bindings.length
										;
										++_bindingNo < _bindingsLength;
									) {
										var _bindingInfo = _bindings[_bindingNo];
										m.wireNode(_node, _bindingInfo[0], _wrapBinding(m, _bindingInfo[1], _node, 'enabledInherited,!busyInherited'));
									}
								}
							}
						);

					/*** wire self & child widget events ***/
						_forEach(
							_mClass.mEventBindings_widget,
							function(_bindings, _widgetName) {
								function _wire(_widget) {
									for (
										var
											_bindingNo = -1,
											_bindingsLength = _bindings.length
										;
										++_bindingNo < _bindingsLength;
									) {
										var
											_bindingInfo = _bindings[_bindingNo],
											_eventToWire = _pairUp(_bindingInfo[0], _wrapBinding(m, _bindingInfo[1], _widget, _returnTrue))
										;

										_widget.wire(_eventToWire);

										// store a reference to the wired event for later
										(_wiredWidgetEvents[_widgetName] || (_wiredWidgetEvents[_widgetName] = [])).push(_eventToWire);
									}
								}
								if (_widgetName) {
									var _childWidget;
									_addedChildren.wire( // adding or removing child widgets
										'Changed.' + _widgetName,
										function() {
											if (_addedChildren.get(_widgetName))
												_wire(_childWidget = _children[_widgetName]);
											else {
												// unwire all the events this widget wired so that we don't have a removed child widget still potentially
												// firing events
												for (var _wiredEventForWidget = _wiredWidgetEvents[_widgetName], _eventNo = -1; ++_eventNo < _wiredEventForWidget.length;)
													_childWidget.unwire(_wiredEventForWidget[_eventNo]);

												// delete our cache of the wired event so things don't get mixed up when if we
												// add back a child w/ the same name
												delete _wiredWidgetEvents[_widgetName];

												// clear out our reference to the removed child widget to not potentially hang on memory that can be disposed
												_childWidget = undefined;
											}
										}
									);
								}
								else _wire(m); // '' is self
							}
						);
				},

				staticMethods:{
					eventBindings:function(_bindings) {
						var
							_Class = this,
							_domEventBindings = _Class.mEventBindings_dom,
							_widgetEventBindings = _Class.mEventBindings_widget,
							_undefined
						;

						_forEach(
							_bindings,
							function(_eventBindingValue, _eventBindingKey) {
								var
									_eventBindingKeyTokens = _eventBindingKey.split(':'), // NOTE: widget events with colons won't work as a result
									_sourceName = _eventBindingKeyTokens[0],
									_eventBindings = (!_sourceName.indexOf('#') ? (_sourceName = _sourceName.substr(1)) : _undefined) != _undefined // DOM references start with #
										? _domEventBindings
										: _widgetEventBindings
								;

								function _addBinding(_binding, _eventName) {
									if (!_sourceName && _eventBindings == _widgetEventBindings && _isFunction(_binding) && !_eventName.indexOf('Changed.')) {
										var _propertyName = _eventName.slice(8);
										// For optimization purposes, we want to add a self widget Changed.* handler for the onChange property
										// of the property name
										_Class.stateProperties(
											_pairUp(
												_propertyName,
												{
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
										(_eventBindings[_sourceName] || (_eventBindings[_sourceName] = [])).push([_eventName, _isPlainObject(_binding) ? _binding : {handler:_binding}])
									;
								}

								_eventBindingKeyTokens.length > 1 // short-hand syntax where the 2nd token is the event
									? _addBinding(_eventBindingValue, _eventBindingKeyTokens[1])
									: _forEach(_eventBindingValue, _addBinding)
								;
							}
						);
						/*?
							Static Methods
								Uize.Widget.mEventBindings.eventBindings
									.

									SYNTAX
									.........................................
									MyWidgetClass.eventBindings (bindingsOBJ);
									.........................................

									VERBOSE EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mEventBindings.subclass ({
										eventBindings:{
											'#menu':{ // DOM node
												click:function (event, sourceNode) { },
												mouseover:{
													handler:function(_event, sourceNode) { },
													fireIf:'busyInherited'
												}
											},
											'sliderG':{ // child widget
												'Changed.value':function (event, sourceWidget) { },
												Update:function(_event, sourceWidget) { }
											},
											'':{ // self
												'Changed.value':function (event) { },
												Update:{
													handler:function(_event) { },
													required:'sliderG'
												}
											}
										}
									});
									......................................................

									SHORT-HAND EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mEventBindings.subclass ({
										eventBindings:{
											'#menu:click':function(event, sourceNode) { },
											'#menu:mouseover':{
												handler:function(event, sourceNode) { },
												fireIf:'busyInherited'
											},
											'sliderG:Changed.value':function (_event, sourceWidget) { },
											'sliderG:Update':function(event, sourceWidget) { },
											':Changed.value':function (event) { },
											':Update':{
												handler:function(event) { },
												required:['sliderG']
											}
										}
									});
									......................................................
						*/
					}
				},

				staticProperties:{
					mEventBindings_dom:{},
					mEventBindings_widget:{}
				}
			});
		};
	}
});
