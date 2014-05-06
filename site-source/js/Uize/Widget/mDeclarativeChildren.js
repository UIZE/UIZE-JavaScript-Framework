/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mDeclarativeChildren Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mDeclarativeChildren= mixin implements features to provide a declarative approach to adding child widgets to a widget.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mDeclarativeChildren',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize
		;

		return function (_class) {
			_class.declare ({
				omegastructor:function () {
					var
						m = this,
						_declarativeChildren = m.Class.mDeclarativeChildren_children,
						_children = {}
					;

					// NOTE: Filter out children w/o widgetClass. They will be deferred loaded by some other mechanism. They were there for feature detection.
					// NOTE: When value is a function call the function in the context of this widget
					for (var _childName in _declarativeChildren) {
						var
							_declarativeChild = _declarativeChildren[_childName],
							_childProperties = _Uize.copy(
								_Uize.isFunction(_declarativeChild)
									? _declarativeChild.call(m, _childName)
									: _declarativeChild
							),
							_childWidgetClass = _childProperties.widgetClass
						;
					
						if (_childWidgetClass) {
							delete _childProperties.widgetClass;
							m.mDeclarativeChildren_getContainer(_childName).addChild(_childName, _childWidgetClass, _childProperties);
						}
					}
				},
				
				staticMethods:{
					children:function(_children) {
						var _declarativeChildren = this.mDeclarativeChildren_children;
						
						for (var _childName in _children) {
							var _childProperties = _children[_childName];
							
							// NOTE: support multiple calls to children that could potentially include the same child again w/ additional properties (for whatever reason)
							// As such we can't omit the children that don't have widgetClass set, yet, because the widgetClass *could* be added in a subsequent call to children. Will handle in constructor.
							_declarativeChildren[_childName] = _Uize.isFunction(_childProperties) && !_childProperties.declare // is a function, but not a class (since classes are functions)
								? _childProperties
								: _Uize.copyInto(
									_declarativeChildren[_childName] || {},
									!_Uize.isPlainObject(_childProperties) ? {widgetClass:_childProperties} : _childProperties
								)
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
											cancel:Uize.Button
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