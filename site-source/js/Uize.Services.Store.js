/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.Store Class
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
		The =Uize.Services.Store= module defines a class for a simple key/value store service.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.Store',
	superclass:'Uize.Service',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_true = true
			;

		return _superclass.subclass ({
			serviceMethods:{
				key:{
					async:_false
					/*?
						Instance Methods
							key
								Returns the key of the item at the specified index.

								SYNTAX
								.......................................
								keySTR = storeInstance.key (paramsOBJ);
								.......................................

								Params
									index
										document...
					*/
				},

				getItem:{
					async:_false
					/*?
						Instance Methods
							getItem
								Returns the value for the specified item.

								SYNTAX
								.................................................
								itemValueSTR = storeInstance.getItem (paramsOBJ);
								.................................................

								Params
									key
										document...
					*/
				},

				setItem:{
					async:_false
					/*?
						Instance Methods
							setItem
								document...

								SYNTAX
								..................................
								storeInstance.setItem (paramsOBJ);
								..................................

								Params
									key
										document...

									value
										document...
					*/
				},

				removeItem:{
					async:_false
					/*?
						Instance Methods
							removeItem
								document...

								SYNTAX
								.....................................
								storeInstance.removeItem (paramsOBJ);
								.....................................

								Params
									key
										document...
					*/
				},

				clear:{
					async:_false
					/*?
						Instance Methods
							clear
								document...

								SYNTAX
								................................
								storeInstance.clear (paramsOBJ);
								................................

								Params
									The =clear= method has no parameters.
					*/
				}
			}
		});
	}
});

