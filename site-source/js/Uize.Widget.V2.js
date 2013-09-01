/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.V2 Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.V2= class implements the next generation widget base class and is currently under development.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.V2',
	required:[
		'Uize.Json',
		'Uize.Node',
		'Uize.Xml',
		'Uize.String'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined = undefined;

		/*** General Variables ***/
			var
				_trueFlag = {},
				_cssAddedLookup = {}
			;

		/*** Utility Functions ***/
			function _cssClassPrefixFromModuleName (_moduleName) {
				return _moduleName.replace (/\./g,'_');
			}

			function _cssClassPrefixFromModule (_module) {
				return _module._classPrefix || (_module._classPrefix = _cssClassPrefixFromModuleName (_module.moduleName));
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
				return new Function (
					'nodeName',
					'var classSuffix = (nodeName || \'\') && \'-\' + nodeName;' +
					'return ' + _classNameGeneratorStr + ';'
				);
			}

		var _class = _superclass.subclass ({
			alphastructor:function () {
				this.Class._needCss ();
			},

			instanceMethods:{
				addChildren:function (_children,_commonProperties) {
					for (var _childName in _children) {
						var
							_childProperties = Uize.copy (_children [_childName],_commonProperties),
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
						_this = this,
						_childName = _properties.name,
						_widgetClass = Uize.getModuleByName (_properties.widgetClass) || _class,
						_widgetClassName = _widgetClass.moduleName,
						_children = _this.children
					;

					delete _properties.name;
					delete _properties.widgetClass;

					var _suppliedState = Uize.copy (_properties);

					/*** if child name not specified, generate one using widget class module name ***/
						if (!_childName) {
							_this._generatedChildNames || (_this._generatedChildNames = 0);
							_childName = 'generatedChildName' + _this._generatedChildNames++;
						}

					var
						_html = '',
						_child = _children [_childName],
						_childExisted = !!_child
					;
					_child
						? _child.set (_properties)
						: (_child = _this.addChild (_childName,_widgetClass,_properties))
					;
					_html = _child.get ('built')
						? _child.getHtml ()
						: '<div id="' + _child.nodeId ('shell') + '"></div>'
					;
					_childExisted ||
						Uize.copyInto (_suppliedState,{widgetClass:_widgetClassName})
					;
					if (!Uize.isEmpty (_suppliedState))
						_html +=
							'<script type="text/javascript">\n' +
								'$' + _child.get ('idPrefix') + ' = ' +
									Uize.Json.to (_suppliedState)
										.replace (/<script/g,'<s\\cript')
										.replace (/<\/script/g,'</s\\cript') +
								';\n' +
							'</script>'
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

				nodeId:function (_nodeName) {
					return Uize.Node.joinIdPrefixAndNodeId (this.get ('idPrefix'),_nodeName || '');
					/*?
						Instance Methods
							nodeId
								Returns a string, representing the fully namespaced ID for the specified node of the widget.

								SYNTAX
								............................................
								nodeIdSTR = myInstance.nodeId (nodeNameSTR);
								............................................

								The =nodeId= method is intended primarily for use within the HTML generator (usually a JST template) for a widget.
					*/
				},

				rootNodeCssClasses:function () {
					var
						_this = this,
						_extraClasses = _this._extraClasses,
						_cssBindings = _this.Class._cssBindings,
						_cssClasses = [_this.cssClass ()],
						_cssClassSuffix
					;
					for (var _property in _cssBindings)
						if (_cssClassSuffix = _cssBindings [_property] (_this.get (_property)))
							_cssClasses.push (_this.cssClass (_cssClassSuffix))
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
							_thisClass._cssClassNameGenerators || (_thisClass._cssClassNameGenerators = {})
					;
					if (!_cssClassNameGenerators [_thisClassName]) {
						var
							_inheritanceChain = [],
							_module = _thisClass
						;
						while (_module) {
							_inheritanceChain.unshift (_module);
							if (_module == _class) break;
							_module = _module.superclass;
						}
						_cssClassNameGenerators [_thisClassName] = _cssClassNameGeneratorFromModules (_inheritanceChain);
					}
					return _cssClassNameGenerators [_thisClassName] (_className);
				},

				_updateRootNodeClasses:function () {
					this.Class.enableRootNodeCssClasses && this.set ({_rootNodeCssClasses:this.rootNodeCssClasses ()});
				},

				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						_superclass.doMy (_this,'wireUi');

						/*** wire up handlers for state properties that have CSS bindings ***/
							var
								_cssBindings = _this.Class._cssBindings,
								_updateRootNodeClasses = function () {_this._updateRootNodeClasses ()},
								_wiringsForCssBindings = {}
							;
							for (var _property in _cssBindings)
								_wiringsForCssBindings ['Changed.' + _property] = _updateRootNodeClasses
							;
							_this.wire (_wiringsForCssBindings);

						/*** wire up handlers for state properties that have HTML bindings ***/
							var
								_getHtmlUpdaterForProperty = function (_property) {
									var
										_updaters = _htmlBindings [_property],
										_updatersLength = _updaters.length
									;
									return function () {
										var _propertyValue = _this.get (_property);
										for (var _updaterNo = -1; ++_updaterNo < _updatersLength;)
											_updaters [_updaterNo].call (_this,_propertyValue)
										;
									};
								},
								_htmlBindings = _this.Class._htmlBindings,
								_wiringsForHtmlBindings = {}
							;
							for (var _property in _htmlBindings)
								_wiringsForHtmlBindings ['Changed.' + _property] = _getHtmlUpdaterForProperty (_property)
							;
							_this.wire (_wiringsForHtmlBindings);

						/*** update UI ***/
							_this._updateRootNodeClasses ();
							for (var _eventName in _wiringsForHtmlBindings)
								_wiringsForHtmlBindings [_eventName] ()
							;
					}
				},

				superHtml:function (_input,_extraInput) {
					return this.Class.superclass.get ('html').process.call (this,Uize.copy (_input,_extraInput));
				}
			},

			staticMethods:{
				_needCss:function () {
					var
						_this = this,
						_moduleName = _this.moduleName
					;
					if (_cssAddedLookup [_moduleName] != _trueFlag) {
						_cssAddedLookup [_moduleName] = _trueFlag;
						_this.superclass._needCss && _this.superclass._needCss ();
						_this.cssModule && _this.cssModule.add ();
					}
				},

				cssBindings:function (_bindings) {
					Uize.copyInto (this._cssBindings,Uize.map (_bindings,Uize.resolveTransformer));
					/*?
						Static Methods
							Uize.Widget.V2.cssBindings
								Lets you declare one or more bindings of state properties to CSS classes on the root node.

								SYNTAX
								........................................
								MyWidgetClass.cssBindings (bindingsOBJ);
								........................................

								EXAMPLE
								......................................................
								MyNamespace.MyWidgetClass = Uize.Widget.V2.subclass ({
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
									this.setNodeInnerHtml (
										_nodeName,
										Uize.Xml.toAttributeValue (_propertyValue == null ? '' : _propertyValue)
									);
								};
							} else if (_bindingType == 'html' || _bindingType == 'innerHTML') {
								_updater = function (_propertyValue) {
									this.setNodeInnerHtml (_nodeName,_propertyValue == null ? '' : _propertyValue);
								};
							} else if (_bindingType == '?') {
								_updater = function (_propertyValue) {this.displayNode (_nodeName,!!_propertyValue)};
							} else if (Uize.String.startsWith (_bindingType,'style.')) {
								var _stylePropertyName = _bindingType.slice (6);
								_updater = function (_propertyValue) {
									this.setNodeStyle (_nodeName,Uize.pairUp (_stylePropertyName,_propertyValue));
								};
							} else {
								_updater = function (_propertyValue) {
									this.setNodeProperties (_nodeName,Uize.pairUp (_bindingType,_propertyValue));
								};
							}
						}
						return _updater;
					}
					var _htmlBindings = this._htmlBindings;
					Uize.forEach (
						_bindings,
						function (_updater,_property) {
							var _propertyHtmlBindings = _htmlBindings [_property] || (_htmlBindings [_property] = []);
							function _resolveAndPushUpdater (_updater) {
								_propertyHtmlBindings.push (_resolvePropertyUpdater (_property,_updater));
							}
							Uize.isArray (_updater)
								? Uize.forEach (_updater,_resolveAndPushUpdater)
								: _resolveAndPushUpdater (_updater)
							;
						}
					);
					/*?
						Static Methods
							Uize.Widget.V2.htmlBindings
								.

								SYNTAX
								.........................................
								MyWidgetClass.htmlBindings (bindingsOBJ);
								.........................................

								EXAMPLE
								......................................................
								MyNamespace.MyWidgetClass = Uize.Widget.V2.subclass ({
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
								- see also the companion `Uize.Widget.V2.cssBindings` feature declaration method
					*/
				}
			},

			staticProperties:{
				_cssBindings:{},
				_htmlBindings:{},
				enableRootNodeCssClasses:true
			},

			stateProperties:{
				_rootNodeCssClasses:{},
				_extraClasses:{
					name:'extraClasses',
					value:''
				}
			},

			set:{
				html:{
					process:function () {
						var
							_this = this,
							_children = _this.children,
							_htmlChunks = ['<div id="' + _this.nodeId () + '">'],
							_htmlChunksLength = 1
						;
						for (var _childName in _children)
							_htmlChunks [_htmlChunksLength++] = _children [_childName].getHtml ()
						;
						_htmlChunks [_htmlChunksLength] = '</div>';
						return _htmlChunks.join ('');
					}
				}
			}
		});

		_class.htmlBindings ({
			_rootNodeCssClasses:function (_rootNodeCssClasses) {
				_rootNodeCssClasses != _undefined && this.setNodeProperties ('',{className:_rootNodeCssClasses});
			}
		});

		Uize.copyInto (
			_class.nonInheritableStatics,
			{
				_cssClassNameGenerators:1,
				cssModule:1
			}
		);

		return _class;
	}
});

