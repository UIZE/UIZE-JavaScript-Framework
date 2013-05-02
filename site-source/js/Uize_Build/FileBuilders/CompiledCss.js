/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledCss Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.CompiledCss= module defines a file builder for CSS files compiled from =.css.source= files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledCss',
	required:[
		'Uize.Url',
		'Uize.Build.Util'
	],
	builder:function () {
		return {
			description:'Compiled CSS files, generated from .css.source files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'css' &&
					this.isBuiltUrl (_pathname) &&
					this.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + '.source'})
				);
			},
			builderInputs:function (_urlParts) {
				return {cssSource:this.sourceUrlFromBuiltUrl (_urlParts.pathname) + '.source'};
			},
			builder:function (_inputs) {
				var
					_cssSource = _inputs.cssSource,
					_params = this.params,
					_cssClassPrefix = Uize.Build.Util.moduleNameFromModulePath (
						_cssSource.slice ((_params.sourcePath + '/' + _params.modulesFolder + '/').length),
						true
					).replace (/\./g,'_')
				;
				return this.readFile ({path:_cssSource}).replace (
					/`([^`]*)`/g,
					function (_match,_cssClass) {
						return _cssClassPrefix + (_cssClass && '-') + _cssClass;
					}
				);
			}
		};
	}
});

