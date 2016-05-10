/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.SiteAssistant.VisualTests Class
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
		The =UizeSite.Widgets.SiteAssistant.VisualTests= class implements a set of visual tests for the =UizeSite.Widgets.SiteAssistant.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Widgets.SiteAssistant.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'UizeSite.Widgets.SiteAssistant.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateTestCase ();
			},

			staticProperties:{
				widgetClass:UizeSite.Widgets.SiteAssistant.Widget
			}
		});
	}
});

