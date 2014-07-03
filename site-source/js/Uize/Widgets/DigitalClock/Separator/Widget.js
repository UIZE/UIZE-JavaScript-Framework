/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Separator.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Widgets.DigitalClock.Separator.Widget= module implements a widget class for a separator for the hours, minutes, and seconds components of a digital clock display.

		*DEVELOPERS:*

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.DigitalClock.Separator.Widget= class...

			..............................................................
			<< widget >>

			widgetClass: Uize.Widgets.DigitalClock.Separator.VisualSampler
			..............................................................
*/

Uize.module ({
	name:'Uize.Widgets.DigitalClock.Separator.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.DigitalClock.Separator.Html',
		'Uize.Widgets.DigitalClock.Separator.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.DigitalClock.Separator.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.DigitalClock.Separator.Css
			}
		});
	}
});

