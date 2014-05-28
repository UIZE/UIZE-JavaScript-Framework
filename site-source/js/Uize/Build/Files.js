/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Files Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Files= module implements a base class that can be subclassed to create build script modules for building different types of files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Files',
	superclass:'Uize.Class',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Services.FileBuilder'
	],
	builder:function (_superclass) {
		'use strict';

		var _undefined;

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					this.addFiles (_params.files.split (','));
				},

				addFiles:function (_files) {
					Uize.push (
						this.filesToBuild,
						arguments.length == 1 && Uize.isArray (_files) ? _files : arguments
					);
				},

				perform:function (_params) {
					var
						m = this,
						_fileSystem = m.fileSystem = Uize.Services.FileSystem.singleton (),
						_filesToBuild = m.filesToBuild = []
					;
					m.fileBuilder = Uize.Services.FileBuilder.singleton ();
					m.determineFilesToBuild (_params);
					_fileSystem.writeFile ({
						path:_params.logFilePath,
						contents:m.fileBuilder.buildFile (Uize.copyInto ({url:_filesToBuild},_params))
					});
				}
			},

			staticProperties:{
				fileSystem:_undefined,
				fileBuilder:_undefined
			}
		});
	}
});

