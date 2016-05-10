/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mCssBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.css
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Widget.mCssBindings= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mCssBindings=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Widget.mCssBindings',
	required:'Uize.Json',
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				staticMethods:{
					cssBindingTest:function(_testParams) {
						var
							_testClass = this,

							_propertyName = _testParams.propertyName,
							_instanceProperties = _testParams.instanceProperties,
							_cases = _testParams.cases
						;

						function _getWidgetInstance(m) {
							return m.setInstance(_instanceProperties);
						}

						return _testClass.resolve(
							_Uize.copyInto(
								{
									title:'CSS BINDING TEST: ' + _propertyName,
									test:_Uize.map(
										_cases,
										function(_case) {
											var
												_state = _case.state,
												_expected = _case.expected
											;
											return {
												title:_case.title || 'When state is set to ' + _Uize.Json.to(_state, 'mini') + ', ' + (_expected || '*nothing*') + ' is added to CSS className',
												test:function() {
													var _widgetInstance = _getWidgetInstance(this);

													// change state
													_widgetInstance.set(_state);

													return this.expect(
														true,
														_Uize.isIn(
															_widgetInstance.get('mCssBindings_rootNodeClasses').split(' '),
															_widgetInstance.cssClass(_expected)
														)
													);
												}
											};
										}
									)
								},
								_testParams.testProperties
							)
						);
						/*?
							Static Methods
								Uize.Test.Widget.mCssBindings.cssBindingTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mCssBindings.cssBindingTest (
										paramsOBJ
									);
									..................................................................

									paramsOBJ
										.

										propertyNameSTR
											.

										casesARRAY
											.

											state
												.

											expected
												.

											title
												.

										instancePropertiesOBJ
											.

										testPropertiesOBJ
											.

									EXAMPLE
									.......
									Uize.Test.Widget.mCssBindings.childTest (
										{
											propertyName:'showDisplayInfo',
											cases:[
												{
													state:{
														showDisplayInfo:false
													},
													expected:'hideDisplayInfo'
												},
												{
													state:{
														showDisplayInfo:true
													},
													expected:''
												}
											]
										}
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mCssBindings.cssBindingsTest= static method
						*/
					},

					cssBindingsTest:function(_cssBindingsTests) {
						return this.makeMultipleDeclarativeCasesTest(
							'CSS Bindings Tests',
							_cssBindingsTests,
							this.cssBindingTest
						);
						/*?
							Static Methods
								Uize.Test.Widget.mCssBindings.cssBindingsTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mCssBindings.cssBindingsTest (
										cssBindingsTestsARRAYorOBJ
									);
									..................................................................

									cssBindingsTestsARRAYorOBJ
										See =Uize.Test.Widget.mCssBindings.cssBindingTest= static method for the structure for each set of CSS binding tests.

									EXAMPLE
									.......
									Uize.Test.Widget.mCssBindings.cssBindingsTest  (
										[
											{
												propertyName:'value',
												cases:[

												]
											},
											{
												propertyName:'displayName',
												cases:[

												]
											},
											{
												propertyName:'posX',
												cases:[

												]
											}
										]
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mCssBindings.cssBindingTest= static method
						*/
					}
				}
			});
		};
	}
});
