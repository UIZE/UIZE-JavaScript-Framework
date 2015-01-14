/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.ServicesSetup Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =UizeSite.Build.ServicesSetup= package....

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.ServicesSetup',
	required:[
		'Uize.Build.ServicesSetup',
		'Uize.Services.Setup'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			setup:function () {
				Uize.Build.ServicesSetup.setup (); // get base level of services setup
				Uize.Services.Setup.provideServiceSetup ('Uize.Services.FileBuilder','UizeSite.Build.File');
			}
		});
	}
});

