/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mWidthHeight Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widget.mWidthHeight= module implements a simple mixin to add =width= and =height= state properties to a widget class and bind their values to the =width= and =height= style properties of the root node of the widget.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mWidthHeight',
	required:'Uize.Widget.mHtmlBindings',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				mixins:Uize.Widget.mHtmlBindings,

				stateProperties:{
					width:{},
					height:{}
				},

				htmlBindings:{
					width:':style.width',
					height:':style.height'
				}
			});
		};
	}
});
