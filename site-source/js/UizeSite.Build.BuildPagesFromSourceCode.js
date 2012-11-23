/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildPagesFromSourceCode Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 1
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =UizeSite.Build.BuildPagesFromSourceCode= package provides a method for building the HTML pages for viewing the source code of the UIZE JavaScript modules and examples on the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.BuildPagesFromSourceCode',
	required:'UizeSite.Build.File',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_urlsToBuild = [],
					_sourcePath = _params.sourcePath
				;

				/*** add URLs for source code pages for the JavaScript modules ***/
					_urlsToBuild.push.apply (
						_urlsToBuild,
						Uize.map (
							UizeSite.Build.File.getJsModules (_sourcePath).sort (),
							'"reference/source-code/" + value + ".html"'
						)
					);

				/*** add URLs for source code pages for the examples ***/
					_urlsToBuild.push.apply (
						_urlsToBuild,
						Uize.map (
							UizeSite.Build.File.getIndexableFiles (_sourcePath,'examples',/\.html$/),
							'"examples/source-code/" + value'
						)
					);

				/*** now build all the pages ***/
					UizeSite.Build.File.perform (Uize.copyInto ({url:_urlsToBuild},_params));
			};

		return _package;
	}
});

