/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.ViewSizeToggler.VisualTests Class
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
		The =Uize.Widgets.Buttons.ViewSizeToggler.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Buttons.ViewSizeToggler.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.ViewSizeToggler.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Buttons.ViewSizeToggler.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					viewSize:['small','large'],
					size:Uize.Widgets.StateValues.size
				});
				this.addStateCombinationTestCases ({
					enabled:[true,false],
					selected:[false,true]
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Buttons.ViewSizeToggler.Widget
			}
		});
	}
});

