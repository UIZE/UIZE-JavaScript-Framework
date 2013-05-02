/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.ServicesSetup Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		The =Uize.Build.ServicesSetup= package....

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.ServicesSetup',
	required:'Uize.Services.Setup',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.setup = function () {
				/*** provide setup for FileSystem service ***/
					var _isWsh = typeof ActiveXObject != 'undefined';
					Uize.Services.Setup.provideServiceSetup (
						'Uize.Services.FileSystem',
						_isWsh ? 'Uize.Services.FileSystemAdapter.Wsh' : 'Uize.Services.FileSystemAdapter.Node',
						function (_service,_doneWithSetup) {
							_service.init ();
							_doneWithSetup ();
						}
					);
			};

		return _package;
	}
});

