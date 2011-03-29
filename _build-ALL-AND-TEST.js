/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:'Uize.Wsh.BuildUtils',
	builder:function () {
		var _buildError = Uize.Wsh.BuildUtils.runScripts (
			env.buildSequence.concat ([
				'_run-unit-tests-source.js silent',
				'_run-unit-tests-scrunched.js silent'
			])
		);
		(WScript.Arguments.Count () && WScript.Arguments.Item (0) == 'silent') ||
			alert (
				_buildError
					? ('FAILED IN THE FOLLOWING SCRIPT:\n\n' + _buildError.script)
					: 'ALL BUILT AND ALL TESTED!!!'
			)
		;
		_buildError && WScript.Quit (1);
	}
});

