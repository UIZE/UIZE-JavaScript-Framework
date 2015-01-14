/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledCssModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		The =Uize.Build.FileBuilders.CompiledCssModules= module defines a file builder for CSS modules compiled from built =.css= files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledCssModules',
	required:[
		'Uize.Build.Util',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			description:'Compiled CSS modules, generated from built .css files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_pathname) &&
					this.fileExists ({path:this.sourceUrlFromTempUrl (_pathname).replace (/\.js$/,'.csst')})
				);
			},
			builderInputs:function (_urlParts) {
				return {source:_urlParts.pathname.replace (/\.js$/,'.min.css')};
			},
			builder:function (_inputs,_urlParts) {
				var
					_params = this.params,
					_moduleName = Uize.Build.Util.moduleNameFromModulePath (
						_urlParts.pathname
							.slice ((_params.tempPath + '/' + _params.modulesFolder + '/').length)
							.replace (/\.js$/i,'')
					)
				;

				return Uize.Build.Util.moduleAsText ({
					name:_moduleName,
					superclass:'Uize.Dom.CssModule',
					builder:[
						'function (_superclass) {',
						'	\'use strict\';',
						'',
						'	return _superclass.subclass ({',
						'		staticProperties:{',
						'			css:function (_input) {',
						'				' +
							'return ' +
								Uize.Json.to (this.readFile ({path:_inputs.source}))
									.replace (
										/(url\s*\(\s*)([\'"]?)([^\'"\)]+)\2(\s*\))/g,
										function (_match,_open,_quote,_path,_close) {
											return (
												_open + _quote +
													(
														/^\w+:/.test (_path)
															? ''
															: (
																'\' + _input.pathToModules + \'' +
																Uize.modulePathResolver (_moduleName) + '/'
															)
													) +
													_path +
												_quote + _close
											);
										}
									) +
							';',
						'			}',
						'		}',
						'	});',
						'}'
					].join ('\n')
				});
			}
		});
	}
});

