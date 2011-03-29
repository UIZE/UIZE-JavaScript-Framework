/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Wsh.NeatenJsFiles Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Wsh.NeatenJsFiles= package provides a way to recurse folder structures and neaten all JavaScript (.js) files by removing unnecessary trailing whitespace.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Wsh.NeatenJsFiles= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Wsh.NeatenJsFiles',
	required:[
		'Uize.String.Lines',
		'Uize.Wsh.AutoScruncher'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				Uize.Wsh.buildFiles (
					Uize.copyInto (
						{
							targetFolderPathCreator:function (_folderPath) {
								return (
									Uize.Wsh.AutoScruncher.getScrunchedFolderPath (
										_folderPath,
										_params.buildFolderPath,
										_params.sourceFolderName
									) &&
									_folderPath
								);
							},
							targetFilenameCreator:function (_sourceFileName) {
								return /\.js$/.test (_sourceFileName) ? _sourceFileName : null;
							},
							fileBuilder:function (_sourceFileName,_sourceFileText) {
								var _neatenedSourceFileText = Uize.String.Lines.trimRight (_sourceFileText);
								return (
									_neatenedSourceFileText != _sourceFileText
										? {
											outputText:_neatenedSourceFileText,
											logDetails:
												'\t\tTrailing Whitespace Characters Removed: ' +
													(_sourceFileText.length - _neatenedSourceFileText.length) + '\n'
										}
										: {logDetails:'\t\tFILE ALREADY OK\n'}
								);
							}
						},
						_params,
						{alwaysBuild:true}
					)
				);
			};

		return _package;
	}
});

