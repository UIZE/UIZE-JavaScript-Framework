/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:'UizeDotCom.Build.BuildWidgetPages',
	builder:function () {UizeDotCom.Build.BuildWidgetPages.perform (env)}
});

