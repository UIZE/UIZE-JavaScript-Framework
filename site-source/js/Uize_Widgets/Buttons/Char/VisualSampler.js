/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Char.VisualSampler Class
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
		The =Uize.Widgets.Buttons.Char.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Buttons.Char.Widget= class.

		*DEVELOPERS:* 
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Char.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Buttons.Char.Widget',
		'Uize.Widgets.CssUtil'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.keys (Uize.Widgets.CssUtil.sizes);
		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					flavor:['normal','positive','negative','primary'],
					size:_allSizes,
					text:'%'
				});
				this.addStateCombinationSamples ({
					size:_allSizes,
					text:['0','1','2','3','4','5','6','7','8','9','%','&plus;','&minus;']
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Buttons.Char.Widget
			}
		});
	}
});

