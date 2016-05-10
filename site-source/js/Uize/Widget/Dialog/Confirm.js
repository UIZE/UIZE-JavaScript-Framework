/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Confirm
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Confirm= class implements a confirmation dialog that can be used by the =confirm= and =inform= methods of the =Uize.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name: 'Uize.Widget.Dialog.Confirm',
	required: 'Uize.Widget.Dialog.mConfirm',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass({
			mixins: Uize.Widget.Dialog.mConfirm
		});
		
	}
});

