/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Localized.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Buttons.Localized.Widget= module implements an abstract base class for localized button widget classes.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.Localized.Widget= class...

			.........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.Localized.VisualSampler
			.........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Localized.Widget',
	superclass:'Uize.Widgets.Button.Widget',
	required:[],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				text:{derived:'loc_label'}
			}
		});
	}
});

