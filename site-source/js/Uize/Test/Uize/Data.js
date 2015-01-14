/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data= module defines a suite of unit tests for the =Uize.Data= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data',
	required:'Uize.Test',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Data Module',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Data',
					'Uize.Data.Compare',
					'Uize.Data.Util'
				]),
				Uize.Test.migratedStaticMethodsTest ([
					/*** static methods migrated to the Uize.Data.Compare module ***/
						['Uize.Data.clones','Uize.Data.Compare.clones'],
						['Uize.Data.conjoined','Uize.Data.Compare.conjoined'],
						['Uize.Data.identical','Uize.Data.Compare.identical'],
						['Uize.Data.intersection','Uize.Data.Compare.intersection'],

					/*** static methods migrated to the Uize.Data.Util module ***/
						['Uize.Data.filter','Uize.Data.Util.filter'],
						['Uize.Data.findRecords','Uize.Data.Util.findRecords'],
						['Uize.Data.getColumn','Uize.Data.Util.getColumn']
				])
			]
		});
	}
});

