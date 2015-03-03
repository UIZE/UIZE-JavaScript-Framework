/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Form.mDeclarativeElements Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.Form.mDeclarativeElements= mixin implements features to provide a declarative approach to adding form elements to a form.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Form.mDeclarativeElements',
	required:[
		'Uize.Widget.FormElements',
		'Uize.Widget.mDeclarativeChildren'
	],
	builder:function () {
		'use strict';

		return function (_class) {

			_class.declare({
				staticProperties:{
					mDeclarativeElements_elementsAdded:{}
				},
				staticMethods:{
					elements:function (_elements) { this.children(this.mDeclarativeElements_elementsAdded = _elements) }
						/*?
							Static Methods
								Uize.Widget.Form.mDeclarativeElements.elements
									.

									SYNTAX
									.........................................
									MyWidgetClass.elements (elementsOBJ);
									.........................................

									VERBOSE EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.Form.mDeclarativeElements.subclass ({
										elements:{
											menu:{
												text:'Ok',
												widgetClass:Uize.Widget.FormElement.Text,
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
												widgetClass:Uize.Widget.FormElement,
												selected:true
											}
										}
									});
									......................................................

									SHORT-HAND EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.Form.mDeclarativeElements.subclass ({
										elements:{
											menu:Uize.Widget.FormElement.Text,
											cancel:Uize.Button.FormElement
										}
									});
									......................................................
						*/
				},

				instanceMethods:{
					mDeclarativeChildObjects_children_getContainer:function (_childName) {
						var _elementsAdded = this.Class.mDeclarativeElements_elementsAdded;
						return _elementsAdded && _childName in _elementsAdded
							? this.children.elements
							: this
						;
					}
				}
			});
		};
	}
});
