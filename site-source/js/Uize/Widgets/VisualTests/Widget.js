/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.VisualTests.Widget Class
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
		The =Uize.Widgets.VisualTests.Widget= class implements a widget for a collection of test cases for widget visual tests.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.VisualTests.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Container.Widget',
		'Uize.Widgets.VisualTests.TestCase.Widget',
		'Uize.Data.Combinations',
		'Uize.Widgets.Container.Html'
	],
	builder:function (_superclass) {
		'use strict';

		var _testCaseWidgetClass = Uize.Widgets.VisualTests.TestCase.Widget;

		return _superclass.subclass ({
			alphastructor:function () {
				this._totalTestCases = 0;
			},

			omegastructor:function () {
				this._testCases = this.addChild ('testCases',Uize.Widgets.Container.Widget);
			},

			instanceMethods:{
				addStateCombinationTestCases:function (_stateCombinationsSpecifier) {
					var m = this;
					Uize.Data.Combinations.forEach (
						_stateCombinationsSpecifier,
						function (_state) {m.addStateTestCase (_state)}
					);
				},

				addStateTestCase:function (_state) {
					var m = this;
					return m._testCases
						.addChild ('testCase' + m._totalTestCases++,_testCaseWidgetClass,{state:Uize.copy (_state)})
						.addChild ('widget',m.Class.widgetClass,_state)
					;
				}
			},

			staticProperties:{
				widgetClass:null // override this in a subclass
			},

			set:{
				built:false,
				html:Uize.Widgets.Container.Html
			}
		});
	}
});

