/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormDialog Class
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
		The =Uize.Widget.FormDialog= class serves as a thin widget to plumb the value of a =Uize.Widget.Form= widget (or subclass) as the dialog submission value.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.FormDialog',
	superclass:'Uize.Widget.Dialog',
	required: 'Uize.Widget.Dialog.mForm',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass({
			mixins: Uize.Widget.Dialog.mForm
		});
	}
});
