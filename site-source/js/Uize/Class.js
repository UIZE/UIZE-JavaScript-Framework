/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class Base Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 10
	codeCompleteness: 100
	docCompleteness: 95
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
					- =Uize.Class.alphastructor= - lets you declare the alphastructor for the class
					- =Uize.Class.omegastructor= - lets you declare the omegastructor for the class
					- =Uize.Class.instanceMethods= - lets you declare one or more instance methods for the class
					- =Uize.Class.instanceProperties= - lets you declare one or more instance properties for the class
					- =Uize.Class.staticMethods= - lets you declare one or more static methods for the class
					- =Uize.Class.staticProperties= - lets you declare one or more static properties for the class
					- =Uize.Class.dualContextMethods= - lets you declare one or more dual context methods for the class
					- =Uize.Class.dualContextProperties= - lets you declare one or more dual context properties for the class
					- =Uize.Class.stateProperties= - lets you declare one or more state properties for instances of the class

					The `feature declaration methods` can be used either to add features that aren't inherited from the class' superclass, or to override features that are inherited from its superclass. For an in-depth discussion of feature declaration, consult the [[../guides/classes-and-inheritance.html][Classes and Inheritance]] guide.

			The "no new" Mechanism
				The =Uize.Class= base class implements a novel mechanism for constructors that makes the "new" keyword optional when creating instances.

				Because the =Uize.Class= base class utilizes `the "no new" mechanism`, one can create instances of any =Uize.Class= subclass either using the =new= operator or not. This means that you can use the "new" keyword or not with UIZE classes (as well as your own classes), and the end result will be the same.

				THIS...
				............................
				var myInstance = MyClass ();
				............................

				IS EQUIVALENT TO...
				................................
				var myInstance = new MyClass ();
				................................

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

				For an in-depth discussion of events, consult the [[../guides/javascript-event-system.html][JavaScript Event System]] guide.

			State Properties Derivation ~~ State Properties Derivations
				A state properties derivation is simply an expression that produces a derived value from one or more of the state properties of a class.

				EXAMPLE
				...................................................................
				var CubeClass = Uize.Class.subclass ({
					stateProperties:{
						width:{value:10},
						height:{value:20},
						depth:{value:15},
						volume:{derived:'width,height,depth: width * height * depth'}
					}
				});

				var cubeInstance = CubeClass ();
				alert (cubeInstance.get ('volume'));  // alerts the text "3000"
				...................................................................

				In the above example, the class =CubeClass= is being created with the state properties =width=, =height=, and =depth=, and with the derived property =volume=. The way that the value of the =volume= property is derived is specified using the derivation expression string ='width,height,depth: width * height * depth'=, which tells the =Uize.Class= module to compute the value using the =width=, =height=, and =depth= state properties as the `determinants`, and the expression =width &#42; height &#42; depth= as the computation.

				Derived properties is just one way in which `state properties derivations` can be used. One can also use such derivations with the =onChange= instance method, and when `specifying conditions` with the =isMet=, =once=, and =whenever= instance methods of the `condition system`.

			###
				Determinants
					.

				Determiner
					.

				Methods Supporting State Properties Derivations
					.

					- =onChange= - registers a handler that is to be executed each time a `state properties derivation` changes value, in addition to the first time the derivation's value is computed

				Several Ways to Specify a Derivation
					For convenience, a state properties derivation can be specified in a variety of ways.

					As a String, Specifying a Single Determinant
						.

					As a Comma-separated String, Specifying Multiple Determinants
						.

					As an Array, Specifying Multiple Determinants
						.

					As a Colon-delimited String, Specifying Both Determinants and Determiner
						.

					As a Function, Specifying Both Determinants and Determiner
						.

			Condition System
				The =Uize.Class= module implements a condition system in the form of state properties combined with convenience methods that allow state properties to be treated semantically as conditions.

				Condition System Methods
					The `condition system` of the =Uize.Class= module is exposed through the following methods...

					- =is= - returns whether or not a state property is truthy (useful when a single state property represents a condition)
					- =isMet= - returns whether or not a condition has been met
					- =once= - registers a handler that is to be executed once a condition has been met, or immediately if the condition is already met
					- =met= - sets the value of a state property to =true= (useful when a single state property represents a condition)
					- =unmet= - sets the value of a state property to =false= (useful when a single state property represents a condition)
					- =whenever= - registers a handler that is to be executed each time a condition changes state

				Specifying Conditions
					The =isMet=, =once=, and =whenever= instance methods all support specifying conditions in a number of convenient different ways to suit different situations.

					A condition can be specified in the form of a...

					- `property condition string` - a string, specifying the name of a single state property (as in ='isEmpty'=), with optional `condition inversion` (as in ='!isEmpty'=)
					- `properties condition string or array` - a string, specifying a comma-separated list of state properties (as in ='wired,isEmpty'=), with optional `condition inversion` (as in ='wired,!isEmpty'=), or  an array of strings, specifying one or more state properties (as in =['wired','isEmpty']=), with optional `condition inversion` (as in =['wired','!isEmpty']=)
					- `condition function` - a function, specifying a `state properties derivation`, as in =function (wired,isEmpty) {return wired && !isEmpty}=
					- `condition expression string` - a string, specifying a `state properties derivation`, as in =wired,isEmpty: wired && !isEmpty'=

					Property Condition String ~~ propertyConditionSTR
						In the simplest case, where a single state property is being used to represent a condition, just the name of the property can be specified using the =propertyConditionSTR= parameter.

						EXAMPLE 1
						........................................................
						myWidget.once (
							'wired',
							function () {
								// do something now that the widget has been wired
							}
						);
						........................................................

						In the above example, a handler is being registered to be executed once the widget =myWidget= has been wired (i.e. the value of its =wired= state property becomes =true=).

						EXAMPLE 2
						................................................................
						myCollectionWidget.once (
							'!isEmpty',
							function () {
								// do something now that the collection is no longer empty
							}
						);
						................................................................

						In the above example, code is being registered to execute once the =isEmpty= state property is =false=. The value of the =propertyConditionSTR= parameter may be prefixed with an optional "!" (exclamation mark) prefix for indicating `condition inversion`.

					Properties Condition String or Array ~~ propertiesConditionARRAYorSTR
						In the case of a compound "and" style condition that involves multiple state properties, the condition can be specified either as a string containing a comma-separated list of property names, or as an array of strings specifying the property names.

						EXAMPLE 1: Comma-separated List String
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

						EXAMPLE 2: Array of Property Names
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

						EXAMPLE 3: Comma-separated List String, with Condition Inversion
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

						EXAMPLE 4: Array of Property Names, with Condition Inversion
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

						Inversion of Property Values
							Any property name can be prefixed with a "!" (exclamation mark) to achieve `condition inversion` for the individual property.

						Whitespace Ignored
							When a comma-separated list string is specified, all whitespace in the string is ignored.

							This means that whitespace around the property names is ignored, so the value ='phase1Done,phase2Done,phase3Done'= is equivalent to the value ='phase1Done, phase2Done , phase3Done'=. This also means that whitespace around the optional "!" (exclamation mark) prefix is ignored, so the value ='wired, !isEmpty'= is equivalent to the value ='wired, ! isEmpty'=.

					Condition Function ~~ compoundConditionFUNC
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

					Condition Expression String ~~ compoundConditionSTR
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

						In the above example, a compound condition is specified using a `condition expression string`. In this string, the part before the colon - "width, height, depth" - indicates that the condition is affected by the =width=, =height=, and =depth= state properties of the =myFishTankWater= instance. The part after the colon - "width &#42; height &#42; depth > 1000" - evaluates the condition to be =true= when the volume of the fish tank's water (i.e. the product of the =width=, =height=, and =depth= properties) is greater than =1000=.

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

						In the above example, code is being registered to execute once the =isEmpty= state property is =false=. This is done by prefixing the "isEmpty" condition name with a "!" (bang / exclamation) character to indicate that the code should execute only once the collection is not empty (i.e. the value of the =isEmpty= state property becomes =false=). The `condition inversion` facility is convenient in situations like this where you wish to execute code only once a property's value becomes falsy, rather than once the property's value becomes truthy (which is the standard behavior for the =once= method).

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

				Condition Handler
					Condition Handler Arguments
						The handler code that is registered to be executed when a condition is met will be passed the values of all the state properties that affect the condition as arguments.

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

					### Condition Handler Context
						.
