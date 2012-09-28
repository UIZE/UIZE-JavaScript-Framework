/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.All Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 100
	testCompleteness: 0
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
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _buildError = Uize.Build.Util.runScripts (
					_params.buildSequence.concat (_params.test == 'true' ? _params.testSequence : [])
				);
				_params.silent == 'true' ||
					alert (
						_buildError
							? ('BUILD FAILED IN THE FOLLOWING SCRIPT:\n\n' + _buildError.script)
							: 'BUILD ALL COMPLETE!!!'
					)
				;
				_buildError && WScript.Quit (1);
			};

		return _package;
	}
});

