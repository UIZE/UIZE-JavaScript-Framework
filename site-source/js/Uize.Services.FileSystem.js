/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystem Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Services.FileSystem= module defines a class for a file system service.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileSystem',
	superclass:'Uize.Service',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_true = true
			;

		return _superclass.subclass ({
			serviceMethods:{
				copyFile:{
					async:_false
					/*?
						Instance Methods
							copyFile
								.

								SYNTAX
								........................................
								fileSystemInstance.copyFile (paramsOBJ);
								........................................

								Params
									path
										.

									targetPath
										.
					*/
				},

				deleteFile:{
					async:_false
					/*?
						Instance Methods
							deleteFile
								.

								SYNTAX
								........................................
								fileSystemInstance.copyFile (paramsOBJ);
								........................................

								Params
									path
										.
					*/
				},

				fileExists:{
					async:_false
					/*?
						Instance Methods
							fileExists
								.

								SYNTAX
								...........................................................
								fileExistsBOOL = fileSystemInstance.fileExists (paramsOBJ);
								...........................................................

								Params
									path
										.
					*/
				},

				getFiles:{
					async:_false
					/*?
						Instance Methods
							getFiles
								.

								SYNTAX
								.........................................................
								filePathsARRAY = fileSystemInstance.getFiles (paramsOBJ);
								.........................................................

								Params
									path
										.

									pathMatcher
										.

									pathTransformer
										.

									recursive
										.
					*/
				},

				getFolders:{
					async:_false
					/*?
						Instance Methods
							getFolders
								.

								SYNTAX
								...........................................................
								filePathsARRAY = fileSystemInstance.getFolders (paramsOBJ);
								...........................................................

								Params
									path
										.

									pathMatcher
										.

									pathTransformer
										.
					*/
				},

				getModifiedDate:{
					async:_false
					/*?
						Instance Methods
							getModifiedDate
								.

								SYNTAX
								.................................................................
								modifiedDateOBJ = fileSystemInstance.getModifiedDate (paramsOBJ);
								.................................................................

								Params
									path
										.
					*/
				},

				readFile:{
					async:_false
					/*?
						Instance Methods
							readFile
								.

								SYNTAX
								..........................................................
								fileContentsSTR = fileSystemInstance.readFile (paramsOBJ);
								..........................................................

								Params
									path
										.
					*/
				},

				pathExists:{
					async:_false
					/*?
						Instance Methods
							pathExists
								.

								SYNTAX
								...........................................................
								pathExistsBOOL = fileSystemInstance.pathExists (paramsOBJ);
								...........................................................

								Params
									path
										.
					*/
				},

				writeFile:{
					async:_false
					/*?
						Instance Methods
							writeFile
								.

								SYNTAX
								.........................................
								fileSystemInstance.writeFile (paramsOBJ);
								.........................................

								Params
									path
										.

									contents
										.
					*/
				},

				init:{
					async:_false
					/*?
						Instance Methods
							init
								.
					*/
				}
			}
		});
	}
});

