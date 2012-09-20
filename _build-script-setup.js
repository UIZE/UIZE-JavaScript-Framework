/*
	This script is designed to be run using either NodeJS or WSH (Windows Script Host), and is used to run build script modules. This script takes care of some common bootstrapping for these build script modules, such as setting up the service adapters (using Uize.Build.ServicesSetup), parsing out the named parameters for the build script module, and doing the bootstrapping so that modules required by build script modules are loaded correctly. This leaves the build script modules to only have to deal with implementing their build processes.

	USAGES:

	Using NodeJS...

	node _build-script-setup Uize.Build.SomeBuildScript
	node _build-script-setup Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	Using WSH (Windows Script Host)...

	wscript _build-script-setup.js Uize.Build.SomeBuildScript
	wscript _build-script-setup.js Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	NOTE:

	The working directory for running this script in node should be the UIZE root directory.
*/

(function () {
	var _isWsh = typeof ActiveXObject != 'undefined';

	function _buildScriptSetup (_params) {
		if (!_params) _params = {};
		var
			_pathToRoot = _params.pathToRoot || '',
			_useSource = _params.useSource !== false
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

		Uize.require ('Uize.Build.ServicesSetup');
	};

	/*** if this script is being run directly, then run the specified build process ***/
		var
			_thisScriptName = '_build-script-setup.js',
			_scriptFullName = _isWsh ? WScript.ScriptFullName : process.argv [1]
		;
		if (_scriptFullName.slice (_scriptFullName.length - _thisScriptName.length) == _thisScriptName) {
			/*** get the command line args, excluding the first two ***/
				var _args;
				if (_isWsh) {
					_args = [];
					for (
						var _wshArgNo = -1, _wshArgs = WScript.Arguments, _wshArgsLength = _wshArgs.length;
						++_wshArgNo < _wshArgsLength;
					) {
						_args.push (_wshArgs (_wshArgNo));
					}
				} else {
					_args = process.argv.slice (2);
				}

			var _buildModuleName = _args [0];
			if (_buildModuleName) {
				/*** parse out named arguments ***/
					var _params = {};
					for (var _argNo = 0, _arg, _delimPos; ++_argNo < _args.length;) {
						_delimPos = (_arg = _args [_argNo]).indexOf ('=');
						if (_delimPos > -1)
							_params [_arg.slice (0,_delimPos)] = _arg.slice (_delimPos + 1)
						;
					}

				_buildScriptSetup (_params);

				Uize.require (
					_buildModuleName,
					function (_buildModule) {
						_buildModule.perform (Uize.copyInto ({},env,{logFileName:_buildModuleName + '.log'},_params));
					}
				);
			}
		}

	return _buildScriptSetup;
}) ();

