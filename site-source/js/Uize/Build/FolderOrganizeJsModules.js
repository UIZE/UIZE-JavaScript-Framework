/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FolderOrganizeJsModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		'Uize.Str.Has'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_modulesFolderPath = _params.sourcePath + '/' + _params.modulesFolder,
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_fileExtensionRegExp = /((?:\.[a-z]+)+)$/,
					_namespace = _params.namespace,
					_namespacePrefix = _namespace + '.',
					_namespacePrefixAlreadyFolderOrganized = _namespacePrefix.replace (/\./g,'_')
				;
				_fileSystem.getFiles ({
					path:_modulesFolderPath,
					pathMatcher:function (_path) {
						return (
							Uize.Str.Has.hasPrefix (_path,_namespacePrefix) ||
							Uize.Str.Has.hasPrefix (_path,_namespacePrefixAlreadyFolderOrganized)
						);
					},
					recursive:true,
					pathTransformer:function (_path) {
						var _fileExtension = _path.match(_fileExtensionRegExp)[0];
						if (_path != _namespace + _fileExtension) {
							_fileSystem.moveFile ({
								path:_modulesFolderPath + '/' + _path,
								targetPath:
									_modulesFolderPath + '/' +
									_namespace + '/' +
									_path
										.slice (_namespace.length + 1)
										.replace (_fileExtension,'')
										.replace (/[\._]/g,'/') +
									_path.match (_fileExtensionRegExp) [1]
							});
						}
					}
				});
			}
		});
	}
});

