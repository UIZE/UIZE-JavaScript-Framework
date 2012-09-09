(function () {
	return function (_params) {
		if (!_params) _params = {};
		var
			_pathToRoot = _params.pathToRoot || '',
			_useSource = _params.useSource !== false,
			_isWsh = typeof ActiveXObject != 'undefined'
		;

		/*** read file ***/
			var
				_fileSystemObject,
				_readFile
			;
			if (_isWsh) {
				_fileSystemObject = new ActiveXObject ('Scripting.FileSystemObject');
				_readFile = function (_filePath) {
					var
						_file = _fileSystemObject.OpenTextFile (_pathToRoot + _filePath,1),
						_fileText = _file.ReadAll ()
					;
					_file.Close ();
					return _fileText;
				};
			} else {
				_fileSystemObject = require ('fs');
				_readFile = function (_filePath) {
					return _fileSystemObject.readFileSync (_pathToRoot + _filePath,'utf8');
				};
			}

		/*** load build environment properties ***/
			(function () {return this}) ().env = eval ('(' + _readFile ('_build-env.json') + ')');

		/*** load Uize base class and set up with module loader ***/
			function _moduleLoader (_moduleToLoad,_callback) {
				if (env.modulesToStub && env.modulesToStub.test (_moduleToLoad)) {
					_callback ('Uize.module ({name:\'' + _moduleToLoad + '\'})');
					return;
				}
				var _modulePath = env.moduleFolderPath;
				if (!_useSource) {
					var
						_sourceFolderName = env.sourceFolderName || '',
						_sourceFolderNameLength = _sourceFolderName.length,
						_buildFolderPath = env.buildFolderPath
					;
					if (_sourceFolderNameLength && _modulePath.slice (-_sourceFolderNameLength) == _sourceFolderName)
						_modulePath = _modulePath.slice (0,-_sourceFolderNameLength - 1)
					;
					if (_buildFolderPath)
						_modulePath = _buildFolderPath + '\\' + _modulePath
					;
				}
				_callback (_readFile (_modulePath + '\\' + _moduleToLoad + '.js'));
			}
			_moduleLoader ('Uize',function (_uizeCode) {eval (_uizeCode); Uize.moduleLoader = _moduleLoader});
	};
}) ();

