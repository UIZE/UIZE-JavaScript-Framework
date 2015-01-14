/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mChildrenLinked Mixin
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
		The =Uize.Widget.mChildrenLinked= mixin implements features to control when child widgets are considered linked to their parent widget.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mChildrenLinked',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				alphastructor:function () {
					this.linkedChildren = Uize.Class ();
				},

				omegastructor:function () {
					var
						m = this,
						_childrenLinked = m.Class.mChildrenLinked_childrenLinked,
						_linkedChildren = m.linkedChildren
					;
					Uize.isEmpty (_childrenLinked) ||
						Uize.forEach (
							_childrenLinked,
							function (_childLinkedCondition,_childName) {
								var _linkedChildrenPropertyName = '~' + _childName;
								_linkedChildren.set (_linkedChildrenPropertyName,m.isMet (_childLinkedCondition));
								m.onChange (
									_childLinkedCondition,
									function (_isLinked) {_linkedChildren.set (_linkedChildrenPropertyName,_isLinked)}
								);
							}
						)
					;
				},

				staticProperties:{
					mChildrenLinked_childrenLinked:{}
				},

				staticMethods:{
					childrenLinked:function (_childrenLinked) {
						Uize.copyInto (this.mChildrenLinked_childrenLinked,_childrenLinked);
					}
				}
			});
		};
	}
});
