/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Wsh.CompileJstModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Wsh.CompileJstModules= package provides a way to recurse folder structures and compile =.js.jst= JavaScript templates to =.js= JavaScript modules.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Wsh.CompileJstModules= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Wsh.CompileJstModules',
	required:[
		'Uize.Template',
		'Uize.Wsh.BuildUtils'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_moduleFolderPath = '\\' + _params.moduleFolderPath,
					_moduleFolderPathLength = _moduleFolderPath.length,
					_jstModuleTemplate,
					_jsJstRegExp = /\.js\.jst$/i
				;
				Uize.Wsh.buildFiles (
					Uize.copyInto (
						{
							targetFolderPathCreator:function (_folderPath) {
								var _targetFolderPath =
									_folderPath.slice (-_moduleFolderPathLength) == _moduleFolderPath ? _folderPath : null
								;
								if (_targetFolderPath)
									_jstModuleTemplate = Uize.Wsh.BuildUtils.compileJstFile (
										_folderPath + '\\Uize.Templates.JstModule.js.jst'
									)
								;
								return _targetFolderPath;
							},
							targetFilenameCreator:function (_sourceFileName) {
								return _jsJstRegExp.test (_sourceFileName) ? _sourceFileName.replace (_jsJstRegExp,'.js') : null;
							},
							fileBuilder:function (_sourceFileName,_sourceFileText) {
								return {
									outputText:_jstModuleTemplate ({
										moduleName:_sourceFileName.replace (_jsJstRegExp,''),
										compiledTemplate:Uize.Template.compile (_sourceFileText,{result:'full'})
									})
								};
							}
						},
						_params
					)
				);
			};

		return _package;
	}
});

