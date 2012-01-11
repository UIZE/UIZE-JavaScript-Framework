/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class Base Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 10
	codeCompleteness: 100
	testCompleteness: 40
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Class= module defines a base class from which many of the classes in the UIZE JavaScript Framework inherit.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
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
		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_typeString = 'string',
				_typeObject = 'object',

				/*** references to utility methods of Uize ***/
					_Uize = Uize,
					_clone = _Uize.clone,
					_copyInto = _Uize.copyInto,
					_forEach = _Uize.forEach,
					_getClass = _Uize.getClass,
					_getGuid = _Uize.getGuid,
					_globalEval = _Uize.globalEval,
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
								var _eventHandlers = _this._eventHandlers || (_this._eventHandlers = _this.eventHandlers = {});
								(_eventHandlers [_eventName] || (_eventHandlers [_eventName] = [])).push (
									{
										_eventName:_eventName,
										_handler:
											_isFunction (_handler)
												? _handler
												: typeof _handler == _typeString
													? new Function (_handler)
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

									One limitation of this handler type is that, unlike `Function Type Handlers`, a code string specified by the =eventHandlerSTRorFNorOBJ= parameter cannot reference the event object.

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

			/*** Set-get Property System Methods ***/
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
								Driven off of private names to ensure that there is only one property in the object for each actual set-get property, otherwise you can end up in bad situations.
							*/
							var
								_class = _getClass (_this),
								_propertyProfilesByPrivateNames = _class._propertyProfilesByPrivateNames
							;
							for (var _propertyPrivateName in _propertyProfilesByPrivateNames)
								_result [_propertyProfilesByPrivateNames [_propertyPrivateName]._publicName] =
									_this [_propertyPrivateName]
							;
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
								Lets you query the value of one of an instance's set-get properties.

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
									In the most typical usage of the =get= instance method, a =propertyNameSTR= parameter can be specified in order to get the value of a single set-get property.

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
									When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the instance set-get properties specified in the array will be populated into an object and returned.

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
									When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the instance set-get properties specified in the array will be populated into an object and returned.

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

									After the above code has been executed, the =sliderValueAndRange= variable would have the value ={minValue:0,maxValue:100,value:57}=. The values of the properties in the properties object, as specified by the =propertiesOBJ= parameter, are immaterial - for whatever properties exist in the object, the values for the corresponding set-get properties of the instance will be returned.

								Get Values for All Properties
									When no parameter is specified, the =get= instance method will return an object containing values for all the set-get properties of the instance.

									SYNTAX
									.........................................
									allPropertyValuesOBJ = myInstance.get ();
									.........................................

									For one thing, this variation makes it easy to create a new instance of a class with the same state as an existing instance.

									EXAMPLE
									.........................................
									copyOfMyFade = Uize.Fade (myFade.get ());
									.........................................

									In this example, an instance of the class =Uize.Fade= is being created by passing the constructor all the set-get property values obtained from the =myFade= instance using the =get= method. The new instance created will then have the same state as the =myFade= instance.

								NOTES
								- see also the =set= instance method
								- see also the =Uize.Class.get= and =Uize.Class.set= static methods

						Static Methods
							Uize.Class.get
								Lets you query the initial value for one of the class's set-get properties.

								SYNTAX
								........................................................
								propertyValueANYTYPE = Uize.Class.get (propertyNameSTR);
								........................................................

								VARIATIONS
								........................................................
								propertyValuesOBJ = Uize.Class.get (propertyNamesARRAY);
								........................................................

								When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the class set-get properties specified in the array will be populated into an object and returned. So, for example =Uize.Widget.get (['enabled','busy','built'])= would return a result like ={enabled:'inherit',busy:'inherit',built:true}=.

								.........................................
								allPropertyValuesOBJ = Uize.Class.get ();
								.........................................

								When no parameter is specified, the =Uize.Class.get= static method will return an object containing values for all the registered set-get properties of the class.

								NOTES
								- see also the =Uize.Class.set= static method
								- see also the =get= and =set= instance methods
					*/
				};

				_class.registerProperties = function (_propertyProfiles) {
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
							_Uize.lookup (_pseudonyms,_propertyProfile,_propertyProfilesByPublicNames);
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
							Uize.Class.registerProperties
								Lets you register properties for the class.

								SYNTAX
								.....................................................
								MyClass.registerProperties (propertiesDefinitionOBJ);
								.....................................................

								The object specified in =propertiesDefinitionOBJ= parameter must conform to a specific structure. Each property of this object represents a property to be registered for the class, where the property name specifies the internal name to be used for the class property and the property's string value specifies the class property's public name. As an alternative to a string value, the property's value can be an object whose =name= property specifies the class property's public name and where an optional =onChange= property specifies a handler function that should be executed every time the value of the class property changes. This is all best illustrated with an example...

								EXAMPLE
								...........................................................................
								MyClass.registerProperties (
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
								- calls to this method are cumulative, so it is possible to register properties in multiple separate batches
					*/
				};

				_class.set = _classPrototype.set = function (_properties) {
					/* NOTE:
						Yes, there are functions _getClass and _getPropertyPrivateName that could be used (and were at one point), but this code needs to be tuned for performance since set is a touch point in so many places.
					*/
					if (arguments.length > 1)
						/* NOTE:
							- support for...
								set (propertyName,propertyValue)

								or...

								set (
									property1Name,property1Value,
									property2Name,property2Value,
									...
									propertyNName,propertyNValue
								)
						*/
						_properties = _pairUp.apply (0,arguments)
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
						_propertiesToRegister,
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
							(_propertiesToRegister || (_propertiesToRegister = {})) [
								_propertyPrivateName = _propertyPublicName = _propertyPublicOrPrivateName
							] =
								_propertyProfile = _thisIsInstance ? {} : {value:_propertyValue}
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
									function _processOnChangeHandler (_onChangeHandler) {
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
									}
									_propertyProfile._onChange && _processOnChangeHandler (_propertyProfile._onChange);
							}
							_this [_propertyPrivateName] = _propertyValue;
						}
					}
					_propertiesToRegister && _class.registerProperties (_propertiesToRegister);
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
										The =Changed.*= instance event is a wildcard event that is fired whenever one or more set-get properties change value as a result of a call to the =set= instance method.

										This event will only be fired once for all set-get properties that have changed value during a call to the =set= method. The event object for this event will contain a =properties= property, which is an object indicating which set-get properties have changed value, being a mapping between the public names of set-get properties that have changed and their new values.

										NOTES
										- compare to the related =Changed.[propertyName]= instance event
										- wiring a handler for the =Changed.*= event may have a slight performance impact, since this event will be fired any time that any set-get property changes value

									Changed.[propertyName]
										The =Uize.Class= base class implements a generalized mechanism for firing events when the values of set-get properties are changed.

										This means that for any set-get property that is registered through the =Uize.Class.registerProperties= static method, a handler can be registered for a change in the value of that property without having to write any additional code to fire an event.

										Event Naming
											The name of a changed event that fires is of the form =Changed.[propertyName]=, where =propertyName= is the primary public name of the set-get property. For example, if you registered a set-get property named =value=, then a =Changed.value= event would fire each time this property is changed.

										Property Aliases
											If a set-get property has aliases, handlers can be registered for the property's changed event using any of the aliases. However, the name of the event when it fires will always be derived from the primary public name (ie. first in the alias list) of the property. So, for example, if a set-get property was registered with the public names =color= and =hexRgb=, both =Changed.color= and =Changed.hexRgb= would be treated as equivalent.

											EXAMPLE
											..........................................................
											function handleColorChange () {
												// do stuff
											}
											myColorWidget.wire ('Changed.color',handleColorChange);
											myColorWidget.unwire ('Changed.hexRgb',handleColorChange);
											..........................................................

											In this example, the =handleColorChange= function would not be executed when the value of the =color= set-get property changes, because =Changed.color= and =Changed.hexRgb= are treated as equivalent and therefore the =unwire= statement effectively removes the handler registered in the previous statement.

										Must Use the set Method
											The =Changed.[propertyName]= event will only fire for a particular set-get property if the value for that property is set using the =set= method, since it is within the =set= method that change detection occurs and the event is fired. If you simply assign a value by directly accessing the private name of the property, then the event will not fire.

										Only On Change, Not Every Set
											The =Changed.[propertyName]= event only fires for a particular set-get property when the value for that property is *changed* by using the =set= method. So, if the =set= method is called but the value that is specified is already the value of the property, then there will be no change and no event will be fired.

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
								Lets you set one or more of an instance's set-get properties.

								SYNTAX
								...............................
								myInstance.set (propertiesOBJ);
								...............................

								EXAMPLE
								.....................................
								myInstance.set (
									{
										property1Name:'property1Value',
										property2Name:'property2Value',
										property3Name:'property4Value'
									}
								);
								.....................................

								VARIATION 1
								......................................................
								myInstance.set (propertyNameSTR,propertyValueANYTYPE);
								......................................................

								A variation that accepts the two parameters =propertyNameSTR= and =propertyValueANYTYPE= makes it possible to use an expression or the value of a variable for specifying the name of the property to set. There is no appreciable difference in performance between using the =propertiesOBJ= form and the two parameter form when setting the value for a single set-get property, so the two parameter form is primarily a convenience for setting the value for a dynamically selected property.

								EXAMPLE
								...............................................................
								_classPrototype.increment = function (_propertyName,_amount) {
									this.set (_propertyName,this.get (_propertyName) + _amount);
								}
								...............................................................

								In the above example, a generic incrementer instance method is being implemented. It receives a =_propertyName= parameter that specifies the set-get property to increment, and it passes the value of this parameter as the first parameter in the call to the set method.

								VARIATION 2
								..........................................
								myInstance.set (
									property1NameSTR,property1ValueANYTYPE,
									property2NameSTR,property2ValueANYTYPE,
									...,
									propertyNNameSTR,propertyNValueANYTYPE
								);
								..........................................

								This variation allows values for an arbitrary number of set-get properties to be set in a single call to the =set= method, by specifying the names and values of the properties using an arbitrary number of name-value pair arguments, where even numbered arguments are property names and odd numbered arguments are property values. This variation makes it possible to use expressions or the values of variables for specifying the names of the properties to set.

								NOTES
								- see also the =get= instance method
								- see also the =Uize.Class.get= static method
								- see also the =Uize.Class.set= static method

						Static Methods
							Uize.Class.set
								Lets you set the initial value for one of the class's set-get properties.

								SYNTAX
								...............................
								Uize.Class.set (propertiesOBJ);
								...............................

								EXAMPLE
								.....................................
								Uize.Class.set (
									{
										property1Name:'property1Value',
										property2Name:'property2Value',
										property3Name:'property4Value'
									}
								);
								.....................................

								VARIATION 1
								......................................................
								Uize.Class.set (propertyNameSTR,propertyValueANYTYPE);
								......................................................

								A variation that accepts the two parameters =propertyNameSTR= and =propertyValueANYTYPE= makes it possible to use an expression or the value of a variable for specifying the name of the property to set. There is no appreciable difference in performance between using the =propertiesOBJ= form and the two parameter form when setting the value for a single set-get property, so the two parameter form is primarily a convenience for setting the value for a dynamically selected property.

								EXAMPLE
								...............................................................
								_class.increment = function (_propertyName,_amount) {
									this.set (_propertyName,this.get (_propertyName) + _amount);
								}
								...............................................................

								In the above example, a generic incrementer static method is being implemented. It receives a =_propertyName= parameter that specifies the set-get property to increment, and it passes the value of this parameter as the first parameter in the call to the set method.

								VARIATION 2
								..........................................
								Uize.Class.set (
									property1NameSTR,property1ValueANYTYPE,
									property2NameSTR,property2ValueANYTYPE,
									...,
									propertyNNameSTR,propertyNValueANYTYPE
								);
								..........................................

								This variation allows initial values for an arbitrary number of set-get properties to be set in a single call to the =set= method, by specifying the names and values of the properties using an arbitrary number of name-value pair arguments, where even numbered arguments are property names and odd numbered arguments are property values. This variation makes it possible to use expressions or the values of variables for specifying the names of the properties to set.

								NOTES
								- see also the =Uize.Class.get= static method
								- see also the =get= instance method
								- see also the =set= instance method

					*/
				};

				_class.toggle = _classPrototype.toggle = function (_propertyName) {
					var _value = !this.get (_propertyName);
					this.set (_propertyName,_value);
					return _value;
					/*?
						Instance Methods
							toggle
								Toggles the value of the specified boolean instance set-get property.

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
								Toggles the value of the specified boolean static set-get property.

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
				_globalEval ('if(typeof ' + _instanceId + '!=\'undefined\')' + _instanceId + '=null');
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

								The string returned by this method provides a summary that includes the instance's class name and the state of its set-get properties. Among other things, this method provides a convenient and lightweight way to gather information about instances of =Uize.Class= subclasses during debugging and troubleshooting. The =toString Intrinsic Method= is invoked automatically in certain contexts in order to convert an object to a string form, such as when alerting an object using the =alert= global function.

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
								parent : [class UizeDotCom.Page.Example]
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
								Returns the value of the instance's =value= set-get property.

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
								- if the instance's class does not register a =value= set-get property, then this method will return the value of the instance's =value= property, and if the instance has no =value= property, then this method will simply return =undefined=

						Static Methods
							Uize.Class.valueOf
								Returns the value of the class' =value= set-get property.

								SYNTAX
								.......................................
								classValueANYTYPE = MyClass.valueOf ();
								.......................................

								The =Uize.Class.valueOf= static intrinsic method is invoked automatically in certain contexts in order to convert a class to a value, such as when using a class reference in an expression (eg. =Uize.Widget.Bar.Slider + 0=). This static method is implemented primarily to provide parity with the =valueOf Intrinsic Method=. Its behavior is largely equivalent to that of the instance method, excepting that it applies to the static value of the =value= set-get property.

								NOTES
								- compare to the =toString Intrinsic Method=, and the =Uize.toString= static intrinsic method
								- see also the =valueOf Intrinsic Method=
								- if the class does not register a =value= set-get property, then this method will return the value of the class' =value= property, and if the class has no =value= property, then this method will simply return =undefined=
					*/
				}

				var
					_classPrototype = _class.prototype,
					_subclass = _noNew (
						function () {
							for (
								var _alphastructorNo = -1, _alphastructorsLength = _alphastructors.length, _alphastructor;
								++_alphastructorNo < _alphastructorsLength;
							)
								if (_alphastructor = _alphastructors [_alphastructorNo]) _alphastructor.apply (this,arguments)
							;
							for (
								var _omegastructorNo = -1, _omegastructorsLength = _omegastructors.length, _omegastructor;
								++_omegastructorNo < _omegastructorsLength;
							)
								if (_omegastructor = _omegastructors [_omegastructorNo]) _omegastructor.apply (this,arguments)
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
						_subclass.nonInheritableStatics = {nonInheritableStatics:1,toString:0,valueOf:0};
							/*?
								Static Properties
									Uize.Class.nonInheritableStatics
										A lookup object, automatically created for a class, in which you can register the static features (methods or properties) of the class that should *not* be inherited when that class is subclassed.

										Each property of the =Uize.Class.nonInheritableStatics= lookup object represents a single static feature of the class that should not be inherited by subclasses, where the name of each property should be the name of a static feature (excluding the module name), and the value of each property should be a truthy value (such as =true=, =1=, ='foo'=, =[]=, ={}=, etc.). After a class has been created, non-inheritable statics can be registered for that class by assigning properties to the class' =MyClass.nonInheritableStatics= static property, as shown in the example below...

										EXAMPLE
										...........................................................................
										MyClass = Uize.Class.subclass ();
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
						_alphastructors = _subclass._alphastructors =
							(_class._alphastructors || _sacredEmptyArray).concat (_alphastructor),
						_omegastructors = _subclass._omegastructors =
							(_class._omegastructors || _sacredEmptyArray).concat (_omegastructor)
					;

				_subclass._propertyProfilesByPrivateNames || (_subclass._propertyProfilesByPrivateNames = {});
				_subclass._propertyProfilesByPublicNames || (_subclass._propertyProfilesByPublicNames = {});

				return _subclass;
			};

			_class.subclass = function (_alphastructor,_omegastructor) {
				return _createSubclass (this,_alphastructor,_omegastructor);
				/*?
					Static Methods
						Uize.Class.subclass
							Lets you subclass the =Uize.Class= base class or any subclass of =Uize.Class=.

							SYNTAX
							......................................................
							MyClass = Uize.Class.subclass (subclassConstructorFN);
							......................................................

							Consider the following example...

							EXAMPLE
							.......................................
							MyClass = Uize.Class.subclass (
								function () {
									this.foo = 'How unoriginal!';
								}
							);

							MySubclass = MyClass.subclass (
								function () {
									this.bar = this.foo + ' Indeed!';
								}
							);
							.......................................

							In the above example, =MySubclass= is a subclass of =MyClass=, which is in turn a subclass of the =Uize.Class= base class. Now, when an instance of =MySubSubclass= gets created, the constructor of =MyClass= and then the constructor of =MySubSubclass= will be executed in the initialization of the instance, and the instance will have both =foo= and =bar= properties, where the =bar= property will have a value of "How unoriginal! Indeed!".
				*/
			};

		return _class;
	}
});

