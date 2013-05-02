/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.Setup Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Services.Setup= package....

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.Setup',
	required:[
		'Uize.Util.Needs',
		'Uize.Data.Matches'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var
				_serviceProvisioning = Uize.Util.Needs (),
				_serviceSetupProvided = {},
				_trueFlag = {},
				_uizeRequire
			;

		/*** Utility Functions ***/
			function _moduleHasServiceSetup (_module) {
				return _serviceSetupProvided [_module] == _trueFlag;
			}

		/*** Public Static Methods ***/
			_package.provideServiceSetup = function (_serviceModuleName,_serviceAdapterModuleName,_serviceSetup) {
				/*** override Uize.require in order to inject service setup ***/
					if (!_uizeRequire) {
						_uizeRequire = Uize.require;
						Uize.require = function (_modules,_callback) {
							if (typeof _modules == 'string')
								_modules = [_modules]
							;
							_uizeRequire (
								_modules,
								function () {
									var _uizeRequireCallbackArgs = arguments;
									_serviceProvisioning.need (
										Uize.Data.Matches.values (_modules,_moduleHasServiceSetup),
										function () {_callback && _callback.apply (0,_uizeRequireCallbackArgs)}
									);
								}
							);
						};
					};

				_serviceSetupProvided [_serviceModuleName] = _trueFlag;
				_serviceProvisioning.provide (
					_serviceModuleName,
					function (_provide) {
						_uizeRequire (
							[_serviceModuleName,_serviceAdapterModuleName],
							function (_serviceModule,_serviceAdapterModule) {
								var _service = _serviceModule.singleton ();
								_service.set ('adapter',_serviceAdapterModule.singleton ());
								function _provideService () {_provide (_service)}
								_serviceSetup
									? _serviceSetup (_service,_provideService)
									: _service.init ({},_provideService)
								;
							}
						);
					}
				);
			};

		return _package;
	}
});

