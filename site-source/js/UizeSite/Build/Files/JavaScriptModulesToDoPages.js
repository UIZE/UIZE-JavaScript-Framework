/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.JavaScriptModulesToDoPages Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =UizeSite.Build.Files.JavaScriptModulesToDoPages= package provides a method for building the JavaScript module TO DO pages on the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Files.JavaScriptModulesToDoPages',
	required:'Uize.Build.Util',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					this.addFiles (
						Uize.map (
							Uize.Build.Util.getJsModuleTodos (_params).sort (),
							'"todo/modules/" + value + ".html"'
						)
					);
				}
			}
		});
	}
});

