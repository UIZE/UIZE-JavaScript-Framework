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

		Parameters
			This method supports the following parameters...

			- =module= - a string, specifying the name of a unit tests module or a module name matcher expression
			- =consoleSTR= - a string, specifying the amount of information that should be logged to the console while the tests are being run. The value =silent= indicates that nothing should be logged to the console. The value =summary= (the default) indicates that only the summary information from running the tests should be logged. And the value =verbose= indicates that information from running all tests (including deeply nested tests) should be logged.
			- =logFilePath= - a string, optionally specifying the path for where a log file should be written (if not specified, no log file will be written)
*/

Uize.module ({
	name:'Uize.Build.Test',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Test.Runner',
		'Uize.Build.Util',
		'Uize.Templates.TextProgressBar'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_test,
					_totalTests,
					_progressBar = _params.progressBar + '' != 'false',
					_currentTestNo = 0
				;
				Uize.Test.Runner.resolve (
					_params,
					function () {return Uize.Build.Util.getJsModules (_params)},
					function (_moduleName) {
						return _fileSystem.fileExists ({
							path:_params.sourcePath + '/' + _params.modulesFolder + '/' + Uize.modulePathResolver (_moduleName) + '.js'
						});
					},
					function (_message) {
						console.log (
							_progressBar
								? Uize.Templates.TextProgressBar.process ({
									trackLength:20,
									progress:(_currentTestNo + 1) / _totalTests
								})
								: '',
							_message
						);
					},
					function (_reasonForFailure,_logChunks) {
						var _logFilePath = _params.logFilePath;
						_logFilePath &&
							_fileSystem.writeFile ({path:_logFilePath,contents:_logChunks.join ('\n')})
						;
						_reasonForFailure && typeof WScript != 'undefined' && WScript.Quit (1);
					},
					function (_testInstance) {
						_test = _testInstance;
						_totalTests = _test.getTotalTests ();
						_test.wire ({Done:function (e) {++_currentTestNo}});
						_test.run ();
					}
				);
			}
		});
	}
});

