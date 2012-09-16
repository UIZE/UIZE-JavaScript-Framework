/*
	This script is designed to be run using either NodeJS or WSH (Windows Script Host), and is used to run build script modules. This script takes care of some common bootstrapping for these build script modules, such as setting up the file system service adapter, parsing out the named parameters for the build script module, and doing the bootstrapping so that modules required by build script modules are loaded correctly. This leaves the build script modules to only have to deal with implementing their build processes.

	USAGES:

	Using NodeJS...

	node run-build-script Uize.Build.SomeBuildScript
	node run-build-script Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	Using WSH (Windows Script Host)...

	wscript run-build-script.js Uize.Build.SomeBuildScript
	wscript run-build-script.js Uize.Build.SomeBuildScript p1Name=p1Value p2Name=p2Value

	NOTE:

	The working directory for running this script in node should be the UIZE root directory.
*/

(function () {
	/*** bootstrapping the environment for UIZE module loading ***/
		var
			FileSystem = require('fs'),
			sourceJsPath = process.argv[1].replace(/\bbuild\/[^\/]+$/, '') + 'src/'
		;
		function readFile(filePath) {
			return FileSystem.readFileSync(filePath, 'utf8');
		}

	Uize.require (
		'Uize.Util.Needs',
		function () {
			/*** register services setup ***/
				var
					_uizeRequire = Uize.require,
					_servicesSetup = Uize.Util.Needs (),
					_registeredServices = {},
					_trueFlag = {}
				;

				/*** override Uize.require in order to inject service setup ***/
					Uize.require = function (_modules,_callback) {
						if (typeof _modules == 'string')
							_modules = [_modules]
						;
						_uizeRequire (
							_modules,
							function () {
								var _uizeRequireCallbackArgs = arguments;
								_servicesSetup.need (
									_.filter (_modules,function (_module) {return _registeredServices [_module] == _trueFlag}),
									function () {_callback && _callback.apply (0,_uizeRequireCallbackArgs)}
								);
							}
						);
					};

				function _registerServiceSetup (_serviceModuleName,_serviceAdapterModuleName,_serviceSetup) {
					_registeredServices [_serviceModuleName] = _trueFlag;
					_servicesSetup.provide (_serviceModuleName,function (_provide) {
						_uizeRequire (
							[_serviceModuleName,_serviceAdapterModuleName],
							function (_serviceModule,_serviceAdapterModule) {
								(_service = _serviceModule.singleton ()).set ('adapter',_serviceAdapterModule.singleton ());
								_serviceSetup (_service,function () {_provide (_service)});
							}
						);
					});
				}

			/*** run the build script ***/
				var
					_args = process.argv,
					_buildModuleName = _args [2]
				;
				if (!_buildModuleName)
					throw new Error('You must specify a build script module name')
				;
				Uize.require (
					_buildModuleName,
					function (_buildModule) {
						// parse out named arguments
						var params = {};
						for (var argNo = 1, arg, delimPos; ++argNo < args.length;) {
							delimPos = (arg = args[argNo]).indexOf('=');
							if (delimPos > -1) {
								params[arg.slice(0, delimPos)] = arg.slice(delimPos + 1);
							}
						}
						buildModule().perform(params);
					}
				);
		}
	);
}());

