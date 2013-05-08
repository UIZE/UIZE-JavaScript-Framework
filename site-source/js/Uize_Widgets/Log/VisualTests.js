/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Log.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Widgets.Log.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Log.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Log.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'Uize.Widgets.Log.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;
				function _addTestCaseWithDummyMessages (_totalMessages) {
					var _log = _this.addStateTestCase ();
					Uize.forEach (_totalMessages,function () {_log.log ('a log message')});
				}
				_addTestCaseWithDummyMessages (0);
				_addTestCaseWithDummyMessages (1);
				_addTestCaseWithDummyMessages (5);
				_addTestCaseWithDummyMessages (20);
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Log.Widget
			}
		});
	}
});

