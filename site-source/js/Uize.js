/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize Base Module
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 10
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize= module is the base module that defines the =Uize= namespace for the UIZE JavaScript Framework, and also provides a `module loader mechanism` and a healthy assortment of `utility belt methods`.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
			Utility Belt Methods
				The =Uize= module provides a slew of utility belt methods that can be divided into the following categories...

				Module Mechanism Methods
					The =Uize= module provides static methods for declaring your own JavaScript modules, requiring modules, and configuring the `module loader mechanism` to suit your application environment.

					- =Uize.getModuleByName= - returns a reference to the module of the specified name, or =undefined= if the module's not loaded
					- =Uize.getPathToLibrary= - returns the relative path from the current document to the folder containing the specified JavaScript file
					- =Uize.module= - lets you declare a JavaScript module that can be required by other JavaScript modules
					- =Uize.moduleLoader= - loads a JavaScript module (specified by its module name)
					- =Uize.moduleUrlResolver= - resolves the specified JavaScript module name to a URL path
					- =Uize.require= - ensures that all of the specified modules are loaded before calling the specified callback function, loading required modules as necessary
					- =Uize.toString= - provides summary info for the module on which the method is called

				Value Testing Methods
					The =Uize= module provides a number of static methods for performing useful tests on values.

					- =Uize.canExtend= - tests if value is an object that can be extended with custom properties
					- =Uize.inRange= - tests if value is within specified value range
					- =Uize.isArray= - tests if value is an array
					- =Uize.isBoolean= - tests if value is a boolean
					- =Uize.isEmpty= - tests if an object or array is empty, or if a non-object value is "falsy"
					- =Uize.isFunction= - tests if value is a function reference
					- =Uize.isInstance= - tests if value is an instance of a =Uize.Class= subclass
					- =Uize.isList= - tests if a value is a list object, such as an array
					- =Uize.isNaN= - tests if a value is the JavaScript special value =NaN=
					- =Uize.isNully= - tests if a value is =null= or =undefined=
					- =Uize.isNumber= - tests if a value is a number (and not =NaN=)
					- =Uize.isObject= - tests if a value is non-null and an object
					- =Uize.isPlainObject=- tests if a value is a plain object (an instance of JavaScript's built-in =Object= object)
					- =Uize.isPrimitive= - tests if a value is a JavaScript primitive (ie. string, number, or boolean)
					- =Uize.isRegExp=- tests if a value is a regular expression (ie. an instance of the =RegExp= object)
					- =Uize.isSameAs= - tests if two values are the same in a strict equality test, with support for =NaN= values
					- =Uize.isString= - tests if a value is a string

				Basic Data Utilities
					The =Uize= module provides a number of static methods for performing basic data manipulation operations that are commonly encountered.

					- =Uize.clone= - clones a value, and creates deep clones of object or array type values
					- =Uize.copyInto= - copies the values of properties from one or more source objects into a target object
					- =Uize.emptyOut= - empties out the contents of an object or array
					- =Uize.findRecord= - finds the first record in a records array that matches specified criteria
					- =Uize.findRecordNo= - returns the index of the first record in a records array that matches specified criteria
					- =Uize.indexIn= - returns the index of a value in a values array or object
					- =Uize.isIn= - tests if a value is in a specified array or object
					- =Uize.keys= - returns an array containing the names of the properties (ie. keys) in an object
					- =Uize.lookup= - creates a lookup object from an array of values
					- =Uize.map= - iterates over an array or object and applies the specified value transformer to produce new values
					- =Uize.max= - returns the largest value in a values array
					- =Uize.meldKeysValues= - creates an object by melding keys from a keys array with values from a values array
					- =Uize.mergeInto= - merges the contents of one or more source objects into a target object
					- =Uize.min= - returns the smallest value in a values array
					- =Uize.pairUp= - uses a list of key/value pairs to form an object
					- =Uize.recordMatches= - determines if a record object matches the specified criteria
					- =Uize.reverseLookup= - creates a reverse lookup from a specified lookup object or values array
					- =Uize.totalKeys= - counts the number of keys in an object (essentially the number of properties)
					- =Uize.values= - returns an array containing the values of the properties in an object

				Iterator Methods
					The =Uize= module provides a number of static methods for iterating over properties of objects or elements of arrays.

					- =Uize.callOn= - calls a method on all values of properties in an object or elements of an array
					- =Uize.forEach= - iterates over an array, object, or length, calling the specified iteration handler for each element or property

				Useful Value Transformers
					The =Uize= module provides some value transformer methods for transforming or resolving values in ways that are either generally useful or useful to other UIZE modules.

					- =Uize.capFirstChar= - capitalizes the first character of a string
					- =Uize.constrain= - constrains a value to a specified range
					- =Uize.defaultNully= - defaults a value to the specified default, if the value is nully (ie. =null= or =undefined=)
					- =Uize.escapeRegExpLiteral= - escapes a string so that it can be used as a literal match portion of a regular expression string
					- =Uize.substituteInto= - substitutes the specified values into the specified string using token replacement
					- =Uize.toNumber= - coerces a value to a number, with defaulting if it cannot be coerced successfully

				Dummy Functions
					The =Uize= module provides a number of dummy functions that can be supplied as placeholders in situations where function type parameters are expected.

					- =Uize.nop= - performs no operation and returns no value (equivalent to returning =undefined=)
					- =Uize.returnFalse= - always returns the value =false=
					- =Uize.returnTrue= - always returns the value =true=
					- =Uize.returnX= - always returns the value of the first argument, unaltered

				General Utilities
					The =Uize= module provides the following general utility methods...

					- =Uize.eval= - lets you perform `quarantined code evaluation` of a JavaScript code string
					- =Uize.getClass= - gets the class of which a specified value is an instance, or returns the value if it is a class or function
					- =Uize.global= - returns a reference to the global object
					- =Uize.laxEval= - lets you perform `quarantined code evaluation` of a JavaScript code string, but not in `JavaScript strict mode`
					- =Uize.noNew= - wraps an object constructor function to make JavaScript's =new= operator optional
					- =Uize.now= - returns the current time in milliseconds since 1970 (POSIX time)
					- =Uize.quarantine= - generates a quarantined version of the supplied function
					- =Uize.resolveTransformer= - resolves the specified transformer (of any type) to a transformer function
					- =Uize.substituteInto= - substitutes one or more substitution values into a string

			Quarantined Code Execution
				The =Uize= module provides static methods to facilitate the quarantined execution of JavaScript code, which can be divided into two types: `quarantined code evaluation` and `quarantined nested functions`.

				What is Quarantined Code Execution?
					Quarantined code execution is the execution of some JavaScript from within a deep local scope, but where the code being executed is executed outside of that deep scope - in a "quarantined" scope.

					In the quarantined scope, the only scope that the quarantined code has access to in its scope chain is the global scope. The executed code is, thereby, quarantined from the local scope so that it cannot accidentally contaminate (or be contaminated by) the local scope, by accessing or assigning to identifiers within the local scope (or anywhere else up the local scope's scope chain).

					This is best illustrated by an example...

					NON-QUARANTINED
					....................................................................................
					function foo () {
						var bar = 5;
						eval ('var baz = 10; alert (bar);');  // doesn't throw error, but we'd want it to
					}

					foo ();
					....................................................................................

					In the above example, some code is being evaluated inside a function scope using JavaScript's built-in =eval= function. Now, for argument's sake, let's say that this code has a typo in it where it was supposed to access the =baz= variable that it defined, but it's actually trying to access a =bar= variable. If the surrounding scope in which the =eval= call is being made contains a =bar= variable, then the code will not produce an error as it should and will appear to work, but it will have a bug.

					This kind of cross-contamination between evaluated code and a deep local scope can be alleviated by using either of the =Uize.eval= or =Uize.laxEval= methods, as follows...

					QUARANTINED
					..................................................................................
					function foo () {
						var bar = 5;
						Uize.eval ('var baz = 10; alert (bar);');  // throws an error, as we would like
					}

					foo ();
					..................................................................................

					In the above example, we have replaced the use of JavaScript's built-in =eval= function with a call to the =Uize.eval= method. The code being evaluated is now evaluated in a quarantined fashion so that it no longer has access to scope inside the =foo= function, and the only scope it has access to is the global scope. In this example, the global scope does not define a =bar= variable, so the code being evaluated produces a JavaScript error as we would like and exposes the typo in the code.

					Now, the global scope could always still have identifiers that could cross-contaminate with code being evaluated using the =Uize.eval= or =Uize.laxEval= methods, but the potential for such cross-contamination is much reduced, especially as you consider that the deeper and deeper you go into nested scopes, the more identifiers get "tacked" on as a result of an increasingly long scope chain. The most important thing is that the =Uize.eval= and =Uize.laxEval= methods allow you to quarantine code evaluation from the current / local scope within which the methods are called.

				Quarantined Code Evaluation
					The =Uize= module provides two static methods to facilitate quarantined evaluation of JavaScript code strings.

					The general wisdom is to avoid using JavaScript's built-in =eval= function at all costs, and this is, for the most part, good advice. However, JavaScript is a dynamic language, and when you're doing more sophisticated (and risky) things with JavaScript such as dynamic code construction, it becomes useful to evaluate strings that contain JavaScript code.

					Now, a risk with careless use of JavaScript's =eval= function from deep within the nested functions of your code is that you may not be intending to have the code evaluated within the scope of your deep function.

					It could be a benefit to the code you're eval'ing that it has access to the scope of the function in which you're eval'ing it, but it may also be a curse in two respects...

					+) the code being eval'ed may unexpectedly conflict with identifiers in your function's scope (or any scope up the scope chain)
					+) function closures within the code being eval'ed will hang on to your function's scope state (with "interesting" memory usage implications)

					To address these risks and to allow you to perform `quarantined code evaluation`, the =Uize= module provides methods for `strict mode quarantined evaluation` and `non-strict mode quarantined evaluation`.

					Strict Mode Quarantined Evaluation
						To perform `quarantined code evaluation` in `JavaScript strict mode`, the =Uize.eval= method can be used.

						SYNTAX
						..............................................
						evalResultANYTYPE = Uize.eval (codeToEvalSTR);
						..............................................

						EXAMPLE
						..............................................................................................
						function foo () {
							var bar = 5;
							Uize.eval ('bar = 10');  // throws an error, because bar is not declared inside eval'd code
							alert (bar);
						}

						foo ();
						..............................................................................................

						In the above example, the code being evaluated in the call to the =Uize.eval= method results in a JavaScript error being thrown. This is for two reasons:

						+) the =Uize.eval= method evaluates the code in a quarantined fashion, so it doesn't have access to the =bar= variable defined in the local scope
						+) the =Uize.eval= method evaluates code using `JavaScript strict mode`, so the code that now appears to assigning a value to a variable not declared in the global scope (the only scope that the `quarantined code evaluation` has access to) throws an error because this is not permitted in strict mode

					Non-strict Mode Quarantined Evaluation
						To perform `quarantined code evaluation` in non-strict mode, the =Uize.laxEval= method can be used.

						SYNTAX
						.................................................
						evalResultANYTYPE = Uize.laxEval (codeToEvalSTR);
						.................................................

						EXAMPLE
						..................................................................................................
						function foo () {
							var bar = 5;
							Uize.laxEval ('bar = 10');  // doesn't throw an error, but doesn't set value of local scope bar
							alert (bar);  // alerts "5", because the quarantined eval'd code didn't set local bar variable
						}

						foo ();
						..................................................................................................

						In the above example, the code being evaluated in the call to the =Uize.laxEval= method does not throw a JavaScript as the =Uize.eval= method would, but it still doesn't set the value of the =bar= variable in the local scope. There are two things in play here...

						+) the =Uize.laxEval= method evaluates the code in a quarantined fashion, so it doesn't have access to the =bar= variable defined in the local scope
						+) the =Uize.laxEval= method evaluates code using non-strict mode, so it allows the quarantined code to assign a value to a variable that is not declared in the quarantined code's scope chain, which has the effect of declaring =bar= as a global variable rather than throwing an error (as would be the case in strict mode)

				Quarantined Nested Functions
					To declare a function from within some deep local scope, but have that function be quarantined from the local scope, one can use the =Uize.quarantine= method.

					The =Uize.quarantine= method allows you to essentially generate a quarantined version of the supplied function. When the quarantined function is then called, it won't have access to the same scope chain that the original function had access to - it will only have access to the global scope.

					SYNTAX
					...............................................................
					quarantinedFunctionFUNC = Uize.quarantine (sourceFunctionFUNC);
					...............................................................

					The behavior of the =Uize.quarantine= method is best illustrated by an example...

					EXAMPLE
					...............................................................................................
					var bar = 10;

					function Foo () {
						var bar = 5;
						this.baz = function () {
							alert (bar);
						};
						this.qux = Uize.quarantine (this.baz);
					}

					var myFoo = new Foo ();

					myFoo.baz ();  // alerts 5, because the baz method has access to the Foo scope
					myFoo.qux ();  // alerts 10, because it is quarantined from the Foo scope, and global bar is 10
					...............................................................................................

					In the above example, the instance method =baz= of the =Foo= object is defined inside the constructor. As a result, it has access to the =Foo= scope and the =bar= variable defined in it, and it alerts the value of local =bar= variable when it is called. Now, the =qux= instance method, on the other hand, is defined as being a quarantined version of the =baz= instance method, so it will only have access to the global scope when called.

					As a result, when the =baz= method is called on the instance =myFoo=, it alerts "5", which is the value of the =bar= variable in the =Foo= scope. In contrast, when the =qux= method is called on =myFoo=, it alerts "10", which is the value of the =bar= variable in the global scope - because it is quarantined from the =Foo= scope, it only has access to the global scope and the global =bar= variable.

					Benefits of Uize.quarantine Over Uize.eval or Uize.laxEval
						The quarantining effect of the =Uize.quarantine= method can also be achieved by using either of the =Uize.eval= or =Uize.laxEval= methods, but the =Uize.quarantine= method has a few benefits over the `quarantined code evaluation` methods...

						Quarantine Existing Functions
							The =Uize.quarantine= method lets you create a quarantined version of a function that already exists.

							This is something that you can't easily do with the =Uize.eval= or =Uize.laxEval= methods - you'd basically have to manually re-implement the =Uize.quarantine= method.

						Easier to Write Code in Function Form
							The =Uize.quarantine= method lets you write quarantined code using a regular function, which is just plain easier to do.

							By writing quarantined code in function form, you can avoid getting caught up in the character escaping and multi-line string concatenation issues associated with constructing a JavaScript code string for evaluation. This becomes increasinly an issue as the amount of code that you want to quarantine increases and constructing the code as a string becomes increasingly cumbersome.

						Code in Function Form is Scrunchable
							Quarantined code written in function form has the benefit of being scrunchable by the scruncher (or otherwise minified by other JavaScript minifiers or code obfuscators).

							Naturally, the benefits of this will be greater the larger the quarantined code is.

						Some Early Error Detection
							Quarantined code written in function form will be parsed by the JavaScript interpreter early.

							Unlike the =Uize.eval= and =Uize.laxEval= methods, where the quarantined code will be evaluated at runtime and where errors in the code will only surface when the code is evaluated, the function supplied to the =Uize.quarantine= method will be parsed just like any other function, and syntax errors (and some errors relating to non-compliance with `JavaScript strict mode`) will be caught early - before the quarantined code is even executed.

					Immediately Invoked Quarantined Functions
						In cases where one wishes to execute code immediately from within some deep local scope, but where one wishes to have that code be executed in a quarantined fashion, one can call the function returned by the =Uize.quarantine= method immediately.

						EXAMPLE
						........................................
						// code executed before quarantined code

						Uize.quarantine (function () {
							// quarantined code execution
						}) ();

						// code executed after quarantined code
						........................................

						This is just like immediate invokation of an anonymous function, except with the additional wrapper of the =Uize.quarantine= call.
*/

