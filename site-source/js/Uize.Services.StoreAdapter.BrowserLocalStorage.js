/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.StoreAdapter.BrowserLocalStorage Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Services.StoreAdapter.BrowserLocalStorage= module defines an adapter for the file system service (=Uize.Services.Store=) for the BrowserLocalStorageJS environment.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.StoreAdapter.BrowserLocalStorage',
	superclass:'Uize.Services.StoreAdapter',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Public Instance Methods ***/
			_class.instanceMethods ({
				key:function (_params,_callback) {
				},

				getItem:function (_params,_callback) {
				},

				setItem:function (_params,_callback) {
				},

				removeItem:function (_params,_callback) {
				},

				clear:function (_params,_callback) {
				},

				init:function (_params,_callback) {
					_callback ();
				}
			});

		return _class;
	}
});

