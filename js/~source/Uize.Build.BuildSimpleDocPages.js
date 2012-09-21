/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.BuildSimpleDocPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Build.BuildSimpleDocPages= package provides a method to build all the SimpleDoc documentation for a Web site built with the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Build.BuildSimpleDocPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Build.BuildSimpleDocPages',
	required:[
		'Uize.Wsh',
		'Uize.Build.Util',
		'Uize.Data.PathsTree',
		'Uize.Doc.Simple',
		'Uize.Doc.Sucker',
		'Uize.String',
		'Uize.Url'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_urlDictionary = _params.urlDictionary,
					_examplesByKeyword = _params.examplesByKeyword,
					_alwaysBuild = env.alwaysBuild,
					_simpleDocTemplateFileName = '~SIMPLE-DOC-TEMPLATE.html.jst',
					_simpleDocTemplatePath,
					_simpleDocTemplate,
					_scriptFolderPath = Uize.Wsh.getScriptFolderPath (),
					_scriptFolderPathLengthPlusOne = _scriptFolderPath.length + 1,
					_pathToRoot,
					_moduleReferenceFolderName = 'reference',
					_dotSimpleRegExp = /\.simple$/i,
					_dotJsRegExp = /\.js$/i
				;
				/*** utility functions ***/
					function _getFilenameFromPath (_filePath) {
						return Uize.Url.from (_filePath).fileName;
					}

					function _getTitleFromFilename (_filename) {
						return _filename.match (/(.*)\.[^\.]*$/) [1].replace (/-/g,' ');
					}

				function _getSimpleDocFileBuilder (_docBuilderFunction) {
					return function (_sourceFileName,_sourceFileText) {
						if (!_simpleDocTemplate) {
							/*** compile the template ***/
								_simpleDocTemplate = Uize.Build.Util.compileJstFile (_simpleDocTemplatePath);

							/*** determine path to root from current folder ***/
								var _simpleDocTemplatePathSansRoot = _simpleDocTemplatePath.slice (_scriptFolderPathLengthPlusOne);
								_pathToRoot = Uize.String.repeat (
									'../',
									_simpleDocTemplatePathSansRoot.length -
									_simpleDocTemplatePathSansRoot.replace (/[\/\\]/g,'').length
								);
						}
						var _buildResult = _docBuilderFunction (_sourceFileText);
						if (_buildResult) {
							var
								_contentsTreeItems = _buildResult.contentsTreeItems,
								_contentsTreeItem0 = _contentsTreeItems [0]
							;
							return {
								outputText:_simpleDocTemplate ({
									title:
										_buildResult.metaData.title ||
										_getTitleFromFilename (_sourceFileName)
											.replace (/(^|\s)[a-z]/g,function (_match) {return _match.toUpperCase ()}),
									description:
										(
											_contentsTreeItem0 &&
											(_contentsTreeItem0.description || (_contentsTreeItem0.items [0] || {}).description)
										) || '',
									body:_buildResult.html
								})
							};
						} else {
							return {};
						}
					}
				}

				/*** find all .simple files and generate HTML files ***/
					Uize.Wsh.buildFiles ({
						alwaysBuild:_alwaysBuild,
						targetFolderPathCreator:function (_folderPath) {
							var _targetFolderPath =
								Uize.Wsh.fileExists (_simpleDocTemplatePath = _folderPath + '\\' + _simpleDocTemplateFileName)
									? _folderPath
									: null
							;
							if (_targetFolderPath) _simpleDocTemplate = null;
							return _targetFolderPath;
						},
						targetFilenameCreator:function (_sourceFileName) {
							return (
								_dotSimpleRegExp.test (_sourceFileName)
									? _sourceFileName.replace (_dotSimpleRegExp,'.html')
									: null
							);
						},
						fileBuilder:_getSimpleDocFileBuilder (
							function (_simpleDoc) {
								return Uize.Doc.Simple.build ({
									data:_simpleDoc,
									urlDictionary:_urlDictionary,
									pathToRoot:_pathToRoot,
									result:'full'
								})
							}
						)
					});

				/*** extract SIMPLE doc from JavaScript modules ***/
					var
						_moduleFolderPath = '\\' + env.moduleFolderPath,
						_moduleFolderPathLength = _moduleFolderPath.length,
						_moduleName,
						_modulesTree = Uize.Data.PathsTree.fromList (
							Uize.Wsh.getFiles (env.moduleFolderPath,_dotJsRegExp,_getFilenameFromPath)
						)
					;

					Uize.Wsh.buildFiles ({
						alwaysBuild:_alwaysBuild,
						logFileName:
							_params.logFileName
								? _params.logFileName.replace ('.','-in-js-modules.')
								: '_build-pages-from-simple-doc-in-js-modules.log',
						targetFolderPathCreator:function (_folderPath) {
							var _targetFolderPath = _folderPath.slice (-_moduleFolderPathLength) == _moduleFolderPath
								? _scriptFolderPath + '\\' + _moduleReferenceFolderName
								: null
							;
							if (_targetFolderPath)
								Uize.Wsh.fileExists (_simpleDocTemplatePath = _targetFolderPath + '\\' + _simpleDocTemplateFileName)
									? (_simpleDocTemplate = null)
									: (_targetFolderPath = null)
								;
							;
							return _targetFolderPath;
						},
						targetFilenameCreator:function (_sourceFileName) {
							var _targetFilename = _dotJsRegExp.test (_sourceFileName)
								? _sourceFileName.replace (_dotJsRegExp,'.html')
								: null
							;
							if (_targetFilename)
								_moduleName = _getTitleFromFilename (_sourceFileName)
							;
							return _targetFilename;
						},
						fileBuilder:_getSimpleDocFileBuilder (
							function (_sourceJs) {
								/* NOTE:
									We temporarily remove from the URL dictionary the entry for the module whose doc is being built, so that auto-linking of formatted text doesn't link the highlighted name of this module in the document to the same document. Then, after building the document, we restore the entry in the URL dictionary.
								*/
								var _result;
								Uize.module ({
									required:_moduleName,
									builder:function () {
										var _moduleUrlFromDictionary = _urlDictionary [_moduleName];
										_urlDictionary [_moduleName] = null;
										_result = Uize.Doc.Sucker.toDocument (
											_sourceJs,
											{
												urlDictionary:_urlDictionary,
												pathToRoot:_pathToRoot,
												result:'full',
												module:eval (_moduleName),
												modulesTree:_modulesTree,
												examples:_examplesByKeyword [_moduleName]
											}
										);
										_urlDictionary [_moduleName] = _moduleUrlFromDictionary;
									}
								});
								return _result;
							}
						)
					});
			};

		return _package;
	}
});

