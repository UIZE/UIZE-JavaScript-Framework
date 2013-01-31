/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class Base Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 10
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Class= module defines a base class from which many of the classes in the UIZE JavaScript Framework inherit.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
			Features for Subclassing
				The =Uize.Class= module provides a number of features to facilitate creation and definition of subclasses.

				Subclass Creation
					The =Uize.Class.subclass= static method lets you create a subclass of the class on which the method is called.

					EXAMPLE
					.....................................
					var MySubclass = MyClass.subclass ();
					.....................................

				Feature Declaration Methods
					The =Uize.Class= module provides a number of methods that let you declare instance and/or static features of a class.

					- =Uize.Class.declare= - lets you declare one or more features of one or more different `feature types` for the class
					- =Uize.Class.alphastructor= - lets you declare the `alphastructor` for the class
					- =Uize.Class.omegastructor= - lets you declare the `omegastructor` for the class
					- =Uize.Class.instanceMethods= - lets you declare one or more instance methods for the class
					- =Uize.Class.instanceProperties= - lets you declare one or more instance properties for the class
					- =Uize.Class.staticMethods= - lets you declare one or more static methods for the class
					- =Uize.Class.staticProperties= - lets you declare one or more static properties for the class
					- =Uize.Class.dualContextMethods= - lets you declare one or more `dual context` methods for the class
					- =Uize.Class.dualContextProperties= - lets you declare one or more `dual context` properties for the class
					- =Uize.Class.stateProperties= - lets you declare one or more state properties for instances of the class

					Declare Private or Public Features
						The `feature declaration methods` can be used either to declare public features or private features.

						In UIZE, there is no fundamental difference between private methods or properties and public methods or properties - it's all in the naming. By convention, private features are named with an "_" (underscore) prefix. This has its pros and cons, but one side effect of this is that either private or public features (or a mixture of both) can be declared using the `feature declaration methods`.

						EXAMPLE
						........................................
						_class.instanceMethods ({
							_privateInstanceMethod1:function () {
								// implementation here
							},
							_privateInstanceMethod2:function () {
								// implementation here
							},
							publicInstanceMethod1:function () {
								// implementation here
							},
							publicInstanceMethod2:function () {
								// implementation here
							}
						});
						........................................

						In the above example, one call to the =Uize.Class.instanceMethods= method is being used to declare the =_privateInstanceMethod1= and =_privateInstanceMethod2= private instance methods, along with the =publicInstanceMethod1= and =publicInstanceMethod2= public instance methods.

					Feature Declarations are Cumulative
						All the `feature declaration methods` can be called as many times as desired, and calling them repeatedly is cumulative in nature.

						This is useful, because it lets you break out declarations into different sections in your code if that makes your code more readable and/or manageable.

						EXAMPLE
						........................................
						// Private Instance Methods
						_class.instanceMethods ({
							_privateInstanceMethod1:function () {
								// implementation here
							},
							_privateInstanceMethod2:function () {
								// implementation here
							}
						});

						// ... ... ... ... ... ... ... ... ...

						// Public Instance Methods
						_class.instanceMethods ({
							publicInstanceMethod1:function () {
								// implementation here
							},
							publicInstanceMethod2:function () {
								// implementation here
							}
						});
						........................................

						In the above example, the =Uize.Class.instanceMethods= method is being called twice - in one section to declare private instance methods, and in the other section to declare public instance methods.

					Add or Override Features
						The `feature declaration methods` can be used either to add features that aren't inherited from the class' base class, or to override features that are inherited from the base class.

					Dual Context
						Dual context class features are features that exist both on the class as well as instances of the class.

						Examples dual context features are the various `event system methods`. For example, the =fire= instance method lets you fire an instance event, while the =Uize.Class.fire= static method lets you fire an event on a class. Both the instance and class methods for firing events share the same underlying implementation, where the implementation may contain minor conditionalizing when executing in the instance context versus executing in the class context.

						In cases where it is possible (and possibly even desirable) to share the same function between an instance method and a class method, the =Uize.Class.dualContextMethods= static method can be used to declare such methods in a single statement, rather than separately calling both the =Uize.Class.instanceMethods= and =Uize.Class.staticMethods= methods.

						Although a less likely scenario, it is also possible to declare dual context properties using the =Uize.Class.dualContextProperties= static method. This method is present mainly for symmetry and consistency.

						For dual context features, it is assumed that the feature is named the same on both the instance and the class. In situations where this is not the case, one should just use the separate methods for defining instance features and class features.

					Declaring Multiple Features, Categorized by Type
						Multiple features, categorized by type, can be declared for a class by either `declaring features by type when creating a class` or by `declaring features by type for an already created class`.

						Declaring Features by Type When Creating a Class
							The =Uize.Class.subclass= method supports a variation that lets you `create a subclass, declaring multiple features by type` at the time of creating a class, by supplying just a single =featuresByTypeOBJ= parameter.

							EXAMPLE
							....................................
							var MySubclass = MyClass.subclass ({
								alphastructor:function () {
									// implementation here
								},
								omegastructor:function () {
									// implementation here
								},
								staticMethods:{
									staticMethod1:function () {
										// implementation here
									},
									staticMethod2:function () {
										// implementation here
									}
								},
								instanceMethods:{
									instanceMethod1:function () {
										// implementation here
									},
									instanceMethod2:function () {
										// implementation here
									}
								},
								stateProperties:{
									stateProperty1:{
										// property profile
									},
									stateProperty2:{
										// property profile
									}
								}
							});
							....................................

						Declaring Features by Type for an Already Created Class
							One or more features of one or more different `feature types` can be declared for a class after the class has already been created, by calling the =Uize.Class.declare= method on the class and supplying a =featuresByTypeOBJ= parameter.

							EXAMPLE
							.....................................
							var MyClass = Uize.Class.subclass ();

							MyClass.declare ({
								alphastructor:function () {
									// implementation here
								},
								omegastructor:function () {
									// implementation here
								},
								staticMethods:{
									staticMethod1:function () {
										// implementation here
									},
									staticMethod2:function () {
										// implementation here
									}
								},
								instanceMethods:{
									instanceMethod1:function () {
										// implementation here
									},
									instanceMethod2:function () {
										// implementation here
									}
								},
								stateProperties:{
									stateProperty1:{
										// property profile
									},
									stateProperty2:{
										// property profile
									}
								}
							});
							.....................................

						Feature Types
							When a =featuresByTypeOBJ= parameter is passed to either the =Uize.Class.declare= or the =Uize.Class.declare= methods, the object may contain any of the following properties...

							- =alphastructor= - lets you declare the `alphastructor` for the class
							- =omegastructor= - lets you declare the `omegastructor` for the class
							- =instanceMethods= - lets you declare one or more instance methods for the class
							- =instanceProperties= - lets you declare one or more instance properties for the class
							- =staticMethods= - lets you declare one or more static methods for the class
							- =staticProperties= - lets you declare one or more static properties for the class
							- =dualContextMethods= - lets you declare one or more `dual context` methods for the class
							- =dualContextProperties= - lets you declare one or more `dual context` properties for the class
							- =stateProperties= - lets you declare one or more state properties for instances of the class

						How It's Implemented
							The properties of the =featuresByTypeOBJ= object should correspond to the names of the various `feature declaration methods` supported by the class being subclassed.

							When features are specified, categorized by type, in the =featuresByTypeOBJ= parameter, the =Uize.Class.declare= and =Uize.Class.subclass= methods will iterate over the properties of the object, attempting to call a static method of the name of each property encountered, on the class being subclassed, and passing the value of the property as the first parameter of the feature declaration method.

							So, for example, if the =Uize.Service.subclass= method is called to create a service class, and if a =featuresByTypeOBJ= parameter is specified, and if a =serviceMethods= property exists within the =featuresByTypeOBJ= object, then the =Uize.Service.serviceMethods= static method will be called and the value of the =serviceMethods= property from the =featuresByTypeOBJ= object will be passed as the single parameter to the =Uize.Service.serviceMethods= method.

							To illustrate this by example...

							THIS...
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

							...IS EQUIVALENT TO...
							..........................................
							var FileSystem = Uize.Service.subclass ();

							FileSystem.declare ({
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
							..........................................

							More Feature Types for Specific Base Classes
								Because of `how it's implemented`, `declaring multiple features, categorized by type`, inherently supports new feature types introduced in subclasses.

								For instance, the =Uize.Service= base class introduces the feature type of a service method and provides the =Uize.Service.serviceMethods= static method for declaring service methods. So, inherently, service methods can be declared in the =featuresByTypeOBJ= parameter along with other feature types that were introduced in the =Uize.Class= base class (instance methods, instance properties, static methods, static properties, state properties, etc.), simply by specifying a =serviceMethods= property in the =featuresByTypeOBJ= object.

								Therefore, if you implement a new base class of which multiple different subclasses will be created, and you define a static method that allows developers to declare features of a new feature type that is introduced in your base class, then features of that type can be declared in the =Uize.Class.subclass= and =Uize.Class.declare= methods.

							Less Conventional Usages
								Because of `how it's implemented`, one can also do less conventional things along with declaring features in the =Uize.Class.subclass= and =Uize.Class.declare= methods.

								For example, one can effectively call the =Uize.Class.set= static method to override the initial values of state properties that are inherited from the base class, as shown in the following example...

								THIS...
								...............................................................
								var MySliderWidgetSubclass = Uize.Widget.Bar.Slider.subclass ({
									instanceMethods:{
										// instance methods declared here
									},
									stateProperties:{
										// state properties declared here
									}
								});

								MySliderWidgetSubclass.set ({
									minValue:-50,
									maxValue:50
								});
								...............................................................

								...COULD BE SHORTENED TO...
								...............................................................
								var MySliderWidgetSubclass = Uize.Widget.Bar.Slider.subclass ({
									instanceMethods:{
										// instance methods declared here
									},
									stateProperties:{
										// state properties declared here
									},
									set:{
										minValue:-50,
										maxValue:50
									}
								});
								...............................................................

			Event System
				The =Uize.Class= module implements a powerful and versatile event system, which can be used for application events outside the context of browser DOM events.

				Event System Methods
					The `event system` of the =Uize.Class= module is exposed through the following methods...

					- =fire= - fires an event on an instance
					- =unwire= - unwires handlers for one or more events on an instance
					- =wire= - wires handlers for one or more events on an instance
					- =Uize.Class.fire= - fires an event on a class
					- =Uize.Class.unwire= - unwires handlers for one or more events on a class
					- =Uize.Class.wire= - wires handlers for one or more events on a class

				For an in-depth discussion of events, consult the [[../explainers/javascript-event-system.html][JavaScript Event System]] explainer.

			Condition System
				The =Uize.Class= module implements a condition system in the form of state properties combined with convenience methods that allow state properties to be treated semantically as conditions.

				Condition System Methods
					The `condition system` of the =Uize.Class= module is exposed through the following methods...

					- =is= - returns whether or not a state property is truthy (useful when a state property represents a condition)
					- =once= - registers code that is to be executed once a condition has been met
					- =met= - sets a condition as having been met
					- =unmet= - sets a condition as having not been met / no longer being met
					- =isMet= - returns whether or not a condition has been met

			The "no new" Mechanism
				The JavaScript =new= operator is optional when creating instances of =Uize.Class= subclasses, and you can make the =new= operator optional for your own object constructors using the newly added =Uize.noNew= static method.

				Creating Instances of Uize Classes
					Because the =Uize.Class= base class utilizes `the "no new" mechanism`, one can create instances of any =Uize.Class= subclass either using the =new= operator or not.

					EXAMPLE
					................................................................................
					// this works
					var mySlider1 = new Uize.Widget.Bar.Slider ({minValue:0,maxValue:100,value:50});

					// Look ma, no "new"!!!
					var mySlider2 = Uize.Widget.Bar.Slider ({minValue:0,maxValue:100,value:50});
					................................................................................

				All Uize Classes Get the Benefit
					Because of the way in which `the "no new" mechanism` is implemented in the =Uize.Class= base class, any class that is derived from a =Uize.Class= base class using the =subclass= method gets the same benefit, including classes that you create for your own applications.

					This means, for example, that any widget class you create by subclassing the =Uize.Widget= class will get the same benefit. Consider the following example...

					EXAMPLE
					..................................................
					// we create a widget class
					var MyWidgetClass = Uize.Widget.subclass ();

					// this works
					var myWidgetClassInstance1 = new MyWidgetClass ();

					// Look ma, no "new"!!!
					var myWidgetClassInstance2 = MyWidgetClass ();
					..................................................

				Applies for Other Uize Objects
					`The "no new" mechanism`, that is implemented in the =Uize.noNew= static method, has been applied to various other =Uize= objects (such as the =Uize.Color= object) that are lightweight objects rather than full =Uize.Class= subclasses.

					So, for example, one can create instances of the =Uize.Color= object or the =Uize.String.Builder= object without needing to use the =new= operator. Consider the following example...

					EXAMPLE
					.........................................
					// this works
					var fuchsia = new Uize.Color ('#ff0fff');

					// Look ma, no "new"!!!
					var olive = Uize.Color ('#808000');
					.........................................

				Using the Uize.noNew Method
					An object constructor that supports `the "no new" mechanism` can easily be created using the =Uize.noNew= static method.

					In cases where you're creating =Uize.Class= subclasses, you don't need to worry about the =Uize.noNew= method because `the "no new" mechanism` is built right into the =Uize.Class= base class, so `all Uize classes get the benefit`. However, in cases where you're defining your own lightweight objects, you can use the =Uize.noNew= method to create an object constructor where the =new= operator is optional. Consider the following example...

					EXAMPLE
					............................................................
					// define the Food object
					var Food = Uize.noNew (
						function (name,type) {
							this.name = name;
							this.type = type;
						}
					);

					// create an instance of Food using the new operator
					var apple = new Food ('apple','fruit');
					alert (apple.type);  // alerts the text "fruit"

					// create an instance of Food without using the new operator
					var rice = Food ('rice','grain');
					alert (rice.type);  // alerts the text "grain"
					............................................................

					What you'll notice from the above example is that the =Uize.noNew= method is quite simple - it takes a single parameter, which is the constructor function that initializes the new instance. This means that you can easily take an existing object constructor function and upgrade it to one that supports `the "no new" mechanism` by wrapping it inside a call to the =Uize.noNew= method, which then returns a wrapper constructor that becomes your new object constructor. Consider the following before-and-after example...

					BEFORE
					..............................................
					// must always use "new" with this constructor
					function Food (name,type) {
						this.name = name;
						this.type = type;
					}
					..............................................

					AFTER
					..........................................
					// "new" is optional with this constructor
					var Food = Uize.noNew (
						function (name,type) {
							this.name = name;
							this.type = type;
						}
					);
					..........................................

					Notice that you need to assign the result of the =Uize.noNew= method call, and so your original constructor function no longer should have the name.
*/

Uize.module ({
	name:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_typeString = 'string',
				_typeObject = 'object',
				_Function = Function,

				/*** references to utility methods of Uize ***/
					_Uize = Uize,
					_clone = _Uize.clone,
					_copyInto = _Uize.copyInto,
					_forEach = _Uize.forEach,
					_map = _Uize.map,
					_lookup = _Uize.lookup,
					_getClass = _Uize.getClass,
					_getGuid = _Uize.getGuid,
					_eval = _Uize.eval,
					_isArray = _Uize.isArray,
					_isFunction = _Uize.isFunction,
					_isInstance = _Uize.isInstance,
					_isObject = _Uize.isObject,
					_noNew = _Uize.noNew,
					_pairUp = _Uize.pairUp
			;

		/*** General Variables ***/
			var
				_sacredEmptyArray = [],
				_sacredEmptyObject = {}
			;

		/*** Class Constructor ***/
			var
				_class = _createSubclass (
					function () {},
					/*** alphastructor ***/
						function () {
							/*** Public Instance Properties ***/
								this.instanceId = _getGuid ();
									/*?
										Instance Properties
											instanceId
												An automatically generated name, that can be used as a means of identifying the specific instance in other code.

												When designing JavaScript classes, it is sometimes necessary in the class's implementation to set intervals, timeouts, or the event handlers of HTML nodes that make up an instance's user interface, so that they execute methods of the instance. Sometimes this must be done by generating JavaScript code that is to be interpreted. This generated code must, therefore, be able to reference its instance using a global identifier, because the code will be executed in a global context.

												If the constructor of your class uses the automatically generated value of an instance's =instanceId= property to assign a global reference to the instance, with a statement like =window [_this.instanceId] &#61; _this=, then the =instanceId= property can be used when generating JavaScript code that is to execute methods on the instance. Consider the following example...

												..................................................................
												MyClass.prototype.click = function () {
													// do something when the button is clicked
												};

												MyClass.prototype.insertButton = function () {
													document.writeln (
														'<input ' +
															'type="button" ' +
															'onclick="' + this.instanceId + '.click (); return false"' +
														'/>'
													);
												};
												..................................................................

												In the above example, we see a segment of the implementation for a =Uize.Class= subclass named =MyClass=. The =insertButton= instance method is writing HTML into the document, and the =input= tag that is created has an =onclick= attribute that registers an event handler that will execute the =click= method of that instance when clicked. That's because the global identifier by the name stored in the =instanceId= property is a reference to the instance.

												NOTES
												- the =instanceId= property's value is guaranteed to be unique for all instances of all =Uize.Class= subclasses in a document, but not across frames in a frameset, or across multiple pages in a Web site
									*/
						},
					/*** omegastructor ***/
						function (_properties) {
							/*** Initialize Properties ***/
								_properties || (_properties = _sacredEmptyObject);
								var
									_propertiesForSet = {},
									_instancePropertyDefaults = this.Class._instancePropertyDefaults,
									_property,
									_propertyDefault
								;
								for (_property in _instancePropertyDefaults) {
									if (_property in _properties)
										_propertiesForSet [_property] = _properties [_property];
									else if ((_propertyDefault = _instancePropertyDefaults [_property]) !== _undefined)
										_propertiesForSet [_property] = _propertyDefault
									;
								}
								for (_property in _properties)
									_property in _propertiesForSet || (_propertiesForSet [_property] = _properties [_property])
								;
								this.set (_propertiesForSet);
						}
				),
				_classPrototype = _class.prototype,
				_classNonInheritableStatics = _class.nonInheritableStatics
			;

		/*** Property System Support Code ***/
			function _getPropertyProfile (_this,_propertyPublicOrPrivateName) {
				var _class = _getClass (_this);
				return (
					_class._propertyProfilesByPublicNames [_propertyPublicOrPrivateName] ||
					_class._propertyProfilesByPrivateNames [_propertyPublicOrPrivateName]
				);
			}

			function _getPropertyPrivateName (_this,_propertyPublicOrPrivateName) {
				var _propertyProfile = _getPropertyProfile (_this,_propertyPublicOrPrivateName);
				return _propertyProfile ? _propertyProfile._privateName : _propertyPublicOrPrivateName;
			}

		/*** Private Instance-Static Methods ***/
			/*** Event System Methods ***/
				_class._abstractEventName = _classPrototype._abstractEventName = function (_eventName,_managementFunction) {
					if (_eventName.charCodeAt (0) == 67 && !_eventName.indexOf ('Changed.')) {
						var
							_this = this,
							_propertyPublicName = _eventName.slice (8),
							_propertyProfile = _getPropertyProfile (_this,_propertyPublicName)
						;
						if (_propertyProfile && _propertyPublicName != _propertyProfile._publicName)
							// use the canonical public name, since a pseudonym could have been specified
							_eventName = 'Changed.' + (_propertyPublicName = _propertyProfile._publicName)
						;
						_managementFunction (_eventName);
						(_this._hasChangedHandlers || (_this._hasChangedHandlers = {})) [_propertyPublicName] =
							_this._eventHandlers && _this._eventHandlers [_eventName]
						;
					} else {
						_managementFunction (_eventName);
					}
				};

		/*** Public Instance-Static Methods ***/
			/*** Event System Methods ***/
				_class.wire = _classPrototype.wire = function (_eventNameOrEventsMap,_handler) {
					var _this = this;
					if (arguments.length == 2) {
						_this._abstractEventName (
							_eventNameOrEventsMap,
							function (_eventName) {
								var _eventHandlers = _this._eventHandlers || (_this._eventHandlers = {});
								(_eventHandlers [_eventName] || (_eventHandlers [_eventName] = [])).push (
									{
										_eventName:_eventName,
										_handler:
											_isFunction (_handler)
												? _handler
												: typeof _handler == _typeString
													? _Function (_handler)
													: function (_event) {_handler.fire (_event)},
										_originalHandler:_handler
									}
								);
							}
						);
					} else if (_isObject (_eventNameOrEventsMap)) {
						for (var _eventName in _eventNameOrEventsMap)
							this.wire (_eventName,_eventNameOrEventsMap [_eventName])
						;
					}
					/*?
						Instance Methods
							wire
								Lets you wire a handler for a specific instance event, or handlers for multiple instance events.

								SYNTAX
								........................................................
								myInstance.wire (eventNameSTR,eventHandlerSTRorFNorOBJ);
								........................................................

								Event handlers registered using this method will handle events fired for the instance using the =fire= instance method, and not those events fired using the =Uize.Class.fire= static method. A =Uize.Class= subclass may not provide any instance events, so you should consult the reference documentation for a class to learn more about its suite of events. Handlers specified by the =eventHandlerSTRorFNorOBJ= parameter may be of string, function, or object type.

								EXAMPLE
								...........................................................
								mySlider.wire (
									'Changed.value',
									function () {Uize.Node.setValue ('valueField',mySlider)}
								);
								...........................................................

								VARIATION
								.............................................
								myInstance.wire (eventNamesToHandlersMapOBJ);
								.............................................

								When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =wire= instance method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								EXAMPLE
								...................................................................................
								mySlider.wire ({
									'Changed.value':
										function () {Uize.Node.setValue ('valueField',mySlider)},
									'Changed.maxValue':
										function () {Uize.Node.setValue ('maxValueField',mySlider.get ('maxValue'))},
									'Changed.minValue':
										function () {Uize.Node.setValue ('minValueField',mySlider.get ('minValue'))}
								});
								...................................................................................

								SPECIAL VALUES
								- the string value ="*"= acts as a wildcard when specified for the =eventNameSTR= parameter, meaning that the specified handler should be executed for all events of the instance

								NOTES
								- see the related =fire= and =unwire= instance methods
								- compare to the =Uize.Class.fire=, =Uize.Class.wire=, and =Uize.Class.unwire= static methods

						Static Methods
							Uize.Class.wire
								Lets you wire a handler for a static event of the class, or handlers for multiple static events.

								SYNTAX
								.....................................................
								MyClass.wire (eventNameSTR,eventHandlerSTRorFNorOBJ);
								.....................................................

								Event handlers registered using this method will handle events fired for the class using the =Uize.Class.fire= static method, and not those events fired using the =fire= instance method. A =Uize.Class= subclass may not provide any static events, so you should consult the reference documentation for a class to learn more about its suite of events. Handlers specified by the =eventHandlerSTRorFNorOBJ= parameter may be of string, function, or object type.

								VARIATION
								..........................................
								MyClass.wire (eventNamesToHandlersMapOBJ);
								..........................................

								When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =Uize.Class.wire= static method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								SPECIAL VALUES
								- the string value ="*"= acts as a wildcard when specified for the =eventNameSTR= parameter, meaning that the specified handler should be executed for all events of the class

								NOTES
								- see the related =Uize.Class.fire= and =Uize.Class.unwire= static methods
								- compare to the =fire=, =wire=, and =unwire= instance methods

						Parameters
							eventHandlerSTRorFNorOBJ
								All of the instance and static methods for adding and removing event handlers allow handlers to be specified in a number of different ways.

								Function Type Handlers
									By far the most common type of handler used when wiring event handlers is a function reference.

									A function registered as a handler for an event should expect to receive one parameter, being a reference to the event object that is associated to the event.

								String Type Handlers
									When a string value is specified for the =eventHandlerSTRorFNorOBJ= parameter, a function object will be constructed from that string for the purpose of handling the event.

									One limitation of this handler type is that, unlike `function type handlers`, a code string specified by the =eventHandlerSTRorFNorOBJ= parameter cannot reference the event object.

								Object Type Handlers
									When a reference to a =Uize.Class= subclass or an instance of a =Uize.Class= subclass is specified for the =eventHandlerSTRorFNorOBJ= parameter, then the event for which the handler is registered will be fired on that instance or class.

									This facility provides a means for "relaying" instance or class events to another instance or class.

									EXAMPLE
									.....................................................
									myWidget.children.someButton.wire ('Click',myWidget);
									.....................................................

									In the above example, a handler is being registered for the ='Click'= event of a button (an instance of the =Uize.Widget.Button= class) that is a child widget of =myWidget=. By specifying =myWidget= as the handler for the =Click= event, that event will get relayed to =myWidget=. This means that other code can now register handlers on the =Click= event for =myWidget=, and those handlers will handle the =Click= event being relayed from the button widget.

									Object handlers added in this way can be removed by using the =unwire= instance method and the =Uize.Class.unwire= static method, just as with any other type of handler, as in...

									.......................................................
									myWidget.children.someButton.unwire ('Click',myWidget);
									.......................................................

								Value for Removing Must Match Value Used for Adding
									However a handler is specified when wiring an event, that is how it must be specified in order to unwire the event.

									If you specified a function reference as the handler when wiring an event, then you must specify that same, identical function reference in order to unwire that event. If you specified a code string as the handler, then you must specify the exact same code string in order to unwire that event. If you specified a reference to a =Uize.Class= subclass or an instance of a =Uize.Class= subclass as the handler when wiring an event, then you must specify the exact same object reference in order to unwire the event.

							eventNamesToHandlersMapOBJ
								An object, specifying handlers for multiple events using event-name-to-handler mappings, where the key of each property is an event name and the value of each property is an event's corresponding handler.

								The contents of this object should be of the form...

								........................................
								{
									event1Name:event1HandlerSTRorFNorOBJ,
									event2Name:event2HandlerSTRorFNorOBJ,
									...
									eventNName:eventNHandlerSTRorFNorOBJ
								}
								........................................

								The value for each property in this object should conform to the =eventHandlerSTRorFNorOBJ= parameter type.
					*/
				};

				_class.fire = _classPrototype.fire = function (_event) {
					/*	NOTES
						- this code is deliberately optimized for performance and not code size, since event firing is a mechanism that is heavily utilized. This will explain some patterns here that may seem slightly out of character, with seemingly redundant code or a lack of typical factoring out.
					*/
					if (typeof _event != _typeObject) _event = {name:_event};
					var
						_this = this,
						_eventHandlers = _this._eventHandlers
					;
					if (_eventHandlers) {
						var
							_handlersForThisEvent = _eventHandlers [_event.name],
							_handlersForAnyEvent = _eventHandlers ['*']
						;
						if (_handlersForThisEvent || _handlersForAnyEvent) {
							_event.source || (_event.source = _this);
							var
								_handlers = _handlersForAnyEvent && _handlersForThisEvent
									? _handlersForAnyEvent.concat (_handlersForThisEvent)
									: _handlersForAnyEvent || _handlersForThisEvent
								,
								_totalHandlers = _handlers.length
							;
							if (_totalHandlers == 1) {
								_handlers [0]._handler (_event);
							} else if (_totalHandlers == 2) {
								/* NOTE:
									Since we make a copy of the handlers array in the case of multiple handlers (in order to avoid issues where the handlers array may be modified by the handlers themselves), this optimization for two handlers catches most cases of multiple handlers in a complex application. This avoids copying an array and also the overhead of an iterator.
								*/
								var
									_handler0 = _handlers [0]._handler,
									_handler1 = _handlers [1]._handler
								;
								_handler0 (_event);
								_handler1 (_event);
							} else {
								if (!_handlersForAnyEvent || !_handlersForThisEvent)
									_handlers = _handlers.concat ()
								;
								/* NOTE:
									When executing multiple handlers, it is necessary to make a copy of the handlers array, since it is possible that one of the handlers might execute code that affects the handlers array (eg. by using the removeHandler method).

									What this means is that when an event is fired, all the handlers registered for that event at the time that it fires will be executed. Event handlers for that event that are removed by one of its handlers will still be executed, and event handlers for that event that are added by one of its handlers will not be executed.
								*/
								for (var _handlerNo = -1; ++_handlerNo < _totalHandlers;)
									_handlers [_handlerNo]._handler (_event)
								;
							}
						}
					}
					if (_event.bubble && _this.parent && _isInstance (_this)) {
						_event.source || (_event.source = _this);
						_this.parent.fire (_event);
					}
					return _event;
					/*?
						Instance Methods
							fire
								Lets you fire an event for an instance of the class.

								SYNTAX
								..........................................
								eventOBJ = myInstance.fire (eventNameSTR);
								..........................................

								VARIATION
								......................................
								eventOBJ = myInstance.fire (eventOBJ);
								......................................

								When an object is specified instead of a string value, then extra event properties can be bundled with the event and will then be available to all handlers that are executed. When using this form, the =eventOBJ= object must have a =name= property that specifies the name of the event being fired.

								NOTES
								- see the related =wire= and =unwire= instance methods
								- compare to the =Uize.Class.fire=, =Uize.Class.wire=, and =Uize.Class.unwire= static methods

						Static Methods
							Uize.Class.fire
								Lets you fire a static event for the class.

								SYNTAX
								.......................................
								eventOBJ = MyClass.fire (eventNameSTR);
								.......................................

								VARIATION
								........................
								MyClass.fire (eventOBJ);
								........................

								When an object is specified instead of a string value, then extra event properties can be bundled with the event and will then be available to all handlers that are executed. When using this form, the =eventOBJ= object must have a =name= property that specifies the name of the event being fired.

								NOTES
								- see the related =Uize.Class.wire= and =Uize.Class.unwire= static methods
								- compare to the =fire=, =wire=, and =unwire= instance methods
					*/
				};

				_class.unwire = _classPrototype.unwire = function (_eventNameOrEventsMap,_handler) {
					var
						_this = this,
						_eventHandlers = _this._eventHandlers
					;
					if (_eventHandlers) {
						if (_isObject (_eventNameOrEventsMap)) {
							for (var _eventName in _eventNameOrEventsMap)
								_this.unwire (_eventName,_eventNameOrEventsMap [_eventName])
							;
						} else {
							_this._abstractEventName (
								_eventNameOrEventsMap,
								function (_eventName) {
									var _handlersForEventName = _eventHandlers [_eventName];
									if (_handlersForEventName) {
										if (_handler) {
											/* TO DO:
												this is a candidate for factoring out as a generally useful array manipulation method: removeAllOfValue
											*/
											for (var _handlerNo = _handlersForEventName.length; --_handlerNo >= 0;)
												_handlersForEventName [_handlerNo]._originalHandler == _handler && _handlersForEventName.splice (_handlerNo,1)
											;
										}
										(_handler && _handlersForEventName.length) || delete _eventHandlers [_eventName];
									}
								}
							);
						}
					}
					/*?
						Instance Methods
							unwire
								Lets you remove a handler previously wired to an instance event, or handlers wired for multiple instance events.

								SYNTAX
								..........................................................
								myInstance.unwire (eventNameSTR,eventHandlerSTRorFNorOBJ);
								..........................................................

								VARIATION 1
								.................................
								myInstance.unwire (eventNameSTR);
								.................................

								When no =eventHandlerSTRorFNorOBJ= parameter is specified, then all handlers registered for the event specified in the =eventNameSTR= parameter will be removed.

								VARIATION 2
								...............................................
								myInstance.unwire (eventNamesToHandlersMapOBJ);
								...............................................

								When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =unwire= instance method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								NOTES
								- see the related =fire= and =wire= instance methods
								- compare to the =Uize.Class.fire=, =Uize.Class.wire=, and =Uize.Class.unwire= static methods

						Static Methods
							Uize.Class.unwire
								Lets you remove a handler previously wired to a static event, or handlers wired for multiple static events.

								SYNTAX
								.......................................................
								MyClass.unwire (eventNameSTR,eventHandlerSTRorFNorOBJ);
								.......................................................

								VARIATION 1
								..............................
								MyClass.unwire (eventNameSTR);
								..............................

								When no =eventHandlerSTRorFNorOBJ= parameter is specified, then all handlers registered for the event specified in the =eventNameSTR= parameter will be removed.

								VARIATION 2
								............................................
								MyClass.unwire (eventNamesToHandlersMapOBJ);
								............................................

								When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =Uize.Class.unwire= static method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								NOTES
								- see the related =Uize.Class.fire= and =Uize.Class.wire= static methods
								- compare to the =fire=, =wire=, and =unwire= instance methods
					*/
				};


				var _derivationCache = {};
				function _resolveDerivation (_derivation) {
					/* NOTE: this code will eventually be used also for derived properties */
					var
						_derivationCacheKey = _derivation + '',
						_resolvedDerivation = _derivationCache [_derivationCacheKey]
					;
					function _getDeterminantsFromListStr (_determinantsStr) {
						return _determinantsStr.replace (/\s+/g,'').split (',');
					}
					if (!_resolvedDerivation) {
						var
							_determinants,
							_determiner
						;
						if (_isFunction (_derivation)) {
							_determinants = _getDeterminantsFromListStr ((_derivation + '').match (/\(([^\)]*)\)/) [1]);
							_determiner = _derivation;
						} else {
							if (typeof _derivation == 'string') {
								var _separatorPos = _derivation.indexOf (':');
								if (_separatorPos > -1) {
									_determiner = _Function (
										_determinants = _getDeterminantsFromListStr (_derivation.slice (0,_separatorPos)),
										'return ' + _derivation.slice (_separatorPos + 1)
									);
								} else {
									_derivation = _getDeterminantsFromListStr (_derivation);
								}
							}
							if (_isArray (_derivation)) {
								_determinants = [];
								if (_derivation.length) {
									var
										_determinerArgs = [],
										_determinerOperands = []
									;
									_forEach (
										_derivation,
										function (_determinant,_determinantNo) {
											var
												_inverted = _determinant.charCodeAt (0) == 33,
												_argName = 'a' + _determinantNo
											;
											_determinants.push (_inverted ? _determinant.slice (1) : _determinant);
											_determinerArgs.push (_argName);
											_determinerOperands.push ((_inverted ? '!' : '') + _argName);
										}
									);
									_determiner = _Function (_determinerArgs,'return ' + _determinerOperands.join (' && '));
								} else {
									_determiner = _Uize.returnTrue;
								}
							}
						}
						_resolvedDerivation = _derivationCache [_derivationCacheKey] = {
							_determinants:_determinants,
							_determinantsValuesHarvester:_Function (
								'return [' + _map (_determinants,'"this.get(\'" + value + "\')"').join (',') + ']'
							),
							_determiner:_determiner,
							_changedEventNames:_map (_determinants,'"Changed." + value')
						};
					}
					return _resolvedDerivation;
				}

				_classPrototype.once = function (_condition,_handler) {
					var
						_this = this,
						_derivation = _resolveDerivation (_condition),
						_determinants = _derivation._determinants,
						_determinantsValuesHarvester = _derivation._determinantsValuesHarvester,
						_determiner = _derivation._determiner,
						_wirings
					;
					function _isConditionMet () {
						var
							_determinantsValues = _determinantsValuesHarvester.call (_this),
							_conditionMet = _determiner.apply (0,_determinantsValues)
						;
						if (_conditionMet) {
							_wirings && _this.unwire (_wirings);
							_handler.apply (0,_determinantsValues);
						}
						return _conditionMet;
					}
					if (_isConditionMet ()) {
						_wirings = {};
					} else {
						_this.wire (_wirings = _lookup (_derivation._changedEventNames,_isConditionMet));
					}
					return _wirings;
					/*?
						Instance Methods
							once
								Lets you register a handler that should be executed only once the specified condition is met.

								The =once= method is useful when using one or more state properties to form a condition, and where you wish to register code that should be executed once the condition has been met, and immediately if the condition is already met at the time that the =once= method is called.

								DIFFERENT USAGES

								`Execute Code Once a State Property is Truthy or Falsy`
								................................................................
								wiringsOBJ = myInstance.once (propertyConditionSTR,handlerFUNC);
								................................................................

								`Execute Code Once Multiple State Properties Are Truthy or Falsy`
								.........................................................................
								wiringsOBJ = myInstance.once (propertiesConditionARRAYorSTR,handlerFUNC);
								.........................................................................

								`Execute Code Once a Compound Condition is Met`
								......................................................................
								wiringsOBJ = myInstance.once (compoundConditionSTRorFUNC,handlerFUNC);
								......................................................................

								Execute Code Once a State Property is Truthy or Falsy
									In its most basic usage, code can be registered to be executed once a single state property becomes truthy or falsy.

									SYNTAX
									................................................................
									wiringsOBJ = myInstance.once (propertyConditionSTR,handlerFUNC);
									................................................................

									The =propertyConditionSTR= parameter specifies the name of a state property, with an optional "!" (exclamation mark) prefix for indicating `condition inversion`. If simply the name of a state property is specified, then the handler code specified by the =handlerFUNC= parameter will be executed once the property is truthy. If the optional "!" prefix is specified, then the handler code will be executed once the property is falsy.

									EXAMPLE 1
									........................................................
									myWidget.once (
										'wired',
										function () {
											// do something now that the widget has been wired
										}
									);
									........................................................

									In the above example, a handler is being registered to be executed once the widget =myWidget= has been wired (ie. the value of its =wired= state property becomes =true=).

									EXAMPLE 2
									................................................................
									myCollectionWidget.once (
										'!isEmpty',
										function () {
											// do something now that the collection is no longer empty
										}
									);
									................................................................

									In the above example, code is being registered to execute once the =isEmpty= state property is =false=.

								Execute Code Once Multiple State Properties Are Truthy or Falsy
									Code can be registered to be executed once all properties in a set of state properties become truthy or falsy, by specifying the state properties as an array of property names or as a comma-separated list string.

									SYNTAX
									.........................................................................
									wiringsOBJ = myInstance.once (propertiesConditionARRAYorSTR,handlerFUNC);
									.........................................................................

									propertiesConditionARRAYorSTR
										The value specified for the =propertiesConditionARRAYorSTR= parameter may be an array of property names or a comma-separated list string.

										Whichever form is used, any property name can be prefixed with a "!" (exclamation mark) to achieve `condition inversion` for the property.

										Summary of different forms...

										- array of property names: =['phase1Done','phase2Done','phase3Done']=
										- array of property names with `condition inversion`: =['wired','!isEmpty']=
										- comma-separated list string: ='phase1Done, phase2Done, phase3Done'=
										- comma-separated list with `condition inversion`: ='wired, !isEmpty'=

										Whitespace Ignored for Comma-separated List String
											If a comma-separated list string is specified, all whitespace in the string is ignored.

											This means that whitespace around the property names is ignored, so the value ='phase1Done,phase2Done,phase3Done'= is equivalent to the value ='phase1Done, phase2Done , phase3Done'=. This also means that whitespace around the optional "!" (exclamation mark) prefix is ignored, so the value ='wired, !isEmpty'= is equivalent to the value ='wired, ! isEmpty'=.

									Examples
										The following examples illustrate the different ways in which multiple properties can be specified.

										EXAMPLE: Array of Property Names
											Multiple state properties can be specified using an array of state property names.

											EXAMPLE
											........................................................
											myInstance.once (
												['phase1Done','phase2Done','phase3Done'],
												function () {
													// execute code now that all three phases are done
												}
											);
											........................................................

										EXAMPLE: Comma-separated List String
											Multiple state properties can be specified using a comma-separated list string.

											EXAMPLE
											........................................................
											myInstance.once (
												'phase1Done, phase2Done, phase3Done',
												function () {
													// execute code now that all three phases are done
												}
											);
											........................................................

										EXAMPLE: Array of Property Names, with Condition Inversion
											Multiple state properties can be specified using an array of state property names, where some of the property names in the array are prefixed with the optional "!" to indicate `condition inversion`.

											EXAMPLE
											.................................................................................
											myCollection.once (
												['wired','!isEmpty'],
												function () {
													// execute code now that the collection widget is wired and no longer empty
												}
											);
											.................................................................................

										EXAMPLE: Comma-separated List String, with Condition Inversion
											Multiple state properties can be specified using a comma-separated list string, where some of the property names in the list are prefixed with the optional "!" to indicate `condition inversion`.

											EXAMPLE
											.................................................................................
											myCollection.once (
												'wired, !isEmpty',
												function () {
													// execute code now that the collection widget is wired and no longer empty
												}
											);
											.................................................................................

								Execute Code Once a Compound Condition is Met
									Code can be registered to be executed once a compound condition is met, by specifying the compound condition in the form of a condition function or condition expression string.

									SYNTAX
									......................................................................
									wiringsOBJ = myInstance.once (compoundConditionSTRorFUNC,handlerFUNC);
									......................................................................

									Condition Function
										A compound condition can be specified as a function, where the names of the function's arguments indicate the state properties that affect the condition and where the function's body evaluates the condition.

										EXAMPLE
										..............................................................................
										myFishTankWater.once (
											function (width,height,depth) {return width * height * depth > 1000},
											function () {
												// execute code, now that the water volume of the fish tank exceeds 1000
											}
										}
										..............................................................................

										In the above example, a compound condition is specified using a function. The arguments of the function - =width=, =height=, and =depth= - indicate that the condition is affected by the =width=, =height=, and =depth= state properties of the =myFishTankWater= instance. The function's body, =return width &#42; height &#42; depth > 1000=, evaluates the condition to be =true= when the volume of the fish tank's water is greater than =1000=.

										When code is registered to be executed once the product of the =width=, =height=, and =depth= properties is greater than =1000=, if this condition is not yet met when the =once= method is called, the method will wire handlers for the =Changed.width=, =Changed.height=, and =Changed.depth= events and will re-evaluate the condition function every time any of the properties that affect the condition change value. Once the condition function returns a truthy result, the handler for the compound condition will be executed and the handlers that were wired for the =Changed.*= events will be unwired.

									Condition Expression String
										A compound condition can be specified as an expression string, where the names of the state properties affecting the condition are specified along with an expression string for evaluating the condition.

										A condition expression string is formatted with two parts separated by a ":" (colon) delimiter, where the part before the colon is a comma-separated list of the state properties affecting the condition, and the part after the colon is an expression to be used for evaluating the condition.

										EXAMPLE
										..............................................................................
										myFishTankWater.once (
											'width, height, depth : width * height * depth > 1000',
											function () {
												// execute code, now that the water volume of the fish tank exceeds 1000
											}
										}
										..............................................................................

										In the above example, a compound condition is specified using a `condition expression string`. In this string, the part before the colon - "width, height, depth" - indicates that the condition is affected by the =width=, =height=, and =depth= state properties of the =myFishTankWater= instance. The part after the colon - "width &#42; height &#42; depth > 1000" - evaluates the condition to be =true= when the volume of the fish tank's water (ie. the product of the =width=, =height=, and =depth= properties) is greater than =1000=.

								Immediate Execution if Condition Already Met
									If the condition specified in the call to the =once= method is already met at the time that the method is called, then the handler specified by the =handlerFUNC= parameter will be executed immediately.

									Otherwise, handlers will be wired for the =Changed.*= (value change) events for all the state properties that affect the condition. The condition evaluator will be executed each time any of the watched properties change value. As soon as the condition becomes met (ie. the condition evaluator produces a truthy result), the handlers wired to watch the value change events of the properties will be unwired and the handler function registered for the condition will be executed. By design, the handler is only executed for the first time that the condition becomes met.

								Condition Inversion
									As a convenience, the =once= method supports condition inversion through an optional "!" (logical not) prefix that can be placed before the condition name.

									EXAMPLE
									................................................................
									myCollectionWidget.once (
										'!isEmpty',
										function () {
											// do something now that the collection is no longer empty
										}
									);
									................................................................

									In the above example, code is being registered to execute once the =isEmpty= state property is =false=. This is done by prefixing the "isEmpty" condition name with a "!" (bang / exclamation) character to indicate that the code should execute only once the collection is not empty (ie. the value of the =isEmpty= state property becomes =false=). The `condition inversion` facility is convenient in situations like this where you wish to execute code only once a property's value becomes falsy, rather than once the property's value becomes truthy (which is the standard behavior for the =once= method).

									Condition Inversion with Multiple Property Conditions
										Condition inversion can be used both with single state property conditions as well as multiple property conditions.

										EXAMPLE
										................................................................
										myCollectionWidget.once (
											['wired','!isEmpty'],
											function () {
												// do something now that the collection is wired and no longer empty
											}
										);
										...........................................................................

										In the above example, code is being registered to be executed once the =wired= state property is truthy and the =isEmpty= state property is falsy. Condition inversion can also be used when the state properties are specified as a comma-separated list string, so specifying the condition as =['wired','!isEmpty']= is equivalent to specifying it as ='wired, !isEmpty'=.

								Wirings Object
									The =once= method returns a wirings object that can be supplied to the =unwire= method in order to unwire the handler, in the unlikely event that one may wish to remove the handler before the condition becomes met.

									This case is unlikely to arise except in exceptional situations, but the means is provided. In most cases, you will simply discard / ignore the return value of the =once= method. In the event that the condition is met when the =once= method is called, then the returned wirings object will be an empty object.

								Handler Arguments
									The handler code that is registered to be executed once a condition is met will be passed the values of all the state properties that affect the condition as arguments.

									EXAMPLE
									...................................................................
									myFishTankWater.once (
										'width, height, depth : width * height * depth > 1000',
										function (width,height,depth) {
											alert (width + '(W) x ' + height + '(H) x ' + depth + '(D)');
										}
									}

									myFishTankWater.set ({
										width:10,
										height:11,
										depth:12
									});
									...................................................................

									In the above example, code is being registered to be executed once the product of the =width=, =height=, and =depth= properties of the =myFishTankWater= instance exceeds =1000=. Once the call to the =set= method has been executed, the volume of the fish tank's water will be =1320= and the handler will be executed.

									Now, because the properties affecting the condition have been specified as "width, height, depth", the value of these state properties will be passed as arguments to the handler in the order =width=, =height=, and =depth=. In this case, the handler function is choosing to declare these function arguments, using the same names for the sake of clarity - you could ignore the arguments if you didn't care about the specific values at the time the condition is met, or you could use the arguments but name them differently. In this example, the =alert= statement will alert the text "10(W) x 11(H) x 12(D)".

								NOTES
								- see the other `condition system methods`
					*/
				};

				_classPrototype.is = function (_property) {
					return !!this [_getPropertyPrivateName (this,_property)];
					/*?
						Instance Methods
							is
								Returns a boolean, indicating whether or not the specified state property's value is truthy.

								SYNTAX
								................................
								myInstance.is (propertyNameSTR);
								................................

								The =is= method is offered as a convenience to improve the semantics of code that is using state properties to represent conditions, and is a very thin wrapper around the =get= instance method. The statement =myInstance.is ('myCondition')= is equivalent to the statement =!!myInstance.get ('myCondition')=.

								EXAMPLE
								...........................................
								if (myWidget.is ('enabled')) {
									// do something if the widget is enabled
								}
								...........................................

								In the above example, some code is being executed conditionally, based upon whether or not a widget is enabled. The =Uize.Widget= base class provides an =enabled= state property, whose value is a boolean. One could use the =get= method in this code example to achieve the same effect, but using the =is= method make the code more readable.

								NOTES
								- see the other `condition system methods`
					*/
				};

				_classPrototype.met = function (_propertyOrProperties) {
					this.set (_propertyOrProperties,true);
					/*?
						Instance Methods
							met
								Sets the specified condition (or conditions) as having been met.

								DIFFERENT USAGES

								`Set a Single Condition as Having Been Met`
								.................................
								myInstance.met (propertyNameSTR);
								.................................

								`Set Multiple Conditions as Having Been Met`
								....................................
								myInstance.met (propertyNamesARRAY);
								....................................

								For Improved Semantics
									The =met= method is offered as a convenience to improve the semantics of code that is using state properties to represent conditions, and is a very thin wrapper around the =set= instance method.

									The statement =myInstance.met ('myCondition')= is equivalent to the statement =myInstance.set ('myCondition',true)=. When using a state property to represent a condition, the =met= method is a semantically elegant way to set the value of the property to =true= to indicate that the condition represented by the property has been met.

									EXAMPLE
									.............................................
									MyClass.prototype.initialize = function () {
										// some code here to do the initialization
										this.met ('initialized');
									};
									.............................................

									In the above example, an =initialize= instance method is defined for the class =MyClass=. In the method's implementation, after all the initialization has been performed, the =met= method is being called to indicate that the =initialized= condition has been met, where =initialized= is the name of a state property provided in =MyClass=. Now, other code can be registered to be executed only once an instance has been initialized by using the =once= instance method, as follows...

									.............................................................
									myInstance.once (
										'initialized',
										function () {
											// do some stuff once the instance has been initialized
										}
									);
									.............................................................

								Set a Single Condition as Having Been Met
									In its most typical usage, a single condition can be set as having been met by specifying the name of the condition for the =propertyNameSTR= parameter.

									SYNTAX
									.................................
									myInstance.met (propertyNameSTR);
									.................................

									EXAMPLE
									..........................
									this.met ('someSelected');
									..........................

								Set Multiple Conditions as Having Been Met
									In cases where you wish to set multiple conditions as having been met, the names of those conditions can be supplied by specifying an array for the =propertyNamesARRAY= parameter.

									SYNTAX
									....................................
									myInstance.met (propertyNamesARRAY);
									....................................

									EXAMPLE
									....................................
									this.met (['initialized', 'ready']);
									....................................

								NOTES
								- see the companion =unmet= instance method
								- see the other `condition system methods`
					*/
				};

				_classPrototype.unmet = function (_propertyOrProperties) {
					this.set (_propertyOrProperties,false);
					/*?
						Instance Methods
							unmet
								Sets the specified condition (or conditions) as being unmet.

								DIFFERENT USAGES

								`Set a Single Condition as Being Unmet`
								...................................
								myInstance.unmet (propertyNameSTR);
								...................................

								`Set Multiple Conditions as Being Unmet`
								......................................
								myInstance.unmet (propertyNamesARRAY);
								......................................

								For Improved Semantics
									The =unmet= method is offered as a convenience to improve the semantics of code that is using state properties to represent conditions, and is a very thin wrapper around the =set= instance method.

									The statement =myInstance.unmet ('myCondition')= is equivalent to the statement =myInstance.set ('myCondition',false)=. When using a state property to represent a condition, the =unmet= method is a semantically elegant way to set the value of the property to =false= to indicate that the condition represented by the property is not met / no longer met.

									EXAMPLE
									..............................................
									MyClass.prototype.die = function () {
										// some code here to tear down the instance
										this.unmet ('initialized');
									};
									..............................................

									In the above example, a =die= instance method is defined for the class =MyClass=. In the method's implementation, after all the tear down steps have been performed, the =unmet= method is being called to indicate that the =initialized= condition is no longer met, where =initialized= is the name of a state property provided in =MyClass=. It is assumed that some other method, such as an =initialize= instance method for the class, is responsible for setting the condition as having been met with a statement like =this.met ('initialized')=.

								Set a Single Condition as Being Unmet
									In its most typical usage, a single condition can be set as being unmet by specifying the name of the condition for the =propertyNameSTR= parameter.

									SYNTAX
									...................................
									myInstance.unmet (propertyNameSTR);
									...................................

									EXAMPLE
									............................
									this.unmet ('someSelected');
									............................

								Set Multiple Conditions as Being Unmet
									In cases where you wish to set multiple conditions as being unmet, the names of those conditions can be supplied by specifying an array for the =propertyNamesARRAY= parameter.

									SYNTAX
									......................................
									myInstance.unmet (propertyNamesARRAY);
									......................................

									EXAMPLE
									......................................
									this.unmet (['initialized', 'ready']);
									......................................

								NOTES
								- see the companion =met= instance method
								- see the other `condition system methods`
					*/
				};

				_classPrototype.isMet = function (_condition) {
					var _derivation = _resolveDerivation (_condition);
					return _derivation._determiner.apply (0,_derivation._determinantsValuesHarvester.call (this));
					/*?
						Instance Methods
							isMet
								Returns a boolean, indicating whether or not the specified condition is met.

								DIFFERENT USAGES

								`Test if a State Property is Truthy or Falsy`
								....................................................
								isMetBOOL = myInstance.isMet (propertyConditionSTR);
								....................................................

								`Test if Multiple State Properties Are Truthy or Falsy`
								.............................................................
								isMetBOOL = myInstance.isMet (propertiesConditionARRAYorSTR);
								.............................................................

								`Test if a Compound Condition is Met`
								..........................................................
								isMetBOOL = myInstance.isMet (compoundConditionSTRorFUNC);
								..........................................................

								Test if a State Property is Truthy or Falsy
									In its most basic usage, the =isMet= method can be used to test if a single state property becomes truthy or falsy.

									SYNTAX
									....................................................
									isMetBOOL = myInstance.isMet (propertyConditionSTR);
									....................................................

								Test if Multiple State Properties Are Truthy or Falsy
									One can test if all properties in a set of state properties are truthy or falsy, by specifying the state properties as an array of property names or as a comma-separated list string.

									SYNTAX
									.............................................................
									isMetBOOL = myInstance.isMet (propertiesConditionARRAYorSTR);
									.............................................................

								Test if a Compound Condition is Met
									One can test if a compound condition has been met, by specifying the compound condition in the form of a condition function or condition expression string.

									SYNTAX
									..........................................................
									isMetBOOL = myInstance.isMet (compoundConditionSTRorFUNC);
									..........................................................

								Specifying Conditions
									When using the =isMet= method, conditions are specified in exactly the same as with the =once= method.

									Rather than redundantly providing comprehensive examples for the different usages of the =isMet= method and the different ways in which conditions can be specified, instead please consult the reference for the =once= method. While the =once= method lets you register a handler function that should be executed once a condition is met, the =isMet= method simply tests if a condition is met and returns a boolean result.

								NOTES
								- see the other `condition system methods`
					*/
				};

			/*** State Property System Methods ***/
				_class.get = _classPrototype.get = function (_property) {
					if (typeof _property == _typeString) {
						/* NOTE:
							Because the get method gets hit so heavily, optimize it to do as little as possible in the most common use case (where parameter is a string, being the name of the property), so no creation of and assignment to local variables.
						*/
						return this [_getPropertyPrivateName (this,_property)];
					} else {
						var
							_this = this,
							_result = {}
						;
						if (!_property) {
							/* NOTE:
								Driven off of private names to ensure that there is only one property in the object for each actual state property, otherwise you can end up in bad situations.
							*/
							var
								_class = _getClass (_this),
								_propertyProfilesByPrivateNames = _class._propertyProfilesByPrivateNames
							;
							for (var _propertyPrivateName in _propertyProfilesByPrivateNames)
								_result [_propertyProfilesByPrivateNames [_propertyPrivateName]._publicName] =
									_this [_propertyPrivateName]
							;
							if (_isInstance (_this)) {
								var _adHocProperties = _this._adHocProperties;
								if (_adHocProperties)
									for (_property in _adHocProperties) _result [_property] = _this [_property]
								;
							}
						} else if (_isArray (_property)) {
							for (
								var _subPropertyNo = -1, _totalSubProperties = _property.length;
								++_subPropertyNo < _totalSubProperties;
							) {
								var _subProperty = _property [_subPropertyNo];
								_result [_subProperty] = _this [_getPropertyPrivateName (_this,_subProperty)];
							}
						} else {
							for (var _subProperty in _property)
								_result [_subProperty] = _this [_getPropertyPrivateName (_this,_subProperty)]
							;
						}
						return _result;
					}
					/*?
						Instance Methods
							get
								Lets you query the value of one of an instance's state properties.

								DIFFERENT USAGES

								`Get the Value of a Single Property`
								........................................................
								propertyValueANYTYPE = myInstance.get (propertyNameSTR);
								........................................................

								`Get Values for Multiples Properties, by Specifying a Property Names Array`
								........................................................
								propertyValuesOBJ = myInstance.get (propertyNamesARRAY);
								........................................................

								`Get Values for Multiples Properties, by Specifying a Properties Object`
								...................................................
								propertyValuesOBJ = myInstance.get (propertiesOBJ);
								...................................................

								`Get Values for All Properties`
								.........................................
								allPropertyValuesOBJ = myInstance.get ();
								.........................................

								Get the Value of a Single Property
									In the most typical usage of the =get= instance method, a =propertyNameSTR= parameter can be specified in order to get the value of a single state property.

									SYNTAX
									........................................................
									propertyValueANYTYPE = myInstance.get (propertyNameSTR);
									........................................................

									EXAMPLE
									......................................................
									var mySlider = Uize.Widget.Bar.Slider ({
										minValue:0,
										maxValue:100,
										value:57
									});

									alert (mySlider.get ('value')); // alerts the text "57
									......................................................

								Get Values for Multiples Properties, by Specifying a Property Names Array
									When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the instance state properties specified in the array will be populated into an object and returned.

									SYNTAX
									........................................................
									propertyValuesOBJ = myInstance.get (propertyNamesARRAY);
									........................................................

									EXAMPLE
									.....................................................................
									mySlider.set ('minValue',0);
									mySlider.set ('maxValue,100);
									mySlider.set ('value',57);

									sliderValueAndRange = mySlider.get (['minValue','maxValue','value']);
									.....................................................................

									After the above code has been executed, the =sliderValueAndRange= variable would have the value ={minValue:0,maxValue:100,value:57}=.

								Get Values for Multiples Properties, by Specifying a Properties Object
									When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the instance state properties specified in the array will be populated into an object and returned.

									SYNTAX
									...................................................
									propertyValuesOBJ = myInstance.get (propertiesOBJ);
									...................................................

									EXAMPLE
									.....................................................................
									mySlider.set ('minValue',0);
									mySlider.set ('maxValue,100);
									mySlider.set ('value',57);

									sliderValueAndRange = mySlider.get ({minValue:0,maxValue:0,value:0});
									.....................................................................

									After the above code has been executed, the =sliderValueAndRange= variable would have the value ={minValue:0,maxValue:100,value:57}=. The values of the properties in the properties object, as specified by the =propertiesOBJ= parameter, are immaterial - for whatever properties exist in the object, the values for the corresponding state properties of the instance will be returned.

								Get Values for All Properties
									When no parameter is specified, the =get= instance method will return an object containing values for all the state properties of the instance.

									SYNTAX
									.........................................
									allPropertyValuesOBJ = myInstance.get ();
									.........................................

									For one thing, this variation makes it easy to create a new instance of a class with the same state as an existing instance.

									EXAMPLE
									.........................................
									copyOfMyFade = Uize.Fade (myFade.get ());
									.........................................

									In this example, an instance of the class =Uize.Fade= is being created by passing the constructor all the state property values obtained from the =myFade= instance using the =get= method. The new instance created will then have the same state as the =myFade= instance.

								NOTES
								- see also the =set= instance method
								- see also the =Uize.Class.get= and =Uize.Class.set= static methods

						Static Methods
							Uize.Class.get
								Lets you query the initial value for one of the class's state properties.

								SYNTAX
								........................................................
								propertyValueANYTYPE = Uize.Class.get (propertyNameSTR);
								........................................................

								VARIATIONS
								........................................................
								propertyValuesOBJ = Uize.Class.get (propertyNamesARRAY);
								........................................................

								When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the class state properties specified in the array will be populated into an object and returned. So, for example =Uize.Widget.get (['enabled','busy','built'])= would return a result like ={enabled:'inherit',busy:'inherit',built:true}=.

								.........................................
								allPropertyValuesOBJ = Uize.Class.get ();
								.........................................

								When no parameter is specified, the =Uize.Class.get= static method will return an object containing values for all the declared state properties of the class.

								NOTES
								- see also the =Uize.Class.set= static method
								- see also the =get= and =set= instance methods
					*/
				};


				_class.stateProperties =
				_class.registerProperties = /* DEPRECATED 2013-01-02 */
					function (_propertyProfiles) {
						var
							_this = this,
							_propertyProfilesByPrivateNames = _this._propertyProfilesByPrivateNames,
							_propertyProfilesByPublicNames = _this._propertyProfilesByPublicNames
						;
						for (var _propertyPrivateName in _propertyProfiles) {
							var
								_propertyData = _propertyProfiles [_propertyPrivateName],
								_propertyDataIsObject = _isObject (_propertyData),
								_propertyPublicName =
									(_propertyDataIsObject ? _propertyData.name : _propertyData) || _propertyPrivateName,
								_propertyPrimaryPublicName = _propertyPublicName,
								_propertyProfile = _propertyProfilesByPrivateNames [_propertyPrivateName] = {_privateName:_propertyPrivateName}
							;
							if (_propertyPublicName.indexOf ('|') > -1) {
								var _pseudonyms = _propertyPublicName.split ('|');
								_propertyPrimaryPublicName = _pseudonyms [0];
								_lookup (_pseudonyms,_propertyProfile,_propertyProfilesByPublicNames);
							} else {
								_propertyProfilesByPublicNames [_propertyPublicName] = _propertyProfile;
							}
							_propertyProfile._publicName = _propertyPrimaryPublicName;
							if (_propertyDataIsObject) {
								if (_propertyData.onChange) _propertyProfile._onChange = _propertyData.onChange;
								if (_propertyData.conformer) _propertyProfile._conformer = _propertyData.conformer;
								_this [_propertyPrivateName] = _propertyData.value;
							}
						}
						_this._instancePropertyDefaults = this.get ();
						/*?
							Static Methods
								Uize.Class.stateProperties
									Lets you declare one or more state properties for instances of the class.

									SYNTAX
									..................................................
									MyClass.stateProperties (propertiesDefinitionOBJ);
									..................................................

									The object specified in =propertiesDefinitionOBJ= parameter must conform to a specific structure. Each property of this object represents a property to be declared for the class, where the property name specifies the internal name to be used for the class property and the property's string value specifies the class property's public name. As an alternative to a string value, the property's value can be an object whose =name= property specifies the class property's public name and where an optional =onChange= property specifies a handler function that should be executed every time the value of the class property changes. This is all best illustrated with an example...

									EXAMPLE
									...........................................................................
									MyClass.stateProperties (
										{
											_propertylName:'property1Name',
											_property2Name:'property2Name',
											_property3Name:{
												name:'property3Name',
												onChange:function () {
													// code to be performed when the value of this property changes
												}
											}
										}
									);
									...........................................................................

									NOTES
									- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
									- see the other `feature declaration methods`

							Deprecated Features
								Uize.Class.registerProperties -- DEPRECATED 2013-01-02
									The =Uize.Class.registerProperties= static method has been deprecated in favor of the newly added =Uize.Class.stateProperties= static method.

									......................................................................
									Uize.Class.registerProperties >> BECOMES >> Uize.Class.stateProperties
									......................................................................

									The =Uize.Class.stateProperties= method is essentially just a renaming of the deprecated =Uize.Class.registerProperties= method and behaves in exactly the same way. The new name was chosen to be consistent with documentation that refers to these properties universally as state properties. The new name is also more concise.
						*/
					}
				;

				_class.set = _classPrototype.set = function (_properties) {
					/* NOTE:
						Yes, there are functions _getClass and _getPropertyPrivateName that could be used (and were at one point), but this code needs to be tuned for performance since set is a touch point in so many places.
					*/
					var
						_arguments = arguments,
						_argumentsLength = _arguments.length
					;
					if (_argumentsLength > 1)
						/* NOTE:
							- support for...
								set (propertyNameSTR,propertyValueANYTYPE)

								or...

								set (
									property1NameSTR,property1ValueANYTYPE,
									property2NameSTR,property2ValueANYTYPE,
									...
									propertyNNameSTR,propertyNValueANYTYPE
								)

								or...

								set (propertyNamesARRAY,propertyValueANYTYPE)
						*/
						_properties = _argumentsLength > 2 || typeof _properties == _typeString
							? _pairUp.apply (0,_arguments)
							: _lookup (_properties,_arguments [1])
					;
					var
						_this = this,
						_thisIsInstance = _isInstance (_this),
						_class = _thisIsInstance ? _this.Class : _this,
						_propertyProfilesByPublicNames = _class._propertyProfilesByPublicNames,
						_propertyProfilesByPrivateNames = _class._propertyProfilesByPrivateNames,
						_propertyProfile,
						_onChangeHandlers,
						_onChangeHandlerAddedFlagName,
						_onChangeHandler,
						_hasChangedHandlers = _thisIsInstance && _this._hasChangedHandlers,
						_hasChangedDotStarHandlers = _hasChangedHandlers && _hasChangedHandlers ['*'],
						_propertiesForChangedDotStar,
						_changedEventsToFire,
						_propertyPrivateName,
						_propertyPublicName,
						_propertiesToDeclare,
						_propertyValue,
						_propertiesBeingSet
					;
					for (var _propertyPublicOrPrivateName in _properties) {
						_propertyValue = _properties [_propertyPublicOrPrivateName];
						if (
							_propertyProfile =
								_propertyProfilesByPublicNames [_propertyPublicOrPrivateName] ||
								_propertyProfilesByPrivateNames [_propertyPublicOrPrivateName]
						) {
							_propertyPrivateName = _propertyProfile._privateName;
							_propertyPublicName = _propertyProfile._publicName;
						} else {
							_propertyPrivateName = _propertyPublicName = _propertyPublicOrPrivateName;
							_propertyProfile = _thisIsInstance ? {} : {value:_propertyValue};
							_thisIsInstance
								? (
									(_this._adHocProperties || (_this._adHocProperties = {})) [_propertyPublicOrPrivateName] =
										true
								) : (
									(_propertiesToDeclare || (_propertiesToDeclare = {})) [_propertyPublicOrPrivateName] =
										_propertyProfile
								)
							;
						}
						if (_thisIsInstance)
							(_propertiesBeingSet || (_propertiesBeingSet = {})) [_propertyPublicName] =
								_propertyProfile._conformer
									? (
										/*** if there's a registered conformer, execute it and adjust the value ***/
										_propertyValue = _propertyProfile._conformer.call (
											_this,_propertyValue,_this [_propertyPrivateName]
										)
									)
									: _propertyValue
						;
						if (_propertyValue !== _this [_propertyPrivateName]) {
							if (_thisIsInstance) {
								/*** build up list of events to fire for 'Changed.' event handlers ***/
									_hasChangedDotStarHandlers && (
										(_propertiesForChangedDotStar || (_propertiesForChangedDotStar = {}))
											[_propertyPublicName] = _propertyValue
									);
									_hasChangedHandlers && _hasChangedHandlers [_propertyPublicName] &&
										(_changedEventsToFire || (_changedEventsToFire = [])).push (_propertyPublicName)
									;
								/*** build up list of onChange handlers to execute ***/
									var _processOnChangeHandler = function (_onChangeHandler) {
										if (_isFunction (_onChangeHandler)) {
											if (!_onChangeHandlers) {
												_onChangeHandlers = [];
												_onChangeHandlerAddedFlagName = _this.instanceId + '_handlerAlreadyAdded';
											}
											if (!_onChangeHandler [_onChangeHandlerAddedFlagName]) {
												_onChangeHandler [_onChangeHandlerAddedFlagName] = 1;
												_onChangeHandlers.push (_onChangeHandler);
											}
										} else if (typeof _onChangeHandler == _typeString) {
											_processOnChangeHandler (_this [_onChangeHandler]);
										} else if (_isArray (_onChangeHandler)) {
											_forEach (_onChangeHandler,_processOnChangeHandler);
										}
									};
									_propertyProfile._onChange && _processOnChangeHandler (_propertyProfile._onChange);
							}
							_this [_propertyPrivateName] = _propertyValue;
						}
					}
					_propertiesToDeclare && _class.stateProperties (_propertiesToDeclare);
					if (_thisIsInstance) {
						if (_onChangeHandlers) {
							for (
								var _handlerNo = -1, _onChangeHandlersLength = _onChangeHandlers.length;
								++_handlerNo < _onChangeHandlersLength;
							) {
								delete (_onChangeHandler = _onChangeHandlers [_handlerNo]) [_onChangeHandlerAddedFlagName];
								_onChangeHandler.call (_this,_propertiesBeingSet);
							}
						}
						_propertiesForChangedDotStar && _this.fire ({name:'Changed.*',properties:_propertiesForChangedDotStar});
						if (_changedEventsToFire) {
							for (
								var _changedEventNo = -1, _changedEventsToFireLength = _changedEventsToFire.length;
								++_changedEventNo < _changedEventsToFireLength;
							)
								_this.fire ('Changed.' + _changedEventsToFire [_changedEventNo])
							;
							/*?
								Instance Events
									Changed.*
										The =Changed.*= instance event is a wildcard event that is fired whenever one or more state properties change value as a result of a call to the =set= instance method.

										This event will only be fired once for all state properties that have changed value during a call to the =set= method. The event object for this event will contain a =properties= property, which is an object indicating which state properties have changed value, being a mapping between the public names of state properties that have changed and their new values.

										NOTES
										- compare to the related =Changed.[propertyName]= instance event
										- wiring a handler for the =Changed.*= event may have a slight performance impact, since this event will be fired any time that any state property changes value

									Changed.[propertyName]
										The =Uize.Class= base class implements a generalized mechanism for firing events when the values of state properties are changed.

										This means that for any state property that is declared through the =Uize.Class.stateProperties= static method, a handler can be registered for a change in the value of that property without having to write any additional code to fire an event.

										Event Naming
											The name of a changed event that fires is of the form =Changed.[propertyName]=, where =propertyName= is the primary public name of the state property. For example, if you declared a state property named =value=, then a =Changed.value= event would fire each time this property is changed.

										Property Aliases
											If a state property has aliases, handlers can be registered for the property's changed event using any of the aliases. However, the name of the event when it fires will always be derived from the primary public name (ie. first in the alias list) of the property. So, for example, if a state property was declared with the public names =color= and =hexRgb=, both =Changed.color= and =Changed.hexRgb= would be treated as equivalent.

											EXAMPLE
											..........................................................
											function handleColorChange () {
												// do stuff
											}
											myColorWidget.wire ('Changed.color',handleColorChange);
											myColorWidget.unwire ('Changed.hexRgb',handleColorChange);
											..........................................................

											In this example, the =handleColorChange= function would not be executed when the value of the =color= state property changes, because =Changed.color= and =Changed.hexRgb= are treated as equivalent and therefore the =unwire= statement effectively removes the handler registered in the previous statement.

										Must Use the set Method
											The =Changed.[propertyName]= event will only fire for a particular state property if the value for that property is set using the =set= method, since it is within the =set= method that change detection occurs and the event is fired. If you simply assign a value by directly accessing the private name of the property, then the event will not fire.

										Only On Change, Not Every Set
											The =Changed.[propertyName]= event only fires for a particular state property when the value for that property is *changed* by using the =set= method. So, if the =set= method is called but the value that is specified is already the value of the property, then there will be no change and no event will be fired.

											Additionally, if a =conformer= is registered for the property and the action of the conformer results in the property value not being changed, then no event will be fired - even if the value specified in the =set= call is different to the current value of the property. This can be the case if the value is at an edge of its valid range, an attempt is made to set the value outside of its valid range, and the conformer has the action of constraining the value so that it remains at the same edge of its valid range.

										NOTES
										- compare to the related =Changed.*= instance event
							*/
						}
					} else {
						_class._instancePropertyDefaults = this.get ();
					}
					/*?
						Instance Methods
							set
								Lets you set values for one or more of an instance's state properties.

								DIFFERENT USAGES

								`Set Values for One or More Properties with a Names/Values Object`
								........................................
								myInstance.set (propertyNamesValuesOBJ);
								........................................

								`Set the Value for a Property with Name and Value Arguments`
								......................................................
								myInstance.set (propertyNameSTR,propertyValueANYTYPE);
								......................................................

								`Set Values for Multiple Properties with Multiple Name and Value Arguments`
								.........................................
								myInstance.set (
									property1NameSTR,property1ValueANYTYPE,
									property2NameSTR,property2ValueANYTYPE,
									... ... ...
									propertyNNameSTR,propertyNValueANYTYPE
								);
								.........................................

								`Set the Same Value for Multiple Properties`
								.........................................................
								myInstance.set (propertyNamesARRAY,propertyValueANYTYPE);
								.........................................................

								Set Values for One or More Properties with a Names/Values Object
									In the standard usage, a single =propertyNamesValuesOBJ= parameter can be passed to the =set= method in order to set values for one or more properties.

									SYNTAX
									........................................
									myInstance.set (propertyNamesValuesOBJ);
									........................................

									Each key of the =propertyNamesValuesOBJ= object represents the name of a state property whose value should be set, and each corresponding value represents the value that a property should be set to.

									EXAMPLE 1
									...............................
									myWidget.set ({enabled:false});
									...............................

									In the above example, the =set= method is being used to set the value of just one property - the =enabled= property of a widget instance.

									EXAMPLE 2
									................
									mySlider.set ({
										maxValue:100,
										minValue:0,
										value:23
									});
									................

									In the above example, the =set= method is being used to set values for multiple properties - the =maxValue=, =minValue=, and =value= properties of a slider widget instance.

								Set the Value for a Property with Name and Value Arguments
									The value of a state property can be set by providing two parameters to the =set= method: a string parameter specifying the name of a property, and a value parameter that can be of any type.

									SYNTAX
									......................................................
									myInstance.set (propertyNameSTR,propertyValueANYTYPE);
									......................................................

									This variation of the =set= method is particularly useful in cases where you wish to use a variable or an expression to determine the state property whose value should be set. Consider the following example...

									EXAMPLE
									..............................................................
									MyClass.prototype.increment = function (propertyName,amount) {
										this.set (propertyName,this.get (propertyName) + amount);
									}
									..............................................................

									In the above example, a generic incrementer instance method is being implemented. It receives a =propertyName= parameter that specifies the state property to increment, and it passes the value of this parameter as the first parameter in the call to the =set= method.

									Slightly Less Performant
										This variation of the =set= method is very slightly less performant than the variation that accepts a single =propertyNamesValuesOBJ= parameter.

										This variation is offered primarily as a convenience for when the names of properties to be set need to be supplied through variables or expressions. While there is not much cost to using this variation when not necessary, it is advised to generally use the form that accepts a =propertyNamesValuesOBJ= parameter whenever possible (see `Set Values for One or More Properties with a Names/Values Object`).

								Set Values for Multiple Properties with Multiple Name and Value Arguments
									The values for an arbitrary number of state properties can be set by providing the names and values of the properties using an arbitrary number of name-value pair arguments, where even numbered arguments are property names and odd numbered arguments are property values.

									SYNTAX
									.........................................
									myInstance.set (
										property1NameSTR,property1ValueANYTYPE,
										property2NameSTR,property2ValueANYTYPE,
										... ... ...
										propertyNNameSTR,propertyNValueANYTYPE
									);
									.........................................

									This variation of the =set= method is an extension of the variation that lets you `set the value for a property with name and value arguments`, and has the same benefits and performance considerations.

								Set the Same Value for Multiple Properties
									The same value can be set for multiple state properties by specifying the names of the properties that should all be set to the same value in a =propertyNamesARRAY= parameter, and by specifying the value they should all be set to in a =propertyValueANYTYPE= parameter.

									SYNTAX
									.........................................................
									myInstance.set (propertyNamesARRAY,propertyValueANYTYPE);
									.........................................................

									EXAMPLE
									..............................................................
									myWidget.set (['initialized','ready','enabled','busy'],false);
									..............................................................

									In the above example, the properties =initialized=, =ready=, =enabled=, and =busy= of a widget instance are all being set to =false=.

									This variation of the =set= method can be useful in cases where you wish to set a good number of properties to the same value and where it would be more concise to use this form, or in cases where you are receiving an array of properties that should be set to some desired value. This variation can also be convenient when the value that you wish to set multiple properties to is the result of an expression and where you would otherwise need to create a local variable in order to avoid recalculating the expression for each property.

									INSTEAD OF...
									.......................................................................................
									var initValue = env.config.hasOwnProperty ('initValue') ? env.config.initValue : false;
									myInstance.set ({
										foo:initValue,
										bar:initValue,
										baz:initValue
									});
									.......................................................................................

									USE...
									.........................................................................
									myInstance.set (
										['foo','bar','baz'],
										env.config.hasOwnProperty ('initValue') ? env.config.initValue : false
									);
									.........................................................................

								NOTES
								- see the companion =get= instance method
								- see also the =Uize.Class.get= and =Uize.Class.set= static methods

						Static Methods
							Uize.Class.set
								Lets you set initial values for one or more of a class's state properties.

								DIFFERENT USAGES

								`Set Initial Values for One or More Properties with a Names/Values Object`
								.....................................
								MyClass.set (propertyNamesValuesOBJ);
								.....................................

								`Set the Initial Value for a Property with Name and Value Arguments`
								...................................................
								MyClass.set (propertyNameSTR,propertyValueANYTYPE);
								...................................................

								`Set Initial Values for Multiple Properties with Multiple Name and Value Arguments`
								.........................................
								MyClass.set (
									property1NameSTR,property1ValueANYTYPE,
									property2NameSTR,property2ValueANYTYPE,
									... ... ...
									propertyNNameSTR,propertyNValueANYTYPE
								);
								.........................................

								`Set the Same Initial Value for Multiple Properties`
								......................................................
								MyClass.set (propertyNamesARRAY,propertyValueANYTYPE);
								......................................................

								Set Initial Values for One or More Properties with a Names/Values Object
									In the standard usage, a single =propertyNamesValuesOBJ= parameter can be passed to the =Uize.Class.set= method in order to set initial values for one or more properties.

									SYNTAX
									.....................................
									MyClass.set (propertyNamesValuesOBJ);
									.....................................

									Each key of the =propertyNamesValuesOBJ= object represents the name of a state property whose initial value should be set, and each corresponding value represents the initial value that should be set for a property.

									EXAMPLE 1
									....................................
									MyWidgetClass.set ({enabled:false});
									....................................

									In the above example, the =Uize.Class.set= method is being used to set the initial value for just one property - the =enabled= property of a widget class.

									EXAMPLE 2
									.............................
									Uize.Widget.Bar.Slider.set ({
										maxValue:100,
										minValue:0,
										value:0
									});
									.............................

									In the above example, the =Uize.Class.set= method is being used to set initial values for multiple properties - the =maxValue=, =minValue=, and =value= properties of the =Uize.Widget.Bar.Slider= widget class.

								Set the Initial Value for a Property with Name and Value Arguments
									The initial value for a state property can be set by providing two parameters to the =Uize.Class.set= method: a string parameter specifying the name of a property, and a value parameter that can be of any type.

									SYNTAX
									...................................................
									MyClass.set (propertyNameSTR,propertyValueANYTYPE);
									...................................................

									This variation of the =Uize.Class.set= method is particularly useful in cases where you wish to use a variable or an expression to determine the state property whose initial value should be set. Consider the following example...

									EXAMPLE
									............................................................
									MyClass.increment = function (propertyName,amount) {
										this.set (propertyName,this.get (propertyName) + amount);
									}
									............................................................

									In the above example, a generic incrementer static method is being implemented. It receives a =propertyName= parameter that specifies the state property whose initial value should be incremented, and it passes the value of this parameter as the first parameter in the call to the =Uize.Class.set= method.

									Slightly Less Performant
										This variation of the =Uize.Class.set= method is very slightly less performant than the variation that accepts a single =propertyNamesValuesOBJ= parameter.

										This variation is offered primarily as a convenience for when the names of properties whose initial values are to be set need to be supplied through variables or expressions. While there is not much cost to using this variation when not necessary, it is advised to generally use the form that accepts a =propertyNamesValuesOBJ= parameter whenever possible (see `Set Initial Values for One or More Properties with a Names/Values Object`).

								Set Initial Values for Multiple Properties with Multiple Name and Value Arguments
									The initial values for an arbitrary number of state properties can be set by providing the names and values of the properties using an arbitrary number of name-value pair arguments, where even numbered arguments are property names and odd numbered arguments are property values.

									SYNTAX
									.........................................
									MyClass.set (
										property1NameSTR,property1ValueANYTYPE,
										property2NameSTR,property2ValueANYTYPE,
										... ... ...
										propertyNNameSTR,propertyNValueANYTYPE
									);
									.........................................

									This variation of the =Uize.Class.set= method is an extension of the variation that lets you `set the initial value for a property with name and value arguments`, and has the same benefits and performance considerations.

								Set the Same Initial Value for Multiple Properties
									The same initial value can be set for multiple state properties by specifying the names of the properties whose initial values should all be set to the same value in a =propertyNamesARRAY= parameter, and by specifying the initial value that should be set for them all in a =propertyValueANYTYPE= parameter.

									SYNTAX
									......................................................
									MyClass.set (propertyNamesARRAY,propertyValueANYTYPE);
									......................................................

									EXAMPLE
									...................................................................
									MyWidgetClass.set (['initialized','ready','enabled','busy'],false);
									...................................................................

									In the above example, the initial value for the properties =initialized=, =ready=, =enabled=, and =busy= of a widget class is being set to =false=.

									This variation of the =Uize.Class.set= method can be useful in cases where you wish to set the initial value for a good number of properties to the same value and where it would be more concise to use this form, or in cases where you are receiving an array of properties whose initial values should all be set to some desired value. This variation can also be convenient when the initial value that you wish to set for multiple properties is the result of an expression and where you would otherwise need to create a local variable in order to avoid recalculating the expression for each property.

									INSTEAD OF...
									.......................................................................................
									var initValue = env.config.hasOwnProperty ('initValue') ? env.config.initValue : false;
									MyClass.set ({
										foo:initValue,
										bar:initValue,
										baz:initValue
									});
									.......................................................................................

									USE...
									.........................................................................
									MyClass.set (
										['foo','bar','baz'],
										env.config.hasOwnProperty ('initValue') ? env.config.initValue : false
									);
									.........................................................................

								NOTES
								- see the companion =Uize.Class.get= static method
								- see also the =get= and =set= instance methods

					*/
				};

				_class.toggle = _classPrototype.toggle = function (_propertyName) {
					var _value = !this.get (_propertyName);
					this.set (_propertyName,_value);
					return _value;
					/*?
						Instance Methods
							toggle
								Toggles the value of the specified boolean instance state property.

								SYNTAX
								.......................................................
								toggledValueBOOL = myInstance.toggle (propertyNameSTR);
								.......................................................

								The =toggle= instance method is provided purely as a convenience. The following two statements are equivalent...

								.............................................................
								myInstance.toggle ('myProperty');
								myInstance.set ({myProperty:!myInstance.get ('myProperty')});
								.............................................................

								As you can see, using the =toggle= method produces more concise code.

						Static Methods
							Uize.Class.toggle
								Toggles the value of the specified boolean static state property.

								SYNTAX
								.......................................................
								toggledValueBOOL = Uize.Class.toggle (propertyNameSTR);
								.......................................................

								The =Uize.Class.toggle= static method is provided purely as a convenience. The following two statements are equivalent...

								.............................................................
								Uize.Class.toggle ('myProperty');
								Uize.Class.set ({myProperty:!Uize.Class.get ('myProperty')});
								.............................................................

								As you can see, using the =Uize.Class.toggle= method produces more concise code.
					*/
				};

		/*** Public Instance Methods ***/
			_classPrototype.kill = function () {
				var _instanceId = this.instanceId;
				_eval ('if(typeof ' + _instanceId + '!=\'undefined\')' + _instanceId + '=null');
				/*?
					Instance Methods
						kill
							Nulls out the global variable (or property of the =window= object) of the name =instanceId=.

							This method may be useful if global (or window object level) references are made to instances of a class, usually for the purpose of group management, or the implementation of certain kinds of state exclusivity amongst instances of a class. This method is also intended to be overridden by subclasses where additional destructor style code may be desired.
				*/
			};

		/*** Inheritance Mechanism ***/
			function _createSubclass (_class,_alphastructor,_omegastructor) {
				function _toString () {
					var
						_propertiesLines = [],
						_Uize_toString = _Uize.toString
					;
					_forEach (
						this.get (),
						function (_propertyValue,_propertyName) {
							_propertiesLines.push (
								_propertyName + ' : ' +
								(
									_propertyValue && (_isInstance (_propertyValue) || _isFunction (_propertyValue))
										? _Uize_toString.call (_propertyValue)
										: _propertyValue
								)
							);
						}
					);
					return _Uize_toString.call (this) + '\n\n' + _propertiesLines.sort ().join ('\n');
				}

				function _valueOf () {
					return this [_getPropertyPrivateName (this,'value')];
					/*?
						Instance Methods
							toString Intrinsic Method
								Returns a string, providing summary info for the instance on which the method is called.

								SYNTAX
								............................................
								instanceSummarySTR = myInstance.toString ();
								............................................

								The string returned by this method provides a summary that includes the instance's class name and the state of its state properties. Among other things, this method provides a convenient and lightweight way to gather information about instances of =Uize.Class= subclasses during debugging and troubleshooting. The =toString Intrinsic Method= is invoked automatically in certain contexts in order to convert an object to a string form, such as when alerting an object using the =alert= global function.

								EXAMPLE
								.............................
								alert (page.children.slider);
								.............................

								In the above example, if the =page= widget has a =slider= child widget that is an instance of the class =Uize.Widget.Bar.Slider=, then the output of the =alert= statement could look something like...

								EXAMPLE OUTPUT
								........................................
								[object Uize.Widget.Bar.Slider]

								built : true
								busy : inherit
								busyInherited : false
								confirm : undefined
								container : undefined
								decimalPlacesToDisplay : undefined
								enabled : inherit
								enabledInherited : true
								html : undefined
								idPrefix : page_slider
								idPrefixConstruction : concatenated
								inDrag : false
								increments : 1
								inform : undefined
								insertionMode: undefined
								localized : undefined
								maxValidValue : undefined
								maxValue : 200
								minValidValue : undefined
								minValue : 0
								name : slider
								nodeMap : undefined
								orientation : vertical
								parent : [class MyCompanySite.Page]
								restTime : 250
								scaleFunc : [object Function]
								value : 0
								valueFunc : [object Function]
								wired : true
								........................................

								In certain contexts, providing a reference to a =Uize.Class= subclass instance as a parameter to some method will result in the =valueOf Intrinsic Method= of that instance being invoked in order to coerce it to a simple value. If it is your desire to have the instance summary be used rather than the instance's value, then you should explicitly call the =toString Intrinsic Method=, as follows...

								EXAMPLE
								........................................................................................
								Uize.Node.setInnerHtml ('sliderWidgetSummaryForDebug',page.children.slider.toString ());
								Uize.Node.setInnerHtml ('sliderWidgetCurrentValue',page.children.slider);
								........................................................................................

								In this example, the =sliderWidgetSummaryForDebug= node will contain the summary info for the instance, while the =sliderWidgetCurrentValue= node will just show the slider widget's current value.

								NOTES
								- see also the =Uize.toString= static intrinsic method

							valueOf Intrinsic Method
								Returns the value of the instance's =value= state property.

								SYNTAX
								.............................................
								instanceValueANYTYPE = myInstance.valueOf ();
								.............................................

								The =valueOf Intrinsic Method= is invoked automatically in certain contexts in order to convert an object to a value, such as when using an object reference in an expression.

								EXAMPLE
								..........................................................................
								var markedUpPrice = price * (1 + page.children.markupPercentSlider / 100);
								..........................................................................

								In the above example, the page widget has a slider child widget that is an instance of the class =Uize.Widget.Bar.Slider= and that lets the user choose a markup percentage between =0= and =100=. In the above expression, the slider widget is being divided by 100. Rather than giving you a hundred *really* tiny slider widgets (not all that useful), JavaScript automatically invokes the =valueOf Intrinsic Method=. The implementation of this instance method in the =Uize.Class= base class results in the slider's current value being returned so that it can then be used in the expression.

								The following three statements are equivalent...

								....................................................................................
								markedUpPrice = price * (1 + page.children.markupPercentSlider.get ('value') / 100);
								markedUpPrice = price * (1 + page.children.markupPercentSlider.valueOf () / 100);
								markedUpPrice = price * (1 + page.children.markupPercentSlider / 100);
								....................................................................................

								In certain contexts, providing a reference to a =Uize.Class= subclass instance as a parameter to some method will result in the =toString Intrinsic Method= of that instance being invoked in order to resolve it to a string value. If it is your desire to have the value used rather than the instance summary, then you should explicitly call the =valueOf Intrinsic Method=, as follows...

								EXAMPLE
								.....................................................
								alert (page.children.markupPercentSlider.valueOf ());
								.....................................................

								In this example, the current value of the =markupPercentSlider= widget will be displayed in the alert dialog, rather than the instance summary. You can also use shortcuts, as follows...

								COERCE TO NUMBER
								...........................................
								alert (+page.children.markupPercentSlider);
								...........................................

								COERCE TO STRING
								................................................
								alert (page.children.titleTextInputWidget + '');
								................................................

								Both of the above examples will cause JavaScript to invoke the =valueOf Intrinsic Method= rather than the =toString Intrinsic Method=, but the first will coerce the value to a number type, while the second will coerce the value to a string type.

								NOTES
								- compare to the =toString Intrinsic Method=, and the =Uize.toString= static intrinsic method
								- see also the =Uize.Class.valueOf= static intrinsic method
								- if the instance's class does not declare a =value= state property, then this method will return the value of the instance's =value= property, and if the instance has no =value= property, then this method will simply return =undefined=

						Static Methods
							Uize.Class.valueOf
								Returns the value of the class' =value= state property.

								SYNTAX
								.......................................
								classValueANYTYPE = MyClass.valueOf ();
								.......................................

								The =Uize.Class.valueOf= static intrinsic method is invoked automatically in certain contexts in order to convert a class to a value, such as when using a class reference in an expression (eg. =Uize.Widget.Bar.Slider + 0=). This static method is implemented primarily to provide parity with the =valueOf Intrinsic Method=. Its behavior is largely equivalent to that of the instance method, excepting that it applies to the static value of the =value= state property.

								NOTES
								- compare to the =toString Intrinsic Method=, and the =Uize.toString= static intrinsic method
								- see also the =valueOf Intrinsic Method=
								- if the class does not declare a =value= state property, then this method will return the value of the class' =value= property, and if the class has no =value= property, then this method will simply return =undefined=
					*/
				}

				var
					_classPrototype = _class.prototype,
					_subclass = _noNew (
						function () {
							for (
								var _alphastructorNo = -1, _alphastructorsLength = _alphastructors.length;
								++_alphastructorNo < _alphastructorsLength;
							)
								_alphastructors [_alphastructorNo].apply (this,arguments)
							;
							for (
								var _omegastructorNo = -1, _omegastructorsLength = _omegastructors.length;
								++_omegastructorNo < _omegastructorsLength;
							)
								_omegastructors [_omegastructorNo].apply (this,arguments)
							;
						}
					),
					_subclassPrototype = _subclass.prototype
				;

				/*** Inherit static properties (excluding prototype) and methods from base class ***/
					var
						_propertyValue,
						_nonInheritableStatics = _class.nonInheritableStatics || _sacredEmptyObject
					;
					for (var _property in _class)
						if (
							!_nonInheritableStatics [_property] &&
							(_propertyValue = _class [_property]) != _classPrototype &&
							!(
								_isFunction (_propertyValue) &&
								_propertyValue.moduleName &&
								/[A-Z]/.test (_property.charAt (0))
							)
						)
							_subclass [_property] = _clone (_propertyValue)
					;

				/*** Prepare instance properties and methods ***/
					/*** Inherit instance properties and methods from base class (from prototype) ***/
						_copyInto (_subclassPrototype,_classPrototype);

						/*** Make sure toString and valueOf are copied ***/
							/* NOTE: in IE, toString and valueOf aren't enumerable properties of the prototype object */
							_subclassPrototype.toString = _toString;
							_subclassPrototype.valueOf = _valueOf;

					/*** Non-inherited Public Instance Properties ***/
						_subclassPrototype.Class = _subclass;
							/*?
								Instance Properties
									Class
										A reference to the class's constructor.

										You can use this to interrogate an object instance to see if it is of a certain class, as illustrated in the following example...

										EXAMPLE
										.......................................................
										if (myInstance.Class == Uize.Widget.Bar.Slider) {
											// do something for sliders
										} else if (myInstance.Class == Uize.Widget.Tree.Menu) {
											// do something for tree menus
										} else if (myInstance.Class == Uize.Widget.ImageWipe) {
											// do something for wipes
										}
										.......................................................

										The above example is admittedly a little abstract. It is hard to imagine the exact scenario that may come up where some code is handed object instances where their class will not be known. But, when such a case comes up, the =Class= property has got your back.
							*/

					/*** Non-inherited Public Static Properties ***/
						_subclass.nonInheritableStatics = {_singletons:1,nonInheritableStatics:1,toString:0,valueOf:0};
							/*?
								Static Properties
									Uize.Class.nonInheritableStatics
										A lookup object, automatically created for a class, in which you can register the static features (methods or properties) of the class that should *not* be inherited when that class is subclassed.

										Each property of the =Uize.Class.nonInheritableStatics= lookup object represents a single static feature of the class that should not be inherited by subclasses, where the name of each property should be the name of a static feature (excluding the module name), and the value of each property should be a truthy value (such as =true=, =1=, ='foo'=, =[]=, ={}=, etc.). After a class has been created, non-inheritable statics can be registered for that class by assigning properties to the class' =MyClass.nonInheritableStatics= static property, as shown in the example below...

										EXAMPLE
										...........................................................................
										var MyClass = Uize.Class.subclass ();
										MyClass.someUtilityFunction = function () {
											// do something of great utility
										};
										MyClass.nonInheritableStatics.someUtilityFunction = 1;

										MyClassSubclass = MyClass.subclass ();
										alert (MyClassSubclass.someUtilityFunction); // alerts the text "undefined"
										...........................................................................

										In the above example, the =MyClass.someUtilityFunction= static method of the class =MyClass= has been registered as a non-inheritable static. This is done by the statement =MyClass.nonInheritableStatics.someUtilityFunction &#61; 1=. Now, when the =MyClassSubclass= class is created by calling the =MyClass.subclass= method, the new subclass that is created does not get the =someUtilityFunction= static feature. Therefore, the =alert= statement displays the text "undefined" in the alert dialog.

										nonInheritableStatics is a Non-inheritable Static
											When a class is created, the =MyClass.nonInheritableStatics= static property is automatically initialized on that class to a fresh object with the value ={nonInheritableStatics:1}=.

											This initial mapping means that the =MyClass.nonInheritableStatics= static property is, itself, not inheritable by subclasses - subclasses get their own fresh object. So, in our example, when the =MyClassSubclass= subclass is created, its fresh =MyClassSubclass.nonInheritableStatics= property does *not* have an entry for the =someUtilityFunction= static feature, because it does not have that static feature and the contents of the =MyClass.someUtilityFunction= object is not inherited by the =MyClassSubclass= class.
							*/

						_subclass.superclass = _class;
							/*?
								Static Properties
									Uize.Class.superclass
										A reference to the class' superclass.

										SYNTAX
										....................................
										superclassOBJ = classOBJ.superclass;
										....................................

										EXAMPLE
										............................................................................
										var MyWidgetClass = Uize.Widget.subclass ();
										alert (MyWidgetClass.superclass == Uize.Widget); // displays the text "true"
										............................................................................
							*/

					/*** Non-inherited Public Static Methods ***/
						_subclass.toString = _toString;
						_subclass.valueOf = _valueOf;

				/*** Initialize Alphastructors and Omegastructors ***/
					var
						_alphastructors = _subclass._alphastructors = (_class._alphastructors || _sacredEmptyArray).concat (),
						_omegastructors = _subclass._omegastructors = (_class._omegastructors || _sacredEmptyArray).concat ()
					;
					(_subclass._alphastructor = _alphastructor) && _alphastructors.push (_alphastructor);
					(_subclass._omegastructor = _omegastructor) && _omegastructors.push (_omegastructor);

				_subclass._propertyProfilesByPrivateNames || (_subclass._propertyProfilesByPrivateNames = {});
				_subclass._propertyProfilesByPublicNames || (_subclass._propertyProfilesByPublicNames = {});

				return _subclass;
			};

			_class.subclass = function (_arg0,_arg1) {
				var _subclass;
				if (arguments.length == 1 && !_isFunction (_arg0)) {
					(_subclass = _createSubclass (this)).declare (_arg0);
				} else {
					_subclass = _createSubclass (this,_arg0,_arg1);
				}
				return _subclass;
				/*?
					Static Methods
						Uize.Class.subclass
							Lets you subclass the =Uize.Class= base class or any subclass of =Uize.Class=.

							DIFFERENT USAGES

							`Create a Subclass, Declaring Multiple Features by Type`
							..................................................
							MyClass = Uize.Class.subclass (featuresByTypeOBJ);
							..................................................

							`Create a Subclass, Specifying Only an Alphastructor`
							..................................................
							MyClass = Uize.Class.subclass (alphastructorFUNC);
							..................................................

							`Create a Subclass, Specifying Both Alphastructor and Omegastructor`
							....................................................................
							MyClass = Uize.Class.subclass (alphastructorFUNC,omegastructorFUNC);
							....................................................................

							`Create a Subclass, Specifying Only an Omegastructor`
							............................................................
							MyClass = Uize.Class.subclass (null,omegastructorFUNC);
							MyClass = Uize.Class.subclass (undefined,omegastructorFUNC);
							............................................................

							Create a Subclass, Declaring Multiple Features by Type
								As a convenience, the =Uize.Class.subclass= method supports a variation that takes a single object parameter, as a means of `declaring features by type when creating a class`.

								SYNTAX
								..................................................
								MyClass = Uize.Class.subclass (featuresByTypeOBJ);
								..................................................

								Using this variation, one or more features of various different `feature types` can be conveniently declared during the subclass creation. When using this variation, setting the alphastructor and/or omegastructor for the class being created must be done by specifying values for the =alphastructor= and/or =omegastructor= properties of the =featuresByTypeOBJ= object.

								EXAMPLE
								....................................
								var MySubclass = MyClass.subclass ({
									alphastructor:function () {
										// implementation here
									},
									omegastructor:function () {
										// implementation here
									},
									staticMethods:{
										staticMethod1:function () {
											// implementation here
										},
										staticMethod2:function () {
											// implementation here
										}
									},
									instanceMethods:{
										instanceMethod1:function () {
											// implementation here
										},
										instanceMethod2:function () {
											// implementation here
										}
									},
									stateProperties:{
										stateProperty1:{
											// property profile
										},
										stateProperty2:{
											// property profile
										}
									}
								});
								....................................

							Create a Subclass, Specifying Only an Alphastructor
								A subclass can be created with just an `alphastructor` set, by specifying just a single =alphastructorFUNC= function type parameter.

								SYNTAX
								..................................................
								MyClass = Uize.Class.subclass (alphastructorFUNC);
								..................................................

								Consider the following example...

								EXAMPLE
								.......................................
								var MyClass = Uize.Class.subclass (
									function () {
										this.foo = 'How unoriginal!';
									}
								);

								var MySubclass = MyClass.subclass (
									function () {
										this.bar = this.foo + ' Indeed!';
									}
								);
								.......................................

								In the above example, =MySubclass= is a subclass of =MyClass=, which is in turn a subclass of the =Uize.Class= base class. Now, when an instance of =MySubSubclass= gets created, the constructor of =MyClass= and then the constructor of =MySubSubclass= will be executed in the initialization of the instance, and the instance will have both =foo= and =bar= properties, where the =bar= property will have a value of "How unoriginal! Indeed!".

							Create a Subclass, Specifying Both Alphastructor and Omegastructor
								A subclass can be created with both an `alphastructor` and an `omegastructor` set, by specifying the =alphastructorFUNC= and =omegastructorFUNC= function type parameters.

								SYNTAX
								....................................................................
								MyClass = Uize.Class.subclass (alphastructorFUNC,omegastructorFUNC);
								....................................................................

							Create a Subclass, Specifying Only an Omegastructor
								A subclass can be created with just an `omegastructor` set, by specifying the =alphastructorFUNC= and =omegastructorFUNC= parameters and specifying the value =null= or =undefined= for the =alphastructorFUNC= parameter.

								SYNTAX
								............................................................
								MyClass = Uize.Class.subclass (null,omegastructorFUNC);
								MyClass = Uize.Class.subclass (undefined,omegastructorFUNC);
								............................................................
				*/
			};

			_class.singleton = function (_scope,_properties) {
				var
					_singletons = this._singletons || (this._singletons = {}),
					_singleton = _singletons [_scope || (_scope = '')]
				;
				_singleton
					? _properties && _singleton.set (_properties)
					: (_singleton = _singletons [_scope] = this (_properties))
				;
				return _singleton;
				/*?
					Static Methods
						Uize.Class.singleton
							Returns a singleton for the class for the optionally specified scope (default is empty scope).

							DIFFERENT USAGES

							`Get a Singleton for a Class`
							....................................
							singletonOBJ = MyClass.singleton ();
							....................................

							`Get a Singleton for a Class for a Specific Scope`
							............................................
							singletonOBJ = MyClass.singleton (scopeSTR);
							............................................

							`Get a Singleton for a Class for a Specific Scope, Specifying Initial State`
							..........................................................
							singletonOBJ = MyClass.singleton (scopeSTR,propertiesOBJ);
							..........................................................

							Get a Singleton for a Class
								When no parameters are specified, this method will return a singleton for the class in the default scope.

								SYNTAX
								....................................
								singletonOBJ = MyClass.singleton ();
								....................................

								When the =Uize.Class.singleton= static method is called on a class, if a singleton instance has already been created for the default scope, then that instance will be returned. Otherwise, a singleton instance will be created for the default scope and then returned.

							Get a Singleton for a Class for a Specific Scope
								When the optional =scopeSTR= parameter is specified, this method will return a singleton for the class in the specified scope.

								SYNTAX
								............................................
								singletonOBJ = MyClass.singleton (scopeSTR);
								............................................

								When the =Uize.Class.singleton= static method is called on a class, if a singleton instance has already been created for the specified scope, then that instance will be returned. Otherwise, a singleton instance will be created for the specified scope and then returned.

							Get a Singleton for a Class for a Specific Scope, Specifying Initial State
								When the optional =propertiesOBJ= parameter is specified, then this method will return a singleton for the class in the specified scope, and with the state of its state properties set using the =propertiesOBJ= object.

								SYNTAX
								..........................................................
								singletonOBJ = MyClass.singleton (scopeSTR,propertiesOBJ);
								..........................................................

								When the =Uize.Class.singleton= static method is called on a class, if a singleton instance has already been created for the specified scope, then that instance will be set to the state specified by the =propertiesOBJ= parameter and then returned. Otherwise, a singleton instance will be created for the specified scope, with its state initialized using the =propertiesOBJ= parameter, and then returned.

							Singleton Scope
								As a convenience, the =Uize.Class.singleton= static method lets you optionally specify a scope when getting singleton instances, using the =scopeSTR= parameter.

								If no =scopeSTR= parameter is specified when getting a singleton for a class, then the default scope (an empty string) will be used. Therefore, the statement =MyClass.singleton ()= is equivalent to the statement =MyClass.singleton ('')=.

								A scope provides multiple different bits of related but distributed code to get a reference to the same singleton by specifying the same scope, while still allowing other code to share references to a different singleton created using a different scope.
				*/
			};

			_class.instanceMethods = _class.instanceProperties = function (_instanceFeatures) {
				_copyInto (this.prototype,_instanceFeatures);
				/*?
					Static Methods
						Uize.Class.instanceMethods
							Lets you conveniently declare one or more instance methods, by specifying the methods in an object.

							SYNTAX
							.............................................
							MyClass.instanceMethods (instanceMethodsOBJ);
							.............................................

							EXAMPLE
							...................................................
							var MyWidgetClass = Uize.Widget.subclass ();

							MyWidgetClass.instanceMethods ({
								wireUi:function () {
									// implementation of wireUi instance method
								},

								updateUi:function () {
									// implementation of updateUi instance method
								}
							});
							...................................................

							In the above example, a widget class is being created by subclassing the =Uize.Widget= base class. Then, the =wireUi= and =updateUi= instance methods are being declared for the class by calling the =instanceMethods= method on the class.

							NOTES
							- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
							- see the other `feature declaration methods`

						Uize.Class.instanceProperties
							Lets you conveniently declare one or more instance properties, by specifying the properties and their initial values in an object.

							SYNTAX
							...................................................
							MyClass.instanceProperties (instancePropertiesOBJ);
							...................................................

							EXAMPLE
							.............................
							MyClass.instanceProperties ({
								timeoutMs:2000,
								retryAttempts:5
							});
							.............................

							In the above example, the =Uize.Class.instanceProperties= method is being used to declare the =timeoutMs= and =retryAttempts= instance properties.

							NOTES
							- compare to the =Uize.Class.stateProperties= static method
							- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
							- see the other `feature declaration methods`
				*/
			};

			_class.staticMethods = _class.staticProperties = function (_staticFeatures) {
				_copyInto (this,_staticFeatures);
				/*?
					Static Methods
						Uize.Class.staticMethods
							Lets you conveniently declare one or more static methods, by specifying the methods in an object.

							SYNTAX
							.........................................
							MyClass.staticMethods (staticMethodsOBJ);
							.........................................

							NOTES
							- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
							- see the other `feature declaration methods`

						Uize.Class.staticProperties
							Lets you conveniently declare one or more static properties, by specifying the properties and their initial values in an object.

							SYNTAX
							............................................
							MyClass.staticMethods (staticPropertiesOBJ);
							............................................

							NOTES
							- compare to the =Uize.Class.stateProperties= static method
							- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
							- see the other `feature declaration methods`
				*/
			};

			_class.dualContextMethods = _class.dualContextProperties = function (_dualContextFeatures) {
				_copyInto (this,_dualContextFeatures);
				_copyInto (this.prototype,_dualContextFeatures);
				/*?
					Static Methods
						Uize.Class.dualContextMethods
							Lets you conveniently declare one or more `dual context` methods, by specifying the methods in an object.

							SYNTAX
							...................................................
							MyClass.dualContextMethods (dualContextMethodsOBJ);
							...................................................

							NOTES
							- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
							- see the other `feature declaration methods`

						Uize.Class.dualContextProperties
							Lets you conveniently declare one or more `dual context` properties, by specifying the properties and their initial values in an object.

							SYNTAX
							......................................................
							MyClass.dualContextMethods (dualContextPropertiesOBJ);
							......................................................

							NOTES
							- compare to the =Uize.Class.stateProperties= static method
							- this method may be called multiple times for a class (see `Feature Declarations are Cumulative`)
							- see the other `feature declaration methods`
				*/
			};

			_class.alphastructor = function (_alphastructor) {
				this._alphastructor && this._alphastructors.length--;
				(this._alphastructor = _alphastructor) && this._alphastructors.push (_alphastructor);
				/*?
					Static Methods
						Uize.Class.alphastructor
							Lets you declare the `alphastructor` for the class.

							SYNTAX
							..........................................
							MyClass.alphastructor (alphastructorFUNC);
							..........................................

							NOTES
							- see the other `feature declaration methods`
				*/
			};

			_class.omegastructor = function (_omegastructor) {
				this._omegastructor && this._omegastructors.length--;
				(this._omegastructor = _omegastructor) && this._omegastructors.push (_omegastructor);
				/*?
					Static Methods
						Uize.Class.omegastructor
							Lets you declare the `omegastructor` for the class.

							SYNTAX
							..........................................
							MyClass.omegastructor (omegastructorFUNC);
							..........................................

							NOTES
							- see the other `feature declaration methods`
				*/
			};

			_class.declare = function (_featuresByType) {
				if (_featuresByType)
					for (var _featureType in _featuresByType)
						_isFunction (this [_featureType]) && this [_featureType] (_featuresByType [_featureType])
				;
				/*?
					Static Methods
						Uize.Class.declare
							Lets you declare one or more features of one or more different `feature types` for the class.

							SYNTAX
							....................................
							MyClass.declare (featuresByTypeOBJ);
							....................................

							For convenience, the =Uize.Class.declare= method lets you declare features of various types, in the same way as they can be declared when using the variation of the =Uize.Class.subclass= method that supports specifying features in a =featuresByTypeOBJ= object. The =Uize.Class.declare= method lets you declare additional features at any time after first creating a class, using the same semantics as supported by the =Uize.Class.subclass= method.

							EXAMPLE
							...................................
							MyClass.declare ({
								alphastructor:function () {
									// implementation here
								},
								omegastructor:function () {
									// implementation here
								},
								staticMethods:{
									staticMethod1:function () {
										// implementation here
									},
									staticMethod2:function () {
										// implementation here
									}
								},
								instanceMethods:{
									instanceMethod1:function () {
										// implementation here
									},
									instanceMethod2:function () {
										// implementation here
									}
								},
								stateProperties:{
									stateProperty1:{
										// property profile
									},
									stateProperty2:{
										// property profile
									}
								}
							});
							...................................

							NOTES
							- see the other `feature declaration methods`
				*/
			};

		return _class;
	}
});

