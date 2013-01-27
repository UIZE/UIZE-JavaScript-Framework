/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystemAdapter.Wsh Class
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
		The =Uize.Services.FileSystemAdapter.Wsh= module defines an adapter for the file system service (=Uize.Services.FileSystem=) for the WSH (Windows Script Host) environment.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileSystemAdapter.Wsh',
	superclass:'Uize.Services.FileSystemAdapter',
	builder:function (_superclass) {
		'use strict';

		/*** Utility Functions ***/
			var _getParentFolderPath = _superclass.getParentFolderPath;

		return _superclass.subclass ({
			instanceMethods:{
				/*** Overridden Extensibility Methods ***/
					getItemsInFolder:function (_params,_itemIsFolder) {
						var
							_pathMatcher = Uize.resolveMatcher (_params.pathMatcher),
							_pathTransformer = Uize.resolveTransformer (_params.pathTransformer),
							_result = [],
							_items = new Enumerator (
								this._fileSystemObject.getFolder (_params.path) [_itemIsFolder ? 'SubFolders' : 'Files']
							),
							_itemPath
						;
						while (!_items.atEnd ()) {
							_pathMatcher (
								_itemPath = (_itemPath = _items.item ().Path).slice (
									Math.max (_itemPath.lastIndexOf ('/'),_itemPath.lastIndexOf ('\\')) + 1
								)
							) &&
								_result.push (_pathTransformer (_itemPath))
							;
							_items.moveNext ();
						}
						return _result;
					},

				/*** Private Instance Methods ***/
					_makeFolder:function (_path) {
						var _fileSystemObject = this._fileSystemObject;
						if (!_fileSystemObject.FolderExists (_path)) {
							var
								_pathToCreate = _path,
								_pathsToCreate = []
							;
							while (_pathToCreate && !_fileSystemObject.FolderExists (_pathToCreate)) {
								_pathsToCreate.push (_pathToCreate);
								_pathToCreate = _getParentFolderPath (_pathToCreate);
							}
							for (var _pathToCreateNo = _pathsToCreate.length; --_pathToCreateNo >= 0;)
								 _fileSystemObject.CreateFolder (_pathsToCreate [_pathToCreateNo])
							;
						}
					},

				/*** Public Instance Methods ***/
					copyFile:function (_params,_callback) {
						var
							_this = this,
							_targetPath = _params.targetPath
						;
						_this._makeFolder (_getParentFolderPath (_targetPath));
						_this._fileSystemObject.CopyFile (_params.path,_targetPath,true);
						_callback ();
					},

					deleteFile:function (_params,_callback) {
						try {
							this._fileSystemObject.DeleteFile (_params.path);
						} catch (_error) {
							// do nothing for now
						}
						_callback ();
					},

					fileExists:function (_params,_callback) {
						_callback (this._fileSystemObject.FileExists (_params.path));
					},

					getModifiedDate:function (_params,_callback) {
						var
							_path = _params.path,
							_fileSystemObject = this._fileSystemObject
						;
						_callback (
							_fileSystemObject.FileExists (_path)
								? new Date (_fileSystemObject.GetFile (_path).DataLastModified)
								: NaN
						);
					},

					pathExists:function (_params,_callback) {
						var
							_path = _params.path,
							_fileSystemObject = this._fileSystemObject
						;
						_callback (_fileSystemObject.FileExists (_path) || _fileSystemObject.FolderExists (_path));
					},

					getFolders:function (_params,_callback) {
						_callback (this.getItemsInFolder (_params,true));
					},

					readFile:function (_params,_callback) {
						var
							_fileSystemObject = this._fileSystemObject,
							_path = _params.path,
							_text = ''
						;
						if (_fileSystemObject.GetFile (_path).Size) {
							var _file = _fileSystemObject.OpenTextFile (_path,1);
							_text = _file.ReadAll ();
							_file.Close ();
						}
						_callback (_text);
					},

					writeFile:function (_params,_callback) {
						var
							_this = this,
							_path = _params.path
						;
						_this._makeFolder (_getParentFolderPath (_path));

						/*** write text to file and close ***/
							var _file = _this._fileSystemObject.CreateTextFile (_path);
							_file.Write (_params.contents);
							_file.Close ();

						_callback ();
					},

					init:function (_params,_callback) {
						this._fileSystemObject = new ActiveXObject ('Scripting.FileSystemObject');
						_callback ();
					}
			}
		});
	}
});

