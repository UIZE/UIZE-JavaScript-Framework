/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.RunUnitTests Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
		The =Uize.Build.RunUnitTests= module provides a method for testing all modules of the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLES
		.....................................................
		node build.js Uize.Build.RunUnitTests useSource=false
		node build.js Uize.Build.RunUnitTests useSource=true
		.....................................................
*/

Uize.module ({
	name:'Uize.Build.RunUnitTests',
	required:'Uize.Build.RunUnitTest',
	builder:function () {return Uize.Build.RunUnitTest}
});

