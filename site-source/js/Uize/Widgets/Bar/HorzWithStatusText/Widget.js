/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bar.HorzWithStatusText.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Bar.HorzWithStatusText.Widget= class implements an abstract base class for horizontal bar widgets with overlayed status text, such as progress bars.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Bar.HorzWithStatusText.Widget= class...

			..............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Bar.HorzWithStatusText.VisualSampler
			..............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Bar.HorzWithStatusText.Widget',
	superclass:'Uize.Widget.Bar',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.Bar.HorzWithStatusText.Html',
		'Uize.Widgets.Bar.HorzWithStatusText.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			set:{
				html:Uize.Widgets.Bar.HorzWithStatusText.Html,
				orientation:'horizontal',
				minValue:0,
				value:0
			},

			staticProperties:{
				cssModule:Uize.Widgets.Bar.HorzWithStatusText.Css
			}
		});
	}
});

