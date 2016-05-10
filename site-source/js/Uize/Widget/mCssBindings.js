/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mCssBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 7
	codeCompleteness: 30
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mCssBindings= mixin implements features to provide various different ways to bind state properties to CSS classes on the root node of a widget.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mCssBindings',
	required:'Uize.Widget.mHtmlBindings',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_mCssBindings_bindings = 'mCssBindings_bindings',

			/*** General Variables ***/
				_trueFlag = {},
				_cssAddedLookup = {},
				_classPrefixPerCssModule = {},
				_cssClassNameGenerators = {},
				_cssClassCachePerModule = {},
				_cachedRootNodeClassesDerivations = {}
		;

		/*** Utility Functions ***/
			function _declareRootNodeClassesStateProperty (m) {
				var
					_cssBindings = m [_mCssBindings_bindings],
					_bindingProperties = _Uize.keys (_cssBindings),
					_cachedDerivationKey = _bindingProperties.join ()
				;
				m.stateProperties ({
					mCssBindings_rootNodeClasses:{
						derived:_cachedRootNodeClassesDerivations [_cachedDerivationKey] ||
						(
							_cachedRootNodeClassesDerivations [_cachedDerivationKey] = {
								properties:_bindingProperties.concat ('extraClasses'),
								derivation:Function (
									'var ' +
										'm=this,a=arguments,c=m.Class,b=c.' + _mCssBindings_bindings +
										Uize.map (
											_bindingProperties,
											function (_property,_propertyNo) {
												return ',p' + _propertyNo + '=b[\'' + _property + '\'](a[' + _propertyNo + ']),c' + _propertyNo + '=p' + _propertyNo + '&&m.cssClass(p' + _propertyNo + ')';
											}
										).join ('') +
										',e=a[' + _bindingProperties.length + ']' +
									';' +
									'return ' +
										'm.cssClass(\'\')' +
										Uize.map (
											_bindingProperties,
											function (_property,_propertyNo) {
												return '+(c' + _propertyNo + '?\' \'+c' + _propertyNo + ':\'\')';
											}
										).join ('') +
										'+(e?\' \'+e:\'\')' +
									';'
								)
							}
						)
					}
				});
			}

		return function (_class) {
			_class.declare ({
				mixins:Uize.Widget.mHtmlBindings,

				alphastructor:function () {
					function _needCss (m) {
						var _moduleName = m.moduleName;
						if (_cssAddedLookup [_moduleName] != _trueFlag) {
							_cssAddedLookup [_moduleName] = _trueFlag;
							m.superclass && _needCss (m.superclass);
							m.cssModule && m.cssModule.add ();
						}
					}

					_needCss (this.Class);
				},

				instanceMethods:{
					rootNodeCssClasses:function () {
						return this.mCssBindings_rootNodeClasses;
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
							_cssClassCache =
								_cssClassCachePerModule [_thisClassName] ||
								(_cssClassCachePerModule [_thisClassName] = {}),
							_cssClass = _cssClassCache [_className]
						;
						if (!_cssClass) {
							var _cssClassNameGenerator = _cssClassNameGenerators [_thisClassName];
							if (!_cssClassNameGenerator) {
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
								_cssClassNameGenerator = _cssClassNameGenerators [_thisClassName] =  Function (
									'cn',
									'var cs=(cn||"")&&"-"+cn;return ' + _classNameGeneratorChunks.join ('+" "+') + ';'
								);
							}
							_cssClass = _cssClassCache [_className] = _cssClassNameGenerator (_className);
						}
						return _cssClass;
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
						_Uize.copyInto (this [_mCssBindings_bindings],_Uize.map (_bindings,_Uize.resolveTransformer));
						_declareRootNodeClassesStateProperty (this);
						/*?
							Static Methods
								Uize.Widget.mCssBindings.cssBindings
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
										cssBindings:{
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
					}
				},

				staticProperties:{
					mCssBindings_bindings:{}
				},

				stateProperties:{
					extraClasses:{value:''}
				},

				htmlBindings:{
					mCssBindings_rootNodeClasses:':@class'
				}
			});

			_declareRootNodeClassesStateProperty (_class);
		};
	}
});

