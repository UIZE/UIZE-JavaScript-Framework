/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RatingStars.VisualTests Class
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
		The =Uize.Widgets.RatingStars.VisualTests= class implements a set of visual tests for the =Uize.Widgets.RatingStars.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.RatingStars.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.RatingStars.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					value:2.5,
					maxValue:5,
					size:Uize.Widgets.StateValues.size
				});
				this.addStateCombinationTestCases ({
					value:Uize.map (7,'key / 2'),
					maxValue:3
				});
				this.addStateCombinationTestCases ({
					value:Uize.map (11,'key / 2'),
					maxValue:5
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.RatingStars.Widget
			}
		});
	}
});

