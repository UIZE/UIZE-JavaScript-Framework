/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.BuiltModules Package
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
		The =Uize.Build.FileBuilders.BuiltModules= module defines a file builder for the built versions (scrunched, if so configured) of the JavaScript modules of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.BuiltModules',
	builder:function () {
		var _dotJsRegExp = /\.js$/;

		return Uize.package ({
			description:'Built JavaScript modules',
			urlMatcher:function (_urlParts) {
				return _urlParts.fileType == 'js' && this.isBuiltUrl (_urlParts.folderPath);
			},
			builderInputs:function (_urlParts) {
				var _jsTemp = this.tempUrlFromBuiltUrl (_urlParts.pathname);
				return {jsModule:this.params.isDev ? _jsTemp : _jsTemp.replace (_dotJsRegExp,'.min.js')};
			}
		});
	}
});

