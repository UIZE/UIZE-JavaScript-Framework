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
				_undefined,
				_false = false,
				_true = true
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_class.declareServiceMethods ({
				readFile:{
					async:_false
					/*?
						Instance Methods
							readFile
								document...
					*/
				},
				writeFile:{
					async:_true
					/*?
						Instance Methods
							writeFile
								document...
					*/
				}
			});
	}
});

