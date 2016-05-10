/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.VisualSampler.Widget Class
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
		The =Uize.Widgets.VisualSampler.Widget= class implements a base class for widget visual samplers, to be subclassed when creating visual samplers for other widget classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Container.Widget',
	superclass:'Uize.Widget.V2',
	required:'Uize.Widgets.Container.Html',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Container.Html
			}
		});
	}
});

