/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.SimpleDataHtmlPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
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
		The =Uize.Build.FileBuilders.SimpleDataHtmlPages= module defines a file builder for HTML pages derived from HTML SimpleData (=.html.simpledata=) files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.SimpleDataHtmlPages',
	required:'Uize.Url',
	builder:function () {
		var _htmlSimpledataFileExtensionRegExp = /\.html\.simpledata$/;
		return {
			description:'HTML Pages Derived from .html.simpledata Files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'html' &&
					this.isBuiltUrl (_pathname) &&
					this.fileSystem.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + '.simpledata'})
				);
			},
			builderInputs:function (_urlParts) {
				var _inMemorySimpleDataUrl = this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.simpledata';
				this.buildFile (
					Uize.copyInto ({},this.params,{url:_inMemorySimpleDataUrl,pathPrefix:''}),
					Uize.nop
				);
				var _simpleData = this.readFile ({path:_inMemorySimpleDataUrl});
				return {
					jstTemplate:Uize.Url.toAbsolute (_inMemorySimpleDataUrl,_simpleData.templatePath),
					simpledata:_inMemorySimpleDataUrl
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.jstTemplate}) (this.readFile ({path:_inputs.simpledata}));
			}
		};
	}
});

