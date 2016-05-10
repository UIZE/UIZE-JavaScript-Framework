/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.ModuleNaming Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		The =Uize.Util.ModuleNaming= package provides utility methods to help with following the various UIZE conventions for module naming.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The UIZE JavaScript Framework follows certain conventions when it comes to the naming of modules, and these conventions are observed by various build scripts provided as part of the framework.

			The =Uize.Util.ModuleNaming= module provides a set of utility methods to make it easier for various build scripts and development tools to follow these conventions.

			Module Naming
				A string value is considered to be a valid module name if it contains a period-delimited list of one or more JavaScript identifier names.

				This means that, in order for a string to be considered a valid module name, it must be matched by the following regular expression...

				REGULAR EXPRESSION
				...........................................................
				/^([a-zA-Z_$][a-zA-Z_$0-9]*)(\.[a-zA-Z_$][a-zA-Z_$0-9]*)*$/
				...........................................................

				The table below lists some examples of module names to illustrate how the basic convention for module naming covers a variety of different types of modules...

				..................................................................................................
				<< table >>

				title: Examples of Module Names
				data:
				:| Module Name | Module Type | Notes |
				:| MyNamespace | Namespace Module | top level namespace |
				:| MyNamespace.MySubNamespace | Namespace Module | deeper level namespace |
				:| MyNamespace.MyPackage | Package Module | capital first letter is recommended but not required |
				:| MyNamespace.MyClass | Class Module | capital first letter is recommended but not required |
				:| MyNamespace.xMyExtension | Extension Module | prefixed with lowercase "x" by convention |
				:| MyNamespace.mMyMixin | Mixin Module | prefixed with lowercase "m" by convention |
				:| MyNamespace.Test.MyNamespace.MyClass | Test Module | path under MyNamespace.Test is path of module that is tested by the test module |
				..................................................................................................

				As you will notice, additional conventions exist for denoting certain specific types of modules, such as extension modules (see `Extension Module Naming`), mixin modules (see `Mixin Module Naming`), and test modules (see `Test Module Naming`).

				The =Uize.Util.ModuleNaming.isModuleName= static method can be used to test if a specified string is a module name, according to the aforementioned convention.

			Top Level Namespaces
				A string is considered to be a top level namespace if it is a valid module name that contains only one segment.

				EXAMPLES
				...........
				Uize
				MyNamespace
				...........

				The =Uize.Util.ModuleNaming.getNamespace= static method can be used to obtain the top level namespace from a specified module name.

				EXAMPLES
				.................................................
				<< table >>

				data:
				:| Module Name | Top Level Namespace |
				:| Uize | Uize |
				:| Uize.Color | Uize |
				:| Uize.Widgets.Slider.Widget | Uize |
				:| MyNamespace.MyClass.MySubClass | MyNamespace |
				.................................................

			Extension Module Naming
				A string is considered to be an extension module name if it is a valid module name that has more than one segment, and where the last segment starts with a lowercase "x" and is followed by a capital letter.

				..................................................
				<< table >>

				title: Examples of Extension Module Names
				data:
				:| Module Being Extended | Extension Module Name |
				:| Uize.Color | Uize.Color.xSvgColors |
				:| Uize.Fade | Uize.Fade.xFactory |
				:| Uize.Fx | Uize.Fx.xShadows |
				..................................................

				The =Uize.Util.ModuleNaming.isExtensionModule= static method can be used to test if a specified string is an extension module name.

			Mixin Module Naming
				A string is considered to be a mixin module name if it is a valid module name that has more than one segment, and where the last segment starts with a lowercase "m" and is followed by a capital letter.

				EXAMPLE
				............................
				MyNamespace.MyClass.mMyMixin
				............................

				The =Uize.Util.ModuleNaming.isMixinModule= static method can be used to test if a specified string is a mixin module name.

			Test Module Naming
				A string is considered to be a test module name if it starts with a top level namespace, followed by the segment "Test", followed by a segment name that is identical to the top level namespace, followed by zero or more additional segments.

				The methods of the =Uize.Util.ModuleNaming= module follow the convention that the name for a test module is derived from the name of the module it is intended to test, by using the top level namespace for that module as a prefix, appending the path segment ".Test.", and then finally appending the name of the module being tested.

				This naming convention is best illustrated by the following table of examples...

				.....................................................................................
				<< table >>

				title: Examples of Test Module Names
				data:
				:| Name of Module to Test | Name of Test Module |
				:| Uize | Uize.Test.Uize |
				:| Uize.Widget | Uize.Test.Uize.Widget |
				:| MyNamespace.MyClass.MySubclass | MyNamespace.Test.MyNamespace.MyClass.MySubclass |
				.....................................................................................

				The following static methods are useful with respect to test module names...

				- =Uize.Util.ModuleNaming.getModuleNameFromTestModuleName= - determines the name of the module being tested by a specified test module
				- =Uize.Util.ModuleNaming.getTestModuleName= - determines the name that should be used for the test module for a specified module
				- =Uize.Util.ModuleNaming.isTestModule= - determines if the specified module name is a test module name
