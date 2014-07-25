/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.JavaProperties Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Loc.FileFormats.JavaProperties= module defines a suite of unit tests for the =Uize.Loc.FileFormats.JavaProperties= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.JavaProperties',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Loc.FileFormats.JavaProperties Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.JavaProperties'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.JavaProperties.from',[
						['Parsing an empty string produces an empty strings object',
							'',
							{}
						]
					]],
					['Uize.Loc.FileFormats.JavaProperties.to',[
						['Serializing an empty strings object produces an empty string as a result',
							{},
							''
						]
					]]
				])
			]
		});
	}
});

