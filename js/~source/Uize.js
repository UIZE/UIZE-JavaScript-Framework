/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize Base Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 10
	codeCompleteness: 100
	testCompleteness: 8
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize= class is the base class from which many of the classes in the UIZE JavaScript Framework inherit.

		*DEVELOPERS:* `Chris van Rensburg`
*/

(function () {
	/*** Variables for Scruncher Optimization ***/
		var
			_undefined,
			_typeString = 'string',
			_typeObject = 'object',
			_typeNumber = 'number',
			_typeBoolean = 'boolean',
			_Function = Function,
			_false = false,
			_true = true,
			_null = null
		;

	/*** Global Variables ***/
		var
			_uizeGuids = 0,
			_sacredEmptyArray = [],
			_sacredEmptyObject = {},
			_simpleTypesMap = {string:1,number:1,'boolean':1}, // boolean is a reserved word in Adobe's scripting world
			_modulePathToken = '[#modulePath]',
			_scriptParentNode
		;

	/*** Functions required by the Class Constructor ***/
		function _clone (_value) {
			/*** return early for null or undefined ***/
				if (_value == _undefined) return _value;

			/*** return early for simple type values or functions ***/
				var _typeofValue = typeof _value;
				if (
					_typeofValue == _typeString ||
					_typeofValue == _typeNumber ||
					_typeofValue == _typeBoolean ||
					_isFunction (_value)
						/* NOTES:
							- we don't clone functions, currently. There would be serious implications to switching this behavior, so if this capability is introduced, perhaps it should be switchable through a parameter that defaults to the non-cloning behavior.
						*/
				)
					return _value
				;

			var _constructor = _value.constructor;

			/*** clone instances of RegExp, Date, String, Number, Boolean ***/
				if (
					_constructor == RegExp ||
					_constructor == Date ||
					_constructor == String ||
					_constructor == Number ||
					_constructor == Boolean
				)
					return new _constructor (_value.valueOf ())
				;

			/*** for arrays and simple objects, iterate through and clone elements / properties ***/
				var
					_valueIsSimpleObject = _constructor == Object,
					_valueIsArray = !_valueIsSimpleObject && _isArray (_value)
				;
				if (_valueIsSimpleObject || _valueIsArray) {
					var
						_subValue, _typeofSubValue,
						_result = _valueIsSimpleObject ? {} : []
					;
					if (_valueIsArray) _result.length = _value.length;
						/* NOTE:
							length is not an enumerable property, and non-zero length unpopulated arrays (eg. new Array (20)) have no enumerable properties for elements, so we have to explicitly assign the length on the cloned result as a safeguard
						*/
					for (var _property in _value)
						/* NOTE:
							Yes, this check for simple type is redundant and we could just always call clone recursively, but we're trying to avoid recursion for performance reasons, and adding a little extra code helps out the typical cases very well.
						*/
						_result [_property] =
							(_typeofSubValue = typeof (_subValue = _value [_property])) == _typeString ||
							_typeofSubValue == _typeNumber ||
							_typeofSubValue == _typeBoolean ||
							_subValue == _undefined
								? _subValue
								: _clone (_subValue)
					;
					return _result;
				}

			return _value;
			/*?
				Static Methods
					Uize.clone
						Returns an identical clone of the specified source object.

						SYNTAX
						...............................................
						clonedObjectOBJ = Uize.clone (objectToCloneOJ);
						...............................................

						An object that is cloned from a source object using this method will not be conjoined to the source object.

						Spawning an exact copy of an object is not as simple as copying that object's properties over to a new object. That simple approach works fine if the source object is simple and only contains properties with simple string or number types. But, if the source object contains properties that are references to other objects, then the simple approach will give rise to a clone that is not 100% discrete from its source. So, subsequent manipulations within the depths of the clone's structure may be reflected in the source object. The =Uize.clone= method makes sure to recurse the structure of the source object and create identical new data objects within the clone that match those in the source.

						The =Uize.clone= method supports cloning values of the following types...

						- string (including instances of the =String= object)
						- boolean (including instances of the =Boolean= object)
						- number (including instances of the =Number= object, and the special values =NaN= and =Infinity=)
						- object (including the value =null=)
						- arrays (instances of the =Array= object)
						- instances of the =Date= object
						- instances of the =RegExp= object
						- undefined

						When you clone a value that is an instance of the =String=, =Boolean=, or =Number= objects, you get a new instance having the same value as the source - not a simple type of that value. For example, in JavaScript, =5= is not the same as =new Number (5)=. So, when you use =Uize.clone= to clone =new Number (5)=, you get a new =Number= instance with the value =5=.

						NOTES
						- The one exception to the conjoined rule is function references, which will be shared according to the current implementation.
			*/
		}

		/*** Intrinsic Method Implementations (troubleshooting aid) ***/
			function _toString () {
				function _getObjectTypeName (_object) {
					var
						_moduleName = _getClass (_object).moduleName,
						_isClass = _object.subclass
					;
					return (
						'[' +
							(
								_isInstance (_object) || (!_isClass && !_moduleName)
									? _typeObject
									: _isClass ? 'class' : 'package'
							) +
							' ' + (_moduleName || 'Function') +
						']'
					);
				}
				var _result = _getObjectTypeName (this);
				if (this.get) {
					var
						_properties = this.get (),
						_propertiesLines = []
					;
					for (var _propertyName in _properties) {
						var _propertyValue = _properties [_propertyName];
						_propertiesLines.push (
							_propertyName + ' : ' +
							(
								_propertyValue && (_isInstance (_propertyValue) || _isFunction (_propertyValue))
									? _getObjectTypeName (_propertyValue)
									: _propertyValue
							)
						);
					}
					_result += '\n\n' + _propertiesLines.sort ().join ('\n');
				}
				return _result;
				/*?
					Instance Methods
						toString Intrinsic Method
							Returns a string, providing summary info for the instance on which the method is called.

							SYNTAX
							............................................
							instanceSummarySTR = myInstance.toString ();
							............................................

							The string returned by this method provides a summary that includes the instance's class name and the state of its set-get properties. Among other things, this method provides a convenient and lightweight way to gather information about instances of =Uize= subclasses during debugging and troubleshooting. The =toString Intrinsic Method= is invoked automatically in certain contexts in order to convert an object to a string form, such as when alerting an object using the =alert= global function.

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

							In certain contexts, providing a reference to a =Uize= subclass instance as a parameter to some method will result in the =valueOf Intrinsic Method= of that instance being invoked in order to coerce it to a simple value. If it is your desire to have the instance summary be used rather than the instance's value, then you should explicitly call the =toString Intrinsic Method=, as follows...

							EXAMPLE
							........................................................................................
							Uize.Node.setInnerHtml ('sliderWidgetSummaryForDebug',page.children.slider.toString ());
							Uize.Node.setInnerHtml ('sliderWidgetCurrentValue',page.children.slider);
							........................................................................................

							In this example, the =sliderWidgetSummaryForDebug= node will contain the summary info for the instance, while the =sliderWidgetCurrentValue= node will just show the slider widget's current value.

							NOTES
							- compare to the =valueOf Intrinsic Method=, and the =Uize.valueOf= static intrinsic method
							- see also the =Uize.toString= static intrinsic method

					Static Methods
						Uize.toString
							Returns a string, providing summary info for the class on which the method is called.

							SYNTAX
							......................................
							classSummarySTR = MyClass.toString ();
							......................................

							The string returned by this method provides a summary that includes the class' name and the state of its set-get properties. Among other things, this method provides a convenient and lightweight way to gather information about =Uize= subclasses during debugging and troubleshooting. The =Uize.toString= static intrinsic method is invoked automatically in certain contexts in order to convert a class reference to a string form, such as when alerting a class using the =alert= global function.

							EXAMPLE
							...................................
							alert (page.children.slider.Class);
							...................................

							In the above example, if the =page= widget has a =slider= child widget that is an instance of the class =Uize.Widget.Bar.Slider=, then the output of the =alert= statement could look something like...

							EXAMPLE OUTPUT
							..................................
							[class Uize.Widget.Bar.Slider]

							built : true
							busy : inherit
							busyInherited : false
							confirm : undefined
							container : undefined
							decimalPlacesToDisplay : undefined
							enabled : inherit
							enabledInherited : true
							html : undefined
							idPrefix : undefined
							idPrefixConstruction : undefined
							inDrag : false
							increments : 1
							inform : undefined
							insertionMode: undefined
							localized : undefined
							maxValidValue : undefined
							maxValue : 100
							minValidValue : undefined
							minValue : 0
							name : undefined
							nodeMap : undefined
							orientation : vertical
							parent : undefined
							restTime : 250
							scaleFunc : [object Function]
							value : 0
							valueFunc : [object Function]
							wired : false
							..................................

							In certain contexts, providing a reference to a =Uize= subclass as a parameter to some method will result in the =Uize.valueOf= static intrinsic method of that class being invoked in order to coerce it to a simple value. If it is your desire to have the class summary be used rather than the class' value, then you should explicitly call the =Uize.toString= static intrinsic method, as follows...

							EXAMPLE
							.......................................................................................
							Uize.Node.setInnerHtml ('classSummaryForDebug',page.children.slider.Class.toString ());
							Uize.Node.setInnerHtml ('classCurrentValue',page.children.slider.Class);
							.......................................................................................

							In this example, the =classSummaryForDebug= node will contain the summary info for the =Uize.Widget.Bar.Slider= class, while the =classCurrentValue= node will just show the class' current value.

							NOTES
							- compare to the =valueOf Intrinsic Method=, and the =Uize.valueOf= static intrinsic method
							- see also the =toString Intrinsic Method=
				*/
			}

			function _valueOf () {
				return this [_getPropertyPrivateName (this,'value')];
				/*?
					Instance Methods
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

							In the above example, the page widget has a slider child widget that is an instance of the class =Uize.Widget.Bar.Slider= and that lets the user choose a markup percentage between =0= and =100=. In the above expression, the slider widget is being divided by 100. Rather than giving you a hundred *really* tiny slider widgets (not all that useful), JavaScript automatically invokes the =valueOf Intrinsic Method=. The =Uize= implementation of this instance method results in the slider's current value being returned so that it can then be used in the expression.

							The following three statements are equivalent...

							....................................................................................
							markedUpPrice = price * (1 + page.children.markupPercentSlider.get ('value') / 100);
							markedUpPrice = price * (1 + page.children.markupPercentSlider.valueOf () / 100);
							markedUpPrice = price * (1 + page.children.markupPercentSlider / 100);
							....................................................................................

							In certain contexts, providing a reference to a =Uize= subclass instance as a parameter to some method will result in the =toString Intrinsic Method= of that instance being invoked in order to resolve it to a string value. If it is your desire to have the value used rather than the instance summary, then you should explicitly call the =valueOf Intrinsic Method=, as follows...

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
							- see also the =Uize.valueOf= static intrinsic method
							- if the instance's class does not register a =value= set-get property, then this method will return the value of the instance's =value= property, and if the instance has no =value= property, then this method will simply return =undefined=

					Static Methods
						Uize.valueOf
							Returns the value of the class' =value= set-get property.

							SYNTAX
							.......................................
							classValueANYTYPE = MyClass.valueOf ();
							.......................................

							The =Uize.valueOf= static intrinsic method is invoked automatically in certain contexts in order to convert a class to a value, such as when using a class reference in an expression (eg. =Uize.Widget.Bar.Slider + 0=). This static method is implemented primarily to provide parity with the =valueOf Intrinsic Method=. Its behavior is largely equivalent to that of the instance method, excepting that it applies to the static value of the =value= set-get property.

							NOTES
							- compare to the =toString Intrinsic Method=, and the =Uize.toString= static intrinsic method
							- see also the =valueOf Intrinsic Method=
							- if the class does not register a =value= set-get property, then this method will return the value of the class' =value= property, and if the class has no =value= property, then this method will simply return =undefined=
				*/
			}

	/*** Class Constructor ***/
		var
			_class = Uize = _createSubclass (
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

											In the above example, we see a segment of the implementation for a =Uize= subclass named =MyClass=. The =insertButton= instance method is writing HTML into the document, and the =input= tag that is created has an =onclick= attribute that registers an event handler that will execute the =click= method of that instance when clicked. That's because the global identifier by the name stored in the =instanceId= property is a reference to the instance.

											NOTES
											- the =instanceId= property's value is guaranteed to be unique for all instances of all =Uize= subclasses in a document, but not across frames in a frameset, or across multiple pages in a Web site
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

	/*** Utility Functions ***/
		function _getClass (_instanceOrClass) {return _instanceOrClass.Class || _instanceOrClass}

	/*** Module Loading Mechanism ***/
		var
			_moduleLoadHandlers = {},
			_modulesByName = {Uize:_class}
		;

		function _getModuleByName (_moduleName) {
			var _module;
			return (
				_modulesByName [_moduleName] ||
				(_moduleName == '*' && _modulesByName) ||
				(
					(_module = (new _Function ('try {return ' + _moduleName + '} catch (e) {}')) ()) &&
					(_modulesByName [_moduleName] = _module)
				)
			);
		}

		function _handleModuleLoaded (_module) {
			var _loadHandlers = _moduleLoadHandlers [_module];
			if (_loadHandlers) {
				for (
					var _loadHandlerNo = -1, _loadHandlersLength = _loadHandlers.length;
					++_loadHandlerNo < _loadHandlersLength;
				)
					_loadHandlers [_loadHandlerNo] ()
				;
				delete _moduleLoadHandlers [_module];
			}
		}

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
												? new _Function (_handler)
												: function (_event) {_handler.fire (_event)},
									_originalHandler:_handler
								}
							);
						}
					);
				} else if (typeof _eventNameOrEventsMap == _typeObject && _eventNameOrEventsMap) {
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

							Event handlers registered using this method will handle events fired for the instance using the =fire= instance method, and not those events fired using the =Uize.fire= static method. A =Uize= subclass may not provide any instance events, so you should consult the reference documentation for a class to learn more about its suite of events. Handlers specified by the =eventHandlerSTRorFNorOBJ= parameter may be of string, function, or object type.

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
							- compare to the =Uize.fire=, =Uize.wire=, and =Uize.unwire= static methods

					Static Methods
						Uize.wire
							Lets you wire a handler for a static event of the class, or handlers for multiple static events.

							SYNTAX
							.....................................................
							MyClass.wire (eventNameSTR,eventHandlerSTRorFNorOBJ);
							.....................................................

							Event handlers registered using this method will handle events fired for the class using the =Uize.fire= static method, and not those events fired using the =fire= instance method. A =Uize= subclass may not provide any static events, so you should consult the reference documentation for a class to learn more about its suite of events. Handlers specified by the =eventHandlerSTRorFNorOBJ= parameter may be of string, function, or object type.

							VARIATION
							..........................................
							MyClass.wire (eventNamesToHandlersMapOBJ);
							..........................................

							When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =Uize.wire= static method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

							SPECIAL VALUES
							- the string value ="*"= acts as a wildcard when specified for the =eventNameSTR= parameter, meaning that the specified handler should be executed for all events of the class

							NOTES
							- see the related =Uize.fire= and =Uize.unwire= static methods
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
								When a reference to a =Uize= subclass or an instance of a =Uize= subclass is specified for the =eventHandlerSTRorFNorOBJ= parameter, then the event for which the handler is registered will be fired on that instance or class.

								This facility provides a means for "relaying" instance or class events to another instance or class.

								EXAMPLE
								.....................................................
								myWidget.children.someButton.wire ('Click',myWidget);
								.....................................................

								In the above example, a handler is being registered for the ='Click'= event of a button (an instance of the =Uize.Widget.Button= class) that is a child widget of =myWidget=. By specifying =myWidget= as the handler for the =Click= event, that event will get relayed to =myWidget=. This means that other code can now register handlers on the =Click= event for =myWidget=, and those handlers will handle the =Click= event being relayed from the button widget.

								Object handlers added in this way can be removed by using the =unwire= instance method and the =Uize.unwire= static method, just as with any other type of handler, as in...

								.......................................................
								myWidget.children.someButton.unwire ('Click',myWidget);
								.......................................................

							Value for Removing Must Match Value Used for Adding
								However a handler is specified when wiring an event, that is how it must be specified in order to unwire the event.

								If you specified a function reference as the handler when wiring an event, then you must specify that same, identical function reference in order to unwire that event. If you specified a code string as the handler, then you must specify the exact same code string in order to unwire that event. If you specified a reference to a =Uize= subclass or an instance of a =Uize= subclass as the handler when wiring an event, then you must specify the exact same object reference in order to unwire the event.

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
				if (_event.bubble && _this.Class && _this.parent) {
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
							- compare to the =Uize.fire=, =Uize.wire=, and =Uize.unwire= static methods

					Static Methods
						Uize.fire
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
							- see the related =Uize.wire= and =Uize.unwire= static methods
							- compare to the =fire=, =wire=, and =unwire= instance methods
				*/
			};

			_class.unwire = _classPrototype.unwire = function (_eventNameOrEventsMap,_handler) {
				var _this = this;
				if (typeof _eventNameOrEventsMap == _typeObject && _eventNameOrEventsMap) {
					for (var _eventName in _eventNameOrEventsMap)
						_this.unwire (_eventName,_eventNameOrEventsMap [_eventName])
					;
				} else {
					_this._abstractEventName (
						_eventNameOrEventsMap,
						function (_eventName) {
							var _eventHandlers = _this._eventHandlers;
							if (_eventHandlers) {
								var _handlersForEventName = _eventHandlers [_eventName];
								if (_handlersForEventName) {
									if (_handler) {
										/* TO DO:
											this is a candidate for factoring out as a generally useful array manipulation method: removeAllOfValue
										*/
										var _handlerNo = 0;
										while (_handlerNo < _handlersForEventName.length) {
											_handlersForEventName [_handlerNo]._originalHandler == _handler
												? _handlersForEventName.splice (_handlerNo,1)
												: _handlerNo++
											;
										}
									}
									(_handler && _handlersForEventName.length) || delete _eventHandlers [_eventName];
								}
							}
						}
					);
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
							- compare to the =Uize.fire=, =Uize.wire=, and =Uize.unwire= static methods

					Static Methods
						Uize.unwire
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

							When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =Uize.unwire= static method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

							NOTES
							- see the related =Uize.fire= and =Uize.wire= static methods
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
								/* NOTE:
									can't use _class as identifier name here, since we still want to be able to use the global _class for accessing static methods inside this method
								*/
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

							SYNTAX
							........................................................
							propertyValueANYTYPE = myInstance.get (propertyNameSTR);
							........................................................

							VARIATIONS
							........................................................
							propertyValuesOBJ = myInstance.get (propertyNamesARRAY);
							........................................................

							When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the instance set-get properties specified in the array will be populated into an object and returned. So, for example =mySlider.get (['minValue','maxValue','value'])= would return a result like ={minValue:0,maxValue:100,value:57}=.

							.........................................
							allPropertyValuesOBJ = myInstance.get ();
							.........................................

							When no parameter is specified, the =get= instance method will return an object containing values for all the set-get properties of the instance. For one thing, this variation makes it easy to create a new instance of a class with the same state as an existing instance.

							EXAMPLE
							.............................................
							copyOfMyFade = new Uize.Fade (myFade.get ());
							.............................................

							In this example, an instance of the class =Uize.Fade= is being created by passing the constructor all the set-get property values obtained from the =myFade= instance using the =get= method. The new instance created will then have the same state as the =myFade= instance.

							NOTES
							- see also the =set= instance method
							- see also the =Uize.get= and =Uize.set= static methods

					Static Methods
						Uize.get
							Lets you query the initial value for one of the class's set-get properties.

							SYNTAX
							..................................................
							propertyValueANYTYPE = Uize.get (propertyNameSTR);
							..................................................

							VARIATIONS
							..................................................
							propertyValuesOBJ = Uize.get (propertyNamesARRAY);
							..................................................

							When a =propertyNamesARRAY= parameter is specified in place of the =propertyNameSTR= parameter, the values for the class set-get properties specified in the array will be populated into an object and returned. So, for example =Uize.Widget.get (['enabled','busy','built'])= would return a result like ={enabled:'inherit',busy:'inherit',built:true}=.

							...................................
							allPropertyValuesOBJ = Uize.get ();
							...................................

							When no parameter is specified, the =Uize.get= static method will return an object containing values for all the registered set-get properties of the class.

							NOTES
							- see also the =Uize.set= static method
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
						_propertyDataIsObject = typeof _propertyData == _typeObject,
						_propertyPublicName =
							(_propertyDataIsObject ? _propertyData.name : _propertyData) || _propertyPrivateName,
						_propertyPrimaryPublicName = _propertyPublicName,
						_propertyProfile = _propertyProfilesByPrivateNames [_propertyPrivateName] = {_privateName:_propertyPrivateName}
					;
					if (_propertyPublicName.indexOf ('|') > -1) {
						var _pseudonyms = _propertyPublicName.split ('|');
						_propertyPrimaryPublicName = _pseudonyms [0];
						for (var _pseudonymNo = -1; ++_pseudonymNo < _pseudonyms.length;)
							_propertyProfilesByPublicNames [_pseudonyms [_pseudonymNo]] = _propertyProfile
						;
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
						Uize.registerProperties
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
					Yes, there are functions _isInstance, _getClass, and _getPropertyPrivateName that could be used (and were at one point), but this code needs to be tuned for performance since set is a touch point in so many places.
				*/
				if (arguments.length == 2)
					/* NOTE:
						- support for set (propertyName,propertyValue)
						- in this form, _properties is actually the property name, and the second argument is the value to set
					*/
					_properties = _pairUp (_properties,arguments [1])
				;
				var
					_this = this,
					_isInstance = !!_this.Class,
					_class = _this.Class || _this,
					_propertyProfilesByPublicNames = _class._propertyProfilesByPublicNames,
					_propertyProfilesByPrivateNames = _class._propertyProfilesByPrivateNames,
					_propertyProfile,
					_onChangeHandlers,
					_onChangeHandlerAddedFlagName,
					_onChangeHandler,
					_hasChangedHandlers = _isInstance && _this._hasChangedHandlers,
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

						if (_isInstance)
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
							if (_isInstance) {
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
											for (
												var _handlerNo = -1, _onChangeHandlerLength = _onChangeHandler.length;
												++_handlerNo < _onChangeHandlerLength;
											)
												_processOnChangeHandler (_onChangeHandler [_handlerNo])
											;
										}
									}
									_propertyProfile._onChange && _processOnChangeHandler (_propertyProfile._onChange);
							}
							_this [_propertyPrivateName] = _propertyValue;
						}
					} else {
						_this [_propertyPublicOrPrivateName] = _propertyValue;
						(_propertiesToRegister || (_propertiesToRegister = {})) [_propertyPublicOrPrivateName] =
							_propertyPublicOrPrivateName
						;
					}
				}
				_propertiesToRegister && _class.registerProperties (_propertiesToRegister);
				if (_isInstance) {
					if (_onChangeHandlers) {
						for (
							var _handlerNo = -1, _onChangeHandlersLength = _onChangeHandlers.length;
							++_handlerNo < _onChangeHandlersLength;
						) {
							var _onChangeHandler = _onChangeHandlers [_handlerNo];
							delete _onChangeHandler [_onChangeHandlerAddedFlagName];
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
									The =Uize= base class implements a generalized mechanism for firing events when the values of set-get properties are changed.

									This means that for any set-get property that is registered through the =Uize.registerProperties= static method, a handler can be registered for a change in the value of that property without having to write any additional code to fire an event.

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

							VARIATION
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

							NOTES
							- see also the =get= instance method
							- see also the =Uize.get= static method
							- see also the =Uize.set= static method

					Static Methods
						Uize.set
							Lets you set the initial value for one of the class's set-get properties.

							SYNTAX
							.........................
							Uize.set (propertiesOBJ);
							.........................

							EXAMPLE
							.....................................
							Uize.set (
								{
									property1Name:'property1Value',
									property2Name:'property2Value',
									property3Name:'property4Value'
								}
							);
							.....................................

							VARIATION
							................................................
							Uize.set (propertyNameSTR,propertyValueANYTYPE);
							................................................

							A variation that accepts the two parameters =propertyNameSTR= and =propertyValueANYTYPE= makes it possible to use an expression or the value of a variable for specifying the name of the property to set. There is no appreciable difference in performance between using the =propertiesOBJ= form and the two parameter form when setting the value for a single set-get property, so the two parameter form is primarily a convenience for setting the value for a dynamically selected property.

							EXAMPLE
							...............................................................
							_class.increment = function (_propertyName,_amount) {
								this.set (_propertyName,this.get (_propertyName) + _amount);
							}
							...............................................................

							In the above example, a generic incrementer static method is being implemented. It receives a =_propertyName= parameter that specifies the set-get property to increment, and it passes the value of this parameter as the first parameter in the call to the set method.

							NOTES
							- see also the =Uize.get= static method
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
						Uize.toggle
							Toggles the value of the specified boolean static set-get property.

							SYNTAX
							.................................................
							toggledValueBOOL = Uize.toggle (propertyNameSTR);
							.................................................

							The =Uize.toggle= static method is provided purely as a convenience. The following two statements are equivalent...

							.................................................
							Uize.toggle ('myProperty');
							Uize.set ({myProperty:!Uize.get ('myProperty')});
							.................................................

							As you can see, using the =Uize.toggle= method produces more concise code.
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

	/*** Public Static Methods ***/
		_class.capFirstChar = function (_sourceStr) {
			return _sourceStr.charAt (0).toUpperCase () + _sourceStr.slice (1);
			/*?
				Static Methods
					Uize.capFirstChar
						Returns a string, that is the specified source string with its first letter capitalized.

						SYNTAX
						........................................................
						firstCharCapitalizedSTR = Uize.capFirstChar (sourceSTR);
						........................................................

						Using this method on the value ='width'= would produce the result ='Width'=. This method is useful when concatenating one string to another, and where it is desirable for the new concatenated string to be camelCase. Consider the following example...

						EXAMPLE
						.................................................................
						_classPrototype.displayPropertyValue = function (_propertyName) {
							this.setNodeValue (
								'valueOf' + Uize.capFirstChar (_propertyName),
								this.get (_propertyName)
							);
						};
						.................................................................

						In the above example, the instance method =displayPropertyValue= is being defined for a hypothetical widget class. This method accepts a string parameter, being the name of a set-get property whose value should be displayed in the page in an implied node of the widget, and where the implied node's name is constructed from the prefix ='valueOf'= and the name of the set-get property with its first letter capitalized. Using this method to display the value of a =width= set-get property, the value of this property would be displayed in the implied node named =valueOfWidth=.

						NOTES
						- this method is implemented in the =Uize= base class rather than the =Uize.String= module because it is generally useful in many other modules and =Uize= subclasses that don't otherwise want to require the entire =Uize.String= module
						- if the first character of the source string is already capitalized, then the returned value will be the same as the source string
			*/
		};
		_classNonInheritableStatics.capFirstChar = 1;

		_class.clone = _clone;
		_classNonInheritableStatics.clone = 1;

		_class.constrain = function (_value,_limitA,_limitB) {
			/* NOTES:
				- deliberately not using Math.max and Math.min (to avoid function calls, for performance)
				- deliberately not factored out (for performance, and doesn't save that much code size, anyway)
			*/
			return (
				_limitA < _limitB
					? (_value < _limitA ? _limitA : _value > _limitB ? _limitB : _value)
					: (_value < _limitB ? _limitB : _value > _limitA ? _limitA : _value)
			);
			/*?
				Static Methods
					Uize.constrain
						Returns a number, being the result of constraining the specified number within the specified lower and upper limits.

						SYNTAX
						............................................................................
						constrainedValueNUM = Uize.constrain (valueNUM,lowerLimitNUM,upperLimitNUM);
						............................................................................

						It is acceptable for the value of the =lowerLimitNUM= parameter to be greater than the value of the =upperLimitNUM= parameter, and the value of the =valueNUM= parameter will still be constrained within the specified range - even if the lower and upper limits are swapped. So, for example, the statement =Uize.constrain (percent,0,100)= would be equivalent to =Uize.constrain (percent,100,0)=.

						TIP

						While there is no dedicated method to test whether a number falls within a given range, you can accomplish that pretty easily using the =Uize.constrain= method, by testing whether or not the constrained value is the same as the original, as in...

						........................................................................
						if (valueToTest != Uize.constrain (valueToTest,lowerLimit,upperLimit)) {
							// handle case of valueToTest being outside of valid range
						}
						........................................................................
			*/
		};
		_classNonInheritableStatics.constrain = 1;

		var _copyInto = _class.copyInto = function (_targetObject,_sourceObject) {
			if (typeof _sourceObject == _typeObject && _sourceObject) {
				for (var _propertyName in _sourceObject)
					_targetObject [_propertyName] = _sourceObject [_propertyName]
				;
			}
			if (arguments.length > 2) {
				for (var _sourceObjectNo = 0; ++_sourceObjectNo < arguments.length;) {
					if (typeof (_sourceObject = arguments [_sourceObjectNo]) == _typeObject && _sourceObject) {
						for (var _propertyName in _sourceObject)
							_targetObject [_propertyName] = _sourceObject [_propertyName]
						;
					}
				}
			}
			return _targetObject;
			/*?
				Static Methods
					Uize.copyInto
						Lets you copy properties into a target object from a source object.

						SYNTAX
						..............................................................
						referenceToTargetOBJ = MyClass.copyInto (targetOBJ,sourceOBJ);
						..............................................................

						After the property values from =sourceOBJ= have been copied into =targetOBJ=, a reference to =targetOBJ= is returned as the result of the method. This behavior is provided as a convenience, so that this method can be used in larger expressions where the copy is done in place and then the modified target object can be used further (similar in spirit to the in-place increment operator).

						EXAMPLE
						.............................................
						var
							targetObject = {
								foo:'How unoriginal!'
							},
							sourceObject = {
								bar:'Indeed!'
							}
						;

						MyClass.copyInto (targetObject,sourceObject);
						.............................................

						In the above example, after the code has been executed, =targetObject= will have both =foo= and =bar= properties while =sourceObject= will remain unchanged.

						Of course, the JavaScript language allows in-place creation of anonymous objects using what's termed the "literal syntax", so you could also add properties to an object as shown in the example below...

						................................................
						var targetObject = {
							foo:'How unoriginal!'
						};

						MyClass.copyInto (targetObject,{bar:'Indeed!'});
						................................................

						VARIATION
						..............................................................................
						referenceToTargetOBJ = MyClass.copyInto (targetOBJ,source1OBJ,source2OBJ,...);
						..............................................................................

						The =Uize.copyInto= static method accepts an arbitrary number of parameters, so you can conveniently copy more than one source object into the target object.

						All parameters after the =targetOBJ= parameter that are objects will have their properties copied into the target object, in the order in which those parameters appear in the arguments list (ie. left to right), so properties from source objects earlier in the list will be overwritten by values for those same properties from source objects later in the list.

						EXAMPLE
						.........................................................
						var
							targetObject = {},
							sourceObject1 = {foo:'bar',hi:1},
							sourceObject2 = {bye:1,foo:'BAR'}
						;
						Uize.copyInto (targetObject,sourceObject1,sourceObject2);
						.........................................................

						In the above example, the =targetObject= variable will be an object with the contents ={foo:'BAR',hi:1,bye:1}=.

						NOTES
						- Source object parameters whose values are not objects will simply not be copied into the target object. This is a useful behavior, as it allows one to mix conditional copies into a single call to =Uize.copyInto= by using the ternary operator to select between a source object and the value =null=.
			*/
		};
		_classNonInheritableStatics.copyInto = 1;

		_class.callOn = function (_object,_method,_arguments) {
			if (!_object) return;
			_arguments || (_arguments = _sacredEmptyArray);
			var
				_methodIsString = typeof _method == _typeString,
				_methodIsFunction = !_methodIsString && _isFunction (_method)
			;
			function _callOn (_object) {
				if (_object && typeof _object == _typeObject) {
					if (_isArray (_object)) {
						for (var _subObjectNo = -1, _totalSubObjects = _object.length; ++_subObjectNo < _totalSubObjects;)
							_callOn (_object [_subObjectNo])
						;
					} else {
						var _methodIsStringAndIsInObject = _methodIsString && _isFunction (_object [_method]);
						if (_isInstance (_object) || _methodIsStringAndIsInObject) {
							if (_methodIsFunction || _methodIsStringAndIsInObject)
								(_methodIsFunction ? _method : _object [_method]).apply (_object,_arguments)
							;
						} else {
							for (var _subObjectName in _object)
								_callOn (_object [_subObjectName])
							;
						}
					}
				}
			}
			_callOn (_object);
			/*?
				Static Methods
					Uize.callOn
						Recurses through the arbitrarily complex object specified, calling the specified method on all values that are instances of =Uize= subclasses, or that are objects that have a property whose name matches the method name specified and whose value is a function.

						This sounds like a mouthfull, but in a nutshell it allows the following kinds of things...
						- specifying a function that should be called as a method on a specified set of instances
						- specifying the name of a method that should be called on a specified set of instances

						SYNTAX
						................................................
						Uize.callOn (objectSetARRAYorOBJ,methodSTRorFN);
						................................................

						EXAMPLE
						................................................................................
						function myPhantomMethod () {
							// do stuff
						}

						Uize.callOn (
							[instance1,instance2,instance3,instance4,instance5,instance6],myPhantomMethod
						);
						................................................................................

						The above statement would be equivalent to...
						.................................
						function myPhantomMethod () {
							// do stuff
						}

						myPhantomMethod.call (instance1);
						myPhantomMethod.call (instance2);
						myPhantomMethod.call (instance3);
						myPhantomMethod.call (instance4);
						myPhantomMethod.call (instance5);
						myPhantomMethod.call (instance6);
						.................................

						This method is most compelling when an object or array contains a dynamic set of instances on which a specific method needs to be called, or on which a specified function needs to be called as a method.

						VARIATION 1
						...............................................................
						Uize.callOn (objectSetARRAYorOBJ,methodSTRorFN,argumentsARRAY);
						...............................................................

						When the optional =argumentsARRAY= parameter is specified, this set of arguments will be passed when calling the specified method on each of the objects in the set.

						EXAMPLE
						........................................................................................
						Uize.callOn (
							[instance1,instance2,instance3,instance4,instance5,instance6],'set',[{enabled:false}]
						);
						........................................................................................

						The above statement would be equivalent to...
						................................
						instance1.set ({enabled:false});
						instance2.set ({enabled:false});
						instance3.set ({enabled:false});
						instance4.set ({enabled:false});
						instance5.set ({enabled:false});
						instance6.set ({enabled:false});
						................................

						VARIATION 2
						........................................
						Uize.callOn (instanceOBJ,methodSTRorFN);
						........................................

						When the =instanceOBJ= parameter is specified in place of the =objectSetARRAYorOBJ= parameter, and when the value of the =instanceOBJ= parameter is an instance of a =Uize= subclass, then the specified method will be called on that instance. If the value of =instanceOBJ= is =null= or =undefined=, then no action will be taken. This is a convenient way to conditionally call a method on an object reference that may be null, when you might otherwise capture a local variable in order to avoid deep dereferencing twice.

						INSTEAD OF...
						............................................................
						if (page.children.possiblyNonExistentChildWidget) {
							page.children.possiblyNonExistentChildWidget.insertUi ();
						}
						............................................................

						OR...
						...............................................................
						var childWidget = page.children.possiblyNonExistentChildWidget;
						if (childWidget) childWidget.insertUi ();
						...............................................................

						USE...
						......................................................................
						Uize.callOn (page.children.possiblyNonExistentChildWidget,'insertUi');
						......................................................................
			*/
		};
		_classNonInheritableStatics.callOn = 1;

		_class.defaultNull = function (_value,_default) {
			return _value != _undefined ? _value : _default;
			/*?
				Static Methods
					Uize.defaultNull
						SYNTAX
						.......................................................................
						defaultedValueANYTYPE = Uize.defaultNull (valueANYTYPE,defaultANYTYPE);
						.......................................................................
			*/
		};
		_classNonInheritableStatics.defaultNull = 1;

		_class.getModuleByName = _getModuleByName;
			/*?
				Static Methods
					Uize.getModuleByName
						Returns an object reference, being a reference to the module of the specified name, or returns the value =undefined= if no such module is defined.

						SYNTAX
						.................................................
						moduleOBJ = Uize.getModuleByName (moduleNameSTR);
						.................................................

						EXAMPLE
						........................................................................................
						alert (Uize.Widget == Uize.getModuleByName ('Uize.Widget');  // displays the text "true"
						........................................................................................

						In the above example, sssuming that the =Uize.Widget= module is loaded at the time that the code is executed, the =alert= statement will display the text "true".

						Graceful Failure
							The =Uize.getModuleByName= method is designed to always fail silently when a specified module is not defined.

							Take the example of a module with the name =MyNamespace.MyClass.MySubclass=. Such a module may not be defined because either =MyNamespace=, =MyNamespace.MyClass=, or =MyNamespace.MyClass.MySubclass= is not defined. Now, normally when you try to dereference =MyNamespace.MyClass.MySubclass= and =MyNamespace= is not defined, you'll get a runtime error. The =Uize.getModuleByName= method handles this and makes it always safe to resolve modules names to modules. In cases where a module path is not defined at some level, the method will simply return the value =undefined=.

						VARIATION
						..............................................
						modulesByNameOBJ = Uize.getModuleByName ('*');
						..............................................

						When the special value ='*'= (wildcard character) is specified for the =moduleNameSTR= parameter, then the =Uize.getModuleByName= method returns an object that serves as a lookup table for all the modules that have been built, where each property's name is the name of a module and each property's value is a reference to the module.

						Module name to module reference mappings are added to the object in the order in which the modules are built. Therefore, if you write a =for...in= loop to iterate through the properties of the object, then you can build up an array of the names of the modules that have been built, in the correct dependency order. And if you execute such code in a Web page, then you can build up a list of all the modules that were built for that page. If the page only loads in a few modules using =script= tags that are in the page's initial HTML, then the list resulting from executing your code will give an indication of how many additional modules were loaded in dynamically by the module loader mechanism. The list of all the modules built on a page can be used as the basis for creating a JavaScript library file (see [[../explainers/javascript-libraries.html][JavaScript Libraries]]).

						EXAMPLE
						..............................................
						var
							modulesByName = Uize.getModuleByName ('*'),
							modulesBuilt = []
						;
						for (var moduleName in modulesByName) {
							modulesBuilt.push (moduleName)
						}
						..............................................

						After the above code has been executed, the =modulesBuilt= array will contain the names of all the modules that have been built, listed in the order in which they were built.
			*/
		_classNonInheritableStatics.getModuleByName = 1;

		_class.indexIn = function (_array,_value,_fromEnd,_strict) {
			if (_isArray (_array)) {
				_strict = _strict !== _false;
				for (var _lastIndex = _array.length - 1, _elementNo = _lastIndex + 1, _result; --_elementNo >= 0;) {
					var _element = _array [_result = _fromEnd ? _elementNo : _lastIndex - _elementNo];
					if (_strict ? _element === _value : _element == _value)
						return _result
					;
				}
			}
			return -1;
			/*?
				Static Methods
					Uize.indexIn
						Returns an integer, indicating the index in the specified array of the first occurrence of the specified value. If the value is not found in the array, then this method will return the value =-1=.

						SYNTAX
						...................................................
						indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE);
						...................................................

						VARIATION
						...............................................................
						indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE,fromEndBOOL);
						...............................................................

						By default, this method searches for the specified value by scanning forwards through the array from the beginning. When the value =true= is specified for the optional =fromEndBOOL= parameter, then this method will search for the specified value by scanning backwards through the array from the end.

						EXAMPLE
						..............................................................................
						Uize.indexIn (['foo','bar','foo','bar','foo','bar'],'bar');       // returns 1
						Uize.indexIn (['foo','bar','foo','bar','foo','bar'],'bar',true);  // returns 5
						..............................................................................

						VARIATION
						..................................................................................
						indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE,fromEndBOOL,strictEqualityBOOL);
						..................................................................................

						By default, this method tests for a match using strict equality. When the value =false= is specified for the optional =strictEqualityBOOL= parameter, then this method will test for a match using loose equality (ie. where the string value ='1'= would be considered equal to the number value =1=).

						EXAMPLE
						............................................................
						Uize.indexIn ([0,1,2,3,4,5],'3');              // returns -1
						Uize.indexIn ([0,1,2,3,4,5],'3',false,false);  // returns 3
						............................................................

						NOTES
						- see also the related =Uize.isIn= static method
			*/
		};
		_classNonInheritableStatics.indexIn = 1;

		var _isArray = _class.isArray = function (_object) {
			return _object instanceof Array || (!!_object && _isFunction (_object.splice));
			/*?
				Static Methods
					Uize.isArray
						Returns a boolean, indicating whether or not the specified value is an instance of the JavaScript Array class.

						SYNTAX
						..........................................
						isArrayBOOL = Uize.isArray (valueANYTYPE);
						..........................................

						This method is a useful abstraction to deal with the fact that the =instanceof Array= test fails on arrays that are passed across frames, iframes, or windows. The method returns =true= if the =instanceof Array= test passes, or if the specified value is an object and has a property named =splice= that is a function (the =splice= method is unique to arrays and its name is unique enough that the likelihood of an object having this property and it being a function is quite low).

						NOTES
						- an object having a property named =splice= whose value is of type =function= will be regarded as an array by this method
						- see the related =Uize.isFunction= and =Uize.isNumber= static methods
			*/
		};
		_classNonInheritableStatics.isArray = 1;

		var _isFunction = _class.isFunction = function (_value) {
			var _constructor = _value != _undefined && _value.constructor;
			return !!(_constructor && _constructor == _constructor.constructor);
			/* NOTES:
				- for some inexplicable reason, typeof RegExp is 'function' in FF and Safari, so we avoid using typeof in our test
				- in Internet Explorer, references to functions defined in another window fail in a "typeof value == 'function'" test, so we avoid using typeof
				- in many browsers, references to functions defined in another window will fail on a test of "value instanceof Function", because the Function constructor for the function in the other window is discrete from the Function object of the window in which the test is being performed
				- the constructor of the Function object is the Function object, so if the constructor for a value is the same as constructor's constructor, then the value must be a function
				- in Internet Explorer, certain object constructors, such as HTMLBodyElement, are reported as object with the typeof operator, and their constructor is reported as undefined (rather than a native function wrapper), so we test to make sure that the constructor is defined (or there would be JavaScript errors produced when testing those objects)
			*/
			/*?
				Static Methods
					Uize.isFunction
						Returns a boolean, indicating whether or not the specified value is a function.

						SYNTAX
						................................................
						isFunctionBOOL = Uize.isFunction (valueANYTYPE);
						................................................

						This method is a useful abstraction to deal with some issues with detecting function type values using the traditional =typeof value &#61;&#61; 'function'= approach in different Web browsers, as listed below...

						Regular Expressions Masquerading as Functions
							In a number of browsers, instances of JavaScript's built-in =RegExp= object are reported as type ='function'= by the =typeof= operator.

							They do, in fact, behave nominally as functions and can be called as functions using the standard syntax for calling functions. Consider the following example...

							EXAMPLE
							..................................................................................
							alert (/(\d+)/ ('Space 1999 was an awesome show') [1]);  // alerts the text "1999"
							..................................................................................

							However, regular expressions do not have the =Function= object as their constructor - their constructor is the =RegExp= object. As a result, they do not support the =call= and =apply= methods or other features of true functions. If your code is expecting true functions that support all the features of functions, then it is better to use the =Uize.isFunction= method in testing for function type values.

						Functions From Other Windows
							In Microsoft Internet Explorer, references to functions defined in another window are *not* reported as type ='function'= by the =typeof= operator.

							Furthermore, references to functions defined in another window will fail in a test of "instanceof Function", because the =Function= constructor for the function that was defined in the other window is discrete from the =Function= object belonging to the window in which the test is being performed. This behavior may seem unfortunate in this one sense, but it is important in the sense of not allowing contamination across windows and possible interoperability and security issues. If your code is expecting functions that may originate from a different window, then it is better to use the =Uize.isFunction= method in testing for function type values, because the =Uize.isFunction= method handles the aforementioned issues.

						NOTES
						- see the related =Uize.isArray= and =Uize.isNumber= static methods
			*/
		};
		_classNonInheritableStatics.isFunction = 1;

		_class.isNumber = function (_value) {
			return typeof _value == _typeNumber && !isNaN (_value);
			/*?
				Static Methods
					Uize.isNumber
						Returns a boolean, indicating whether or not the specified value is a number.

						SYNTAX
						............................................
						isNumberBOOL = Uize.isNumber (valueANYTYPE);
						............................................

						This method is a useful abstraction to deal with the fact that the division of zero by zero in JavaScript yields a special kind of value know as =NaN=. Unfortunately, in the implementation of this special value, the result chosen for when the =typeof= operator is applied to it is ='number' (ie. =typeof NaN &#61;&#61; 'number'= yields =true=). The =Uize.isNumber= method checks that both the type of the parameter is ='number'= and also that the parameter is not =NaN=.

						NOTES
						- see the related =Uize.isArray= and =Uize.isFunction= static methods
			*/
		};
		_classNonInheritableStatics.isNumber = 1;

		_class.isIn = function (_array,_value,_strict) {
			return _class.indexIn (_array,_value,false,_strict) > -1;
			/*?
				Static Methods
					Uize.isIn
						Returns a boolean, indicating whether or not the specified value can be found within the specified array.

						SYNTAX
						................................................
						isInBOOL = Uize.isIn (sourceARRAY,valueANYTYPE);
						................................................

						VARIATION
						...................................................................
						isInBOOL = Uize.isIn (sourceARRAY,valueANYTYPE,strictEqualityBOOL);
						...................................................................

						By default, this method tests for a match using strict equality. When the value =false= is specified for the optional =strictEqualityBOOL= parameter, then this method will test for a match using loose equality (ie. where the string value ='1'= would be considered equal to the number value =1=).

						EXAMPLE
						............................................................
						Uize.isIn ([0,1,2,3,4,5],'3');              // returns false
						Uize.isIn ([0,1,2,3,4,5],'3',false,false);  // returns true
						............................................................

						NOTES
						- see also the related =Uize.indexIn= static method
			*/
		};
		_classNonInheritableStatics.isIn = 1;

		var _recordMatches = _class.recordMatches = function (_record,_match) {
			if (!_record) return !_match;
			for (var _propertyName in _match) {
				if (_record [_propertyName] !== _match [_propertyName]) return _false;
			}
			return _true;
			/*?
				Static Methods
					Uize.recordMatches
						Returns a boolean, indicating whether or not the specified record's contents is a superset of the contents of the specified match object.

						SYNTAX
						......................................................
						isMatchBOOL = Uize.recordMatches (recordOBJ,matchOBJ);
						......................................................

						EXAMPLE
						.............................................
						Uize.recordMatches (
							{
								firstName:'Jack',
								lastName:'Lerchner',
								department:'engineering',
								jobTitle:'UI Engineer',
								status:'contract'
							}
							{jobTitle:'UI Engineer',status:'fulltime'}
						);
						.............................................

						In the above example, the expression would produce the result =false=, because the value of the =status= property in the =matchOBJ= parameter does not match the value for that property in the =recordOBJ= parameter.

						NOTES
						- this method uses strict matching, so the statement =Uize.recordMatches ({index:'1'},{index:1})= will return =false=
						- see also the related =Uize.findRecord= and =Uize.findRecordNo= static methods
			*/
		};
		_classNonInheritableStatics.recordMatches = 1;

		_class.findRecordNo = function (_records,_match,_defaultNoIfNoMatch) {
			var _result = _class.isNumber (_defaultNoIfNoMatch) ? _defaultNoIfNoMatch : -1;
			if (_records) {
				for (var _recordNo = -1, _recordsLength = _records.length; ++_recordNo < _recordsLength;) {
					if (_recordMatches (_records [_recordNo],_match)) {
						_result = _recordNo;
						break;
					}
				}
			}
			return _result;
			/*?
				Static Methods
					Uize.findRecordNo
						Returns an integer, indicating the index in the specified records array of the first record whose contents is a superset of the contents of the specified match object. If no matching record can be found, then this method will return the value =-1=.

						SYNTAX
						........................................................
						recordNoINT = Uize.findRecordNo (recordsARRAY,matchOBJ);
						........................................................

						EXAMPLE
						........................................................................................
						var
							fruits = [
								{
									type:'Apple',
									variety:'Braeburn',
									color:'red'
								},
								{
									type:'Orange',
									variety:'Navel',
									color:'orange'
								},
								{
									type:'Apple',
									variety:'Granny Smith',
									color:'green'
								},
								{
									type:'Apple',
									variety:'Red Delicious',
									color:'red'
								}
							],
							greenAppleRecordNo = Uize.findRecordNo (fruits,{type:'Apple',variety:'Granny Smith'})
						;
						........................................................................................

						In the above example, the variable =greenAppleRecordNo= will have the value =2=.

						NOTES
						- this method uses strict matching, so the statement =Uize.findRecordNo ([{index:'0'},{index:'1'}],{index:1})= will return =-1=
						- see also the related =Uize.findRecord= and =Uize.recordMatches= static methods
			*/
		};
		_classNonInheritableStatics.findRecordNo = 1;

		_class.findRecord = function (_records,_match,_defaultNoIfNoMatch) {
			var _recordNo = _class.findRecordNo (_records,_match,_defaultNoIfNoMatch);
			return _recordNo > -1 ? _records [_recordNo] : null;
			/*?
				Static Methods
					Uize.findRecord
						Returns the first record in the specified records array whose contents is a superset of the contents of the specified match object. If no matching record can be found, then this method will return the value =null=.

						SYNTAX
						....................................................
						recordOBJ = Uize.findRecord (recordsARRAY,matchOBJ);
						....................................................

						This method uses the =Uize.findRecordNo= static method in its implementation, so consult the reference for that method for further details and for an example.

						NOTES
						- this method uses strict matching, so the statement =Uize.findRecord ([{index:'0'},{index:'1'}],{index:1})= will return =null=
			*/
		};
		_classNonInheritableStatics.findRecord = 1;

		var _getGuid = _class.getGuid = function () {
			return 'uizeGuid' + _uizeGuids++;
			/*?
				Static Methods
					Uize.getGuid
						Returns a string value, being an ID that is globally unique in the current window context.

						SYNTAX
						..........................
						guidSTR = Uize.getGuid ();
						..........................

						When an instance of a =Uize= subclass is created, its =instanceId= instance property is set to a value returned by this method. This method may also be useful in the implementations of subclasses, in situations where it is necessary to stash something in a context shared by different modules of code that need to be able to interoperate without conflicts.
			*/
		};
		_classNonInheritableStatics.getGuid = 1;

		var _getPathToLibrary = _class.getPathToLibrary = function (_moduleFilename,_moduleToken) {
			if (
				typeof document != 'undefined' && document.getElementsByTagName
				/* NOTE:
					Adobe's ExtendScript implements a document object, so the presence of this object is by itself not a good enough indication that we're running in a Web browser. So, we test for getElementsByTagName as well.
				*/
			) {
				for (
					var
						_scriptTagNo = -1,
						_scriptTags = document.getElementsByTagName ('SCRIPT'),
						_scriptTagsLength = _scriptTags.length,
						_scriptSrc,
						_moduleFilenamePos
					;
					++_scriptTagNo < _scriptTagsLength;
				) {
					if ((_moduleFilenamePos = (_scriptSrc = _scriptTags [_scriptTagNo].src).indexOf (_moduleFilename)) > -1)
						return (
							_moduleToken
								? _scriptSrc.replace (_moduleFilename,_moduleToken)
								: _scriptSrc.slice (0,_scriptSrc.lastIndexOf ('/',_moduleFilenamePos) + 1)
						)
					;
				}
			}
			return '';
			/*?
				Static Methods
					Uize.getPathToLibrary
						Returns a string, representing the relative path from the current document to the folder containing the specified JavaScript module.

						SYNTAX
						............................................................
						pathToModuleSTR = Uize.getPathToLibrary (moduleFilenameSTR);
						............................................................

						Whereas the =Uize.pathToResources= static property specifies the relative path to the folder containing the "Uize.js" JavaScript module, this method can be used to find the relative path to a different JavaScript module that is being sourced into the document. This can be useful when the JavaScript module implementing a =Uize= subclass does not reside in the same folder alongside the "Uize.js" file.

						This method is useful in the implementation of =Uize= subclasses that may wish to, in their implementation, make use of image and other support resources located inside the folder that contains the class's JavaScript module. By using this method, a subclass' implementation does not need to know whether or not the document using it is being loaded through HTTP or from the local file system and does not need to impose extra requirements on developers regarding where its JavaScript module is located in relation to documents using it.

						VARIATION
						...........................................................................
						pathToModuleSTR = Uize.getPathToLibrary (moduleFilenameSTR,moduleTokenSTR);
						...........................................................................

						When the optional =moduleTokenSTR= parameter is specified, then the value returned by this method will be the value of the =src= property for the =script= tag that sources in the module specified by the =moduleFilenameSTR= parameter, but with the module filename replaced by the substitution token specified by the =moduleTokenSTR= parameter. Consider the following example...

						EXAMPLE
						............................................................................................
						<script type="text/javascript" src="../js/Uize.js?bld=123"></script>

						<script type="text/javascript">
							alert (Uize.getPathToLibrary ('Uize.js','[MODULE]'));  // alerts "../js/[MODULE]?bld=123"
						</script>
						............................................................................................

						In the above example, the =script= tag that sources in the "Uize.js" module has the value "../js/Uize.js?bld=123" specified for its =src= attribute. By specifying the value ='[MODULE]'= for the optional =moduleTokenSTR= parameter in the =Uize.getPathToLibrary= method call, the text "Uize.js" is replaced with the text "[MODULE]", and the value returned by the =Uize.getPathToLibrary= method is ='../js/[MODULE]?bld=123'=.

						NOTES
						- see also the =Uize.pathToResources= static property
			*/
		};
		_classNonInheritableStatics.getPathToLibrary = 1;

		var _globalEval = _class.globalEval = new _Function ('toEval','return eval (toEval)');
			/* NOTE:
				another alternative to this approach is to use the Function object to create a function in a deeper scope and then call it there, thus avoiding pollution of the global namespace (but how is the performance of that approach versus eval?)
			*/
			/*?
				Static Methods
					Uize.globalEval
						A method that lets you eval code in the global scope.

						SYNTAX
						....................................................
						evalResultANYTYPE = Uize.globalEval (codeToEvalSTR);
						....................................................

						A risk with careless use of JavaScript's =eval= function from deep within the nested functions of your code is that you may not be intending to have the code evaluated within the scope of your deep function.

						It could be a benefit to the code you're eval'ing that it has access to the scope of the function in which you're eval'ing it. It may also be a curse in two respects: 1) the code being eval'ed may unexpectedly conflict with identifiers in your function's scope, and 2) function closures within the code being eval'ed will hang on to your function's scope state (with "interesting" memory usage implications).

						The =Uize.globalEval= method lets you guarantee that code you wish to be eval'ed in the global scope *is* eval'ed in the global scope.
			*/
		_classNonInheritableStatics.globalEval = 1;

		var _isInstance = _class.isInstance = function (_object) {
			return !!(_object && _object.Class);
			/*?
				Static Methods
					Uize.isInstance
						Returns a boolean, indicating whether or not the parameter passed is a reference to an object instance or to a class.

						SYNTAX
						......................................................
						isInstanceBOOL = Uize.isInstance (instanceOrClassOBJ);
						......................................................

						This method can be useful when implementing methods that may be called on a class as well as on an instance of a class.
			*/
		};
		_classNonInheritableStatics.isInstance = 1;

		_class.module = function (_params) {
			var
				_name = _params.name || '',
				_host = _name.substr (0,_name.lastIndexOf ('.')),
				_superclass = _params.superclass || _host,
				_required = _params.required || [],
				_modulesToLoad = []
			;
			_moduleLoadHandlers [_name] || (_moduleLoadHandlers [_name] = []);
				/* NOTE:
					If a named module is declared inline, and another module requires that module further down in the same page, then that subsequent module declaration will know to wait on the successful building of the first module, because the presence of a handlers array for a particular module is regarded as an indication that code is busy waiting on building of that module. This behavior also supports library modules, where individual modules are declared inline inside the library module.
				*/
			if (typeof _required == _typeString) _required = _required.split (',');
			_host && _required.push (_host);
			_superclass != _host && _required.push (_superclass);

			/*** determine which required modules are not already loaded ***/
				for (var _requiredNo = -1, _requiredLength = _required.length; ++_requiredNo < _requiredLength;) {
					var _requiredModule = _required [_requiredNo];
					_requiredModule && !_getModuleByName (_requiredModule) && _modulesToLoad.push (_requiredModule);
				}

			/*** load modules (if necessary) ***/
				function _buildModule () {
					var
						_builder = _params.builder,
						_module = _builder && _builder (_getModuleByName (_superclass))
					;
					_name &&
						(new _Function ('m',_name + '=m')) (_module = _modulesByName [_name] = _module || function () {})
					;
					if (_isFunction (_module)) {
						_module.moduleName = _name;
						if (!_module.subclass)
							/* NOTE:
								if the module is not a Uize class (like a package or something else), assign the toString instrinsic method, because it won't be obtained by subclassing (since there is none)
							*/
							_module.toString = _toString
						;
					}
					_handleModuleLoaded (_name);
				}
				var _modulesToLoadLength = _modulesToLoad.length;
				if (_modulesToLoadLength) {
					var _moduleLoader = _class.moduleLoader;
					if (_moduleLoader) {
						var _moduleToLoadNo = -1;
						function _loadNextModule () {
							_moduleToLoadNo++;
							if (_moduleToLoadNo < _modulesToLoadLength) {
								var _moduleToLoad = _modulesToLoad [_moduleToLoadNo];
								_getModuleByName (_moduleToLoad)
									? _loadNextModule ()
									: _moduleLoadHandlers [_moduleToLoad]
										? _moduleLoadHandlers [_moduleToLoad].push (_loadNextModule)
										: _moduleLoader (
											_moduleToLoad,
											function (_moduleToLoadCode) {
												if (_getModuleByName (_moduleToLoad)) {
													_loadNextModule ();
													/* NOTE:
														This additional check is important, because another asynchronous chain could have resulted in this module becoming loaded in between the call to _moduleLoader and the response.
													*/
												} else {
													_moduleToLoadCode && _globalEval (_moduleToLoadCode);
													if (_getModuleByName (_moduleToLoad)) {
														_handleModuleLoaded (_moduleToLoad);
														_loadNextModule ();
													} else {
														(
															_moduleLoadHandlers [_moduleToLoad] ||
															(_moduleLoadHandlers [_moduleToLoad] = [])
														).push (_loadNextModule);
													}
												}
											}
										)
								;
							} else {
								_buildModule ();
							}
						}
						_loadNextModule ();
					} else {
						/*
							OK, so the alert is problematic at this point because there are some modules that are only used for their static methods, and in that usage the dependencies that they would have, if one was creating instances of them, do not apply, yet these dependencies are now being imposed on pages that use these modules.

							alert (
								'The following modules are required, but have not been loaded...\n\n' +
								_modulesToLoad.join (', ') + '\n\n' +
								'As a result, this application may not function correctly.'
							);
						*/
						_buildModule ();
					}
				} else {
					_buildModule ();
				}
			/*?
				Static Methods
					Uize.module
						Lets you declare a module in the UIZE JavaScript Framework.

						SYNTAX
						......................................................................................
						Uize.module ({
							name:moduleNameSTR,           // omit for anonymous modules
							superclass:superclassNameSTR, // omit for package modules, or if host is superclass
							required:modulesSTRorARRAY,   // omit when only host and superclass are required
							builder:builderFUNC           // omit for library modules and namespace modules
						});
						......................................................................................

						For an in-depth discussion of modules, consult the explainer [[../explainers/javascript-modules.html][JavaScript Modules]].

						NOTES
						- see also the =Uize.moduleLoader= static method and the =Uize.moduleUrlTemplate= static property
			*/
		};
		_classNonInheritableStatics.module = 1;

		_class.moduleLoader = function (_moduleToLoad,_callback) {
			_callback ();
				/* NOTE:
					by returning no code, the modules loader code sees that the module is not defined after eval'ing the empty string and is tricked into thinking that the module had further dependencies, when in actual fact a script tag was put into the page. The effect is that a callback is registered by the modules loader code so that when the module is successfully declared and built through its Uize.module call, then any stalled module loading is continued.
				*/

			/*** insert the script tag ***/
				var _scriptNode = document.createElement ('script');
				_scriptNode.type = 'text/javascript';
				_scriptNode.src = _class.moduleUrlResolver (_moduleToLoad);
				(_scriptParentNode || (_scriptParentNode = document.getElementsByTagName ('HEAD') [0])).appendChild (
					_scriptNode
				);
			/*?
				Static Properties
					Uize.moduleLoader
						Loads the specified JavaScript module (specified by its module name) and calls the specified callback function once the module has been loaded.

						SYNTAX
						...............................................
						Uize.moduleLoader (moduleNameSTR,callbackFUNC);
						...............................................

						The callback specified by the =callbackFUNC= parameter is called with a single parameter that represents the code of the module specified by the =moduleNameSTR= parameter, unless the module loader loads modules by adding =script= tags to the page (in which case the callback is called with no parameters).

						EXAMPLE
						.................................................................................
						Uize.moduleLoader = function (_moduleToLoad,_callback) {
							_this._commObject.request ({
								url:[_this.get ('env').service + 'getjs',{filename:_moduleToLoad + '.js'}],
								returnType:'json',
								requestMethod:'GET',
								callback:function (_responseObject) {
									_callback (_responseObject.moduleCode);
								}
							});
						};
						.................................................................................

						For an in-depth discussion of modules, consult the explainer [[../explainers/javascript-modules.html][JavaScript Modules]].

						NOTES
						- see also the =Uize.module= static method
						- see the related =Uize.moduleUrlResolver= static method and the =Uize.moduleUrlTemplate= static property
			*/
		};
		_classNonInheritableStatics.moduleLoader = 1;

		_class.moduleUrlResolver = function (_moduleName) {
			return _class.moduleUrlTemplate.replace (_modulePathToken,_moduleName + '.js');
			/*?
				Static Properties
					Uize.moduleUrlResolver
						Returns a string, representing the URL path from where the specified JavaScript module (specified by its module name) can be loaded.

						SYNTAX
						...
						...

						By overriding this static method, you have the flexibility to have different types of modules load from different locations. A classic example would be loading modules of the UIZE JavaScript Framework from a shared CDN (Content Delivery Network) location, while loading modules that are in your own Web site's namespace from the same machine that serves the pages. Consider the following example...

						EXAMPLE
						...................................................................
						Uize.moduleUrlResolver = function (_moduleName) {
							return (
								moduleName.indexOf ('MyDomain.') == 0
									? '/js/' + _moduleName + '.js'
									: 'http://www.some-cdn.com/uize-js/' + _moduleName + '.js'
							);
						};
						...................................................................

						In the above example, a custom module URL resolver is being specified. It looks at the module name, determines if the module name is in the namespace for the Web site (=MyDomain= in this example), and returns a root relative URL. Otherwise, assuming that all other modules are part of the UIZE JavaScript Framework and are stored on a CDN, it returns a URL for where the module would be located on that CDN Web site.

						The module URL returned by your function will be used by the built-in =Uize.moduleLoader= module loader function. If you override the built-in module loader by specifying your own value for the =Uize.moduleLoader= static method, then the =Uize.moduleUrlResolver= static method will only be applicable if your custom module loader uses this method. Similarly, the built-in =Uize.moduleUrlResolver= implementation uses the =Uize.moduleUrlTemplate= static property. So, if you supply your own custom module URL resolver by overriding the =Uize.moduleUrlResolver= static method, then it is your choice as to whether or not you use the value of the =Uize.moduleUrlTemplate= property.

						For an in-depth discussion of modules, consult the explainer [[../explainers/javascript-modules.html][JavaScript Modules]].

						NOTES
						- see the related =Uize.moduleLoader= static method and the =Uize.moduleUrlTemplate= static property
			*/
		};
		_classNonInheritableStatics.moduleUrlResolver = 1;

		var _pairUp = _class.pairUp = function (_key,_value) {
			var _result = {};
			_result [_key] = _value;
			return _result;
			/*?
				Static Methods
					Uize.pairUp
						Returns an object, that is the specified key and value, paired up together in the same object.

						SYNTAX
						.....................................................
						keyValueOBJ = Uize.pairUp (keySTRorNUM,valueANYTYPE);
						.....................................................

						EXAMPLE 1
						.............................................................
						Uize.pairUp ('foo','bar');  // returns the object {foo:'bar'}
						Uize.pairUp (0,'zero');     // returns the object {0:'zero'}
						Uize.pairUp (1,true);       // returns the object {1:true}
						.............................................................

						The =Uize.pairUp= method is useful when an object needs to be created from a key/value pair, where the key name is either dynamically generated in an expression or is supplied via a parameter. Using the =Uize.pairUp= method can collapse three statements into a single statement, as follows...

						INSTEAD OF
						.................................
						var object = {};
						object [key] = value;
						doSomethingWithAnObject (object);
						.................................

						USE...
						..................................................
						doSomethingWithAnObject (Uize.pairUp (key,value));
						..................................................

						Let's consider a real world example...

						EXAMPLE 2
						..............................................................
						function fadeNodeBorderColor (node,edge,startColor,endColor) {
							var styleProperty = 'border' + edge + 'Color';
							Uize.Fx.fadeStyle (
								node,
								Uize.pairUp (styleProperty,startColor),
								Uize.pairUp (styleProperty,endColor),
								1000
							);
						}
						..............................................................

						In the above example, a function is being defined that will fade the border color of the specified edge of the specified node, from the specified start color to the specified end color. The value of the =edge= property needs to determine which style property needs to be faded. Now, we're using the =Uize.Fx.fadeStyle= static method of the =Uize.Fx= module to perform the border color animation. This method can fade values for one or more style properties, and the start and end values for the style properties are specified in style property objects. Here we need to create start and end style objects where the style property to be faded is dynamically generated using the =edge= parameter. As you will see from the code, the =Uize.pairUp= method does this for us nicely.
			*/
		};
		_classNonInheritableStatics.pairUp = 1;

		var _escapeRegExpLiteral = _class.escapeRegExpLiteral = function (_literal) {
			return _literal.replace (/([\^\$\|\{\}\[\]\(\)\?\.\*\+\\])/g,'\\$1');
			/*?
				Static Methods
					Uize.escapeRegExpLiteral
						Returns a string, being the specified source string escaped so that it can be used as a literal match when constructing a regular expression string.

						SYNTAX
						......................................................................
						escapedRegExpLiteralSTR = Uize.escapeRegExpLiteral (regExpLiteralSTR);
						......................................................................

						Using this method, any string can be escaped so that it can be used in creating a regular expression where that string can be matched as a literal match. Strings may sometimes contain special regular expression characters, such as the =(= (open parenthesis), =)= (close parenthesis), =.= (period), =?= (question mark), and other characters that have special meaning in the context of regular expression strings. If you wanted to use a regular expression to match a string that contained any of these special characters, then the special characters would have to be escaped. The =Uize.escapeRegExpLiteral= method takes care of this for you. Consider the following example...

						EXAMPLE
						............................................................................
						function replaceAllCaseInsensitive (sourceStr,toReplaceStr,replacementStr) {
							return sourceStr.replace (
								new RegExp (Uize.escapeRegExpLiteral (toReplaceStr),'gi'),
								replacementStr
							);
						}
						............................................................................

						In the above example, we are defining a function that will replace all occurrences of a specified string within a source string with the specified replacement string, and where matching is case insensitive.

						Now, the =replace= instance method of JavaScript's =String= object can accept a string as a match parameter, but when a string is specified the replacement is not case insensitive and is only for the first occurrence. So, we have to use a regular expression to specify what to replace, so that we can make use of the "g" (global) and "i" (case insensitive) regular expression switches. The problem, however, with using a regular expression is that the string to replace may contain regular expression special characters, so we can't just use it as is when creating the =RegExp= instance - we have to escape the special characters. So, we use the =Uize.escapeRegExpLiteral= method to escape the string to replace before supplying it to the =RegExp= object's constructor.

						The =Uize.escapeRegExpLiteral= method can be used to escape any string that is to be treated as a literal match - even literals that are to be combined with other regular expression logic to form more complex regular expressions.
			*/
		};
		_classNonInheritableStatics.escapeRegExpLiteral = 1;

		var _substituteInto = _class.substituteInto = function (_source,_substitutions,_tokenNaming) {
			if (!(_source = _source == _undefined ? '' : _source + '') || _substitutions == _undefined)
				return _source
			;
			if (_simpleTypesMap [typeof _substitutions])
				_substitutions = [_substitutions]
			;
			var
				_tokenOpenerAndCloser = (_tokenNaming || '[#KEY]').split ('KEY'),
				_substitutionsForRegExp = []
			;
			for (var _substitution in _substitutions)
				_substitutionsForRegExp.push (_escapeRegExpLiteral (_substitution))
			;
			return _source.replace (
				new RegExp (
					_escapeRegExpLiteral (_tokenOpenerAndCloser [0]) +
					'(' + _substitutionsForRegExp.join ('|') + ')' +
					_escapeRegExpLiteral (_tokenOpenerAndCloser [1]),
					'g'
				),
				function (_token,_substitution) {return _substitutions [_substitution] + ''}
			);
			/*?
				Static Methods
					Uize.substituteInto
						Lets you substitute one or more specified substitution values into a specified source string.

						SYNTAX
						.....................................................................................
						resultSTR = Uize.substituteInto (
							sourceANYTYPE,         // a string, or other type that will be coerced to a string
							substitutionsANYTYPE,  // an object, array, or simple type substitution value
							tokenNamingSTR         // optional, specifies a custom token naming scheme
						);
						.....................................................................................

						Parameters
							sourceANYTYPE
								The value of the =sourceANYTYPE= parameter should be a string containing substitution tokens that the substitution values specified in the =substitutionsOBJorARRAY= parameter will be substituted into.

								If the value of the =sourceANYTYPE= parameter is not a string, then it will be coerced to a string by invoking the value type's =valueOf Intrinsic Method=. For each of the values to substitute, the =sourceANYTYPE= string should contain a token of the form =[#propertyName]= (unless a custom token naming scheme is specified using the optional =tokenNamingSTR= parameter). Each substitution token for a substitution will be replaced with the substitution value.

							substitutionsANYTYPE
								An object, array, or simple type value, specifying one or more substitution values that should be substituted into the source string specified by the =sourceANYTYPE= parameter.

								- =object= - When the value of the =substitutionsANYTYPE= parameter is an object, then each property of the object will be a substitution, where a property's value is the substition value, and where a property's name is a key that will be used in forming the substitution's token name.

								- =array= - When the value of the =substitutionsANYTYPE= parameter is an array, then each element of the aray will be a substitution, where an element's value is the substition value, and where an element's index is a key that will be used in forming the substitution's token name.

								- =simple type= - When the value of the =substitutionsANYTYPE= parameter is a simple type value (string, boolean, or number), then a substitutions array is formed using that simple type substitution as its single element.

								EXAMPLES
								.........................................................
								Uize.substituteInto ('My name is [#name]',{name:'Eric'});
								Uize.substituteInto ('My name is [#0]',['Eric']);
								Uize.substituteInto ('My name is [#0]','Eric');
								.........................................................

								All of the above statements would produce the result ='My name is Eric'=.

							tokenNamingSTR
								The optional =tokenNamingSTR= parameter allows a custom token naming scheme to be specified, rather than the default =[#KEY]= format.

								This facility provides a lot of flexibility in how tokens are formatted inside localized strings. The value specified for the =tokenNamingSTR= parameter should be a string containing the text ='KEY'= somewhere inside it, where that segment will be replaced with the name for a given key. So, for example, a value of ='[KEY]'= for the =tokenNamingSTR= parameter would produce the token name ='[firstName]'= for the substitution key ='firstName'=.

								EXAMPLES
								....................................................................
								Uize.substituteInto ('My name is [#name]',{name:'Eric'});
								Uize.substituteInto ('My name is [#name]',{name:'Eric'},'[#KEY]');
								Uize.substituteInto ('My name is [name]',{name:'Eric'},'[KEY]');
								Uize.substituteInto ('My name is {name}',{name:'Eric'},'{KEY}');
								Uize.substituteInto ('My name is <%name%>',{name:'Eric'},'<%KEY%>');
								Uize.substituteInto ('My name is ##name##',{name:'Eric'},'##KEY##');
								Uize.substituteInto ('My name is [[name]]',{name:'Eric'},'[[KEY]]');
								....................................................................

								All of the above statements would produce the result ='My name is Eric'=.

						VARIATION
						........................................................................
						resultSTR = Uize.substituteInto (sourceANYTYPE,substitutionsOBJorARRAY);
						........................................................................

						When the optional =tokenNamingSTR= parameter is omitted, then its value will be defaulted to ='[#KEY]'=.

						Examples
							Example: Two Substitutions
								In the example below, two substitutions are being performed.

								EXAMPLE
								....................................................
								Uize.substituteInto (
									''My name is [#name], and I am a [#occupation].',
									{name:'Eric',occupation:'viking'}
								);
								....................................................

								RESULT
								.....................................
								'My name is Eric, and I am a viking.'
								.....................................

							Example: One Substitution, Used Multiple Times
								If there are multiple tokens for the same substitution value, then that value will be substituted multiple times.

								EXAMPLE
								.................................................................
								Uize.substituteInto (
									'An [#fruit]. Oh, an [#fruit]!! Please, give me an [#fruit].',
									{fruit:'apple'}
								);
								.................................................................

								RESULT
								....................................................
								'An apple. Oh, an apple!! Please, give me an apple.'
								....................................................

							Example: No Token for a Substitution Value
								If there are no substitution tokens for a substitution value, then that value will not be substituted.

								EXAMPLE
								...........................................................
								Uize.substituteInto (
									'An orange. Oh, an orange!! Please, give me an orange.',
									{fruit:'apple'}
								);
								...........................................................

								RESULT
								.......................................................
								'An orange. Oh, an orange!! Please, give me an orange.'
								.......................................................

							Example: Tokens With No Substitution Value
								Substitution tokens for which there are no properties will be left in the string (they will not be blanked out).

								EXAMPLE
								.................................................................
								Uize.substituteInto (
									'An [#fruit]. Oh, an [#fruit]!! Please, give me an [#fruit].',
									{vegetable:'artichoke'}
								);
								.................................................................

								RESULT
								.............................................................
								'An [#fruit]. Oh, an [#fruit]!! Please, give me an [#fruit].'
								.............................................................

							Example: Custom Token Naming
								The optional =tokenNamingSTR= parameter allows a custom token naming format to be specified.

								EXAMPLE
								........................................................
								Uize.substituteInto (
									'Welcome, {firstName} of {state}, {country}',
									{firstName:'Chris',state:'California',country:'USA'},
									'{KEY}'
								);
								........................................................

								RESULT
								...................................
								'Welcome, Chris of California, USA'
								...................................

								In the above example, the value ='{KEY}'= is being specified for the =Uize.substituteInto= method's optional =tokenNamingSTR= parameter. This means that the key for each substitution will be enclosed with curly braces to form its token name.

							Example: Bare Tokens
								The optional =tokenNamingSTR= parameter can be used to specify a "bare token" format for token naming, where the substitution tokens are the substitution keys.

								EXAMPLE
								........................................................
								Uize.substituteInto (
									'Welcome, firstName of state, country',
									{firstName:'Chris',state:'California',country:'USA'},
									'KEY'
								);
								........................................................

								RESULT
								...................................
								'Welcome, Chris of California, USA'
								...................................

							Example: Mixed Type Substitution Values
								Substitution values can be of any type, and any value that is not a string will be coerced to a string.

								EXAMPLE
								..................................................
								Uize.substituteInto (
									'[#month]/[#date]/[#year] FLIGHTS: [#flights]',
									{
										month:9,
										date:11,
										year:new Uize ({value:2001}),
										flights:['AA11','UA175','AA77','UA93']
									}
								);
								..................................................

								RESULT
								.........................................
								'9/11/2001 FLIGHTS: AA11,UA175,AA77,UA93'
								.........................................

							Example: Specifying Substitutions Using an Array
								When substitutions are specified using an array, then each substitution's index in the substitutions array is used as the key when forming its token name.

								EXAMPLE
								.................................................................................
								Uize.substituteInto ('Welcome, [#0] of [#1], [#2]',['Chris','California','USA']);
								.................................................................................

								RESULT
								...................................
								'Welcome, Chris of California, USA'
								...................................

							Example: Substitution Values Containing Tokens
								Substitution values that contain tokens are not further substituted into.

								EXAMPLE
								................................................................................
								Uize.substituteInto ('[#token1][#token2]',{token1:'[#token2]foo',token2:'bar'});
								................................................................................

								RESULT
								.................
								'[#token2]foobar'
								.................

								In the above example, the value for the =token1= substitution is ='[#token2]foo'=, which contains a token for the =token2= substitution. But, the values of substitutions are not further substituted into - for good reason, since this could result in some odd and unexpected behaviors in some cases.

							Example: Tokens and Substitutions are Case-sensitive
								Substitution tokens are case-sensitive.

								EXAMPLE
								.......................................................
								Uize.substituteInto (
									'This is a case of comparing [#fruit] to [#FRUIT].',
									{fruit:'apples',FRUIT:'oranges'}
								);
								.......................................................

								RESULT
								................................................
								'This is a case of comparing apples to oranges.'
								................................................

								In the above example, the token =[#fruit]= is distinct from the token =[#FRUIT]=. Our substitution values object in this case has a value for both the =fruit= and =FRUIT= properties, so the method call returns the value ='This is a case of comparing apples to oranges.'=.

							Example: Tokens and Substitutions are Space-sensitive
								Substitution tokens are space-sensitive.

								EXAMPLE
								.........................................................
								Uize.substituteInto (
									'This is a case of comparing [#fruit] to [# fruit ].',
									{fruit:'apples',' fruit ':'oranges'}
								);
								.........................................................

								RESULT
								................................................
								'This is a case of comparing apples to oranges.'
								................................................

								In the above example, the token =[#fruit]= is distinct from the token =[# fruit ]=. Our substitution values object in this case has a value for both the =fruit= and =' fruit '= properties, so the method call returns the value ='This is a case of comparing apples to oranges.'=.

							Example: A Single Simply Type Substitution
								When a simple type value (string, number, or boolean) is specified in place of a substitutions object or array, then a substitutions array is formed using that simple type substitution as its single element.

								EXAMPLE
								................................................
								Uize.substituteInto ('My name is [#0].','Eric');
								................................................

								RESULT
								..................
								'My name is Eric.'
								..................

							Example: Source is Not a String
								When the source value to substitute into is not a string (eg. an object, array, number, boolean, etc.), then this value will be coerced to a string.

								EXAMPLE
								.............................................................................
								Uize.substituteInto (new Uize ({value:'My name is [#name].'}),{name:'Eric'});
								.............................................................................

								RESULT
								..................
								'My name is Eric.'
								..................

								In the above example, the value to substitute into is an instance of the =Uize= base class. Fortunately, the =Uize= class implements a =valueOf Intrinsic Method= that returns the value of the =value= set-get property. Therefore, coercing the source to a string produces the value ='My name is [#name].'=, which is then substituted into without any trouble.

						NOTES
						- token names are case-sensitive
						- token names are space-sensitive (ie. padding around key names is not ignored)
			*/
		};
		_classNonInheritableStatics.substituteInto = 1;

		/*** Inheritance Mechanism ***/
			function _createSubclass (_class,_alphastructor,_omegastructor) {
				var _subclass = function () {
					var _subclassInheritanceChainForType, _subclassInheritanceChainForTypeLength, _function;
					for (var _type in _subclassInheritanceChain) {
						_subclassInheritanceChainForTypeLength =
							(_subclassInheritanceChainForType = _subclassInheritanceChain [_type]).length
						;
						for (var _classNo = -1; ++_classNo < _subclassInheritanceChainForTypeLength;)
							if (_function = _subclassInheritanceChainForType [_classNo]) _function.apply (this,arguments)
						;
					}
					return this;
				};

				var _classPrototype = _class.prototype;

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
					var _subclassPrototype = _subclass.prototype;

					/*** Inherit instance properties and methods from base class (from prototype) ***/
						for (var _property in _classPrototype) _subclassPrototype [_property] = _classPrototype [_property];
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
									Uize.nonInheritableStatics
										A lookup object, automatically created for a class, in which you can register the static features (methods or properties) of the class that should *not* be inherited when that class is subclassed.

										Each property of the =Uize.nonInheritableStatics= lookup object represents a single static feature of the class that should not be inherited by subclasses, where the name of each property should be the name of a static feature (excluding the module name), and the value of each property should be a truthy value (such as =true=, =1=, ='foo'=, =[]=, ={}=, etc.). After a class has been created, non-inheritable statics can be registered for that class by assigning properties to the class' =MyClass.nonInheritableStatics= static property, as shown in the example below...

										EXAMPLE
										...........................................................................
										MyClass = Uize.subclass ();
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
									Uize.superclass
										document...
							*/

					/*** Non-inherited Public Static Methods ***/
						_subclass.toString = _toString;
						_subclass.valueOf = _valueOf;

				/*** Initialize class inheritance chain ***/
					var
						_classInheritanceChain = _class._classInheritanceChain || {
							alphastructor:_sacredEmptyArray,
							omegastructor:_sacredEmptyArray
						},
						_subclassInheritanceChain = _subclass._classInheritanceChain = {
							alphastructor:_classInheritanceChain.alphastructor.concat (_alphastructor),
							omegastructor:_classInheritanceChain.omegastructor.concat (_omegastructor)
						}
					;

				_subclass._propertyProfilesByPrivateNames || (_subclass._propertyProfilesByPrivateNames = {});
				_subclass._propertyProfilesByPublicNames || (_subclass._propertyProfilesByPublicNames = {});

				return _subclass;
			};

			_class.subclass = function (_alphastructor,_omegastructor) {
				return _createSubclass (this,_alphastructor,_omegastructor);
				/*?
					Static Methods
						Uize.subclass
							Lets you subclass the =Uize= class or any subclass of the =Uize= class.

							SYNTAX
							................................................
							MyClass = Uize.subclass (subclassConstructorFN);
							................................................

							Consider the following example...

							EXAMPLE
							.......................................
							MyClass = Uize.subclass (
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

							In the above example, =MySubclass= is a subclass of =MyClass=, which is in turn a subclass of =Uize=. Now, when an instance of =MySubSubclass= gets created, the constructor of =MyClass= and then the constructor of =MySubSubclass= will be executed in the initialization of the instance, and the instance will have both =foo= and =bar= properties, where the =bar= property will have a value of "How unoriginal! Indeed!".
				*/
			};

	/*** Private Static Properties ***/
		_class.moduleName = 'Uize';

	/*** Public Static Properties ***/
		_class.moduleUrlTemplate = _getPathToLibrary ('Uize.js',_modulePathToken);
			/*?
				Static Properties
					Uize.moduleUrlTemplate
						A string, representing a template to be used when generating URLs for loading JavaScript modules dynamically.

						EXAMPLE
						......................................................................
						Uize.moduleUrlTemplate = 'http://www.somedomain.com/js/[#modulePath]';
						......................................................................

						For an in-depth discussion of modules, consult the explainer [[../explainers/javascript-modules.html][JavaScript Modules]].

						NOTES
						- see also the =Uize.module= and =Uize.moduleLoader= static methods
						- this static property is not inherited by subclasses
			*/
		_classNonInheritableStatics.moduleUrlTemplate = 1;

		_class.pathToResources = _getPathToLibrary ('Uize.js');
			/*?
				Static Properties
					Uize.pathToResources
						A string, representing the relative path from the current document to the folder containing the =Uize= class's JavaScript library.

						This property is useful in the implementation of =Uize= subclasses that are to reside in the same folder alongside the =Uize= class's JavaScript file and that may wish to, in their implementation, make use of image and other support resources located inside that folder.

						By using this property, a subclass' implementation does not need to know whether or not the document using it is being loaded through HTTP or from the local file system and does not need to impose extra requirements on developers regarding where its JavaScript library is located in relation to documents using it.

						NOTES
						- this static property is not inherited by subclasses
			*/
		_classNonInheritableStatics.pathToResources = 1;
}) ();
