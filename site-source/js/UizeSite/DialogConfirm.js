/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.DialogConfirm
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.DialogConfirm',
	superclass:'Uize.Widget.Dialog.Confirm',
	required:'UizeSite.Templates.Dialog.Confirm',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				built:false,
				height:80,
				html:UizeSite.Templates.Dialog.Confirm,
				width:450
			}
		});
	}
});

