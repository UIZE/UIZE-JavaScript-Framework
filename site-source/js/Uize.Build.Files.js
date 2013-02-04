/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Files Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
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

		var
			_Array_prototype_push = [].push,
			_undefined
		;

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					throw "You must override this method";
				},

				addFiles:function (_files) {
					_Array_prototype_push.apply (
						this.filesToBuild,
						arguments.length == 1 && Uize.isArray (_files) ? _files : arguments
					);
				},

				perform:function (_params) {
					var
						_this = this,
						_fileSystem = _this.fileSystem = Uize.Services.FileSystem.singleton (),
						_filesToBuild = _this.filesToBuild = []
					;
					_this.fileBuilder = Uize.Services.FileBuilder.singleton ();
					_this.determineFilesToBuild (_params);
					_fileSystem.writeFile ({
						path:_params.logFilePath,
						contents:_this.fileBuilder.buildFile (Uize.copyInto ({url:_filesToBuild},_params))
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

