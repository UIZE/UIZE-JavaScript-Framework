/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledJstModules Package
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
		The =Uize.Build.FileBuilders.CompiledJstModules= module defines a file builder for JST modules compiled from =.js.jst= files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledJstModules',
	required:[
		'Uize.Template.Module',
		'Uize.Url'
	],
	builder:function () {
		var _jsJstRegExp = /\.js\.jst$/i;

		return {
			description:'Compiled JST modules, generated from .js.jst files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_pathname) &&
					this.fileExists ({path:this.sourceUrlFromTempUrl (_pathname) + '.jst'})
				);
			},
			builderInputs:function (_urlParts) {
				return {jstSource:this.sourceUrlFromTempUrl (_urlParts.pathname) + '.jst'};
			},
			builder:function (_inputs) {
				var _jstSource = _inputs.jstSource;
				return Uize.Template.Module.buildTemplateModuleText (
					Uize.Url.from (_jstSource).file.replace (_jsJstRegExp,''),
					this.readFile ({path:_jstSource})
				);
			}
		};
	}
});

