/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledJstModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2014 UIZE
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
		'Uize.Build.Util'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
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
				return {source:this.sourceUrlFromTempUrl (_urlParts.pathname) + '.jst'};
			},
			builder:function (_inputs,_urlParts) {
				var _params = this.params;
				return Uize.Template.Module.buildTemplateModuleText (
					Uize.Build.Util.moduleNameFromModulePath (
						_urlParts.pathname.slice ((_params.tempPath + '/' + _params.modulesFolder + '/').length),
						true
					),
					this.readFile ({path:_inputs.source})
				);
			}
		});
	}
});

