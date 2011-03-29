/*** boilerplate setup code for WSH build scripts ***/
	var
		_fileSystemObject = new ActiveXObject ('Scripting.FileSystemObject'),
		_currentDirectory = _fileSystemObject.GetParentFolderName(_fileSystemObject.GetFile(WScript.ScriptFullName)) + '\\',
		_setupFile = _fileSystemObject.OpenTextFile (
			_currentDirectory + '_build-script-setup.js',
			1
		)
	;
	eval (_setupFile.ReadAll ()) ({pathToRoot:_currentDirectory});
	_setupFile.Close ();

Uize.module ({
	required:[
		'Uize.Wsh',
		'Uize.Doc.Sucker',
		'Uize.Doc.Simple',
		'Uize.Templates.SimpleDoc'
	],
	builder:function () {
		if (WScript.Arguments.length && _fileSystemObject.FileExists(WScript.Arguments(0))) {
			var
				_fileExtensionRegExp = /\.[a-z]+$/i,
				_file = _fileSystemObject.GetFile(WScript.Arguments(0)),
				_fileName = _file.Name,
				_fileNameSansExtension = _fileName.replace (_fileExtensionRegExp,''),
				_fileIsJsFile = !/\.simple$/i.test (_fileName),
				_tempFilePath = _fileSystemObject.GetParentFolderName(_file) + '\\' + _fileSystemObject.GetTempName() + '.html',
				_tempFileLastModifiedTime = +new Date
			;

			WScript.Echo('Watching: ' + _fileName);

			function _updateSimpleDocPreview() {
				Uize.module ({
					required:_fileIsJsFile ? _fileNameSansExtension : '',
					builder:function () {
						var
							_fileText = Uize.Wsh.readFile ({path:_file}),
							_simpleDoc = _fileIsJsFile
								? Uize.Doc.Sucker.toDocument (_fileText,{result:'full',module:eval (_fileNameSansExtension)})
								: Uize.Doc.Simple.toDocument (_fileText,{result:'full'})
						;
						Uize.Wsh.writeFile({
							path:_tempFilePath,
							text:Uize.Templates.SimpleDoc.process({
								body:_simpleDoc.html,
								title:_simpleDoc.metaData.title || _fileNameSansExtension
							})
						});
						_tempFileLastModifiedTime = +new Date;
					}
				});
			}

			var
				_globalScope = (function() { return this })(),
				_browser = WScript.CreateObject('InternetExplorer.Application.1', 'TestSimpleDoc')
				// http://msdn.microsoft.com/en-us/library/aa752084(v=vs.85).aspx
			;

			_globalScope.TestSimpleDocOnQuit = function() {
				_fileSystemObject.DeleteFile(_tempFilePath);
				WScript.Quit(0);
			};

			_updateSimpleDocPreview();

			_browser.visible = true;
			_browser.menuBar = _browser.statusBar = _browser.toolBar = false;
			_browser.navigate(_tempFilePath);	// go to the file

			/*** focus and position the window ***/
				var _window = _browser.document.parentWindow;
				_window.moveTo ((_window.screen.width - 880) >> 1,0);
				_window.resizeTo (880,_window.screen.height);
				_window.focus ();

			while (true) {
				WScript.Sleep(1000);	// polling time

				if (+_file.DateLastModified > _tempFileLastModifiedTime) {
					_updateSimpleDocPreview();
					_browser.refresh2(3);	// force refresh
				}
			}
		}
	}
});

