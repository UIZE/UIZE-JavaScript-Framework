/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.ServicesSetup Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Build.ServicesSetup= package....

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.ServicesSetup',
	required:[
		'Uize.Util.Needs',
		'Uize.Data.Matches'
	],
	builder:function () {
		/*** General Variables ***/
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
							Uize.Data.Matches.values (
								_modules,
								function (_module) {return _registeredServices [_module] == _trueFlag}
							),
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
	}
});

