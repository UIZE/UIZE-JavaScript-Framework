/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
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
		The =Uize.Widget.mBindings= mixin implements features to provide various different ways to bind state properties to DOM nodes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mBindings',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_forEach = _Uize.forEach,

			/*** Variables for Performance Optimization ***/
				_applyAll = _Uize.applyAll,

			/*** General Variables ***/
				_trueFlag = {},
				_cssAddedLookup = {},
				_classPrefixPerCssModule = {},
				_cssClassNameGenerators = {}
		;

		/*** Utility Functions ***/
			function _needCss (m) {
				var _moduleName = m.moduleName;
				if (_cssAddedLookup [_moduleName] != _trueFlag) {
					_cssAddedLookup [_moduleName] = _trueFlag;
					m.superclass && _needCss (m.superclass);
					m.cssModule && m.cssModule.add ();
				}
			}

			function _declareRootNodeClassesStateProperty (m) {
				m.stateProperties ({
					mBindings_rootNodeClasses:{
						derived:Function.apply (
							Function,
							Uize.keys (m.mBindings_css).concat (
								'extraClasses',
								'return this.mBindings_computeRootNodeClasses ()'
							)
						)
					}
				});
			}

		return function (_class) {
			_class.declare ({
				alphastructor:function () {
					var m = this;

					_needCss (m.Class);
					m.once (
						'wired',
						function () {
							/*** wire up handlers for state properties that have HTML bindings ***/
								var _wiringsForHtmlBindings = {};
								_forEach (
									m.Class.mBindings_html,
									function (_bindings,_property) {
										_wiringsForHtmlBindings ['Changed.' + _property] = function () {
											_applyAll (m,_bindings,[m.get (_property)]);
										};
									}
								);
								m.wire (_wiringsForHtmlBindings);

							/*** update UI ***/
								for (var _eventName in _wiringsForHtmlBindings)
									_wiringsForHtmlBindings [_eventName] ()
								;
						}
					);
				},

				instanceMethods:{
					mBindings_computeRootNodeClasses:function () {
						var
							m = this,
							_extraClasses = m.extraClasses,
							_cssBindings = m.Class.mBindings_css,
							_cssClasses = [m.cssClass ()],
							_cssClassSuffix
						;
						for (var _property in _cssBindings)
							if (_cssClassSuffix = _cssBindings [_property] (m.get (_property)))
								_cssClasses.push (m.cssClass (_cssClassSuffix))
						;
						return _cssClasses.join (' ') + (_extraClasses && ' ' + _extraClasses);
					},

					rootNodeCssClasses:function () {
						return this.mBindings_rootNodeClasses;
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
							_thisClassName = _thisClass.moduleName
						;
						if (!_cssClassNameGenerators [_thisClassName]) {
							var
								_module = _thisClass,
								_classPrefix,
								_classNameGeneratorChunks = [],
								_classPrefixesUsed = {}
							;
							while (_module) {
								if (
									(_classPrefix = _thisClass.cssClassPrefix.call (_module)) != _undefined &&
									!_classPrefixesUsed [_classPrefix]
								) {
									_classPrefixesUsed [_classPrefix] = 1;
									_classNameGeneratorChunks.unshift ('"' + _classPrefix + '"+cs');
								}
								_module = _module.superclass;
							}
							_cssClassNameGenerators [_thisClassName] =  Function (
								'nn',
								'var cs=(nn||"")&&"-"+nn;return ' + _classNameGeneratorChunks.join ('+" "+') + ';'
							);
						}
						return _cssClassNameGenerators [_thisClassName] (_className);
					}
				},

				staticMethods:{
					cssClassPrefix:function () {
						var
							_cssModule = this.cssModule,
							_cssModuleName
						;
						return (
							_cssModule &&
							(
								_classPrefixPerCssModule [_cssModuleName = _cssModule.moduleName] ||
								(_classPrefixPerCssModule [_cssModuleName] = _cssModuleName.replace (/\./g,'_'))
							)
						);
					},

					cssBindings:function (_bindings) {
						_Uize.copyInto (this.mBindings_css,_Uize.map (_bindings,_Uize.resolveTransformer));
						_declareRootNodeClassesStateProperty (this);
						/*?
							Static Methods
								Uize.Widget.mBindings.cssBindings
									Lets you declare one or more bindings of state properties to CSS classes on the root node.

									SYNTAX
									........................................
									MyWidgetClass.cssBindings (bindingsOBJ);
									........................................

									EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mBindings.subclass ({
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
									_bindingType = _nodeNameAndBindingType [1] || 'value'
								;
								if (_bindingType == 'value') {
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
								_updater.propertyName = _propertyName;
								_updater.nodeName = _nodeName;
								_updater.bindingType = _bindingType;
							}
							return _updater;
						}
						var _htmlBindings = this.mBindings_html;
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
								Uize.Widget.mBindings.htmlBindings
									.

									SYNTAX
									.........................................
									MyWidgetClass.htmlBindings (bindingsOBJ);
									.........................................

									EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mBindings.subclass ({
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
									- see also the companion `Uize.Widget.mBindings.cssBindings` feature declaration method
						*/
					}
				},

				staticProperties:{
					mBindings_css:{},
					mBindings_html:{},
					enableRootNodeCssClasses:true
				},

				stateProperties:{
					extraClasses:{value:''}
				},

				htmlBindings:{
					mBindings_rootNodeClasses:':className'
				}
			});

			_declareRootNodeClassesStateProperty (_class);
		};
	}
});

