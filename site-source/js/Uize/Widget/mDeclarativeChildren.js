/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mDeclarativeChildren Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
	required:[
		'Uize.Class.mDeclarativeChildObjects',
		'Uize.Widget.mChildrenLinked'
	],
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				mixins:[
					Uize.Class.mDeclarativeChildObjects,
					Uize.Widget.mChildrenLinked
				],

				declarativeChildObjects:{
					declaration:'children',
						/*?
							Static Methods
								Uize.Widget.mDeclarativeChildren.children
									Lets you conveniently declare one or more child widgets, by specifying the children in an object.

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
					addMethod:'addChild',
					childObjectClassKey:'widgetClass',
					beforeAdd:function(_childName, _addChild) {
						var
							m = this,
							_linkedChildren = m.linkedChildren
						;

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
				}
			});
		};
	}
});
