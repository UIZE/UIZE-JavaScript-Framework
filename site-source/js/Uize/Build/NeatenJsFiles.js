/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.NeatenJsFiles Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.NeatenJsFiles= package provides a way to recurse folder structures and neaten all JavaScript (.js) files by removing unnecessary trailing whitespace.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.NeatenJsFiles',
	required:[
		'Uize.Build.Util',
		'Uize.Str.Lines'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				Uize.Build.Util.buildFiles ({
					targetFolderPathCreator:function (_folderPath) {
						return _folderPath;
					},
					targetFilenameCreator:function (_sourceFileName) {
						return /\.js$/.test (_sourceFileName) ? _sourceFileName : null;
					},
					fileBuilder:function (_sourceFileName,_sourceFileText) {
						var _neatenedSourceFileText = Uize.Str.Lines.trimRight (_sourceFileText);
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
					},
					alwaysBuild:true,
					rootFolderPath:_params.sourcePath,
					logFilePath:_params.logFilePath
				});
			}
		});
	}
});

