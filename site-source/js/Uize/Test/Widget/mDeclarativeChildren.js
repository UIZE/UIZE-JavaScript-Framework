/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mDeclarativeChildren Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Widget.mDeclarativeChildren= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mDeclarativeChildren=.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Test.Widget.mDeclarativeChildren',
	required:'Uize.Array.Util',
	builder:function () {
		'use strict';
		
		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				staticMethods:{
					childTest:function(_testParams) {
						var
							_testClass = this,
							_childName = _testParams.childName,
							_cases = _testParams.cases,
							_instanceProperties = _testParams.instanceProperties,
							_tests
						;
						
						function _getWidgetInstance(m, _initialProperties) {
							return m.setInstance(_Uize.copy(_instanceProperties, _initialProperties));
						}
						
						if (!_cases) {
							_tests = [
								{
									title:'When instance is created, ' + _childName + ' child widget is NOT added',
									test:function() {
										return this.expectNully(_getWidgetInstance(this).children[_childName]);
									}
								}
							];
						}
						else {
							_tests = Uize.Array.Util.flatten(
								_Uize.map(
									_cases,
									function(_case) {
										var
											_childWidgetClassName = _case.widgetClassName,
											_expectedChildProperties = _case.expectedProperties,
											_widgetInstanceProperties = _case.instanceProperties,
											_caseTests = [
												{
													title:'When instance is created, ' + _childName + ' child widget is added',
													test:function() {
														return this.expectNonNull(_getWidgetInstance(this).children[_childName]);	
													}
												},
												{
													title:'When instance is created, ' + _childName + ' child widget is an instance of ' + _childWidgetClassName,
													test:function() {
														return this.expect(_childWidgetClassName, _getWidgetInstance(this).children[_childName].Class.moduleName);
													}
												}
											]
										;
										
										if (_expectedChildProperties) {
											// NOTE: For when a child is declared w/ initial state properties 
											_caseTests.push({
												title:'When instance is created, ' + _childName + ' child widget has the correct initial state properties',
												test:function() {
													var _child = _getWidgetInstance(this, _widgetInstanceProperties).children[_childName];
													return this.expect(_expectedChildProperties, _child.get(_Uize.keys(_expectedChildProperties)));
												}
											});
										}
										
										return _caseTests;
									}
								)
							);
						}
						
						return _testClass.resolve(
							_Uize.copyInto(
								{
									title:'DECLARATIVE CHILD TEST: ' + _childName,
									test:_tests
								},
								_testParams.testProperties
							)
						);
						/*?
							Static Methods
								Uize.Test.Widget.mDeclarativeChildren.childTest
									.
									
									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mDeclarativeChildren.childTest (
										paramsOBJ
									);
									..................................................................
									
									paramsOBJ
										.
										
										childName
											.
									
										cases
											.
											
											widgetClassName
												.
												
											expectedProperties
												.
												
											instanceProperties
												.
											
											NOTES
											- Omitting =casesArray= signals that the child actually should *not* be added
										
										instanceProperties
											.
											
										testProperties
											.
									
									EXAMPLE
									.......
									Uize.Test.Widget.mDeclarativeChildren.childTest (
										{
											childName:'color',
											cases:[
												[
													widgetClassName:'Uize.Widget.Button',
													expectedProperties:{clickToSelect:false},
													instanceProperties:{colorButtonShouldClickToSelect:false}
												],
												[
													widgetClassName:'Uize.Widget.Button',
													expectedProperties:{clickToSelect:true},
													instanceProperties:{colorButtonShouldClickToSelect:true}
												]
											]
										}
									);
									......
									
									NOTES
									- see the related =Uize.Test.Widget.mDeclarativeChildren.childrenTest= static method
						*/
					},

					childrenTest:function(_declarativeChildrenTests) {
						return this.makeMultipleDeclarativeCasesTest(
							'Declarative Children Tests',
							_declarativeChildrenTests,
							this.childTest
						);
						/*?
							Static Methods
								Uize.Test.Widget.mDeclarativeChildren.childrenTest
									.
									
									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mDeclarativeChildren.childrenTest (
										declarativeChildrenTestsARRAYorOBJ
									);
									..................................................................
									
									declarativeChildrenTestsARRAYorOBJ
										See =Uize.Test.Widget.mDeclarativeChildren.childTest= static method for the structure for each set of declarative children tests.
										
									EXAMPLE
									.......
									Uize.Test.Widget.mDeclarativeChildren.childrenTest  (
										[
											{
												childName:'color',
												cases:[
												]
											},
											{
												childName:'image',
												cases:[
												]
											},
											{
												childName:'ok'
											}
										]
									);
									......
									
									NOTES
									- see the related =Uize.Test.Widget.mDeclarativeChildren.childTest= static method
						*/
					}
				}
			});
		};
	}
});
