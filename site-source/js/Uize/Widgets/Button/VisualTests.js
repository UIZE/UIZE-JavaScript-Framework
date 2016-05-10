/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.VisualTests Class
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
		The =Uize.Widgets.Button.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Button.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Button.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;
		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					text:'CANCEL',
					flavor:'normal',
					enabled:[true,false],
					selected:[false,true],
					size:_allSizes
				});
				this.addStateCombinationTestCases ({
					text:'START',
					flavor:'positive',
					enabled:[true,false],
					selected:[false,true],
					size:_allSizes
				});
				this.addStateCombinationTestCases ({
					text:'DELETE',
					flavor:'negative',
					enabled:[true,false],
					selected:[false,true],
					size:_allSizes
				});
				this.addStateCombinationTestCases ({
					text:'SAVE',
					flavor:'primary',
					enabled:[true,false],
					selected:[false,true],
					size:_allSizes
				});
				this.addStateCombinationTestCases ({
					text:'RESET',
					flavor:'subdued',
					enabled:[true,false],
					selected:[false,true],
					size:_allSizes
				});
				this.addStateCombinationTestCases ({
					text:'Settings',
					enabled:[true,false],
					busy:[false,true],
					selected:[false,true],
					clickToSelect:[false,true],
					clickToDeselect:[false,true],
					state:['','over','down'],
					size:_allSizes
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Button.Widget
			}
		});
	}
});

