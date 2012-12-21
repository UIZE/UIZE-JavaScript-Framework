/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Needs Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.Needs= class implements a mechanism for expressing needs/provides relationships in a semantically elegant way.

		*DEVELOPERS:* `Chris van Rensburg`

		### TO DOCUMENT
			A Simple Example
				document...

			Needs System Built on Conditions System
				document...

			Unwiring a Needer
				document...

			Unwiring a Provider
				document...

			Needs as Properties
				document...

			Neededness as Properties
				document...
*/

Uize.module ({
	name:'Uize.Util.Needs',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		/*** General Variables ***/
			var _needConditionPrefix = 'NEEDED_';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.need = function (_needOrNeeds,_needer) {
				var
					_this = this,
					_wirings = _this.once (_needOrNeeds,_needer)
				;
				typeof _needOrNeeds == 'string'
					? _this.met (_needConditionPrefix + _needOrNeeds)
					: Uize.forEach (_needOrNeeds,function (_need) {_this.met (_needConditionPrefix + _need)})
				;
				return _wirings;
				/*?
					Instance Methods
						need
							
							DIFFERENT USAGES

							`Register Code That Has a Single Need`
							...........................................................
							wiringsOBJ = myNeedsInstance.need (needNameSTR,neederFUNC);
							...........................................................

							`Register Code That Has Multiple Needs`
							..............................................................
							wiringsOBJ = myNeedsInstance.need (needNamesARRAY,neederFUNC);
							..............................................................

							Register Code That Has a Single Need
								By specifying a =needNameSTR= parameter for the first argument when calling the =need= method, handler code can be registered that has only a single need.

								SYNTAX
								...........................................................
								wiringsOBJ = myNeedsInstance.need (needNameSTR,neederFUNC);
								...........................................................

								Specifing a single need in a call to the =need= method is the most typical use case.

								EXAMPLE
								....................................................
								needsManager.need (
									'auditSubsystem',
									function (_auditSubsystem) {
										// do something with the _auditSubsystem value
									}
								);
								....................................................

								In the above example,

							Register Code That Has Multiple Needs
								SYNTAX
								..............................................................
								wiringsOBJ = myNeedsInstance.need (needNamesARRAY,neederFUNC);
								..............................................................

								EXAMPLE
								.........................................................................
								needsManager.need (
									['auditSubsystem','securitySubsystem','notificationSubsystem']
									function (_auditSubsystem,_securitySubsystem,_notificationSubsystem) {
										// do something with the needed subsystems
									}
								);
								.........................................................................

							Needer Function Signature
								document...

							Unwiring a Needer
								While it a highly unlikely use case, it is theoretically possible to unwire a handler for a need or set of needs.
				*/
			};

			_classPrototype.provide = function (_need,_provider) {
				var _this = this;
				return _this.once (
					_needConditionPrefix + _need,
					function () {_provider (function (_provided) {_this.met (_need,_provided)})}
				);
				/*?
					Instance Methods
						provide
							Lets you register a provider function for the specified need.

							SYNTAX
							................................................................
							wiringsOBJ = myNeedsInstance.provide (needNameSTR,providerFUNC);
							................................................................

							The provider function specified by the =providerFUNC= parameter will be called the first time that the need specified by the =needNameSTR= parameter is needed via a call to the =need= method on the instance. When the provider function is called, it will be passed a single parameter, being the callback function that it should call in order to provide the needed result. The callback signature allows the need to be satisfied in a potentially asynchronous manner.

							EXAMPLE
							.......................................................................
							// create the Uize.Util.Needs instance

							var needsManager = Uize.Util.Needs ();

							// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

							// register the provider

							needsManager.provide (
								'auditSubsystem',
								function (provide) {
									var _auditSubsystem;
									// do something to assign value for _auditSubsystem and set it up
									provide (_auditSubsystem);
								}
							);

							// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

							// register the needer

							needsManager.need (
								'auditSubsystem',
								function (_auditSubsystem) {
									// do something with the _auditSubsystem value
								}
							);
							.......................................................................

							Unwiring a Provider
								document...
				*/
			};

		return _class;
	}
});

