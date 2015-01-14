/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledCss Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		The =Uize.Build.FileBuilders.CompiledCss= module defines a file builder for CSS files compiled from =.csst= files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledCss',
	required:[
		'Uize.Url',
		'Uize.Build.Util',
		'Uize.Template'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			description:'Compiled CSS files, generated from .csst files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'css' &&
					this.isBuiltUrl (_pathname) &&
					this.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + 't'})
				);
			},
			builderInputs:function (_urlParts) {
				return {cssSource:this.sourceUrlFromBuiltUrl (_urlParts.pathname) + 't'};
			},
			builder:function (_inputs,_urlParts) {
				var
					_params = this.params,
					_cssClassPrefix = Uize.Build.Util.moduleNameFromModulePath (
						(_urlParts.pathname + 't').slice ((_params.builtPath + '/' + _params.modulesFolder + '/').length),
						true
					).replace (/\./g,'_'),
					_template = Uize.Template.compile (
						this.readFile ({path:_inputs.cssSource}).replace (
							/`([^`]*)`/g,
							function (_match,_cssClass) {return _cssClassPrefix + (_cssClass && '-') + _cssClass}
						),
						{result:'full'}
					)
				;
				Uize.require (_template.required);
				return _template.templateFunction ();
			}
		});
	}
});

