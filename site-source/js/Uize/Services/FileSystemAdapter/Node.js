/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystemAdapter.Node Class
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
		The =Uize.Services.FileSystemAdapter.Node= module defines an adapter for the file system service (=Uize.Services.FileSystem=) for the NodeJS environment.

		*DEVELOPERS:* `Chris van Rensburg` & `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Services.FileSystemAdapter.Node',
	superclass:'Uize.Services.FileSystemAdapter',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_true = true,
				_false = false,
				_getParentFolderPath = _superclass.getParentFolderPath
		;

		return _superclass.subclass ({
			instanceMethods:{
				/*** Private Instance Methods ***/
					_pathExists:function (_path,_mustBeFolder) {
						try {
							var _stat = this._fileSystem.statSync (_path);
							return _mustBeFolder == _undefined || !!(_stat.mode & (1 << 14)) == _mustBeFolder;
						} catch (_error) {
							return _false;
						}
					},

					_makeFolder:function (_path) {
						var
							m = this,
							_fileSystem = m._fileSystem
						;
						if (!m._pathExists (_path)) {
							var
								_pathToCreate = _path,
								_pathsToCreate = []
							;
							while (_pathToCreate && !m._pathExists (_pathToCreate)) {
								_pathsToCreate.push (_pathToCreate);
								_pathToCreate = _getParentFolderPath (_pathToCreate);
							}
							for (var _pathToCreateNo = _pathsToCreate.length; --_pathToCreateNo >= 0;)
								!m._pathExists (_pathsToCreate [_pathToCreateNo])
									&& _fileSystem.mkdirSync (
										_pathsToCreate [_pathToCreateNo],
										0x1ff // 0x1ff Hex equivalent to 0777 octal
									)
							;
						}
					},

					_unlink:function(_path) {
						var m = this;
						m._pathExists(_path) && m._fileSystem.unlinkSync(_path);
					},

				/*** Overridden Extensibility Methods ***/
					getItemsInFolder:function (_params,_mustBeFolder) {
						var
							m = this,
							_path = _params.path,
							_pathMatcher = Uize.resolveMatcher (_params.pathMatcher),
							_pathTransformer = Uize.resolveTransformer (_params.pathTransformer),
							_result = [],
							_subPathPrefix = _path.replace (/[\\\/]+$/g,'')
						;
						_subPathPrefix += _subPathPrefix && '/';
						Uize.forEach (
							this._fileSystem.readdirSync (_path),
							function (_itemSubPath) {
								if (
									m._pathExists (_subPathPrefix + _itemSubPath,_mustBeFolder) &&
									_pathMatcher (_itemSubPath)
								)
									_result.push (_pathTransformer (_itemSubPath))
								;
							}
						);
						return _result;
					},

				/*** Public Instance Methods ***/
					copyFile:function (_params,_callback) {
						var
							m = this,
							_targetPath = _params.targetPath
						;
						m._makeFolder (_getParentFolderPath (_targetPath));
						m._fileSystem.writeFileSync (
							_targetPath,
							m._fileSystem.readFileSync (_params.path)
						);
						_callback ();
					},

					deleteFile:function (_params,_callback) {
						this._unlink(_params.path);
						_callback();
					},

					deleteFolder:function (_params,_callback) {
						this._unlink(_params.path);
						_callback();
					},

					fileExists:function (_params,_callback) {
						_callback (this._pathExists (_params.path,_false));
					},

					folderExists:function (_params,_callback) {
						_callback (this._pathExists (_params.path,_true));
					},

					getModifiedDate:function (_params,_callback) {
						try {
							_callback (new Date (this._fileSystem.statSync (_params.path).mtime));
						} catch (_error) {
							_callback (NaN);
						}
					},

					pathExists:function (_params,_callback) {
						_callback (this._pathExists (_params.path));
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
						m._fileSystem.renameSync (_params.path, _targetPath);
						_callback ();
					},

					readFile:function (_params,_callback) {
						var
							_fileSystem = this._fileSystem,
							_path = _params.path,
							_encoding = _params.encoding
						;
						_callback (
							_encoding == 'buffer'
								? _fileSystem.readFileSync (_path)
								: _fileSystem.readFileSync (_path,_encoding || 'utf8')
						);
					},

					writeFile:function (_params,_callback) {
						var _path = _params.path;
						this._makeFolder (_getParentFolderPath (_path));
						this._fileSystem.writeFileSync (_path,_params.contents,_params.encoding || 'utf8');
						_callback ();
					},

					init:function (_params,_callback) {
						this._fileSystem = require ('fs');
						_callback ();
					}
			}
		});
	}
});

