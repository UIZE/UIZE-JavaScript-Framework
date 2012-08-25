/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileSystem Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
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
		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_true = true
			;

		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Public Instance Methods ***/
			_class.declareServiceMethods ({
				readFile:{
					async:_false
					/*?
						Instance Methods
							readFile
								document...

								SYNTAX
								...................................................................................
								fileContentsSTR = fileSystemInstance.readFile (paramsOBJ,callbackFUNC,errbackFUNC);
								...................................................................................

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
				/*
					- more methods to add
						- rename
							- rename one or more files or folders
							- two approaches
								- matcher + transformer
									- value matcher (choosing which paths to rename)
									- value transformer (generate new path)
								- regular expression renaming
									- regular expression
									- replacer expression
								- support general matcher, which can match on all properties of items
									- access permissions
									- modified date
									-
								- different from path matcher, which only gets string value of path to match on
						- copy
							- copy one or more files or folders
						- modify
							- can modify anything about a file
								- can change permissions
								- can delete files
								- can move/rename files
				*/
			});
	}
});