Uize = (function () {
	'use strict';

	/*** Variables for Scruncher Optimization ***/
		var
			_package = function () {},
			_undefined,
			_typeString = 'string',
			_typeObject = 'object',
			_typeNumber = 'number',
			_typeBoolean = 'boolean',
			_typeFunction = 'function',
			_Function = Function,
			_Array = Array,
			_false = false,
			_true = true,
			_null = null,
			_trueFlag = {},
			_ObjectToString = Object.prototype.toString
		;

	/*** General Variables ***/
		var
			_uizeGuids = 0,
			_sacredEmptyArray = [],
			_scriptParentNode,
			_interpreterSupportsArrayForEach = !!_Array.forEach,
			_interpreterSupportsArrayIndexOf = !!(_Array.indexOf && _Array.lastIndexOf)
		;

	/*** Utility Functions ***/
		function _resolveTargetLookup (_safeOrTarget) {
			return (
				_isObject (_safeOrTarget)
					? _safeOrTarget
					: _safeOrTarget
						? {constructor:_undefined,toLocaleString:_undefined,toString:_undefined,valueOf:_undefined}
						: {}
			);
		}

		function _performOperationWithMultipleSources (_targetAndSources,_operation) {
			var _targetObject = _targetAndSources [0];
			if (_canExtend (_targetObject)) {
				var
					_sourceObject = _targetAndSources [1],
					_targetAndSourcesLength = _targetAndSources.length
				;
				_canExtend (_sourceObject) && _operation (_targetObject,_sourceObject);
				if (_targetAndSourcesLength > 2) {
					for (var _sourceObjectNo = 1; ++_sourceObjectNo < _targetAndSourcesLength;)
						_canExtend (_sourceObject = _targetAndSources [_sourceObjectNo]) &&
							_operation (_targetObject,_sourceObject)
						;
					;
				}
			}
			return _targetObject;
		}

	/*** Public Static Methods ***/
		_package.capFirstChar = function (_sourceStr) {
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

						In the above example, the instance method =displayPropertyValue= is being defined for a hypothetical widget class. This method accepts a string parameter, being the name of a state property whose value should be displayed in the page in an implied node of the widget, and where the implied node's name is constructed from the prefix ='valueOf'= and the name of the state property with its first letter capitalized. Using this method to display the value of a =width= state property, the value of this property would be displayed in the implied node named =valueOfWidth=.

						NOTES
						- this method is implemented in the =Uize= base module rather than the =Uize.String= module because it is generally useful in many other modules and =Uize.Class= subclasses that don't otherwise want to require the entire =Uize.String= module
						- if the first character of the source string is already capitalized, then the returned value will be the same as the source string
						- see also the other `useful value transformers`
			*/
		};

		var _clone = _package.clone = function (_value) {
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
					_constructor == Date ||
					_constructor == String ||
					_constructor == Number ||
					_constructor == Boolean
				) {
					return new _constructor (_value.valueOf ())
				} else if (_constructor == RegExp) {
					/* NOTE: Workaround for a Safari issue
						Firstly, the valueOf method of the RegExp object simply returns a reference to the instance on which it is called. Secondly, in the JavaScript interpreters in most browsers, instantiating a new RegExp object using another RegExp instance as the constructor argument results in a clone being created. Unfortunately, Safari simply returns a reference to the RegExp instance passed to the constructor. Therefore, we have to do a more laborious clone operation for regular expressions, in order to please safari.
					*/
					return new RegExp (
						_value.source,
						(_value.global ? 'g' : '') + (_value.ignoreCase ? 'i' : '') + (_value.multiline ? 'm' : '')
					);
				};

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
						- see also the other `basic data utilities`
			*/
		};

		var _constrain = _package.constrain = function (_value,_limitA,_limitB) {
			/* NOTES:
				- deliberately not using Math.max and Math.min
					- to avoid function calls, for performance
					- also, max and min coerce values to number, so this method wouldn't support strings, dates, etc.
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
						Returns a value, being the result of constraining the specified value within the specified lower and upper limits.

						SYNTAX
						............................................................................................
						constrainedValueANYTYPE = Uize.constrain (valueANYTYPE,lowerLimitANYTYPE,upperLimitANYTYPE);
						............................................................................................

						It is acceptable for the value of the =lowerLimitANYTYPE= parameter to be greater than the value of the =upperLimitANYTYPE= parameter, and the value of the =valueANYTYPE= parameter will still be constrained within the specified range - even if the lower and upper limits are swapped. So, for example, the statement =Uize.constrain (percent,0,100)= would be equivalent to =Uize.constrain (percent,100,0)=.

						EXAMPLES
						...............................................................
						// number constraining
						Uize.constrain (-50,0,100);   // returns 0
						Uize.constrain (-50,100,0);   // returns 0
						Uize.constrain (0,0,100);     // returns 0
						Uize.constrain (50,0,100);    // returns 50
						Uize.constrain (100,0,100);   // returns 100
						Uize.constrain (150,0,100);   // returns 100

						// constraining with value types that are coerced to number
						Uize.constrain (              // returns Uize.Class ({value:0})
							Uize.Class ({value:-50}),  // coerced to -50
							Uize.Class ({value:0}),    // coerced to 0
							Uize.Class ({value:1000})  // coerced to 100
						);

						// constraining with strings values
						Uize.constrain ('a','b','y'); // returns 'b'
						Uize.constrain ('m','b','y'); // returns 'm'
						Uize.constrain ('z','b','y'); // returns 'y'
						...............................................................

						NOTES
						- see the related =Uize.inRange= static method
						- see also the other `useful value transformers`
			*/
		};

		_package.inRange = function (_value,_limitA,_limitB) {
			return _value == _package.constrain (_value,_limitA,_limitB);
			/*?
				Static Methods
					Uize.inRange
						Returns a boolean, indicating whether or not the specified value lies within the specified lower and upper limits.

						SYNTAX
						..............................................................................
						inRangeBOOL = Uize.inRange (valueANYTYPE,lowerLimitANYTYPE,upperLimitANYTYPE);
						..............................................................................

						It is acceptable for the value of the =lowerLimitANYTYPE= parameter to be greater than the value of the =upperLimitANYTYPE= parameter, and the value of the =valueANYTYPE= parameter will still be constrained within the specified range - even if the lower and upper limits are swapped. So, for example, the statement =Uize.inRange (percent,0,100)= would be equivalent to =Uize.inRange (percent,100,0)=.

						EXAMPLES
						..............................................................
						// number constraining
						Uize.inRange (-50,0,100);     // returns false
						Uize.inRange (-50,100,0);     // returns false
						Uize.inRange (0,0,100);       // returns true
						Uize.inRange (50,0,100);      // returns true
						Uize.inRange (100,0,100);     // returns true
						Uize.inRange (150,0,100);     // returns false

						// inRange testing with value types that are coerced to number
						Uize.inRange (                // returns false
							Uize.Class ({value:-50}),  // coerced to -50
							Uize.Class ({value:0}),    // coerced to 0
							Uize.Class ({value:1000})  // coerced to 100
						);

						// inRange testing with strings values
						Uize.inRange ('a','b','y');   // returns false
						Uize.inRange ('a','m','y');   // returns false
						Uize.inRange ('z','b','y');   // returns false

						// in Range testing with dates
						Uize.inRange (                // returns false
							new Date ('01/01/1999'),
							new Date ('01/01/2000'),
							new Date ('01/01/2010')
						);
						Uize.inRange (                // returns true
							new Date ('01/01/2005'),
							new Date ('01/01/2000'),
							new Date ('01/01/2010')
						);
						Uize.inRange (                // returns false
							new Date ('01/01/2011'),
							new Date ('01/01/2000'),
							new Date ('01/01/2010')
						);
						..............................................................

						Support for Different Value Types
							Because the =Uize.inRange= method uses JavaScript's less than and greater than operators, values specified for the value being tested and the value range's boundaries can be of any type that can be compared using these operators.

							That means that the =Uize.inRange= automatically supports testing number types values, string type values, =Date= object instances, and instances of any object type that implements the =valueOf intrinsic method=, such as instances of =Uize.Class= subclasses that implement the value interface. So, all the following examples are legitimate usages of the =Uize.inRange= method.

							EXAMPLES
							............................................................
							// testing a number against a number range
							Uize.inRange (-50,0,100);

							// testing a string against a string range
							Uize.inRange ('a','b','y');

							// testing a date against a date range
							Uize.inRange (
								new Date ('01/01/1999'),
								new Date ('01/01/2000'),
								new Date ('01/01/2010')
							);

							// testing an object against a range expressed using objects
							Uize.inRange (
								Uize.Class ({value:-50}),  // coerced to -50
								Uize.Class ({value:0}),    // coerced to 0
								Uize.Class ({value:1000})  // coerced to 100
							);
							............................................................

						NOTES
						- see the related =Uize.constrain= static method
						- see also the other `value testing methods`
			*/
		};

		var _copyInto = _package.copyInto = function () {
			return _performOperationWithMultipleSources (
				arguments,
				function (_targetObject,_sourceObject) {
					for (var _propertyName in _sourceObject)
						_targetObject [_propertyName] = _sourceObject [_propertyName]
					;
				}
			);
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
						- compare to the companion =Uize.mergeInto= static method
						- Source object parameters whose values are not objects will simply not be copied into the target object. This is a useful behavior, as it allows one to mix conditional copies into a single call to =Uize.copyInto= by using the ternary operator to select between a source object and the value =null=.
						- see also the other `basic data utilities`
			*/
		};

		_package.mergeInto = function () {
			function _mergeInto (_targetObject,_sourceObject) {
				var
					_targetObjectPropertyValue,
					_sourceObjectPropertyValue
				;
				for (var _propertyName in _sourceObject)
					(
						_isPlainObject (_sourceObjectPropertyValue = _sourceObject [_propertyName]) &&
						_isPlainObject (_targetObjectPropertyValue = _targetObject [_propertyName])
					)
						? _mergeInto (_targetObjectPropertyValue,_sourceObjectPropertyValue)
						: (_targetObject [_propertyName] = _sourceObjectPropertyValue)
				;
			}
			return _performOperationWithMultipleSources (arguments,_mergeInto);
			/*?
				Static Methods
					Uize.mergeInto
						Merges the contents of one or more source objects into the specified target object, and returns the target object as the result.

						DIFFERENT USAGES

						`Merge the Contents of a Source Object Into a Target Object`
						.................................................
						targetOBJ = Uize.mergeInto (targetOBJ,sourceOBJ);
						.................................................

						`Merge Multiple Source Objects Into a Target Object`
						............................................................................
						targetOBJ = Uize.mergeInto (targetOBJ,source1OBJ,source2OBJ,...,sourceNOBJ);
						............................................................................

						Merge the Contents of a Source Object Into a Target Object
							In the most simple use case, the =Uize.mergeInto= method can be used to merge the contents of a single source object into a target object.

							SYNTAX
							.................................................
							targetOBJ = Uize.mergeInto (targetOBJ,sourceOBJ);
							.................................................

							The contents of the source object is merged into the target object according to the =Uize.mergeInto= method's `merging rules`.

							EXAMPLE
							...........................................
							var
								targetObject = {
									foo:'bar',
									anArray:[0,1,2],
									junk:{
										hey:'there',
										moreJunk:{
											simple:'simon'
										}
									}
								},
								sourceObject = {
									foo:'BAR',
									anArray:['a','b','c'],
									junk:{
										boo:'yah',
										moreJunk:{
											peter:'pan',
											evenMoreJunk:{
												silly:'sausage'
											}
										}
									}
								}
							;
							Uize.mergeInto (targetObject,sourceObject);
							...........................................

							RESULT
							...........................
							{
								foo:'BAR',
								anArray:['a','b','c'],
								junk:{
									hey:'there',
									moreJunk:{
										simple:'simon',
										peter:'pan',
										evenMoreJunk:{
											silly:'sausage'
										}
									},
									boo:'yah'
								}
							}
							...........................

						Merge Multiple Source Objects Into a Target Object
							As a convenience, the contents of multiple source objects can be merged into a target object by specifying an arbitrary number of source objects after the =targetOBJ= first parameter.

							SYNTAX
							............................................................................
							targetOBJ = Uize.mergeInto (targetOBJ,source1OBJ,source2OBJ,...,sourceNOBJ);
							............................................................................

							When multiple source objects are specified, the contents of the source objects are merged into the target object in the order in which they are specified (ie. left to right in the arguments list). The contents of source objects are merged into the target object according to the =Uize.mergeInto= method's `merging rules`.

							EXAMPLE
							........................................................................
							var
								targetObject = {
									foo:'bar',
									anArray:[0,1,2],
									junk:{
										hey:'there',
										moreJunk:{
											simple:'simon'
										}
									}
								},
								sourceObject1 = {
									foo:'BAR',
									anArray:['a','b','c'],
									junk:{
										boo:'yah',
										moreJunk:{
											peter:'pan',
											evenMoreJunk:{
												silly:'sausage'
											}
										}
									}
								},
								sourceObject2 = {
									hello:'world',
									anArray:['A','B','C'],
									junk:{
										yo:'wassup'
									}
								},
								sourceObject3 = {
									foo:'BAR!!!',
									junk:{
										moreJunk:{
											evenMoreJunk:{
												bite:'me'
											}
										}
									}
								}
							;
							Uize.mergeInto (targetObject,sourceObject1,sourceObject2,sourceObject3);
							........................................................................

							RESULT
							............................
							{
								foo:'BAR!!!',
								anArray:['A','B','C'],
								hello:'world',
								junk:{
									hey:'there',
									moreJunk:{
										simple:'simon',
										peter:'pan',
										evenMoreJunk:{
											silly:'sausage',
											bite:'me'
										},
									},
									boo:'yah',
									yo:'wassup'
								}
							}
							............................

						Merging Rules
							The =Uize.mergeInto= method merges the contents of source objects into a target object according to the following set of rules...

							Merging is Recursive
								The contents of a source object is merged into the contents of the target object recursively.

								EXAMPLE
								...............................
								var result = Uize.mergeInto (
									{foo:{bar:{hello:'world'}}},
									{foo:{bar:{boo:'yah'}}}
								);
								...............................

								RESULT
								.....................................
								{foo:{bar:{hello:'world',boo:'yah'}}}
								.....................................

							Only Plain Objects Are Recursed
								Only the contents of plain objects are recursed, and non-plain objects are copied by reference.

								EXAMPLE
								..................................................
								function CustomObject (value) {this.value = value}

								var
									customObject1 = new CustomObject (5),
									customObject2 = new CustomObject (42)
								;
								customObject1.foo = 'bar';
								customObject2.hello = 'world';

								var result = Uize.mergeInto (
									{prop:customObject1},
									{prop:customObject2}
								);
								..................................................

								In the above example, a constructor is created for a custom object called =CustomObject=. Then, we create two different instances of this object. To each instance, we add extra properties.

								Now, when we use the =Uize.mergeInto= method to merge a source object into a target object, where the value of a =prop= property in the source object is =customObject2= and the value of that same property in the target object is =customObject1=, the value of the =prop= property in the target object is simply overwritten with a reference to the =customObject2= value contained in the source object - the contents of =customObject2= are *not* merged into =customObject1=.

								In other words, the merge process does not recurse into the properties of the =CustomObject= instances (or any non-plain objects, for that matter). The =Uize.mergeInto= method considers custom objects to be values rather than nodes of the object tree.

							Missing Nodes Copied By Reference
								When the target object being recursed is missing a node, at any level of its structure, that is present in the source object, then the node from the source object is copied by reference - it is not cloned.

								EXAMPLE
								..................................................................................
								var
									targetObject = {foo:'bar'},
									sourceObject = {aMissingNode:{hello:'world'}}
								;
								Uize.mergeInto (targetObject,sourceObject);

								alert (targetObject.aMissingNode === sourceObject.aMissingNode);  // alerts "true"
								..................................................................................

								In the above example, the =sourceObject= object contains the property =aMissingNode=, whose value is a plain object and represent a node in the object structure that is not present in the =targetObject= object. When the source object is merged into the target object, this missing node is copied by reference - it is not cloned into the target object. Therefore, the expression =target.aMissingNode= is identical in a strict equality to =sourceObject.aMissingNode=.

								This same rule applies if the target object contains the property that is contained in the source object, but the value of the property in the target object is not a plain object.

								EXAMPLE
								..................................................................................
								var
									targetObject = {someProperty:'foo'},
									sourceObject = {someProperty:{hello:'world'}}
								;
								Uize.mergeInto (targetObject,sourceObject);

								alert (targetObject.someProperty === sourceObject.someProperty);  // alerts "true"
								..................................................................................

								In the above example, the =sourceObject= object contains the property =someProperty=, which is also present in the =targetObject= object. However, the value of this property in the target object is a string, so this value is overwritten with a reference to the object value of the property obtained from the source object. Therefore, the expression =target.someProperty= is identical in a strict equality to =sourceObject.someProperty=.

							Null or Undefined Source Objects Ignored
								As with the related =Uize.copyInto= method, specifying the values =null= or =undefined= for source object parameters results in those parameters simply being ignored - they contain nothing to merge into the target object.

								EXAMPLE
								....................................
								Uize.mergeInto (
									{foo:'bar',junk:{hello:'world'}},
									null,
									{foo:'BAR'},
									undefined,
									{junk:{simple:'simon'}}
								);
								....................................

								RESULT
								...............................................
								{foo:'BAR',junk:{hello:'world',simple:'simon'}}
								...............................................

						NOTES
						- compare to the companion =Uize.copyInto= static method
						- see also the other `basic data utilities`
			*/
		};

		var _forEach = _package.forEach = function (_source,_iterationHandler,_context,_allArrayElements) {
			if (_source) {
				var _sourceIsArray = _isArray (_source);
				if (!_sourceIsArray || _source.length) {
					if (typeof _iterationHandler == _typeString)
						_iterationHandler = _Function ('value,key,source',_iterationHandler)
					;
					if (_sourceIsArray) {
						if (_interpreterSupportsArrayForEach && !_allArrayElements) {
							_source.forEach (_iterationHandler,_context);
						} else {
							for (var _index = -1, _sourceLength = _source.length; ++_index < _sourceLength;)
								(_allArrayElements || _index in _source) &&
									_iterationHandler.call (_context,_source [_index],_index,_source)
							;
						}
					} else if (_isObject (_source)) {
						for (var _index in _source)
							_iterationHandler.call (_context,_source [_index],_index,_source)
						;
					} else if (typeof _source == _typeNumber) {
						for (var _index = -1; ++_index < _source;)
							_iterationHandler.call (_context,_index,_index,_source)
						;
					}
				}
			}
			/*?
				Static Methods
					Uize.forEach
						Iterates over the specified array, object, or length, calling the specified iteration handler for each element or property.

						DIFFERENT USAGES

						`Basic Usage`
						...............................................................
						Uize.forEach (sourceARRAYorOBJorINT,iterationHandlerSTRorFUNC);
						...............................................................

						`Provide a Context for the Iteration Handler`
						..............................................................................
						Uize.forEach (sourceARRAYorOBJorINT,iterationHandlerSTRorFUNC,contextANYTYPE);
						..............................................................................

						`Iterate Even Over Unassigned Elements of an Array`
						.............................
						Uize.forEach (
							sourceARRAYorOBJorINT,
							iterationHandlerSTRorFUNC,
							contextANYTYPE,
							allArrayElementsBOOL
						);
						.............................

						Basic Usage
							In its most basic usage, the =Uize.forEach= method can be used to iterate over the elements of an array, performing an action for each element.

							EXAMPLE
							.....................................................................
							var fruits = ['apple','banana','grape','melon','peach','watermelon'];

							function createFruitWidget (fruit) {
								// create a widget for the fruit
							}

							Uize.forEach (fruits,createFruitWidget);
							.....................................................................

						Provide a Context for the Iteration Handler
							An iteration handler can be provided a context on which to be called by specifying the optional =contextANYTYPE= parameter.

							SYNTAX
							..............................................................................
							Uize.forEach (sourceARRAYorOBJorINT,iterationHandlerSTRorFUNC,contextANYTYPE);
							..............................................................................

							EXAMPLE
							.......................................................
							Uize.forEach (listItems,listWidget.addItem,listWidget);
							.......................................................

							In the above example, the =listItems= variable is an array of data objects for items in a list. The =Uize.forEach= method is being used to iterate over the list, calling the function =listWidget.addItem= with =listWidget= as the context for each call, so that we are effectively calling the =addItem= method of the =listItem= instance.

							Note that we can't just supply =listWidget.addItem= as the iteration handler without supplying a context, since the expression =listWidget.addItem= simply dereferences the =addItem= property on the =listWidget= object and returns a function.

						Iterate Even Over Unassigned Elements of an Array
							The =Uize.forEach= method can be forced to iterate over all elements of an array, including unassigned elements, by specify the value =true= for the optional =allArrayElementsBOOL= parameter.

							Like the =forEach= method of JavaScript's built-in =Array= object, the =Uize.forEach= method will skip over unassigned array elements by default. This behavior can be problematic in certain situations.

							EXAMPLE
							..............................................................................
							// create a sparsely populated array, with a length of 5
							var sourceArray = new Array (5);
							sourceArray [2] = 'apple';
							sourceArray [4] = 'pear';

							var valuesSeenA = [];
							Uize.forEach (sourceArray,function (value) {valuesSeenA.push (value)});
							alert (valuesSeenA);  // alerts "apple,pear"

							var valuesSeenB = [];
							Uize.forEach (sourceArray,function (value) {valuesSeenB.push (value)},0,true);
							alert (valuesSeenB);  // alerts "undefined,undefined,apple,undefined,pear"
							..............................................................................

						Parameters
							sourceARRAYorOBJorINT
								An array specifing elements over which to iterate, or an object specifying properties over which to iterate, or a positive integer specifying the number of times to iterate.

							iterationHandlerSTRorFUNC
								A string or function, specifying code that should be executed for handling each iteration.

								Function Iteration Handler
									If a function is specified for the iteration handler, the function should expect to receive three arguments - =value=, =key=, and =source=.

									The =value= argument is the value for an array element or object property, the =key= argument is the array index or object property name, and the =source= argument is the value specified for the =sourceARRAYorOBJorINT= parameter when calling the =Uize.forEach= method.

									EXAMPLE
									.....................................................................
									var fruits = ['apple','banana','grape','melon','peach','watermelon'];
									Uize.forEach (
										fruits,
										function (value,key,source) {source [key] = value.toUpperCase ()}
									);
									.....................................................................

									After the above code has been executed, all the elements of the =fruits= array will be uppercased, to form...

									.......................................................
									['APPLE','BANANA','GRAPE','MELON','PEACH','WATERMELON']
									.......................................................

								String Iteration Handler
									If a string is specified for the iteration handler, the string expression must expect the variables =value=, =key=, and =source= to be reserved words in its scope.

									A string iteration handler will be composed into a function by the =Uize.forEach= method, and values will be supplied for the predefined =value=, =key=, and =source= arguments of the generated function. The =value= argument is the value for an array element or object property, the =key= argument is the array index or object property name, and the =source= argument is the value specified for the =sourceARRAYorOBJorINT= parameter when calling the =Uize.forEach= method.

									EXAMPLE
									.....................................................................
									var fruits = ['apple','banana','grape','melon','peach','watermelon'];
									Uize.forEach (fruits,'source [key] = value.toUpperCase ()');
									.....................................................................

									After the above code has been executed, all the elements of the =fruits= array will be uppercased, to form...

									.......................................................
									['APPLE','BANANA','GRAPE','MELON','PEACH','WATERMELON']
									.......................................................

							contextANYTYPE
								A value of any type (but typically an object instance), specifying the context on which to call the iteration handler.

								By default, the iteration handler specified by the =iterationHandlerSTRorFUNC= parameter is not called on any context. If you need the iteration handler to be a method call on an object instance, then you will need to use the =contextANYTYPE= paramter to `provide a context for the iteration handler`.

							allArrayElementsBOOL
								A boolean, specifying whether or not the =Uize.forEach= method should iterate even over unassigned elements of a source array.

								Like the =forEach= method of JavaScript's built-in =Array= object, the =Uize.forEach= method will skip over unassigned array elements by default. In order to force the method to iterate over all elements, including unassigned elements, specify the value =true= for the optional =allArrayElementsBOOL= parameter.

								NOTES
								- this parameter is not applicable when an object or number value is specified for the =sourceARRAYorOBJorINT= parameter

						Key Benefits
							While regular JavaScript =for= loops are still worth using in the majority of cases, there are a number of benefits to using the =Uize.forEach= method for iterating...

							Produces More Concise Code
								Using the =Uize.forEach= method can lead to more concise and readable code.

								In cases where one is iterating over the elements of an array or the properties of an object and calling a function to handle each iteration, using the =Uize.forEach= method will produce cleaner code without sacrificing much performance.

								INSTEAD OF...
								............................................................
								for (var fruitNo = -1; fruitNo < fruits.length; fruitNo++) {
									createFruitWidget (fruits [fruitNo]);
								}
								............................................................

								USE...
								........................................
								Uize.forEach (fruits,createFruitWidget);
								........................................

							Supports Iterating Over Object Properties
								The =Uize.forEach= method supports iterating over the properties of an object, simply by specifying an object as the source.

								INSTEAD OF...
								............................................
								for (var fruitId in fruitsById) {
									createFruitWidget (fruitsById [fruitId]);
								}
								............................................

								USE...
								............................................
								Uize.forEach (fruitsById,createFruitWidget);
								............................................

							Supports Concise String Iteration Handler
								In cases smaller and more concise code is desirable and performance isn't critical, a string iteration handler can be used in the =Uize.forEach= method.

								INSTEAD OF...
								..................................................................................
								Uize.forEach (fruitsById,function (value,key) {console.log (key + ': ' + value)});
								..................................................................................

								USE...
								.............................................................
								Uize.forEach (fruitsById,"console.log (key + ': ' + value)");
								.............................................................

							Uses JavaScript's Built-in, When Possible
								Later versions of JavaScript support a built-in =forEach= instance method for the =Array= object.

								In order to provide the best possible performance, the =Uize.forEach= method uses the =Array= object's =forEach= method whenever possible, which is under the following circumstances...

								- the version of JavaScript being used supports the =forEach= method
								- the value specified for the =sourceARRAYorOBJorINT= parameter is an array
								- the value =true= is not specified for the optional =allArrayElementsBOOL= parameter (because the =Array= object's built in =forEach= method skips unassigned array elements)

							Enforces Optimized For Loop
								Using the =Uize.forEach= method enforces use of a more performant approach to iterating over an array.

								This helps in a small way to offset the performance cost of calling an iteration handler function on every iteration. A classic mistake that is made when writing =for= loops to iterate over arrays is to dereference the array's =length= property on every iteration in the loop test expression. Furthermore, most times that people write array iteration loops they don't take advantage of the ability to roll the loop test and counting expression together into a single expression.

								WORSE PERFORMANCE
								...........................................................
								for (var fruitNo = 0; fruitNo < fruits.length; fruitNo++) {
									// do stuff
								}
								...........................................................

								BETTER PERFORMANCE
								.................................................................................
								for (var fruitNo = -1, fruitsLength = fruits.length; ++fruitNo < fruitsLength;) {
									// do stuff
								}
								.................................................................................

								Using the =Uize.forEach= method enforces use of the more performant approach to iterating over an array, which helps in a small way to offset the performance cost of calling an iteration handler function on every iteration.

							Supports Iterating Over Unassigned Array Elements
								The =Uize.forEach= method supports iterating over all elements of an array, including unassigned elements, by specifying the value =true= for the optional =allArrayElementsBOOL= parameter.

								For more info, refer to the usage `Iterate Even Over Unassigned Elements of an Array`.

							Supports Iterating for a Specified Number of Iterations
								As a convenience, the =Uize.forEach= method supports specifying a number value for the =sourceARRAYorOBJorINT= parameter, in which case the method iterates for the specified number of times.

								When a number is specified for the =sourceARRAYorOBJorINT= parameter, the iteration index will be used for both the =value= and =key= arguments of the iteration handler, and the iteration index will start at =0=. Furthermore, since the value of the =sourceARRAYorOBJorINT= parameter is always provided as the value of the iteration handler's =source= argument, the handler will receive the number value for the =source=.

								EXAMPLE
								...................................................................................
								var results = [];
								Uize.forEach (
									5,
									function (value,key,source) {results.push ({value:value,key:key,source:source})}
								);
								...................................................................................

								After the above code has been executed, the =results= array will have the following contents...

								............................
								[
									{value:0,key:0,source:5},
									{value:1,key:1,source:5},
									{value:2,key:2,source:5},
									{value:3,key:3,source:5},
									{value:4,key:4,source:5}
								]
								............................

								Admittedly not a particularly practical or compelling example, but it illustrates the behavior.

						Some Limitations
							The =Uize.forEach= is intended for a common and very simple use case, and for this use case it provides a convenient and concise form for expressing iteration.

							As soon as one strays from the very narrow use case that this method is geared towards, one finds oneself needing to use regular JavaScript loops. The most notable limitations of the =Uize.forEach= method are as follows...

							- iterates over every element - can't skip elements, or go back and repeat elements
							- iterates forwards - can't iterate backwards
							- iteration can't be stopped - there is no break facility available
							- iteration handler shouldn't modify the number or order of elements in an array
							- every iteration involves a function call - sometimes this performance cost may be prohibitive

						NOTES
						- compare to the =Uize.map= static method
						- see also the other `iterator methods`
			*/
		};

		var _resolveTransformer = _package.resolveTransformer = function (_transformer) {
			var _typeofTransformer = typeof _transformer;
			return (
				_transformer == _undefined
					? _package.returnX
					: _typeofTransformer == _typeFunction
						? _transformer
						: _typeofTransformer == 'string'
							? _Function ('value,key','return ' + _transformer)
							: _typeofTransformer == 'object'
								? (
									_isRegExp (_transformer)
										? function (_value) {return _transformer.test (_value + '')}
										: function (_value) {
											return _transformer.hasOwnProperty (_value) ? _transformer [_value] : _value
										}
								)
								: function () {return _transformer}
			);
			/*?
				Static Methods
					Uize.resolveTransformer
						Resolves the specified transformer to a function that can be passed two arguments, value and key, and that returns a value derived from one or both of those inputs.

						SYNTAX
						...............................................................
						transformerFUNC = Uize.resolveTransformer (transformerANYTYPE);
						...............................................................

						The =Uize.resolveTransformer= method is intended to be used in the implementation of other methods that want to allow a transformer to be specified in several different forms (such as an expression string, for example), but always want to use the transformer as a function. An example of one such method is the =Uize.map= method, whose second argument is a mapper transformer. The =Uize.resolveTransformer= method allows such methods to be versatile in how they let transformers be specified.

						EXAMPLE
						..........................................................
						function simpleArrayMap (array,mapper) {
							mapper = Uize.resolveTransformer (mapper);
							var result = [];
							for (var elementNo = array.length; --elementNo >= 0;) {
								result [elementNo] = mapper (array [elementNo]);
							}
							return result;
						}
						..........................................................

						In the above example, we are implementing a simple array mapper function. The second argument of the function is a mapper. To allow users of the function to specify a mapper using an expression string short form, we resolve the value of the =mapper= argument using the =Uize.resolveTransformer= method and re-assign the resolved value to the =mapper= argument. Once resolved, we can now count on the mapper being a function and we can call it in the loop that processes the source array. Now a caller can call this function with a statement like =simpleArrayMap (fruits,'value.toLowerCase ()')=.

						How Different Transformer Types are Resolved
							The =Uize.resolveTransformer= method supports numerous different ways of specifying a transformer.

							When a Function Type Transformer is Specified
								When a function is specified for the =transformerANYTYPE= parameter, that function is simply returned.

								The =Uize.resolveTransformer= method is used to resolve a value that could be one of several different types to something that's guaranteed to be a function. In the case where the transformer is already a function, it is considered to already be resolved and is returned as is.

							When a String Type Transformer is Specified
								When a string value is specified for the =transformerANYTYPE= parameter, a function is produced using the specified string transformer expression as the function's body, and accepting the two arguments =value= and =key=.

								For example, the transformer expression string ='key + ": " + value'= would be resolved to the function =function (value,key) {return key + ': ' + value}=. In another example, the transformer expression string ='value &#42; value'= would be resolved to the function =function (value,key) {return value &#42; value}=.

								The =Uize.resolveTransformer= method imposes the argument names =value= and =key= for the two arguments of the function that it produces from a transformer exprression string, so such an expression must use these reserved variable names to access the value and optional key that will be passed in by the caller of the resolved transformer.

								EXAMPLE
								........................................................
								var squared = Uize.resolveTransformer ('value * value');

								alert (squared (3));  // alerts the text "9"
								........................................................

							When a Regular Expression Transformer is Specified
								When a regular expression is specified for the =transformerANYTYPE= parameter, a function is produced using the regular expression to test the value of its first argument for a match, returning a boolean value.

								Because regular expression transformers are resolved to functions that always return =true= or =false= values, they are most suited to and most commonly used as value matchers.

								EXAMPLE
								.................................................................................
								var isValidIdentifier = Uize.resolveTransformer (/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/);

								alert (isValidIdentifier (''));         // alerts "false"
								alert (isValidIdentifier ('fooVar'));   // alerts "true"
								alert (isValidIdentifier ('$foo'));     // alerts "true"
								alert (isValidIdentifier ('3rdVar'));   // alerts "false"
								alert (isValidIdentifier ('_4thVar'));  // alerts "true"
								.................................................................................

							When an Object Type Transformer is Specified
								When an object is specified for the =transformerANYTYPE= parameter, a function is produced using the object as a lookup for remapping the input value, but leaving the input value unchanged if it is not found in the lookup.

								EXAMPLE
								.......................................................
								var whatFoodType = Uize.resolveTransformer ({
									apple:'fruit',
									banana:'fruit',
									beet:'vegetable',
									corn:'grain',
									onion:'vegetable',
									rice:'grain'
								});

								alert (whatFoodType ('apple'));   // alerts "fruit"
								alert (whatFoodType ('onion'));   // alerts "vegetable"
								alert (whatFoodType ('rice'));    // alerts "grain"
								alert (whatFoodType ('burger'));  // alerts "burger"
								.......................................................

							When a Nully Transformer is Specified
								When a nully value (ie. the value =null= or =undefined=) is specified for the =transformerANYTYPE= parameter, a function is produced that simply returns the value of its first argument unmodified.

								This behavior is useful for methods that want to offer an optional transformer and wish no transformation to be performed when the optional argument is not specified, or if the values =null= or =undefined= are explicitly specified.

							When a Boolean Type Transformer is Specified
								When a boolean value is specified for the =transformerANYTYPE= parameter, a function is produced that simply returns that boolean value, regardless of the input value.

								This behavior is most suited to methods that resolve matchers, and the =Uize.resolveMatcher= method takes advantage of this behavior because it uses the =Uize.resolveTransformer= method in its implementation. In cases where a transformer is serving the purpose of a matcher, the values =true= or =false= can be provided to defeat the effect of the matcher to either match all elements or no elements.

							When a Number Type Transformer is Specified
								When a number value is specified for the =transformerANYTYPE= parameter, a function is produced that simply returns that number value, regardless of the input value.

						NOTES
						- see also the related =Uize.resolveMatcher= static method
			*/
		};

		_package.resolveMatcher = function (_matcher) {
			return _matcher == _undefined ? _package.returnTrue : _resolveTransformer (_matcher);
			/*?
				Static Methods
					Uize.resolveMatcher
						Resolves the specified matcher to a function that can be passed two arguments, value and key, and that returns a value derived from one or both of those inputs.

						SYNTAX
						...................................................
						matcherFUNC = Uize.resolveMatcher (matcherANYTYPE);
						...................................................

						The =Uize.resolveMatcher= method is intended to be used in the implementation of other methods that want to allow a matcher to be specified in several different forms (such as an expression string, for example), but always want to use the matcher as a function. Examples of such methods include the various methods of the =Uize.Data.Matches= module, such as the =Uize.Data.Matches.remove= method whose second argument is a matcher. The =Uize.resolveMatcher= method allows such methods to be versatile in how they let matchers be specified.

						EXAMPLE
						..........................................................
						function findMatches (array,matcher) {
							matcher = Uize.resolveMatcher (matcher);
							var matches = [];
							for (var elementNo = -1; ++elementNo < array.length;) {
								var elementValue = array [elementNo];
								if (matcher (elementValue)) {
									matches.push (elementValue);
								}
							}
							return matches;
						}
						..........................................................

						In the above example, we are implementing a simple function to find the elements in an array that match a specified matcher and return those matches in a new array. The second argument of the function is a matcher. To allow users of the function to specify a matcher using an expression string short form, we resolve the value of the =matcher= argument using the =Uize.resolveMatcher= method and re-assign the resolved value to the =matcher= argument. Once resolved, we can now count on the matcher being a function and we can call it in the loop that iterates over the source array. Now a caller can call this function with statements like...

						.................................................................
						findMatches (possibleNumbers,'typeof value == "number"');
						findMatches (possibleIdentifiers,/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/);
						.................................................................

						How Different Matcher Types are Resolved
							The =Uize.resolveMatcher= method supports numerous different ways of specifying a matcher.

							When a Function Type Matcher is Specified
								When a function is specified for the =matcherANYTYPE= parameter, that function is simply returned.

								The =Uize.resolveMatcher= method is used to resolve a value that could be one of several different types to something that's guaranteed to be a function. In the case where the matcher is already a function, it is considered to already be resolved and is returned as is.

							When a String Type Matcher is Specified
								When a string value is specified for the =matcherANYTYPE= parameter, a function is produced using the specified string matcher expression as the function's body, and accepting the two arguments =value= and =key=.

								For example, the matcher expression string ='typeof value &#61;&#61; "number"'= would be resolved to the function =function (value,key) {return typeof value &#61;&#61; 'number'}=. In another example, the matcher expression string ='/name/i.test (key) && /^c/i.test (value)'= would be resolved to the function =function (value,key) {return /name/i.test (key) && /^c/i.test (value)}=.

								The =Uize.resolveMatcher= method imposes the argument names =value= and =key= for the two arguments of the function that it produces from a matcher exprression string, so such an expression must use these reserved variable names to access the value and optional key that will be passed in by the caller of the resolved matcher.

							When a Regular Expression Matcher is Specified
								When a regular expression is specified for the =matcherANYTYPE= parameter, a function is produced using the regular expression to test the value of its first argument for a match, returning a boolean value.

								EXAMPLE
								.............................................................................
								var isValidIdentifier = Uize.resolveMatcher (/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/);

								alert (isValidIdentifier (''));         // alerts "false"
								alert (isValidIdentifier ('fooVar'));   // alerts "true"
								alert (isValidIdentifier ('$foo'));     // alerts "true"
								alert (isValidIdentifier ('3rdVar'));   // alerts "false"
								alert (isValidIdentifier ('_4thVar'));  // alerts "true"
								.............................................................................

							When a Nully Matcher is Specified
								When a nully value (ie. the value =null= or =undefined=) is specified for the =matcherANYTYPE= parameter, a function is produced that always returns the value =true=.

								This behavior is useful for methods that want to offer an optional matcher and wish no filtering (ie. always matching) to be performed when the optional argument is not specified, or if the values =null= or =undefined= are explicitly specified.

							When a Boolean Type Matcher is Specified
								When a boolean value is specified for the =matcherANYTYPE= parameter, a function is produced that simply returns that boolean value, regardless of the argument values.

								This behavior can be useful in situations where you wish to force the matching result to be always true or false. In such cases, specifying simply a boolean value for the matcher is a convenient shorthand.

						NOTES
						- see also the related =Uize.resolveTransformer= static method
			*/
		};

		var _map = _package.map = function (_source,_mapper,_target) {
			if (typeof _source == _typeNumber) {
				_source = new _Array (_source);
				if (typeof _target != _typeObject) _target = _source;
			}
			_mapper = _resolveTransformer (_mapper);
			if (typeof _target != _typeObject)
				_target = _target === _false ? _source : _isArray (_source) ? [] : {}
			;
			_forEach (
				_source,
				function (_value,_key) {
					var _mappedValue = _mapper.call (_source,_value,_key);
					if (_target) _target [_key] = _mappedValue;
				},
				0,
				_true
			);
			return _target;
			/*?
				Static Methods
					Uize.map
						Iterates through the specified array (or object), executing the specified mapper expression or function for each element (or object property), and packages the results into an array (or object).

						SYNTAX
						....................................................................
						mappedARRAYorOBJ = Uize.map (sourceARRAYorOBJorINT,mapperSTRorFUNC);
						....................................................................

						The =Uize.map= method is very vertatile and can be used to accomplish a wide array of different tasks. Sure, you could do all the things you could do with =Uize.map= by writing your own loops. This method serves as a convenience, making certain operations more concise in application code.

						The example below, which takes a source array of strings and produces a new array of those strings uppercased, illustrates the difference between writing your own iterator and using the =Uize.map= method.

						INSTEAD OF...
						......................................................................
						var newArray = [];
						for (var elementNo = 0; elementNo < sourceArray.length; elementNo++) {
							newArray.push (sourceArray [elementNo].toUpperCase ());
						}
						......................................................................

						USE...
						.............................................................
						var newArray = Uize.map (sourceArray,'value.toUpperCase ()');
						.............................................................

						OR USING A FUNCTION...
						.............................................................
						var newArray = Uize.map (
							sourceArray,function (value) {return value.toUpperCase ()}
						);
						.............................................................

						Another example below - which generates an array seeded with the values 0 to 99 - further illustrates the convenience of the =Uize.map= method...

						INSTEAD OF...
						.......................................................
						var newArray = [];
						for (var elementNo = 0; elementNo < 100; elementNo++) {
							newArray.push (elementNo);
						}
						.......................................................

						USE...
						....................................
						var newArray = Uize.map (100,'key');
						....................................

						OR USING A FUNCTION...
						................................................................
						var newArray = Uize.map (100,function (value,key) {return key});
						................................................................

						Key Benefits
							The =Uize.map= static method provides some key improvements over the =Array= object's =map= method in JavaScript 1.6 (which is not supported in all browsers)...

							- can operate on objects as well as arrays
							- supports a more concise mapper expression string, as well as supporting a function
							- can optionally modify the source array or object
							- allows easy creation of a fresh source array for mapping, by specifying an array length
							- lets you specify an explicit target, where mapped values should be written to

						VARIATION
						.............................
						mappedARRAYorOBJ = Uize.map (
							sourceARRAYorOBJorINT,
							mapperSTRorFUNC,
							targetARRAYorOBJorBOOL
						);
						.............................

						By default, the =Uize.map= method maps values of the source array or object and packages the result into a new array or object. Specifying the optional =targetARRAYorOBJorBOOL= parameter allows you to explicitly specify a target for the operation, into which the mapped values will be packaged.

						Parameters
							sourceARRAYorOBJorINT
								Lets you specify the source array or object, or the length of a fresh array, with which the =Uize.map= method should map new values.

								VALUES

								- When an *array* is specified, then the =Uize.map= method will iterate through the elements of the array.

								- When an *object* is specified, then the =Uize.map= method will iterate through the properties of the object.

								- When a *positive integer* is specified, then the =Uize.map= method will create a fresh array of the length specified by this parameter and then iterate through that array. This is a convenient facility for seeding arrays of some desired length with automatically generated values.

							mapperSTRorFUNC
								Lets you specify a mapper expression or function, for mapping the value of the current element of the source array or the current property of the source object to a new value.

								VALUES

								- When a *string* value is specified, then the JavaScript expression specified in the string will be compiled to a mapper function that will then be used for each iteration. An expression specified for this parameter must be a complete JavaScript expression (it may not be arbitrary, multi-statement chunks of code) following the same requirements of any expression that you might place on the right-hand side of an assignment statement. Within the context of your expression, the identifiers =this=, =key=, and =value= are defined, where =this= is a reference to the source array or object, =key= is the index of the current element of the source array or the name of the current property of the source object, and where =value= is the value of the current element of the source array or the current property of the source object.

								- When a *function* reference is specified, then the specified function will be called during each iteration. The function you specify should expect to receive two parameters: =value= and =key=. If you don't care about the key, then you can omit the second parameter and only have one parameter declared in your function's argument list. The mapper function is called as an instance method on the source array or object, so the =this= keyword can be used to access the source array or object for querying the values of other elements or properties.

							targetARRAYorOBJorBOOL
								Lets you specify where the result of the mapper should be packaged.

								You can provide your own target array or object, you can specify to use the source array or object, or you can specify that the result should not be packaged (ie. discarded).

								VALUES

								- =true= - When the *boolean* value =true= is specified (the default value for the =targetARRAYorOBJorBOOL= parameter if it is omitted), then the =Uize.map= method will package the result from the mapper into a new array or object.

								- =false= - When the *boolean* value =false= is specified (not the same as not specifying a value), then the =Uize.map= method will package the result from the mapper into the source array or object specified by the =sourceARRAYorOBJorINT= parameter (ie. won't use a different target).

								- =null= - When the special value =null= is specified (not the same as not specifying a value), then the =Uize.map= method will not package the result from the mapper into an array or object. This is useful if you just want to use this method as an iterator, without the memory expense of building an array or object.

								- *object or array* - When an *object* or *array* is explicitly specified, then the =Uize.map= method will package the result from the mapper into that array or object. This is convenient if you already have an array or object into which you wish to package the mapped values, or if you want to repeatedly map multiple source arrays or objects into a common array or object so that the mapped values are merged together. Incidentally, specifying the array or object value of the =sourceARRAYorOBJorINT= parameter as the value for the =targetARRAYorOBJorBOOL= parameter has the same effect as specifying the value =false= for this parameter (ie. use the source as the target, don't use a different target).

						More Examples
							Following are a bunch of examples, demonstrating just a sampling of what's possible using the =Uize.map= method...

							Coerce all elements of an array to being numbers, modifying the source array...
								................................
								Uize.map (array,'+value',false);
								................................

							Coerce all elements of an array to being strings, modifying the source array...
								....................................
								Uize.map (array,'value + ""',false);
								....................................

							Default all empty string properties of an object to some value, modifying the source object...
								.........................................................................
								Uize.map (surveyQuestions,'value || "--- no answer provided ---"',false);
								.........................................................................

							Return an array of all the elements in the source array uppercased...
								.........................................................
								var uppercased = Uize.map (array,'value.toUpperCase ()');
								.........................................................

							Add a prefix to all the string elements of an array, modifying the source array...
								...........................................
								Uize.map (array,'"prefix_" + value',false);
								...........................................

							Create a cheap (ie. not deep) copy of an object...
								.......................................
								var copyOfFoo = Uize.map (foo,'value');
								.......................................

							Seed an array of 100 elements with the value range 0 to 99...
								......................................
								var range0to99 = Uize.map (100,'key');
								......................................

							Seed an array of 100 elements with the value range 1 to 100...
								...........................................
								var range1to100 = Uize.map (100,'key + 1');
								...........................................

							Create an array of the square roots of 0 to 99...
								......................................................
								var squaresOf0to99 = Uize.map (100,'Math.sqrt (key)');
								......................................................

							Create an array of the square roots of the values in the source array...
								................................................
								var squaresOfArray = Uize.map (array,Math.sqrt);
								................................................

							Create an array of all the capital letters of the alphabet...
								................................................................
								var capLetters = Uize.map (26,'String.fromCharCode (65 + key)');
								................................................................

							Create a fresh array of 10 elements that are the first ten powers of 2...
								.................................................
								var powersOf2 = Uize.map (10,'Math.pow (2,key)');
								.................................................

							Creates an array of the first 30 numbers in the Fibonacci series...
								................................................................................
								var fibonacci = Uize.map (30,'key > 1 ? this [key - 2] + this [key - 1] : key');
								................................................................................

							Smooth an array of values by averaging against adjacent neighbors...
								.....................................................................................
								var smoothed = Uize.map (
									array,
									'key && key < this.length - 1 ? (this [key-1] + value + this [key+1]) / 3 : value'
								);
								.....................................................................................

							Output elements of a log array to the Firebug console on separate lines...
								..........................................
								Uize.map (logArray,'console.log (value)');
								..........................................

							Output elements of a log array to the Firebug console on separate lines, with line numbers...
								.......................................................
								Uize.map (logArray,'console.log (key + ": " + value)');
								.......................................................

							Get a style properties object from a pure number coords object...
								........................................................................
								var coordsStyleProperties = Uize.map (coords,'value + "px"');

								// EXAMPLE
								// this... {left:0,top:50,width:100,height:175}
								// produces this... {left:'0px',top:'50px',width:'100px',height:'175px'}
								........................................................................

							Get the length of the longest string in an array of strings....
								........................................................................
								var maxStringLength = Uize.max (Uize.map (stringsArray,'value.length'));
								........................................................................

						NOTES
						- compare to the =Uize.forEach= static method
						- see also the other `basic data utilities`
			*/
		};

		_package.callOn = function (_target,_method,_arguments) {
			var
				_methodIsString = _isString (_method),
				_methodIsFunction = !_methodIsString && _isFunction (_method)
			;
			_arguments || (_arguments = _sacredEmptyArray);
			function _callOn (_target) {
				if (_target != _undefined)
					_isPlainObject (_target) || _isArray (_target)
						? _forEach (_target,_callOn,0,_true)
						: _methodIsFunction || (_methodIsString && _isFunction (_target [_method]))
							? (_methodIsFunction ? _method : _target [_method]).apply (_target,_arguments)
							: 0
				;
			}
			if (_methodIsString || _methodIsFunction)
				_callOn (_target)
			;
			/*?
				Static Methods
					Uize.callOn
						Recurses through the arbitrarily complex object specified, calling the specified method on all values that are not nully (=null= or =undefined=).

						This method allows the following...

						- specifying a function that should be called as a method on a specified set of values
						- specifying the name of a method that should be called on a specified set of values

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

						EXAMPLE
						...........................................................
						var dates = [
							new Date ('05/10/1986'),
							new Date ('01/12/1992'),
							new Date ('10/04/2003'),
							new Date ('07/01/2010')
						];

						Uize.callOn (
							dates,
							function () {this.setFullYear (this.getFullYear () - 1)}
						);
						...........................................................

						In the above example, the call of the =Uize.callOn= method would shift all the dates in the =dates= array back by a year.

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

						When the =instanceOBJ= parameter is specified in place of the =objectSetARRAYorOBJ= parameter, and when the value of the =instanceOBJ= parameter is an instance of a =Uize.Class= subclass, then the specified method will be called on that instance. If the value of =instanceOBJ= is =null= or =undefined=, then no action will be taken. This is a convenient way to conditionally call a method on an object reference that may be null, when you might otherwise capture a local variable in order to avoid deep dereferencing twice.

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

						NOTES
						- see also the other `iterator methods`
			*/
		};

		_package.defaultNully = function (_value,_default) {
			return _value != _undefined ? _value : _default;
			/*?
				Static Methods
					Uize.defaultNully
						Returns the specified default value if the first argument is nully (ie. its value is =null= or =undefined=).

						SYNTAX
						........................................................................
						defaultedValueANYTYPE = Uize.defaultNully (valueANYTYPE,defaultANYTYPE);
						........................................................................

						In JavaScript, the values =null= and =undefined= are technically different, but in many instances in your code you may wish to treat them as equivalent, often when you are defaulting arguments of functions or properties of objects. While you can test to see if a value is either =null= or =undefined= by simply comparing the value to =undefined= in a loose equality (eg. =if (myValue &#61;&#61; undefined) {...}=), certain tools like =jslint= may complain about that, forcing you to do two explicit strict equality checks (as in =if (myValue &#61;&#61;&#61; null || myValue &#61;&#61;&#61; undefined) {...}=). The =Uize.defaultNully= method provides a convenient way to perform this type of test and defaulting.

						INSTEAD OF...
						...........................................................
						function (myArgument0,myArgument1) {
							if (myArgument0 === null || myArgument0 === undefined) {
								myArgument0 = 'some default value';
							}
							// do more stuff
						}
						...........................................................

						USE...
						......................................................................
						function (myArgument0,myArgument1) {
							myArgument0 = Uize.defaultNully (myArgument0,'some default value');
							// do more stuff
						}
						......................................................................

						NOTES
						- see the related =Uize.isNully= static method
						- see also the other `useful value transformers`
			*/
		};

		_package.indexIn = function (_source,_value,_fromEnd,_strict) {
			var
				_sourceIsList = _isList (_source),
				_result = -1
			;
			if (_sourceIsList || _isObject (_source)) {
				var _sourceValues = _sourceIsList ? _source : _values (_source);
				if ((_strict = _strict !== _false) && _interpreterSupportsArrayIndexOf) {
					_result = _Array [_fromEnd ? 'lastIndexOf' : 'indexOf'] (_sourceValues,_value);
				} else {
					for (
						var
							_elementNo = _sourceValues.length,
							_index = _fromEnd ? _elementNo : -1,
							_indexInc = _fromEnd ? -1 : 1
						;
						--_elementNo >= 0;
					) {
						var _element = _sourceValues [_index += _indexInc];
						if (_strict ? _element === _value : _element == _value) {
							_result = _index;
							break;
						}
					}
				}
				if (!_sourceIsList && _result > -1)
					_result = _keys (_source) [_result]
				;
			}
			return _result;
			/*?
				Static Methods
					Uize.indexIn
						Returns an integer, indicating the index in the specified array of the first occurrence of the specified value, or returns a string, indicating the name of first property that has the specified value.

						DIFFERENT USAGES

						`Find a Value in an Array`
						...................................................
						indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE);
						...................................................

						`Find a Value in an Array, Scanning Backwards From the End`
						...............................................................
						indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE,fromEndBOOL);
						...............................................................

						`Find a Value in an Array, Using Non-strict Comparison`
						..................................................................................
						indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE,fromEndBOOL,strictEqualityBOOL);
						..................................................................................

						`Find a Property in an Object Having a Specific Value`
						.................................................................................
						keySTR = Uize.indexIn (sourceOBJECT,valueANYTYPE,fromEndBOOL,strictEqualityBOOL);
						.................................................................................

						Find a Value in an Array
							In the most typical use case, a value can be found in a source array by specifying the array as the first parameter and the search value as the second parameter.

							SYNTAX
							...................................................
							indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE);
							...................................................

							If the value specified by the =valueANYTYPE= parameter is found inside the array specified by the =sourceARRAY= parameter, then the index at which the first occurrence is found will be returned. If the value is not found, then the value =-1= will be returned.

							EXAMPLES
							........................................................................
							Uize.indexIn (['a','b','c'],'c');      // returns 2
							Uize.indexIn (['a','b'],'c');          // returns -1 (no match)
							Uize.indexIn (['a','b','b'],'b');      // returns 1 (first occurrence)
							Uize.indexIn ([1,7,42,'42',42],'42');  // returns 3 (first strict match)
							Uize.indexIn ([1,7,42],'42');          // returns -1 (no strict match)
							........................................................................

						Find a Value in an Array, Scanning Backwards From the End
							A value can be found in a source array, scanning backwards from the end, by specifing the value =true= for the optional =fromEndBOOL= third parameter.

							SYNTAX
							...............................................................
							indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE,fromEndBOOL);
							...............................................................

							By default, the =Uize.indexIn= method searches for the specified value by scanning forwards through the array from the beginning. When the value =true= is specified for the optional =fromEndBOOL= parameter, then this method will search for the specified value by scanning backwards through the array from the end.

							EXAMPLES
							.......................................................................................
							Uize.indexIn (['a','b','c'],'c',true);      // returns 2
							Uize.indexIn (['a','b'],'c',true);          // returns -1 (no match)
							Uize.indexIn (['a','b','b'],'b',true);      // returns 2 (first occurrence, from end)
							Uize.indexIn ([1,7,42,'42',42],'42',true);  // returns 3 (first strict match, from end)
							Uize.indexIn ([1,7,42],'42',true);          // returns -1 (no strict match)
							.......................................................................................

						Find a Value in an Array, Using Non-strict Comparison
							A value can be found in a source array, using non-strict comparison, by specifying the value =false= for the optional =strictEqualityBOOL= fourth parameter.

							SYNTAX
							..................................................................................
							indexINT = Uize.indexIn (sourceARRAY,valueANYTYPE,fromEndBOOL,strictEqualityBOOL);
							..................................................................................

							By default, the =Uize.indexIn= method tests for a match using strict equality. When the value =false= is specified for the optional =strictEqualityBOOL= parameter, then this method will test for a match using loose equality (ie. where the string value ='1'= would be considered equal to the number value =1=).

							EXAMPLES
							..........................................................................................
							Uize.indexIn ([5,9],'9',false,true);       // returns -1 (no strict match)
							Uize.indexIn ([5,9,'9'],'9',false,false);  // returns 1 (first non-strict match)
							Uize.indexIn ([5,9,'9'],'9',false,true);   // returns 2 (first strict match)
							Uize.indexIn ([5,9,'9'],9,false,true);     // returns 1 (first strict match)
							Uize.indexIn ([5,'9',9],'9',true,true);    // returns 1 (first strict match, from end)
							Uize.indexIn ([5,'9',9],9,true,true);      // returns 2 (first strict match, from end)
							Uize.indexIn ([5,'9',9],'9',true,false);   // returns 2 (first non-strict match, from end)
							Uize.indexIn ([5,9,'9'],9,true,false);     // returns 2 (first non-strict match, from end)
							..........................................................................................

						Find a Property in an Object Having a Specific Value
							The property of an object having a specific value can be found by specifying a =sourceOBJECT= parameter in place of the =sourceARRAY= first parameter.

							SYNTAX
							.................................................................................
							keySTR = Uize.indexIn (sourceOBJECT,valueANYTYPE,fromEndBOOL,strictEqualityBOOL);
							.................................................................................

							When a =sourceOBJECT= parameter is specified in place of the typical =sourceARRAY= parameter, the =Uize.indexIn= method will iterate through the properties of the specified object to find the property whose value is equal to the value specified by the =valueANYTYPE= parameter. If a property having the specified value is found, then that property's name is returned. If no property having the specified value is found, then the value =-1= is returned.

							When a source object is specified, the optional =fromEndBOOL= and =strictEqualityBOOL= parameters are supported as they are when a source array is specified. In particular, the =fromEndBOOL= determines the direction in which the method scans through the properties of the object, where the default forwards order of the properties is determined by the order in which the properties were assigned on the object (this ia a behavior of the JavaScript language).

							EXAMPLES
							.........................................................................................
							Uize.indexIn (
								{p0:5,p1:9},'9',false,true          // returns -1 (no strict match)
							);
							Uize.indexIn (
								{p0:5,p1:9,p2:'9'},'9',false,false  // returns 'p1' (first non-strict match)
							);
							Uize.indexIn (
								{p0:5,p1:9,p2:'9'},'9',false,true   // returns 'p2' (first strict match)
							);
							Uize.indexIn (
								{p0:5,p1:9,p2:'9'},9,false,true     // returns 'p1' (first strict match)
							);
							Uize.indexIn (
								{p0:5,p1:'9',p2:9},'9',true,true    // returns 'p1' (first strict match, from end)
							);
							Uize.indexIn (
								{p0:5,p1:'9',p2:9},9,true,true      // returns 'p2' (first strict match, from end)
							);
							Uize.indexIn (
								{p0:5,p1:'9',p2:9},'9',true,false   // returns 'p2' (first non-strict match, from end)
							);
							Uize.indexIn (
								{p0:5,p1:9,p2:'9'},9,true,false     // returns 'p2' (first non-strict match, from end)
							);
							.........................................................................................

						NOTES
						- see also the related =Uize.isIn= static method
						- see also the other `basic data utilities`
			*/
		};

		var _keys = _package.keys = function (_object) {
			var _result = [];
			if (!_isString (_object))
				for (var _key in _object) _result.push (_key)
			;
			return _result;
			/*?
				Static Methods
					Uize.keys
						Returns an array, representing the keys (property names) of the specified object.

						SYNTAX
						..................................
						keysARRAY = Uize.keys (objectOBJ);
						..................................

						EXAMPLE
						........................................
						var
							personRecord = {
								firstName:'John',
								lastName:'Wilkey',
								addressStreet:'1 Shiny House Way',
								addressCity:'Richville',
								addressState:'CA',
								addressZip:'91234'
							},
							myKeys = Uize.keys (personRecord)
						;
						........................................

						After the above code has executed, the =myKeys= variable will have the value =['firstName', 'lastName', 'addressStreet', 'addressCity', 'addressState', 'addressZip']=.

						NOTES
						- when the value of =objectOBJ= parameter is =null= or =undefined=, an empty array will be returned
						- see also the other `basic data utilities`
			*/
		};

		_package.totalKeys = function (_object) {
			var _result = 0;
			if (!_isString (_object))
				for (var _key in _object) _result++
			;
			return _result;
			/*?
				Static Methods
					Uize.totalKeys
						Returns an integer, representing the total number of keys in the specified object.

						SYNTAX
						..........................................
						totalKeysINT = Uize.totalKeys (objectOBJ);
						..........................................

						Using the =Uize.totalKeys= method to determine the number of keys an object has is more efficient than using the expression =Uize.keys (myObject).length=, because the =Uize.totalKeys= method doesn't populate an array. Furthermore, to determine if an object is empty, you *could* use the expression =!Uize.totalKeys (myObject)=, but it would be more efficient to use the convenient =Uize.isEmpty= static method.

						NOTES
						- when the value of =objectOBJ= parameter is =null= or =undefined=, the value =0= will be returned
						- see also the other `basic data utilities`
			*/
		};

		var _values = _package.values = function (_object) {
			if (_isArray (_object)) return _object;
			var _result = [];
			if (!_isString (_object))
				for (var _key in _object) _result.push (_object [_key])
			;
			return _result;
			/*?
				Static Methods
					Uize.values
						Returns an array, representing the property values of the specified object.

						SYNTAX
						......................................
						valuesARRAY = Uize.values (objectOBJ);
						......................................

						EXAMPLE
						.........................................
						var
							personRecord = {
								firstName:'John',
								lastName:'Wilkey',
								addressStreet:'1 Shiny House Way',
								addressCity:'Richville',
								addressState:'CA',
								addressZip:'91234'
							},
							myValues = Uize.keys (personRecord)
						;
						.........................................

						After the above code has executed, the =myValues= variable will have the value =['John', 'Wilkey', '1 Shiny House Way', 'Richville', 'CA', '91234']=.

						VARIATION
						........................................
						valuesARRAY = Uize.values (objectARRAY);
						........................................

						When an =objectARRAY= parameter is specified in place of an =objectOBJ= parameter, then the value of the =objectARRAY= parameter will be returned as the result. This behavior makes this method useful for canonicalizing what could be an object or an array to an array of values.

						NOTES
						- when the value of =objectOBJ= parameter is =null= or =undefined=, an empty array will be returned
						- see also the other `basic data utilities`
			*/
		};

		_package.meldKeysValues = function (_keys,_values) {
			var _result = {};
			for (var _keyNo = -1, _keysLength = Math.min (_keys.length,_values.length); ++_keyNo < _keysLength;)
				_result [_keys [_keyNo]] = _values [_keyNo]
			;
			return _result;
			/*?
				Static Methods
					Uize.meldKeysValues
						Returns an object that is created by melding together the specified keys array and values array.

						SYNTAX
						........................................................
						resultOBJ = Uize.meldKeysValues (keysARRAY,valuesARRAY);
						........................................................

						The =Uize.meldKeysValues= method iterates through the elements of the =keysARRAY= and =valuesARRAY= arrays in lock step, assigning properties to the resulting object using an element from the keys array as property name and an element from the values array as property value.

						If you obtained a keys array from an object using the =Uize.keys= method, and if you also obtained a values array from that same object using the =Uize.values= method, then you could use the =Uize.meldKeysValues= method with those keys and values arrays to recreate the original object.

						EXAMPLE
						..............................................................................
						var
							foodInfoKeys = ['apple','banana','beet','corn','potato','rice']
							foodInfoValues = ['fruit','fruit','vegetable','grain','vegetable','grain'],
							foodInfo = Uize.meldKeysValues (foodInfoKeys,foodInfoValues)
						;
						..............................................................................

						In the above example, keys from the =foodInfoKeys= array are being melded with values from the =foodInfoValues= array to form a value for the =foodInfo= object. After this code has executed, the =foodInfo= object will have the following contents...

						.....................
						{
							apple:'fruit',
							banana:'fruit',
							beet:'vegetable',
							corn:'grain',
							onion:'vegetable',
							rice:'grain'
						}
						.....................

						Surplus Keys or Values Ignored
							If the lengths of the =keysARRAY= or =valuesARRAY= arrays differ, then the surplus keys or values will be ignored.

							Surplus Keys
								If more keys are specified in =keysARRAY= than there are values in =valuesARRAY=, then the surplus keys will be ignored.

								EXAMPLE
								...........................................................
								var object = Uize.meldKeysValues (['foo','hello'],['bar']);
								...........................................................

								After the above code has been executed, the =object= variable will have the value ={foo:'bar'}= - the surplus ='hello'= key is ignored.

							Surplus Values
								If more values are specified in =valuesARRAY= than there are keys in =keysARRAY=, then the surplus values will be ignored.

								EXAMPLE
								...........................................................
								var object = Uize.meldKeysValues (['foo'],['bar','world']);
								...........................................................

								After the above code has been executed, the =object= variable will have the value ={foo:'bar'}= - the surplus ='world'= value is ignored.

						NOTES
						- see the related =Uize.keys= and =Uize.values= static methods
						- compare to the =Uize.pairUp= static method
						- see also the other `basic data utilities`
			*/
		};

		_package.min = function (_object) {
			return Math.min.apply (0,_values (_object));
			/*?
				Static Methods
					Uize.min
						Returns the minimum value from the specified array or object.

						SYNTAX
						..............................................
						var minValueNUM = Uize.min (valuesARRAYorOBJ);
						..............................................

						When an object is specified for the =valuesARRAYorOBJ= parameter, then the minimum property value in the object will be returned.

						EXAMPLE
						..................................................
						var
							employeeSalaries = {
								'John Anderson':80000,
								'Peter Hendriks':56000,
								'Jacob Previn':75000,
								'Scarlet Sjedsondorf':63000
							},
							minEmployeeSalary = Uize.min (employeeSalaries)
						;
						..................................................

						In the above example, the variable =minEmployeeSalary= will be left with the value =56000=.

						NOTES
						- if any of the values are not a number, then this method will return the value =NaN=
						- see the companion =Uize.max= static method
						- see also the other `basic data utilities`
			*/
		};

		_package.max = function (_object) {
			return Math.max.apply (0,_values (_object));
			/*?
				Static Methods
					Uize.max
						Returns the maximum value from the specified array or object.

						SYNTAX
						..............................................
						var maxValueNUM = Uize.max (valuesARRAYorOBJ);
						..............................................

						When an object is specified for the =valuesARRAYorOBJ= parameter, then the maximum property value in the object will be returned.

						EXAMPLE
						..................................................
						var
							employeeSalaries = {
								'John Anderson':80000,
								'Peter Hendriks':56000,
								'Jacob Previn':75000,
								'Scarlet Sjedsondorf':63000
							},
							maxEmployeeSalary = Uize.max (employeeSalaries)
						;
						..................................................

						In the above example, the variable =maxEmployeeSalary= will be left with the value =80000=.

						NOTES
						- if any of the values are not a number, then this method will return the value =NaN=
						- see the companion =Uize.min= static method
						- see also the other `basic data utilities`
			*/
		};

		_package.reverseLookup = function (_object,_safeOrTarget) {
			var _lookup = _resolveTargetLookup (_safeOrTarget);
			if (!_isString (_object))
				for (var _key in _object) _lookup [_object [_key] + ''] = _key
			;
			return _lookup;
			/*?
				Static Methods
					Uize.reverseLookup
						Returns a reverse lookup object, where each key is a value from the specified source object, and where the value for each key is the associated key from the specified source.

						DIFFERENT USAGES

						`Create a Reverse Lookup From an Object`
						................................................
						reverseLookupOBJ = Uize.reverseLookup (hashOBJ);
						................................................

						`Create a Reverse Lookup From a Values Array`
						....................................................
						reverseLookupOBJ = Uize.reverseLookup (valuesARRAY);
						....................................................

						`Create a Safe Reverse Lookup Object`
						......................................................................
						reverseLookupOBJ = Uize.reverseLookup (hashOBJorValuesARRAY,safeBOOL);
						......................................................................

						`Add More Entries to a Reverse Lookup Object`
						................................................................
						targetOBJ = Uize.reverseLookup (hashOBJorValuesARRAY,targetOBJ);
						................................................................

						`Create a Bi-directional Lookup`
						............................................................
						reverseLookupOBJ = Uize.reverseLookup (lookupOBJ,lookupOBJ);
						............................................................

						Create a Reverse Lookup From an Object
							In the most typical usage of the =Uize.reverseLookup= method, a reverse lookup object can be created from an object.

							SYNTAX
							................................................
							reverseLookupOBJ = Uize.reverseLookup (hashOBJ);
							................................................

							EXAMPLE
							.................................................................................
							var
								entitiesNamesToCodes = {quot:34,amp:38,lt:60,gt:62,nbsp:160,copy:169,reg:174},
								entitiesCodesToNames = Uize.reverseLookup (entitiesNamesToCodes)
							;
							.................................................................................

							After the above code is executed, the value of the =entitiesCodesToNames= variable will be an object with the contents...

							....................................................................
							{34:'quot',38:'amp',60:'lt',62:'gt',160:'nbsp',169:'copy',174:'reg'}
							....................................................................

							By creating a reverse lookup, this code can lookup up an entity's character code from its name, or its name from its character code.

						Create a Reverse Lookup From a Values Array
							The =Uize.reverseLookup= method can also be used to create a reverse lookup object for an array.

							SYNTAX
							....................................................
							reverseLookupOBJ = Uize.reverseLookup (valuesARRAY);
							....................................................

							When a =valuesARRAY= parameter is specified in place of the =hashOBJ= parameter, a reverse lookup object is generated where each of the values in the array is a key in the object, and the value corresponding to each key is the index of the value in the array.

							EXAMPLE
							..........................................................................
							var
								frontRunnerLineup = [
									'John Backsberg',
									'Adrian Gullipeg',
									'Sasha Djenduriba',
									'Clark Holstrom',
									'Michael Anderson',
									'Henry Pratt',
									'Jacob Zimbalist',
									'Steven P. McLoughlan',
									'Chris Gates',
									'Richard Crumb'
								],
								frontRunnerLineupReverseLookup = Uize.reverseLookup (frontRunnerLineup)
							;
							..........................................................................

							After the above code is executed, the value of the =frontRunnerLineupReverseLookup= variable will be an object with the contents...

							............................
							{
								'John Backsberg':0,
								'Adrian Gullipeg':1,
								'Sasha Djenduriba':2,
								'Clark Holstrom':3,
								'Michael Anderson':4,
								'Henry Pratt':5,
								'Jacob Zimbalist':6,
								'Steven P. McLoughlan':7,
								'Chris Gates':8,
								'Richard Crumb':9
							}
							............................

							Now the code can look up a front-runner from the front-runner lineup using an index, or the code can determine if a particular person is in the front-runner lineup and what their finishing place is using the generated reverse lookup.

						Create a Safe Reverse Lookup Object
							By specifying the value =true= for the optional =safeBOOL= parameter, a "safe" lookup object can be created.

							SYNTAX
							......................................................................
							reverseLookupOBJ = Uize.reverseLookup (hashOBJorValuesARRAY,safeBOOL);
							......................................................................

							By default, the =Uize.reverseLookup= method creates a lookup object using a simple JavaScript =Object= instance. However, JavaScript's built-in =Object= object defines certain properties on its prototype, such as =valueOf=, so indexing into a lookup object for =valueOf= will return a truthy result. Specifying the value =true= for the =safeBOOL= parameter avoids this issue.

							EXAMPLE
							.................................................................................
							var
								entitiesNamesToCodes = {quot:34,amp:38,lt:60,gt:62,nbsp:160,copy:169,reg:174},
								entitiesCodesToNames = Uize.reverseLookup (entitiesNamesToCodes),
								entitiesCodesToNamesSafe = Uize.reverseLookup (entitiesNamesToCodes,true)
							;

							if (entitiesCodesToNames ['valueOf']) {
								alert ('valueOf appears to be an HTML entity char code');
							}

							if (entitiesCodesToNamesSafe ['valueOf']) {
								alert ('you will not see this alert statement');
							}
							.................................................................................

							In the above example, the =entitiesCodesToNames= reverse lookup is not safe, so looking up the entity name using the bogus entity code "valueOf" will produce a function result - the =valueOf Intrinsic Method= for JavaScript's built-in =Object= object. In contrast, the =entitiesCodesToNamesSafe= reverse lookup is created with the safe option, so looking up "valueOf" will produce the result =undefined=.

							It is often not essential to create safe lookups, since one may know that the keys being used to index into a lookup object will never be the names of methods of the =Object= object, and not creating safe lookups is a little more efficient.

						Add More Entries to a Reverse Lookup Object
							By specifying an existing reverse lookup object for the optional =targetOBJ= second parameter, more entries can be added to the existing reverse lookup.

							SYNTAX
							................................................................
							targetOBJ = Uize.reverseLookup (hashOBJorValuesARRAY,targetOBJ);
							................................................................

							EXAMPLE
							.............................................................................
							var entitiesCodesToNames = Uize.reverseLookup ({quot:34,amp:38,lt:60,gt:62});
							Uize.reverseLookup ({nbsp:160,copy:169,reg:174},entitiesCodesToNames);

							alert (entitiesCodesToNames [38]);   // alerts "amp"
							alert (entitiesCodesToNames [169]);  // alerts "copy"
							.............................................................................

							In the above example, the second call to the =Uize.reverseLookup= method is adding more entries to the reverse lookup object that was created in the first call to the method. This is done by supplying that reverse lookup object, which is assigned to the =entitiesCodesToNames= variable, as the second argument. When calling the =Uize.reverseLookup= method the second time, the result is ignored. This is because the method modifies the target, so we don't care about its return value.

						Create a Bi-directional Lookup
							By specifying the source hash object as also the target for the reverse lookup creation, a bi-directional lookup object can be created.

							SYNTAX
							............................................................
							reverseLookupOBJ = Uize.reverseLookup (lookupOBJ,lookupOBJ);
							............................................................

							EXAMPLE
							......................................................................................
							var entitiesBiDiLookup = {quot:34, amp:38, lt:60, gt:62, nbsp:160, copy:169, reg:174};
							Uize.reverseLookup (entitiesBiDiLookup,entitiesBiDiLookup);

							alert (entitiesBiDiLookup ['amp']);  // alerts "38"
							alert (entitiesBiDiLookup [38]);     // alerts "amp"
							......................................................................................

							Key / Value Collisions
								When creating bi-directional lookup objects, be sure that there are no collisions between keys and values, or your bi-directional lookup will not work correctly.

								EXAMPLE
								...........................................................................
								var foodsLookup = {apple:'fruit',banana:'fruit',corn:'grain',rice:'grain'};
								Uize.reverseLookup (foodsLookup,foodsLookup);

								alert (foodsLookup ['apple']);  // alerts "fuit"
								alert (foodsLookup ['grain']);  // alerts "rice"
								...........................................................................

								In the above example, creating a bi-directional lookup object from the =foodsLookup= object is not particularly useful, because multiple properties of the source object share the same value. So, when you do a lookup for ='grain'= you get only the value ='rice'=, even though there's more than one grain in the source lookup object.

						NOTES
						- see also the other `basic data utilities`
			*/
		};

		_package.lookup = function (_values,_lookupValue,_safeOrTarget) {
			var _lookup = _resolveTargetLookup (_safeOrTarget);
			if (arguments.length == 1) _lookupValue = _true;
			if (_values != _undefined) {
				for (var _valueNo = -1, _valuesLength = _values.length; ++_valueNo < _valuesLength;)
					_lookup [_values [_valueNo]] = _lookupValue
				;
			}
			return _lookup;
			/*?
				Static Methods
					Uize.lookup
						Returns a lookup object, where each key is a value from the specified values array.

						DIFFERENT USAGES

						`Create a Lookup From a Values Array`
						......................................
						lookupOBJ = Uize.lookup (valuesARRAY);
						......................................

						`Create a Lookup Object With a Custom Lookup Value`
						.........................................................
						lookupOBJ = Uize.lookup (valuesARRAY,lookupValueANYTYPE);
						.........................................................

						`Create a Safe Lookup Object From a Values Array`
						......................................................................
						safeLookupOBJ = Uize.lookup (valuesARRAY,lookupValueANYTYPE,safeBOOL);
						......................................................................

						`Add More Entries to a Lookup Object`
						.........................................................................
						lookupOBJ = Uize.lookup (valuesARRAY,lookupValueANYTYPE,targetLookupOBJ);
						.........................................................................

						`Create an Empty Safe Lookup Object`
						...........................................
						emptyLookupOBJ = Uize.lookup (null,1,true);
						...........................................

						Create a Lookup From a Values Array
							In the most common usage, a lookup object can be created from a values array by specifying just the =valuesARRAY= parameter.

							SYNTAX
							......................................
							lookupOBJ = Uize.lookup (valuesARRAY);
							......................................

							EXAMPLE
							...............................................................
							var
								fruits = ['apple','peach','pear','banana','orange','mango'],
								fruitsLookup = Uize.lookup (fruits)
							;
							...............................................................

							After the above code is executed, the value of the =fruitsLookup= variable will be an object with the contents...

							....................................................................
							{apple:true,peach:true,pear:true,banana:true,orange:true,mango:true}
							....................................................................

						Create a Lookup Object With a Custom Lookup Value
							In cases where the default lookup value =true= is not desirable, a different lookup value can be specified using the optional =lookupValueANYTYPE= second parameter.

							SYNTAX
							.........................................................
							lookupOBJ = Uize.lookup (valuesARRAY,lookupValueANYTYPE);
							.........................................................

							EXAMPLE
							...............................................................
							var
								fruits = ['apple','peach','pear','banana','orange','mango'],
								foodsLookup = Uize.lookup (fruits,'fruit')
							;
							...............................................................

							In the above example, the value ='fruit'= is being specified for the optional =lookupValueANYTYPE= parameter. After the above code is executed, the value of the =foodsLookup= variable will be an object with the contents...

							......................................................................................
							{apple:'fruit',peach:'fruit',pear:'fruit',banana:'fruit',orange:'fruit',mango:'fruit'}
							......................................................................................

							Using a custom lookup value can be useful when you're populating a lookup from multiple different values arrays and you want to be able to track which values array a lookup entry came from. For a good illustration of this technique, see the example for the `Add More Entries to a Lookup Object` use case.

						Create a Safe Lookup Object From a Values Array
							A safe lookup object can be created from a values array by specifying the value =true= for the optional =safeBOOL= third parameter.

							SYNTAX
							......................................................................
							safeLookupOBJ = Uize.lookup (valuesARRAY,lookupValueANYTYPE,safeBOOL);
							......................................................................

							EXAMPLE
							...............................................
							var
								values = ['foo','bar'],
								unsafeLookup = Uize.lookup (values),
								safeLookup = Uize.lookup (values,true,true)
							;
							if (unsafeLookup ['valueOf']) alert ('unsafe');
							if (!safeLookup ['valueOf']) alert ('safe');
							...............................................

							In the above example, the =unsafeLookup= lookup object created from the =values= array tests truthy for a ='valueOf'= entry. This is because the lookup object is an instance of JavaScript's built-in =Object= object, and this base object has a =valueOf= instance method as part of its =prototype=. In contrast, the =safeLookup= lookup object tests falsy for a ='valueOf'= entry, because the =Uize.lookup= method adds an explicit =undefined= value for the ='valueOf'= entry (and other =Object= prototype properties) when the value =true= is specified for the =safeBOOL= parameter.

						Add More Entries to a Lookup Object
							By specifying an existing lookup object for the optional =targetLookupOBJ= third parameter, more entries can be added to the existing lookup.

							SYNTAX
							.........................................................................
							lookupOBJ = Uize.lookup (valuesARRAY,lookupValueANYTYPE,targetLookupOBJ);
							.........................................................................

							EXAMPLE
							.................................................................................
							var
								fruits = ['apple','apricot','orange','peach','pear','watermelon'],
								vegetables = ['beet','broccoli','cauliflower','onion','potato','squash'],
								grains = ['barley','maize','oats','quinoa','rice','sorghum','wheat']
								foodLookup = Uize.lookup (fruits,'fruit')
							;
							Uize.lookup (vegetables,'vegetable',foodLookup); // stitch in keys for vegetables
							Uize.lookup (grains,'grain',foodLookup);         // stitch in keys for grains

							alert (foodLookup ['apricot']);   // alerts "fruit"
							alert (foodLookup ['broccoli']);  // alerts "vegetable"
							alert (foodLookup ['quinoa']);    // alerts "grain"
							.................................................................................

							In the above example, a food lookup object is created initially from the =fruits= array. Then, entries are added to the =foodLookup= lookup object by specifying it as the target in two additional calls to the =Uize.lookup= method: one to stirch in lookup entries for the =vegetables= values array, and the other to stitch in entries for the =grains= values array. Also note that different lookup values are being used in each case, allowing the =foodLookup= lookup object to be used to look up the food type from the food name.

						Create an Empty Safe Lookup Object
							An empty safe lookup object can be created by specifying the value =null= for the =valuesARRAY= parameter, the value =1= for the =lookupValueANYTYPE= second parameter, and the value =true= for the =safeBOOL= third parameter.

							SYNTAX
							...........................................
							emptyLookupOBJ = Uize.lookup (null,1,true);
							...........................................

							By specifying the value =null= for the =valuesARRAY= parameter, the resulting lookup object will have no lookup entries. Since the resulting lookup will have no entries, the value specified for the =lookupValueANYTYPE= second parameter is arbitrary, since this value won't be used - the value =1= is nice and concise.

						A Real World Example
							Creating a lookup object is useful when repeatedly checking to see if values are in a defined values set.

							Looping through that defined values set array for each of the lookups would result in poor performance if the set of values to scan through is large, and if the lookup is being performed frequently.

							Let's consider an example...

							............................................................
							function getValuesInMasterList (values,masterList) {
								var result = [];
								for (var valueNo = -1; ++valueNo < values.length;) {
									var value = values [valueNo];
									if (Uize.isIn (masterList,value)) result.push (value);
								}
								return result;
							}
							............................................................

							In the above example, a =getValuesInMasterList= function is being defined. This function accepts two parameters: an array of values, and a master list of values. The function returns an array, containing all the values from the values array that are present in the master list of values. The way it's implemented, on each iteration of the loop through the values array the =Uize.isIn= static method is being used to determined if the current value is in the master list array. This provides less than optimal performance, since the complexity is O(n2).

							Using the =Uize.lookup= static method, a more efficient solution can be fashioned, as follows...

							.........................................................
							function getValuesInMasterList (values,masterList) {
								var
									result = [],
									masterListLookup = Uize.lookup (masterList)
								;
								for (var valueNo = -1; ++valueNo < values.length;) {
									var value = values [valueNo];
									if (masterListLookup [value]) result.push (value);
								}
								return result;
							}
							.........................................................

							In the improved version, a lookup object (aka hash table) is created before the loop. Then, in the loop, all that is needed to see if a value being inspected is in the master list is to do a simple dereference into the lookup object, using the value as the key / property name. Here the complexity is O(n), since indexing into the lookup object is constant time.

						NOTES
						- see also the other `basic data utilities`
			*/
		};

		var _isObject = _package.isObject = function (_value) {
			return !!_value && typeof _value == _typeObject;
			/*?
				Static Methods
					Uize.isObject
						Returns a boolean, indicating whether or not the specified value is an object.

						SYNTAX
						............................................
						isObjectBOOL = Uize.isObject (valueANYTYPE);
						............................................

						Using JavaScript's built-in =typeof= operator, the type of the value =null= is reported as being ='object'=. This can be less than useful when trying to conditionalize code to operate on object type values by dereferencing properties, as attempting to dereference properties off the value =null= will produce JavaScript errors. The =Uize.isObject= method provides a more useful and semantically more intuitive way of testing if a value is a non-null object.

						INSTEAD OF...
						.....................................................
						if (typeof myValue == 'object' && myValue !== null) {
							// ...
						}
						.....................................................

						USE...
						..............................
						if (Uize.isObject (myValue)) {
							// ...
						}
						..............................

						Note that because arrays in JavaScript are derived from the language's built-in =Object= object, array values are reported as being objects by this method.

						EXAMPLES
						......................................................
						Uize.isObject ({foo:'bar'});          // returns true
						Uize.isObject (['foo','bar']);        // returns true
						Uize.isObject (new Boolean (false));  // returns true
						Uize.isObject (new String ('foo'));   // returns true
						Uize.isObject (new Number (5));       // returns true
						Uize.isObject (new Date);             // returns true
						Uize.isObject (Uize.Widget ());       // returns true

						Uize.isObject (null);                 // returns false
						Uize.isObject (undefined);            // returns false
						Uize.isObject ();                     // returns false
						Uize.isObject (5);                    // returns false
						Uize.isObject (NaN);                  // returns false
						Uize.isObject ('foo');                // returns false
						Uize.isObject (true);                 // returns false
						Uize.isObject (function () {});       // returns false
						......................................................

						NOTES
						- compare to the =Uize.isNully= and =Uize.isPlainObject= static methods
						- see also the other `value testing methods`
			*/
		};

		var _canExtend = _package.canExtend = function (_value) {
			var _typeofValue = typeof _value;
			return !!_value && (_typeofValue == _typeObject || _typeofValue == _typeFunction);
			/*?
				Static Methods
					Uize.canExtend
						Returns a boolean, indicating whether or not the specified value is an object that can be extended with custom properties.

						SYNTAX
						..............................................
						canExtendBOOL = Uize.canExtend (valueANYTYPE);
						..............................................

						A value is considered extendable if it is of type "function", or of type "object" and non-null. Function instances can be extended with custom propeerties, and non-null objects can also be extended with custom properties because this encompasses plain objects, instances of custom object classes, and list objects like instances of JavaScript's built-in =Array= object. Values that are not considered extendable are nully values like =null= and =undefined=, and values for JavaScript primitives, like string values, number values, and boolean values.

						EXAMPLES
						......................................................
						Uize.canExtend ({foo:'bar'});         // returns true
						Uize.canExtend (['foo','bar']);       // returns true
						Uize.canExtend (function () {});      // returns true
						Uize.canExtend (new String ('foo'));  // returns true
						Uize.canExtend (new Boolean (true));  // returns true
						Uize.canExtend (new Number (42));     // returns true
						Uize.canExtend (Uize.Widget);         // returns true
						Uize.canExtend (Uize.Widget ());      // returns true

						Uize.canExtend ('foo');               // returns false
						Uize.canExtend (true);                // returns false
						Uize.canExtend (42);                  // returns false
						Uize.canExtend (null);                // returns false
						Uize.canExtend (undefined);           // returns false
						......................................................

						NOTES
						- see also the other `value testing methods`
			*/
		};

		var _isPlainObject = _package.isPlainObject = function (_value) {
			var _valueConstructor = _value && _value.constructor;
			return !!(
				_valueConstructor &&
				(
					_valueConstructor == Object ||
						/* NOTE:
							This test only works for objects created in the current global context - not different browser windows or IFRAMEs.
						*/
					(
						typeof _valueConstructor.prototype.hasOwnProperty == _typeFunction &&
						_valueConstructor.prototype.hasOwnProperty ('hasOwnProperty')
						/* NOTES:
							- For plain object instances that originate from a different window or IFRAME, and where the constructor will be a discrete Object object from that other context, we test if the constructor's prototype has 'hasOwnProperty' as an own property, which is only true of the Object object, unless people are screwing around with overriding basic language features like this (not so likely).

							- For Internet Explorer versions earlier than IE9, DOM nodes are weird objects that don't root off of JavaScript's built-in Object object, so their constructor prototype doesn't have a 'hasOwnProperty' method.
						*/
					)
				)
			);
			/*?
				Static Methods
					Uize.isPlainObject
						Returns a boolean, indicating whether or not the specified value is a plain object (an instance of JavaScript's built-in =Object= object).

						SYNTAX
						......................................................
						isPlainObjectBOOL = Uize.isPlainObject (valueANYTYPE);
						......................................................

						Plain objects are often used as very simple data structures in JavaScript. Sometimes it is desirable to conditionalize the behavior of a function or method, based upon whether an object type value is a plain data structure object or an instance of a custom object (such as an instance of a =Date= object, or an instance of a =Uize.Class= subclass). In such cases, the =Uize.isPlainObject= method provides a convenient way to detect if a value is a reference to a plain object.

						EXAMPLES
						...........................................................
						Uize.isPlainObject ({});                   // returns true
						Uize.isPlainObject ({foo:'bar'});          // returns true
						Uize.isPlainObject (new Object ());        // returns true

						Uize.isPlainObject (['foo','bar']);        // returns false
						Uize.isPlainObject (new Boolean (false));  // returns false
						Uize.isPlainObject (new String ('foo'));   // returns false
						Uize.isPlainObject (new Number (5));       // returns false
						Uize.isPlainObject (new Date);             // returns false
						Uize.isPlainObject (Uize.Widget ());       // returns false
						Uize.isPlainObject (null);                 // returns false
						Uize.isPlainObject (undefined);            // returns false
						Uize.isPlainObject ();                     // returns false
						Uize.isPlainObject (5);                    // returns false
						Uize.isPlainObject (NaN);                  // returns false
						Uize.isPlainObject ('foo');                // returns false
						Uize.isPlainObject (true);                 // returns false
						Uize.isPlainObject (function () {});       // returns false
						...........................................................

						NOTES
						- compare to the =Uize.isObject= static method
						- see also the other `value testing methods`
			*/
		};

		var _isArray = _package.isArray = function (_value) {
			return _value instanceof Array || (!!_value && _isFunction (_value.splice));
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
						- see also the other `value testing methods`
			*/
		};

		var _isList = _package.isList = function (_value) {
			return _isObject (_value) && typeof _value.length == _typeNumber;
			/*?
				Static Methods
					Uize.isList
						Returns a boolean, indicating whether or not the specified value is considered a list.

						SYNTAX
						........................................
						isListBOOL = Uize.isList (valueANYTYPE);
						........................................

						A list is considered to be a non-null value of type ='object'= that has a =length= property whose value is a number. By this definition, an instance of JavaScript's built-in =Array= object is considered to be a list. Also by this definition, a =NodeList= instance as returned by the =document.getElementsByTagName= method is considered to be a list, since it is a non-null object type value with a number type =length= property.

						The =Uize.isList= method is useful when implementing methods that are to conditionalize their behavior based upon the type of a parameter, and where an iteration behavior is desired for list type values. If a value is considered to be a list, its list items can be iterated over using a standard JavaScript =for= loop, using the =length= property to determine how many items should be iterated over, and indexing into the list using JavaScript's =[]= (square brackets) notation.

						EXAMPLES
						.....................................................................................
						alert (Uize.isList (['foo','bar','hello','world']));        // alerts "true"
						alert (Uize.isList (document.getElementsByTagName ('a')));  // alerts "true"

						alert (Uize.isList ({foo:'bar',hello:'world'}));            // alerts "false"
						alert (Uize.isList (42));                                   // alerts "false"
						alert (Uize.isList (true));                                 // alerts "false"
						alert (Uize.isList ('foo');                                 // alerts "false"
						alert (Uize.isList (null);                                  // alerts "false"
						alert (Uize.isList (undefined);                             // alerts "false"
						alert (Uize.isList (/\d+/));                                // alerts "false"
						alert (function () {});                                     // alerts "false"

						// an object is only considered a list once it has a length property that is a number
						var fooObj = {0:'foo',1:'bar',2:'hello',3:'world'};
						alert (Uize.isList (fooObj));                               // alerts "false"
						fooObj.length = '4';
						alert (Uize.isList (fooObj));                               // alerts "false"
						fooObj.length = 4;
						alert (Uize.isList (fooObj));                               // alerts "true"

						// the arguments variable inside functions is considered to be a list
						function fooFunc () {
							alert (Uize.isList (arguments));                         // alerts "true"
						}
						fooFunc ('foo','bar','hello','world');
						.....................................................................................

						NOTES
						- compare to the =Uize.isArray= static method
						- see also the other `value testing methods`
			*/
		};


		var _isFunction = _package.isFunction = function (_value) {
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
						- see also the other `value testing methods`
			*/
		};

		_package.isNumber = function (_value) {
			/* NOTE:
				The JavaScript special value NaN is the only value that is not equal to itself in a strict equality test, so this is a cheap way to test for it.
			*/
			return typeof _value == _typeNumber && _value === _value;
			/*?
				Static Methods
					Uize.isNumber
						Returns a boolean, indicating whether or not the specified value is a number.

						SYNTAX
						............................................
						isNumberBOOL = Uize.isNumber (valueANYTYPE);
						............................................

						This method is a useful abstraction to deal with the fact that the division of zero by zero in JavaScript yields a special kind of value know as =NaN=. Unfortunately, in the implementation of this special value, the result chosen for when the =typeof= operator is applied to it is ='number'= (ie. =typeof NaN &#61;&#61; 'number'= produces =true=). The =Uize.isNumber= method checks that both the type of the parameter is ='number'= and also that the parameter is not =NaN=.

						Also note that this method tests if the specified value is a number primitive, so this method will return =false= if the value being tested is an instance of JavaScript's built-in =Number= object.

						NOTES
						- compare to the =Uize.isNaN= static method
						- see also the other `value testing methods`
			*/
		};

		var _isString = _package.isString = function (_value) {
			return typeof _value == _typeString;
			/*?
				Static Methods
					Uize.isString
						Returns a boolean, indicating whether or not the specified value is a string.

						SYNTAX
						............................................
						isStringBOOL = Uize.isString (valueANYTYPE);
						............................................

						This method tests if the specified value is a string primitive, so this method will return =false= if the value being tested is an instance of JavaScript's built-in =String= object.

						EXAMPLES
						......................................................
						Uize.isString ('foo');                // returns true
						Uize.isString ('');                   // returns true

						Uize.isString (new String ('foo'));   // returns false
						Uize.isString (5);                    // returns false
						Uize.isString (NaN);                  // returns false
						Uize.isString (true);                 // returns false
						Uize.isString (null);                 // returns false
						Uize.isString (undefined);            // returns false
						Uize.isString ();                     // returns false
						Uize.isString ({foo:'bar'});          // returns false
						Uize.isString (['foo','bar']);        // returns false
						Uize.isString (Uize.Widget ());       // returns false
						Uize.isString (function () {});       // returns false
						// etc.
						......................................................

						NOTES
						- see also the other `value testing methods`
			*/
		};

		_package.isBoolean = function (_value) {
			return typeof _value == _typeBoolean;
			/*?
				Static Methods
					Uize.isBoolean
						Returns a boolean, indicating whether or not the specified value is a boolean.

						SYNTAX
						..............................................
						isBooleanBOOL = Uize.isBoolean (valueANYTYPE);
						..............................................

						This method tests if the specified value is a boolean primitive, so this method will return =false= if the value being tested is an instance of JavaScript's built-in =Boolean= object.

						EXAMPLES
						.......................................................
						Uize.isBoolean (true);                 // returns true
						Uize.isBoolean (false);                // returns true

						Uize.isBoolean (new Boolean (true));   // returns false
						Uize.isBoolean ('true');               // returns false
						Uize.isBoolean (5);                    // returns false
						Uize.isBoolean (NaN);                  // returns false
						Uize.isBoolean (null);                 // returns false
						Uize.isBoolean (undefined);            // returns false
						Uize.isBoolean ();                     // returns false
						Uize.isBoolean ({foo:'bar'});          // returns false
						Uize.isBoolean (['foo','bar']);        // returns false
						Uize.isBoolean (Uize.Widget ());       // returns false
						Uize.isBoolean (function () {});       // returns false
						// etc.
						.......................................................

						NOTES
						- see also the other `value testing methods`
			*/
		};

		_package.isNully = function (_value) {
			return _value == _undefined;
			/*?
				Static Methods
					Uize.isNully
						Returns a boolean, indicating whether or not the specified value is =null= or =undefined=.

						SYNTAX
						..........................................
						isNullyBOOL = Uize.isNully (valueANYTYPE);
						..........................................

						In JavaScript, the values =null= and =undefined= are technically different, but in many instances in your code you may wish to treat them as equivalent, often when you are defaulting arguments of functions or properties of objects. Now, you can test to see if a value is either =null= or =undefined= by simply comparing the value to =undefined= in a loose equality (eg. =if (myValue &#61;&#61; undefined) {...}=), but certain tools like =jslint= may complain about that, forcing you to do two explicit strict equality checks (as in =if (myValue &#61;&#61;&#61; null || myValue &#61;&#61;&#61; undefined) {...}=). This can be tedious when you have a long deferencing, so the =Uize.isNully= method can be useful and more concise in such cases.

						INSTEAD OF...
						........................................................................................
						if (myObject.subObject.property === null || myObject.subObject.property === undefined) {
							// ...
						}
						........................................................................................

						USE...
						.................................................
						if (Uize.isNully (myObject.subObject.property)) {
							// ...
						}
						.................................................

						NOTES
						- compare to the =Uize.isObject= static method
						- see the related =Uize.defaultNully= static method
						- see also the other `value testing methods`
			*/
		};

		var _isPrimitive = _package.isPrimitive = function (_value) {
			return _value != _undefined && !(_value instanceof _value.constructor);
			/*?
				Static Methods
					Uize.isPrimitive
						Returns a boolean, indicating whether or not the specified value is one of JavaScript's built-in primitive types: string, boolean, or number.

						SYNTAX
						..................................................
						isPrimitiveBOOL = Uize.isPrimitive (valueANYTYPE);
						..................................................

						EXAMPLES
						.........................................................
						Uize.isPrimitive (true);                 // returns true
						Uize.isPrimitive (false);                // returns true
						Uize.isPrimitive ('foo');                // returns true
						Uize.isPrimitive ('');                   // returns true
						Uize.isPrimitive (42);                   // returns true
						Uize.isPrimitive (0);                    // returns true

						Uize.isPrimitive (new Boolean (true));   // returns false
						Uize.isPrimitive (new String (foo));     // returns false
						Uize.isPrimitive (new Number (42));      // returns false
						Uize.isPrimitive (null);                 // returns false
						Uize.isPrimitive (undefined);            // returns false
						Uize.isPrimitive ();                     // returns false
						Uize.isPrimitive ({foo:'bar'});          // returns false
						Uize.isPrimitive (['foo','bar']);        // returns false
						Uize.isPrimitive (Uize.Widget ());       // returns false
						Uize.isPrimitive (function () {});       // returns false
						// etc.
						.........................................................

						NOTES
						- see also the other `value testing methods`
			*/
		};

		var _isRegExp = _package.isRegExp = function (_value) {
			return _ObjectToString.call (_value) == '[object RegExp]';
			/*?
				Static Methods
					Uize.isRegExp
						Returns a boolean, indicating whether or not the specified value is a regular expression (ie. an instance of JavaScript's built-in =RegExp= object).

						SYNTAX
						............................................
						isRegExpBOOL = Uize.isRegExp (valueANYTYPE);
						............................................

						EXAMPLES
						........................................................
						Uize.isRegExp (/^\d+$/);                // returns true
						Uize.isRegExp (new RegExp ('^\\d+$'));  // returns true

						Uize.isRegExp (true);                   // returns false
						Uize.isRegExp ('foo');                  // returns false
						Uize.isRegExp (42);                     // returns false
						Uize.isRegExp (new Boolean (true));     // returns false
						Uize.isRegExp (new String (foo));       // returns false
						Uize.isRegExp (new Number (42));        // returns false
						Uize.isRegExp (null);                   // returns false
						Uize.isRegExp (undefined);              // returns false
						Uize.isRegExp ();                       // returns false
						Uize.isRegExp ({foo:'bar'});            // returns false
						Uize.isRegExp (['foo','bar']);          // returns false
						Uize.isRegExp (Uize.Widget ());         // returns false
						Uize.isRegExp (function () {});         // returns false
						// etc.
						........................................................

						NOTES
						- see also the other `value testing methods`
			*/
		};

		_package.isIn = function (_source,_value,_strict) {
			return _package.indexIn (_source,_value,_false,_strict) !== -1;
			/*?
				Static Methods
					Uize.isIn
						Returns a boolean, indicating whether or not the specified value can be found within the specified array (or values of an object's properties).

						SYNTAX
						.....................................................
						isInBOOL = Uize.isIn (sourceARRAYorOBJ,valueANYTYPE);
						.....................................................

						VARIATION
						........................................................................
						isInBOOL = Uize.isIn (sourceARRAYorOBJ,valueANYTYPE,strictEqualityBOOL);
						........................................................................

						By default, this method tests for a match using strict equality. When the value =false= is specified for the optional =strictEqualityBOOL= parameter, then this method will test for a match using loose equality (ie. where the string value ='1'= would be considered equal to the number value =1=, or the number value =0= would be considered equal to the boolean value =false=).

						EXAMPLE
						.......................................................................................
						Uize.isIn ([0,1,2,3,4,5],'3');               // returns false
						Uize.isIn ([0,1,2,3,4,5],'3',false);         // returns true
						Uize.isIn ({prop1:'foo',prop2:1},'foo');     // returns true
						Uize.isIn ({prop1:'foo',prop2:1},'1');       // returns false
						Uize.isIn ({prop1:'foo',prop2:1},'1',false); // returns true (non-strict equality test)
						.......................................................................................

						NOTES
						- see also the related =Uize.indexIn= static method
						- see also the other `value testing methods`
			*/
		};

		_package.isEmpty = function (_object) {
			if (_isObject (_object) && _isObject (_object = _object.valueOf ())) {
				if (_isArray (_object)) return !_object.length;
				for (var _key in _object) return _false;
				return _true;
			}
			return !_object;
			/*?
				Static Methods
					Uize.isEmpty
						Returns a boolean, indicating whether or not the specified object or array is empty.

						SYNTAX
						..........................................
						isEmptyBOOL = Uize.isEmpty (valueANYTYPE);
						..........................................

						The =valueANYTYPE= parameter can be an =Object= reference, an =Array= reference, a =Function= reference, or any other type. For object type values that are references to =Object= instances, the =Uize.isEmpty= method returns =true= if the object has no keys. For an array type value, =Uize.isEmpty= returns =true= if the array has no elements (ie. a length of =0=). For any other type of value, =Uize.isEmpty= returns =true= if the value is equivalent to =false=.

						EXAMPLES
						.....................................................
						Uize.isEmpty ({});                   // returns true
						Uize.isEmpty ([]);                   // returns true
						Uize.isEmpty ('');                   // returns true
						Uize.isEmpty (0);                    // returns true
						Uize.isEmpty (false);                // returns true
						Uize.isEmpty (null);                 // returns true
						Uize.isEmpty (undefined);            // returns true
						Uize.isEmpty (NaN);                  // returns true

						Uize.isEmpty ({blah:0});             // returns false
						Uize.isEmpty (['blah']);             // returns false
						Uize.isEmpty ('blah');               // returns false
						Uize.isEmpty (1);                    // returns false
						Uize.isEmpty (true);                 // returns false
						Uize.isEmpty (function () {});       // returns false
						.....................................................

						For object type values that are references to instances of objects *other* than =Object= (such as the =String=, =Boolean=, and =Number= objects, or =Uize.Class= subclasses), the object type value will first be resolved to a value by calling the =valueOf Instrinsic Method= of the object, and this resolved value will then be evaluated according the rules described above. Consider the following examples...

						EXAMPLES
						........................................................
						Uize.isEmpty (new String (''));         // returns true
						Uize.isEmpty (new Number (0));          // returns true
						Uize.isEmpty (new Boolean (false));     // returns true
						Uize.isEmpty (Uize.Class ({value:0}));  // returns true

						Uize.isEmpty (new String ('blah'));     // returns false
						Uize.isEmpty (new Number (0));          // returns false
						Uize.isEmpty (new Boolean (true));      // returns false
						Uize.isEmpty (Uize.Class ({value:1}));  // returns false
						........................................................

						Using =Uize.isEmpty (objectOrArray)= has better performance than the expression =!Uize.totalKeys (objectOrArray)=, because the latter expression iterates through all the keys of the object or elements of the array to count the total.

						NOTES
						- compare to the =Uize.emptyOut= static method
						- see also the other `value testing methods`
			*/
		};

		_package.isNaN = function (_value) {
			/* NOTE:
				The JavaScript special value NaN is the only value that is not equal to itself in a strict equality test, so this is a cheap way to test for it.
			*/
			return _value !== _value;
			/*?
				Static Methods
					Uize.isNaN
						Returns a boolean value, indicating whether or not the specified value is the JavaScript special value =NaN=.

						SYNTAX
						......................................
						isNaNBOOL = Uize.isNaN (valueANYTYPE);
						......................................

						There's Something About NaN
							JavaScript's built-in =isNaN= function is odd - and, some might say, less than useful - in its peculiar behavior.

							The first thing that the =isNaN= function does is to coerce the value it's given to a number type, so it will return =true= when the value being tested is =undefined= or some other value that, when coerced to a number, produces the value =NaN=. For example, the =isNaN= function will produce the result =false= when given the string value ='42'= (='42'= coerces to the number =42=), while it will produce the result =true= when given the string value ='foo'= (='foo'= coerces to the number type value =NaN=). Now, clearly neither of these two string values is the special value =NaN=, so the =isNaN= function fails to provide a useful way to test if a value is =NaN=.

							Now, add to this the peculiar fact that testing any value for strict equality against the special value =NaN= always produces the result =false= - even if the value being tested is itself =NaN= - and you have yourself a rather frustrating quandary. Since the expression =NaN &#61;&#61;&#61; NaN= produces the result =false=, you could use the expression =value !&#61;&#61; value= as a way of testing if a value is =NaN=, but you'd probably want to avoid having that in your code for fear of confusing the hell out of a person reading it later.

							The =Uize.isNaN= method comes to the rescue, providing a useful and semantically sensible way of testing if a value is the JavaScript special value =NaN=.

							EXAMPLES
							.......................................................................................
							// using the Uize.isNaN method, you get these results...

							Uize.isNaN (NaN);               // returns true

							Uize.isNaN (function () {});    // returns false (a function is not NaN)
							Uize.isNaN (new Number (NaN));  // returns false (a Number object is not NaN)
							Uize.isNaN (new Date ('foo'));  // returns false (a Date object is not NaN)
							Uize.isNaN (undefined);         // returns false
							Uize.isNaN (null);              // returns false
							Uize.isNaN ('foo');             // returns false
							Uize.isNaN ('');                // returns false
							Uize.isNaN ('42');              // returns false
							Uize.isNaN (42);                // returns false
							Uize.isNaN (true);              // returns false
							Uize.isNaN ({});                // returns false
							Uize.isNaN ([]);                // returns false


							// in contrast, JavaScript's built-in isNaN function produces these results

							isNaN (NaN);                    // returns true (hallelujah!)

							isNaN (undefined);              // returns true (undefined coerces to NaN)
							isNaN ('foo');                  // returns true ('foo' coerces to NaN)
							isNaN ({});                     // returns true ({} coerces to NaN)
							isNaN (function () {});         // returns true (a function coerces to NaN)
							isNaN (new Number (NaN));       // returns true (new Number (NaN) coerces to NaN)
							isNaN (new Date ('foo'));       // returns true (an invalid date coerces to NaN)

							isNaN (null);                   // returns false (null coerces to 0)
							isNaN ('42');                   // returns false ('42' coerces to 42)
							isNaN (true);                   // returns false (true coerces to 1)
							isNaN ('');                     // returns false ('' coerces to 0)
							isNaN ([]);                     // returns false ([] coerces to '', which coerces to 0)
							.......................................................................................

							From the above examples, it should be clear that the =Uize.isNaN= method is far more useful when trying to test if a specific value is exactly the JavaScript special value =NaN=, while it's clear that the built-in =isNaN= function's behavior is of questionable value.

						NOTES
						- compare to the =Uize.isNumber= static method
						- see also the other `value testing methods`
			*/
		};

		_package.isSameAs = function (_value,_otherValue) {
			/* NOTE:
				If the two values being compared are NaN, then a strict equality will fail, so we test to see if both are NaN. Now, the JavaScript special value NaN is the only value that is not equal to itself in a strict equality test, so this is a cheap way to test for it. We test if both values are not strictly equal to themselves.
			*/
			return _value === _otherValue || (_value !== _value && _otherValue !== _otherValue);
			/*?
				Static Methods
					Uize.isSameAs
						Returns a boolean, indicating whether or not the specified value is the same as another value in a strict equality test, but also supporting comparison of the JavaScript special value =NaN=.

						SYNTAX
						..............................................................
						isSameAsBOOL = Uize.isSameAs (valueANYTYPE,otherValueANYTYPE);
						..............................................................

						EXAMPLES
						....................................................................................
						Uize.isSameAs ('foo','foo');          // returns true
						Uize.isSameAs ('','');                // returns true
						Uize.isSameAs (42,42);                // returns true
						Uize.isSameAs (Infinity,Infinity);    // returns true
						Uize.isSameAs (NaN,NaN);              // returns true
						Uize.isSameAs (false,false);          // returns true
						Uize.isSameAs (null,null);            // returns true
						Uize.isSameAs (undefined,undefined);  // returns true

						Uize.isSameAs (null,undefined);       // returns false
						Uize.isSameAs (null,NaN);             // returns false
						Uize.isSameAs ('',0);                 // returns false
						Uize.isSameAs (1,true);               // returns false
						Uize.isSameAs ('true',true);          // returns false
						Uize.isSameAs ('foo','');             // returns false
						Uize.isSameAs ('null',null);          // returns false
						Uize.isSameAs ('42',42);              // returns false
						Uize.isSameAs ({},{});                // returns false (different object references)
						Uize.isSameAs ([],[]);                // returns false (different array references)
						....................................................................................

						NaN is the Same as NaN
							The =Uize.isSameAs= method is most useful in its support for comparing two values that may be the JavaScript special value =NaN=.

							The special value =NaN= is never considered to be equal to itself in a strict equality test. So, for example, the expression =NaN &#61;&#61;&#61; NaN= produces the result =false=. The =Uize.isSameAs= method comes to the rescue and provides special handling in order to ensure that if the two values being compared are both =NaN=, then the method will return =true=.

							EXAMPLE
							.........................................................
							var
								valueA = NaN,
								valueB = NaN
							;
							alert (valueA === valueB);              // alerts "false"
							alert (Uize.isSameAs (valueA,valueB));  // alerts "true"
							.........................................................

						NOTES
						- see also the related =Uize.isNaN= static method
						- see also the other `value testing methods`
			*/
		};

		_package.emptyOut = function (_source) {
			if (_isObject (_source)) {
				if (_isArray (_source)) {
					_source.length = 0;
				} else {
					for (var _property in _source)
						delete _source [_property]
					;
				}
			}
			return _source;
			/*?
				Static Methods
					Uize.emptyOut
						Empties out the specified source object or array and returns a reference to the source.

						SYNTAX
						....................................................
						sourceOBJorARRAY = Uize.emptyOut (sourceOBJorARRAY);
						....................................................

						Using this method to empty out an array is equivalent to setting the array's length to =0=, while using this method to empty out an object results in all the object's properties being deleted. When the value =null= or =undefined= is specified for the =sourceOBJorARRAY= parameter, then this method will do nothing and simply return the value of the =sourceOBJorARRAY= parameter.

						EXAMPLE
						..........................................................
						Uize.copyInto (Uize.emptyOut (userData),userDataDefaults);
						..........................................................

						In the above example, a =userData= object has accumulated a large amount of user data and we wish to reset it to some initial default state. Because references to the object may be shared by many parts of an application's code, we want to re-initiatialize it by modifying its contents, restoring its state to that of the =userDataDefaults= object. The =Uize.emptyOut= method lets us first empty out the object, after which it is passed as the source for the =Uize.copyInto= method call where we copy back in the contents of the =userDataDefaults= object.

						NOTES
						- compare to the =Uize.isEmpty= static method
						- see also the other `basic data utilities`
			*/
		};

		var _recordMatches = _package.recordMatches = function (_record,_match) {
			if (!_record) return !_match;
			if (_isFunction (_match)) return _match (_record);
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

		var _toNumber = _package.toNumber = function (_value,_defaultValue) {
			if (typeof _value == _typeNumber) {
				if (_value == _value) return _value; // return early if value is a number and not the special value NaN
			} else {
				if (_isFunction (_value)) _value = _value ();
				if (_isObject (_value)) _value = _value.valueOf ();
			}
			return (
				(
					_value = _value == _undefined || _value === '' || _value !== _value || !_isPrimitive (_value)
						? NaN
						: +_value
				) != _value && arguments.length > 1
					? _defaultValue
					: _value
			);
			/*?
				Static Methods
					Uize.toNumber
						Returns a number, that is the specified value coerced to a number type value, with optional defaulting if the value can't be successfully coerced to a number.

						DIFFERENT USAGES

						`Coerce a Value to a Number`
						...........................................
						valueNUMBER = Uize.toNumber (valueANYTYPE);
						...........................................

						`Coerce a Value to a Number, With Defaulting`
						..........................................................
						valueNUMBER = Uize.toNumber (valueANYTYPE,defaultANYTYPE);
						..........................................................

						How a Value is Coerced to Number
							The =Uize.toNumber= method coerces a value to a number using the following steps...

							#. if the value is a function, then the function is called and the value is replaced with the value returned by the function
							#. next, if the value is an object, then the object's =valueOf intrinsic method= is called and the value is replaced by the value returned by the =valueOf intrinsic method=
							#. next, if the value is =undefined=, =null=, =''= (an empty string), or not a primitive type value like a string, number, or boolean, then it is replaced with the special value =NaN=
							#. next, the value is coerced to a number using the "+" operator
							#. next, if the coerced value is the special value =NaN=, and if an optional default value is specified, then the value is replaced with the default value

							The above steps for coercing a value to number has the following side effects / implications...

							Empty String is Coerced to NaN
								Coercing the value =''= (an empty string) to a number will produce the result =NaN=.

								EXAMPLE
								...................................
								Uize.toNumber ('');  // returns NaN
								...................................

							The Values null and undefined Are Coerced to NaN
								Coercing the values =null= or =undefined= to a number will produce the result =NaN=

								EXAMPLE
								..........................................
								Uize.toNumber (null);       // returns NaN
								Uize.toNumber (undefined);  // returns NaN
								..........................................

							Arrays Are Coerced to NaN
								Coercing an array to a number always produces the result =NaN=.

								This is because the =valueOf intrinsic method= of JavaScript's built-in =Array= object always returns a reference to the array on which it is called.

								EXAMPLE
								....................................
								Uize.toNumber ([]);   // returns NaN
								Uize.toNumber ([1]);  // returns NaN
								....................................

							Some Objects Are Coerced to NaN
								Unless an object deliberately implements the =valueOf intrinsic method=, or the object is an instance of a =Uize.Class= subclass, coercing an object to a number will produce the result =NaN=.

								This is because the implementation of the =valueOf intrinsic method= in JavaScript's built-in =Object= object simply returns a reference to the object on which it is called. The =Uize.toNumber= method only coerces an object to a number successfully if the =valueOf intrinsic method= for the object returns a primitive type value, such as a string, number, or boolean.

								EXAMPLE
								.................................................................
								// these objects can be successfully coerced to a number

								Uize.toNumber (new Number (5));                    // returns 5
								Uize.toNumber (new String ('5'));                  // returns 5
								Uize.toNumber (new Boolean (true));                // returns 1
								Uize.toNumber (Uize.Class ({value:5}));            // returns 5
								Uize.toNumber (Uize.Class ({value:'5'}));          // returns 5
								Uize.toNumber (Uize.Class ({value:true}));         // returns 1
								Uize.toNumber ({valueOf:function () {return 5}});  // returns 5


								// these objects will be coerced to NaN

								Uize.toNumber ({});                                // returns NaN
								Uize.toNumber ({foo:'bar'});                       // returns NaN
								Uize.toNumber (new XMLHttpRequest);                // returns NaN
								Uize.toNumber (/\d+/);                             // returns NaN
								.................................................................

							Key Distinctions When Compared With Simple Coercion
								A cheap way to coerce a value to a number in JavaScript is to subtract zero from it, which results in JavaScript performing the steps necessary to produce a number type value.

								Besides its convenient defaulting ability, the =Uize.toNumber= method behaves differently to simple coercion in a number of key ways...

								- The =Uize.toNumber= method coerces =''= (an empty string) to =NaN=, whereas simple coercion turns an empty string into =0=. So, the statement =Uize.toNumber ('')= produces the value =NaN= while the statement ='' - 0= produces the value =0=. For the purpose of coercing a value to a number with defaulting, it makes more sense to treat an empty string as no value specified, rather than as the value =0= specified.

								- The =Uize.toNumber= method coerces =null= to =NaN=, whereas simple coercion turns =null= into =0=. So, the statement =Uize.toNumber (null)= produces the value =NaN= while the statement =null - 0= produces the value =0=. For the purpose of coercing a value to a number with defaulting, it makes more sense to treat the value =null= as no value specified, rather than as the value =0= specified.

								- The =Uize.toNumber= method will attempt to coerce a function to a number by calling it and using its result, whereas simple coercion produces the value =NaN=. So, the statement =Uize.toNumber (function () {return 5})= produces the value =5= while the statement =(function () {return 5}) - 0= produces the value =NaN=.

							Using the Uize.toNumber Method
								There are two main situations where the =Uize.toNumber= method comes in handy.

								Normalizing Method Parameters
									The =Uize.toNumber= method can be used to "normalize" method parameter values that need to be number type.

									EXAMPLE
									.................................................
									function repeatStr (string,times) {
										times = Uize.toNumber (times,1);
										var result = '';
										for (var repeatNo = -1; ++repeatNo < times;) {
											result += string;
										}
										return result;
									}
									.................................................

									In the above example, a =repeatStr= function is being implemented that will take a specified string and create a new string by repeating the string the specified number of times. The number of repetitions, which needs to be a number, is specified by the =times= parameter of the function.

									Now, if the developer of the function wants to provide flexibility in how the number of repetitions is specified, the =Uize.toNumber= method can be used to coerce the value of this parameter to a number before it is used internally by the function's implementation. In this example, we're also specifying a default of =1=, in case the parameter is not specified or if the value specified cannot be coerced to a number without producing the value =NaN=.

									Now, using the =repeatStr= function, as implemented above, we would see the following results...

									RESULTS
									..............................................................
									repeatStr ('Foo',2);                       // returns "FooFoo"
									repeatStr ('Foo','2');                     // returns "FooFoo"
									repeatStr ('Foo',Uize.Class ({value:2}));  // returns "FooFoo"
									repeatStr ('Foo',function () {return 2});  // returns "FooFoo"
									repeatStr ('Foo',true);                    // returns "Foo"
									repeatStr ('Foo',false);                   // returns ""

									repeatStr ('Foo');                         // returns "Foo"
									repeatStr ('Foo',NaN);                     // returns "Foo"
									repeatStr ('Foo','bar');                   // returns "Foo"
									repeatStr ('Foo',null);                    // returns "Foo"
									repeatStr ('Foo',undefined);               // returns "Foo"
									..............................................................

								Conforming State Properties
									The =Uize.toNumber= method can be specified as a conformer for a state property of a =Uize.Class= subclass.

									EXAMPLE
									.......................................
									var Rectangle = Uize.Class.subclass ();

									Rectangle.stateProperties ({
										width:{
											conformer:Uize.toNumber,
											value:0
										},
										height:{
											conformer:Uize.toNumber,
											value:0
										}
									});
									.......................................

									In the above example, a =Rectangle= class is being defined that has two state properties: =width= and =height=. For the convenience of users of the class, the =Uize.toNumber= method is set as the conformer for both the =width= and =height= properties. This means that the user of the class can set the values for these properties using values that are other than number type, and the developer of the class can write the rest of the class' code with confidence that internally the values for the properties will always be number type.

									So, given the above implementation of the =Rectangle= class, we would see the following results...

									RESULTS
									................................................................
									var rect = Rectangle ({width:'5',height:'10'});

									myInstance.get ('width');                          // returns 5
									myInstance.get ('height');                         // returns 10

									myInstance.set ('width',true);
									myInstance.get ('width');                          // returns 1

									myInstance.set ('height',function () {return 7});
									myInstance.get ('height');                         // returns 7

									myInstance.set ('width',Uize.Class ({value:12}));
									myInstance.get ('width');                          // returns 12
									................................................................

						Coerce a Value to a Number
							A value of any type can be coerced to a number by calling the =Uize.toNumber= method and passing the value that is to be coerced to a number as the single parameter.

							SYNTAX
							...........................................
							valueNUMBER = Uize.toNumber (valueANYTYPE);
							...........................................

							EXAMPLES
							...................................................................................
							// values that can be coerced successfully to a number

							Uize.toNumber (5);                                              // returns 5
							Uize.toNumber (Infinity);                                       // returns Infinity
							Uize.toNumber (true);                                           // returns 1
							Uize.toNumber (false);                                          // returns 0
							Uize.toNumber ('-1.234');                                       // returns -1.234
							Uize.toNumber ('Infinity');                                     // returns Infinity
							Uize.toNumber ('0xff');                                         // returns 255
							Uize.toNumber (function () {return 5});                         // returns 5
							Uize.toNumber (function () {return '5'});                       // returns 5
							Uize.toNumber (Uize.Class ({value:5}));                         // returns 5
							Uize.toNumber (Uize.Class ({value:'5'}));                       // returns 5
							Uize.toNumber (new Number (5));                                 // returns 5
							Uize.toNumber (new String ('5'));                               // returns 5
							Uize.toNumber (new Boolean (true));                             // returns 1
							Uize.toNumber (function () {return Uize.Class ({value:5})});    // returns 5
							Uize.toNumber (function () {return Uize.Class ({value:'5'})});  // returns 5


							// values that cannot be coerced to a number

							Uize.toNumber ('foo');                                          // returns NaN
							Uize.toNumber (NaN);                                            // returns NaN
							Uize.toNumber ({});                                             // returns NaN
							Uize.toNumber ([1]);                                            // returns NaN
							Uize.toNumber (/\d+/);                                          // returns NaN
							Uize.toNumber (undefined);                                      // returns NaN
							Uize.toNumber (null);                                           // returns NaN
							Uize.toNumber ('');                                             // returns NaN
							Uize.toNumber (Uize.Class ({value:Uize.Class ({value:5})}));    // returns NaN
							Uize.toNumber (Uize.Class ({value:function () {return 5}}));    // returns NaN
							Uize.toNumber (function () {return function () {return 5}});    // returns NaN
							...................................................................................

						Coerce a Value to a Number, With Defaulting
							A value of any type can be coerced to a number, with defaulting if the value can't be successfully coerced to a number, by specifing a default value using the optional =defaultANYTYPE= second parameter.

							SYNTAX
							..........................................................
							valueNUMBER = Uize.toNumber (valueANYTYPE,defaultANYTYPE);
							..........................................................

							EXAMPLES
							......................................................................................
							// values that can be coerced successfully to a number

							Uize.toNumber (5,99);                                              // returns 5
							Uize.toNumber (Infinity,99);                                       // returns Infinity
							Uize.toNumber (true,99);                                           // returns 1
							Uize.toNumber (false,99);                                          // returns 0
							Uize.toNumber ('-1.234',99);                                       // returns -1.234
							Uize.toNumber ('Infinity',99);                                     // returns Infinity
							Uize.toNumber ('0xff',99);                                         // returns 255
							Uize.toNumber (function () {return 5},99);                         // returns 5
							Uize.toNumber (function () {return '5'},99);                       // returns 5
							Uize.toNumber (Uize.Class ({value:5}),99);                         // returns 5
							Uize.toNumber (Uize.Class ({value:'5'}),99);                       // returns 5
							Uize.toNumber (new Number (5),99);                                 // returns 5
							Uize.toNumber (new String ('5'),99);                               // returns 5
							Uize.toNumber (new Boolean (true),99);                             // returns 1
							Uize.toNumber (function () {return Uize.Class ({value:5})},99);    // returns 5
							Uize.toNumber (function () {return Uize.Class ({value:'5'})},99);  // returns 5

							// values that cannot be coerced to a number

							Uize.toNumber ('foo',99);                                          // returns 99
							Uize.toNumber (NaN,99);                                            // returns 99
							Uize.toNumber ({},99);                                             // returns 99
							Uize.toNumber ([1],99);                                            // returns 99
							Uize.toNumber (/\d+/,99);                                          // returns 99
							Uize.toNumber (undefined,99);                                      // returns 99
							Uize.toNumber (null,99);                                           // returns 99
							Uize.toNumber ('',99);                                             // returns 99
							Uize.toNumber (Uize.Class ({value:Uize.Class ({value:5})}),99);    // returns 99
							Uize.toNumber (Uize.Class ({value:function () {return 5}}),99);    // returns 99
							Uize.toNumber (function () {return function () {return 5}},99);    // returns 99
							......................................................................................

						NOTES
						- see also the other `useful value transformers`
			*/
		};

		_package.findRecordNo = function (_records,_match,_defaultNoIfNoMatch) {
			for (var _recordNo = -1, _recordsLength = _records ? _records.length : 0; ++_recordNo < _recordsLength;)
				if (_recordMatches (_records [_recordNo],_match)) return _recordNo
			;
			return _constrain (_toNumber (_defaultNoIfNoMatch,-1),-1,_recordsLength - 1);
			/*?
				Static Methods
					Uize.findRecordNo
						Returns an integer, indicating the index in the specified records array of the first record whose contents is a superset of the contents of the specified match object.

						SYNTAX
						........................................................
						recordNoINT = Uize.findRecordNo (recordsARRAY,matchOBJ);
						........................................................

						If no matching record can be found, then this method will return the value =-1=, unless the optional =defaultNoNONNULL= parameter is specified.

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

						VARIATION
						.........................................................................
						recordNoINT = Uize.findRecordNo (recordsARRAY,matchOBJ,defaultNoNONNULL);
						.........................................................................

						When the optional =defaultNoNONNULL= parameter is specified, then the value of this parameter, coerced to a number, will be returned as the result if no match is found. If the value =null= or =undefined= is specified for the =defaultNoNONNULL= parameter, or if its value coerced to a number produces the special value =NaN=, then it will be treated as =-1=.

						NOTES
						- this method uses strict matching, so the statement =Uize.findRecordNo ([{index:'0'},{index:'1'}],{index:1})= will return =-1=
						- see also the related =Uize.findRecord= and =Uize.recordMatches= static methods
						- see also the other `basic data utilities`
			*/
		};

		_package.findRecord = function (_records,_match,_defaultNoIfNoMatch) {
			var _recordNo = _package.findRecordNo (_records,_match,_defaultNoIfNoMatch);
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
						- see also the other `basic data utilities`
			*/
		};

		var _getClass = _package.getClass = function (_instanceOrClass) {
			return (
				_instanceOrClass == _undefined
					? _undefined
					: typeof _instanceOrClass == _typeFunction
						? _instanceOrClass
						: _instanceOrClass.constructor
			);
			/*?
				Static Methods
					Uize.getClass
						Resolves the specified value to a class, or returns the value =undefined= if the specified value is =null= or =undefined=.

						SYNTAX
						........................................
						classOBJ = Uize.getClass (valueANYTYPE);
						........................................

						The =Uize.getClass= method resolves a value to a class using the following steps...

						#. if the specified value is =null= or =undefined=, then the value =undefined= is returned
						#. else, if the specified value is a function reference, then the function reference is returned
						#. else, the value of the value's =constructor= property is returned

						The =Uize.getClass= method can be used to resolve either an instance of a class, or a class itself, to a class.

						EXAMPLES
						......................................................................
						// when called with null or undefined

							Uize.getClass (null);                 // returns undefined
							Uize.getClass (undefined);            // returns undefined

						// when called with JavaScript primitives

							Uize.getClass (42);                   // returns Number
							Uize.getClass (NaN);                  // returns Number
							Uize.getClass (Infinity);             // returns Number
							Uize.getClass (true);                 // returns Boolean
							Uize.getClass ('foo');                // returns String

						// when called with instances of JavaScript objects

							Uize.getClass (new Object ());        // returns Object
							Uize.getClass (new Number (42));      // returns Number
							Uize.getClass (new Boolean (true));   // returns Boolean
							Uize.getClass (new String ('foo'));   // returns String
							Uize.getClass (new RegExp ('\\d+'));  // returns RegExp

						// when called with implicitly created instances of JavaScript objects

							Uize.getClass ({foo:'bar'});          // returns Object
							Uize.getClass (['foo','bar']);        // returns Array
							Uize.getClass (/\d+/);                // returns RegExp

						// when called with instances of Uize.Class subclasses

							Uize.getClass (Uize.Widget.Bar ());   // returns Uize.Widget.Bar
							Uize.getClass (new Uize.Fade);        // returns Uize.Fade

						// when called with object constructors or Uize.Class subclasses

							Uize.getClass (Object);               // returns Object
							Uize.getClass (Number);               // returns Number
							Uize.getClass (Boolean);              // returns Boolean
							Uize.getClass (String);               // returns String
							Uize.getClass (Uize.Widget.Bar);      // returns Uize.Widget.Bar
						......................................................................
			*/
		};

		_package.getGuid = function () {
			return 'uizeGuid' + _uizeGuids++;
			/*?
				Static Methods
					Uize.getGuid
						Returns a string value, being an ID that is globally unique in the current window context.

						SYNTAX
						..........................
						guidSTR = Uize.getGuid ();
						..........................

						When an instance of a =Uize.Class= subclass is created, its =instanceId= instance property is set to a value returned by this method. This method may also be useful in the implementations of subclasses, in situations where it is necessary to stash something in a context shared by different modules of code that need to be able to interoperate without conflicts.
			*/
		};

		var _getPathToLibrary = _package.getPathToLibrary = function (_moduleFilename,_moduleToken) {
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
					if (
						(_moduleFilenamePos = (_scriptSrc = _scriptTags [_scriptTagNo].src).indexOf (_moduleFilename))
						> -1
					)
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

						Whereas the =Uize.pathToResources= static property specifies the relative path to the folder containing the "Uize.js" JavaScript module, this method can be used to find the relative path to a different JavaScript module that is being sourced into the document. This can be useful when the JavaScript module implementing a =Uize.Class= subclass does not reside in the same folder alongside the "Uize.js" file.

						This method is useful in the implementation of =Uize.Class= subclasses that may wish to, in their implementation, make use of image and other support resources located inside the folder that contains the class's JavaScript module. By using this method, a subclass' implementation does not need to know whether or not the document using it is being loaded through HTTP or from the local file system and does not need to impose extra requirements on developers regarding where its JavaScript module is located in relation to documents using it.

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
						- see also the other `module mechanism methods`
			*/
		};

		_package.global = _Function (
			'return (function () {return this}) ()'
			/*?
				Static Methods
					Uize.global
						Returns a reference to the global object.

						SYNTAX
						...........................
						globalOBJ = Uize.global ();
						...........................

						The =Uize.global= method should be used in situations where you need to access or assign properties on the global object, or to call methods on the global object, and where you need that code to be able to run inside a browser as well as other environments like WSH (Windows Script Host) or NodeJS.

						In cases where you need to work with properties of the global object inside a browser, you would typically just reference the =window= object. However, in non-browser environments where you might run your JavaScript code, the =window= object is not applicable and usually not defined. To be entirely safe, use the =Uize.global= method - it will return the =window= object when you're running the code in a browser, and in other environments it will return their equivalent of the global object.

						EXAMPLES
						........................................
						// assign a value to a global property
						Uize.global ().myGlobalProperty = 'foo';

						// access a global property
						alert (Uize.global ().myGlobalProperty);

						// delete a global property
						delete Uize.global ().myGlobalProperty;
						........................................

						If you are going to be calling the =Uize.global= method multiple times inside some code to access or assign values to global properties, you can create a local variable that is a reference to the global object. So, the above example could be re-written as...

						......................................
						var _global = Uize.global ();

						// assign a value to a global property
						_global.myGlobalProperty = 'foo';

						// access a global property
						alert (_global.myGlobalProperty);

						// delete a global property
						delete _global.myGlobalProperty;
						......................................

						Defeating Scope Chain Overrides
							The =Uize.global= method can be useful in situations where you need to defeat an override of some identifier from the scope chain of the local scope in order to force access of the global version.

							If one defines a global identifier but then is executing code from within a deep local scope, and if the identifier is overridden somewhere in the scope chain of the local scope, then a way to force access to that identifier in the global scope is to use the =Uize.global= method. Consider the following example...

							EXAMPLE
							..................................................................
							var foo = 'global scope';

							function MyObject () {
								var foo = 'local scope';

								this.alertLocalScopeFoo = function () {
									alert (foo);
								};

								this.alertGlobalScopeFoo = function () {
									alert (Uize.global ().foo);
								};
							}

							var myObjectInstance = new MyObject ();

							myObjectInstance.alertLocalScopeFoo ();   // alerts "local scope"
							myObjectInstance.alertGlobalScopeFoo ();  // alerts "global scope"
							..................................................................

							In the above example, we have a global variable named =foo=. Inside the constructor of =MyObject=, we also have a local variable named =foo=. Now, for any function that is defined within the constructor's scope, the local =foo= variable will override the =foo= variable from the global scope.

							So, for the =alertLocalScopeFoo= method that is being defined, when it tries to access the =foo= variable simply by its name, it gets the version from the local scope. So, in order for the =alertGlobalScopeFoo= method to actually access the =foo= from the global scope, it can use the =Uize.global= method to get a reference to the global object and then dereference =foo= as a property on that object.
			*/
		);

		_package.eval = _Function (
			'\'use strict\'; return eval (arguments [0])'
			/*?
				Static Methods
					Uize.eval
						Lets you perform `quarantined code evaluation` of the specified JavaScript code string, using `JavaScript strict mode`.

						SYNTAX
						..............................................
						evalResultANYTYPE = Uize.eval (codeToEvalSTR);
						..............................................

						The =Uize.eval= method imposes `JavaScript strict mode` on the code being evaluated. If you need to evaluate code in non-strict mode, use the companion =Uize.laxEval= method. The =Uize.eval= method returns any result that was produced by the code being evaluated.

						For a detailed discussion of quarantining and to see examples, consult the section `Quarantined Code Execution`.

						NOTES
						- compare to the companion =Uize.laxEval= static method
						- compare to the related =Uize.quarantine= static method
			*/
		);

		_package.laxEval =
		_package.globalEval = /* DEPRECATED 2013-01-14 */
		_Function (
			'return eval (arguments [0])'
			/*?
				Static Methods
					Uize.laxEval
						Lets you perform `quarantined code evaluation` of the specified JavaScript code string, but not in `JavaScript strict mode`.

						SYNTAX
						.................................................
						evalResultANYTYPE = Uize.laxEval (codeToEvalSTR);
						.................................................

						The =Uize.laxEval= method evaluates the specified code string in non-strict mode. If you would prefer to evaluate code in JavaScript strict mode, use the companion =Uize.eval= method. The =Uize.laxEval= method returns any result that was produced by the code being evaluated.

						For a detailed discussion of quarantining and to see examples, consult the section `Quarantined Code Execution`.

						NOTES
						- compare to the companion =Uize.eval= static method
						- compare to the related =Uize.quarantine= static method

				Deprecated Features
					Uize.globalEval -- DEPRECATED 2013-01-14
						The =Uize.globalEval= static method has been deprecated in favor of the newly added =Uize.laxEval= static method.

						..........................................
						Uize.globalEval >> BECOMES >> Uize.laxEval
						..........................................

						The =Uize.laxEval= method is essentially just a renaming of the deprecated =Uize.globalEval= method and behaves in exactly the same way. The old name was deemed to be misleading.

						While the =Uize.globalEval= method could be used to evaluate JavaScript code outside of the scope of the current function, that scope was actually a root level *function* defined in the global scope - the evaluated code itself could not truly be evaluated at the very root of the global scope. The spirit of the method was never so much about evaluating code in the global scope as it was about evaluating the code in a way that was quarantined from the current scope (see `Quarantined Code Evaluation`), so as not to risk side effects of local variable access and closure memory reference implications that would arise from evaluating the code within the current function's scope.
			*/
		);

		_package.quarantine = function (_function) {
			var
				_functionArguments = (_function += '').slice (_function.indexOf ('(') + 1,_function.indexOf (')')),
				_functionBody = _function.slice (_function.indexOf ('{') + 1,_function.lastIndexOf ('}'))
			;
			return _functionArguments ? _Function (_functionArguments,_functionBody) : _Function (_functionBody);
			/*?
				Static Methods
					Uize.quarantine
						Returns a function, being a quarantined version of the supplied function.

						SYNTAX
						...............................................................
						quarantinedFunctionFUNC = Uize.quarantine (sourceFunctionFUNC);
						...............................................................

						For a detail discussion on this method and to see examples, consult the section `Quarantined Nested Functions`. For a more general discussion on quarantining, consult the section `Quarantined Code Execution`.

						NOTES
						- compare to the related =Uize.eval= and =Uize.laxEval= static methods
			*/
		};

		var _isInstance = _package.isInstance = function (_value) {
			return !!(typeof _value == _typeObject && _value && _value.constructor.subclass);
			/*?
				Static Methods
					Uize.isInstance
						Returns a boolean, indicating whether or not the specified value is a reference to an instance of a UIZE class.

						SYNTAX
						................................................
						isInstanceBOOL = Uize.isInstance (valueANYTYPE);
						................................................

						This method can be useful when implementing methods that may be called on a class as well as on an instance of a class.

						NOTES
						- see also the other `value testing methods`
			*/
		};

		_package.nop = _Function ();
			/*?
				Static Methods
					Uize.nop
						A dummy function that performs no operation and returns no value (which is effectively the same as returning the value =undefined=).

						SYNTAX
						..........................
						resultUNDEF = Uize.nop ();
						..........................

						The =Uize.nop= method is named after the [[http://en.wikipedia.org/wiki/Nop][NOP (No Operation Performed)]] assembly language instruction. This method can be provided as a callback to methods that require a callback function and may fail if one is not provided, but where you don't need anything to be executed in the callback. You could always provide your own empty anonymous function, but =Uize.nop= is provided for your convenience and it can be shared across all instances where an empty function needs to be provided.

						EXAMPLE
						............................
						serviceRequest ({
							serviceParams:{
								// service params here
							},
							callback:Uize.nop
						});
						............................

						NOTES
						- see the related =Uize.returnFalse= static method
						- see also the other `dummy functions`
			*/

		_package.returnFalse = _Function (
			'return false'
			/*?
				Static Methods
					Uize.returnFalse
						A dummy function that always returns the boolean value =false=, and that can be useful as an event handler or in other situations.

						SYNTAX
						................................
						falseBOOL = Uize.returnFalse ();
						................................

						This method can be assigned to event handlers to cancel their default action, as in the following example...

						EXAMPLE
						..................................
						myNode.onclick = Uize.returnFalse;
						..................................

						If you are cancelling the default action for many nodes in a page, then using this static method allows you to share a single function - by reference - across all these nodes.

						NOTES
						- see also the companion =Uize.returnTrue= static method
						- see the related =Uize.nop= static method
						- see also the other `dummy functions`
			*/
		);

		_package.returnTrue = _Function (
			'return true'
			/*?
				Static Methods
					Uize.returnTrue
						A dummy function that always returns the boolean value =true=, and that can be useful as an event handler or in other situations.

						SYNTAX
						..............................
						trueBOOL = Uize.returnTrue ();
						..............................

						This method can be assigned to event handlers to enable their default action, as in the following example...

						EXAMPLE
						.................................
						myNode.onclick = Uize.returnTrue;
						.................................

						If you are enabling the default action for many nodes in a page, then using this static method allows you to share a single function - by reference - across all these nodes.

						NOTES
						- see also the companion =Uize.returnFalse= static method
						- see also the other `dummy functions`
			*/
		);

		_package.returnX = _Function (
			'x',
			'return x'
			/*?
				Static Methods
					Uize.returnX
						A dummy function that accepts a single argument =x= and returns the value of that argument unchanged.

						SYNTAX
						...................................
						xANYTYPE = Uize.returnX (xANYTYPE);
						...................................

						NOTES
						- see also the other `dummy functions`
			*/
		);

		/*** Barrier object ***/
			var
				_Barrier = function () {
					var _this = this;
					_this._doneLookup = {};
					_this._doneResults = {};
					_this._doneHandlers = {};
				},
				_BarrierPrototype = _Barrier.prototype
			;

			_BarrierPrototype.done = function (_condition,_result) {
				var
					_this = this,
					_doneHandlers = _this._doneHandlers [_condition]
				;
				_this._doneLookup [_condition] = _trueFlag;
				_this._doneResults [_condition] = _result;
				if (_doneHandlers) {
					delete _this._doneHandlers [_condition];
					for (
						var _doneHandlerNo = -1, _doneHandlersLength = _doneHandlers.length;
						++_doneHandlerNo < _doneHandlersLength;
					)
						_doneHandlers [_doneHandlerNo] (_result)
					;
				}
			};

			_BarrierPrototype.once = function (_conditions,_handler) {
				var _this = this;
				if (_isList (_conditions) && _conditions.length < 2)
					_conditions = _conditions [0]
				;
				if (_conditions == _undefined) {
					_handler ();
				} else if (_isList (_conditions)) {
					var
						_results = [],
						_conditionsLength = _conditions.length,
						_conditionsDone = 0
					;
					_forEach (
						_conditions,
						function (_condition,_conditionNo) {
							_this.once (
								_condition,
								function (_result) {
									_results [_conditionNo] = _result;
									(++_conditionsDone == _conditionsLength) && _handler.apply (0,_results);
								}
							);
						}
					);
				} else {
					_this._doneLookup [_conditions] == _trueFlag
						? _handler (_this._doneResults [_conditions])
						: (_this._doneHandlers [_conditions] || (_this._doneHandlers [_conditions] = [])).push (_handler)
					;
				}
			};

		/*** Module Mechanism ***/
			var
				_modulePathToken = '[#modulePath]',
				_modulesByName = {},
				_moduleDefinitionsClaimed = {},
				_modulesAlreadyInvoked = {},
				_modulesLoadedBarrier = new _Barrier ()
			;

			var _getModuleByName = _package.getModuleByName = function (_moduleName) {
				var _module;
				return (
					typeof _moduleName == _typeString
						? (
							_modulesByName [_moduleName] ||
							(_moduleName == '*' && _modulesByName) ||
							(
								(_module = _Function ('try {return ' + _moduleName + '} catch (e) {}') ()) &&
								(_modulesByName [_moduleName] = _module)
							)
						)
						: _moduleName
				);
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

							NOTES
							- see also the other `module mechanism methods`
				*/
			};

			var _resolveModuleDefinition = _package.resolveModuleDefinition = function (_definition) {
				var
					_name = _definition.name = _definition.name || '',
					_host = _definition.host = _name.substr (0,_name.lastIndexOf ('.')),
					_superclass = _definition.superclass = _definition.superclass || _host,
					_required = _definition.required
				;
				_required = _definition.required = _isString (_required) ? _required.split (',') : _required || [];
				_host && _required.push (_host);
				_superclass != _host && _required.push (_superclass);

				return _definition;
				/*?
					Static Methods
						Uize.resolveModuleDefinition
							Resolves the specified module definition object by defaulting its properties and expanding them as necessary, modifying and returning the original definition object.

							SYNTAX
							.........................................................................
							moduleDefinitionOBJ = Uize.resolveModuleDefinition (moduleDefinitionOBJ);
							.........................................................................

							The =Uize.resolveModuleDefinition= method is not intended for use in general application development but is intended for specialized build processes, such as dependency tracing performed during the creation of JavaScript packages.

							For an in-depth discussion of modules, consult the explainer [[../explainers/javascript-modules.html][JavaScript Modules]].

							NOTES
							- see also the other `module mechanism methods`
				*/
			};

			_package.require = function (_modules,_callback) {
				if (typeof _modules == _typeString)
					_modules = [_modules]
				;
				_callback && _modulesLoadedBarrier.once (_modules,_callback);
				_forEach (
					_modules,
					function (_module) {
						if (_modulesAlreadyInvoked [_module] != _trueFlag) {
							_modulesAlreadyInvoked [_module] = _trueFlag;
							_package.moduleLoader (
								_module,
								function (_moduleCode) {_moduleCode && _package.laxEval (_moduleCode)}
							)
						}
					}
				);
				/*?
					Static Methods
						Uize.require
							Ensures that all of the specified modules are loaded before calling the specified callback function, loading required modules as necessary.

							The =Uize.require= method can be used to load required modules, as necessary, before executing code that depends on those modules being loaded.

							DIFFERENT USAGES

							`Require a Single Module`
							..........................................
							Uize.require (moduleNameSTR,callbackFUNC);
							..........................................

							`Require Multiple Modules`
							.............................................
							Uize.require (moduleNamesARRAY,callbackFUNC);
							.............................................

							`Require Modules With No Callback`
							...............................................
							Uize.require (moduleNameSTRorModuleNamesARRAY);
							...............................................

							Require a Single Module
								In the most basic usage, a single module can be required by specifying the name of the module as a string for the =moduleNameSTR= parameter.

								SYNTAX
								..........................................
								Uize.require (moduleNameSTR,callbackFUNC);
								..........................................

								EXAMPLE 1
								..............................
								Uize.require (
									'Uize.Widget.Bar.Slider',
									function (Slider) {
										var mySlider = Slider ({
											minValue:-50,
											maxValue:50,
											value:0
										});
									}
								);
								..............................

								In the above example, the =Uize.Widget.Bar.Slider= widget class module is being required. Once the =Uize.Widget.Bar.Slider= module is loaded, the =Uize.require= method will call the callback specified by the =callbackFUNC= parameter, passing a reference to =Uize.Widget.Bar.Slider= module as the callback function's first argument. In this example, we have named the argument =Slider=. You can name this argument anything you like, as long as it's a valid JavaScript identifier. If we wanted to reinforce that this argument is a reference to the =Uize.Widget.Bar.Slider= module, we could name the argument something like =Uize_Widget_Bar_Slider= or =UizeWidgetBarSlider= (depending on whether or not we like using underscores in variable names).

								EXAMPLE 2
								..............................................
								Uize.require (
									'Uize.Widget.Bar.Slider',
									function () {
										var mySlider = Uize.Widget.Bar.Slider ({
											minValue:-50,
											maxValue:50,
											value:0
										});
									}
								);
								..............................................

								In the above example, we are also requiring the =Uize.Widget.Bar.Slider= module. In this case, however, instead of using the reference to the module that would be passed to the callback function, we are simply ignoring this argument and referencing the =Uize.Widget.Bar.Slider= module by its name in the global scope. This is also supported.

							Require Multiple Modules
								In cases where you need to require more than one module, a list of module names can be specified as a string array for the =moduleNamesARRAY= parameter.

								SYNTAX
								.............................................
								Uize.require (moduleNamesARRAY,callbackFUNC);
								.............................................

								EXAMPLE
								..............................................................................
								Uize.require (
									[
										'Uize.Widget.Bar.Slider',
										'Uize.Data.Csv',
										'Uize.Color'
									],
									function (
										Uize_Widget_Bar_Slider,
										Uize_Data_Csv,
										Uize_Color
									) {
										// reference the Uize.Widget.Bar.Slider module by Uize_Widget_Bar_Slider
										// reference the Uize.Data.Csv module by Uize_Data_Csv
										// reference the Uize.Color module by Uize_Color
									}
								);
								..............................................................................

								In the above example, the three modules =Uize.Widget.Bar.Slider=, =Uize.Data.Csv=, and =Uize.Color= are being required. Once all of these modules are loaded, references to the modules are passed as arguments to the callback function, in the order in which the modules are specified in the =moduleNamesARRAY= parameter. The arguments can be named anything you like, but it helps to name them so as to clearly indicate the modules to which they are references. As with the using the =Uize.require= method to `require a single module`, the module references that would be passed as arguments to the callback function can simply be ignored in favor of referencing the modules using their names in the global scope.

							Require Modules With No Callback
								In an uncommon usage, one or more modules can be required without specifying any callback function to be called once the modules are loaded.

								SYNTAX
								...............................................
								Uize.require (moduleNameSTRorModuleNamesARRAY);
								...............................................

								With this usage, the =Uize.require= method can be used simply to initiate loading of modules.

								EXAMPLE
								............................
								Uize.require ([
									'Uize.Widget.Bar.Slider',
									'Uize.Data.Csv',
									'Uize.Color'
								]);
								............................

								In the above example, the three modules =Uize.Widget.Bar.Slider=, =Uize.Data.Csv=, and =Uize.Color= are being required without specifying any code that should be executed once the modules are loaded.

							The callbackFUNC Parameter
								The =callbackFUNC= parameter of the =Uize.require= method lets you specify a callback function that should be executed once all the required modules are loaded.

								When the =Uize.require= method calls the specified callback function, it passes references to the required modules as arguments, in the order in which the modules are specified in the first parameter of the =Uize.require= method. Consider the following example...

								EXAMPLE
								............................................................................
								Uize.require (
									[
										'MyNamespace.MyModule1',
										'MyNamespace.MyModule2'
									],
									function (
										MyNamespace_MyModule1,
										MyNamespace_MyModule2
									) {
										// reference the MyNamespace.MyModule1 module by MyNamespace_MyModule1
										// reference the MyNamespace.MyModule2 module by MyNamespace_MyModule2
									}
								);
								............................................................................

								In the above example, the modules =MyNamespace.MyModule1= and =MyNamespace.MyModule2= are being required. Once these modules are loaded, references to the modules are passed as arguments to the callback function. The arguments can be named anything you like, but it helps to name them so as to clearly indicate the modules to which they are references. Here, for example, we have chosen to name the first argument =MyNamespace_MyModule1=, since it will be a reference to the =MyNamespace.MyModule1= module.

							Requiring Nothing
								In cases where one specifies an empty array for the =moduleNamesARRAY= parameter, the callback function specified by the =callbackFUNC= parameter will be executed immediately, and the callback will receive no arguments.

								EXAMPLE
								................................................................................
								Uize.require (
									[],
									function () {
										// code here is executed immediately, because no modules need to be loaded
									}
								);
								................................................................................

								One would not deliberately write code as shown in the above example, but situations like this may arise where a list of modules that is to be required is being determined programmatically, and where in some situations a programmatically determined list may be empty. Rather than having to implement a check for such cases along with appropriate protection / conditional branching, the =Uize.require= method does the logical thing and calls the specified callback function immediately, since all requirements (none, in this case) are already satisfied. An empty list indicates that the callback code is not contingent upon anything, so it is executed straight away.

							Equivalent to Anonymous Modules
								While more concise and convenient, the =Uize.require= method is roughly equivalent to using anonymous modules.

								INSTEAD OF...
								...........................................................................................
								Uize.module ({
									required:[
										'MyNamespace.MyModule1',
										'MyNamespace.MyModule2'
									],
									builder:function () {
										// code here can rely on MyNamespace.MyModule1 and MyNamespace.MyModule2 being loaded
									}
								});
								...........................................................................................

								USE...
								...........................................................................................
								Uize.require (
									[
										'MyNamespace.MyModule1',
										'MyNamespace.MyModule2'
									],
									function () {
										// code here can rely on MyNamespace.MyModule1 and MyNamespace.MyModule2 being loaded
									}
								);
								...........................................................................................

								In addition to being a little bit cleaner and more concise, as well as a bit more semantically elegant, the =Uize.require= method also supports passing references to required modules in `the callbackFUNC parameter`.

							For an in-depth discussion of modules, consult the explainer [[../explainers/javascript-modules.html][JavaScript Modules]].

							NOTES
							- see also the other `module mechanism methods`
				*/
			};

			_package.module = function (_definition) {
				var _name = _resolveModuleDefinition (_definition).name;
				if (!_name || _moduleDefinitionsClaimed [_name] != _trueFlag) {
					_moduleDefinitionsClaimed [_name] = _modulesAlreadyInvoked [_name] = _trueFlag;
					var _required = _definition.required;
					_package.require (
						_required,
						function () {
							var
								_module,
								_builder = _definition.builder
							;
							if (_builder) {
								var _requiredLookup = {};
								for (var _requiredNo = _required.length; --_requiredNo >= 0;) {
									var _requireModule = _required [_requiredNo];
									_requiredLookup [_requireModule] = _modulesByName [_requireModule];
								}
								var _superclass = _definition.superclass;
								_module = _superclass
									? _builder (_modulesByName [_superclass],_requiredLookup)
									: _builder (_requiredLookup)
								;
							}
							_name &&
								(_Function (_name + '=arguments[0]')) (
									_module = _modulesByName [_name] = _module || function () {}
								)
							;
							if (_isFunction (_module)) {
								_module.moduleName = _name;
								if (!_module.subclass)
									/* NOTE:
										if the module is not a Uize class (like a package or something else), assign the toString instrinsic method, because it won't be obtained by subclassing (since there is none)
									*/
									_module.toString = function () {
										var
											_this = this,
											_moduleName = _getClass (_this).moduleName,
											_isClass = _this.subclass
										;
										return (
											'[' +
												(
													_isInstance (_this) || (!_isClass && !_moduleName)
														? _typeObject
														: _isClass ? 'class' : 'package'
												) +
												' ' + (_moduleName || 'Function') +
											']'
										);
										/*?
											Static Methods
												Uize.toString
													Returns a string, providing summary info for the class on which the method is called.

													SYNTAX
													......................................
													classSummarySTR = MyClass.toString ();
													......................................

													The string returned by this method provides a summary that includes the class' name and the state of its state properties. Among other things, this method provides a convenient and lightweight way to gather information about =Uize.Class= subclasses during debugging and troubleshooting. The =Uize.toString= static intrinsic method is invoked automatically in certain contexts in order to convert a class reference to a string form, such as when alerting a class using the =alert= global function.

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

													In certain contexts, providing a reference to a =Uize.Class= subclass as a parameter to some method will result in the =Uize.Class.valueOf= static intrinsic method of that class being invoked in order to coerce it to a simple value. If it is your desire to have the class summary be used rather than the class' value, then you should explicitly call the =Uize.toString= static intrinsic method, as follows...

													EXAMPLE
													........................................................................
													Uize.Node.setInnerHtml ('classSummaryForDebug',page.children.slider.Class.toString ());
													Uize.Node.setInnerHtml ('classCurrentValue',page.children.slider.Class);
													........................................................................

													In this example, the =classSummaryForDebug= node will contain the summary info for the =Uize.Widget.Bar.Slider= class, while the =classCurrentValue= node will just show the class' current value.

													NOTES
													- see also the other `module mechanism methods`
										*/
									}
								;
							}
							_modulesLoadedBarrier.done (_name,_module);
						}
					);
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
							- see also the other `module mechanism methods`
				*/
			};

			_package.module ({name:'Uize',builder:function () {return _package}});

			_package.moduleLoader = function (_moduleToLoad,_callback) {
				var _scriptNode = document.createElement ('script');
				_scriptNode.async = true;
				_scriptNode.type = 'text/javascript';
				_scriptNode.src = _package.moduleUrlResolver (_moduleToLoad);
				(_scriptParentNode || (_scriptParentNode = document.getElementsByTagName ('HEAD') [0])).appendChild (
					_scriptNode
				);
				/*?
					Static Methods
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
							- see the related =Uize.moduleUrlResolver= static method and the =Uize.moduleUrlTemplate= static property
							- see also the other `module mechanism methods`
				*/
			};

			_package.moduleUrlResolver = function (_moduleName) {
				return _package.moduleUrlTemplate.replace (_modulePathToken,_moduleName + '.js');
				/*?
					Static Methods
						Uize.moduleUrlResolver
							Returns a string, representing the URL path from where the specified JavaScript module (specified by its module name) can be loaded.

							SYNTAX
							......................................................
							moduleUrlSTR = Uize.moduleUrlResolver (moduleNameSTR);
							......................................................

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
							- see also the other `module mechanism methods`
				*/
			};

		_package.pairUp = function (_firstArg) {
			var
				_result = {},
				_arguments = arguments.length == 1 && _isArray (_firstArg) ? _firstArg : arguments,
				_argumentsLength = _arguments.length
			;
			if (_argumentsLength < 3) {
				_result [_arguments [0]] = _arguments [1];
			} else {
				for (var _argumentNo = -2; (_argumentNo += 2) < _argumentsLength;)
					_result [_arguments [_argumentNo]] = _arguments [_argumentNo + 1]
				;
			}
			return _result;
			/*?
				Static Methods
					Uize.pairUp
						Returns an object, that is the specified key and value, paired up together in the same object.

						SYNTAX
						.....................................................
						keyValueOBJ = Uize.pairUp (keySTRorNUM,valueANYTYPE);
						.....................................................

						EXAMPLE
						.............................................................
						Uize.pairUp ('foo','bar');  // returns the object {foo:'bar'}
						Uize.pairUp (0,'zero');     // returns the object {0:'zero'}
						Uize.pairUp (1,true);       // returns the object {1:true}
						.............................................................

						VARIATION 1
						..............................
						keyValueOBJ = Uize.pairUp (
							key1STRorNUM,value1ANYTYPE,
							key2STRorNUM,value2ANYTYPE,
							...,
							keyNSTRorNUM,valueNANYTYPE
						);
						..............................

						When an arbitrary number of arguments are specified for the =Uize.pairUp= method, then the method will pair up all the arguments as key/value pairs to form a single object, where all the even index arguments are treated as the keys, and where all the odd index arguments are treated as the values. For example, the statement =Uize.pairUp ('foo','bar','hello','world')= would return the object ={foo:'bar',hello:'world'}=.

						VARIATION 2
						..................................................
						keyValueOBJ = Uize.pairUp (keyAndValuePairsARRAY);
						..................................................

						When a =keyAndValuePairsARRAY= parameter is specified when calling the =Uize.pairUp= method, then the =Uize.pairUp= method operates on the array in the same way as it would an arbitrary number of arguments. For example, the statement =Uize.pairUp (['foo','bar','hello','world'])= would return the object ={foo:'bar',hello:'world'}=. Therefore, if you have an array that represents a set of key / value pairs, you can call the =Uize.pairUp= method to combine the keys and values together to form an object without having to resort to using the =apply= method in order to use the arbitrary arguments variation of the =Uize.pairUp= method.

						INSTEAD OF...
						...........................................
						Uize.pairUp.apply (0,myKeyValuePairsArray);
						...........................................

						USE...
						...................................
						Uize.pairUp (myKeyValuePairsArray);
						...................................

						Why This Method is Useful
							The =Uize.pairUp= method is particularly useful when an object needs to be created from a key/value pair, where the key name is either dynamically generated in an expression or is supplied via a parameter.

							Using the =Uize.pairUp= method can collapse three statements into a single statement, as follows...

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

							EXAMPLE
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

							In the above example, a function is being defined that will fade the border color of the specified edge of the specified node, from the specified start color to the specified end color. The value of the =edge= property needs to determine which style property needs to be faded.

							Now, we're using the =Uize.Fx.fadeStyle= static method of the =Uize.Fx= module to perform the border color animation. This method can fade values for one or more style properties, and the start and end values for the style properties are specified in style property objects. Here we need to create start and end style objects where the style property to be faded is dynamically generated using the =edge= parameter. As you will see from the code, the =Uize.pairUp= method does this for us nicely.

						NOTES
						- see also the other `basic data utilities`
			*/
		};

		var
			_whitespaceCharLettersLookup = {
				'\n':'n',
				'\r':'r',
				'\t':'t'
			},
			_escapeRegExpLiteral = _package.escapeRegExpLiteral = function (_literal) {
				return (
					_literal
						.replace (/([\^\$\|\{\}\[\]\(\)\?\.\*\+\\])/g,'\\$1')
						.replace (
							/[\n\r\t]/g,
							function (_whitespaceChar) {return '\\' + _whitespaceCharLettersLookup [_whitespaceChar]}
						)
				);
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

							NOTES
							- see also the other `useful value transformers`
				*/
			}
		;

		_package.substituteInto = function (_source,_substitutions,_tokenNaming) {
			if (!(_source = _source == _undefined ? '' : _source + '') || _substitutions == _undefined)
				return _source
			;
			if (_isPrimitive (_substitutions))
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
										year:Uize.Class ({value:2001}),
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
								...............................................................................
								Uize.substituteInto (Uize.Class ({value:'My name is [#name].'}),{name:'Eric'});
								...............................................................................

								RESULT
								..................
								'My name is Eric.'
								..................

								In the above example, the value to substitute into is an instance of a =Uize.Class= subclass. Fortunately, the =Uize.Class= base class implements a =valueOf Intrinsic Method= that returns the value of the =value= state property. Therefore, coercing the source to a string produces the value ='My name is [#name].'=, which is then substituted into without any trouble.

						NOTES
						- token names are case-sensitive
						- token names are space-sensitive (ie. padding around key names is not ignored)
			*/
		};

		_package.noNew = function (_constructor) {
			var _constructorCallIsShim;
			function _constructorSupportingNoNew () {
				if (_constructorCallIsShim) {
					_constructorCallIsShim = _false;
					return this;
				} else {
					var _this = this;
					if (_this == _undefined || _this.constructor != _constructorSupportingNoNew) {
						_constructorCallIsShim = _true;
						_this = new _constructorSupportingNoNew;
					}
					_constructor.apply (_this,arguments);
					return _this;
				}
			}
			return _constructorSupportingNoNew;
			/*?
				Static Methods
					Uize.noNew
						Returns a function that is an object constructor that will construct an object using the specified constructor function, with JavaScript's =new= operator being optional when creating instances of the object.

						SYNTAX
						.............................................................
						objectConstructorFUNC = Uize.noNew (constructorFunctionFUNC);
						.............................................................

						Normally, when creating instances of objects in JavaScript, the =new= operator must be used in conjunction with the constructor function, as in the statement =var date &#61; new Date ()=. The =Uize.noNew= method can be used to wrap any existing object constructor function, to create an object constructor where JavaScript's =new= operator will be optional when creating an instance of the object by calling the constructor.

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

						In the above example, the =Food= object is being defined by using the =Uize.noNew= method to wrap a constructor function. Then, one instance of this object is created using the =new= operator, while another instance is created without using =new=. Both instances are fully fledged =Food= object instances and behave in exactly the same way.

						Properties Aren't Transferred
							When wrapping a constructor function using the =Uize.noNew= method, static and instance methods and properties on the wrapped constructor function are not transferred to the wrapper function.

							The =Uize.noNew= method is not intended to be used to wrap constructor functions after the fact, but is intended to be used to wrap a constructor function before static and instance methods and properties are assigned.

							INCORRECT
							.....................................................................
							// define Food object
							function Food (name,type) {
								this.name = name;
								this.type = type;
							}

							// define instance methods
							Food.prototype.isFruit = function () {return this.type == 'fruit'};
							Food.prototype.isGrain = function () {return this.type == 'grain'};

							// define static methods
							Food.isFruit = function (food) {return food && food.isFruit ()};
							Food.isGrain = function (food) {return food && food.isGrain ()};

							// wrap Food constructor to make new operator optional -- TOO LATE!!!
							Food = Uize.noNew (Food);
							.....................................................................

							In the above example, the =Food= object is defined and then instance and static methods are defined for it. The =Food= object is then replaced with a wrapper of itself that is created using the =Uize.noNew= method. Now, the =Uize.noNew= method does not transfer properties of the constructor function that is wrapped, so the new =Food= object lacks the instance and static methods - not the desired effect. The solution is to first wrap the constructor function using =Uize.noNew=, after which the additional features can be defined for the object, as shown below...

							CORRECT
							....................................................................
							// define Food object, already wrapped to make new operator optional
							var Food = Uize.noNew (
								function (name,type) {
									this.name = name;
									this.type = type;
								}
							);

							// define instance methods
							Food.prototype.isFruit = function () {return this.type == 'fruit'};
							Food.prototype.isGrain = function () {return this.type == 'grain'};

							// define static methods
							Food.isFruit = function (food) {return food && food.isFruit ()};
							Food.isGrain = function (food) {return food && food.isGrain ()};
							....................................................................
			*/
		};

		_package.now = _Function (
			'return ' + (Date.now ? 'Date.now()' : '+new Date')
			/*?
				Static Methods
					Uize.now
						Returns an integer, representing the current time in milliseconds since 1970 (POSIX time).

						SYNTAX
						.......................
						nowMsINT = Uize.now ();
						.......................

						The =Uize.now= method is optimized to use the =Date.now= static method that is supported by JavaScript's built-in =Date= object in newer versions of the language. If this method is not available, then the =Uize.now= method falls back to using the less performant =+new Date= approach, which involves construction of a =Date= object instance each time.

						The =Uize.now= method can be useful when capturing start and end times in order to measure the duration of operations. Consider the following example...

						EXAMPLE
						..............................................
						var start = Uize.now ();

						// ... ... ... ... ... ... ... ... ... ... ...
						// do some stuff that may take a bunch of time
						// ... ... ... ... ... ... ... ... ... ... ...

						var duration = Uize.now () - start;
						..............................................

						Using the above template, the value of the =duration= variable will indicate how long it took to perform the operations in the block between assigning the value for the =start= variable and the value for the =duration= variable.
			*/
		);

	/*** Public Static Properties ***/
		_package.moduleUrlTemplate = _getPathToLibrary ('Uize.js',_modulePathToken);
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

		_package.pathToResources = _getPathToLibrary ('Uize.js');
			/*?
				Static Properties
					Uize.pathToResources
						A string, representing the relative path from the current document to the folder containing the =Uize= module's JavaScript library.

						This property is useful in the implementation of =Uize.Class= subclasses that are to reside in the same folder alongside the =Uize= module's JavaScript file and that may wish to, in their implementation, make use of image and other support resources located inside that folder.

						By using this property, a subclass' implementation does not need to know whether or not the document using it is being loaded through HTTP or from the local file system and does not need to impose extra requirements on developers regarding where its JavaScript library is located in relation to documents using it.

						NOTES
						- this static property is not inherited by subclasses
			*/

	return _package;
}) ();
