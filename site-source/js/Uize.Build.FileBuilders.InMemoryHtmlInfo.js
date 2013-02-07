/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryHtmlInfo Package
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
		The =Uize.Build.FileBuilders.InMemoryHtmlInfo= module defines a file builder for the in-memory HTML info objects for the built HTML pages of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryHtmlInfo',
	required:'Uize.Build.Util',
	builder:function () {
		var _htmlInfoExtensionRegExp = /\.html\.info$/;

		return {
			description:'In-memory HTML page info object',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return this.isMemoryUrl (_pathname) && _htmlInfoExtensionRegExp.test (_pathname);
			},
			builderInputs:function (_urlParts) {
				return {
					htmlFile:this.builtUrlFromMemoryUrl (_urlParts.pathname).replace (_htmlInfoExtensionRegExp,'.html')
				};
			},
			builder:function (_inputs) {
				var _info = Uize.Build.Util.getHtmlFileInfo (
					_inputs.htmlFile,
					function (_title) {return _title.match (/^\s*(.*?)\s*\|/) [1]}
				);
				_info.path = _info.path.slice (this.params.builtPath.length + 1);
				return _info;
			}
		};
	}
});

