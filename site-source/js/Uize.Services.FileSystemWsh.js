/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystemWsh Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Services.FileSystemWsh= module defines an adapter for the file system service (=Uize.Services.FileSystem=) for the WSH (Windows Script Host) environment.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileSystemWsh',
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Utility Functions ***/
			function _getParentFolderPath (_path) {
				return _path.slice (0,((_path.lastIndexOf ('/') + 1) || 1) - 1);
			}

		/*** Private Instance Methods ***/
			_classPrototype._makeFolder = function (_path) {
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
			};

		/*** Public Instance Methods ***/
			_classPrototype.copyFile = function (_params,_callback) {
				var
					_this = this,
					_targetPath = _params.targetPath
				;
				_this._makeFolder (_getParentFolderPath (_targetPath));
				_this._fileSystemObject.CopyFile (_params.path,_targetPath,true);
				_callback ();
			};

			_classPrototype.fileExists = function (_params,_callback) {
				_callback (this._fileSystemObject.FileExists (_params.path));
			};

			_classPrototype.getModifiedDate = function (_params,_callback) {
				// TODO: IMPLEMENT!!!
				_callback ();
			};

			_classPrototype.pathExists = function (_params,_callback) {
				// TODO: IMPLEMENT!!!
				_callback ();
			};

			_classPrototype.getFiles = function (_params,_callback) {
				var
					_pathMatcher = Uize.resolveMatcher (_params.pathMatcher),
					_pathTransformer = Uize.resolveTransformer (_params.pathTransformer),
					_result = [],
					_files = new Enumerator (this._fileSystemObject.getFolder (_params.path).files),
					_filePath
				;
				while (!_files.atEnd ()) {
					_pathMatcher (_filePath = _files.item ().Path) &&
						_result.push (
							_pathTransformer (
								_filePath.slice (Math.max (_filePath.lastIndexOf ('/'),_filePath.lastIndexOf ('\\')) + 1)
							)
						)
					;
					_files.moveNext ();
				}
				_callback (_result);
			};

			_classPrototype.readFile = function (_params,_callback) {
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
			};

			_classPrototype.writeFile = function (_params,_callback) {
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
			};

			_classPrototype.init = function (_params,_callback) {
				this._fileSystemObject = new ActiveXObject ('Scripting.FileSystemObject');
				_callback ();
			};

		return _class;
	}
});

