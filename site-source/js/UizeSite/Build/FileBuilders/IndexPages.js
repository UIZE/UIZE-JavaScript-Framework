/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.IndexPages Package
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
		The =UizeSite.Build.FileBuilders.IndexPages= module defines a file builder for various index pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.IndexPages',
	required:[
		'UizeSite.Build.Util',
		'Uize.Array.Sort'
	],
	builder:function () {
		function _getInMemoryHtmlFilesIndexHandler (
			_indexableFolderUnderSource,
			_indexableFolderUnderBuilt,
			_indexableFileExtensionRegExp,
			_sortOrder
		) {
			return Uize.package ({
				description:'In-memory HTML files index for the ' + _indexableFolderUnderBuilt + ' folder',
				urlMatcher:function (_urlParts) {
					return _urlParts.pathname == this.memoryUrl (_indexableFolderUnderBuilt + '.index');
				},
				builderInputs:function (_urlParts) {
					var _this = this;
					return Uize.map (
						Uize.isFunction (_indexableFolderUnderSource)
							? _indexableFolderUnderSource.call (_this)
							: UizeSite.Build.Util.getIndexableFiles (
								_this.params.sourcePath,_indexableFolderUnderSource,_indexableFileExtensionRegExp
							)
						,
						function (_filePath) {
							return _this.memoryUrl (
								_indexableFolderUnderBuilt + '/' +
								(
									_indexableFileExtensionRegExp
										? _filePath.replace (_indexableFileExtensionRegExp,'')
										: _filePath
								) +
								'.html.info'
							);
						}
					);
				},
				builder:function (_inputs) {
					var _this = this;
					return Uize.Array.Sort.sortBy (
						Uize.map (_inputs,function (_fileInfoPath) {return _this.readFile ({path:_fileInfoPath})}),
						'value.title',
						_sortOrder
					);
				}
			});
		};

		return Uize.package ({
			getInMemoryHtmlFilesIndexHandler:_getInMemoryHtmlFilesIndexHandler,

			getIndexPageUrlHandler:function (
				_description,
				_indexPageFileName,
				_indexableFolderUnderSource,
				_indexableFolderUnderBuilt,
				_indexableFileExtensionRegExp
			) {
				return [
					_getInMemoryHtmlFilesIndexHandler (
						_indexableFolderUnderSource,_indexableFolderUnderBuilt,_indexableFileExtensionRegExp
					),
					{
						description:_description,
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.builtUrl (_indexPageFileName + '.html');
						},
						builderInputs:function (_urlParts) {
							return {
								template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
								filesIndex:this.memoryUrl (_indexableFolderUnderBuilt + '.index')
							};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.template}) ({files:this.readFile ({path:_inputs.filesIndex})});
						}
					}
				];
			}
		});
	}
});

