/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.TempJsModules Package
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
		The =Uize.Build.FileBuilders.TempJsModules= module defines a file builder for regular JavaScript modules in the site temp folder.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.TempJsModules',
	required:'Uize.Build.Util',
	builder:function () {
		function _sourceUrlFromTempUrl (_this,_urlParts) {
			return (
				_urlParts.file.slice (0,5) == 'Uize.'
					? _this.params.uizePath + '/js/' + _urlParts.file
					: _this.sourceUrlFromTempUrl (_urlParts.pathname)
			);
		}

		return {
			description:'Regular JavaScript modules under temp',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_urlParts.pathname) &&
					this.fileExists ({path:_sourceUrlFromTempUrl (this,_urlParts)})
				);
			},
			builderInputs:function (_urlParts) {
				return {sourceJs:_sourceUrlFromTempUrl (this,_urlParts)};
			}
		};
	}
});

