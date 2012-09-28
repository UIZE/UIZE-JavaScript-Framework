/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Build.Util= package provides various utility methods to facilitate building of pages for a Web site project.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Build.Util= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Build.Util',
	required:[
		'Uize.Wsh',
		'Uize.Url',
		'Uize.Template',
		'Uize.Data.Simple',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Json',
		'Uize.Array.Sort'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var _compiledJstFilesByPath = {};

		/*** Public Static Methods ***/
			_package.getHtmlFilesInfo = function (_folderToIndex,_titleExtractor) {
				var _files = [];
				if (!_titleExtractor) _titleExtractor = Uize.returnX;

				for (
					var
						_fileNo = -1,
						_filesToIndex = Uize.Wsh.getFiles (_folderToIndex),
						_filesToIndexLength = _filesToIndex.length
					;
					++_fileNo < _filesToIndexLength;
				) {
					var
						_filePath = _filesToIndex [_fileNo],
						_fileName = Uize.Url.from (_filePath).file
					;
					if (/\.html$/i.test (_fileName) && _fileName.charAt (0) != '~') {
						var
							_fileText = Uize.Wsh.readFile (_filePath),
							_keywordsMatch = _fileText.match (/<meta name="keywords" content="(.*?)"\/>/),
							_descriptionMatch = _fileText.match (/<meta name="description" content="(.*?)"\/>/),
							_imageSrcMatch = _fileText.match (/<link rel="image_src" href="(.*?)"\/>/)
						;
						_files.push ({
							path:_folderToIndex + '/' + _fileName,
							title:_titleExtractor (_fileText.match (/<title>(.*?)<\/title>/) [1]),
							keywords:_keywordsMatch ? _keywordsMatch [1] : '',
							description:_descriptionMatch ? _descriptionMatch [1] : '',
							imageSrc:_imageSrcMatch ? Uize.Url.toAbsolute (_folderToIndex,_imageSrcMatch [1]) : ''
						});
					}
				}

				/*** sort files in case-insensitive ASCIIbetical order ***/
					Uize.Array.Sort.sortBy (_files,'value.title.toLowerCase ()');

				return _files;
			};

			_package.readSimpleDataFile = function (_simpleDataFilePath) {
				return Uize.Data.Simple.parse ({simple:Uize.Wsh.readFile (_simpleDataFilePath),collapseChildren:true});
			};

			_package.compileJstFile = function (_jstTemplatePath) {
				var _template = _compiledJstFilesByPath [_jstTemplatePath];
				if (!_template) {
					if (!Uize.Wsh.fileExists (_jstTemplatePath)) return;
					_template = _compiledJstFilesByPath [_jstTemplatePath] = Uize.Template.compile (
						Uize.Wsh.readFile (_jstTemplatePath),
						{result:'full'}
					);
					Uize.module ({required:_template.required});
				}
				return _template.templateFunction;
			};

			_package.processJstFile = function (_jstTemplatePath,_input) {
				var _template = _package.compileJstFile (_jstTemplatePath);
				_template && Uize.Wsh.writeFile ({path:_jstTemplatePath.replace (/\.jst$/,''),text:_template (_input)});
			};

			_package.runScripts = function (_scripts) {
				var _error;
				if (!Uize.isArray (_scripts)) _scripts = [_scripts];
				for (
					var
						_scriptNo = -1,
						_scriptsLength = _scripts.length,
						_wshShell = new ActiveXObject ('WScript.Shell'),
						_errorCode
					;
					++_scriptNo < _scriptsLength && !_error;
				)
					if (_errorCode = _wshShell.Run ('WScript ' + _scripts [_scriptNo],0,true))
						_error = {
							script:_scripts [_scriptNo],
							errorCode:_errorCode
						}
				;
				return _error;
			};

			_package.runUnitTests = function (_unitTestsClass,_silent) {
				function _runUnitTests (_unitTestsClass) {
					var
						_unitTests = new _unitTestsClass,
						_logChunks = []
					;
					_unitTests.wire ({
						Start:
							function (_event) {
								_logChunks.push (
									Uize.String.repeat ('\t',_event.source.getDepth ()) + _event.source.get ('title')
								);
							},
						Done:
							function (_event) {
								var
									_test = _event.source,
									_reasonForFailure = _test.get ('reasonForFailure')
								;
								/*** add to log ***/
									_logChunks.push (
										Uize.String.repeat ('\t',_test.getDepth () + 1) +
										(
											_test.get ('result')
												? ('PASSED!!! (duration: ' + _test.get ('duration') + 'ms)')
												: ('*** FAILED *** ' + (_reasonForFailure || ''))
										)
									);
									_reasonForFailure && _logChunks.push ('','',_test.getSynopsis ());

								/*** finish up if the test fails or if unit tests complete ***/
									if (_test == _unitTests || !_test.get ('result')) {
										_silent || alert (_test.getSynopsis ());
										Uize.Wsh.writeFile ({
											path:WScript.ScriptName.replace (/\.js$/,'.log'),
											text:_logChunks.join ('\n')
										});
										_test.get ('result') || WScript.Quit (1);
									}
							}
					});
					_unitTests.run ();
				}
				typeof _unitTestsClass == 'string'
					? Uize.require (_unitTestsClass,_runUnitTests)
					: _runUnitTests (_unitTestsClass)
				;
			};

			_package.writeDataModule = function (_moduleFolderPath,_moduleName,_moduleData) {
				Uize.Wsh.writeFile ({
					path:_moduleFolderPath + '\\' + _moduleName + '.js',
					text:
						'Uize.module ({\n' +
							'\tname:\'' + _moduleName + '\',\n' +
							'\tbuilder:function () {\n' +
								'\t\treturn function () {\n' +
								'\t\t\treturn ' + Uize.String.Lines.indent (Uize.Json.to (_moduleData),3,'\t',false) + ';\n' +
								'\t\t};\n' +
							'\t}\n' +
						'});\n'
				});
			};

		return _package;
	}
});

