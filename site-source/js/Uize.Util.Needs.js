/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Needs Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.Needs= class implements a mechanism for expressing needs/provides relationships in a semantically elegant way.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Util.Needs= class facilitates needs management and can ensure correct order of execution of code in situations where dependency relationships exist between disparate and distributed code.

			A common problem with complex application code, where initialization of different components of code may involve potentially asynchronous processes, or processes that may sometimes be synchronous and under other conditions be asynchronous, is that some code that has a need for some object to have been created, or for the completion of some setup phase, is not able to explicitly control the timing of when its need will be met - it may be at the mercy of some other complex chain of events that involves yet other code over which it has no control.

			In tricky situations like this, the =Uize.Util.Needs= class allows needs to be explicitly exposed by registering `providers` for those needs. Then, those needs can in turn be needed explicitly by registering `needers`. This allows needer code to be declared as being dependent on a need (or needs), and provider code to be declared as being the provider of a need. When a provider is registered for a need, that provider code is invoked the first time that the need is needed. Once the provider has finished producing the need result, that result is provided to the needer handler function, and is essentially "cached" for future needers of the same need.

			This is all best illustrated with a simple example...

			EXAMPLE
			..................................................................
			// create the needs manager instance
			var needsManager = Uize.Util.Needs ();

			// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

			// register the "myThing" provider
			needsManager.provide (
				'myThing',
				function (_provide) {
					Uize.require (
						'MyNamespace.MyThing',
						function (_MyNamespace_MyThing) {
							var _myThing = new _MyNamespace_MyThing ();
							// do _myThing instance setup
							_provide (_myThing);
						}
					);
				}
			);

			// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

			// register the "myThing" needer
			needsManager.need (
				'myThing',
				function (_myThing) {
					// do something with _myThing
				}
			);
			..................................................................

			In the above example, a =Uize.Util.Needs= instance is being created by calling the class constructor. Then, in some other code, a provider is being registered for the "myThing" need by calling the =provide= instance method on the instance, specifying the name of the need along with the provider function that should be called the first time that the need is needed. When the provider function is called, it is provided callback function that it should call in order to deliver the need result.

			The callback pattern is important, because it allows the provider code to be potentially asynchronous. This is a good thing, because in this case the provider function is requiring the =MyNamespace.MyThing= module, creating an instance of it, and then passing that back using the callback. Requiring the module will likely be asynchronous if it is not already loaded.

			Now, on the opposite side of the world, a needer is being registered for the "myThing" need by calling the =need= instance method on the shared =needsManager= instance, specifying the name of the need along with the handler function that should be called once the need has been provided. The handler function receives the need result as its single argument, and it can then do with the needed item what it pleases.

			It's as simple as that.

			Decoupling and Insulating Needers from Providers
				The needs system makes it possible to decouple and insulate needers from providers.

				In our example above, let's pretend that the code that registers the provider and the code that registers the needer are in totally separate parts of the code, possibly even in different modules, and that the needer code knows nothing about how the need is provided - when the provider is registered, and whether the need is provided in a synchronous or asynchronous manner.

				All the needer knows is that the need is named "myThing" and is managed through a =Uize.Util.Needs= instance that is accessible via the variable =needsManager=. Similarly, the provider knows nothing about how the need is needed - whether or not it will even be needed at runtime, how many needers will depend on the need, and when those needers might be registered (could be before or after the provider is registered). All the provider knows is that the need is named "myThing" and is managed through a =Uize.Util.Needs= instance assigned to the shared variable =needsManager=.

				This is a pretty effective decoupling of the needer and provider, insulating the two pieces of code from execution order irregularities or inconsistencies that may be introduced over time as the code evolves, or that may always exist due to differences between the various environments in which the code may execute.

			Needers and Providers
				The =Uize.Util.Needs= class provides a way to set up `casual relationships` between `needers` and `providers`.

				Needer ~~ Needers
					A needer is defined as code that has one or more needs that must all be met before the code can be safely executed.

				Provider ~~ Providers
					A provider is defined as code that will provide a specific need and that will be invoked only the first time that that need is needed by a `needer`.

			Casual Relationships
				The relationship between `needers` and `providers` is casual, in the sense that needers and their counterpart providers can be defined anywhere inside the code and at any time.

				Timing Issues are Forgiven
					The timing of registering needers and providers is unimportant, and the either synchronous or asynchronous nature of providing a need is unimportant.

					This allows for flexible setup code, insulating `needer` code from timing / sequencing side effects that may arise from provider code involving asynchronous processes, or having dependencies on external modules that may be packaged and immediately available in production deployment of code but loaded asynchronously one-at-a-time in a non-packaged dev deployment of the code.

				Dormant Providers
					The needs system allows `providers` to be registered so that the provider code is waiting around in a dormant state, until such a time as the need is actually needed - if ever.

					Lazy Providing
						For needs that are eventually needed, but possibly much later in execution, the needs system allows the provider code to be executed in a lazy / just-in-time fashion.

						This can be particularly useful where there are many needs that may be defined as part of an application's setup, but where varied user interface with the application may result in those needs only coming into play much later in execution. By providing the needs in a just-in-time fashion, the initial setup burden for the application can be diminished and spread out instead over the lifetime running of the application.

					Occasionally Needed Needs
						For needs that are only occasionally needed, and sometime possibly never needed, the needs system ensures that provider code for those needs remains dormant and is never executed.

						This allows provider code to be registered for many possible needs that may or may not arise during the lifetime execution of an application, without adding excessive cost to the initial setup of the application for those needs that may never arise.

			Registering Needers and Providers
				The =Uize.Util.Needs= class provides instance methods for `registering needers` and `registering providers`.

				Registering Needers
					Needers can be registered by calling the =need= instance method, specifying the need (or needs) and the `needer` handler that should be executed once all the needs have been met.

					Multiple Needers for the Same Need
						The needs system allows multiple `needers` to be registered for the same need.

						EXAMPLE
						.........................................................................
						needsManager.need (
							'auditSubsystem',
							function (_auditSubsystem) {
								// do something with the _auditSubsystem value
							}
						);

						// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

						needsManager.need (
							['auditSubsystem','securitySubsystem','notificationSubsystem']
							function (_auditSubsystem,_securitySubsystem,_notificationSubsystem) {
								// do something with the needed subsystems
							}
						);
						.........................................................................

						In the above example, two `needers` are being registered: the first needs the "auditSubsystem" need, while the second needs the "auditSubsystem" along with two other needs. The first needer handler will get executed once the "auditSubsystem" need has been provided, while the second needer handler will get executed only once the "auditSubsystem" need as well as the other two needs have been provided.

						Now, if the other two needs had already been provided by the time that the "auditSubsystem" need was provided, then the two handlers would get executed at the same time. If not, then the second needer handler will get executed some time later, once both of the other two needs have been provided.

				Registering Providers
					Providers can be registered by calling the =provide= instance method, specifying the need and the `provider` handler that should be executed the first time that the need is needed.

					EXAMPLE
					.......................................................................
					// register the "auditSubsystem" provider
					needsManager.provide (
						'auditSubsystem',
						function (_provide) {
							Uize.require (
								'MyNamespace.AuditSubsystem',
								function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
							);
						}
					);
					.......................................................................

					In the above example, we are registering a provider for the "auditSubsystem" need. Registering the provider involves specifying the name of the need that is being provided, along with a handler function that will be responsible for providing the need and that will be called the first time that the need is needed.

					The provider function can execute asynchronous code in order to provide the need, so it is passed a callback function that should be called to deliver the result. You can name the argument for this callback function anything you like - in this example, we have named it =&#95;provide=. In the example, our provider is requiring a module =MyNamespace.AuditSubsystem=. When that module has been loaded, an instance is created and then passed as the result when calling the =&#95;provide= callback function.

					Only One Provider Per Need
						Unlike `registering needers`, where it is perfectly valid to register `multiple needers for the same need`, one should only ever register one provider per need.

						Registering multiple providers for the same need could produce unpredictable results and should, therefore, be avoided.

					Provider is Executed Only the First Time
						If a need that has already been provided is needed again by a different needer, then the cached need result is delivered to that needer.

						This ensures that the provider code is only executed the very first time that a need is needed and *not* redundantly thereafter.

			Provide Before Need, Need Before Provide
				By design, the needs system allows providers to be registered before corresponding needers, or needers to be registered before corresponding providers.

				So, for example, the two examples below would both work quite nicely and would produce the same great outcome - the needer code would get executed at just the right time once the need has been provided and not before.

				EXAMPLE - PROVIDE BEFORE NEED
				...............................................................................
				// register the "auditSubsystem" provider
				needsManager.provide (
					'auditSubsystem',
					function (_provide) {
						Uize.require (
							'MyNamespace.AuditSubsystem',
							function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
						);
					}
				);

				// register the "auditSubsystem" needer
				needsManager.need (
					'auditSubsystem',
					function () {alert (needsManager.is ('auditSubsystem'))}  // displays "true"
				);
				...............................................................................

				EXAMPLE - NEED BEFORE PROVIDE
				...............................................................................
				// register the "auditSubsystem" needer
				needsManager.need (
					'auditSubsystem',
					function () {alert (needsManager.is ('auditSubsystem'))}  // displays "true"
				);

				// register the "auditSubsystem" provider
				needsManager.provide (
					'auditSubsystem',
					function (_provide) {
						Uize.require (
							'MyNamespace.AuditSubsystem',
							function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
						);
					}
				);
				...............................................................................

			Needs System is Built on the Conditions System
				The needs system implemented in the =Uize.Util.Needs= module is built on top of the conditions system that is implemented in the =Uize.Class= base class module.

				Needs as Properties
					In the needs system, needs are implemented using state properties of the same name as the needs that they represent.

					So, for example, if a `needer` is registered for the "auditSubsystem" need, then the needer handler will be executed once the value of the =auditSubsystem= state property becomes truthy. Similarly, a provider handler that is registered for the "auditSubsystem" need (by calling the =provide= instance method) will set the value for the =auditSubsystem= state property once the provider function calls the callback it was passed and delivers the result for the "auditSubsystem" need.

				Neededness as Properties
					In a similar way to how the needs system implements `needs as properties`, the neededness for needs is implemented using state properties whose names are derived from the need names.

					When a need handler is registered for a need (by calling the =need= instance method), a state property is set to =true= whose name is the name of the need with the prefix "NEEDED&#95;" prepended. So, for example, if a `needer` is registered for the "auditSubsystem" need, then the state property named =NEEDED_auditSubsystem= will be set to =true=. Now, when a `provider` is registered for the "auditSubsystem" need (by calling the =provide= instance method), the provider code will only be executed once the =NEEDED_auditSubsystem= property becomes truthy.

			Unlimited Needs
				There is no limit imposed on the number of needs that can be managed through an instance of the =Uize.Util.Needs= class.

				You can register providers and needers for needs in an ad hoc fashion, and for as many different needs as is appropriate for your application. You can even programatically generate providers for needs using dynamically generated need names, if that's something that's useful for your application.

			As Many Needs Managers as Desired
				Because the needs system is implemented in a class, and because each instance of the class can support `unlimited needs`, it is possible to create as many needs managers as desired.

				One can use a =Uize.Util.Needs= instance exclusively within the implementation of a class in order to leverage the needers and providers pattern for instances of that class, or one could create a global shared =Uize.Util.Needs= instance in order to manage needs at an application environment level. So, you can have needs management at an instance scope, at a class scope, at a global scope, etc. Each instance of the =Uize.Util.Needs= class will manage its own set of needs.

			Unwiring Needers and Providers
				While it is a highly unlikely use case, it is theoretically possible to unwire needers and providers before they've had a chance to be executed.

				Both the =need= and =provide= methods return a wirings object that contains all the event wirings associated with the `needer` or `provider` registration, and this wirings object can be used to unwire the needer or provider handler before having had the chance to be called, simply by calling the =unwire= instance method and passing in the wirings object.

				For more detailed information, consult the section on `unwiring a needer` in the reference for the =need= method, and the section on `unwiring a provider` in the reference for the =provide= method.

			Troubleshooting Aids
				The =Uize.Util.Needs= class provides some features that are particularly useful for troubleshooting needs management code, along with some methods that are intended primarily for this purpose.

				These various features make it possible to observe and test the various states associated with needs management, without actually interfering with or disrupting the `needer` or `provider` handlers that are set up.

				Checking if a Need Has Been Needed
					To check if a need has yet been needed, one can call the =isNeeded= instance method, specifying the name of the need.

					EXAMPLE
					..........................................................................
					needsManager.need (
						'auditSubsystem',
						function (_auditSubsystem) {
							// do something with the _auditSubsystem value
						}
					);

					alert (needsManager.isNeeded ('auditSubsystem'));         // alert "true"
					alert (needsManager.isNeeded ('securitySubsystem'));      // alert "false"
					alert (needsManager.isNeeded ('notificationSubsystem'));  // alert "false"

					needsManager.need (
						'securitySubsystem',
						function (_securitySubsystem) {
							// do something with the _securitySubsystem value
						}
					);
					..........................................................................

					In the above example, alerting the value of =needsManager.isNeeded ('securitySubsystem')= displays "false". This is because, while the "securitySubsystem" need *is* needed, it is not yet needed at the time that the =isNeeded= method is called. Similarly, alerting the value of =needsManager.isNeeded ('notificationSubsystem')= displays "false", and in this case there is no `needer` code anywhere in sight for this need.

					For more detailed information, consult the reference for the =isNeeded= method.

				Checking if a Need Has Been Provided
					Because needs are represented using state properties, it is easy to check if a need has been provided simply by using the =is= instance method to test if a need's property is truthy.

					EXAMPLE
					...............................................................................
					alert (needsManager.is ('auditSubsystem'));  // displays "false"

					// register the "auditSubsystem" provider
					needsManager.provide (
						'auditSubsystem',
						function (_provide) {
							Uize.require (
								'MyNamespace.AuditSubsystem',
								function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
							);
						}
					);

					alert (needsManager.is ('auditSubsystem'));  // displays "false"

					// register the "auditSubsystem" needer
					needsManager.need (
						'auditSubsystem',
						function () {alert (needsManager.is ('auditSubsystem'))}  // displays "true"
					);
					...............................................................................

					In the above example, we are registering a provider for the "auditSubsystem" need. However, before the provider has been registered, we are testing if the need has been provided using the expression =needsManager.is ('auditSubsystem')=. Naturally, this test produces the result =false=, since the need has not yet been provided. After all, the provider for the need has not even been registered. Then, immediately after the provider is registered, we are once again testing if the need has been provided. This test still produces the result =false=, since no needer has yet been registered. Finally, we are registering a needer for the need, and in the handler code we are once more executing the same test. This time the test produces the result =true=, since by the time that the need handler is executed, the =auditSubsystem= state property will have been set to a truthy value.

				Executing Code Once Needs Have Been Needed
					In order to execute code only once one or more needs have been needed, you can call the dedicated =onceNeeded= instance method.

					SYNTAX
					.....................................................................
					wiringsOBJ = myNeedsInstance.onceNeeded (needNameSTR,handlerFUNC);

					// or...

					wiringsOBJ = myNeedsInstance.onceNeeded (needNamesARRAY,handlerFUNC);
					.....................................................................

					Unlike the =need= method, the =onceNeeded= method does not have the effect of prompting execution of any provider code that is registered for the needs - it has merely an observing effect. The =onceNeeded= method can be used to watch when needs are first needed, without having to touch either the `needer` or `provider` code.

					For more detailed information, consult the reference for the =onceNeeded= method.

				Executing Code Once Needs Have Been Provided
					Because needs are represented using state properties, it is easy to execute code once needs have been provided simply by using the =once= instance method that is inherited from the =Uize.Class= base class.

					EXAMPLE
					...........................................................................................
					// register the "auditSubsystem" provider
					needsManager.provide (
						'auditSubsystem',
						function (_provide) {
							Uize.require (
								'MyNamespace.AuditSubsystem',
								function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
							);
						}
					);

					// register neutral observer code to watch when the "auditSubsystem" need has been provided
					needsManager.once (
						'auditSubsystem',
						function () {alert ('now the "auditSubsystem" has been provided')}
					));

					// register the "auditSubsystem" needer
					needsManager.need (
						'auditSubsystem',
						function (_auditSubsystem) {
							// do something with the _auditSubsystem value
						}
					);
					...........................................................................................

					In the above example, a provider is being registered for the "auditSubsystem" need. Then, we are using the =once= method to register a handler that should be executed once the "auditSubsystem" need has been provided (ie. the value of the =auditSubsystem= property has become truthy). Registering this handler has no effect on the need being provided - if no needer were ever registered for the "auditSubsystem" need, then the provider would never get executed and our observer code would also not get executed. Finally, we're registering a needer for the "auditSubsystem" need. Once this has invoked the provider for the need and the provider has completed providing the "auditSubsystem" need, then our observer code will be executed and we will see the alert dialog.
