/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mDeclarativeChildren Mixin
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
		The =Uize.Widget.mDeclarativeChildren= mixin implements features to provide a declarative approach to adding child widgets to a widget.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mDeclarativeChildren',
	required:'Uize.Widget.mChildrenLinked',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize
		;

		return function (_class) {
			_class.declare ({
				mixins:_Uize.Widget.mChildrenLinked,

				omegastructor:function () {
					var
						m = this,
						_linkedChildren = m.linkedChildren
					;
					Uize.forEach (
						m.Class.mDeclarativeChildren_children,
						function (_declarativeChild,_childName) {
							function _addChild () {
								var
									_childWidgetClass = _declarativeChild._widgetClass,
									_childProperties = _declarativeChild._properties
								;

								// When value is a function call the function in the context of this widget
								if (_declarativeChild._isFunction) {
									_childProperties = _Uize.copy(_childProperties.call(m, _childName));
									_childWidgetClass = _childProperties.widgetClass;
									delete _childProperties.widgetClass;
								}

								// NOTE: Filter out children w/o widgetClass. They will be deferred loaded by some other mechanism. They were there for feature detection.
								return _childWidgetClass && m.mDeclarativeChildren_getContainer(_childName).addChild(
									_childName,
									_childWidgetClass,
									_childProperties
								);
							}
							var _linkedChildrenCondition = '~' + _childName;
							if (_linkedChildren.get (_linkedChildrenCondition) === false) {
								_linkedChildren.once (
									_linkedChildrenCondition,
									function () {
										var _child = _addChild ();
										m.isWired && _child.insertUi ();
									}
								);
							} else {
								_addChild ();
							}
						}
					);
				},

				staticMethods:{
					children:function(_children) {
						var _declarativeChildren = this.mDeclarativeChildren_children;

						for (var _childName in _children) {
							var
								_childDeclaration = _children[_childName],
								_childDeclarationIsFunction = _Uize.isFunction(_childDeclaration) && !_childDeclaration.declare, // is a function, but not a class (since classes are functions)
								_childDeclarationIsPlainObject = _Uize.isPlainObject(_childDeclaration),
								_childProperties = !_childDeclarationIsFunction && !_childDeclarationIsPlainObject ? {widgetClass:_childDeclaration} : _childDeclaration,
								_childWidgetClass = !_childDeclarationIsFunction && _childProperties.widgetClass
							;

							// Need to strip out the widgetClass from the childProperties, which means we need to copy it just in case
							// it's a shared object
							if (!_childDeclarationIsFunction && _childDeclarationIsPlainObject && _childWidgetClass) {
								_childProperties = _Uize.copy(_childProperties);
								delete _childProperties.widgetClass;
							}

							// NOTE: support multiple calls to children that could potentially include the same child again w/ additional properties
							// As such we can't omit the children that don't have widgetClass set, yet, because the widgetClass *could* be added in a subsequent call to children. Will handle in constructor.
							var _previous =
								_declarativeChildren[_childName] || (_declarativeChildren[_childName] = {_properties:{}})
							;
							_previous._widgetClass = _childWidgetClass || _previous._widgetClass;
							_previous._isFunction = _childDeclarationIsFunction;
							_childDeclarationIsFunction
								? (_previous._properties = _childProperties)
								: _Uize.copyInto (_previous._properties || {},_childProperties)
							;
						}
						/*?
							Static Methods
								Uize.Widget.mDeclarativeChildren.children
									.

									SYNTAX
									.........................................
									MyWidgetClass.children (childrenOBJ);
									.........................................

									VERBOSE EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mDeclarativeChildren.subclass ({
										children:{
											menu:{
												text:'Ok',
												widgetClass:Uize.Widget,
												value:'foo',
												values:[
													{
														name:'foo',
														value:'Foo'
													},
													{
														name:'bar',
														value:'Bar'
													}
												]
											},
											cancel:{
												text:'Cancel',
												widgetClass:Uize.Widget.Button,
												selected:true
											}
										}
									});
									......................................................

									SHORT-HAND EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mDeclarativeChildren.subclass ({
										children:{
											menu:Uize.Widget,
											cancel:Uize.Widget.Button
										}
									});
									......................................................

									FUNCTION EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mDeclarativeChildren.subclass ({
										children:{
											menu:function() {
												// "this" is the widget
												return {
													widgetClass:this._menuWidgetClass,
													value'foo'
												};
											}
										}
									});
									......................................................
						*/
					}
				},

				staticProperties:{
					mDeclarativeChildren_children:{}
				},

				instanceMethods:{
					mDeclarativeChildren_getContainer:function() { return this }
				}
			});
		};
	}
});