*/

Uize.module ({
	name:'Uize.Util.ModuleNaming',
	required:'Uize.Util.RegExpComposition',
	builder:function () {
		'use strict';

		var
			/*** references to static methods used internally ***/
				_getNamespace,
				_isTestModule,

			/*** General Variables ***/
				_moduleNamingRegExpComposition = new Uize.Util.RegExpComposition ({
					identifierFirstChar:/[a-zA-Z_$]/,
					identifierSubsequentChar:/[a-zA-Z_$0-9]/,
					identifier:/{identifierFirstChar}{identifierSubsequentChar}*/,
					capitalizedIdentifier:/[A-Z]{identifierSubsequentChar}*/,
					moduleName:/^{identifier}(?:\.{identifier})*$/,
					testModuleName:/^({identifier})\.Test\.(\1(?:\.{identifier})*)$/,
					extensionModuleName:/^{identifier}(?:\.{identifier})*\.{identifier}\.x{capitalizedIdentifier}$/,
					mixinModuleName:/^{identifier}(?:\.{identifier})*\.{identifier}\.m{capitalizedIdentifier}$/
				}),
				_moduleNameRegExp = new RegExp (_moduleNamingRegExpComposition.get ('moduleName').source),
				_testModuleNameRegExp = new RegExp (_moduleNamingRegExpComposition.get ('testModuleName').source),
				_extensionModuleNameRegExp = new RegExp (_moduleNamingRegExpComposition.get ('extensionModuleName').source),
				_mixinModuleNameRegExp = new RegExp (_moduleNamingRegExpComposition.get ('mixinModuleName').source),
				_widgetClassSuffixRegExp = /\.Widget$/
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

							This method follows the convention for `test module naming`. If, according to this convention, the specified module is a test module, then the name for the module that would be tested by the test module is derived from the name of the test module. If, on the other hand, the specified module is not a test module, then the specified module name is returned as is.

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
							Returns a string, representing the name of the corresponding test module for the specified module.

							SYNTAX
							.............................................................................
							testModuleNameSTR = Uize.Util.ModuleNaming.getTestModuleName (moduleNameSTR);
							.............................................................................

							This method follows the convention for `test module naming`. If, according to this convention, the specified module is a non-test module, then the name of that module's corresponding test module is derived from the module's name according to the naming convention. If, on the other hand, the specified module is actually a test module, then the specified test module name is returned as is.

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
							...........................................................................
							topLevelNamespaceSTR = Uize.Util.ModuleNaming.getNamespace (moduleNameSTR);
							...........................................................................

							EXAMPLES
							..........................................................................................
							Uize.Util.ModuleNaming.getNamespace ('Uize');                     // returns 'Uize'
							Uize.Util.ModuleNaming.getNamespace ('Uize.Widgets.Log.Widget');  // returns 'Uize'
							Uize.Util.ModuleNaming.getNamespace ('MyNamespace.MyClass');      // returns 'MyNamespace'
							..........................................................................................
				*/
			},

			isExtensionModule:function (_moduleName) {
				return _extensionModuleNameRegExp.test (_moduleName);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.isExtensionModule
							Returns a boolean, indicating whether or not the specified string is an extension module name, according to the convention for `extension module naming`.

							SYNTAX
							.................................................................................
							isExtensionModuleBOOL = Uize.Util.ModuleNaming.isExtensionModule (moduleNameSTR);
							.................................................................................

							EXAMPLES
							................................................................................................
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.xMyExtension');  // returns true

							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace');                       // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass');               // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.xFoo.Bar');      // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.xfoo');          // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.x_Foo');         // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.x$Foo');         // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.x4Foo');         // returns false
							Uize.Util.ModuleNaming.isExtensionModule ('MyNamespace.MyClass.mMyMixin');      // returns false
							................................................................................................

							NOTES
							- compare to the =Uize.Util.ModuleNaming.isTestModule= and =Uize.Util.ModuleNaming.isMixinModule= static methods
				*/
			},

			isMixinModule:function (_moduleName) {
				return _mixinModuleNameRegExp.test (_moduleName);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.isMixinModule
							Returns a boolean, indicating whether or not the specified string is a mixin module name, according to the convention for `mixin module naming`.

							SYNTAX
							.........................................................................
							isMixinModuleBOOL = Uize.Util.ModuleNaming.isMixinModule (moduleNameSTR);
							.........................................................................

							EXAMPLES
							............................................................................................
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.mMyMixin');      // returns true

							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace');                       // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass');               // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.mFoo.Bar');      // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.mfoo');          // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.m_Foo');         // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.m$Foo');         // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.m4Foo');         // returns false
							Uize.Util.ModuleNaming.isMixinModule ('MyNamespace.MyClass.xMyExtension');  // returns false
							............................................................................................

							NOTES
							- compare to the =Uize.Util.ModuleNaming.isTestModule= and =Uize.Util.ModuleNaming.isExtensionModule= static methods
				*/
			},

			isTestModule:_isTestModule = function (_moduleName) {
				return _testModuleNameRegExp.test (_moduleName);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.isTestModule
							Returns a boolean, indicating whether or not the specified string is a test module name, according to the convention for `test module naming`.

							SYNTAX
							.......................................................................
							isTestModuleBOOL = Uize.Util.ModuleNaming.isTestModule (moduleNameSTR);
							.......................................................................

							EXAMPLES
							...............................................................................................
							Uize.Util.ModuleNaming.isTestModule ('Uize');                                  // returns false
							Uize.Util.ModuleNaming.isTestModule ('Uize.Widget');                           // returns false
							Uize.Util.ModuleNaming.isTestModule ('Uize.Test');                             // returns false
							Uize.Util.ModuleNaming.isTestModule ('Uize.Test.Uize');                        // returns true
							Uize.Util.ModuleNaming.isTestModule ('Uize.Test.Uize.Widget');                 // returns true

							Uize.Util.ModuleNaming.isTestModule ('MyNamespace.MyClass');                   // returns false
							Uize.Util.ModuleNaming.isTestModule ('MyNamespace.Test.MyNamespace.MyClass');  // returns true
							...............................................................................................

							NOTES
							- see also the related =Uize.Util.ModuleNaming.getTestModuleName= and =Uize.Util.ModuleNaming.getModuleNameFromTestModuleName= static methods
							- compare to the =Uize.Util.ModuleNaming.isExtensionModule= and =Uize.Util.ModuleNaming.isMixinModule= static methods
				*/
			},

			isModuleName:function (_moduleName) {
				return _moduleNameRegExp.test (_moduleName);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.isModuleName
							Returns a boolean, indicating whether or not the specified string is a valid module name.

							SYNTAX
							.......................................................................
							isModuleNameBOOL = Uize.Util.ModuleNaming.isModuleName (moduleNameSTR);
							.......................................................................

							EXAMPLES
							...................................................................................
							Uize.Util.ModuleNaming.isModuleName ('Uize');                      // returns true
							Uize.Util.ModuleNaming.isModuleName ('Uize.Widgets.Button');       // returns true
							Uize.Util.ModuleNaming.isModuleName ('A.B.C');                     // returns true
							Uize.Util.ModuleNaming.isModuleName ('A123456789.B123456789');     // returns true
							Uize.Util.ModuleNaming.isModuleName ('$Name$Space$.$My$Module$');  // returns true
							Uize.Util.ModuleNaming.isModuleName ('_Name_Space_._My_Module_');  // returns true

							Uize.Util.ModuleNaming.isModuleName ('Namespace.');                // returns false
							Uize.Util.ModuleNaming.isModuleName ('.MyModule');                 // returns false
							Uize.Util.ModuleNaming.isModuleName ('Namespace..MyModule')        // returns false
							Uize.Util.ModuleNaming.isModuleName ('Name-Space.MyModule');       // returns false
							Uize.Util.ModuleNaming.isModuleName ('Namespace.My-Module');       // returns false
							Uize.Util.ModuleNaming.isModuleName ('1Namespace.MyModule');       // returns false
							Uize.Util.ModuleNaming.isModuleName ('Namespace.1MyModule');       // returns false
							...................................................................................
				*/
			},

			visualTestsModuleNameFromWidgetClass:function (_widgetClass) {
				return (
					_widgetClassSuffixRegExp.test (_widgetClass)
						? _widgetClass.replace (_widgetClassSuffixRegExp,'.VisualTests')
						: ''
				);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.visualTestsModuleNameFromWidgetClass
							Returns a string, representing the name of the corresponding visual tests module for the specified widget class name.

							SYNTAX
							........................................................................................
							visualTestsModuleNameSTR = Uize.Util.ModuleNaming.visualTestsModuleNameFromWidgetClass (
								widgetClassNameSTR
							);
							........................................................................................

							EXAMPLE
							........................................................................................
							Uize.Util.ModuleNaming.visualTestsModuleNameFromWidgetClass ('Uize.Widgets.Log.Widget');
							........................................................................................

							RESULT
							..............................
							'Uize.Widgets.Log.VisualTests'
							..............................

							NOTES
							- see also the companion =Uize.Util.ModuleNaming.visualSamplerModuleNameFromWidgetClass= static method
				*/
			},

			visualSamplerModuleNameFromWidgetClass:function (_widgetClass) {
				return (
					_widgetClassSuffixRegExp.test (_widgetClass)
						? _widgetClass.replace (_widgetClassSuffixRegExp,'.VisualSampler')
						: ''
				);
				/*?
					Static Methods
						Uize.Util.ModuleNaming.visualSamplerModuleNameFromWidgetClass
							Returns a string, representing the name of the corresponding visual sampler module for the specified widget class name.

							SYNTAX
							............................................................................................
							visualSamplerModuleNameSTR = Uize.Util.ModuleNaming.visualSamplerModuleNameFromWidgetClass (
								widgetClassNameSTR
							);
							............................................................................................

							EXAMPLE
							..........................................................................................
							Uize.Util.ModuleNaming.visualSamplerModuleNameFromWidgetClass ('Uize.Widgets.Log.Widget');
							..........................................................................................

							RESULT
							................................
							'Uize.Widgets.Log.VisualSampler'
							................................

							NOTES
							- see also the companion =Uize.Util.ModuleNaming.visualTestsModuleNameFromWidgetClass= static method
				*/
			}
		});
	}
});

