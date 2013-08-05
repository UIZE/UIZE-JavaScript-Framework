/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Files.JstDerivedPages Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Build.Files.JstDerivedPages= package provides a method to recurse the source folder for a site and build pages derived from JST (=.jst=) files that have a type sub-extension (eg. =.html.jst= files).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Files.JstDerivedPages',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_sourcePath = _params.sourcePath,
						_jstDerivedPagePathMatcher = /\.([\w\d\-]+)\.jst$/
					;
					this.addFiles (
						this.fileSystem.getFiles ({
							path:_params.sourcePath,
							recursive:true,
							pathMatcher:function (_path) {
								var _match = _path.match (_jstDerivedPagePathMatcher);
								return !!_match && _match [1] != 'js';
							},
							pathTransformer:function (_path) {
								return _path.replace (_jstDerivedPagePathMatcher,'.$1');
							}
						})
					);
				}
			}
		});
	}
});

