/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.VisualTests Class
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Slider.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Slider.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Slider.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Slider.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					fullColor:['#f00','#0f0','#00f'],
					size:_allSizes,
					trackLength:400,
					orientation:'horizontal',
					value:750,
					maxValue:1000
				});
				this.addStateCombinationTestCases ({
					fullColor:'#fff',
					emptyColor:'#666',
					size:_allSizes,
					trackLength:400,
					orientation:'horizontal',
					value:750,
					maxValue:1000
				});
				this.addStateCombinationTestCases ({
					trackLength:400,
					orientation:['horizontal','vertical'],
					value:[0,500,1000],
					size:_allSizes,
					maxValue:1000
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Slider.Widget
			}
		});
	}
});

