/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Clear.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Widgets.Buttons.Clear.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Buttons.Clear.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Clear.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'Uize.Widgets.Buttons.Clear.Widget',
	builder:function (_superclass) {
		'use strict';

		var
			_allSizes = ['tiny','small','medium','large'],
			_allLocales = ['en-US','de-DE','fr-FR','ja_JP','nl-NL','ru-RU','zh-CN']
		;

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationTestCases ({
					locale:_allLocales,
					size:_allSizes
				});
				this.addStateCombinationTestCases ({
					enabled:[true,false],
					selected:[false,true]
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Buttons.Clear.Widget
			}
		});
	}
});

