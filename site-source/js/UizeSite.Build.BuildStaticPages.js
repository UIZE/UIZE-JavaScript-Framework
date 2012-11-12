/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildStaticPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeSite.Build.BuildStaticPages= package provides a method to recurse a folder structure and build static pages from source files that are not handled by other build processes (such as static *.html* pages, *.css* files, *.gif*, *jpg*, and *.png* image files, etc.).

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeSite.Build.BuildStaticPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeSite.Build.BuildStaticPages',
	required:[
		'UizeSite.Build.File',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				UizeSite.Build.File.perform (
					Uize.copyInto (
						{
							url:Uize.Services.FileSystem.singleton ().getFiles ({
								path:_params.sourcePath,
								recursive:true,
								pathMatcher:/\.(gif|jpg|png|ico|html|css|htaccess)$/
							})
						},
						_params
					)
				);
			};

		return _package;
	}
});

