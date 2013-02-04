/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.SourceCodePages Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =UizeSite.Build.Files.SourceCodePages= package provides a method for building the HTML pages for viewing the source code of the UIZE JavaScript modules and examples on the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Files.SourceCodePages',
	required:'UizeSite.Build.Util',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_this = this,
						_sourcePath = _params.sourcePath
					;

					/*** add URLs for source code pages for the JavaScript modules ***/
						_this.addFiles (
							Uize.map (
								UizeSite.Build.Util.getJsModules (_sourcePath).sort (),
								'"reference/source-code/" + value + ".html"'
							)
						);

					/*** add URLs for source code pages for the examples ***/
						_this.addFiles (
							Uize.map (
								UizeSite.Build.Util.getIndexableFiles (_sourcePath,'examples',/\.html$/),
								'"examples/source-code/" + value'
							)
						);
				}
			}
		});
	}
});

