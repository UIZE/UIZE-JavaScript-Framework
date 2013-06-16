/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.TraceDependencies Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.TraceDependencies= package logs to the console all the dependencies for a specified JavaScript module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.TraceDependencies',
	required:[
		'Uize.Build.ModuleInfo',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		return {
			perform:function (_params) {
				console.log (Uize.Json.to (Uize.Build.ModuleInfo.traceDependencies (_params.moduleName)));
			}
		};
	}
});

