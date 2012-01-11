/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Source Code Pages Build Script
|   /    / /    |    AUTHOR : Chris van Rensburg (http://www.tomkidding.com)
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 Chris van Rensburg
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*
	DESCRIPTION
		A script for WSH that builds HTML source code pages for all the JavaScript modules.
*/

/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:[
		'Uize.Wsh',
		'Uize.Wsh.BuildUtils',
		'Uize.Template'
	],
	builder:function () {
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
			alwaysBuild:env.alwaysBuild,
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
					!(_docTemplate = Uize.Wsh.BuildUtils.compileJstFile (_targetFolderPath + '\\' + _docTemplateFileName))
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
	}
});

