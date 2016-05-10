/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Form.Input.Select.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Widgets.Form.Input.Select.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Form.Input.Select.Widget= class.

		*DEVELOPERS:*
*/

Uize.module ({
	name:'Uize.Widgets.Form.Input.Select.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Form.Input.Select.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_testValues = [
					{
						name:'option1',
						displayName:'Option 1'
					},
					{
						name:'option2',
						displayName:'Option 2'
					},
					{
						name:'option3',
						displayName:'Option 3'
					}
				]
		;

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					size:Uize.Widgets.StateValues.size,
					values:[_testValues]
				});
				this.addStateTestCase ({
					values:_testValues,
					value:'Option 2'
				});
				this.addStateTestCase ({
					values:_testValues,
					enabled:false
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Form.Input.Select.Widget
			}
		});
	}
});

