/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.NeatenJsFiles Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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

		The =Uize.Build.NeatenJsFiles= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Build.NeatenJsFiles',
	required:[
		'Uize.Build.Util',
		'Uize.String.Lines',
		'Uize.Build.AutoScruncher'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				Uize.Build.Util.buildFiles (
					Uize.copyInto (
						{
							targetFolderPathCreator:function (_folderPath) {
								return _folderPath;
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

