/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Char.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Widgets.Buttons.Char.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Buttons.Char.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Char.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Buttons.Char.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;
		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					size:_allSizes,
					text:['0','1','2','3','4','5','6','7','8','9','%','&plus;','&minus;']
				});
				this.addStateCombinationTestCases ({
					size:_allSizes,
					text:['M+','M-','MR','CE','MC','&plus;/&minus;'],
					doubleChar:true
				});
				this.addStateCombinationTestCases ({
					size:_allSizes,
					state:'',
					text:'%'
				});
				this.addStateCombinationTestCases ({
					size:_allSizes,
					state:'active',
					text:'%'
				});
				this.addStateCombinationTestCases ({
					size:_allSizes,
					enabled:false,
					text:'%'
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Buttons.Char.Widget
			}
		});
	}
});

