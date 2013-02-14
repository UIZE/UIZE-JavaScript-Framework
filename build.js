/*
	This script is designed to be run using either NodeJS or WSH (Windows Script Host), and is used to run build script modules. This script takes care of some common bootstrapping for these build script modules, such as setting up the service adapters, parsing out the named parameters for the build script module, and doing the bootstrapping so that modules required by build script modules are loaded correctly. This leaves the build script modules to only have to deal with implementing their build processes.

	USAGES:

	Using NodeJS...

	node build.js Uize.Build.SomeBuildScript
	node build.js Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	Using WSH (Windows Script Host)...

	wscript build.js Uize.Build.SomeBuildScript
	wscript build.js Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

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
			_thisScriptName = 'build.js',
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
			_useSource = _params.useSource + '' != 'false'
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

		/*** miscellaneous global JavaScript functions (to mirror what's available in the browser context) ***/
			if (_isWsh) {
				function _popup (_message,_title,_buttonsAndIconMask) {
					return (
						(_popup._wscriptShell || (_popup._wscriptShell = new ActiveXObject ('wscript.shell'))).Popup (
							_message + '',
							0, // seconds to wait before auto-dismissing (0 = stay open forever)
							_title,
							_buttonsAndIconMask
						)
					);
				}
				alert = function (_message) {
					_popup (_message,'Windows Script Host Alert',0 | 48 /* 0 = ok button only, 48 = warning icon */);
				};
				confirm = function (_message) {
					return _popup (
						_message,
						'Please Confirm...',
						1 | 32 /* 1 = ok and cancel, 32 = question mark icon */
					) == 1;
				};
				/* TO DO:
					for prompt, try to figure out how to use VBSCRIPT's InputBox built-in function
						http://wsh2.uw.hu/ch08c.html

					Function WSHInputBox(Message, Title, Value)
						WSHInputBox = InputBox(Message, Title, Value)
					End Function
				*/
			} else {
				alert = function (_message) {
					console.log (_message);
				};
			}

		/*** load build environment properties ***/
			var _env = (function () {return this}) ().env = eval ('(' + _readFile ('uize-config.json') + ')');
			if (_env.staleBefore == 'now')
				_env.staleBefore = +new Date
			;

		/*** load Uize base class and set up with module loader ***/
			function _moduleLoader (_moduleToLoad,_callback) {
				var _moduleText = '';
				if (_env.modulesToStub && _env.modulesToStub.test (_moduleToLoad)) {
					_moduleText = 'Uize.module ({name:\'' + _moduleToLoad + '\'})';
				} else {
					var _modulePath =
						(
							_useSource
								? (/^Uize(\.|$)/.test (_moduleToLoad) ? env.uizePath + '/js' : _env.moduleFolderPath)
								: _env.moduleFolderBuiltPath
						) +
						'/' + _moduleToLoad + '.js'
					;
					console.log ('HERE: ' + _modulePath);
					if (_fileExists (_modulePath)) {
						_moduleText = _readFile (_modulePath);
					} else if (_fileExists (_modulePath + '.jst')) {
						Uize.require (
							'Uize.Template.Module',
							function (_Uize_Template_Module) {
								_moduleText = _Uize_Template_Module.buildTemplateModuleText (
									_moduleToLoad,
									_readFile (_modulePath + '.jst')
								);
							}
						);
					}
				}
				_callback (_moduleText);
			}
			_moduleLoader (
				'Uize',
				function (_uizeCode) {
					_eval (_uizeCode);
					if (!_isWsh)
						Uize.laxEval = _eval // this actually *needs* to be overridden for the NodeJS context
					;
					Uize.moduleLoader = _moduleLoader;
				}
			);

		/*** services setup & run build module (if specified) ***/
			Uize.require (
				_env.servicesSetup || 'Uize.Build.ServicesSetup',
				function (_servicesSetup) {
					_servicesSetup.setup ();
					if (_buildModuleName)
						Uize.require (
							_buildModuleName,
							function (_buildModule) {
								_buildModule.perform (
									Uize.copyInto ({},_env,{logFilePath:'logs/' + _buildModuleName + '.log'},_params)
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

