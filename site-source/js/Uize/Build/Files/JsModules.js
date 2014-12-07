/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Files.JsModules Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Files.JsModules= build script generates built [[javascript-modules.html][JavaScript modules]] from all the source JavaScript modules, including various non-JavaScript source files (such as CSS template files with the =.csst= file extension).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Files.JsModules',
	required:'Uize.Build.Util',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						m = this,
						_fileSystem = m.fileSystem,
						_modulesFolder = _params.modulesFolder,
						_uizeModulesFolder = _params.uizeModulesFolder || 'js',
						_sourcePath = _params.sourcePath,
						_uizePath = _params.uizePath,
						_sourceModulesPath = _sourcePath + '/' + _modulesFolder,
						_uizeModulesPath = _uizePath + '/' + _uizeModulesFolder,
						_isUizeRegExp = /^Uize[\.\/]/,
						_jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp
					;

					/*** add URLs for JavaScript modules ***/
						function _addUrlsForJavaScriptModules (_sourceModulesPath,_modulesFolder,_isUize) {
							m.addFiles (
								_fileSystem.getFiles ({
									path:_sourceModulesPath,
									recursive:true,
									pathMatcher:function (_path) {
										return _jsModuleExtensionRegExp.test (_path) && _isUizeRegExp.test (_path) == _isUize;
									},
									pathTransformer:function (_modulePath) {
										return _modulesFolder + '/' + _modulePath.replace (_jsModuleExtensionRegExp,'.js');
									}
								})
							);
						}

						/*** folders under site's modules folder ***/
							_addUrlsForJavaScriptModules (_sourceModulesPath,_modulesFolder,false);

						/*** folders under UIZE site's modules folder ***/
							_addUrlsForJavaScriptModules (_uizeModulesPath,_uizeModulesFolder,true);

					/*** add URLs for generated namespace modules ***/
						function _addUrlsForGeneratedNamespaceModules (_sourceModulesPath,_modulesFolder,_isUize) {
							var _moduleNameFromModulePath = Uize.Build.Util.moduleNameFromModulePath;
							m.addFiles (
								_fileSystem.getFolders ({
									path:_sourceModulesPath,
									recursive:true,
									pathMatcher:function (_path) {
										/* TODO:
											for better efficiency, this should exclude...
											- folders not under folder organized namespaces
											- folders for which there are explicit corresponding JavaScript modules
										*/
										return _isUizeRegExp.test (_path) == _isUize;
									},
									pathTransformer:function (_modulePath) {
										return (
											_modulesFolder + '/' +
											Uize.modulePathResolver (_moduleNameFromModulePath (_modulePath)) +
											'.js'
										);
									}
								})
							);
						}

						/*** folders under site's modules folder ***/
							_addUrlsForGeneratedNamespaceModules (_sourceModulesPath,_modulesFolder,false);

						/*** folders under UIZE site's modules folder ***/
							_addUrlsForGeneratedNamespaceModules (_uizeModulesPath,_uizeModulesFolder,true);
				}
			}
		});
	}
});

