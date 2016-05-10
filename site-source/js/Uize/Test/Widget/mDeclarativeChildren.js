/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mDeclarativeChildren Class
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
		The =Uize.Test.Widget.mDeclarativeChildren= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mDeclarativeChildren=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Widget.mDeclarativeChildren',
	required:'Uize.Test.Class.mDeclarativeChildObjects',
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				mixins:_Uize.Test.Class.mDeclarativeChildObjects,

				declarativeChildObjectsTest:{
					childObjectTestsName:'childrenTest',
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
					childObjectTestName:'childTest',
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
					childObjectsPropertyName:'children',
					childObjectClassKey:'widgetClassName'
				}
			});
		};
	}
});
