/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledWidgetHtmltModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.CompiledWidgetHtmltModules= module defines a file builder for widget HTML template (=.htmlt=) modules.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledWidgetHtmltModules',
	required:[
		'Uize.Build.Util',
		'Uize.Widget.HtmltCompiler',
		'Uize.Str.Lines'
	],
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _sourceUrlFromTempUrl (m,_pathname) {
				return m.sourceUrlFromTempUrl (_pathname).replace (/\.js$/,'.htmlt');
			}

		return Uize.package ({
			description:'Compiled widget HTML template modules, generated from source .htmlt files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_pathname) &&
					this.fileExists ({path:_sourceUrlFromTempUrl (this,_pathname)})
				);
			},
			builderInputs:function (_urlParts) {
				return {source:_sourceUrlFromTempUrl (this,_urlParts.pathname)};
			},
			builder:function (_inputs,_urlParts) {
				var
					m = this,
					_params = m.params,
					_moduleName = Uize.Build.Util.moduleNameFromModulePath (
						_urlParts.pathname
							.slice ((_params.tempPath + '/' + _params.modulesFolder + '/').length)
							.replace (/\.js$/i,'')
					),
					_result
				;
				Uize.require (
					_moduleName.replace (/\.Html$/,'.Widget'),
					function (_widgetClass) {
						var _compiledTemplate = Uize.Widget.HtmltCompiler.compile (
							m.readFile ({path:_inputs.source}),
							{
								widgetClass:_widgetClass,
								result:'full'
							}
						);

						_result = Uize.Build.Util.moduleAsText ({
							name:_moduleName,
							required:_compiledTemplate.required,
							builder:[
								'function () {',
								'	\'use strict\';',
								'',
								'	return Uize.package ({',
								'		process:function (i) {',
								Uize.Str.Lines.indent (_compiledTemplate.code,3),
								'		}',
								'	});',
								'}'
							].join ('\n')
						});
					}
				);

				return _result;
			}
		});
	}
});

