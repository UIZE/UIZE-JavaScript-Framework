/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Picker= widget acts as a base class for various value picker dialogs, such as date picker dialogs, color picker dialogs, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		### In a Nutshell
			- intended to be subclassed to create value picker dialogs for specific types of values, such as dates, colors, etc.
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker',
	required:'Uize.Widget.Dialog.mPicker',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.Dialog.mPicker
		});
	}
});

