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

		/*** Public Instance Methods ***/
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
					_path = _params.path,
					_fileSystemObject = this._fileSystemObject
				;

				/*** make sure path exists (if not, create it) ***/
					var _folderPath = _path.substr (0,_path.lastIndexOf ('\\'));
					if (!_fileSystemObject.FolderExists (_folderPath)) {
						var
							_pathSegments = _folderPath.split ('\\'),
							_currentPath = _pathSegments [0] // this should be a drive letter ... this code might break if it isn't
						;
						for (
							var _pathSegmentNo = 0, _pathSegmentsLength = _pathSegments.length;
							++_pathSegmentNo < _pathSegmentsLength;
						) {
							_currentPath += '\\' + _pathSegments [_pathSegmentNo];
							_fileSystemObject.FolderExists (_currentPath) || _fileSystemObject.CreateFolder (_currentPath);
						}
					}

				/*** write text to file and close ***/
					var _file = _fileSystemObject.CreateTextFile (_path);
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

