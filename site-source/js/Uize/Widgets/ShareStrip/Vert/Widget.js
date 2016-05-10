/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ShareStrip.Vert.Widget Class
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
		The =Uize.Widgets.ShareStrip.Vert.Widget= module implements a horizontal share strip widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ShareStrip.Vert.Widget= class...

			.......................................................
			<< widget >>

			widgetClass: Uize.Widgets.ShareStrip.Vert.VisualSampler
			.......................................................
*/

Uize.module ({
	name:'Uize.Widgets.ShareStrip.Vert.Widget',
	superclass:'Uize.Widgets.ShareStrip.Widget',
	required:'Uize.Widgets.ShareStrip.Vert.Css',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				cssModule:Uize.Widgets.ShareStrip.Vert.Css
			}
		});
	}
});

