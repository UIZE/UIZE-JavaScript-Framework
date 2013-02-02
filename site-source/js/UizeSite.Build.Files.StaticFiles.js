/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.StaticFiles Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		The =UizeSite.Build.Files.StaticFiles= package provides a method to recurse a folder structure and build static pages from source files that are not handled by other build processes (such as static *.html* pages, *.css* files, *.gif*, *jpg*, and *.png* image files, etc.).

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeSite.Build.Files.StaticFiles= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeSite.Build.Files.StaticFiles',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					this.addFiles (
						this.fileSystem.getFiles ({
							path:_params.sourcePath,
							recursive:true,
							pathMatcher:/\.(gif|jpg|png|ico|html|css|htaccess)$/
						})
					);
				}
			}
		});
	}
});

