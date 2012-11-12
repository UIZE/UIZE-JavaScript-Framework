/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildSimpleDocPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeSite.Build.BuildSimpleDocPages= package provides a method to build all the SimpleDoc documentation for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeSite.Build.BuildSimpleDocPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeSite.Build.BuildSimpleDocPages',
	required:[
		'UizeSite.Build.File',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_urlsToBuild = [],
					_sourcePath = _params.sourcePath
				;

				/*** add URLs for all .simple files (explainers, appendixes, JavaScript reference pages, etc.) ***/
					var _dotSimpleExtensionRegExp = /\.simple$/;
					_urlsToBuild.push.apply (
						_urlsToBuild,
						_fileSystem.getFiles ({
							path:_sourcePath,
							recursive:true,
							pathMatcher:_dotSimpleExtensionRegExp,
							pathTransformer:function (_path) {return _path.replace (_dotSimpleExtensionRegExp,'.html')}
						})
					);

				/*** add URLs for all JavaScript module reference files ***/
					_urlsToBuild.push.apply (
						_urlsToBuild,
						Uize.map (
							UizeSite.Build.File.getJsModules (_sourcePath).sort (),
							'"reference/" + value + ".html"'
						)
					);

				/*** now build all the pages ***/
					UizeSite.Build.File.perform (Uize.copyInto ({url:_urlsToBuild},_params));
			};

		return _package;
	}
});

