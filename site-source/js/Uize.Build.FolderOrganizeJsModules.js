/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FolderOrganizeJsModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.FolderOrganizeJsModules= package iterates over all the JavaScript modules under the specified namespace and folder organizes them.

		This build module is useful when migrating a codebase where the modules where organized in a flat list to being folder organized.

		FLAT LIST
		......................................
		MyNamespace.js
		MyNamespace.SomeClass.js
		MyNamespace.SomeClass.Subclass.js
		MyNamespace.SomeOtherClass.js
		MyNamespace.SomeOtherClass.Subclass.js
		MyNamespace.SomePackage.js
		......................................

		FOLDER OGRANIZED
		......................................
		MyNamespace.js
		MyNamespace/SomeClass.js
		MyNamespace/SomeClass/Subclass.js
		MyNamespace/SomeOtherClass.js
		MyNamespace/SomeOtherClass/Subclass.js
		MyNamespace/SomePackage.js
		......................................

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.FolderOrganizeJsModules',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Build.Util',
		'Uize.String'
	],
	builder:function () {
		'use strict';

		return {
			perform:function (_params) {
				var
					_modulesFolderPath = _params.sourcePath + '/' + _params.modulesFolder,
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp,
					_namespacePrefix = _params.namespace + '.'
				;
				_fileSystem.getFiles ({
					path:_modulesFolderPath,
					pathMatcher:function (_path) {
						return _jsModuleExtensionRegExp.test (_path) && Uize.String.startsWith (_path,_namespacePrefix);
					},
					pathTransformer:function (_path) {
						_fileSystem.copyFile ({
							path:_modulesFolderPath + '/' + _path,
							targetPath:
								_modulesFolderPath + '/' + 
								_path.replace (_jsModuleExtensionRegExp,'').replace (/\./g,'/') +
								_path.match (_jsModuleExtensionRegExp) [1]
						});
						_fileSystem.deleteFile ({path:_modulesFolderPath + '/' + _path});
					}
				});
			}
		};
	}
});

