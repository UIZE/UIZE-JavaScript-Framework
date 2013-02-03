/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.SimpleDocPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeSite.Build.Files.SimpleDocPages= package provides a method to build all the SimpleDoc documentation for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeSite.Build.Files.SimpleDocPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeSite.Build.Files.SimpleDocPages',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_this = this,
						_sourcePath = _params.sourcePath
					;

					/*** add URLs for all .simple files (explainers, appendixes, JavaScript reference pages, etc.) ***/
						var _dotSimpleExtensionRegExp = /\.simple$/;
						_this.addFiles (
							_this.fileSystem.getFiles ({
								path:_sourcePath,
								recursive:true,
								pathMatcher:_dotSimpleExtensionRegExp,
								pathTransformer:function (_path) {return _path.replace (_dotSimpleExtensionRegExp,'.html')}
							})
						);

					/*** add URLs for all JavaScript module reference files ***/
						_this.addFiles (
							Uize.map (
								_this.fileBuilder.get ('adapter').getJsModules (_sourcePath).sort (),
								/* TODO:
									Accessing the service adapter to use specific instance methods that are not part of the actual service interface is a poor design, because it makes an assumption about the service adapter that is chosen for the service by the environment. A better way should be figured out to express this kind of relationship - this way is too weak and fragile.
								*/
								'"reference/" + value + ".html"'
							)
						);
				}
			}
		});
	}
});