*/

Uize.module ({
	name:'Uize.Util.Needs',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		/*** General Variables ***/
			var _needConditionPrefix = 'NEEDED_';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.isNeeded = function (_need) {
				return this.is (_needConditionPrefix + _need);
				/*?
					Instance Methods
						isNeeded
							Returns a boolean, indicating whether or not the specified need has yet been needed.

							SYNTAX
							......................................................
							isNeededBOOL = myNeedsInstance.isNeeded (needNameSTR);
							......................................................

							The =isNeeded= method is provided primarily for situations where you wish to test if specific needs are needed, without actually interfering with or disrupting the `needer` or `provider` handlers that are set up. Unlike the =need= method, the =isNeeded= method does not have the effect of prompting execution of any provider code that is registered for the needs - it has merely an observing effect.

							The =isNeeded= method can be useful when you are debugging / troubleshooting code that is using the =Uize.Util.Needs= class and is one of several available `troubleshooting aids`.

							NOTES
							- see the related =onceNeeded= instance method
				*/
			};

			_classPrototype.onceNeeded = function (_needOrNeeds,_handler) {
				return this.once (
					typeof _needOrNeeds == 'string'
						? _needConditionPrefix + _needOrNeeds
						: Uize.map (_needOrNeeds,function (_need) {return _needConditionPrefix + _need}),
					_handler
				);
				/*?
					Instance Methods
						onceNeeded
							Lets you register a handler that should be executed once all of the specified needs have been needed.

							DIFFERENT USAGES

							`Register a Handler for Once a Single Need Has Been Needed`
							..................................................................
							wiringsOBJ = myNeedsInstance.onceNeeded (needNameSTR,handlerFUNC);
							..................................................................

							`Register a Handler for Once Multiple Needs Have Been Needed`
							.....................................................................
							wiringsOBJ = myNeedsInstance.onceNeeded (needNamesARRAY,handlerFUNC);
							.....................................................................

							The =onceNeeded= method is provided primarily for situations where you wish to observe when specific needs are needed, without actually interfering with or disrupting the `needer` or `provider` handlers that are set up. Unlike the =need= method, the =onceNeeded= method does not have the effect of prompting execution of any provider code that is registered for the needs - it has merely an observing effect.

							The =onceNeeded= method can be useful when you are debugging / troubleshooting code that is using the =Uize.Util.Needs= class and is one of several available `troubleshooting aids`.

							Register a Handler for Once a Single Need Has Been Needed
								By specifying a =needNameSTR= parameter for the first argument when calling the =onceNeeded= method, handler code can be registered for once a single need has been needed.

								SYNTAX
								..................................................................
								wiringsOBJ = myNeedsInstance.onceNeeded (needNameSTR,handlerFUNC);
								..................................................................

							Register a Handler for Once Multiple Needs Have Been Needed
								By specifying a =needNamesARRAY= parameter for the first argument when calling the =onceNeeded= method, handler code can be registered for once multiple needs have all been needed.

								SYNTAX
								.....................................................................
								wiringsOBJ = myNeedsInstance.onceNeeded (needNamesARRAY,handlerFUNC);
								.....................................................................

							NOTES
							- see the related =isNeeded= instance method
				*/
			};

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
							Lets you register code that should only be executed once one or more needs have been satisfied, and invokes the `providers` of those needs if the providers have already been registered.

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

								In the above example, code is being registered that needs the "auditSubsystem".

							Register Code That Has Multiple Needs
								By specifying a =needNamesARRAY= parameter for the first argument when calling the =need= method, handler code can be registered that has multiple needs.

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

								In the above example, code is being registered that needs the "auditSubsystem", "securitySubsystem", and "notificationSubsystem".

							Needer Function Signature
								The handler function that is specified when calling the =need= method should expect to receive as many arguments as needs that were specified.

								Once all the needs that are specified in a call to the =need= method have been provided, the handler for the needs will be called and the results for all the needs will be passed in as arguments to the function, in the order in which the needs were originally specified when calling the =need= method.

								EXAMPLE
								.........................................................................
								needsManager.need (
									['auditSubsystem','securitySubsystem','notificationSubsystem']
									function (_auditSubsystem,_securitySubsystem,_notificationSubsystem) {
										// do something with the needed subsystems
									}
								);
								.........................................................................

							Unwiring a Needer
								While it is a highly unlikely use case, it is theoretically possible to unwire a handler for a need or set of needs.

								Because the =need= method returns a wirings object that contains all the event wirings associated with the `needer` registration, this wirings object can be used to unwire the needer before it has been called. Consider the following example...

								EXAMPLE
								.......................................................................
								// register the "auditSubsystem" needer
								var needWirings = needsManager.need (
									'auditSubsystem',
									function (_auditSubsystem) {alert (_auditSubsystem)}
								);

								// unwire the "auditSubsystem" need wirings
								needsManager.unwire (needWirings);

								// register the "auditSubsystem" provider
								needsManager.provide (
									'auditSubsystem',
									function (_provide) {
										Uize.require (
											'MyNamespace.AuditSubsystem',
											function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
										);
									}
								);
								.......................................................................

								In the above example, the =alert= statement inside the handler for the "auditSubsystem" need will never be executed, because the need handler is being unwired before the `provider` for the need is ever registered.
				*/
			};

			_classPrototype.provide = function (_need,_provider) {
				var _this = this;
				return (
					_this.is (_need)
						/* NOTE:
							Allow for the possibility that the need was met explicitly by some other code before the provider is even registered (this is an edge case).
						*/
						? {} // if need is already met, return empty wirings object, since there will be nothing to unwire
						: _this.once (
							_needConditionPrefix + _need,
							function () {
								_this.is (_need) ||
									/* NOTE:
										Allow for the possibility that the need was met explicitly by some other code before the needer was registered (this is an edge case).
									*/
									_provider (
										function (_provided) {
											_this.is (_need) || _this.met (_need,_provided);
											/* NOTE:
												Allow for the possibility that the need was met by some other code while asynchronous provider code was being executed (this is an unlikely edge case).
											*/
										}
									)
								;
							}
						)
				);
				/*?
					Instance Methods
						provide
							Lets you register a `provider` function for the specified need.

							SYNTAX
							................................................................
							wiringsOBJ = myNeedsInstance.provide (needNameSTR,providerFUNC);
							................................................................

							The `provider` function specified by the =providerFUNC= parameter will be called the first time that the need specified by the =needNameSTR= parameter is needed via a call to the =need= method on the instance. When the provider function is called, it will be passed a single parameter, being the callback function that it should call in order to provide the needed result. The callback signature allows the need to be satisfied in a potentially asynchronous manner.

							EXAMPLE
							.......................................................................
							// create the Uize.Util.Needs instance
							var needsManager = Uize.Util.Needs ();

							// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

							// register the "auditSubsystem" provider
							needsManager.provide (
								'auditSubsystem',
								function (_provide) {
									var _auditSubsystem;
									// do something to assign value for _auditSubsystem and set it up
									_provide (_auditSubsystem);
								}
							);

							// ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...

							// register the "auditSubsystem" needer
							needsManager.need (
								'auditSubsystem',
								function (_auditSubsystem) {
									// do something with the _auditSubsystem value
								}
							);
							.......................................................................

							In the above example, an instance of the =Uize.Util.Needs= class is created and assigned to the variable =needsManager=. In some part of the code, the =provide= method is being called on the instance in order to register a `provider` for the "auditSubsystem" need. In another part of the code, the =need= method is being called in order to register code that has a dependency on the "auditSubsystem" need.

							It's worth noting that the registration of the provider and the `needer` can occur in any order and at any time. The needs mechanism will take care of ensuring that the provider code is only called once the need is actually needed, and that the needer code is only called once the need is actually provided.

							Provider Function Signature
								The `provider` function that is registered when calling the =provide= method should expect to receive a single parameter, being the callback function that it should call in order to provide the needed result once it is ready.

								EXAMPLE
								.......................................................................
								needsManager.provide (
									'auditSubsystem',
									function (_provide) {
										Uize.require (
											'MyNamespace.AuditSubsystem',
											function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
										);
									}
								);
								.......................................................................

							Unwiring a Provider
								While it is a highly unlikely use case, it is theoretically possible to unregister a `provider` for a need or set of needs.

								Because the =provide= method returns a wirings object that contains all the event wirings associated with the provider registration, this wirings object can be used to unregister the provider before it has been called. Consider the following example...

								EXAMPLE
								.......................................................................
								// register the "auditSubsystem" provider
								var providerWirings = needsManager.provide (
									'auditSubsystem',
									function (_provide) {
										Uize.require (
											'MyNamespace.AuditSubsystem',
											function (_AuditSubsystem) {_provide (new _AuditSubsystem ())}
										);
									}
								);

								// unregister the auditSubsystem provider
								needsManager.unwire (providerWirings);

								// register the "auditSubsystem" needer
								needsManager.need (
									'auditSubsystem',
									function (_auditSubsystem) {alert (_auditSubsystem)}
								);
								.......................................................................

								In the above example, the =alert= statement inside the handler for the "auditSubsystem" need will never be executed, because the `provider` for the "auditSubsystem" need is being unregistered before the `needer` is ever registered.
				*/
			};

		return _class;
	}
});

