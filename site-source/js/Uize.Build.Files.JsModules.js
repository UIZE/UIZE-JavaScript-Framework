/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Files.JsModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Files.JsModules= package builds all the JavaScript modules needed by a Web site that uses the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Files.JsModules',
	required:[
		'Uize.Build.Util',
		'Uize.String',
		'Uize.Url'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_sourcePath = _params.sourcePath,
						_uizePath = _params.uizePath,
						_jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp
					;
					this.addFiles (
						this.fileSystem.getFiles ({
							path:_sourcePath,
							recursive:true,
							pathMatcher:_jsModuleExtensionRegExp,
							pathTransformer:function (_path) {return _path.replace (_jsModuleExtensionRegExp,'.js')}
						})
					);
					if (_sourcePath != _uizePath)
						this.addFiles (
							this.fileSystem.getFiles ({
								path:_uizePath + '/js',
								recursive:true,
								pathMatcher:function (_path) {
									return _jsModuleExtensionRegExp.test (_path) && Uize.String.startsWith (_path,'Uize.');
								},
								pathTransformer:function (_path) {
									return 'js/' + _path.replace (_jsModuleExtensionRegExp,'.js');
								}
							})
						)
					;
				}
			}
		});
	}
});

