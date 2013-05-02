/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Node.Classes Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Node.Classes= module defines a suite of unit tests for the =Uize.Node.Classes= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/* TODO:
	The _modifyClassesStaticMethodTest and _modifyClassesStaticMethodsTest methods are very similar in spirit to the Uize.Test.staticMethodTest and Uize.Test.staticMethodsTest methods of the Uize.Test class. Perhaps this pattern could be formalized with some refactoring so that there isn't so much duplication of code in test modules like this.
*/

Uize.module ({
	name:'Uize.Test.Uize.Node.Classes',
	builder:function () {
		'use strict';

		function _mockNodeWithClassName (_className) {
			/* NOTE:
				returns an object designed to fool the Uize.Node.isNode method into thinking it's a node, so we can test the classes methods without having to have a browser or a document, allowing this test module to run in Windows Script Host or other non-browser host
			*/
			return {
				className:_className,
				getAttribute:Uize.nop
			};
		}

		function _modifyClassesStaticMethodTest (_methodFullName,_cases,_testProperties) {
			var
				_hostAndProperty = Uize.Test.splitHostAndProperty (_methodFullName),
				_methodHostName = _hostAndProperty.host,
				_methodName = _hostAndProperty.property,
				_test = [Uize.Test.staticPropertyTest (_methodFullName,'function')]
			;
			function _getCaseTest (_case) {
				return (
					Uize.isArray (_case)
						? {
							title:_case [0],
							test:function () {
								var
									_mockNode = _mockNodeWithClassName (_case [1]),
									_methodHost = Uize.getModuleByName (_methodHostName),
									_arguments = _case [2]
								;
								_methodHost [_methodName].apply (
									_methodHost,
									[_mockNode].concat (Uize.isArray (_arguments) ? _arguments : [_arguments])
								);
								return this.expect (_case [3],_mockNode.className);
							}
						}
						: _case
				);
			}
			for (var _caseNo = -1, _casesLength = _cases.length; ++_caseNo < _casesLength;)
				_test.push (_getCaseTest (_cases [_caseNo]))
			;
			return Uize.Test.declare (
				Uize.copyInto (
					{
						title:'STATIC METHOD TEST: ' + _methodFullName,
						test:_test
					},
					_testProperties
				)
			);
		}

		function _modifyClassesStaticMethodsTest (_staticMethodsTest) {
			var _test = [];
			for (
				var _staticMethodTestNo = -1, _staticMethodsTestLength = _staticMethodsTest.length;
				++_staticMethodTestNo < _staticMethodsTestLength;
			) {
				var _staticMethodTest = _staticMethodsTest [_staticMethodTestNo];
				_test.push (
					Uize.isArray (_staticMethodTest)
						? _modifyClassesStaticMethodTest.apply (this,_staticMethodTest)
						: _staticMethodTest
				);
			}
			return Uize.Test.declare ({title:'Modify Classes Static Method Tests',test:_test});
		}

		return Uize.Test.declare ({
			title:'Test for Uize.Node.Classes Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Node.Classes'),
				Uize.Test.staticMethodsTest ([
					['Uize.Node.Classes.getState',[
						/*** test handling of invalid node cases ***/
							['Test that the integer -1 is returned when the node is null',
								[null,['disabled','enabled']],
								-1
							],
							['Test that the integer -1 is returned when the node is undefined',
								[undefined,['disabled','enabled']],
								-1
							],

						/*** test support for boolean state values ***/
							['Test that the boolean false is returned when the node\'s className string contains the first of two state classes',
								[_mockNodeWithClassName ('BEFORE disabled AFTER'),['disabled','enabled']],
								false
							],
							['Test that the boolean true is returned when the node\'s className string contains the second of two state classes',
								[_mockNodeWithClassName ('BEFORE enabled AFTER'),['disabled','enabled']],
								true
							],

						/*** test support for integer state values (ie. more than two states) ***/
							['Test that the integer 0 is returned when the node\'s className string contains the first of three state classes',
								[_mockNodeWithClassName ('BEFORE warning AFTER'),['warning','nonFatalError','fatalError']],
								0
							],
							['Test that the integer 1 is returned when the node\'s className string contains the second of three state classes',
								[_mockNodeWithClassName ('BEFORE nonFatalError AFTER'),['warning','nonFatalError','fatalError']],
								1
							],
							['Test that the integer 2 is returned when the node\'s className string contains the third of three state classes',
								[_mockNodeWithClassName ('BEFORE fatalError AFTER'),['warning','nonFatalError','fatalError']],
								2
							],

						/*** test handling of no state class present ***/
							['Test that the integer -1 is returned when the node\'s className string contains neither of two state classes',
								[_mockNodeWithClassName ('BEFORE AFTER'),['disabled','enabled']],
								-1
							],
							['Test that the integer -1 is returned when the node\'s className string contains none of three state classes',
								[_mockNodeWithClassName ('BEFORE AFTER'),['warning','nonFatalError','fatalError']],
								-1
							],
							['Test that class matching is case sensitive when getting a state from a node\'s className',
								[_mockNodeWithClassName ('ENABLED'),['disabled','enabled']],
								-1
							],

						/*** test handling when class for one of the states is an empty string ***/
							['Test that the boolean false is returned when the first of the state classes is an empty string and the node\'s className string does not contain the second state class',
								[_mockNodeWithClassName ('populated featured'),['','selected']],
								false
							],
							['Test that the boolean true is returned when the second of the state classes is an empty string and the node\'s className string does not contain the first state class',
								[_mockNodeWithClassName ('populated featured'),['selected','']],
								true
							],

						/*** test support for state classes being specified using a string ***/
							/*** test support for multiple state classes being specified using a comma-separated string ***/
								['Test that the boolean false is returned when the node\'s className string contains the first of two state classes specified using a comma-separated string',
									[_mockNodeWithClassName ('BEFORE disabled AFTER'),'disabled,enabled'],
									false
								],
								['Test that the boolean true is returned when the node\'s className string contains the second of two state classes',
									[_mockNodeWithClassName ('BEFORE enabled AFTER'),'disabled,enabled'],
									true
								],

							/*** test handling of a single state class being specified using a string ***/
								['Test that the boolean false is returned when a state class specified using a string isn\'t contained inside the node\'s className string',
									[_mockNodeWithClassName ('populated featured'),'selected'],
									false
								],
								['Test that the boolean true is returned when a state class specified using a string is contained inside the node\'s className string',
									[_mockNodeWithClassName ('populated selected featured'),'selected'],
									true
								],
								['Test that the integer -1 is returned when an empty string is specified for the state class',
									[_mockNodeWithClassName ('enabled'),''],
									-1
								]
					]],
					['Uize.Node.Classes.hasClass',[
						/*** test handling of invalid node cases ***/
							['Test that the boolean false is returned when the node is null',
								[null,['selected']],
								false
							],
							['Test that the boolean false is returned when the node is undefined',
								[undefined,['selected']],
								false
							],

						/*** test when specified class is present ***/
							['Test that the boolean true is returned when the specified class is the first class of several classes in the node\'s className string',
								[_mockNodeWithClassName ('populated selected featured'),['populated']],
								true
							],
							['Test that the boolean true is returned when the specified class is the second class of several classes in the node\'s className string',
								[_mockNodeWithClassName ('populated selected featured'),['selected']],
								true
							],
							['Test that the boolean true is returned when the specified class is the last class of several classes in the node\'s className string',
								[_mockNodeWithClassName ('populated selected featured'),['featured']],
								true
							],

						/*** test when specified class is absent ***/
							['Test that the value false is returned when the node\'s className string does not contain the specified class',
								[_mockNodeWithClassName ('populated featured'),['selected']],
								false
							],
							['Test that class matching is case sensitive when testing if a class is present in a node\'s className string',
								[_mockNodeWithClassName ('populated selected featured'),['SELECTED']],
								false
							],

						/*** miscellaneous ***/
							['Test that the boolean false is returned when the class that is being tested for is an empty string',
								[_mockNodeWithClassName ('populated selected featured'),['']],
								false
							]
					]]
				]),
				_modifyClassesStaticMethodsTest ([
					['Uize.Node.Classes.setState',[
						['Test that setting state for a class that is the empty string has no effect',
							'populated selected featured',
							['',true],
							'populated selected featured'
						],

						/*** test adding a class by setting its state to true ***/
							['Test that setting state for a class to true on a node that has no classes works correctly',
								'',
								['selected',true],
								'selected'
							],
							['Test that setting state for a class to true on a node that already has that class doesn\'t result in a duplicate',
								'populated selected',
								['selected',true],
								'populated selected'
							],
							['Test that setting state for a class to true on a node that already has a different class results in the new class being appended, with a single space as separator',
								'populated',
								['selected',true],
								'populated selected'
							],
							['Test that class matching is case sensitive when setting state for a class to true',
								'populated selected',
								['SELECTED',true],
								'populated selected SELECTED'
							],
							['Test that setting state for a class to true where that class that is an empty string results in no change',
								'populated selected',
								['',true],
								'populated selected'
							],

						/*** test removing a class by setting its state to false ***/
							['Test that setting state for a class to false on a node that has no classes works correctly',
								'',
								['selected',false],
								''
							],
							['Test that setting state for a class to false where that class is at the beginning of a node\'s className string is handled correctly',
								'populated selected featured',
								['populated',false],
								'selected featured'
							],
							['Test that setting state for a class to false where that class is in the middle of a node\'s className string is handled correctly',
								'populated selected featured',
								['selected',false],
								'populated featured'
							],
							['Test that setting state for a class to false where that class at the end of a node\'s className string is handled correctly',
								'populated selected featured',
								['featured',false],
								'populated selected'
							],
							['Test that setting state for a class to false where that class isn\'t in a node\'s className string results in no change',
								'populated selected featured',
								['BLAH',false],
								'populated selected featured'
							],
							['Test that setting state for a class to false where that class is an empty string results in no change',
								'populated selected featured',
								['',false],
								'populated selected featured'
							],
							['Test that setting state for a class to false where that class is the only class in a node\'s className string results in an empty className string',
								'populated',
								['populated',false],
								''
							],
							['Test that class matching is case sensitive when setting state for a class to false',
								'populated selected featured',
								['FEATURED',false],
								'populated selected featured'
							],

						/*** test support for two state classes ***/
							['Test that setting state to false where there are two state classes and where neither class is in the node\'s className string is handled correctly',
								'',
								[['disabled','enabled'],false],
								'disabled'
							],
							['Test that setting state to false where there are two state classes and where the false state class is in the node\'s className string is handled correctly',
								'disabled',
								[['disabled','enabled'],false],
								'disabled'
							],
							['Test that setting state to false where there are two state classes and where the true state class is in the node\'s className string is handled correctly',
								'enabled',
								[['disabled','enabled'],false],
								'disabled'
							],
							['Test that setting state to true where there are two state classes and where neither class is in the node\'s className string is handled correctly',
								'',
								[['disabled','enabled'],true],
								'enabled'
							],
							['Test that setting state to true where there are two state classes and where the false state class is in the node\'s className string is handled correctly',
								'disabled',
								[['disabled','enabled'],true],
								'enabled'
							],
							['Test that setting state to true where there are two state classes and where the true state class is in the node\'s className string is handled correctly',
								'enabled',
								[['disabled','enabled'],true],
								'enabled'
							],

						/*** test support for three state classes ***/
							/*** setting state to 0 ***/
								['Test that setting state to 0 where there are three state classes and where none of the classes are in the node\'s className string is handled correctly',
									'',
									[['state0Class','state1Class','state2Class'],0],
									'state0Class'
								],
								['Test that setting state to 0 where there are three state classes and where the 0 state class is in the node\'s className string is handled correctly',
									'state0Class',
									[['state0Class','state1Class','state2Class'],0],
									'state0Class'
								],
								['Test that setting state to 0 where there are three state classes and where the 1 state class is in the node\'s className string is handled correctly',
									'state1Class',
									[['state0Class','state1Class','state2Class'],0],
									'state0Class'
								],
								['Test that setting state to 0 where there are three state classes and where the 2 state class is in the node\'s className string is handled correctly',
									'state2Class',
									[['state0Class','state1Class','state2Class'],0],
									'state0Class'
								],

							/*** setting state to 1 ***/
								['Test that setting state to 1 where there are three state classes and where none of the classes are in the node\'s className string is handled correctly',
									'',
									[['state0Class','state1Class','state2Class'],1],
									'state1Class'
								],
								['Test that setting state to 1 where there are three state classes and where the 0 state class is in the node\'s className string is handled correctly',
									'state0Class',
									[['state0Class','state1Class','state2Class'],1],
									'state1Class'
								],
								['Test that setting state to 1 where there are three state classes and where the 1 state class is in the node\'s className string is handled correctly',
									'state1Class',
									[['state0Class','state1Class','state2Class'],1],
									'state1Class'
								],
								['Test that setting state to 1 where there are three state classes and where the 2 state class is in the node\'s className string is handled correctly',
									'state2Class',
									[['state0Class','state1Class','state2Class'],1],
									'state1Class'
								],

							/*** setting state to 2 ***/
								['Test that setting state to 2 where there are three state classes and where none of the classes are in the node\'s className string is handled correctly',
									'',
									[['state0Class','state1Class','state2Class'],2],
									'state2Class'
								],
								['Test that setting state to 2 where there are three state classes and where the 0 state class is in the node\'s className string is handled correctly',
									'state0Class',
									[['state0Class','state1Class','state2Class'],2],
									'state2Class'
								],
								['Test that setting state to 2 where there are three state classes and where the 1 state class is in the node\'s className string is handled correctly',
									'state1Class',
									[['state0Class','state1Class','state2Class'],2],
									'state2Class'
								],
								['Test that setting state to 2 where there are three state classes and where the 2 state class is in the node\'s className string is handled correctly',
									'state2Class',
									[['state0Class','state1Class','state2Class'],2],
									'state2Class'
								],

						/*** test support for more than one state class being an empty string ***/
							/*** test setting state to a state whose state class is a non-empty string, where all other state classes are empty strings ***/
								['Test that setting state to 0 where there are four state classes, where all are empty strings except for the 0 state class, and where the 0 state class is *not* in the node\'s className string is handled correctly',
									'ENABLED',
									[['stateClass','','',''],0],
									'ENABLED stateClass'
								],
								['Test that setting state to 1 where there are four state classes, where all are empty strings except for the 1 state class, and where the 1 state class is *not* in the node\'s className string is handled correctly',
									'ENABLED',
									[['','stateClass','',''],1],
									'ENABLED stateClass'
								],
								['Test that setting state to 2 where there are four state classes, where all are empty strings except for the 2 state class, and where the 2 state class is *not* in the node\'s className string is handled correctly',
									'ENABLED',
									[['','','stateClass',''],2],
									'ENABLED stateClass'
								],
								['Test that setting state to 3 where there are four state classes, where all are empty strings except for the 3 state class, and where the 3 state class is *not* in the node\'s className string is handled correctly',
									'ENABLED',
									[['','','','stateClass'],3],
									'ENABLED stateClass'
								],

							/*** test setting state to a state whose state class is an empty string, and where there are three other state classes, two of which are empty strings, and one of which is a non-empty string that is in the node's className string ***/
								['Test that setting state to 0 where there are four state classes, where all are empty strings except for one state class which is in the node\'s className string, and where the 0 state class is an empty string, is handled correctly',
									'BEFORE stateClass AFTER',
									[['','','','stateClass'],0],
									'BEFORE AFTER'
								],
								['Test that setting state to 1 where there are four state classes, where all are empty strings except for one state class which is in the node\'s className string, and where the 1 state class is an empty string, is handled correctly',
									'BEFORE stateClass AFTER',
									[['','','','stateClass'],1],
									'BEFORE AFTER'
								],
								['Test that setting state to 2 where there are four state classes, where all are empty strings except for one state class which is in the node\'s className string, and where the 2 state class is an empty string, is handled correctly',
									'BEFORE stateClass AFTER',
									[['','','','stateClass'],2],
									'BEFORE AFTER'
								],
								['Test that setting state to 3 where there are four state classes, where all are empty strings except for one state class which is in the node\'s className string, and where the 3 state class is an empty string, is handled correctly',
									'BEFORE stateClass AFTER',
									[['stateClass','','',''],3],
									'BEFORE AFTER'
								]
					]],
					['Uize.Node.Classes.removeState',[
						/*** test support for first state class being empty string ***/
							['Test that removing a state when none of the state classes is present in the node\'s className string results in no change',
								'BEFORE AFTER',
								'selected',
								'BEFORE AFTER'
							],
							['Test that removing a state that is specified using a string with only one state class (the first class is implicit as the empty string) is handled correctly',
								'BEFORE selected AFTER',
								'selected',
								'BEFORE AFTER'
							],

						/*** test support for two state classes ***/
							['Test that removing a state where there are two non-empty state classes and where none of those classes is in the node\'s className string results in no change',
								'BEFORE AFTER',
								[['disabled','enabled']],
								'BEFORE AFTER'
							],
							['Test that removing a state where there are two non-empty state classes and where the first of those classes is in the node\'s className string results in it being removed',
								'BEFORE disabled AFTER',
								[['disabled','enabled']],
								'BEFORE AFTER'
							],
							['Test that removing a state where there are two non-empty state classes and where the second of those classes is in the node\'s className string results in it being removed',
								'BEFORE enabled AFTER',
								[['disabled','enabled']],
								'BEFORE AFTER'
							],

						/*** test support for three state classes ***/
							['Test that removing a state where there are three non-empty state classes and where none of those classes is in the node\'s className string results in no change',
								'BEFORE AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE AFTER'
							],
							['Test that removing a state where there are three non-empty state classes and where the first of those classes is in the node\'s className string results in it being removed',
								'BEFORE state0Class AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE AFTER'
							],
							['Test that removing a state where there are three non-empty state classes and where the second of those classes is in the node\'s className string results in it being removed',
								'BEFORE state1Class AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE AFTER'
							],
							['Test that removing a state where there are three non-empty state classes and where the third of those classes is in the node\'s className string results in it being removed',
								'BEFORE state2Class AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE AFTER'
							],

						/*** miscellaneous ***/
							['Test that class matching is case sensitive when removing a state',
								'BEFORE selected AFTER',
								['SELECTED'],
								'BEFORE selected AFTER'
							]
					]],
					['Uize.Node.Classes.toggleState',[
						['Test that toggling state for a class that is the empty string has no effect',
							'populated selected featured',
							[''],
							'populated selected featured'
						],

						/*** test support for state classes being specified as a string ***/
							['Test that toggling state where state classes is specified using a string and where the node\'s className string is empty is handled correctly',
								'',
								['featured'],
								'featured'
							],
							['Test that toggling state where state classes is specified using a string and where the node\'s className string is the true state class is handled correctly',
								'featured',
								['featured'],
								''
							],
							['Test that toggling state where state classes is specified using a string, where the node\'s className string has classes but not the true state class, results in the true state class being appended',
								'populated selected',
								['featured'],
								'populated selected featured'
							],
							['Test that toggling state where state classes is specified using a string, and where the true state class is at the beginning of the node\'s className string results in it being removed correctly',
								'populated selected featured',
								['populated'],
								'selected featured'
							],
							['Test that toggling state where state classes is specified using a string, and where the true state class is in the middle of the node\'s className string results in it being removed correctly',
								'populated selected featured',
								['selected'],
								'populated featured'
							],
							['Test that toggling state where state classes is specified using a string, and where the true state class is at the end of the node\'s className string results in it being removed correctly',
								'populated selected featured',
								['featured'],
								'populated selected'
							],

						/*** test support for two state classes ***/
							['Test that toggling state where there are two states, and where none of the state classes is in a node\'s className string results in the first state class being appended, with a single space as separator',
								'BEFORE AFTER',
								[['disabled','enabled']],
								'BEFORE AFTER disabled'
							],
							['Test that toggling state where there are two states, and where the first state class is in a node\'s className string results in it being replaced with the second state class',
								'BEFORE disabled AFTER',
								[['disabled','enabled']],
								'BEFORE enabled AFTER'
							],
							['Test that toggling state where there are two states, and where the second state class is in a node\'s className string results in it being replaced with the first state class',
								'BEFORE enabled AFTER',
								[['disabled','enabled']],
								'BEFORE disabled AFTER'
							],

						/*** test support for three state classes ***/
							['Test that toggling state where there are three states, and where none of the state classes is in a node\'s className string results in the first state class being appended, with a single space as separator',
								'BEFORE AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE AFTER state0Class'
							],
							['Test that toggling state where there are three states, and where the first state class is in a node\'s className string results in it being replaced with the second state class',
								'BEFORE state0Class AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE state1Class AFTER'
							],
							['Test that toggling state where there are three states, and where the second state class is in a node\'s className string results in it being replaced with the third state class',
								'BEFORE state1Class AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE state2Class AFTER'
							],
							['Test that toggling state where there are three states, and where the third state class is in a node\'s className string results in it being replaced with the first state class',
								'BEFORE state2Class AFTER',
								[['state0Class','state1Class','state2Class']],
								'BEFORE state0Class AFTER'
							]
					]],
					['Uize.Node.Classes.addClass',[
						['Test that adding a class to a node that has no classes works correctly',
							'',
							'selected',
							'selected'
						],
						['Test that adding a class to a node that already has that class doesn\'t result in a duplicate',
							'populated selected',
							'selected',
							'populated selected'
						],
						['Test that adding a class to a node that already has a different class results in the new class being appended, with a single space as separator',
							'populated',
							'selected',
							'populated selected'
						],
						['Test that class matching is case sensitive when adding a class',
							'populated selected',
							'SELECTED',
							'populated selected SELECTED'
						],
						['Test that adding a class that is an empty string results in no change',
							'populated selected',
							'',
							'populated selected'
						]
					]],
					['Uize.Node.Classes.removeClass',[
						['Test that removing a class from a node that has no classes works correctly',
							'',
							'selected',
							''
						],
						['Test that removing a class that is at the beginning of a node\'s className string is handled correctly',
							'populated selected featured',
							'populated',
							'selected featured'
						],
						['Test that removing a class that is in the middle of a node\'s className string is handled correctly',
							'populated selected featured',
							'selected',
							'populated featured'
						],
						['Test that removing a class that is at the end of a node\'s className string is handled correctly',
							'populated selected featured',
							'featured',
							'populated selected'
						],
						['Test that removing a class that isn\'t in a node\'s className string results in no change',
							'populated selected featured',
							'BLAH',
							'populated selected featured'
						],
						['Test that removing a class that is an empty string results in no change',
							'populated selected featured',
							'',
							'populated selected featured'
						],
						['Test that removing the only class in a node\'s className string results in an empty className string',
							'populated',
							'populated',
							''
						],
						['Test that class matching is case sensitive when removing a class',
							'populated selected featured',
							'FEATURED',
							'populated selected featured'
						]
					]],
					['Uize.Node.Classes.toggleClass',[
						/*** test when specified class is present ***/
							['Test that toggling a class that is at the beginning of a node\'s className string is handled correctly',
								'populated selected featured',
								'populated',
								'selected featured'
							],
							['Test that toggling a class that is in the middle of a node\'s className string is handled correctly',
								'populated selected featured',
								'selected',
								'populated featured'
							],
							['Test that toggling a class that is at the end of a node\'s className string is handled correctly',
								'populated selected featured',
								'featured',
								'populated selected'
							],

						/*** test when specified class is absent ***/
							['Test that toggling a class for a node that has no classes works correctly',
								'',
								'selected',
								'selected'
							],
							['Test that toggling a class that isn\'t present for a node that has different classes in its className string results in the toggle class being appended, with a single space as separator',
								'populated selected',
								'featured',
								'populated selected featured'
							],

						/*** miscellaneous ***/
							['Test that class matching is case sensitive when toggling a class',
								'populated selected featured',
								'FEATURED',
								'populated selected featured FEATURED'
							],
							['Test that toggling a class that is an empty string results in no change',
								'populated selected featured',
								'',
								'populated selected featured'
							]
					]]
				])
			]
		});
	}
});

