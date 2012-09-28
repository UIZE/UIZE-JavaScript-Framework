/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildPagesFromSourceCode Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 1
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.BuildPagesFromSourceCode= package provides a method for building HTML pages for viewing the source code of the UIZE JavaScript modules on the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.BuildPagesFromSourceCode',
	required:[
		'Uize.Wsh',
		'Uize.Build.Util',
		'Uize.Template'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_sourceCodeFolderName = '\\source-code',
					_docTemplateFileName = '~SOURCE-CODE-TEMPLATE.html',
					_sourceCodeType,
					_docTemplate,
					_dotJsRegExp = /\.js$/i
				;
				function _getTitleFromFilename (_filename) {
					return Uize.capFirstChar (_filename.match (/(.*)\.[^\.]*$/) [1].replace (/-/g,' '));
				}

				Uize.Wsh.buildFiles ({
					alwaysBuild:_params.alwaysBuild,
					targetFolderPathCreator:function (_folderPath) {
						var _targetFolderPath = null;
						if (/js\\~source$/.test (_folderPath)) {
							_sourceCodeType = 'module';
							_targetFolderPath = 'reference' + _sourceCodeFolderName;
						} else if (/examples$/.test (_folderPath)) {
							_sourceCodeType = 'exampleOrTool';
							_targetFolderPath = _folderPath + _sourceCodeFolderName;
						}
						if (
							_targetFolderPath &&
							!(_docTemplate = Uize.Build.Util.compileJstFile (_targetFolderPath + '\\' + _docTemplateFileName))
						)
							_targetFolderPath = null
						;
						return _targetFolderPath;
					},
					targetFilenameCreator:function (_sourceFileName) {
						return (
							_sourceCodeType == 'module'
								? (_dotJsRegExp.test (_sourceFileName) ? _sourceFileName.replace (_dotJsRegExp,'.html') : null)
								: (
									/\.html$/i.test (_sourceFileName) && _sourceFileName.charAt (0) != '~'
										/* NOTE: don't build source code pages for experimental examples prefixed with "~" */
										? _sourceFileName
										: null
								)
						);
					},
					fileBuilder:function (_sourceFileName,_sourceFileText) {
						return {
							outputText:_docTemplate ({
								sourceFilename:_sourceFileName,
								title:_sourceCodeType == 'module'
									? _getTitleFromFilename (_sourceFileName)
									: _sourceFileText.match (/<title>(.+?)\s*\|\s*JavaScript\s+(?:Tools|Examples)\s*(\|.*?)?<\/title>/) [1],
								body:_sourceFileText
							})
						};
					}
				});
			};

		return _package;
	}
});

