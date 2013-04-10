/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.TempGeneratedNamespaceModules Package
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
		The =Uize.Build.FileBuilders.TempGeneratedNamespaceModules= module defines a file builder for JavaScript namespace modules generated from folders and for which there are not explicit JavaScript modules.
		
		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.TempGeneratedNamespaceModules',
	required:'Uize.Build.Util',
	builder:function () {
		var _jsExtensionRegExp = /\.js$/;
		return {
			description:'Generated JavaScript namespace modules under temp',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_pathname) &&
					this.fileSystem.folderExists ({
						path:this.sourceUrlFromTempUrl (_pathname).replace (_jsExtensionRegExp,'')
					})
				);
			},
			builderInputs:function (_urlParts) {
				return {sourceFolderPath:this.sourceUrlFromTempUrl (_urlParts.pathname).replace (_jsExtensionRegExp,'')};
			},
			builder:function (_inputs) {
				return Uize.Build.Util.moduleAsText ({
					name:this.moduleNameFromSubPath (
						_inputs.sourceFolderPath.slice (this.params.moduleFolderPath.length + 1)
					)
				});
			}
		};
	}
});

