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
		'use strict';

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
								Returns a string, being the key of the item at the specified index.

								SYNTAX
								.......................................
								keySTR = storeInstance.key (paramsOBJ);
								.......................................

								Params
									The =key= service method supports the following parameters...

									index
										A number, specifying the item for which the key should be determined.

										If no item exists at the specified index, then this method will return the value =null= and will not produce any errors.

								NOTES
								- this service method is synchronous
					*/
				},

				getItem:{
					async:_false
					/*?
						Instance Methods
							getItem
								Returns a string, being the value for the item with the specified key.

								SYNTAX
								.................................................
								itemValueSTR = storeInstance.getItem (paramsOBJ);
								.................................................

								Params
									The =getItem= service method supports the following parameters...

									key
										A string, specifying the key of the item whose value should be returned.

										If no item with the specified key exists, then this method will return the value =undefined= and will not produce any errors.

								NOTES
								- this service method is synchronous
					*/
				},

				setItem:{
					async:_false
					/*?
						Instance Methods
							setItem
								Lets you set the item with the specified key to the specified value.

								SYNTAX
								..................................
								storeInstance.setItem (paramsOBJ);
								..................................

								Params
									The =setItem= service method supports the following parameters...

									key
										A string, specifying the key of the item whose value should be set.

										If an item with the specified key already exists, its value will be set to the new value specified in the =value= parameter. If not item with the specified key exists, it will be created.

									value
										A string, specifying the value that the item should be set to.

								NOTES
								- this service method is synchronous
					*/
				},

				removeItem:{
					async:_false
					/*?
						Instance Methods
							removeItem
								Lets you remove the item with the specified key.

								SYNTAX
								.....................................
								storeInstance.removeItem (paramsOBJ);
								.....................................

								Params
									The =removeItem= service method supports the following parameters...

									key
										A string, specifying the key of the item that should be removed.

										If no item with the specified key exists, then this method will do nothing - it will not produce any errors.

								NOTES
								- this service method is synchronous
					*/
				},

				clear:{
					async:_false
					/*?
						Instance Methods
							clear
								Lets you clear the entire store, removing all items.

								SYNTAX
								.......................
								storeInstance.clear ();
								.......................

								Params
									The =clear= service method has no parameters.

								NOTES
								- this service method is synchronous
					*/
				}
			}
		});
	}
});

