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
								_this.fileBuilder.get ('adapter').getJsModules (_sourcePath).sort (),
								/* TODO:
									Accessing the service adapter to use specific instance methods that are not part of the actual service interface is a poor design, because it makes an assumption about the service adapter that is chosen for the service by the environment. A better way should be figured out to express this kind of relationship - this way is too weak and fragile.
								*/
								'"reference/source-code/" + value + ".html"'
							)
						);

					/*** add URLs for source code pages for the examples ***/
						_this.addFiles (
							Uize.map (
								_this.fileBuilder.get ('adapter').getIndexableFiles (_sourcePath,'examples',/\.html$/),
								/* TODO:
									Accessing the service adapter to use specific instance methods that are not part of the actual service interface is a poor design, because it makes an assumption about the service adapter that is chosen for the service by the environment. A better way should be figured out to express this kind of relationship - this way is too weak and fragile.
								*/
								'"examples/source-code/" + value'
							)
						);
				}
			}
		});
	}
});

