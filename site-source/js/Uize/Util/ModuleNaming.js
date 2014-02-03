/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.ModuleNaming Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.ModuleNaming= package provides utility methods to help with following conventions for module naming.

		*DEVELOPERS:* `Chris van Rensburg`

		Test Module Naming Convention
			The methods of the =Uize.Util.ModuleNaming= module follow the convention that the name for a test module is derived from the name of the module it is intended to test, by using the top level namespace for that module as a prefix, appending the path segment ".Test.", and then finally appending the name of the module.

			This naming convention is best illustrated by the following table of examples...

			.....................................................................................
			<< table >>

			title: Examples of Test Module Names
			data:
			:| Module Name | Test Module Name |
			:| Uize | Uize.Test.Uize |
			:| Uize.Widget | Uize.Test.Uize.Widget |
			:| MyNamespace.MyClass.MySubclass | MyNamespace.Test.MyNamespace.MyClass.MySubclass |
			.....................................................................................
*/

Uize.module ({
	name:'Uize.Util.ModuleNaming',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_testModuleNameRegExp = /^([^\.]+)\.Test\.(\1(?:\..+|$))/,

			/*** references to static methods used internally ***/
				_getNamespace,
				_isTestModule
		;

		return Uize.package ({
			getModuleNameFromTestModuleName:function (_testModuleName) {
				var _match = _testModuleName.match (_testModuleNameRegExp);
				return _match ? _match [2] : _testModuleName;
				/*?
					Static Methods
						Uize.Util.ModuleNaming.getModuleNameFromTestModuleName
							Returns a string, representing the name of the module that is tested by the specified test module.

							SYNTAX
							...........................................................................................
							moduleNameSTR = Uize.Util.ModuleNaming.getModuleNameFromTestModuleName (testModuleNameSTR);
							...........................................................................................

							This method follows the `test module naming convention`. If, according to this convention, the specified module is a test module, then the name for the module that would be tested by the test module is derived from the name of the test module. If, on the other hand, the specified module is not a test module, then the specified module name is returned as is.

							EXAMPLES
							.............................................................................................
							Uize.Util.ModuleNaming.getModuleNameFromTestModuleName ('Uize.Test.Uize');  // returns 'Uize'
							Uize.Util.ModuleNaming.getModuleNameFromTestModuleName ('Uize');            // returns 'Uize'
							.............................................................................................

							NOTES
							- compare to the companion =Uize.Util.ModuleNaming.getTestModuleName= static method
							- see also the related =Uize.Util.ModuleNaming.isTestModule= static method
				*/
			},

			getTestModuleName:function (_moduleName) {
				return _isTestModule (_moduleName) ? _moduleName : _getNamespace (_moduleName) + '.Test.' + _moduleName;
				/*?
					Static Methods
						Uize.Util.ModuleNaming.getTestModuleName
							Returns a string, representing the name of the corresponding unit tests module for the specified module.

							SYNTAX
							.............................................................................
							testModuleNameSTR = Uize.Util.ModuleNaming.getTestModuleName (moduleNameSTR);
							.............................................................................

							This method follows the `test module naming convention`. If, according to this convention, the specified module is a non-test module, then the name of that module's corresponding test module is derived from the module's name according to the naming convention. If, on the other hand, the specified module is actually a test module, then the specified test module name is returned as is.

							EXAMPLES
							.........................................................................................
							Uize.Util.ModuleNaming.getTestModuleName ('Uize');            // returns 'Uize.Test.Uize'
							Uize.Util.ModuleNaming.getTestModuleName ('Uize.Test.Uize');  // returns 'Uize.Test.Uize'
							.........................................................................................

							NOTES
							- compare to the companion =Uize.Util.ModuleNaming.getModuleNameFromTestModuleName= static method
							- see also the related =Uize.Util.ModuleNaming.isTestModule= static method
				*/
			},

			getNamespace:_getNamespace = function (_moduleName) {
				return _moduleName.slice (0,((_moduleName.indexOf ('.') + 1) || _moduleName.length + 1) - 1);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.getNamespace
							Returns a string, representing the top level namespace for the specified module.

							SYNTAX
							.........................................................................
							moduleNamespaceSTR = Uize.Util.ModuleNaming.getNamespace (moduleNameSTR);
							.........................................................................

							EXAMPLES
							..........................................................................................
							Uize.Util.ModuleNaming.getNamespace ('Uize');                     // returns 'Uize'
							Uize.Util.ModuleNaming.getNamespace ('Uize.Widgets.Log.Widget');  // returns 'Uize'
							Uize.Util.ModuleNaming.getNamespace ('MyNamespace.MyClass');      // returns 'MyNamespace'
							..........................................................................................
				*/
			},

			isTestModule:_isTestModule = function (_moduleName) {
				return _testModuleNameRegExp.test (_moduleName);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.isTestModule
							Returns a boolean, indicating whether or not the specified module is a test module, according to the `test module naming convention`.

							SYNTAX
							.......................................................................
							isTestModuleBOOL = Uize.Util.ModuleNaming.isTestModule (moduleNameSTR);
							.......................................................................

							EXAMPLES
							...............................................................................................
							Uize.Util.ModuleNaming.isTestModule ('Uize');                                  // returns false
							Uize.Util.ModuleNaming.isTestModule ('Uize.Widget');                           // returns false
							Uize.Util.ModuleNaming.isTestModule ('Uize.Test.Uize.Widget');                 // returns true
							Uize.Util.ModuleNaming.isTestModule ('MyNamespace.MyClass');                   // returns false
							Uize.Util.ModuleNaming.isTestModule ('MyNamespace.Test.MyNamespace.MyClass');  // returns true
							...............................................................................................

							NOTES
							- see also the related =Uize.Util.ModuleNaming.getTestModuleName= and =Uize.Util.ModuleNaming.getModuleNameFromTestModuleName= static methods
				*/
			}
		});
	}
});

