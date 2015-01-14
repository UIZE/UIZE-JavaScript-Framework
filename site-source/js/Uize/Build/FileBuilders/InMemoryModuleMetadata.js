/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryModuleMetadata Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.InMemoryModuleMetadata= module defines a file builder for the in-memory metadata object for each JavaScript module.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryModuleMetadata',
	required:[
		'Uize.Util.ModuleNaming',
		'Uize.Data.Simple',
		'Uize.Str.Lines'
	],
	builder:function () {
		'use strict';

		var
			_moduleMetaDataExtensionRegExp = /\.js\.metadata$/,
			_metaDataCommentRegExp = /\/\*\s*Module\s*Meta\s*Data/i
		;

		return Uize.package ({
			description:'In-memory module metadata object',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return this.isMemoryUrl (_pathname) && _moduleMetaDataExtensionRegExp.test (_pathname);
			},
			builderInputs:function (_urlParts) {
				var
					m = this,
					_inputs = {
						jsModule:
							m.tempUrlFromMemoryUrl (_urlParts.pathname.replace (_moduleMetaDataExtensionRegExp,'.js'))
					},
					_testModulePath =
						m.params.modulesFolder + '/' +
						Uize.Util.ModuleNaming.getTestModuleName (_urlParts.file.replace (_moduleMetaDataExtensionRegExp,'')) +
						'.js'
				;
				if (m.fileExists ({path:m.sourceUrl (_testModulePath)}))
					_inputs.testModuleMetaData = m.memoryUrl (_testModulePath + '.metadata')
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
					_metaData = Uize.copyInto (
						{
							type:'Unknown',
							importance:0,
							codeCompleteness:100,
							docCompleteness:100,
							testCompleteness:100
						},
						_metaDataText
							?
								Uize.Data.Simple.parse ({
									simple:Uize.Str.Lines.normalizeIndent (_metaDataText),
									collapseChildren:true
								})
							: null
					),
					_testModuleMetaData = _inputs.testModuleMetaData
				;
				if (_testModuleMetaData)
					_metaData.testCompleteness = +this.readFile ({path:_testModuleMetaData}).codeCompleteness || 0
				;
				return _metaData;
			}
		});
	}
});

