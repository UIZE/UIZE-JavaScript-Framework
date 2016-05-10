/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Class.mModels Class
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
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Test.Class.mModels= module provides convenience methods for writing test cases against =Uize.Class= subclass modules that mix-in =Uize.Class.mModels=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Class.mModels',
	required:[
		'Uize.Test.Class.mChildObjectBindings',
		'Uize.Test.Class.mDeclarativeChildObjects'
	],
	builder:function () {
		'use strict';

		var
			_Uize_Test_Class = Uize.Test.Class
		;

		return function (_class) {
			_class.declare({
				mixins:[
					_Uize_Test_Class.mChildObjectBindings,
					_Uize_Test_Class.mDeclarativeChildObjects
				],

				declarativeChildObjectsTest:{
					childObjectTestsName:'declarativeModelsTest',
						/*?
							Static Methods
								Uize.Test.Class.mModels.declarativeModelsTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Class.mModels.declarativeModelsTest (
										declarativeModelsTestsARRAYorOBJ
									);
									..................................................................

									declarativeModelsTestsARRAYorOBJ
										See =Uize.Test.Class.mModels.declarativeModelTest= static method for the structure for each set of declarative children tests.

									EXAMPLE
									.......
									Uize.Test.Class.mModels.declarativeModelsTest  (
										[
											{
												childName:'images',
												cases:[
												]
											},
											{
												childName:'flowers',
												cases:[
												]
											},
											{
												childName:'snakes'
											}
										]
									);
									......

									NOTES
									- see the related =Uize.Test.Class.mModels.declarativeModelTest= static method
						*/
					childObjectTestName:'declarativeModelTest',
						/*?
							Static Methods
								Uize.Test.Class.mModels.declarativeModelTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Class.mModels.declarativeModelTest (
										paramsOBJ
									);
									..................................................................

									paramsOBJ
										.

										childName
											.

										cases
											.

											modelClassName
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
									Uize.Test.Class.mModels.declarativeModelTest (
										{
											childName:'images',
											cases:[
												[
													modelClassName:'Uize.Models.Images',
													expectedProperties:{numImages:15},
													instanceProperties:{numImagesForImagesModel:15}
												],
												[
													modelClassName:'Uize.Models.Images',
													expectedProperties:{numImages:100},
													instanceProperties:{numImagesForImagesModel:-1}
												]
											]
										}
									);
									......

									NOTES
									- see the related =Uize.Test.Class.mModels.declarativeModelsTest= static method
						*/
					childObjectsPropertyName:'models',
					childObjectClassKey:'modelClassName'
				},

				childObjectBindingsTest:{
					childObjectTestsName:'modelBindingsTest',
						/*?
							Static Methods
								Uize.Test.Class.mModels.modelBindingsTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Class.mModels.modelBindingsTest (
										modelBindingsTestsARRAYorOBJ
									);
									..................................................................

									modelBindingsTestsARRAYorOBJ
										See =Uize.Test.Class.mModels.modelBindingTest= static method for the structure for each set of child binding tests.

									EXAMPLE
									.......
									Uize.Test.Class.mModels.modelBindingsTest  (
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
									- see the related =Uize.Test.Class.mModels.modelBindingTest= static method
						*/
					childObjectTestName:'modelBindingTest',
						/*?
							Static Methods
								Uize.Test.Class.mModels.modelBindingTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Class.mModels.modelBindingTest (
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
									Uize.Test.Class.mModels.modelBindingTest (
										{
											propertyName:'numColors',
											cases:[
												{
													child:'images',
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
									- see the related =Uize.Test.Class.mModels.childBindingsTest= static method
						*/
					childObjectsPropertyName:'children'
				}
			});
		};
	}
});
