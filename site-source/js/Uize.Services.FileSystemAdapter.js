/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystemAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Services.FileSystemAdapter= module defines an abstract base class for adapters for the file system service (=Uize.Services.FileSystem=).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileSystemAdapter',
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				getItemsInFolder:function (_params,_mustBeFolder) {
					// override the implementation of this method in a host specific adapter to the FileSystem service
				},

				getFiles:function (_params,_callback) {
					var
						_this = this,
						_result = [],
						_path = _params.path,
						_pathMatcher = Uize.resolveMatcher (_params.pathMatcher),
						_pathTransformer = Uize.resolveTransformer (_params.pathTransformer),
						_recursive = _params.recursive
					;
					function _addItemsFromFolder (_subPath) {
						var
							_pathPlusSubPath = _path + (_path && _subPath && '/') + _subPath,
							_currentItemPath
						;
						_result.push.apply (
							_result,
							_this.getItemsInFolder ({
								path:_pathPlusSubPath,
								pathMatcher:function (_itemPath) {
									return _pathMatcher (_currentItemPath = _subPath + (_subPath && '/') + _itemPath);
								},
								pathTransformer:function (_itemPath) {
									return _pathTransformer (_currentItemPath);
								}
							})
						);
						if (_recursive) {
							Uize.forEach (
								_this.getItemsInFolder ({path:_pathPlusSubPath},true),
								function (_folderName) {_addItemsFromFolder (_subPath + (_subPath && '/') + _folderName)}
							);
						}
					}
					_addItemsFromFolder ('');
					_callback (_result);
				}
			},
			staticMethods:{
				getParentFolderPath:function (_path) {
					return _path.slice (0,((Math.max (_path.lastIndexOf ('/'),_path.lastIndexOf ('\\')) + 1) || 1) - 1);
				}
			}
		});;
	}
});

