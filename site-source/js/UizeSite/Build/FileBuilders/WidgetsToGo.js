/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.WidgetsToGo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.WidgetsToGo= module defines a utilities package for the various Widget To Go file builder modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.WidgetsToGo',
	builder:function () {
		'use strict';

		return Uize.package ({
			widgetsToGoPath:'widgets/',
			threeFoldersDeepRegExp:/^([^\\\/]+)[\\\/]([^\\\/]+)[\\\/]([^\\\/]+)[\\\/][^\\\/]+$/,
			urlizeWidgetTitle:function (_widget) {
				return _widget.title.toLowerCase ().replace (/\s+/g,'-');
			}
		});
	}
});

