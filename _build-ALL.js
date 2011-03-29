/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:'Uize.Wsh.BuildUtils',
	builder:function () {
		var _buildError = Uize.Wsh.BuildUtils.runScripts (env.buildSequence);
		(WScript.Arguments.Count () && WScript.Arguments.Item (0) == 'silent') ||
			alert (
				_buildError
					? ('BUILD FAILED IN THE FOLLOWING SCRIPT:\n\n' + _buildError.script)
					: 'BUILD ALL COMPLETE!!!'
			)
		;
		_buildError && WScript.Quit (1);
	}
});

