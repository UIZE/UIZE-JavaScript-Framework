/*
	This script is designed to be run using either NodeJS or WSH (Windows Script Host), and is used to run build script modules. This script takes care of some common bootstrapping for these build script modules, such as setting up the service adapters (using Uize.Build.ServicesSetup), parsing out the named parameters for the build script module, and doing the bootstrapping so that modules required by build script modules are loaded correctly. This leaves the build script modules to only have to deal with implementing their build processes.

	USAGES:

	Using NodeJS...

	node _build Uize.Build.SomeBuildScript
	node _build Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	Using WSH (Windows Script Host)...

	wscript _build.js Uize.Build.SomeBuildScript
	wscript _build.js Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	NOTE:

	The working directory for running this script in node should be the UIZE root directory.
*/

function _eval (_toEval) {
	eval (_toEval);
}

(function () {
	var _isWsh = typeof ActiveXObject != 'undefined';

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

	/*** determine build module name (if this script is being used in that way) ***/
		var
			_buildModuleName,
			_thisScriptName = '_build.js',
			_scriptFullName = _isWsh ? WScript.ScriptFullName : process.argv [1]
		;
		if (_scriptFullName.slice (_scriptFullName.length - _thisScriptName.length) == _thisScriptName) {
			_buildModuleName = _args [0];
			_args = _args.slice (1);
		}

	/*** parse out named arguments ***/
		var _params = {};
		for (var _argNo = -1, _arg, _delimPos; ++_argNo < _args.length;) {
			_delimPos = (_arg = _args [_argNo]).indexOf ('=');
			if (_delimPos > -1)
				_params [_arg.slice (0,_delimPos)] = _arg.slice (_delimPos + 1)
			;
		}

	function _build (_buildModuleName,_paramOverrides) {
		for (var _paramName in _paramOverrides) {
			_params [_paramName] = _paramOverrides [_paramName];
		}
		var
			_pathToRoot = _params.pathToRoot || '',
			_useSource = _params.useSource !== false
		;

		/*** minimal file system functions ***/
			var
				_fileSystem,
				_readFile,
				_fileExists
			;
			if (_isWsh) {
				_fileSystem = new ActiveXObject ('Scripting.FileSystemObject');
				_fileExists = function (_path) {
					return _fileSystem.FileExists (_path);
				};
				_readFile = function (_filePath) {
					var
						_file = _fileSystem.OpenTextFile (_pathToRoot + _filePath,1),
						_fileText = _file.ReadAll ()
					;
					_file.Close ();
					return _fileText;
				};
			} else {
				_fileSystem = require ('fs');
				_fileExists = function (_path) {
					try {
						_fileSystem.statSync (_path);
						return true;
					} catch (_error) {
						return false;
					}
				};
				_readFile = function (_filePath) {
					return _fileSystem.readFileSync (_pathToRoot + _filePath,'utf8');
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
				if (_fileExists (_modulePath += '\\' + _moduleToLoad + '.js')) {
					_eval (_readFile (_modulePath));
				} else if (_fileExists (_modulePath + '.jst')) {
					Uize.require (
						'Uize.Template',
						function (_Uize_Template) {
							var _compiledTemplate = _Uize_Template.compile (_readFile (_modulePath + '.jst'),{result:'full'});
							Uize.module ({
								name:_moduleToLoad,
								required:_compiledTemplate.required,
								builder:function () {
									var _package = function () {};
									_package.process = new Function ('input',_compiledTemplate.code); 
									_package.input = _compiledTemplate.input; 
									return _package;
								}
							});
						}
					);
				}
				_callback ();
			}
			_moduleLoader ('Uize',function (_uizeCode) {Uize.moduleLoader = _moduleLoader});

		/*** services setup & run build module (if specified) ***/
			Uize.require (
				'Uize.Build.ServicesSetup',
				function () {
					if (_buildModuleName)
						Uize.require (
							_buildModuleName,
							function (_buildModule) {
								_buildModule.perform (
									Uize.copyInto ({},env,{logFileName:'_' + _buildModuleName + '.log'},_params)
								);
							}
						)
					;
				}
			);
	};

	/*** if this script is being run directly, then run the specified build process ***/
		_buildModuleName && _build (_buildModuleName);

	return _build;
}) ();

