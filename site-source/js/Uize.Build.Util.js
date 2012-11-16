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
*/

Uize.module ({
	name:'Uize.Build.Util',
	required:[
		'Uize.Url',
		'Uize.Template',
		'Uize.Data.Simple',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Json',
		'Uize.Array.Sort',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_compiledJstFilesByPath = {}
			;

		/*** Public Static Methods ***/
			_package.getHtmlFileInfo = function (_filePath,_titleExtractor) {
				var
					_fileText = _fileSystem.readFile ({path:_filePath}),
					_keywordsMatch = _fileText.match (/<meta name="keywords" content="(.*?)"\/>/),
					_descriptionMatch = _fileText.match (/<meta name="description" content="(.*?)"\/>/),
					_imageSrcMatch = _fileText.match (/<link rel="image_src" href="(.*?)"\/>/)
				;
				return {
					path:_filePath,
					title:_titleExtractor (_fileText.match (/<title>(.*?)<\/title>/) [1]),
					keywords:_keywordsMatch ? _keywordsMatch [1] : '',
					description:_descriptionMatch ? _descriptionMatch [1] : '',
					imageSrc:_imageSrcMatch ? Uize.Url.toAbsolute (_folderToIndex,_imageSrcMatch [1]) : ''
				};
			};

			_package.getHtmlFilesInfo = function (_folderToIndex,_titleExtractor) {
				if (!_titleExtractor) _titleExtractor = Uize.returnX;
				return Uize.Array.Sort.sortBy (
					Uize.map (
						_fileSystem.getFiles ({
							path:_folderToIndex,
							pathMatcher:function (_path) {
								var _urlParts = Uize.Url.from (_path);
								return _urlParts.fileType == 'html' && !Uize.String.startsWith (_urlParts.file,'~');
							}
						}),
						function (_path) {
							return _package.getHtmlFileInfo (
								_folderToIndex + '/' + Uize.Url.from (_path).file,
								_titleExtractor
							);
						}
					),
					'value.title.toLowerCase ()'
				);
			};

			_package.readSimpleDataFile = function (_simpleDataFilePath) {
				return Uize.Data.Simple.parse ({
					simple:_fileSystem.readFile ({path:_simpleDataFilePath}),
					collapseChildren:true
				});
			};

			_package.compileJstFile = function (_jstTemplatePath) {
				var _template = _compiledJstFilesByPath [_jstTemplatePath];
				if (!_template) {
					if (!_fileSystem.fileExists ({path:_jstTemplatePath})) return;
					_template = _compiledJstFilesByPath [_jstTemplatePath] = Uize.Template.compile (
						_fileSystem.readFile ({path:_jstTemplatePath}),
						{result:'full'}
					);
					Uize.require (_template.required);
				}
				return _template.templateFunction;
			};

			_package.processJstFile = function (_jstTemplatePath,_input) {
				var _template = _package.compileJstFile (_jstTemplatePath);
				_template &&
					_fileSystem.writeFile ({path:_jstTemplatePath.replace (/\.jst$/,''),contents:_template (_input)})
				;
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

			_package.runUnitTests = function (_unitTestsClass,_silent,_logFilePath) {
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
										_logFilePath &&
											_fileSystem.writeFile ({path:_logFilePath,contents:_logChunks.join ('\n')})
										;
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

			_package.dataAsModule = function (_moduleName,_moduleData) {
				return [
					'Uize.module ({',
					'	name:\'' + _moduleName + '\',',
					'	superclass:\'\',',
					'	builder:function () {',
					'		return function () {',
					'			return ' + Uize.String.Lines.indent (Uize.Json.to (_moduleData),3,'\t',false) + ';',
					'		};',
					'	}',
					'});'
				].join ('\n');
			};

			_package.writeDataModule = function (_moduleFolderPath,_moduleName,_moduleData) {
				_fileSystem.writeFile ({
					path:_moduleFolderPath + '/' + _moduleName + '.js',
					contents:_package.dataAsModule (_moduleName,_moduleData)
				});
			};

		return _package;
	}
});

