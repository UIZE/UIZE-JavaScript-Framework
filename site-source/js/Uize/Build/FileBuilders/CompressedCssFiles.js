/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompressedCssFiles Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.CompressedCssFiles= module defines a file builder for the compressed versions of the CSS files of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompressedCssFiles',
	required:'Uize.Str.Has',
	builder:function () {
		'use strict';

		var
			_cssFileExtension = '.css',
			_compressedCssFileExtension = '.min' + _cssFileExtension
		;
		return Uize.package ({
			description:'Compressed CSS files',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'css' &&
					this.isTempUrl (_urlParts.folderPath) &&
					Uize.Str.Has.hasSuffix (_urlParts.file,_compressedCssFileExtension)
				);
			},
			builderInputs:function (_urlParts) {
				return {
					cssFile:
						this.builtUrlFromTempUrl (_urlParts.pathname).slice (0,-_compressedCssFileExtension.length) +
						_cssFileExtension
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.cssFile}).replace(/\/\*.*?\*\//g, '').replace(/[\s\n\r]+/g, ' ');
			}
		});
	}
});

