/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 30
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mBindings= mixin is an aggregator mixin that mixes in the =Uize.Widget.mHtmlBindings= and =Uize.Widget.mCssBindings= mixins.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mBindings',
	required:[
		'Uize.Widget.mHtmlBindings',
		'Uize.Widget.mCssBindings'
	],
	builder:function () {
		'use strict';

		return [
			Uize.Widget.mHtmlBindings,
			Uize.Widget.mCssBindings
		];
	}
});

