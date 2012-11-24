/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildSimpleDataPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
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
		The =UizeSite.Build.BuildSimpleDataPages= package provides a method to recurse a folder structure and build pages from =.simpledata= files using =.jst= templates.

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeSite.Build.BuildSimpleDataPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeSite.Build.BuildSimpleDataPages',
	required:[
		'UizeSite.Build.File',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_dotSimpledataExtensionRegExp = /\.simpledata$/
			;

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _sourcePath = _params.sourcePath;

				UizeSite.Build.File.perform (
					Uize.copyInto (
						{
							url:_fileSystem.getFiles ({
								path:_sourcePath,
								recursive:true,
								pathMatcher:function (_path) {
									return (
										_dotSimpledataExtensionRegExp.test (_path) &&
											// path must end with .simpledata extension
										/\.[^\.\\\/]+$/.test (_path.replace (_dotSimpledataExtensionRegExp,'')) &&
											// path minus .simpledata extension must have a remaining real extension
										_fileSystem.fileExists ({
											path:_sourcePath + '/' + _path.replace (_dotSimpledataExtensionRegExp,'.jst')
										})
											// there must be a corresponding .jst template file
									);
								},
								pathTransformer:function (_path) {return _path.replace (_dotSimpledataExtensionRegExp,'')}
							})
						},
						_params
					)
				);
			};

		return _package;
	}
});

