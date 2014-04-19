/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Test Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.Test= module provides a method for testing a specified JavaScript module.

		*DEVELOPERS:* `Chris van Rensburg`

		Specify a Test Module
			When the value specified for the =module= parameter is a test module, then the test suite defined by the test module will be run.

			EXAMPLE
			.........................................................
			node build.js Uize.Build.Test module=Uize.Test.Uize.Class
			.........................................................

		Specify a Module
			When the value specified for the =module= parameter is a non-test module, then the corresponding test module for the specified module will be run.

			EXAMPLE
			...............................................
			node build.js Uize.Build.Test module=Uize.Class
			...............................................
*/

Uize.module ({
	name:'Uize.Build.Test',
	required:'Uize.Build.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {Uize.Build.Util.runUnitTests (_params)}
		});
	}
});

