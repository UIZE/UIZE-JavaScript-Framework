/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:'UizeDotCom.Build.BuildSimpleDocPages',
	builder:function () {UizeDotCom.Build.BuildSimpleDocPages.perform (env)}
});

