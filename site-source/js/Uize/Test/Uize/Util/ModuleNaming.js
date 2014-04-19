/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.ModuleNaming Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 8
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

