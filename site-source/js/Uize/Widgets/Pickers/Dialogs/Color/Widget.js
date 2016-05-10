/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Pickers.Dialogs.Color.Widget
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widgets.Pickers.Dialogs.Color.Widget= widget lets the user select a color from a modal dialog containing a color picker widget.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Pickers.Dialogs.Color.Widget',
	required:'Uize.Widgets.ColorSliders.Vert.Combo.Widget',
	superclass:'Uize.Widgets.Dialog.Picker.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				keepOpen:true,
				valueWidgetClass:Uize.Widgets.ColorSliders.Vert.Combo.Widget
			}
		});
	}
});

