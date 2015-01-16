/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.IndexPages.JavaScriptModulesToDo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.IndexPages.JavaScriptModulesToDo= module defines a file builder for the JavaScript Modules TO DO index page of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.IndexPages.JavaScriptModulesToDo',
	required:[
		'UizeSite.Build.FileBuilders.IndexPages',
		'Uize.Build.Util'
	],
	builder:function () {
		'use strict';

		return UizeSite.Build.FileBuilders.IndexPages.getIndexPageUrlHandler (
			'JavaScript modules TO DO index page',
			'todo/modules',
			function () {return Uize.Build.Util.getJsModuleTodos (this.params)},
			'todo/modules'
		);
	}
});

