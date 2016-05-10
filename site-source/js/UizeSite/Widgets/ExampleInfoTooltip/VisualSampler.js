/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.ExampleInfoTooltip.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Widgets.ExampleInfoTooltip.VisualSampler= class implements a visual sampler widget for the =UizeSite.Widgets.ExampleInfoTooltip.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Widgets.ExampleInfoTooltip.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'UizeSite.Widgets.ExampleInfoTooltip.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addSample ({
					heading:'3D Rotation Viewer',
					body:'Easily create a 3D rotation viewer in UIZE that lets users rotate the view of an object a full 360 degrees using a mouse, or finger on the Apple iPad.'
				});
			},

			set:{
				samplerWidgetClass:UizeSite.Widgets.ExampleInfoTooltip.Widget
			}
		});
	}
});

