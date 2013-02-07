/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryModuleMetadata Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.InMemoryModuleMetadata= module defines a file builder for the in-memory metadata object for each UIZE module.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryModuleMetadata',
	required:[
		'Uize.Build.Util',
		'Uize.Data.Simple',
		'Uize.String.Lines'
	],
	builder:function () {
		var
			_moduleMetaDataExtensionRegExp = /\.js\.metadata$/,
			_metaDataCommentRegExp = /\/\*\s*Module\s*Meta\s*Data/i
		;

		return {
			description:'In-memory module metadata object',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return this.isMemoryUrl (_pathname) && _moduleMetaDataExtensionRegExp.test (_pathname);
			},
			builderInputs:function (_urlParts) {
				var
					_this = this,
					_inputs = {
						jsModule:
							_this.tempUrlFromMemoryUrl (_urlParts.pathname.replace (_moduleMetaDataExtensionRegExp,'.js'))
					},
					_testModulePath =
						'js/' +
						Uize.Build.Util.getTestModuleName (_urlParts.file.replace (_moduleMetaDataExtensionRegExp,'')) +
						'.js'
				;
				if (_this.fileExists ({path:_this.sourceUrl (_testModulePath)}))
					_inputs.testModuleMetaData = _this.memoryUrl (_testModulePath + '.metadata')
				;
				return _inputs;
			},
			builder:function (_inputs) {
				var
					_moduleText = this.readFile ({path:_inputs.jsModule}),
					_metaDataCommentStartPos = _moduleText.search (_metaDataCommentRegExp),
					_metaDataCommentEndPos = _moduleText.indexOf ('*/',_metaDataCommentStartPos),
					_metaDataText = _metaDataCommentStartPos > -1
						?
							_moduleText.slice (_metaDataCommentStartPos,_metaDataCommentEndPos)
								.replace (_metaDataCommentRegExp,'')
						: '',
					_metaData = _metaDataText
						?
							Uize.Data.Simple.parse ({
								simple:Uize.String.Lines.normalizeIndent (_metaDataText),
								collapseChildren:true
							})
						: {},
					_testModuleMetaData = _inputs.testModuleMetaData
				;
				if (_testModuleMetaData)
					_metaData.testCompleteness = +this.readFile ({path:_testModuleMetaData}).codeCompleteness || 0
				;
				return _metaData;
			}
		};
	}
});

