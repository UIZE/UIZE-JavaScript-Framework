/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Reset.Widget Class
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
		The =Uize.Widgets.Buttons.Reset.Widget= class implements a localized reset button.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.Reset.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.Reset.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Reset.Widget',
	superclass:'Uize.Widgets.Buttons.Localized.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({hasLoc:true});
	}
});

