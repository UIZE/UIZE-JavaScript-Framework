/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Seven.VisualSampler Class
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
		The =Uize.Widgets.SegmentDisplay.Seven.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.SegmentDisplay.Seven.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Seven.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'Uize.Widgets.SegmentDisplay.Seven.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					width:80,
					height:120,
					segmentThickness:16,
					value:['0','1','2','3','4','5','6','7','8','9']
				});
				this.addStateCombinationSamples ({
					width:80,
					height:120,
					segmentThickness:16,
					value:'3',
					segmentColor:['f00','0f0','00f','f0f','0ff','ff0']
				});
				this.addStateCombinationSamples ({
					width:80,
					height:120,
					segmentThickness:[8,16,24,32],
					value:'3'
				});
				this.addStateCombinationSamples ({
					width:80,
					height:120,
					segmentThickness:16,
					segmentGap:[0,1,3,6,9],
					value:'3'
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.SegmentDisplay.Seven.Widget
			}
		});
	}
});

