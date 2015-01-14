/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledSimpleDataModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.CompiledSimpleDataModules= module defines a file builder for data modules compiled from =.simpledata= files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledSimpleDataModules',
	required:'Uize.Build.Util',
	builder:function () {
		'use strict';

		/*** Private Instance Methods ***/
			function _getSourceFilePath (m,_pathname) {
				return m.sourceUrlFromTempUrl (_pathname).replace (/\.js$/,'.simpledata');
			}

		return Uize.package ({
			description:'Compiled data modules, generated from .simpledata files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_pathname) &&
					this.fileExists ({path:_getSourceFilePath (this,_pathname)})
				);
			},
			builderInputs:function (_urlParts) {
				return {source:_getSourceFilePath (this,_urlParts.pathname)};
			},
			builder:function (_inputs,_urlParts) {
				var _params = this.params;
				return Uize.Build.Util.dataAsModule (
					Uize.Build.Util.moduleNameFromModulePath (
						_urlParts.pathname.slice ((_params.tempPath + '/' + _params.modulesFolder + '/').length),
						true
					),
					Uize.Build.Util.readSimpleDataFile (_inputs.source)
				);
			}
		});
	}
});

