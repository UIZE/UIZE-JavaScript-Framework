/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.SourceCodePages Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2015 UIZE
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
		The =UizeSite.Build.Files.SourceCodePages= build script builds HTML pages for viewing the source code of JavaScript modules and examples pages for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		JavaScript Module Source Code Pages
			A source code page is generated for every JavaScript module under the modules folder, including modules that are built from various non-JavaScript source files (such as CSS template files with the =.csst= file extension).

			The build script iterates through all the JavaScript modules contained inside the modules folder, builds a source code page for each module using the JavaScript template =~SOURCE-CODE-TEMPLATE.html= contained inside the =reference/source-code= folder and places the built source code page inside that folder, where the source code page's filename is the name of the module with the file extension =.html= appended (e.g. =Uize.Widget.html= for the =Uize.Widget= module).

		Example Source Code Pages
			A source code page is generated for every example page contained inside the =examples= folder.

			The build script iterates through all the example pages contained inside the =examples= folder, ignoring experimental examples prefixed with a "~" (tilde) character, builds a source code page for each example using the JavaScript template =~SOURCE-CODE-TEMPLATE.html= contained inside the =examples/source-code= folder and places the built source code page inside that folder, where the source code page's filename is the same as the example page's filename.

		NOTES
		- the summary info for this build script is output to the log file =UizeSite.Build.Files.SourceCodePages.log= under the =logs= folder

*/

Uize.module ({
	name:'UizeSite.Build.Files.SourceCodePages',
	required:[
		'Uize.Build.Util',
		'UizeSite.Build.Util'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						m = this,
						_sourcePath = _params.sourcePath
					;

					/*** add URLs for source code pages for the JavaScript modules ***/
						m.addFiles (
							Uize.map (
								Uize.Build.Util.getJsModules (_params).sort (),
								'"reference/source-code/" + value + ".html"'
							)
						);

					/*** add URLs for source code pages for the examples ***/
						m.addFiles (
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

