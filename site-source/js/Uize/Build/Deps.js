/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Deps Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Build.Deps= module implements a build script for analyzing the dependencies of a specified module and producing a detailed report.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Deps',
	required:'Uize.Util.Dependencies.Analyzer',
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				/*
					- get module list
					- perform dependency analysis
						- build module info modules as needed
					- write JSON file to log
					- produce pretty text report for console
				*/
				console.log (
					'REPORT'
				);
			}
		});
	}
});

