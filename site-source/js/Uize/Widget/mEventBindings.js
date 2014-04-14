/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mEventBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 30
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mEventBindings= mixin implements features to provide a declarative approach to wiring Uize events on widgets and their children, as well as DOM events on implied nodes.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mEventBindings',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_forEach = _Uize.forEach
		;

		return function (_class) {
			_class.declare ({
				omegastructor:function () {
					var
						m = this,
						_mClass = m.Class,
						_addedChildren = m.addedChildren,
						_children = m.children,
						_wrapBinding = function(_context, _bindingValue, _source) {
							return function(_event) {
								var _bindingValueIsObject = _Uize.isObject(_bindingValue);
								
								// ensure that the required child widgets have been added before calling the handler
								_addedChildren.isMet(_bindingValueIsObject ? _bindingValue.required : [])
									&& (_bindingValueIsObject ? _bindingValue.handler : _bindingValue).call(_context, _event, _source)
								;
							};
						}
					;

					/*** wire up event handlers for DOM nodes ***/
						m.once (
							'wired',
							function () {
								_forEach(
									_mClass.mEventBindings_dom,
									function (_bindings, _nodeName) {
										var _node = m.getNode(_nodeName);
										_forEach(
											_bindings,
											function(_binding, _eventName) {
												m.wireNode(_node, _eventName, _wrapBinding(m, _binding, _node));
											}
										);
									}
								);
							}
						);    

					/*** wire self & child widget events ***/
						_forEach(
							_mClass.mEventBindings_widget,
							function(_bindings, _widgetName) {
								function _wire(_widget) {
									_forEach(
										_bindings,
										function(_binding, _eventName) {
											_widget.wire(_eventName, _wrapBinding(m, _binding, _widget));
										}
									);
								}
								_widgetName // '' is self
									? _addedChildren.once(_widgetName, function() { _wire(_children[_widgetName]) })
									: _wire(m)
								;
							}
						);
				},

				staticMethods:{
					eventBindings:function(_bindings) {
						var
							_domEventBindings = this.mEventBindings_dom,
							_widgetEventBindings = this.mEventBindings_widget,
							_undefined
						;
						
						_forEach(
							_bindings,
							function(_eventBindingValue, _eventBindingKey) {
								var
									_eventBindingKeyTokens = _eventBindingKey.split(':'), // NOTE: widget events with colons won't work as a result
									_nodeOrWidgetName = _eventBindingKeyTokens[0],
									_dotIndex = -1,
									_eventBindings = (!_nodeOrWidgetName.indexOf('#') ? (_nodeOrWidgetName = _nodeOrWidgetName.substr(1)) : _undefined) != _undefined // DOM references start with #
										? _domEventBindings
										: _widgetEventBindings
								;

								_Uize.copyInto(
									_eventBindings[_nodeOrWidgetName] || (_eventBindings[_nodeOrWidgetName] = {}),
									_eventBindingKeyTokens.length > 1 // short-hand syntax where the 2nd token is the event
										? _Uize.pairUp(_eventBindingKeyTokens[1], _eventBindingValue)
										: _eventBindingValue
								);
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
												mouseover:function(_event, sourceNode) { }
											},
											'sliderG':{ // child widget
												'Changed.value':function (event) { },
												Update:function(_event) { }
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
											'#menu:mouseover':function(event, sourceNode) { }
											'sliderG:Changed.value':function (_event) { },
											'sliderG:Update':function(event) { },
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