/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Directional.VisualTests Class
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
		The =Uize.Widgets.Buttons.Directional.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Buttons.Directional.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Directional.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Buttons.Directional.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					directionX:[-1,0,1],
					directionY:[-1,0,1],
					size:Uize.Widgets.StateValues.size
				});
				this.addStateCombinationTestCases ({
					directionX:1,
					directionY:0,
					flavor:['normal','positive','negative','primary'],
					enabled:[true,false],
					busy:[false,true],
					selected:[false,true],
					state:['','over','down']
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Buttons.Directional.Widget
			}
		});
	}
});