*/

Uize.module ({
	name:'Uize.Class',
	required:[
		'Uize.Util.Dependencies',
		'Uize.Event.Bus',
		'Uize.Oop.mClassFeatureDeclaration'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_typeString = 'string',
				_Function = Function,

				/*** references to utility methods of Uize ***/
					_Uize = Uize,
					_copyInto = _Uize.copyInto,
					_forEach = _Uize.forEach,
					_map = _Uize.map,
					_lookup = _Uize.lookup,
					_getClass = _Uize.getClass,
					_isArray = _Uize.isArray,
					_isFunction = _Uize.isFunction,
					_isInstance = _Uize.isInstance,
					_isObject = _Uize.isObject,
					_traceDependencies = _Uize.Util.Dependencies.traceDependencies,
					_applyAll = _Uize.applyAll,
					_Uize_Event_Bus = Uize.Event.Bus,

			/*** General Variables ***/
				_sacredEmptyArray = [],
				_sacredEmptyObject = {},
				_constOnChangeModeOnce = 1,
				_constOnChangeModeWhenever = 2,
				_derivationCache = {}
		;

		function _createSubclass (_class,_alphastructor,_omegastructor) {
			function _valueOf () {
				return this [_getPropertyPrivateName (this,'value')];
				/*?
					Instance Methods
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

							In certain contexts, providing a reference to a =Uize.Class= subclass instance as a parameter to some method will result in the =toString Intrinsic Method= of that instance being invoked in order to resolve it to a string value. If it is your desire to have the value used rather than the string serialization, then you should explicitly call the =valueOf Intrinsic Method=, as follows...

							EXAMPLE
							.....................................................
							alert (page.children.markupPercentSlider.valueOf ());
							.....................................................

							In this example, the current value of the =markupPercentSlider= widget will be displayed in the alert dialog, rather than the string serialization. You can also use shortcuts, as follows...

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
							- see also the =Uize.Class.valueOf= static intrinsic method
							- if the instance's class does not declare a =value= state property, then this method will return the value of the instance's =value= property, and if the instance has no =value= property, then this method will simply return =undefined=
				*/
			}

			var
				_subclass = _Uize.noNew (
					function () {
						var _arguments = arguments;
						_applyAll (this,_alphastructors,_arguments);
						_applyAll (this,_omegastructors,_arguments);
					}
				),
				_subclassPrototype = _subclass.prototype
			;

			/*** Inherit static properties (excluding prototype) and methods from base class ***/
				var
					_nonInheritableStatics = _class.nonInheritableStatics || _sacredEmptyObject,
					_clone = _Uize.clone
				;
				for (var _property in _class)
					if (!_nonInheritableStatics [_property] && _property != 'prototype')
						_subclass [_property] = _clone (_class [_property])
				;

			/*** Prepare instance properties and methods ***/
				/*** Inherit instance properties and methods from base class (from prototype) ***/
					_copyInto (_subclassPrototype,_class.prototype);

					/*** Make sure valueOf is copied ***/
						/* NOTE: in IE, valueOf isn't an enumerable property of the prototype object */
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
					_subclass.nonInheritableStatics = {_singletons:1,nonInheritableStatics:1};
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

			/*** Initialize Alphastructors and Omegastructors ***/
				var
					_alphastructors = _subclass._alphastructors = (_class._alphastructors || _sacredEmptyArray).concat (),
					_omegastructors = _subclass._omegastructors = (_class._omegastructors || _sacredEmptyArray).concat ()
				;
				_alphastructor && _alphastructors.push (_alphastructor);
				_omegastructor && _omegastructors.push (_omegastructor);

			_subclass._propertyProfilesByPrivateName || (_subclass._propertyProfilesByPrivateName = {});
			_subclass._propertyPrivateNameLookup || (_subclass._propertyPrivateNameLookup = {});

			return _subclass;
		}

		/*** Class Constructor ***/
			var _class = _createSubclass (
				function () {},
				/*** alphastructor ***/
					function () {
						var m = this;

						/*** Public Instance Properties ***/
							m.instanceId = _Uize.getGuid ();
								/*?
									Instance Properties
										instanceId
											An automatically generated name, that can be used as a means of identifying the specific instance in other code.

											When designing JavaScript classes, it is sometimes necessary in the class's implementation to set intervals, timeouts, or the event handlers of HTML nodes that make up an instance's user interface, so that they execute methods of the instance. Sometimes this must be done by generating JavaScript code that is to be interpreted. This generated code must, therefore, be able to reference its instance using a global identifier, because the code will be executed in a global context.

											If the constructor of your class uses the automatically generated value of an instance's =instanceId= property to assign a global reference to the instance, with a statement like =window [m.instanceId] &#61; m=, then the =instanceId= property can be used when generating JavaScript code that is to execute methods on the instance. Consider the following example...

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

						/*** Private Instance Properties ***/
							(m._eventBus = new _Uize_Event_Bus).wireUnwireWrapper = function (_eventName,_wireUnwire) {
								if (_eventName.charCodeAt (0) == 67 && !_eventName.indexOf ('Changed.')) {
									var
										_propertyPublicName = _eventName.slice (8),
										_propertyProfile = _getClass (m)._propertyProfilesByPrivateName [
											_getPropertyPrivateName (m,_propertyPublicName)
										]
									;
									if (_propertyProfile && _propertyPublicName != _propertyProfile._publicName)
										// use the canonical public name, since an alias could have been specified
										_eventName = 'Changed.' + (_propertyPublicName = _propertyProfile._publicName)
									;
									_wireUnwire (_eventName);
									(m._hasChangedHandlers || (m._hasChangedHandlers = {})) [_propertyPublicName] =
										this.hasHandlers (_eventName)
									;
								} else {
									_wireUnwire (_eventName);
								}
							};
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
								else if ((_propertyDefault = _instancePropertyDefaults [_property]) !== undefined)
									_propertiesForSet [_property] = _propertyDefault
								;
							}
							for (_property in _properties)
								_property in _propertiesForSet || (_propertiesForSet [_property] = _properties [_property])
							;
							this.set (_propertiesForSet);
					}
			);

			/*** Seed Feature Declaration Methods ***/
				Uize.Oop.mClassFeatureDeclaration (_class);

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
							- this method may be called multiple times for a class to cumulatively define or override features
							- see the other `feature declaration methods`
				*/

				/*?
					Static Methods
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
							- this method may be called multiple times for a class to cumulatively define or override features
							- see the other `feature declaration methods`
				*/

				/*?
					Static Methods
						Uize.Class.staticMethods
							Lets you conveniently declare one or more static methods, by specifying the methods in an object.

							SYNTAX
							.........................................
							MyClass.staticMethods (staticMethodsOBJ);
							.........................................

							NOTES
							- this method may be called multiple times for a class to cumulatively define or override features
							- see the other `feature declaration methods`
				*/

				/*?
					Static Methods
						Uize.Class.staticProperties
							Lets you conveniently declare one or more static properties, by specifying the properties and their initial values in an object.

							SYNTAX
							............................................
							MyClass.staticMethods (staticPropertiesOBJ);
							............................................

							NOTES
							- compare to the =Uize.Class.stateProperties= static method
							- this method may be called multiple times for a class to cumulatively define or override features
							- see the other `feature declaration methods`
				*/

				/*?
					Static Methods
						Uize.Class.dualContextMethods
							Lets you conveniently declare one or more dual context methods, by specifying the methods in an object.

							SYNTAX
							...................................................
							MyClass.dualContextMethods (dualContextMethodsOBJ);
							...................................................

							NOTES
							- this method may be called multiple times for a class to cumulatively define or override features
							- see the other `feature declaration methods`

						Uize.Class.dualContextProperties
							Lets you conveniently declare one or more dual context properties, by specifying the properties and their initial values in an object.

							SYNTAX
							......................................................
							MyClass.dualContextMethods (dualContextPropertiesOBJ);
							......................................................

							NOTES
							- compare to the =Uize.Class.stateProperties= static method
							- this method may be called multiple times for a class to cumulatively define or override features
							- see the other `feature declaration methods`
				*/

				/*?
					Static Methods
						Uize.Class.declare
							Lets you declare one or more features of one or more different feature types for the class.

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

		/*** Property System Support Code ***/
			function _getPropertyPrivateName (m,_propertyPublicOrPrivateName) {
				return (
					_getClass (m)._propertyPrivateNameLookup [_propertyPublicOrPrivateName] ||
					_propertyPublicOrPrivateName
				);
			}

			function _resolveDerivation (_derivation) {
				var
					_derivationIsPlainObject = Uize.isPlainObject (_derivation),
					_derivationCacheKey = _derivationIsPlainObject
						? _derivation.properties + ' : ' + _derivation.derivation
						: _derivation + '',
					_resolvedDerivation = _derivationCache [_derivationCacheKey]
				;
				function _getDeterminantsFromListStr (_determinantsStr) {
					return (
						_determinantsStr
							.replace (/\s+/g,'')  // strip whitespace
							.replace ('/**/','')  // get rid of silly "/**/" generated by Chrome serialization
							.split (',')
					);
				}
				if (!_resolvedDerivation) {
					var
						_determinants,
						_determiner
					;
					if (_derivationIsPlainObject) {
						_determinants = _derivation.properties;
						if (typeof _determinants == _typeString)
							_determinants = _getDeterminantsFromListStr (_determinants)
						;
						_determiner = _derivation.derivation;
					} else if (_isFunction (_derivation)) {
						_determinants = _getDeterminantsFromListStr ((_derivation + '').match (/\(([^\)]*)\)/) [1]);
						_determiner = _derivation;
					} else {
						if (typeof _derivation == _typeString) {
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

			function _onChange (m,_derivation,_handler,_mode) {
				var
					_isOnceMode = _mode == _constOnChangeModeOnce,
					_isWheneverMode = _mode == _constOnChangeModeWhenever,
					_derivation = _resolveDerivation (_derivation),
					_determinantsValuesHarvester = _derivation._determinantsValuesHarvester,
					_determiner = _derivation._determiner,
					_isFirstCall = true,
					_lastDerivedValue,
					_wirings
				;
				function _checkDerivedValue () {
					var
						_determinantsValues = _determinantsValuesHarvester.call (m),
						_derivedValue = _determiner.apply (m,_determinantsValues)
					;
					if (_isOnceMode || _isWheneverMode)
						_derivedValue = !!_derivedValue
					;
					if (_isFirstCall || _derivedValue !== _lastDerivedValue) {
						_isFirstCall = false;
						_isOnceMode && _derivedValue && _wirings && m.unwire (_wirings);
						_isOnceMode || _isWheneverMode
							? _derivedValue && (_isOnceMode || !_derivedValue != !_lastDerivedValue) &&
								_handler.apply (0,_determinantsValues)
							: _handler.call (0,_derivedValue,_determinantsValues)
						;
						_lastDerivedValue = _derivedValue;
					}
				}
				_checkDerivedValue ();
				_isOnceMode && _lastDerivedValue
					? (_wirings = {})
					: m.wire (_wirings = _lookup (_derivation._changedEventNames,_checkDerivedValue))
				;
				return _wirings;
			}

		return _class.declare ({
			instanceMethods:{
				onChange:function (_derivation,_handler) {
					return _onChange (this,_derivation,_handler);
					/*?
						Instance Methods
							onChange
								Lets you register a handler function that should be executed each time the value of the specified `state properties derivation` changes.

								SYNTAX
								..........................................................................
								wiringsOBJ = myInstance.onChange (derivationSTRorARRAYorFUNC,handlerFUNC);
								..........................................................................

								The way that this method behaves is best illustrated by an example...

								EXAMPLE
								..........................................................................................
								// create a Rectangle class with width and height state properties
								var Rectangle = Uize.Class.subclass ({
									stateProperties:{
										width:{value:10},
										height:{value:10}
									}
								});

								// create an instance of the Rectangle class
								var rectangle = Rectangle ();

								// register a handler for when the computed area changes
								// the value "100" will be alerted, since the handler is always executed initially
								rectangle.onChange (
									function (width,height) {return width * height},
									function (area) {alert (area)}
								);

								rectangle.set ({width:20,height:10});  // area changes, so the value "200" will be alerted
								rectangle.set ({width:10,height:20});  // area hasn't changed, so nothing will be alerted
								..........................................................................................

								In the above example, we are creating a simple =Rectangle= class with =width= and =height= state properties that each have an initial value of =10=. After creating an instance of this class, we register a handler for a `state properties derivation` that is defined to compute the rectangle's area from the values of its =width= and =state= properties.

								By design, the handler is executed immediately upon first computing the value of the derivation. This results in the text "100" being alerted, which is the rectangle's area at the time of registering the change handler. Next, we call the =set= method on the =rectangle= instance, setting the width to =20= and the height to =10=. This results in the area changing to =200= and the change handler is executed again, this time alerting the text "200". Finally, we call =set= one more time, this time setting the width to =10= and the height to =20=. Because the area of the rectangle after this set will still be =200=, the change handler is not executed again.

								Change Handler Signature
									The handler for a change event can expect to receive the following two parameters...

									- *derived value* - the new computed value for the `state properties derivation`
									- *determinants values* - an array, containing the values of all the determinants (i.e. the state properties) used in deriving the value, in the order in which they occur in the definition for the derivation

									EXAMPLE
									........................................................................................
									rectangle.onChange (
										function (width,height) {return width * height},
										function (area,determinants) {
											alert ('Area: ' + area + ' (' + determinants [0] + ' x ' + determinants [1] + ')')
										}
									);
									........................................................................................

									In the above example, we are registering a handler for a `state properties derivation` that derives an area value from the =width= and =height= state properties of a =rectangle= instance. In addition to declaring an =area= argument for the derived value, the handler function is also declaring a =determinants= argument that can be used to inspect the values of the derivation's determinants (the =width= and =height= state properties, respectively). Because the derivation was declared with =width= first and =height= second, this will be the order of the properties' values in the array passed via the =determinants= argument.

									Arguments Optional
										While the *derived value* and *determinanrs values* parameters will be passed to the handler function, there's no requirement that a handler function declare arguments for them or use them.

										In many cases, you may only care to know the new derived value and not need to know the specific values of the determinants. In such cases, your handler function can declare only a single argument for the derived value.

								Unwiring onChange Handlers
									The =onChange= instance method returns a `wirings object`, which provides a means with which to unwire all the event wirings associated with registering a handler using this method.

								NOTES
								- compare to the related =once= and =whenever= instance methods
					*/
				},

				once:function (_condition,_handler) {
					return _onChange (this,_condition,_handler,_constOnChangeModeOnce);
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

								Execute Code Once Multiple State Properties Are Truthy or Falsy
									Code can be registered to be executed once a compound "and" style condition involving multiple state properties become truthy, by specifying the state properties using the =propertiesConditionSTRorARRAY= parameter.

									SYNTAX
									.........................................................................
									wiringsOBJ = myInstance.once (propertiesConditionSTRorARRAY,handlerFUNC);
									.........................................................................

									The =propertiesConditionSTRorARRAY= parameter allows the state properties to be specified either as a comma-separated list string, or as an array of property name strings. In either form, the name of any property can be prefixed with a "!" (exclamation mark) character to achieve `condition inversion` for the individual property. The condition, as a whole, is truthy when all of the state property sub-parts of the condition are truthy (taking into account optional inversion for any state property).

								Execute Code Once a Compound Condition is Met
									Code can be registered to be executed once a compound condition is met, by specifying the compound condition in the form of a `condition function` or `condition expression string`.

									SYNTAX
									.................................................................
									wiringsOBJ = myInstance.once (compoundConditionFUNC,handlerFUNC);
									wiringsOBJ = myInstance.once (compoundConditionSTR,handlerFUNC);
									.................................................................

								Immediate Execution if Condition Already Met
									If the condition specified in the call to the =once= method is already met at the time that the method is called, then the handler specified by the =handlerFUNC= parameter will be executed immediately.

									Otherwise, handlers will be wired for the =Changed.*= (value change) events for all the state properties that affect the condition (the `determinants`). The condition evaluator will be executed each time any of the watched properties change value. As soon as the condition becomes met (i.e. the condition evaluator produces a truthy result), the handlers wired to watch the value change events of the properties will be unwired and the handler function registered for the condition will be executed. By design, the handler is only executed for the first time that the condition becomes met.

								For More Information
									The concept of a condition is common to multiple instance methods of the =Uize.Class= module.

									For more information, consult the section on the `condition system`. In particular, see the in-depth section on `specifying conditions`, which covers the common way in which conditions can be specified when using the =isMet=, =once=, and =whenever= instance methods. See also the section on the `condition handler` for information on the arguments it receives and the context on which it is called.

								NOTES
								- compare to the related =whenever= instance method
								- see the other `condition system methods`
					*/
				},

				whenever:function (_condition,_handler) {
					return _onChange (this,_condition,_handler,_constOnChangeModeWhenever);
					/*?
						Instance Methods
							whenever
								Lets you register a handler that should be executed whenever the specified condition becomes met (i.e. changes from being falsy to being truthy).

								The =whenever= method is useful when using one or more state properties to form a condition, and where you wish to register code that should be executed every time the condition changes state from not being met to being met, and immediately if the condition is already met at the time that the =whenever= method is called.

								DIFFERENT USAGES

								`Execute Code Whenever a State Property Becomes Truthy or Falsy`
								....................................................................
								wiringsOBJ = myInstance.whenever (propertyConditionSTR,handlerFUNC);
								....................................................................

								`Execute Code Whenever Multiple State Properties Become Truthy or Falsy`
								.............................................................................
								wiringsOBJ = myInstance.whenever (propertiesConditionARRAYorSTR,handlerFUNC);
								.............................................................................

								`Execute Code Whenever a Compound Condition Becomes Met`
								..........................................................................
								wiringsOBJ = myInstance.whenever (compoundConditionSTRorFUNC,handlerFUNC);
								..........................................................................

								Execute Code Whenever a State Property Becomes Truthy or Falsy
									In its most basic usage, code can be registered to be executed whenever a single state property becomes truthy or falsy.

									SYNTAX
									....................................................................
									wiringsOBJ = myInstance.whenever (propertyConditionSTR,handlerFUNC);
									....................................................................

									The =propertyConditionSTR= parameter specifies the name of a state property, with an optional "!" (exclamation mark) prefix for indicating `condition inversion`. If simply the name of a state property is specified, then the handler code specified by the =handlerFUNC= parameter will be executed whenever the property becomes truthy. If the optional "!" prefix is specified, then the handler code will be executed whenever the property becomes falsy.

								Execute Code Whenever Multiple State Properties Become Truthy or Falsy
									Code can be registered to be executed whenever a compound "and" style condition involving multiple state properties become truthy, by specifying the state properties using the =propertiesConditionSTRorARRAY= parameter.

									SYNTAX
									.............................................................................
									wiringsOBJ = myInstance.whenever (propertiesConditionARRAYorSTR,handlerFUNC);
									.............................................................................

									The =propertiesConditionSTRorARRAY= parameter allows the state properties to be specified either as a comma-separated list string, or as an array of property name strings. In either form, the name of any property can be prefixed with a "!" (exclamation mark) character to achieve `condition inversion` for the individual property. The condition, as a whole, is truthy when all of the state property sub-parts of the condition are truthy (taking into account optional inversion for any state property).

								Execute Code Whenever a Compound Condition Becomes Met
									Code can be registered to be executed whenever a compound condition becomes met, by specifying the compound condition in the form of a `condition function` or `condition expression string`.

									SYNTAX
									.....................................................................
									wiringsOBJ = myInstance.whenever (compoundConditionFUNC,handlerFUNC);
									wiringsOBJ = myInstance.whenever (compoundConditionSTR,handlerFUNC);
									.....................................................................

								Immediate Execution if Condition Already Met
									If the condition specified in the call to the =whenever= method is already met at the time that the method is called, then the handler specified by the =handlerFUNC= parameter will be executed immediately.

									Handlers will also be wired for the =Changed.*= (value change) events for all the state properties that affect the condition (the `determinants`). The condition evaluator will be executed each time any of the watched properties change value. Whenever the condition becomes met (i.e. the condition evaluator produces a truthy result after previously having produced a falsy result), the handler function registered for the condition will be executed.

								For More Information
									The concept of a condition is common to multiple instance methods of the =Uize.Class= module.

									For more information, consult the section on the `condition system`. In particular, see the in-depth section on `specifying conditions`, which covers the common way in which conditions can be specified when using the =isMet=, =once=, and =whenever= instance methods. See also the section on the `condition handler` for information on the arguments it receives and the context on which it is called.

								NOTES
								- compare to the related =once= instance method
								- see the other `condition system methods`
					*/
				},

				is:function (_property) {
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
				},

				isMet:function (_condition) {
					var _derivation = _resolveDerivation (_condition);
					return _derivation._determiner.apply (this,_derivation._determinantsValuesHarvester.call (this));
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

								For More Information
									The concept of a condition is common to multiple instance methods of the =Uize.Class= module.

									For more information, consult the section on the `condition system`. In particular, see the in-depth section on `specifying conditions`, which covers the common way in which conditions can be specified when using the =isMet=, =once=, and =whenever= instance methods.

								NOTES
								- see the other `condition system methods`
					*/
				},

				met:function (_propertyOrProperties) {
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
				},

				unmet:function (_propertyOrProperties) {
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
				},

				kill:function () {
					var _instanceId = this.instanceId;
					_Uize.eval ('if(typeof ' + _instanceId + '!=\'undefined\')' + _instanceId + '=null');
					this.unwire();
					/*?
						Instance Methods
							kill
								Nulls out the global variable (or property of the =window= object) of the name =instanceId= and unwires all event handlers of the object..

								This method may be useful if global (or window object level) references are made to instances of a class, usually for the purpose of group management, or the implementation of certain kinds of state exclusivity amongst instances of a class. This method is also intended to be overridden by subclasses where additional destructor style code may be desired.
					*/
				}
			},

			staticMethods:{
				subclass:function (_arg0,_arg1) {
					return (
						arguments.length == 1 && !_isFunction (_arg0)
							? _createSubclass (this).declare (_arg0)
							: _createSubclass (this,_arg0,_arg1)
					);
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
									As a convenience, the =Uize.Class.subclass= method supports a variation that takes a single object parameter, as a means of declaring features by type when creating a class.

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
				},

				alphastructor:function (_alphastructor) {
					this._alphastructors.push (_alphastructor);
					/*?
						Static Methods
							Uize.Class.alphastructor
								Lets you declare the alphastructor for the class.

								SYNTAX
								..........................................
								MyClass.alphastructor (alphastructorFUNC);
								..........................................

								NOTES
								- see the other `feature declaration methods`
					*/
				},

				omegastructor:function (_omegastructor) {
					this._omegastructors.push (_omegastructor);
					/*?
						Static Methods
							Uize.Class.omegastructor
								Lets you declare the omegastructor for the class.

								SYNTAX
								..........................................
								MyClass.omegastructor (omegastructorFUNC);
								..........................................

								NOTES
								- see the other `feature declaration methods`
					*/
				},

				stateProperties:function (_propertyProfiles) {
					var
						m = this,
						_propertyProfilesByPrivateName = m._propertyProfilesByPrivateName,
						_propertyPrivateNameLookup = m._propertyPrivateNameLookup,
						_declaredDerivedProperties
					;
					for (var _propertyName in _propertyProfiles) {
						var
							_rawPropertyProfile = _propertyProfiles [_propertyName],
							_rawPropertyProfileIsObject = _isObject (_rawPropertyProfile),
							_propertyPrivateName = _propertyPrivateNameLookup [_propertyName] || _propertyName,
							_rawPropertyProfilePublicName =
								_rawPropertyProfileIsObject ? _rawPropertyProfile.name : _rawPropertyProfile,
							_propertyPublicName = _rawPropertyProfilePublicName || _propertyName,
							_propertyProfile =
								_propertyProfilesByPrivateName [_propertyPrivateName] ||
								_propertyProfilesByPrivateName [_propertyPublicName] // if not found by private name, try public name in case the property was registered by public name first
						;
						_propertyPrivateNameLookup [_propertyPrivateName] = _propertyPrivateName;
						if (!_propertyProfile)
							_propertyProfile = _propertyProfilesByPrivateName [_propertyPrivateName] = {
								_privateName:_propertyPrivateName
							}
						;
						var _propertyProfilePublicName = _propertyProfile._publicName;
						if (!_propertyProfilePublicName || _rawPropertyProfilePublicName != _propertyProfilePublicName) {
							if (_propertyPublicName.indexOf ('|') > -1) {
								var _aliases = _propertyPublicName.split ('|');
								_lookup (_aliases,_propertyPrivateName,_propertyPrivateNameLookup);
								_propertyPublicName = _aliases [0];
							} else {
								_propertyPrivateNameLookup [_propertyPublicName] = _propertyPrivateName;
							}
							_propertyProfilePublicName || (_propertyProfile._publicName = _propertyPublicName);
						}
						if (_rawPropertyProfileIsObject) {
							var _rawPropertyProfileOnChange = _rawPropertyProfile.onChange;
							if (_rawPropertyProfileOnChange) {
								var _propertyProfileOnChange = _propertyProfile._onChange;
								_propertyProfile._onChange = _propertyProfileOnChange
									? [].concat (_propertyProfileOnChange,_rawPropertyProfileOnChange)
									: _rawPropertyProfileOnChange
								;
							}
							if (_rawPropertyProfile.conformer) _propertyProfile._conformer = _rawPropertyProfile.conformer;
							if (_rawPropertyProfile.derived) {
								_declaredDerivedProperties = true;
								var _derivation = _resolveDerivation (_rawPropertyProfile.derived);
								_derivation._determinantsChanged = _Function (
									'o',
									'return ' + _map (_derivation._determinants,"'\"' + value + '\" in o'").join (' || ')
								);
								_propertyProfile._derivation = _derivation;
							}
							if ('value' in _rawPropertyProfile)
								m [_propertyPrivateName] = _rawPropertyProfile.value
							;
						}
					}
					var _instancePropertyDefaults = m._instancePropertyDefaults = m.get ();
					if (_declaredDerivedProperties) {
						for (
							var
								_getDerivation = function (_property) {
									return (
										_propertyProfilesByPrivateName [_propertyPrivateNameLookup [_property]] ||
										_sacredEmptyObject
									)._derivation;
								},
								_derivedProperties = m._derivedProperties = [],
								_properties = _traceDependencies (
									_Uize.keys (_instancePropertyDefaults),
									function (_property) {
										var _derivation = _getDerivation (_property);
										return _derivation ? _derivation._determinants : _sacredEmptyArray;
									}
								),
								_propertiesLength = _properties.length,
								_propertyPublicName,
								_propertyNo = -1
							;
							++_propertyNo < _propertiesLength;
						) {
							_getDerivation (_propertyPublicName = _properties [_propertyNo]) &&
								_derivedProperties.push (_propertyPublicName)
							;
						}
					}
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
								- this method may be called multiple times for a class to cumulatively define or override features
								- see the other `feature declaration methods`
					*/
				},

				doMy:function (_instance,_methodName,_arguments) {
					return this.prototype [_methodName].apply (_instance,_arguments || _sacredEmptyArray);
					/*?
						Static Methods
							Uize.Class.doMy
								Lets you call an instance method of the class on a specified instance.

								DIFFERENT USAGES

								`Call a Class' Instance Method on an Instance, Without Supplying Arguments`
								.............................................................
								resultANYTYPE = MyClass.doMy (instanceOBJ,instanceMethodSTR);
								.............................................................

								`Call a Class' Instance Method on an Instance, Supplying Arguments`
								...........................................................................
								resultANYTYPE = MyClass.doMy (instanceOBJ,instanceMethodSTR,argumentsLIST);
								...........................................................................

								Calling a Superclass' Instance Methods
									The =Uize.Class.doMy= method is most useful when calling a superclass' version of an instance method on an instance, and produces a more concise and readable form than the typical approach.

									INSTEAD OF...
									.............................................
									_superclass.prototype.someMethod.call (this);
									.............................................

									USE...
									.....................................
									_superclass.doMy (this,'someMethod');
									.....................................

									The =Uize.Class.doMy= method also supports calling a superclass' instance methods with arguments, as follows...

									INSTEAD OF...
									...................................................................
									_superclass.prototype.someMethod.apply (this,[arg1,arg2,...,argN]);
									...................................................................

									USE...
									..........................................................
									_superclass.doMy (this,'someMethod',[arg1,arg2,...,argN]);
									..........................................................

									As you can tell from the above before-and-after examples, using the =Uize.Class.doMy= method produces code that is both a bit more concise as well as mentally easier to parse.

								Call a Class' Instance Method on an Instance, Without Supplying Arguments
									In its most simple form, a class' instance method can be called on an instance, without supplying arguments, by specifying just the instance reference and the instance method name as arguments.

									SYNTAX
									.............................................................
									resultANYTYPE = MyClass.doMy (instanceOBJ,instanceMethodSTR);
									.............................................................

									EXAMPLE
									...........................................................
									return _superclass.subclass ({
										instanceMethods:{
											wireUi:function () {
												if (!this.isWired) {
													// do some wiring specific to this widget class

													_superclass.doMy (this,'wireUi');
												}
											}
										}
									});
									...........................................................

									In the above example, a subclass is being created with an overrided implementation for the =wireUi= instance method. In this method, additional code is being executed (represented by the placeholder comment) before the superclass' version of the =wireUi= method is called on the instance.

								Call a Class' Instance Method on an Instance, Supplying Arguments
									When an instance method of a class needs to be called with arguments, the arguments can be specified with the optional =argumentsLIST= argument.

									SYNTAX
									...........................................................................
									resultANYTYPE = MyClass.doMy (instanceOBJ,instanceMethodSTR,argumentsLIST);
									...........................................................................

									EXAMPLE
									........................................................
									return _superclass.subclass ({
										instanceMethods:{
											someMethod:function (foo,bar,baz,qux) {
												_superclass.doMy (this,'someMethod',[foo,bar]);

												// now do extra stuff for subclass
											}
										}
									});
									........................................................

									In the above example, a subclass is being created with an overrided implementation for the superclass' =someMethod= instance method. Now, the superclass' version of =someMethod= supports =foo= and =bar= arguments, while the overrided version also supports the additional =baz= and =qux= arguments. In the overrided implementation, we first call the superclass' version of the method on the instance, passing just the =foo= and =bar= arguments that it supports, after which the additional code in the overrided version is executed (represented by the comment placeholder, and presumably making use of the additional =baz= and =qux= arguments).
					*/
				},

				singleton:function (_scope,_properties) {
					var
						m = this,
						_singletons = m._singletons || (m._singletons = {}),
						_singleton = _singletons [_scope || (_scope = '')]
					;
					_singleton
						? _properties && _singleton.set (_properties)
						: (_singleton = _singletons [_scope] = m (_properties))
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
				}
			},

			dualContextMethods:{
				get:function (_property) {
					if (typeof _property == _typeString) {
						/* NOTE:
							Because the get method gets hit so heavily, optimize it to do as little as possible in the most common use case (where parameter is a string, being the name of the property), so no creation of and assignment to local variables.
						*/
						return this [_getPropertyPrivateName (this,_property)];
					} else {
						var
							m = this,
							_result = {}
						;
						if (!_property) {
							/* NOTE:
								Driven off of private names to ensure that there is only one property in the object for each actual state property, otherwise you can end up in bad situations.
							*/
							var
								_class = _getClass (m),
								_propertyProfilesByPrivateName = _class._propertyProfilesByPrivateName
							;
							for (var _propertyPrivateName in _propertyProfilesByPrivateName)
								_result [_propertyProfilesByPrivateName [_propertyPrivateName]._publicName] =
									m [_propertyPrivateName]
							;
							if (_isInstance (m)) {
								var _adHocProperties = m._adHocProperties;
								if (_adHocProperties)
									for (_property in _adHocProperties) _result [_property] = m [_property]
								;
							}
						} else if (_isArray (_property)) {
							for (
								var _subPropertyNo = -1, _totalSubProperties = _property.length;
								++_subPropertyNo < _totalSubProperties;
							) {
								var _subProperty = _property [_subPropertyNo];
								_result [_subProperty] = m [_getPropertyPrivateName (m,_subProperty)];
							}
						} else {
							for (var _subProperty in _property)
								_result [_subProperty] = m [_getPropertyPrivateName (m,_subProperty)]
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
				},

				set:function (_properties) {
					/* NOTE:
						Yes, there are functions _getClass and _getPropertyPrivateName that could be used (and were at one point), but this code needs to be tuned for performance since set is a touch point in so many places.
					*/
					var
						m = this,
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
							? _Uize.pairUp.apply (0,_arguments)
							: _lookup (_properties,_arguments [1])
					;
					var
						_thisIsInstance = _isInstance (m),
						_class = _thisIsInstance ? m.Class : m,
						_propertyProfilesByPrivateName = _class._propertyProfilesByPrivateName,
						_propertyPrivateNameLookup = _class._propertyPrivateNameLookup,
						_propertyProfile,
						_onChangeHandlers,
						_propertiesChanged = {},
						_onChangeHandlerAddedFlagName = 'handlerAlreadyAdded',
						_onChangeHandler,
						_hasChangedHandlers = _thisIsInstance && m._hasChangedHandlers,
						_hasChangedDotStarHandlers = _hasChangedHandlers && _hasChangedHandlers ['*'],
						_propertiesForChangedDotStar,
						_changedEventsToFire,
						_propertyPrivateName,
						_propertyPublicName,
						_propertiesToDeclare,
						_propertyValue,
						_propertiesBeingSet,
						_derivedProperties = _class._derivedProperties || _sacredEmptyArray,
						_propertiesKeys = [],
						_propertyPublicOrPrivateName
					;
					for (_propertyPublicOrPrivateName in _properties) {
						_propertyProfile = _propertyProfilesByPrivateName [
							_propertyPrivateNameLookup [_propertyPublicOrPrivateName] || _propertyPublicOrPrivateName
						];
						if (!_propertyProfile || !_propertyProfile._derivation)
							_propertiesKeys.push (_propertyPublicOrPrivateName)
						;
					}
					for (
						var
							_propertyNo = -1,
							_propertiesKeysLength = _propertiesKeys.length,
							_propertiesKeysPlusDerivedLength =
								_propertiesKeysLength + (_thisIsInstance && _derivedProperties.length)
						;
						++_propertyNo < _propertiesKeysPlusDerivedLength;
					) {
						var _isDerivedProperty = _propertyNo >= _propertiesKeysLength;
						_propertyPublicOrPrivateName = _isDerivedProperty
							? _derivedProperties [_propertyNo - _propertiesKeysLength]
							: _propertiesKeys [_propertyNo]
						;
						_propertyProfile = _propertyProfilesByPrivateName [
							_propertyPrivateNameLookup [_propertyPublicOrPrivateName] || _propertyPublicOrPrivateName
						];
						if (_isDerivedProperty) {
							var _derived = _propertyProfile._derivation;
							if (_derived._determinantsChanged (_propertiesChanged)) {
								_propertyValue = _derived._determiner.apply (
									m,
									_derived._determinantsValuesHarvester.call (m)
								);
							} else {
								continue;
							}
						} else {
							_propertyValue = _properties [_propertyPublicOrPrivateName];
						}
						if (_propertyProfile) {
							_propertyPrivateName = _propertyProfile._privateName;
							_propertyPublicName = _propertyProfile._publicName;
						} else {
							_propertyPrivateName = _propertyPublicName = _propertyPublicOrPrivateName;
							_propertyProfile = _thisIsInstance ? {} : {value:_propertyValue};
							_thisIsInstance
								? (
									(m._adHocProperties || (m._adHocProperties = {})) [_propertyPublicOrPrivateName] =
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
											m,_propertyValue,m [_propertyPrivateName]
										)
									)
									: _propertyValue
						;
						if (_propertyValue !== m [_propertyPrivateName]) {
							if (_thisIsInstance) {
								_propertiesChanged [_propertyPublicName] =
									_propertiesChanged [_propertyPrivateName] = 1
								;

								/*** build up list of events to fire for 'Changed.' event handlers ***/
									_hasChangedDotStarHandlers && (
										(_propertiesForChangedDotStar || (_propertiesForChangedDotStar = {}))
											[_propertyPublicName] = _propertyValue
									);
									_hasChangedHandlers && _hasChangedHandlers [_propertyPublicName] &&
										(_changedEventsToFire || (_changedEventsToFire = [])).push (
											_propertyPublicName,
											_propertyValue
										)
									;

								/*** build up list of onChange handlers to execute ***/
									var _processOnChangeHandler = function (_onChangeHandler) {
										if (typeof _onChangeHandler == _typeString)
											_onChangeHandler = m [_onChangeHandler]
										;
										if (_isFunction (_onChangeHandler)) {
											if (!_onChangeHandler [_onChangeHandlerAddedFlagName]) {
												_onChangeHandler [_onChangeHandlerAddedFlagName] = 1;
												(_onChangeHandlers || (_onChangeHandlers = [])).push (_onChangeHandler);
											}
										} else if (_isArray (_onChangeHandler)) {
											_forEach (_onChangeHandler,_processOnChangeHandler);
										}
									};
									_propertyProfile._onChange && _processOnChangeHandler (_propertyProfile._onChange);
							}
							m [_propertyPrivateName] = _propertyValue;
						}
					}
					_propertiesToDeclare && _class.stateProperties (_propertiesToDeclare);
					if (_thisIsInstance) {
						if (_onChangeHandlers) {
							var _onChangeHandlersLength = _onChangeHandlers.length;

							/*** remove all onChange handler added flags before executing any handlers ***/
								for (var _handlerNo = _onChangeHandlersLength; --_handlerNo >= 0;)
									delete _onChangeHandlers [_handlerNo] [_onChangeHandlerAddedFlagName]
								;

							/*** execute handlers, after flags have been cleared ***/
								for (var _handlerNo = -1; ++_handlerNo < _onChangeHandlersLength;)
									_onChangeHandlers [_handlerNo].call (m,_propertiesBeingSet)
								;
						}
						_propertiesForChangedDotStar &&
							m.fire ({name:'Changed.*',properties:_propertiesForChangedDotStar})
						;
						if (_changedEventsToFire) {
							for (
								var _changedEventNo = -1, _totalChangedEventsToFire = _changedEventsToFire.length / 2;
								++_changedEventNo < _totalChangedEventsToFire;
							)
								m.fire ({
									name:'Changed.' + _changedEventsToFire [_changedEventNo * 2],
									newValue:_changedEventsToFire [_changedEventNo * 2 + 1]
								})
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
											If a state property has aliases, handlers can be registered for the property's changed event using any of the aliases. However, the name of the event when it fires will always be derived from the primary public name (i.e. first in the alias list) of the property. So, for example, if a state property was declared with the public names =color= and =hexRgb=, both =Changed.color= and =Changed.hexRgb= would be treated as equivalent.

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

										Event Object Contains newValue Property
											When a =Changed.[propertyName]= event fires for a particular state property that has changed value, the event object that is passed as an argument to any handlers of the event will contain a =newValue= property to indicate the new value of the state property.

											This allows us to access the new value of the state property without having to access the instance that owns the property in order to call its =get= method to get the value for the property.

											INSTEAD OF...
											..........................................................
											myWidget.addChild ('slider',Uize.Widget.Bar.Slider).wire (
												'Changed.value',
												function (event) {
													console.log (event.source.get ('value'));
												}
											);
											..........................................................

											USE...
											..........................................................
											myWidget.addChild ('slider',Uize.Widget.Bar.Slider).wire (
												'Changed.value',
												function (event) {
													console.log (event.newValue);
												}
											);
											..........................................................

											In the above example, we're adding a slider child widget to the =myWidget= parent widget. Because the =addChild= instance method returns a reference to the added child widget, we can chain a call to the child's =wire= method in order to wire a handler for its =Changed.value= event.

											Now, without the =newValue= property of the event object, we could either access the new value by getting to the instance through the =source= object of the event (as in =event.source.get ('value')=), or we could dereference the child widget from the =myWidget= parent (as in =myWidget.children.slider.get ('value')=).

											Both of these approaches are more cumbersome than simply using the =newValue= property that is provided as part of the event object for =Changed.[propertyName]= events.

										NOTES
										- compare to the related =Changed.*= instance event
							*/
						}
					} else {
						_class._instancePropertyDefaults = m.get ();
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
				},

				toggle:function (_propertyName) {
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
				},

				wire:function () {
					var _eventBus = this._eventBus || (this._eventBus = new _Uize_Event_Bus);
					_eventBus.wire.apply (_eventBus,arguments);
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
								..................................................................
								mySlider.wire (
									'Changed.value',
									function (event) {console.log ('NEW VALUE: ' + event.newValue)}
								);
								..................................................................

								VARIATION
								.............................................
								myInstance.wire (eventNamesToHandlersMapOBJ);
								.............................................

								When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash. This variation is provided as a convenience and has the effect of iteratively calling the =wire= instance method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								EXAMPLE
								..........................................................................
								mySlider.wire ({
									'Changed.value':
										function (event) {console.log ('NEW VALUE: ' + event.newValue)},
									'Changed.maxValue':
										function (event) {console.log ('NEW MAX VALUE: ' + event.newValue)},
									'Changed.minValue':
										function (event) {console.log ('NEW MIN VALUE: ' + event.newValue)}
								});
								..........................................................................

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

							### wiringsOBJ ~~ Wirings Object ~~ Wirings Objects
								.
					*/
				},

				fire:function (_event) {
					var m = this;
					if (typeof _event != 'object') _event = {name:_event};
					_event.source || (_event.source = m);
					m._eventBus && m._eventBus.fire (_event);
					_event.bubble && m.parent && _isInstance (m) && m.parent.fire (_event);
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
				},

				unwire:function () {
					var _eventBus = this._eventBus;
					_eventBus && _eventBus.unwire.apply (_eventBus,arguments);
					/*?
						Instance Methods
							unwire
								Lets you remove a handler previously wired to an instance event, or handlers wired for multiple instance events.

								DIFFERENT USAGES

								`Unwire a Specific Handler for an Instance Event`
								..........................................................
								myInstance.unwire (eventNameSTR,eventHandlerSTRorFNorOBJ);
								..........................................................

								`Unwire All Handlers for an Instance Event`
								.................................
								myInstance.unwire (eventNameSTR);
								.................................

								`Unwire Handlers for Multiple Instance Events, by Specifying a Wirings Object`
								...............................................
								myInstance.unwire (eventNamesToHandlersMapOBJ);
								...............................................

								`Unwire All Handlers for All Instance Events`
								.....................
								myInstance.unwire ();
								.....................

								Unwire a Specific Handler for an Instance Event
									A handler for a specific event can be unwired by specifying the name of the event as the first argument and the previously wired handler for the event as the second argument.

									SYNTAX
									..........................................................
									myInstance.unwire (eventNameSTR,eventHandlerSTRorFNorOBJ);
									..........................................................

								Unwire All Handlers for an Instance Event
									When no =eventHandlerSTRorFNorOBJ= parameter is specified, then all handlers registered for the event specified in the =eventNameSTR= parameter will be removed.

									SYNTAX
									.................................
									myInstance.unwire (eventNameSTR);
									.................................

								Unwire Handlers for Multiple Instance Events, by Specifying a Wirings Object
									When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash.

									SYNTAX
									...............................................
									myInstance.unwire (eventNamesToHandlersMapOBJ);
									...............................................

									This variation is provided as a convenience and has the effect of iteratively calling the =unwire= instance method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								Unwire All Handlers for All Instance Events
									All previously wired handlers for all events can be unwired by specifying no arguments.

									SYNTAX
									.....................
									myInstance.unwire ();
									.....................

								NOTES
								- see the related =fire= and =wire= instance methods
								- compare to the =Uize.Class.fire=, =Uize.Class.wire=, and =Uize.Class.unwire= static methods

						Static Methods
							Uize.Class.unwire
								Lets you remove a handler previously wired to a static event, or handlers wired for multiple static events.

								DIFFERENT USAGES

								`Unwire a Specific Handler for a Static Event`
								.......................................................
								MyClass.unwire (eventNameSTR,eventHandlerSTRorFNorOBJ);
								.......................................................

								`Unwire All Handlers for a Static Event`
								..............................
								MyClass.unwire (eventNameSTR);
								..............................

								`Unwire Handlers for Multiple Static Events, by Specifying a Wirings Object`
								............................................
								MyClass.unwire (eventNamesToHandlersMapOBJ);
								............................................

								`Unwire All Handlers for All Static Events`
								..................
								MyClass.unwire ();
								..................

								Unwire a Specific Handler for a Static Event
									A handler for a specific event can be unwired by specifying the name of the event as the first argument and the previously wired handler for the event as the second argument.

									SYNTAX
									.......................................................
									MyClass.unwire (eventNameSTR,eventHandlerSTRorFNorOBJ);
									.......................................................

								Unwire All Handlers for a Static Event
									When no =eventHandlerSTRorFNorOBJ= parameter is specified, then all handlers registered for the event specified in the =eventNameSTR= parameter will be removed.

									SYNTAX
									..............................
									MyClass.unwire (eventNameSTR);
									..............................

								Unwire Handlers for Multiple Static Events, by Specifying a Wirings Object
									When only a single =eventNamesToHandlersMapOBJ= parameter is specified, then event handlers for multiple events can be specified using an object hash.

									SYNTAX
									............................................
									MyClass.unwire (eventNamesToHandlersMapOBJ);
									............................................

									This variation is provided as a convenience and has the effect of iteratively calling the =Uize.Class.unwire= static method for each event-name-to-handler mapping in the =eventNamesToHandlersMapOBJ= object.

								Unwire All Handlers for All Static Events
									All previously wired handlers for all events can be unwired by specifying no arguments.

									SYNTAX
									..................
									MyClass.unwire ();
									..................

								NOTES
								- see the related =Uize.Class.fire= and =Uize.Class.wire= static methods
								- compare to the =fire=, =wire=, and =unwire= instance methods
					*/
				}
			}
		});
	}
});

