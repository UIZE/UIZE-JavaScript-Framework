/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.All Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Build.All= module provides a method for running all the build scripts necessary for building the UIZE JavaScript Framework in the correct sequence.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.All',
	required:'Uize.Build.Util',
	builder:function () {
		'use strict';

		var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_startTime = Uize.now (),
					_buildSequence = _params.buildSequence,
					_buildError
				;
				Uize.require (
					_buildSequence,
					function () {
						Uize.forEach (
							_buildSequence,
							function (_buildModuleName) {
								Uize.getModuleByName (_buildModuleName).perform (
									Uize.copyInto ({},_params,{logFilePath:'logs/' + _buildModuleName + '.log'})
								);
							}
						);
						if (_params.test == 'true')
							_buildError = Uize.Build.Util.runScripts (_params.testSequence)
						;
						_params.silent == 'true' ||
							alert (
								_buildError
									? ('BUILD FAILED IN THE FOLLOWING SCRIPT:\n\n' + _buildError.script)
									: 'BUILD ALL COMPLETE!!! (duration: ' + Math.round ((Uize.now () - _startTime) / 1000) + 's)'
							)
						;
					}
				);
			};

		return _package;
	}
});

