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
		The =Uize.Build.Files.JsModules= build script generates built [[javascript-modules.html][JavaScript modules]] from all the source JavaScript modules, [[javascript-templates.html][JavaScript template]] (=.js.jst=) files, and CSS template (=.csst=) files that it finds in the modules folder.

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
						_fileSystem = this.fileSystem,
						_modulesFolder = _params.modulesFolder,
						_sourcePath = _params.sourcePath,
						_uizePath = _params.uizePath,
						_sourceModulesPath = _sourcePath + '/' + _modulesFolder,
						_uizeModulesPath = _uizePath + '/js',
						_isUizeWebSite = _uizeModulesPath == _sourceModulesPath,
						_jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp
					;
					/*** add JavaScript modules located throughout site (not just modules folder) ***/
						this.addFiles (
							_fileSystem.getFiles ({
								path:_sourcePath,
								recursive:true,
								pathMatcher:_jsModuleExtensionRegExp,
								pathTransformer:function (_path) {return _path.replace (_jsModuleExtensionRegExp,'.js')}
							})
						);

					/*** add JavaScript modules located in the UIZE modules folder (if not the UIZE Web site) ***/
						_isUizeWebSite ||
							this.addFiles (
								_fileSystem.getFiles ({
									path:_uizeModulesPath,
									recursive:true,
									pathMatcher:function (_path) {
										return _jsModuleExtensionRegExp.test (_path) && Uize.String.startsWith (_path,'Uize.');
									},
									pathTransformer:function (_path) {
										return _modulesFolder + '/' + _path.replace (_jsModuleExtensionRegExp,'.js');
									}
								})
							)
						;

					/*** add URLs for generated namespace modules ***/
						function _getFolderToModuleUrlTransformer (_modulesFolder,_modulePath) {
							var _moduleNameFromModulePath = Uize.Build.Util.moduleNameFromModulePath;
							return function (_modulePath) {
								return (
									_modulesFolder + '/' +
									Uize.modulePathResolver (_moduleNameFromModulePath (_modulePath)) +
									'.js'
								);
							}
						}

						/*** add generated namespace modules for folders under site's modules folder ***/
							this.addFiles (
								_fileSystem.getFolders ({
									path:_sourceModulesPath,
									recursive:true,
									pathMatcher:function (_path) {
										/* TODO:
											for better efficiency, this should exclude...
											- folders not under folder organized namespaces
											- folders for which there are explicit corresponding JavaScript modules
										*/
										return true;
									},
									pathTransformer:_getFolderToModuleUrlTransformer (_modulesFolder)
								})
							);

						/*** add generated namespace modules for folders under UIZE site's modules folder ***/
							_isUizeWebSite ||
								this.addFiles (
									_fileSystem.getFolders ({
										path:_uizeModulesPath,
										recursive:true,
										pathMatcher:function (_path) {
											/* TODO:
												for better efficiency, this should exclude...
												- folders not under folder organized namespaces
												- folders for which there are explicit corresponding JavaScript modules
											*/
											return true;
										},
										pathTransformer:_getFolderToModuleUrlTransformer ('js')
									})
								)
							;
				}
			}
		});
	}
});

