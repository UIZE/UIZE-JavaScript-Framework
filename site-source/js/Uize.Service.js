/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Service Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Service= module defines a base class from which classes that define services can inherit.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Service',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_false = false,
				_true = true,
				_Uize = Uize,

				/*** constants ***/
					_SERVICE_TAKING_TOO_LONG = 5000
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Utility Functions ***/
			function _log (_message) {
				typeof console != 'undefined' && typeof console.log == 'function' &&
					console.log (_message)
				;
			}

			function _methodCaller (_this,_methodName) {
				return function () {return _this [_methodName].apply (_this,arguments)};
			}

		/*** Private Static Properties ***/
			_class._serviceMethods = {};

		/*** Private Instance Methods ***/
			_classPrototype._warn = function (_message) {
				_log ('SERVICE WARNING: ' + _message);
			};

		/*** Public Static Methods ***/
			_class.serviceMethods =
			_class.declareServiceMethods = /* DEPRECATED 2013-01-09 */
			function (_serviceMethods) {
				var
					_this = this,
					_thisServiceMethods = _this._serviceMethods,
					_serviceMethodPublicWrappers = {}
				;
				function _declareServiceMethod (_methodName,_methodProfile) {
					var _isInitMethod = _methodName == 'init';

					function _methodError (_message) {return '<< ' + _methodName + ' >> ' + _message}

					if (_this.prototype [_methodName])
						throw new Error (
							_methodError ('You may not override a non-service public method with a service method')
						)
					;

					_thisServiceMethods [_methodName] = _methodProfile || (_methodProfile = {});

					/* NOTES:
						normalize method profile

						eg.
						{
							async: true (default) | false,
							params: {...}
						}
					*/
					_methodProfile.async = _methodProfile.async !== _false;

					_serviceMethodPublicWrappers [_methodName] = function (_params,_callback) {
						var
							_this = this,
							_adapter = _this.get ('adapter'),
							_methodIsAsync = _methodProfile.async
						;
						if (!_methodIsAsync) {
							if (!_adapter)
								throw new Error (
									_methodError (
										'To call a synchronous service method, a service adapter must be set and the service must be initialized'
									)
								)
							;
							if (!_isInitMethod && !_this.get ('initialized'))
								throw new Error (
									_methodError (
										'In order to call a synchronous service method, the service must already be initialized'
									)
								)
							;
						}
						if (_params == _undefined) {
							_params = {};
						} else if (typeof _params != 'object') {
							throw new Error (_methodError ('First argument (params) must be an object, null, or undefined'));
						}
						var
							_adapterMethodWasAsync = _false,
							_timeCalled,
							_timeReturned,
							_takingTooLongTimeout,
							_result,
							_error,
							_handleReturnFromAdapterMethod = function () {
								_takingTooLongTimeout && clearTimeout (_takingTooLongTimeout);
								function _callCallback () {
									var _onSuccess, _onError;
									if (_callback) {
										var _typeofCallback = typeof _callback;
										if (_typeofCallback == 'function') {
											_onSuccess = _callback;
										} else if (_typeofCallback == 'object') {
											_onSuccess = _callback.onSuccess;
											_onError = _callback.onError;
										}
									}
									if (_error) {
										if (_onError) {
											_onError (_error);
										} else {
											typeof _error == 'string'
												? (_error = new Error (_methodError (_error)))
												: (_error.message = _methodError (_error.message))
											;
											throw _error;
										}
									} else {
										_isInitMethod && _this.set ('initialized',_true);
										_onSuccess && _onSuccess (_result);
									}
								}
								if (_timeReturned !== _undefined) {
									throw new Error (_methodError ('Service adapter method should only return once'));
								} else {
									_timeReturned = Uize.now ();
									var _adapterMethodDuration = _timeReturned - _timeCalled;
									_adapterMethodDuration > _SERVICE_TAKING_TOO_LONG &&
										_this._warn (
											_methodError(
												'Service adapter method took too long to return (' + _adapterMethodDuration + 'ms)'
											)
										)
									;
									if (_methodProfile.async) {
										_adapterMethodWasAsync ? _callCallback () : setTimeout (_callCallback,0);
									} else {
										if (_adapterMethodWasAsync) {
											throw new Error (
												_methodError (
													'Service method is declared as synchronous, but implementation in adapter is asynchronous'
												)
											);
										} else {
											_callCallback ();
										}
									}
								}
							},
							_callAdapterMethod = function () {
								if (
									_adapter [_methodName] (
										_params,
										function (_response) {
											_result = _response;
											_handleReturnFromAdapterMethod ();
										},
										function (_errorResponse) {
											_error = _errorResponse || {};
											_handleReturnFromAdapterMethod ();
										}
									) !== _undefined
								)
									throw new Error (
										_methodError (
											'Service adapter method should always provide its result through a callback, not a return statement'
										)
									)
								;
								_adapterMethodWasAsync = _true;
							}
						;

						// now ready to start the call
						_timeCalled = Uize.now ();
						if (_methodIsAsync)
							_takingTooLongTimeout = setTimeout (
								function () {
									var _initialized = _this.get ('initialized');
									_this._warn (
										_methodError (
											_adapter && _initialized
												? 'Service adapter method taking too long to return'
												: (
													'Taking too long to be ready to call service adapter method (' +
														'adapter ' + (_adapter ? '' : 'not ') + 'set, ' +
														(_initialized ? '' : 'not ') + 'initialized' +
													')'
												)
										)
									);
								},
								_SERVICE_TAKING_TOO_LONG
							)
						;
						if (_isInitMethod) {
							_params.serviceInterface = {
								fire:_methodCaller (_this,'fire'),
								wire:_methodCaller (_this,'wire'),
								set:_methodCaller (_this,'set'),
								get:_methodCaller (_this,'get')
							};
							_params.service = _this;
							_this.once ('adapter',_callAdapterMethod);
						} else {
							if (!_adapter) {
								_this._warn (_methodError ('Adapter is not yet set when service method is called'));
							} else if (!_this.get ('initialized')) {
								_this._warn (
									_methodError (
										'Service adapter is set but not yet initialized when service method is called'
									)
								);
							}
							_this.once (
								'adapter',
								function () {
									_adapter = _this.get ('adapter');
									_this.once ('initialized',_callAdapterMethod);
								}
							);
						}
						return _result;
					};
				}
				if (arguments.length != 1 || typeof _serviceMethods != 'object')
					_serviceMethods = [].slice.call (arguments)
				;
				Uize.forEach (
					_serviceMethods,
					Uize.isArray (_serviceMethods)
						? function (_methodName) {_declareServiceMethod (_methodName)}
						: function (_methodProfile,_methodName) {_declareServiceMethod (_methodName,_methodProfile)}
				);
				Uize.copyInto (_this.prototype,_serviceMethodPublicWrappers);
				/*?
					Static Methods
						Uize.Service.serviceMethods
							.

							EXAMPLE
							..........................................
							var FileSystem = Uize.Service.subclass ();
							FileSystem.serviceMethods ({
								readFile:{
									async:false
								},
								writeFile:{
									async:false
								},
								getFiles:{
									async:false
								},
								getFolder:{
									async:false
								},
								// etc.
								// etc.
							});
							..........................................

					Deprecated Features
						Uize.Service.declareServiceMethods -- DEPRECATED 2013-01-09
							The =Uize.Service.declareServiceMethods= static method has been deprecated in favor of the newly added =Uize.Service.serviceMethods= static method.

							............................................................................
							Uize.Service.declareServiceMethods >> BECOMES >> Uize.Service.serviceMethods
							............................................................................

							The =Uize.Service.serviceMethods= method is essentially just a renaming of the deprecated =Uize.Service.declareServiceMethods= method and behaves in exactly the same way. The new name was chosen to fit, in a more semantically elegant way, with the new capability of the =Uize.Class.subclass= method (inherited by the =Uize.Service= class) that lets you declare class features when creating a subclass.

							According to how this behavior works, it is possible to declare service methods when creating a service class by specifying a =serviceMethods= property in the =featuresByTypeOBJ= parameter, as follows...

							EXAMPLE
							.........................................
							var FileSystem = Uize.Service.subclass ({
								serviceMethods:{
									readFile:{
										async:false
									},
									writeFile:{
										async:false
									},
									getFiles:{
										async:false
									},
									getFolder:{
										async:false
									},
									// etc.
									// etc.
								}
							});
							.........................................

				*/
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_adapter:{
					name:'adapter',
					conformer:function (_adapter) {
						if (typeof _adapter == 'string') {
							var _adapterClass = Uize.getModuleByName (_adapter);
							if (_adapterClass) {
								_adapter = new _adapterClass;
							} else {
								throw new Error (
									'The adapter module ' + _adapter + ' must be required and loaded first if you wish to set an adapter by module name'
								);
							}
						}
						if (_adapter != _undefined) {
							// validate the service adapter
							var _missingServiceMethods = [];
							Uize.forEach (
								this.constructor._serviceMethods,
								function (_serviceMethodProfile,_serviceMethod) {
									typeof _adapter [_serviceMethod] != 'function' &&
										_missingServiceMethods.push (_serviceMethod)
									;
								}
							);
							if (_missingServiceMethods.length) {
								_adapter = _undefined;
								throw new Error (
									'Service module adapter is missing implementations for service methods: ' + _missingServiceMethods.sort ().join (', ')
								);
							}
						}
						return _adapter;
					},
					onChange:function () {this.set ({initialized:_false})}
					/*?
						State Properties
							adapter
								.
					*/
				},
				_initialized:{
					name:'initialized',
					value:_false
					/*?
						State Properties
							initialized
								.
					*/
				}
			});

		return _class;
	}
});

