/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:'Uize.Build.ModuleInfo',
	builder:function () {
		alert (Uize.Build.ModuleInfo.traceDependencies ('UizeSite.Page.Doc'));
	}
});

