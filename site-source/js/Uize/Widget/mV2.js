/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mV2 Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 8
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.mV2= class implements the next generation widget base class and is currently under development.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mV2',
	required:[
		'Uize.Widget.mHtmlBindings',
		'Uize.Widget.mCssBindings',
		'Uize.Widget.mChildrenLinked',
		'Uize.Widget.mEventBindings',
		'Uize.Widget.mChildBindings',
		'Uize.Widget.mDeclarativeChildren',
		'Uize.Widget.mLoc'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Widget = _Uize.Widget
		;

		return function (_class) {
			_class.declare ({
				mixins:[
					_Uize_Widget.mHtmlBindings,
					_Uize_Widget.mCssBindings,
					_Uize_Widget.mChildrenLinked,
					_Uize_Widget.mEventBindings,
					_Uize_Widget.mChildBindings,
					_Uize_Widget.mDeclarativeChildren, // this needs to be after mChildBindings when it's added for performance reasons, so that children can be added w/ bound initial state
					_Uize_Widget.mLoc
				],

				treeInheritedStateProperties:{
					size:{value:'medium'}
				},

				cssBindings:{
					sizeInherited:'value'
				},

				set:{
					html:''
				}
			});
		};
	}
});

