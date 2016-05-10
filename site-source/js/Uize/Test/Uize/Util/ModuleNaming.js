/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.ModuleNaming Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Util.ModuleNaming= module defines a suite of unit tests for the =Uize.Util.ModuleNaming= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.ModuleNaming',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.ModuleNaming Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.ModuleNaming'),
				Uize.Test.staticMethodsTest ([
					['Uize.Util.ModuleNaming.getModuleNameFromTestModuleName',[
						['When a module name is not a test module name, it is returned as is',
							'Namespace.MyModule',
							'Namespace.MyModule'
						],
						['When a module name is a test module name, the name of the module that the test module tests is returned',
							'Namespace.Test.Namespace.MyModule',
							'Namespace.MyModule'
						]
					]],
					['Uize.Util.ModuleNaming.getTestModuleName',[
						['When a module name is already a test module name, it is returned as is',
							'Namespace.Test.Namespace.MyModule',
							'Namespace.Test.Namespace.MyModule'
						],
						['When a module name is not a test module name, the name of the test module for the specified module is returned',
							'Namespace.MyModule',
							'Namespace.Test.Namespace.MyModule'
						]
					]],
					['Uize.Util.ModuleNaming.getNamespace',[
						['When a module name is just a namespace, it is returned as is',
							'Namespace',
							'Namespace'
						],
						['When a module name is for a module that is under a namespace, just the namespace segment is returned',
							'Namespace.MyModule.MySubModule',
							'Namespace'
						]
					]],
					['Uize.Util.ModuleNaming.isExtensionModule',[
						['A module name is considered to be an extension module name if the last segment of the name starts with a lowercase "x" and is followed by a capital letter',
							'MyNamespace.MyClass.xMyExtension',
							true
						],
						['A top level namespace module is not considered to be an extension module',
							'MyNamespace',
							false
						],
						['A class module is not considered to be an extension module',
							'MyNamespace.MyClass',
							false
						],
						['A mixin module is not considered to be an extension module',
							'MyNamespace.MyClass.mMyMixin',
							false
						],
						['A module name that contains a segment that starts with a lowercase "x" and is followed by a capital letter is not considered to be an extension module name if the segment is not the last segment of the name',
							'MyNamespace.MyClass.xFoo.Bar',
							false
						],
						['A top level namespace that starts with a lowercase "x" and is followed by a capital letter is not considered to be an extension module name',
							'xFoo',
							false
						],
						['A module name where the last segment starts with a lowercase "x" but where the next character is a lowercase letter is not considered to be an extension module name',
							'MyNamespace.MyClass.xfoo',
							false
						],
						['A module name where the last segment starts with a lowercase "x" but where the next character is an underscore is not considered to be an extension module name',
							'MyNamespace.MyClass.x_Foo',
							false
						],
						['A module name where the last segment starts with a lowercase "x" but where the next character is a dollar is not considered to be an extension module name',
							'MyNamespace.MyClass.x$Foo',
							false
						],
						['A module name where the last segment starts with a lowercase "x" but where the next character is a digit is not considered to be an extension module name',
							'MyNamespace.MyClass.x4Foo',
							false
						]
					]],
					['Uize.Util.ModuleNaming.isMixinModule',[
						['A module name is considered to be a mixin module name if the last segment of the name starts with a lowercase "m" and is followed by a capital letter',
							'MyNamespace.MyClass.mMyMixin',
							true
						],
						['A top level namespace module is not considered to be a mixin module',
							'MyNamespace',
							false
						],
						['A class module is not considered to be a mixin module',
							'MyNamespace.MyClass',
							false
						],
						['An extension module is not considered to be a mixin module',
							'MyNamespace.MyClass.xMyExtension',
							false
						],
						['A module name that contains a segment that starts with a lowercase "m" and is followed by a capital letter is not considered to be a mixin module name if the segment is not the last segment of the name',
							'MyNamespace.MyClass.mFoo.Bar',
							false
						],
						['A top level namespace that starts with a lowercase "m" and is followed by a capital letter is not considered to be a mixin module name',
							'mFoo',
							false
						],
						['A module name where the last segment starts with a lowercase "m" but where the next character is a lowercase letter is not considered to be a mixin module name',
							'MyNamespace.MyClass.mfoo',
							false
						],
						['A module name where the last segment starts with a lowercase "m" but where the next character is an underscore is not considered to be a mixin module name',
							'MyNamespace.MyClass.m_Foo',
							false
						],
						['A module name where the last segment starts with a lowercase "m" but where the next character is a dollar is not considered to be a mixin module name',
							'MyNamespace.MyClass.m$Foo',
							false
						],
						['A module name where the last segment starts with a lowercase "m" but where the next character is a digit is not considered to be a mixin module name',
							'MyNamespace.MyClass.m4Foo',
							false
						]
					]],
					['Uize.Util.ModuleNaming.isTestModule',[
						['When a module name is not a test module name, the value false is returned',
							'Namespace.MyModule',
							false
						],
						['When a module name is a test module name, the value true is returned',
							'Namespace.Test.Namespace.MyModule',
							true
						],
						['The test namespace for a given root namespace is not considered a test module',
							'Namespace.Test',
							false
						],
						['A module under the test namespace (e.g. Namespace.Test) for a given root namespace (e.g. Namespace) is not considered a test module if the first module name segment (e.g. Foo) under the test namespace is not the root namespace',
							'Namespace.Test.Foo',
							false
						]
					]],
					['Uize.Util.ModuleNaming.isModuleName',[
						['A module name may contain only a valid format namespace segment',
							'Uize',
							true
						],
						['A module name may contain a valid format namespace segment along with multiple valid format sub-namespace segments',
							'Uize.Widget.Button',
							true
						],
						['Both the top level namespace segment and all sub-namespace segments can be just one character in length',
							'A.B.C',
							true
						],
						['Both the top level namespace segment and sub-namespace segments may contain digits',
							'A123456789.B123456789',
							true
						],
						['The top level namespace segment and sub-namespace segments may start with, contain, and end with a dollar character',
							'$Name$Space$.$My$Module$',
							true
						],
						['The top level namespace segment and sub-namespace segments may start with, contain, and end with an underscore character',
							'_Name_Space_._My_Module_',
							true
						],
						['A module name may not end with a blank sub-namespace segment',
							'Namespace.',
							false
						],
						['A module name may not start with a blank top level namespace segment',
							'.MyModule',
							false
						],
						['A module name may not contain an inner blank sub-namespace segment',
							'Namespace..MyModule',
							false
						],
						['A module name may not have a top level namespace segment that contains invalid characters',
							'Name-Space.MyModule',
							false
						],
						['A module name may not have a sub-namespace segment that contains invalid characters',
							'NameSpace.My-Module',
							false
						],
						['The top level namespace of a module name may not start with a digit',
							'1Namespace.MyModule',
							false
						],
						['A sub-namespace of a module name may not start with a digit',
							'Namespace.1MyModule',
							false
						]
					]]
				])
			]
		});
	}
});

