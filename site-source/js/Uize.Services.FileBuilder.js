/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileBuilder Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Services.FileBuilder= module defines a class for a file builder service.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileBuilder',
	superclass:'Uize.Service',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _false = false;

		return _superclass.subclass ({
			serviceMethods:{
				buildFile:{
					async:_false
					/*?
						Instance Methods
							buildFile
								SYNTAX
								..........................................
								fileBuilderInstance.buildFile (paramsOBJ);
								..........................................

								Parameters
									url
										A string, specifying the URL, relative to the built path, of the file that should be built.

									sourcePath
										A string, specifying the folder path for the site's source code.

									tempPath
										A string, specifying the folder path for temporary files created while building files for the site.

									builtPath
										A string, specifying the folder path for the built files of the site.

									staleBefore
										.

									isDev
										.
					*/
				},

				init:{
					async:_false
					/*?
						Instance Methods
							init
								.

								SYNTAX
								.....................................
								fileBuilderInstance.init (paramsOBJ);
								.....................................

								Params
									.
					*/
				}
			}
		});
	}
});

