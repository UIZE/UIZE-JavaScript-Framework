/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElements Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.FormElements',
	required:'Uize.Widget.FormElement',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				addChild:function (_childName, _childInstanceOrClass, _elementProperties) {
					var
						m = this,
						_parentForm = m.parent,
						_childElement = _superclass.doMy (
							m,
							'addChild',
							[
								_childName,
								_childInstanceOrClass || Uize.Widget.FormElement,
								Uize.copyInto(
									{
										value:_parentForm
											? (m.parent.get('value') || {})[_childName]
											: null
									},
									_elementProperties
								)
							]
						)
					;

					m.fire({name:'Element Added', element:_childElement});

					return _childElement;
				}
			}
		});
	}
});
