/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.Tooltip.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =UizeSite.Widgets.Tooltip.VisualSampler= class implements a visual sampler widget for the =UizeSite.Widgets.Tooltip.Widget= class.

		*DEVELOPERS:* 
*/

Uize.module ({
	name:'UizeSite.Widgets.Tooltip.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'UizeSite.Widgets.Tooltip.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addSample ({
					heading:'5. Static Methods... 5.2. Uize.Color.cloneTuple',
					body:'A method that is useful in the development of color space or encoding extensions, and that returns a tuple array, being a clone of the specified source tuple array.'
				});
			},

			staticProperties:{
				widgetClass:UizeSite.Widgets.Tooltip.Widget
			}
		});
	}
});

