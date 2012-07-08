/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:[
		'Uize.Wsh',
		'Uize.Build.Util',
		'Uize.Build.AutoScruncher',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Data.Simple',
		'UizeDotCom.BuildUtils'
	],
	builder:function () {
		/*** Utility Functions ***/
			function _getFirstTitleSegment (_title) {return _title.match (/^\s*(.*?)\s*\|/) [1]}

		/*** General Variables ***/
			var
				_sacredEmptyObject = {},
				_sacredEmptyArray = []
			;

		/*** build up data records for table ***/
			var
				_moduleReferenceFiles = Uize.Build.Util.getHtmlFilesInfo ('reference',_getFirstTitleSegment),
				_examplesByKeyword = UizeDotCom.BuildUtils.getExamplesByKeyword (),
				_modules = []
			;
			for (
				var _moduleReferenceFileNo = -1, _moduleReferenceFilesLength = _moduleReferenceFiles.length;
				++_moduleReferenceFileNo < _moduleReferenceFilesLength;
			) {
				var
					_moduleReferenceFile = _moduleReferenceFiles [_moduleReferenceFileNo],
					_moduleName = _moduleReferenceFile.title,
					_moduleInfo = {
						name:_moduleName,
						description:_moduleReferenceFile.description,
						examples:(_examplesByKeyword [_moduleName] || _sacredEmptyArray).length
					}
				;
				if (
					(_moduleName == 'Uize' || Uize.String.startsWith (_moduleName,'Uize.')) &&
					!Uize.String.startsWith (_moduleName,'Uize.Test.')
				) {
					/*** determine number of direct and nested submodules ***/
						var
							_directSubmodules = 0,
							_nestedSubmodules = 0,
							_moduleNamePlusDot = _moduleName + '.',
							_moduleNamePlusDotLength = _moduleNamePlusDot.length
						;
						for (var _submoduleNo = _moduleReferenceFileNo; ++_submoduleNo < _moduleReferenceFilesLength;) {
							var _submoduleName = _moduleReferenceFiles [_submoduleNo].title;
							if (Uize.String.startsWith (_submoduleName,_moduleNamePlusDot)) {
								_nestedSubmodules++;
								_submoduleName.indexOf ('.',_moduleNamePlusDotLength) == -1 && _directSubmodules++;
							}
						}
						_moduleInfo.directSubmodules = _directSubmodules;
						_moduleInfo.nestedSubmodules = _nestedSubmodules;

					/*** extract module meta data from module source ***/
						var
							_sourceFileText = Uize.Wsh.readFile (env.moduleFolderPath + '\\' + _moduleName + '.js'),
							_metaDataCommentRegExp = /\/\*\s*Module\s*Meta\s*Data/i,
							_metaDataCommentStartPos = _sourceFileText.search (_metaDataCommentRegExp),
							_metaDataCommentEndPos = _sourceFileText.indexOf ('*/',_metaDataCommentStartPos),
							_metaDataText = _metaDataCommentStartPos > -1
								?
									_sourceFileText.slice (_metaDataCommentStartPos,_metaDataCommentEndPos)
										.replace (_metaDataCommentRegExp,'')
								: '',
							_metaData = _metaDataText
								?
									Uize.Data.Simple.parse ({
										simple:Uize.String.Lines.normalizeIndent (_metaDataText),
										collapseChildren:true
									})
								: _sacredEmptyObject
						;
						_moduleInfo.type = _metaData.type || 'Unknown';
						_moduleInfo.importance = +_metaData.importance || 0;
						_moduleInfo.codeCompleteness = +_metaData.codeCompleteness || 0;
						_moduleInfo.docCompleteness = +_metaData.docCompleteness || 0;
						_moduleInfo.testCompleteness = +_metaData.testCompleteness || 0;
						_moduleInfo.keywords = _metaData.keywords || '';

					/*** information derived from loading source and scrunched file text ***/
						_moduleInfo.sourceFileSize = _sourceFileText.length;
						_moduleInfo.scrunchedFileSize =
							Uize.Wsh.readFile (
								Uize.Build.AutoScruncher.getScrunchedFolderPath (
									Uize.Wsh.getScriptFolderPath () + '\\' + env.moduleFolderPath,
									env.buildFolderPath,
									env.sourceFolderName
								) + '\\' + _moduleName + '.js'
							).length
						;

					_modules.push (_moduleInfo);
				}
			}

		/*** process JavaScript template with modules data ***/
			Uize.Build.Util.processJstFile ('appendixes\\sotu.html.jst',{modules:_modules});

		/*
			TO DO:
				- nice-to-haves
					- number of modules that require this module (ie. how shared is this module throughout framework, or is it more isolated)
					- total number of modules (directly and indirectly) required by this module
					- total scrunched size of all modules (directly and indirectly) required by this module
					- creation date
					- developers
		*/
	}
});

