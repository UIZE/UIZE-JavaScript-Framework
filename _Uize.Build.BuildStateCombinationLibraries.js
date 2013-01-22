(function () {
	var
		_buildFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build.js',1),
		_build = eval (_buildFile.ReadAll ())
	;
	_buildFile.Close ();
	_build (
		'Uize.Build.BuildStateCombinationLibraries',
		{
			stateDefinitionsPath:'temp/state-definitions.json',
			packageTargetPathTemplate:'temp/state-combination-libraries/{previousStates}--{nextState}.js'
		}
	);
}) ();

