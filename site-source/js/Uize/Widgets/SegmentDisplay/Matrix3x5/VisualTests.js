/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Matrix3x5.VisualTests Class
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
		The =Uize.Widgets.SegmentDisplay.Matrix3x5.VisualTests= class implements a set of visual tests for the =Uize.Widgets.SegmentDisplay.Matrix3x5.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Matrix3x5.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'Uize.Widgets.SegmentDisplay.Matrix3x5.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					value:['0','1','2','3','4','5','6','7','8','9']
				});
				this.addStateCombinationTestCases ({
					value:'3',
					segmentColor:['f00','0f0','00f','f0f','0ff','ff0']
				});
				this.addStateCombinationTestCases ({
					value:'3',
					segmentGap:[0,1,3,6]
				});
				this.addStateCombinationTestCases ({
					value:'3',
					width:[100,150,200],
					height:[100,150,200]
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.SegmentDisplay.Matrix3x5.Widget
			}
		});
	}
});

