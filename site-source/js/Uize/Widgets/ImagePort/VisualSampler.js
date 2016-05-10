/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ImagePort.VisualSampler Class
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
		The =Uize.Widgets.ImagePort.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.ImagePort.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.ImagePort.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'Uize.Widgets.ImagePort.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addSample ({
					alignX:.5,
					alignY:.5,
					sizingLowerBound:'fit',
					sizingUpperBound:'fill',
					sizingValue:1,
					width:700,
					height:500,
					imageUrl:Uize.pathToResources + Uize.modulePathResolver ('Uize.Widgets.ImagePort.TestAssets') + '/uize-50x50.gif'
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.ImagePort.Widget
			}
		});
	}
});

