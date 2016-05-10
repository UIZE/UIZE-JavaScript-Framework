/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.VisualTests= class implements a set of visual tests for the =Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					width:20,
					height:104,
					segmentGap:1
				});
				this.addStateCombinationTestCases ({
					height:[80,120,160]
				});
				this.addStateCombinationTestCases ({
					width:[1,10,20,40]
				});
				this.addStateCombinationTestCases ({
					width:20,
					height:104,
					segmentColor:['f00','0f0','00f','f0f','0ff','ff0']
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget
			}
		});
	}
});

