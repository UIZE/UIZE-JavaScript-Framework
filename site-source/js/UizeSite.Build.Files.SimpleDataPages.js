/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.SimpleDataPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeSite.Build.Files.SimpleDataPages= package provides a method to recurse a folder structure and build pages from =.simpledata= files using =.jst= templates.

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeSite.Build.Files.SimpleDataPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeSite.Build.Files.SimpleDataPages',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_fileSystem = this.fileSystem,
						_dotSimpledataExtensionRegExp = /\.simpledata$/,
						_sourcePath = _params.sourcePath
					;
					this.addFiles (
						_fileSystem.getFiles ({
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
										// there must be a corresponding .jst template file
									})
								);
							},
							pathTransformer:function (_path) {return _path.replace (_dotSimpledataExtensionRegExp,'')}
						})
					);
				}
			}
		});
	}
});

