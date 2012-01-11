/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Wsh.BuildSimpleDataPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Wsh.BuildSimpleDataPages= package provides a method to recurse a folder structure and build pages from =.simpledata= files using =.jst= templates.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Wsh.BuildSimpleDataPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Wsh.BuildSimpleDataPages',
	required:[
		'Uize.Wsh.BuildUtils',
		'Uize.Template',
		'Uize.Data.Simple',
		'Uize.Url'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize_Data_Simple_parse = Uize.Data.Simple.parse
			;

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_currentFolderPath,
					_currentTargetFileName,
					_simpleDataExtensionRegExp = /\.simpledata$/i
				;
				Uize.Wsh.buildFiles (
					Uize.copyInto (
						{
							targetFolderPathCreator:function (_folderPath) {return _currentFolderPath = _folderPath},
							targetFilenameCreator:function (_sourceFileName) {
								_currentTargetFileName = null;
								if (_simpleDataExtensionRegExp.test (_sourceFileName)) {
									_currentTargetFileName = _sourceFileName.replace (_simpleDataExtensionRegExp,'');
									if (_currentTargetFileName.indexOf ('.') == -1)
										_currentTargetFileName = null
									;
								}
								return _currentTargetFileName;
							},
							fileBuilder:function (_sourceFileName,_sourceFileText) {
								var _pageData = _Uize_Data_Simple_parse ({simple:_sourceFileText,collapseChildren:true});
								return {
									outputText:
										Uize.Wsh.BuildUtils.compileJstFile (
											_pageData.templatePath
												? Uize.Url.toAbsolute (_currentFolderPath + '\\',_pageData.templatePath)
												: _currentFolderPath + '\\' + _currentTargetFileName + '.jst'
										) (_pageData)
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

