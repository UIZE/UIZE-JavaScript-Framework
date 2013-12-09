/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.V2Mixin Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 8
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.V2Mixin= class implements the next generation widget base class and is currently under development.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.V2Mixin',
	required:'Uize.Node',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_copyInto = _Uize.copyInto,
				_applyAll = _Uize.applyAll,
				_forEach = _Uize.forEach,

			/*** General Variables ***/
				_trueFlag = {},
				_cssAddedLookup = {}
		;

		/*** Utility Functions ***/
			function _cssClassPrefixFromModuleName (_moduleName) {
				return _moduleName.replace (/\./g,'_');
			}

			function _cssClassPrefixFromModule (_module) {
				return (
					_module.v2ClassPrefix || (_module.v2ClassPrefix = _cssClassPrefixFromModuleName (_module.moduleName))
				);
			}

			function _cssClassNameGeneratorFromModules (_modules) {
				var _classNameGeneratorStr = '';
				for (var _moduleNo = -1, _modulesLength = _modules.length, _cssModule; ++_moduleNo < _modulesLength;) {
					_cssModule = _modules [_moduleNo].cssModule;
					if (_cssModule)
						_classNameGeneratorStr +=
							(_classNameGeneratorStr && ' + \' \' + ') +
							'\'' + _cssClassPrefixFromModule (_cssModule) + '\' + classSuffix'
					;
				}
				return Function (
					'nodeName',
					'var classSuffix = (nodeName || \'\') && \'-\' + nodeName;' +
					'return ' + _classNameGeneratorStr + ';'
				);
			}

		/*** Private Instance Methods ***/
			function _updateRootNodeClasses (m) {
				m.Class.enableRootNodeCssClasses && m.set ({v2RootNodeCssClasses:m.rootNodeCssClasses ()});
			}

		return function (_class) {
			_class.declare ({
				alphastructor:function () {
					var m = this;

					m.Class.v2NeedCss ();
					m.once (
						'wired',
						function () {
							/*** wire up handlers for state properties that have CSS bindings ***/
								var
									_cssBindings = m.Class.v2CssBindings,
									_boundUpdateRootNodeClasses = function () {_updateRootNodeClasses (m)},
									_wiringsForCssBindings = {}
								;
								for (var _property in _cssBindings)
									_wiringsForCssBindings ['Changed.' + _property] = _boundUpdateRootNodeClasses
								;
								m.wire (_wiringsForCssBindings);

							/*** wire up handlers for state properties that have HTML bindings ***/
								var _wiringsForHtmlBindings = {};
								_forEach (
									m.Class.v2HtmlBindings,
									function (_bindings,_property) {
										_wiringsForHtmlBindings ['Changed.' + _property] = function () {
											_applyAll (m,_bindings,[m.get (_property)]);
										};
									}
								);
								m.wire (_wiringsForHtmlBindings);

							/*** update UI ***/
								_updateRootNodeClasses (m);
								for (var _eventName in _wiringsForHtmlBindings)
									_wiringsForHtmlBindings [_eventName] ()
								;
						}
					);
				},

				instanceMethods:{
					addChildren:function (_children,_commonProperties) {
						for (var _childName in _children) {
							var
								_childProperties = _Uize.copy (_children [_childName],_commonProperties),
								_widgetClass = _childProperties.widgetClass
							;
							delete _childProperties.widgetClass;
							this.addChild (_childName,_widgetClass,_childProperties);
						}
						/*?
							Instance Methods
								addChildren
									Lets you conveniently add multiple child widgets in a single method call, by specifying the children in an object that maps child names to child properties.

									DIFFERENT USAGES

									`Add Multiple Child Widgets`
									.....................................
									myInstance.addChildren (childrenOBJ);
									.....................................

									`Add Multiple Child Widgets, Specifying Properties That Are Common to All`
									.........................................................
									myInstance.addChildren (childrenOBJ,commonPropertiesOBJ);
									.........................................................

									Add Multiple Child Widgets
										Multiple child widgets can be added in a single call, by specifying a single =childrenOBJ= parameter.

										SYNTAX
										.....................................
										myInstance.addChildren (childrenOBJ);
										.....................................

										The value of the =childrenOBJ= parameter should be an object, where the name of a property should be the name of a child widget, and where the value of a property should be an object specifying values for a child widget's state properties. The widget class for a child widget should be specified using the special =widgetClass= widget property.

										EXAMPLE
										......................................
										this.addChildren ({
											ok:{
												text:'OK',
												widgetClass:Uize.Widgets.Button,
												size:'small'
											},
											cancel:{
												text:'CANCEL',
												widgetClass:Uize.Widgets.Button,
												size:'small'
											},
											reset:{
												text:'RESET',
												widgetClass:Uize.Widgets.Button,
												size:'small'
											}
										});
										......................................

										In the above example, the =addChildren= method is being used to add three button child widgets.

									Add Multiple Child Widgets, Specifying Properties That Are Common to All
										Multiple child widgets can be added in a single call, without repeating widget property values that are common to all children being added, by specifying the common property values in the optional =commonPropertiesOBJ= parameter.

										SYNTAX
										.........................................................
										myInstance.addChildren (childrenOBJ,commonPropertiesOBJ);
										.........................................................

										EXAMPLE
										......................................
										this.addChildren (
											{
												ok:{text:'OK'},
												cancel:{text:'CANCEL'},
												reset:{text:'RESET'}
											},
											{
												widgetClass:Uize.Widgets.Button,
												size:'small'
											}
										);
										......................................

										In the above example, the =addChildren= method is being used to add three button child widgets of the same =Uize.Widgets.Button= widget class and with the same ='small'= value for their =size= state property. Because the widget class and size are the same for all the buttons being added, these values can be specified using the optional =commonPropertiesOBJ= parameter so that the values don't need to be repeated in the child properties object for each of the child widgets.

									More Concise
										Using the =addChildren= method can produce more concise code in situations where you are adding multiple child widgets that share some common properties.

										Consider the following example of adding multiple button child widgets...

										INSTEAD OF...
										.......................
										this.addChild (
											'ok',
											Uize.Widgets.Button,
											{
												text:'OK',
												size:'small'
											}
										);

										this.addChild (
											'cancel',
											Uize.Widgets.Button,
											{
												text:'CANCEL',
												size:'small'
											}
										);

										this.addChild (
											'reset',
											Uize.Widgets.Button,
											{
												text:'RESET',
												size:'small'
											}
										);
										.......................

										USE...
										......................................
										this.addChildren (
											{
												ok:{text:'OK'},
												cancel:{text:'CANCEL'},
												reset:{text:'RESET'}
											},
											{
												widgetClass:Uize.Widgets.Button,
												size:'small'
											}
										);
										......................................

										In the above example, we are adding multiple button child widgets of the same widget class and of the same size (as specified in the =size= state property). Rather than calling the =addChild= method multiple times, each time passing the same common property values, we can use the =addChildren= method and tale advantage of its optional =commonPropertiesOBJ= parameter to avoid having to repeat the property values that are common to all the button child widgets.

									NOTES
									- compare to the companion =addChild= instance method
						*/
					},

					childHtml:function (_properties) {
						var
							m = this,
							_childName =
								_properties.name ||
								(
									'generatedChildName' +
									(m.v2GeneratedChildNames == _undefined ? (m.v2GeneratedChildNames = 0) : m.v2GeneratedChildNames++)
								),
							_widgetClass = _Uize.getModuleByName (_properties.widgetClass) || _class,
							_widgetClassName = _widgetClass.moduleName,
							_children = m.children
						;

						delete _properties.name;
						delete _properties.widgetClass;

						var
							_inlineState = _Uize.copy (_properties),
							_html = '',
							_child = _children [_childName],
							_childExisted = !!_child
						;
						_child
							? _child.set (_properties)
							: (_child = m.addChild (_childName,_widgetClass,_properties))
						;
						_html = _child.get ('built')
							? _child.getHtml ()
							: '<div id="' + _child.nodeId ('shell') + '"></div>'
						;
						_childExisted ||
							_copyInto (_inlineState,{widgetClass:_widgetClassName})
						;
						if (!_Uize.isEmpty (_inlineState))
							_child.inlineState = _inlineState
						;
						return _html;
						/*?
							Instance Methods
								childHtml
									Returns the HTML for a child widget that can then be inserted into the HTML for the widget.

									SYNTAX
									......................................................
									childHtml = myInstance.childHtml (childPropertiesOBJ);
									......................................................

									The =childHtml= method is intended primarily for use within the HTML generator (usually a JST template) for a widget.
						*/
					},

					rootNodeCssClasses:function () {
						var
							m = this,
							_extraClasses = m.extraClasses,
							_cssBindings = m.Class.v2CssBindings,
							_cssClasses = [m.cssClass ()],
							_cssClassSuffix
						;
						for (var _property in _cssBindings)
							if (_cssClassSuffix = _cssBindings [_property] (m.get (_property)))
								_cssClasses.push (m.cssClass (_cssClassSuffix))
						;
						return _cssClasses.join (' ') + (_extraClasses && ' ' + _extraClasses);
						/*?
							Instance Methods
								rootNodeCssClasses
									Returns a string, representing the CSS classes string that is applied to the root node of the widget.

									SYNTAX
									.................................................
									cssClassesSTR = myInstance.rootNodeCssClasses ();
									.................................................

									NOTES
									- see also the related =cssClass= instance method and the =cssBindings= static method
						*/
					},

					cssClass:function (_className) {
						var
							_thisClass = this.Class,
							_thisClassName = _thisClass.moduleName,
							_cssClassNameGenerators =
								_thisClass.v2CssClassNameGenerators || (_thisClass.v2CssClassNameGenerators = {})
						;
						if (!_cssClassNameGenerators [_thisClassName]) {
							var
								_inheritanceChain = [],
								_module = _thisClass
							;
							while (_module) {
								_inheritanceChain.unshift (_module);
								_module = _module.superclass;
							}
							_cssClassNameGenerators [_thisClassName] = _cssClassNameGeneratorFromModules (_inheritanceChain);
						}
						return _cssClassNameGenerators [_thisClassName] (_className);
					},

					superHtml:function (_input,_extraInput) {
						return this.Class.superclass.get ('html').process.call (this,_Uize.copy (_input,_extraInput));
					}
				},

				staticMethods:{
					v2NeedCss:function () {
						var
							m = this,
							_moduleName = m.moduleName
						;
						if (_cssAddedLookup [_moduleName] != _trueFlag) {
							_cssAddedLookup [_moduleName] = _trueFlag;
							m.superclass.v2NeedCss && m.superclass.v2NeedCss ();
							m.cssModule && m.cssModule.add ();
						}
					},

					cssBindings:function (_bindings) {
						_copyInto (this.v2CssBindings,_Uize.map (_bindings,_Uize.resolveTransformer));
						/*?
							Static Methods
								Uize.Widget.V2Mixin.cssBindings
									Lets you declare one or more bindings of state properties to CSS classes on the root node.

									SYNTAX
									........................................
									MyWidgetClass.cssBindings (bindingsOBJ);
									........................................

									EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.V2Mixin.subclass ({
										stateProperties:{
											size:{value:'small'}
										},
										htmlBindings:{
											size:'value'
										}
									});
									......................................................

									### Types of CSS Bindings
										Using an Expression String Class Name Generator
											.
										Using a Function Class Name Generator
											.
						*/
					},

					htmlBindings:function (_bindings) {
						function _resolvePropertyUpdater (_propertyName,_updater) {
							if (typeof _updater == 'string') {
								var
									_nodeNameAndBindingType = _updater.split (':'),
									_nodeName = _nodeNameAndBindingType [0],
									_bindingType = _nodeNameAndBindingType [1]
								;
								if (!_bindingType) {
									_updater = function (_propertyValue) {
										this.setNodeValue (
											_nodeName,
											_propertyValue == null ? '' : _propertyValue
										);
									};
								} else if (_bindingType == 'html' || _bindingType == 'innerHTML') {
									_updater = function (_propertyValue) {
										this.setNodeInnerHtml (_nodeName,_propertyValue == null ? '' : _propertyValue);
									};
								} else if (_bindingType == '?') {
									_updater = function (_propertyValue) {this.displayNode (_nodeName,!!_propertyValue)};
								} else if (_bindingType.slice (0,6) == 'style.') {
									var _stylePropertyName = _bindingType.slice (6);
									_updater = function (_propertyValue) {
										this.setNodeStyle (_nodeName,_Uize.pairUp (_stylePropertyName,_propertyValue));
									};
								} else {
									_updater = function (_propertyValue) {
										this.setNodeProperties (_nodeName,_Uize.pairUp (_bindingType,_propertyValue));
									};
								}
							}
							return _updater;
						}
						var _htmlBindings = this.v2HtmlBindings;
						_forEach (
							_bindings,
							function (_updater,_property) {
								var _propertyHtmlBindings = _htmlBindings [_property] || (_htmlBindings [_property] = []);
								function _resolveAndPushUpdater (_updater) {
									_propertyHtmlBindings.push (_resolvePropertyUpdater (_property,_updater));
								}
								_Uize.isArray (_updater)
									? _forEach (_updater,_resolveAndPushUpdater)
									: _resolveAndPushUpdater (_updater)
								;
							}
						);
						/*?
							Static Methods
								Uize.Widget.V2Mixin.htmlBindings
									.

									SYNTAX
									.........................................
									MyWidgetClass.htmlBindings (bindingsOBJ);
									.........................................

									EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.V2Mixin.subclass ({
										stateProperties:{
											foo:{value:'bar'}
										},
										htmlBindings:{
											foo:'foo'
										}
									});
									......................................................

									### Types of HTML Binding
										Binding to Inner HTML, with HTML-encoding
											.

										Binding to Inner HTML, As Is
											.

										Binding to Properties
											.

										Binding to Style Properties
											.

										Free Form Binding, Using a Function
											.

									NOTES
									- see also the companion `Uize.Widget.V2Mixin.cssBindings` feature declaration method
						*/
					}
				},

				staticProperties:{
					v2CssBindings:{},
					v2HtmlBindings:{},
					enableRootNodeCssClasses:true
				},

				stateProperties:{
					v2RootNodeCssClasses:{value:''},
					extraClasses:{value:''}
				},

				set:{
					html:{
						process:function () {
							var
								m = this,
								_children = m.children,
								_htmlChunks = [],
								_htmlChunksLength = 0
							;
							for (var _childName in _children)
								_htmlChunks [_htmlChunksLength++] = _children [_childName].getHtml ()
							;
							return '<div id="' + m.nodeId () + '">' + _htmlChunks.join ('') + '</div>';
						}
					}
				}
			});

			_class.htmlBindings ({
				v2RootNodeCssClasses:':className'
			});

			_copyInto (
				_class.nonInheritableStatics,
				{
					v2ClassPrefix:1,
					v2CssClassNameGenerators:1,
					cssModule:1
				}
			);

			return _class;
		};
	}
});

