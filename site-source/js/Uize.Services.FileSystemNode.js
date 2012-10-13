/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystemNode Class
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
		The =Uize.Services.FileSystemNode= module defines an adapter for the file system service (=Uize.Services.FileSystem=) for the NodeJS environment.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileSystemNode',
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_undefined = undefined,
				_false = false
			;

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
			_classPrototype._pathExists = function (_path,_mustBeFolder) {
				try {
					var _stat = this._fileSystem.statSync (_path);
					return _mustBeFolder == _undefined || !!(_stat.mode & (1 << 14)) == _mustBeFolder;
				} catch (_error) {
					return _false;
				}
			};

			_classPrototype._makeFolder = function (_path) {
				var
					_this = this,
					_fileSystem = _this._fileSystem
				;
				if (!_this._pathExists (_path)) {
					var
						_pathToCreate = _path,
						_pathsToCreate = []
					;
					while (_pathToCreate && !_this._pathExists (_pathToCreate)) {
						_pathsToCreate.push (_pathToCreate);
						_pathToCreate = _getParentFolderPath (_pathToCreate);
					}
					for (var _pathToCreateNo = _pathsToCreate.length; --_pathToCreateNo >= 0;)
						_fileSystem.mkdirSync (
							_pathsToCreate [_pathToCreateNo],
							0x1ff // 0x1ff Hex equivalent to 0777 octal
						)
					;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.fileExists = function (_params,_callback) {
				_callback (this._pathExists (_params.path,_false));
			};

			_classPrototype.getModifiedDate = function (_params,_callback) {
				try {
					_callback (new Date (this._fileSystem.statSync (_params.path).mtime));
				} catch (_error) {
					_callback (NaN);
				}
			};

			_classPrototype.pathExists = function (_params,_callback) {
				_callback (this._pathExists (_params.path));
			};

			_classPrototype.readFile = function (_params,_callback) {
				_callback (this._fileSystem.readFileSync (_params.path,_params.encoding || 'utf8'));
			};

			_classPrototype.writeFile = function (_params,_callback) {
				var _path = _params.path;
				this._makeFolder (_getParentFolderPath (_path));
				this._fileSystem.writeFileSync (_path,_params.contents,_params.encoding || 'utf8');
				_callback ();
			};

			_classPrototype.init = function (_params,_callback) {
				this._fileSystem = require ('fs');
				_callback ();
			};

		return _class;
	}
});

