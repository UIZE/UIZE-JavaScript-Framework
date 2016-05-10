/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mChildBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Widget.mChildBindings= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mChildBindings=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Widget.mChildBindings',
	required:'Uize.Test.Class.mChildObjectBindings',
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				mixins:Uize.Test.Class.mChildObjectBindings,

				childObjectBindingsTest:{
					childObjectTestsName:'childBindingsTest',
						/*?
							Static Methods
								Uize.Test.Widget.mChildBindings.childBindingsTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mChildBindings.childBindingsTest (
										childBindingsTestsARRAYorOBJ
									);
									..................................................................

									childBindingsTestsARRAYorOBJ
										See =Uize.Test.Widget.mChildBindings.childBindingTest= static method for the structure for each set of child binding tests.

									EXAMPLE
									.......
									Uize.Test.Widget.mChildBindings.childBindingsTest  (
										[
											{
												propertyName:'numColors',
												cases:[
												]
											},
											{
												propertyName:'maxValidColors',
												cases:[
												]
											},
											{
												propertyName:'maxColors',
												cases:[
												]
											}
										]
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mChildBindings.childBindingTest= static method
						*/
					childObjectTestName:'childBindingTest',
						/*?
							Static Methods
								Uize.Test.Widget.mChildBindings.childBindingTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mChildBindings.childBindingTest (
										paramsOBJ
									);
									..................................................................

									paramsOBJ
										.

										propertyName
											.

										cases
											.

											child
												name of the bound child

											property
												child state property name

											direction
												binding direction

											expect
												array of expectations

											instanceProperties
												instance properties for the case

										instanceProperties
											.

										testProperties
											.

									EXAMPLE
									.......
										{
											propertyName:'numColors',
											cases:[
												{
													child:'numColors',
													property:'value',
													direction:'<->',
													expect:[
														{a:7, b:7}
													]
												}
											]
										}
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mChildBindings.childBindingsTest= static method
						*/
					childObjectsPropertyName:'children'
				}
			});
		};
	}
});
