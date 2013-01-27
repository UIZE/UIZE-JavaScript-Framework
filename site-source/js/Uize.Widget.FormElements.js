/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElements Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FormElements= class serves as a thin container widget of =Uize.Widget.FormElement= or =Uize.Widget.Form= widgets.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FormElements',
	required:'Uize.Widget.FormElement',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Override addChild method to provide extra handling ***/
			_class.prototype.addChild = function(_childName, _childInstanceOrClass, _elementProperties) {
				var
					_this = this,
					_parentForm = _this.parent,
					_childElement = _superclass.prototype.addChild.call (
						_this,
						_childName,
						_childInstanceOrClass || Uize.Widget.FormElement,
						Uize.copyInto(
							{
								value:_parentForm
									? (_this.parent.get('value') || {})[_childName]
									: null
							},
							_elementProperties
						)
					)
				;

				_this.fire({name:'Element Added', element:_childElement});

				return _childElement;
			};

		return _class;
	}
});
