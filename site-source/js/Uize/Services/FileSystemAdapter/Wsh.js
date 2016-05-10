/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystemAdapter.Wsh Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2016 UIZE
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

		*DEVELOPERS:* `Chris van Rensburg` & `Ben Ilegbodu`
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
								!_fileSystemObject.FolderExists (_pathsToCreate [_pathToCreateNo])
									&& _fileSystemObject.CreateFolder (_pathsToCreate [_pathToCreateNo])
							;
						}
					},

					_readFile:function(_path) {
						var
							_fileSystemObject = this._fileSystemObject,
							_text = ''
						;
						if (_fileSystemObject.GetFile (_path).Size) {
							var _file = _fileSystemObject.OpenTextFile (_path,1);
							_text = _file.ReadAll ();

							//BOM meaning it is UTF8. WScript can't read these and treats
							//	them as UTF16, but ignored the BOM, so we just clip it off here.
							//http://en.wikipedia.org/wiki/Byte_order_mark
							if (
								_text.charCodeAt(0) === 239
								&& _text.charCodeAt(1) === 187
								&& _text.charCodeAt(2) === 191
							) {
								_text = _text.substring(3);
							}

							_file.Close ();
						}

						return _text;
					},

					_writeFile:function (_path, _contents) {
						var m = this;
						m._makeFolder (_getParentFolderPath (_path));

						/*** write text to file and close ***/
							var _file = m._fileSystemObject.CreateTextFile (_path);
							_file.Write (_contents);
							_file.Close ();
					},

				/*** Public Instance Methods ***/
					copyFile:function (_params,_callback) {
						var
							m = this,
							_targetPath = _params.targetPath
						;
						m._makeFolder (_getParentFolderPath (_targetPath));
						m._writeFile(
							_targetPath,
							m._readFile(_params.path)
						);
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

					deleteFolder:function (_params,_callback) {
						try {
							this._fileSystemObject.DeleteFolder (_params.path);
						} catch (_error) {
							// do nothing for now
						}
						_callback ();
					},

					fileExists:function (_params,_callback) {
						_callback (this._fileSystemObject.FileExists (_params.path));
					},

					folderExists:function (_params,_callback) {
						_callback (this._fileSystemObject.FolderExists (_params.path));
					},

					getModifiedDate:function (_params,_callback) {
						var
							_path = _params.path,
							_fileSystemObject = this._fileSystemObject
						;
						_callback (
							_fileSystemObject.FileExists (_path)
								? new Date (_fileSystemObject.GetFile (_path).DateLastModified)
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

					makeFolder:function (_params,_callback) {
						this._makeFolder (_params.path);
						_callback ();
					},

					moveFile:function (_params,_callback) {
						var
							m = this,
							_targetPath = _params.targetPath
						;
						m._makeFolder (_getParentFolderPath (_targetPath));
						m._fileSystemObject.MoveFile (_params.path,_targetPath);
						_callback ();
					},

					readFile:function (_params,_callback) {
						_callback (this._readFile(_params.path));
					},

					writeFile:function (_params,_callback) {
						this._writeFile(_params.path, _params.contents);
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

