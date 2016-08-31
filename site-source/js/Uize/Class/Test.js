/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class.Test Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 9
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Class.Test= class provides a minimal base class for test classes of various types.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Class.Test',
	superclass:'Uize.Class',
	required:'Uize.Util.Oop',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_class,
				_true = true,
				_false = false,
				_undefined,
				_Uize = Uize,

			/*** General Variables ***/
				_forceAsync = typeof navigator == 'object',
					/* NOTE:
						Force tests to be asynchronous for browsers for two reasons

						1. Some browsers don't repaint while locked in JavaScript execution, so executing tons of tests without giving the browser opportunities to paint DOM updates would make for a lousy experience when running a test suite in a browser.

						2. Some browsers pop up alert dialogs if JavaScript takes too long before returning control, which is definitely not what you want when running a large test suite in a browser.
					*/
				_synopsisDivider = '\n----------------------------------------------------------\n\n',
				_isAsync
		;

		return _class = _superclass.subclass ({
			staticProperties:{
				isAsync:_isAsync = function () {
					/*?
						Static Properties
							Uize.Class.Test.isAsync
								A read-only special value that is used to indicate that running of a test instance's test(s) is asynchronous.

								When a test instance is known to be asynchronous, the instance's =result= state property will be set to the value =Uize.Class.Test.isAsync=. In this situation, the instance's =isAsync= state property will also be set to the value =true=. For a more in-depth discussion, see the section `Asynchronous Tests` in the [[../guides/javascript-testing-framework.html][JavaScript Testing Framework]] guide.

								NOTES
								- see the related =isAsync= and =result= state properties
					*/
				}
			},

			instanceMethods:{
				getDepth:function () {
					var
						_depth = 0,
						_parent = this
					;
					while (_parent = _parent.parent) _depth++;
					return _depth;
					/*?
						Instance Methods
							getDepth
								Returns an integer, indicating how deep within the test instance tree the test instance is.

								SYNTAX
								..............................
								depthINT = myTest.getDepth ();
								..............................

								The depth of a test instance is determined by traversing up the =parent= chain, all the way up to the root test. The depth of the root test is reported as =0=, the depth of a child test of the root test is reported as =1=, the depth of a child test of that child test is reported as =2=, and so on.

								NOTES
								- see the related =parent= instance property
								- see the related =getTotalTests= instance method
					*/
				},

				getTotalTests:function () {
					var _totalTests = 0;
					function _getTotalTests (_subtests) {
						_totalTests++;
						if (_Uize.isArray (_subtests)) {
							for (var _subtestNo = -1, _subtestsLength = _subtests.length; ++_subtestNo < _subtestsLength;)
								_getTotalTests (_subtests [_subtestNo]._test)
							;
						}
					}
					_getTotalTests (this._test);
					return _totalTests;
					/*?
						Instance Methods
							getTotalTests
								Returns an integer, indicating the total number of tests inside the test instance's test tree.

								SYNTAX
								........................................
								totalTestsINT = myTest.getTotalTests ();
								........................................

								This method recurses through the entire tree, essentially flattening the tree in order to count the total number of actual tests that would be performed. The method includes parent tests in the tally, along with all child tests. For example, if the test contained two child tests, and each one of those child tests contained two child tests, then the total number of tests in the tree would be =7= - one root test, two child tests, and four grandchild tests.

								NOTES
								- see the related =getDepth= instance method
					*/
				},

				getSynopsis:function () {
					var
						m = this,
						_result = m._result,
						_synopsis = (_result ? 'PASSED' : 'FAILED') + '\n',
						_reasonForFailure = m._reasonForFailure
					;
					/*** add the breadcrumbs ***/
						var
							_testParent = m,
							_testBreadcrumbs = [],
							_testBreadcrumbsStr = '',
							_testBreadcrumbIndent = ''
						;
						while (_testParent) {
							_testBreadcrumbs.push (_testParent._title);
							_testParent = _testParent.parent;
						}
						for (var _testBreadcrumbNo = _testBreadcrumbs.length; --_testBreadcrumbNo > -1;) {
							_testBreadcrumbsStr +=
								_testBreadcrumbIndent + _testBreadcrumbs [_testBreadcrumbNo] + '\n'
							;
							_testBreadcrumbIndent += '   ';
						}
						_synopsis += _synopsisDivider + 'BREADCRUMBS...\n\n' + _testBreadcrumbsStr;

					/*** add the time information ***/
						_synopsis +=
							_synopsisDivider +
							'TIME STARTED: ' + m._startTime + '\n' +
							'TIME ENDED: ' + m._endTime + '\n' +
							'DURATION: ' + m._duration + 'ms\n'
						;

					if (!_result && _reasonForFailure)
						_synopsis += _synopsisDivider + 'REASON FOR FAILURE...\n\n' + _reasonForFailure
					;
					return _synopsis;
					/*?
						Instance Methods
							getSynopsis
								Returns a string, providing a synopsis of the test instance's run.

								SYNTAX
								....................................
								synopsisSTR = myTest.getSynopsis ();
								....................................

								This method is useful when providing a report for a test, especially if the test fails. The synopsis provides an indication of whether the test passed or failed, breadcrumbs to indicate where the test is in a test tree, when the test started and ended and its duration, and the reason for failure if the test failed.

								NOTES
								- see also the =reasonForFailure= and =result= state properties
					*/
				},

				stop:function () {
					var m = this;
					_Uize.isArray (m._test) && _Uize.callOn (m._test,'stop');
					m.set ({_inProgress:false});
					/*?
						Instance Methods
							stop
								Stops running of the test instance's test(s).

								SYNTAX
								...............
								myTest.stop ();
								...............

								Upon calling the =stop= method, the =stop= method will first be called on any child tests belonging to the test, after which the =inProgress= state property for the instance will be set to =false=. If the instance is not running its test(s) at the time that this method is called, then calling it will have no effect.

								NOTES
								- see the companion =run= instance method
								- see the related =inProgress= state property
					*/
				},

				run:function (_callback) {
					/* NOTE:
						Ultimately, this code should find its way into the onChange handler for the inProgress state property, and then this method can be supplanted by a simple start method that only stops the test and then sets the inProgress property to true, making the interface for this class more in line with the Uize.Fade class.
					*/
					var
						m = this,
						_test = m._test,
						_testResult = _true
					;
					m.stop ();
					m.set ({
						_inProgress:_true,
						_progress:0,
						_startTime:new Date,
						_duration:_undefined,
						_endTime:_undefined,
						_isAsync:_false,
						_log:[],
						_result:_undefined,
						_reasonForFailure:_undefined
					});
					m.fire ({name:'Start',bubble:_true});
					/*?
						Instance Events
							Start
								An bubbling instance event that is fired whenever the instance's test is run by calling its =run= instance method.

								NOTES
								- this event bubbles
								- see the companion =Done= instance event
					*/
					function _updateResultProperty () {
						if (_testResult !== _true && _testResult !== _undefined && _testResult != _isAsync)
							_testResult = _false
						;
						m.set ({_result:_testResult});
						if (_testResult == _isAsync) {
							m.set ({_isAsync:_true});
						} else {
							var _endTime = new Date;
							m.set ({
								_duration:_endTime - m._startTime,
								_endTime:_endTime,
								_progress:1
							});
							m.stop (); // TO DO: why is this being called here, and will this lead to excessive recursive calling of stop on subtests, even when test running is not aborted?
							m.fire ({name:'Done',bubble:_true});
							/*?
								Instance Events
									Done
										An bubbling instance event that is fired whenever the instance's test completes running.

										NOTES
										- this event bubbles
										- see the companion =Start= instance event
							*/
							m._isAsync && _callback && _callback (_testResult);
						}
					}
					if (_Uize.isArray (_test)) {
						var
							_testLength = _test.length,
							_testNo = -1,
							_continue = function () {
								m.set ({_progress:(_testNo + 1) / _testLength});
								function _setResultAndContinue (_result) {
									_testResult = _result;
									_continue ();
								}
								while (m._inProgress && _testResult === _true && ++_testNo < _testLength)
									_testResult = _test [_testNo].run (_setResultAndContinue)
								;
								_updateResultProperty ();
							}
						;
						_continue ();
					} else {
						try {
							_testResult = _isAsync;
							var
								_returned = _false,
								_testFunctionReturnValue = _test.call (
									m,
									function (_result) {
										_testResult = _result;
										_returned && _updateResultProperty ();
									}
								)
							;
							if (_testFunctionReturnValue !== _undefined)
								_testResult = _testFunctionReturnValue
							;
							_returned = true;
						} catch (_error) {
							m.set ({
								_reasonForFailure:
									'JavaScript Error...\n' +
									'ERROR NAME: ' + _error.name + '\n' +
									'ERROR MESSAGE: ' + _error.message + '\n' +
									'ERROR DESCRIPTION: ' + _error.description + '\n' +
									'LINE NUMBER: ' + _error.number + '\n' +
									'STACK TRACE: ' + _error.stack + '\n'
							});
							_testResult = _false;
						}
						if (_testResult != _isAsync && _forceAsync) {
							var _storedTestResult = _testResult;
							_testResult = _isAsync;
							_updateResultProperty ();
							setTimeout (
								function () {
									_testResult = _storedTestResult;
									_updateResultProperty ();
								},
								0
							);
						} else {
							_updateResultProperty ();
						}
					}

					return _testResult;
					/*?
						Instance Methods
							run
								Runs the instance's test(s) and returns the result.

								SYNTAX
								...........................
								resultBOOL = myTest.run ();
								...........................

								In the event that running of the instance's test(s) is asynchronous, the =run= method will return the value =Uize.Class.Test.isAsync=, and the instance's =isAsync= state property will be set to the value =true=. For a more in-depth discussion, see the section `Asynchronous Tests` in the [[../guides/javascript-testing-framework.html][JavaScript Testing Framework]] guide.

								Callback Function For Asynchronous Tests
									When the optional =callbackFUNC= parameter is specified, a callback function can be specified that will be called once running of the instance's test(s) is complete, in the event that running of the instance's test(s) is asynchronous.

									VARIATION
									.......................................
									resultBOOL = myTest.run (callbackFUNC);
									.......................................

									The callback function should expect to receive one parameter, being the result value for the test.

								NOTES
								- see the companion =stop= instance method
					*/
				},

				log:function (_message) {
					this._log.push ({timestamp:new Date,message:_message});
					/*?
						Instance Methods
							log Instance Method
								Adds the specified message, along with a generated timestamp, to the =log= array for the instance and returns a reference to the instance.

								SYNTAX
								.................................
								myTest = myTest.log (messageSTR);
								.................................

								NOTES
								- see the related =log= state property
					*/
				}
			},

			staticMethods:{
				addTest:function (_test) {
					var m = this;
					(m._test || (m._test = [])).push (m.resolve (_test));
					return m;
					/*?
						Static Methods
							Uize.Class.Test.addTest
								Adds the specified child test to the test class and returns a reference to the test class.

								SYNTAX
								..................................
								Uize.Class.Test.addTest (testOBJ);
								..................................
					*/
				},

				set:function (_properties) {
					var m = this;
					if (_properties && !_Uize.isInstance (m)) {
						/*** resolve test property ***/
							var _test = _properties.test;
							if (_Uize.isArray (_test)) {
								for (
									var _subtestNo = -1, _subtestsLength = _test.length, _subtest;
									++_subtestNo < _subtestsLength;
								)
									if ((_subtest = _test [_subtestNo]).constructor == Object)
										_test [_subtestNo] = m.resolve (_subtest)
								;
							}
					}
					_superclass.set.apply (m,arguments);
				},

				setTest:function (_test) {
					this.set ({test:_test});
					return this;
					/*?
						Static Methods
							Uize.Class.Test.setTest
								Sets the initial value of the =test= state property to the value specified by the =testOBJ= parameter.

								SYNTAX
								..............................................
								testCLASS = Uize.Class.Test.setTest (testOBJ);
								..............................................

								This method returns a reference to the test class on which it is called.
					*/
				},

				resolve:function (_test) {
					return _Uize.Util.Oop.inheritsFrom (_test,_class) ? _test : this.subclass ({set:_test});
					/*?
						Static Methods
							Uize.Class.Test.resolve
								Returns a =Uize.Class.Test= subclass, being the specified test object resolved to a test class.

								SYNTAX
								..............................................
								testCLASS = Uize.Class.Test.resolve (testOBJ);
								..............................................

								testOBJ
									An object, being either a set of property values for the state properties of the =Uize.Class.Test= class, or a reference to a =Uize.Class.Test= subclass.

									In the event that the =testOBJ= parameter's value is a set of property value, a new subclass of the =Uize.Class.Test= class is created, and its state properties are initialized with the values contained in the =testOBJ= object. The value of the =test= property receives special handling (see `Resolving Subtests`).

								More Concise and Declarative
									The =Uize.Class.Test.resolve= method allows for a more concise, declarative syntax for defining tests.

									INSTEAD OF...
									...........................................................
									var My2Plus2Equals4TestClass = Uize.Class.Test.subclass ();
									My2Plus2Equals4TestClass.set ({
										title:'2 + 2 equals 4',
										test:function () {return 2 + 2 == 4}
									});
									...........................................................

									USE...
									.......................................
									Uize.Class.Test.resolve ({
										title:'2 + 2 equals 4',
										test:function () {return 2 + 2 == 4}
									});
									.......................................

								Returns a Test Class
									Because the =Uize.Class.Test.resolve= method returns a =Uize.Class.Test= subclass, it can be used for declaring a child test in an array of child tests, as with all the other `test class factory methods` (see `Example 2: A Set of Tests` for an illustration of this).

								Resolving Subtests
									If a test properties object is specified for the =testOBJ= parameter (rather than a =Uize.Class.Test= subclass), then the value of that object's =test= property is further resolved.

									If the value of the =test= property is an array of child tests, then the elements of the child tests array are resolved to test classes by calling the =Uize.Class.Test.resolve= method for each of them, where each element value becomes the value of the =Uize.Class.Test.resolve= method's =testOBJ= parameter. For an example of this type of usage, see the `Example 2: A Set of Tests`.

								Example 1: A Single Test
									In this example, a simple test class is being created using the =Uize.Class.Test.resolve= method.

									EXAMPLE
									.......................................
									Uize.Class.Test.resolve ({
										title:'2 + 2 equals 4',
										test:function () {return 2 + 2 == 4}
									});
									.......................................

									The value of the =test= state property in this case is a function, which will be executed when an instance of the test class is run using the =run= instance method.

								Example 2: A Set of Tests
									In this example, a test class is being created that serves as a wrapper for a set of child tests.

									EXAMPLE
									........................................................................
									Uize.Class.Test.resolve ({
										title:'Test a whole bunch of things',
										test:[
											{
												title:'2 + 2 equals 4',
												test:function () {return 2 + 2 == 4}
											},
											Uize.Class.Test.resolve ({
												title:'The value true is equal to 1 in a simple equality test',
												test:function () {return 1 == true}
											})
										]
									});
									........................................................................

									The value of the =test= state property in this case is an array, which contains a sequence of child tests. The elements of the child tests array are resolved to test classes (see `Resolving Subtests`). In this example, the child tests array contains a mix of child tests declared in different ways: the first child test is declared using the simple object syntax, while the second is declared by calling the =Uize.Class.Test.resolve= method explicitly.

								NOTES
								- this method is one of the many available `test class factory methods`
					*/
				}
			},

			stateProperties:{
				_duration:'duration',
					/*?
						State Properties
							duration
								A number, representing how long it took for the test instance to run, measured in milliseconds.

								Before a test instance has been run for the first time, the value of this property will be =undefined=. The value will also be reset to =undefined= each time the test is started, and will remain =undefined= while the test is in progress.

								NOTES
								- the initial value is =undefined=
					*/
				_endTime:'endTime',
					/*?
						State Properties
							endTime
								An instance of JavaScript's =Date= object, that is set to the time at which running of the test instance ended.

								Before a test instance has been run for the first time, the value of this property will be =undefined=. The value will also be reset to =undefined= each time the test is started, and will remain =undefined= while the test is in progress. The value will be reset to the current time each time the test ends running.

								NOTES
								- see also the companion =startTime= and =duration= state properties
								- the initial value is =undefined=
					*/
				_inProgress:{
					name:'inProgress',
					value:_false
					/*?
						State Properties
							inProgress
								A boolean, indicating whether or not the test instance is busy running its test(s).

								The value of this property is set to =true= each time the test is started, and is set back to =false= each time the test ends running.

								NOTES
								- see also the related =progress= state property
								- the initial value is =false=
					*/
				},
				_isAsync:'isAsync',
					/*?
						State Properties
							isAsync
								A boolean, indicating whether or not running the test instance's test(s) is asynchronous.

								The value =undefined= is equivalent to the boolean value =false=. When a test is run in the browser context, the value of this property is coerced to =true=. For a more in-depth discussion, see the section `Asynchronous Tests` in the [[../guides/javascript-testing-framework.html][JavaScript Testing Framework]] guide.

								NOTES
								- see the related =Uize.Class.Test.isAsync= static property
								- the initial value is =undefined=
					*/
				_log:'log',
					/*?
						State Properties
							log
								An array, containing all of the messages logged using the =log Instance Method=.

								Before a test instance has been run for the first time, the value of this property will be =undefined=. The value will also be reset to =[]= (an empty array) each time the test is started. Each element of the =log= array is an object with the following structure...

								LOG MESSAGE OBJECT
								.................................................................................
								{
									message   : messageSTR,  // the text of the log message
									timestamp : dataOBJ      // the time at which the message was added to the log
								}
								.................................................................................

								NOTES
								- see the related =log Instance Method=
								- the initial value is =undefined=
					*/
				_progress:{
					name:'progress',
					value:0
					/*?
						State Properties
							progress
								A floating point number in the range of =0= to =1=, indicating how far the test instance is in running its test(s).

								Before a test instance has been run for the first time, the value of this property will be =0=. The value will also be reset to =0= each time the test is started. The value will be set to the =1= when the test ends running. During running of the test, the value will be updated periodically to reflect the progress that has been made. The =progress= is calculated by dividing the number of `subtests` that have completed running by the total number of subtests defined in the =test= state property. Importantly, the value of this property does not reflect updates in the progress of individual subtests.

								NOTES
								- see also the related =inProgress= state property
					*/
				},
				_reasonForFailure:'reasonForFailure',
					/*?
						State Properties
							reasonForFailure
								A string, providing an explanation for why the test failed, or the value =undefined= if the test has not failed.

								Before a test instance has been run for the first time, the value of this property will be =undefined=. The value will also be reset to =undefined= each time the test is started, and will remain =undefined= while the test is in progress. If the test fails, the value of this property can be set to a string that provides an explanation for why the test failed.

								NOTES
								- see also the related =result= state property
								- the initial value is =undefined=
					*/
				_result:'result',
					/*?
						State Properties
							result
								A boolean, indicating whether or not the test passed, or the value =undefined= or =Uize.Class.Test.isAsync=.

								A value of =true= indicates that the test was completed and passed, while a value of =false= indicates that the test was completed and failed or was aborted with a catastrophic failure. A value of =undefined= indicates that the test result has not yet been determined, while a value of =Uize.Class.Test.isAsync= indicates that determination of the result is waiting upon the completion of asynchronous code.

								Before a test instance has been run for the first time, the value of this property will be =undefined=. The value will also be reset to =undefined= each time the test is started, and will remain =undefined= until the result is determined, or will be set to the constant value =Uize.Class.Test.isAsync= if the test is known to be asynchronous.

								NOTES
								- see also the related =reasonForFailure= state property
								- the initial value is =undefined=
					*/
				_startTime:'startTime',
					/*?
						State Properties
							startTime
								An instance of JavaScript's =Date= object, that is set to the time at which running of the test instance started.

								Before a test instance has been run for the first time, the value of this property will be =undefined=. The value will be reset to the current time each time the test is started.

								NOTES
								- see also the companion =endTime= and =duration= state properties
								- the initial value is =undefined=
					*/
				_test:{
					name:'test',
					conformer:function (_value) {
						if (_Uize.isArray (_value)) {
							var m = this;
							_value = _Uize.map (_value,function (_subtest) {return new _subtest ({parent:m})});
							/*?
								Instance Properties
									parent
										A reference to the test class instance that serves as the parent for the test instance.

										A test instance is parented when it is instantiated by its parent test. The root test in a test tree is never parented, and so the value of the =parent= property for the root test remains =undefined=.

										NOTES
										- the initial value is =undefined=
										- see also the related =children= instance property
							*/
						}
						return _value;
					},
					onChange:function() {
						var m = this;
						m.children = _Uize.isArray (m._test) ? m._test : _undefined;
							/*?
								Instance Properties
									children
										An array of child tests where each element is an instance of a =Uize.Class.Test= subclass.

										A test instance contains children when its =test= state property is an array. When its =test= state property is not an array, =children= will be =undefined=.

										NOTES
										- the =children= array is read-only - its contents should not be directly modified
										- the initial value is =undefined=
										- see also related =test= state property
										- see also the related =parent= instance property
							*/
					}
					/*?
						State Properties
							test
								A test function, or an array of child tests where each element is an instance of a =Uize.Class.Test= subclass.

								The Simple Test Case
									In the case of a simple test that has no child tests, the value of the =test= property should be a reference to the function that performs the test action.

									This function will be executed when the test is run by calling the =run= instance method. When the function is called, it will be called as an instance method of the test instance, so it will have access to the instance for the purpose of calling any of the instance methods of the test class, or for accessing state of the instance through its various state properties.

									The function should expect to receive a single parameter, being a continuation function that can be called in case the test is asynchronous (see the section on `Asynchronous Tests` in the [[../guides/javascript-testing-framework.html][JavaScript Testing Framework]] guide for more details). In the case of synchronous tests, the test function should return a boolean value, indicating whether the test passed or failed.

								The Child Tests Case
									In the case of a test that is serving as a parent for a set of child tests, the value of the =test= property will be an array of child test instances.

									In such cases, when the test is run all of its child tests contained in the =test= array will be executed in sequence. If any of the child tests fail, execution of the remaining child tests will be terminated.
					*/
				},
				_title:'title'
					/*?
						State Properties
							title
								A string, representing the title of the test instance.

								The title of a test is used when generating a synopsis for a test using the =getSynopsis= instance method. The title can also be used by a test runner application whose interface provides logging for tests as they are being run.
					*/
			}
		});
	}
});

