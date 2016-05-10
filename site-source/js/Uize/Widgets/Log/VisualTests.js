/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Log.VisualTests Class
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
		The =Uize.Widgets.Log.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Log.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Log.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.Log.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				function _addTestCaseWithDummyMessages (_totalMessages,_properties) {
					var _log = m.addStateTestCase (_properties);
					Uize.forEach (_totalMessages,function () {_log.log ('a log message')});
				}
				_addTestCaseWithDummyMessages (0);
				_addTestCaseWithDummyMessages (1);
				_addTestCaseWithDummyMessages (5);
				_addTestCaseWithDummyMessages (20);
				Uize.forEach (
					Uize.Widgets.StateValues.locale,
					function (_locale) {_addTestCaseWithDummyMessages (1,{locale:_locale})}
				);
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Log.Widget
			}
		});
	}
});

