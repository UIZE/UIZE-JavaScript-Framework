/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mWeb Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 8
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.mWeb= module is a mixin module that provides an implementation for =Uize.Web=-related features that can be mixed into a =Uize.Widget= subclass.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.mWeb',
	required:'Uize.Web',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize
		;

		return function(_class) {
			_class.declare({
				instanceMethods:{
					web:function (_nodeBlobOrChildWidget) {
						return _Uize.Web(
							_Uize.isObject(_nodeBlobOrChildWidget) && _Uize.isFunction(_nodeBlobOrChildWidget.getNode)
								? _nodeBlobOrChildWidget.getNode() // want to wrap a Uize.Web object on the child widget's root node
								: this.getNode(_nodeBlobOrChildWidget) // want to wrap a Uize.Web object around a child node
						);
						/*?
							Instance Methods
								web
									Returns a =Uize.Web= object reference, allowing for syntax-friendly manipulation and/or interrogation of the specified implied node(s) of the widget.

									SYNTAX
									..................................................
									webOBJ = widgetOBJ.web(impliedNodeSTRorBLOB);
									..................................................

									EXAMPLE
									...........................................
									var knob = this.web('knob');
									...........................................

									Returns a =Uize.Web= object that contains the "knob" implied node of the widget.

									EXAMPLE
									.........................................
									var rootNode = this.web();
									.........................................

									Returns a =Uize.Web= object that contains the `root node` of the widget.

									VARIATION
									..................................................
									webOBJ = widgetOBJ.web(childWidgetOBJ);
									..................................................

									EXAMPLE
									...........................................
									var childRootNode = mySlider.web(this.children.foo);
									...........................................

									Returns a =Uize.Web= object that contains the `root node` node of the =foo= child widget.

									NOTES
									- The =impliedNodeSTRorBLOB= parameter can be a string specifying the name of the implied node, or an object reference to the implied node.
									- When the =impliedNodeSTRorBLOB= parameter has a value of =null=, then an empty =Uize.Web= object is returned.
									- When the =impliedNodeSTRorBLOB= parameter has a value of =undefined= or is not specified, then the root node of the widget is contained by the returned =Uize.Web= object. This has the same effect as specifying the empty string. (i.e. =web()= is equivalent to =web('')=)
									- See related =getNode= instance method of =Uize.Widget=
									- See also =Uize.Web= object
						*/
					}
				}
			});
		};
	}
});
