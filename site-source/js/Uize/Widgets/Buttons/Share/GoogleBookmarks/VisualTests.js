/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Share.GoogleBookmarks.VisualTests Class
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
		The =Uize.Widgets.Buttons.Share.GoogleBookmarks.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Buttons.Share.GoogleBookmarks.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Share.GoogleBookmarks.VisualTests',
	superclass:'Uize.Widgets.Buttons.Share.VisualTestsBase',
	required:'Uize.Widgets.Buttons.Share.GoogleBookmarks.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				widgetClass:Uize.Widgets.Buttons.Share.GoogleBookmarks.Widget
			}
		});
	}
});

