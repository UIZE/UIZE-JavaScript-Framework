(function () {
	var
		_buildFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build.js',1),
		_build = eval (_buildFile.ReadAll ())
	;
	_buildFile.Close ();
	_build ('Uize.Build.BuildSimpleDataPages');
}) ();

