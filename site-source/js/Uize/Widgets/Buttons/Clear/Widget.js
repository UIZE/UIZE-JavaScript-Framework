/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Clear.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Buttons.Clear.Widget= class implements a localized clear button.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.Clear.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.Clear.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Clear.Widget',
	superclass:'Uize.Widgets.Buttons.Localized.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({hasLoc:true});
	}
});

