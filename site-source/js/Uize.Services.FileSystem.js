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
	testCompleteness: 0
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
								document...

								SYNTAX
								........................................
								fileSystemInstance.copyFile (paramsOBJ);
								........................................

								Params
									path
										document...

									targetPath
										document...
					*/
				},

				deleteFile:{
					async:_false
					/*?
						Instance Methods
							deleteFile
								document...

								SYNTAX
								........................................
								fileSystemInstance.copyFile (paramsOBJ);
								........................................

								Params
									path
										document...
					*/
				},

				fileExists:{
					async:_false
					/*?
						Instance Methods
							fileExists
								document...

								SYNTAX
								...........................................................
								fileExistsBOOL = fileSystemInstance.fileExists (paramsOBJ);
								...........................................................

								Params
									path
										document...
					*/
				},

				getFiles:{
					async:_false
					/*?
						Instance Methods
							getFiles
								document...

								SYNTAX
								.........................................................
								filePathsARRAY = fileSystemInstance.getFiles (paramsOBJ);
								.........................................................

								Params
									path
										document...

									pathMatcher
										document...

									pathTransformer
										document...

									recursive
										document...
					*/
				},

				getFolders:{
					async:_false
					/*?
						Instance Methods
							getFolders
								document...

								SYNTAX
								...........................................................
								filePathsARRAY = fileSystemInstance.getFolders (paramsOBJ);
								...........................................................

								Params
									path
										document...

									pathMatcher
										document...

									pathTransformer
										document...
					*/
				},

				getModifiedDate:{
					async:_false
					/*?
						Instance Methods
							getModifiedDate
								document...

								SYNTAX
								.................................................................
								modifiedDateOBJ = fileSystemInstance.getModifiedDate (paramsOBJ);
								.................................................................

								Params
									path
										document...
					*/
				},

				readFile:{
					async:_false
					/*?
						Instance Methods
							readFile
								document...

								SYNTAX
								..........................................................
								fileContentsSTR = fileSystemInstance.readFile (paramsOBJ);
								..........................................................

								Params
									path
										document...
					*/
				},

				pathExists:{
					async:_false
					/*?
						Instance Methods
							pathExists
								document...

								SYNTAX
								...........................................................
								pathExistsBOOL = fileSystemInstance.pathExists (paramsOBJ);
								...........................................................

								Params
									path
										document...
					*/
				},

				writeFile:{
					async:_false
					/*?
						Instance Methods
							writeFile
								document...

								SYNTAX
								.........................................
								fileSystemInstance.writeFile (paramsOBJ);
								.........................................

								Params
									path
										document...

									contents
										document...
					*/
				},

				init:{
					async:_false
					/*?
						Instance Methods
							init
								document...
					*/
				}
			}
		});
	}
});

